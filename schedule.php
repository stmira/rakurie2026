<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ヘッダーの読み込み -->
<?php $currentPage = 'schedule'; ?>
<?php require 'header.php'; 

if (!$pdo) {
    die("DB接続失敗:". htmlspecialchars($errorMessage,ENT_QUOTES, 'UTF-8'));
}
$stmt = $pdo->prepare("SELECT * FROM tasks");
$stmt->execute();

$tasks = $stmt->fetchALL(PDO::FETCH_ASSOC);
?>

<!-- データベース接続 -->
<?php require 'config/database.php'; 
?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<!-- <link rel="stylesheet" href="css/style.css"> -->
<link rel="stylesheet" href="css/schedule.css">
<!-- 通知画面を接続 -->
<?php require 'html/schedule.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/schedule.js"></script>
<?php
require __DIR__ . '/../db.php';
header('Content-Type: application/json; charset=utf-8');
?>