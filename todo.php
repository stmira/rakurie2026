<!-- ヘッダーの読み込み -->
<?php $currentPage = 'todo'; ?>
<?php require 'header.php'; ?>
<!-- データベース接続 -->
<?php require 'config/database.php'; ?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">
<!-- todo.htmlの読み込み -->
<?php require 'html/todo.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/todo-testdata.js"></script>
<script src="js/todo.js"></script>