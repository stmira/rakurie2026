<!-- セッションstart -->
<?php session_start();?>
<!-- データベース接続 -->
<!-- 一度上の階層に戻ってから、config/database.php を読み込む -->
<?php require_once 'config/database.php';?>
<!-- html/css/jsの読み込み -->
<?php require 'html/index.html'; ?>
<link rel="stylesheet" href="css/index.css">
<script src="js/index.js"></script>

<!-- ログインのロジック 
　　　この1ページで完結できるようにしたい
    employee_idを取得して該当のidがあれば、ログインすることができるよ
-->

<?php
unset($_SESSION["employee"]);

//DBからpassword_hashカラムを全部配列(password_hash配列)に代入する
$password_hash[] = "";//初期化
$sql = $dsn->query("select password_hash from employees");//password_hashカラムのみ取得する
//取得したpassword_hashのデータがある限り全て取得する
while($sql){
	$password_hash[]=$sql;
}

//index.htmlに入力してもらったpasswordを受け取る
$password = $_REQUEST['password'];

// パスワードを認証する実行をコードをsqlに代入する
// $sql = $dsn->prepare("select * from employees where password_hash=?");
//ここで、ユーザーが入力したパスワードと、DBに保存されているハッシュ値を照合します。
//後々、ハッシュ化するしたパスワードと照合できるようにする為のコード
foreach($password_hash as $hash){
	//passwordが、一致したらsqlを実行する
	if(password_verify($password,$hash)){
		// $sql->execute([$_REQUEST['password']]);
        header('todo.php');
        exit;
	}
}

//employeeを取得する為のsqlを書く
$sql = $dsn->query("select * from employees");
foreach ($sql as $row) {
    $_SESSION['employee'] = [
        'id'       => $row['employeeId'], 
        'name'     => $row['name'], 
        'password' => $row['password']
    ];
}

// ---最前面に黒いボックスで強制表示 ---
echo '<div style="position:fixed; top:10px; left:10px; z-index:999999; background:rgba(0,0,0,0.9); color:#fff; padding:20px; border-radius:5px; max-height:80vh; overflow:auto; font-family:monospace; font-size:14px;">';
echo '<strong style="color:#00ff00;">▼ SESSION DATA ▼</strong><br><pre style="color:#fff; background:none; border:none; margin:10px 0 0 0;">';
var_dump($_SESSION['employee']);
echo '</pre></div>';

//1回目 何も表示されない
?>