<meta name="viewport" content="width=device-width, initial-scale=1">
<?php 
$currentPage = 'schedule';
require __DIR__ . '/header.php';
?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/schedule.css">
<!-- 通知画面を接続 -->
<?php require __DIR__ . '/html/schedule.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/schedule.js"></script>