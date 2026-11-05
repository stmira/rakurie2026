<!-- ヘッダーの読み込み -->
<?php $currentPage = 'schedule-entry'; ?>
<?php require 'header.php'; ?>

<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/schedule-entry.css">

<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ヘッダーの読み込み（header.php の $navItems のキーと同じ値にする） -->
<!-- 工程表情報登録画面 -->
<?php require 'html/schedule-entry.html'; ?>
<!-- PHPファイル側でJavaScriptを読み込む場合 -->
<script src="js/schedule-entry.js"></script>