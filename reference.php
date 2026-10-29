<!-- ヘッダーの読み込み -->
<?php $currentPage = 'reference'; ?>
<?php require 'header.php'; ?>

<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">

<!-- データベース接続 -->
<?php require 'config/database.php'; ?>

<!-- 早見表画面の読み込み -->
<?php require 'html/reference.html'; ?>

<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/reference.js"></script>