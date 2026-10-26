<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/employee.js"></script>
<?php
// 社員情報画面。ヘッダーは header.php(共通部品)を読み込みます。
// ※ DB接続は employees_api.php(db.php)側で行うため、ここでは読み込みません。

// header.php の $navItems のキーと同じ値にすると、社員情報タブが選択状態になります
$currentPage = 'employee';

// ファイルの置き場所。フォルダ構成が違う場合は、ここだけ書き換えてください
// (例: 'css' => 'css/employees.css', 'js' => 'js/employees.js', 'api' => 'api/employees_api.php')
$paths = [
    'common_css' => 'common.css',
    'css'        => 'css/style.css',     // ← 「css/」を追加する
    'js'         => 'js/employee.js',    // ← 「js/」を追加する
    'api'        => 'employees_api.php', // ← そのままでOK
];

// 更新がすぐ反映されるよう、ファイルの更新日時を付ける(ファイルが無くてもエラーにしない)
function asset(string $path): string
{
    $full = __DIR__ . '/' . $path;
    return htmlspecialchars($path, ENT_QUOTES, 'UTF-8') . (is_file($full) ? '?v=' . filemtime($full) : '');
}

// ---- 社員一覧をDBから取得(ページを開いた時点で表示するため、PHP側で取得します) ----
// config/database.php を読み込むと、$pdo と $errorMessage が使えるようになります
require __DIR__ . '/config/database.php';

$debug = true;   // 開発中は true(取得エラーの詳細を表示)。本番では false にしてください

