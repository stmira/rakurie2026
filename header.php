<!-- データベース接続 -->
<?php require 'config/database.php'; ?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<link rel="stylesheet" href="css/style.css">
<?php
// ============================================================
// 共通ヘッダー（全画面で使う部品）
// 各画面の <body> の直後で、現在のページ名を決めてから読み込む
//
// <?php $currentPage = 'schedule'; 
// <?php require __DIR__ . '/header.php'; 
//
// $currentPage に入れた値と一致するメニューが「選択中」になります。
// ============================================================

// 現在のページ（未指定のときは何も選択しない）
$currentPage = $currentPage ?? '';

// メニュー（key => [表示名, 移動先]）
$navItems = [
    'todo'          => ['今日のタスク',   'todo.php'],
    'schedule'       => ['工程表',         'schedule.php'],
    'reference'      => ['早見表',         'reference.php'],
    'customer'       => ['お客様情報登録', 'customer.php'],
    'shedule-entry'  => ['工程表情報登録', 'shedule-entry.php'],
    'employee'       => ['社員情報',       'employee.php'],
    ];

    // ログイン中のユーザー（本番はセッションやDBから取得）
    $user = ['name' => 'Oさん', 'role' => '管理者']; //ここでdbから名前をとる
    ?>
<?php require 'html/header.html'; ?>
<!-- 通知画面読み込み -->
<?php require 'notification.php'; ?>