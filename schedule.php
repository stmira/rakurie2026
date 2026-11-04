<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ヘッダーの読み込み -->
<?php $currentPage = 'schedule'; ?>
<?php require 'header.php'; ?>
<!-- データベース接続 -->
<?php require 'config/database.php'; ?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">
<!-- 通知画面を接続 -->
<?php require 'html/schedule.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/schedule.js"></script>

<?php
$pdo = new PDO(
    'mysql:host=localhost;dbname=rakurakku;charset=utf8mb4',
    'root', '',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

require __DIR__ . '/../db.php';
header('Content-Type: application/json; charset=utf-8');