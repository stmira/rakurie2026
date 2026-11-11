<?php
// json形式でデータを受け取る
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['order_id']) || !isset($input['column']) || !array_key_exists('value', $input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
    exit;
}

$order_id = $input['order_id'];
$column = $input['column'];
$value = $input['value'];

// sqlインジェクション
$allowed_columns = [
    'ship_status', 'drawing', 'post_l', 'post_t', 'base', 'arm',
    'angle', 'a_base', 'other_1', 'other_2', 'other_3', 'other_4',
    'other_5', 'brace', 'double_check', 'small_item', 'small_double_check', 'production'
];

// カラム名が不正でないかチェック
if (!in_array($column, $allowed_columns, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid column name']);
    exit;
}

try {
    // データベース接続
    require '../config/database.php';
    /** @var PDO $pdo **/

    $sql = "update orders set {$column} = :val where order_id = :order_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':val', $value === '' ? null : $value, $value === '' ? PDO::PARAM_NULL : PDO::PARAM_STR);
    $stmt->bindValue(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>