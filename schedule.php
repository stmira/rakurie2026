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