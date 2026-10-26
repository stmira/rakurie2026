<?php
declare(strict_types=1);

/**
 * employees API
 *   GET  ?action=list  … 社員一覧(SELECT)
 *   POST action=save   … 新規登録(INSERT)/ 更新(UPDATE)をまとめて処理
 *
 * ※ 本番では、管理者のみ実行できるようログイン確認(セッション)と CSRF 対策を追加してください。
 */

// PHPの警告・通知がJSONの先頭に混ざると、画面側で読み取れなくなるため出力しない
ini_set('display_errors', '0');

// 既存のDB接続(config/database.php)をそのまま使います。$pdo と $errorMessage が定義されます。
// フォルダ構成が違う場合は、この1行のパスだけ変更してください。
require __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const DEPARTMENTS = ['生産部', '営業部'];

// 開発中は true(エラーの詳細を画面に表示)。本番では必ず false にしてください
const DEBUG = true;

/** 文字数(mbstring拡張が無い環境でも動くようにしています) */
function charLength(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : (int)preg_match_all('/./su', $s);
}

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** 入力チェック。エラーがあれば [フィールド名 => メッセージ] を返す */
function validateRow(array $r, bool $isNew): array
{
    $e = [];

    $id = trim((string)($r['employee_id'] ?? ''));
    if ($id === '' || !ctype_digit($id) || (int)$id < 1 || (int)$id > 2147483647) {
        $e['employee_id'] = '社員IDは半角数字で入力してください。';
    }

    $name = trim((string)($r['employee_name'] ?? ''));
    if ($name === '' || charLength($name) > 50) {
        $e['employee_name'] = '氏名は50文字以内で入力してください。';
    }

    if (!in_array($r['department_name'] ?? '', DEPARTMENTS, true)) {
        $e['department_name'] = '部署を選択してください。';
    }

    $email = trim((string)($r['email'] ?? ''));
    if ($email === '' || strlen($email) > 255 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $e['email'] = 'メールアドレスを正しい形式で入力してください。';
    }

    $pw = (string)($r['password'] ?? '');
    if ($isNew || $pw !== '') {
        if (!preg_match('/^[A-Za-z0-9]{8,}$/', $pw) || !preg_match('/[A-Z]/', $pw) || !preg_match('/[a-z]/', $pw)) {
            $e['password'] = 'パスワードは半角英数字８文字以上で、大文字・小文字を各１文字以上含めてください。';
        }
    }
    return $e;
}

try {
    // database.php で接続に失敗した場合は、その理由をそのままエラーにする
    if (!($pdo instanceof PDO)) {
        throw new RuntimeException($errorMessage !== '' ? $errorMessage : 'データベースに接続できません。');
    }
    // database.php では指定されていない設定を、このAPI用に補う
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);        // エラーを例外にする
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);   // 結果を「列名 => 値」の形にする
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $method = $_SERVER['REQUEST_METHOD'];

    // ===== 一覧取得 =====
    if ($method === 'GET') {
        if (($_GET['action'] ?? '') !== 'list') {
            respond(400, ['message' => '不正なリクエストです。']);
        }
        // password_hash は画面に出さないため SELECT しない
        $stmt = $pdo->query(
            'SELECT employee_id, employee_name, department_name, email
               FROM employees
              ORDER BY employee_id ASC'
        );
        respond(200, ['employees' => $stmt->fetchAll()]);
    }

    // ===== 登録・更新 =====
    if ($method === 'POST') {
        $input = json_decode((string)file_get_contents('php://input'), true);
        if (!is_array($input) || ($input['action'] ?? '') !== 'save' || !is_array($input['rows'] ?? null)) {
            respond(400, ['message' => '不正なリクエストです。']);
        }

        // まず全行を検証
        $errors = [];
        foreach ($input['rows'] as $i => $r) {
            if (!is_array($r)) {
                respond(400, ['message' => '不正なリクエストです。']);
            }
            $fieldErrors = validateRow($r, !empty($r['is_new']));
            foreach ($fieldErrors as $field => $msg) {
                $errors[] = ['row' => $i, 'employee_id' => $r['employee_id'] ?? '', 'field' => $field, 'message' => $msg];
            }
        }
        if ($errors) {
            respond(422, ['message' => '入力内容に誤りがあります。', 'errors' => $errors]);
        }

        $insert = $pdo->prepare(
            'INSERT INTO employees (employee_id, employee_name, password_hash, email, department_name)
             VALUES (:id, :name, :hash, :email, :dept)'
        );
        $updateBase = 'UPDATE employees SET employee_name = :name, email = :email, department_name = :dept';

        $pdo->beginTransaction();
        try {
            foreach ($input['rows'] as $r) {
                $params = [
                    ':id'    => (int)$r['employee_id'],
                    ':name'  => trim($r['employee_name']),
                    ':email' => trim($r['email']),
                    ':dept'  => $r['department_name'],
                ];
                $pw = (string)($r['password'] ?? '');

                if (!empty($r['is_new'])) {
                    $insert->execute($params + [':hash' => password_hash($pw, PASSWORD_DEFAULT)]);
                } else {
                    // 社員ID(主キー)は orders / schedules から参照されるため変更しない
                    if ($pw !== '') {
                        $stmt = $pdo->prepare($updateBase . ', password_hash = :hash WHERE employee_id = :id');
                        $stmt->execute($params + [':hash' => password_hash($pw, PASSWORD_DEFAULT)]);
                    } else {
                        $stmt = $pdo->prepare($updateBase . ' WHERE employee_id = :id');
                        $stmt->execute($params);
                    }
                }
            }
            $pdo->commit();
        } catch (PDOException $ex) {
            $pdo->rollBack();
            if ($ex->getCode() === '23000') { // 主キー重複
                respond(409, ['message' => 'その社員IDは既に登録されています。']);
            }
            throw $ex;
        }
        respond(200, ['ok' => true]);
    }

    respond(405, ['message' => '許可されていないメソッドです。']);
} catch (Throwable $e) {
    error_log($e->getMessage());
    respond(500, ['message' => 'サーバーでエラーが発生しました。時間をおいて再度お試しください。']
        + (DEBUG ? ['detail' => $e->getMessage()] : []));
}
