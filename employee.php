<!-- お客様情報登録画面について -->

<!-- ヘッダーの読み込み -->
<?php $currentPage = 'customer'; ?>
<?php require 'header.php'; ?>
<!-- データベース接続 -->
<?php require 'config/database.php'; ?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">
<?php require 'html/employee.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/employee.js"></script>