$employees = [];
$loadError = '';
try {
    if (!($pdo instanceof PDO)) {
        throw new RuntimeException($errorMessage !== '' ? $errorMessage : 'データベースに接続できません。');
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // password_hash は画面に出さないため SELECT しない
    $stmt = $pdo->query(
        'SELECT employee_id, employee_name, department_name, email
          FROM employees
          ORDER BY employee_id ASC'
    );
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    error_log($e->getMessage());
    $loadError = '社員一覧を取得できませんでした。' . ($debug ? "\n" . $e->getMessage() : '');
}

/** HTML表示用のエスケープ */
function esc($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>社員情報 | 楽ラック</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= asset($paths['common_css']) ?>">
  <link rel="stylesheet" href="<?= asset($paths['css']) ?>">
</head>
<body>

  <?php require __DIR__ . '/header.php'; ?>

  <main class="emp-page">
    <h1 class="emp-title">社員情報</h1>

    <div class="emp-layout">

      <!-- ===== 左:社員一覧 ===== -->
      <section class="card list-card" aria-labelledby="listTitle">
        <div class="card-head">
          <h2 id="listTitle">社員一覧</h2>
          <div class="head-actions">
            <button type="button" class="btn btn-ghost" id="btnCancelEdit" hidden>キャンセル</button>
            <button type="button" class="btn btn-outline" id="btnEdit">
              <span class="btn-icon" id="btnEditIcon"></span><span id="btnEditLabel">編集</span>
            </button>
            <button type="button" class="btn btn-primary" id="btnAdd" aria-expanded="false" aria-controls="regPanel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              追加
            </button>
          </div>
        </div>

        <p class="list-message" id="listMessage" role="alert" hidden></p>

        <div class="table-wrap">
          <table class="emp-table">
            <thead>
              <tr>
                <th class="col-id">社員ID</th>
                <th class="col-name">氏名</th>
                <th class="col-dept">部署</th>
                <th class="col-pw">パスワード</th>
                <th class="col-email">メールアドレス</th>
                <th class="col-op">操作</th>
              </tr>
            </thead>
            <tbody id="empBody">
              <?php if ($loadError !== ''): ?>
                <tr><td colspan="6" class="empty"><?= esc($loadError) ?></td></tr>
                <?php elseif (!$employees): ?>
                <tr><td colspan="6" class="empty">社員が登録されていません。</td></tr>
              <?php else: foreach ($employees as $emp): ?>
                <tr>
                  <td><?= esc($emp['employee_id']) ?></td>
                  <td><?= esc($emp['employee_name']) ?></td>
                  <td><?= esc($emp['department_name']) ?></td>
                  <td><span class="mask">••••••••</span></td>
                  <td title="<?= esc($emp['email']) ?>"><?= esc($emp['email']) ?></td>
                  <td>
                    <button type="button" class="row-btn" aria-label="<?= esc($emp['employee_name']) ?>を編集">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/></svg>編集
                    </button>
                  </td>
                </tr>
              <?php endforeach; endif; ?>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ===== 右:社員登録 ===== -->
      <section class="card reg-card" id="regPanel" aria-labelledby="regTitle" hidden>
        <div class="reg-head">
          <div class="reg-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
          </div>
          <div>
            <h2 id="regTitle">社員登録</h2>
            <p>新しい社員のアカウントを作成します。</p>
          </div>
        </div>

        <form id="regForm" novalidate>
          <div class="reg-body">
            <div class="reg-intro">
              <span>社員情報を入力してください。</span>
              <span class="req-note"><em>必須</em> は入力必須</span>
            </div>

            <div class="field" data-field="employee_name">
              <label for="fName">氏名 <em class="req">必須</em></label>
              <input type="text" id="fName" maxlength="50" placeholder="例：山田 太郎" autocomplete="off">
              <p class="field-error" hidden></p>
            </div>

            <div class="field" data-field="employee_id">
              <label for="fId">社員ID <em class="req">必須</em></label>
              <input type="text" id="fId" inputmode="numeric" maxlength="10" placeholder="例：1009" autocomplete="off">
              <p class="field-error" hidden></p>
            </div>

            <div class="field" data-field="department_name">
              <label for="fDept">部署 <em class="req">必須</em></label>
              <select id="fDept">
                <option value="" selected disabled>部署を選択してください</option>
                <option value="生産部">生産部</option>
                <option value="営業部">営業部</option>
              </select>
              <p class="field-error" hidden></p>
            </div>

            <div class="field" data-field="password">
              <label for="fPw">初期パスワード <em class="req">必須</em></label>
              <div class="pw-wrap">
                <input type="password" id="fPw" placeholder="8文字以上の英数字" autocomplete="new-password">
                <button type="button" class="pw-toggle" id="fPwToggle" aria-label="パスワードを表示する">
                  <svg class="i-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a17.6 17.6 0 0 1-2.16 3.19"/><path d="M6.61 6.61A17.3 17.3 0 0 0 2 12s3 8 10 8a9.7 9.7 0 0 0 5.39-1.61"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  <svg class="i-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <p class="hint">初回ログイン時に、本人による変更が必要です。</p>
              <p class="field-error" hidden></p>
            </div>
 
            <div class="field" data-field="email">
              <label for="fEmail">メールアドレス <em class="req">必須</em></label>
              <input type="email" id="fEmail" maxlength="255" placeholder="例：yamada@example.jp" autocomplete="off">
              <p class="field-error" hidden></p>
            </div>
 
            <p class="form-error" id="formError" role="alert" hidden></p>
          </div>
 
          <div class="reg-foot">
            <button type="button" class="btn btn-outline btn-lg" id="btnReset">キャンセル</button>
            <button type="submit" class="btn btn-primary btn-lg" id="btnRegister">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              登録する
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
 
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
 
  <script>window.EMP_API = <?= json_encode($paths['api']) ?>;</script>
  <!-- ページを開いた時点の社員一覧(JavaScriptはこれを使って編集機能を有効にします) -->
  <script type="application/json" id="empData"><?= json_encode(
      ['employees' => $employees, 'error' => $loadError],
      JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
  ) ?></script>
  <script src="<?= asset($paths['js']) ?>"></script>
</body>
</html>