<!-- セッションstart -->
<?php session_start();?>
<!-- データベース接続 -->
<?php require 'config/database.php'; ?>
<!-- CSSはHTMLのlinkタグで読み込む -->
<!-- <link rel="stylesheet" href="css/style.css"> -->
<link rel="stylesheet" href="css/header.css">
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
    // 'customer'       => ['お客様情報登録', 'customer.php'],
    // 'schedule-entry'  => ['工程表情報登録', 'schedule-entry.php'],
    // 'employee'       => ['社員情報',       'employee.php'],
    ];

$administrator_navItems = [
    'todo'          => ['今日のタスク',   'todo.php'],
    'schedule'       => ['工程表',         'schedule.php'],
    'reference'      => ['早見表',         'reference.php'],
    'customer'       => ['お客様情報登録', 'customer.php'],
    'schedule-entry'  => ['工程表情報登録', 'schedule-entry.php'],
    'employee'       => ['社員情報',       'employee.php'],
];

    // ログイン中のユーザー（本番はセッションやDBから取得）
    // $user = ['name' => 'Oさん', 'role' => '管理者']; //ここでdbから名前をとる
    //もし、セッションにデータがあったら(ログインに成功している)
    if (isset($_SESSION['employee'])) {
        $user = [
            'name' => $_SESSION['employee']['name'], 
            'role' => $_SESSION['employee'] ['department_name']// ※必要に応じてここもDBの値に書き換えるとより柔軟になります
        ];
    }else{
        echo "データが取得できていない";//このelseにいってしまう
    }
    // ---(デバッグをしやすくするため)最前面に黒いボックスで強制表示 ---
    // echo '<div style="position:fixed; top:10px; left:10px; z-index:999999; background:rgba(0,0,0,0.9); color:#fff; padding:20px; border-radius:5px; max-height:80vh; overflow:auto; font-family:monospace; font-size:14px;">';
    // echo '<strong style="color:#00ff00;">▼ SESSION DATA ▼</strong><br><pre style="color:#fff; background:none; border:none; margin:10px 0 0 0;">';
    // var_dump($_POST['password']);//何も表示されていない
    // echo '</pre></div>';
    ?>
<?php require 'html/header.html'; ?>

<!-- 通知画面読み込み -->
<?php require 'notification.php'; ?>