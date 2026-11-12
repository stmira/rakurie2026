<!-- セッションstart -->
<?php session_start();?>

<!-- データベース接続 -->
<?php require_once 'config/database.php';?>

<?php
// データベースが正常に接続されているかチェック
//ここはok
if (!isset($pdo)) {
    echo '<div style="color:red; background:white; padding:10px;">データベース接続($pdo)に失敗しています。config/database.php の読み込みや設定を確認してください。</div>';
    exit;
}
?>

<!-- html/css/jsの読み込み -->
<?php require 'html/index.html'; ?>
<link rel="stylesheet" href="css/index.css">
<!-- jsでは、ログインのロジックを実装している -->
<script src="js/index.js"></script>

<?php
unset($_SESSION["employee"]);
// 該当のユーザーの背番号とパスワードを取得する
$user_num = $_REQUEST["employee_Id"];


//上記を取得したら該当のユーザーの名前をデータベースから引っ張ってきて、$sessionにデータを入れる
$sql = $pdo->prepare("select * from employees where employee_id=?");
$sql->execute([$user_num]);

//ここでは、employeeに背番号、社員名、部署名、パスワードを代入している
foreach ($sql as $row) {
	$_SESSION['employee']=[
		'id'=>$row['employee_id'], 'name'=>$row['employee_name'],
        "department_name"=>$row["department_name"],"email"=>$row['email']
    ];
}

if($_SESSION['employee']['department_name'] == "生産部"){
    header('Location: ./todo.php');
    exit();
}elseif($_SESSION['employee']['department_name'] == "営業部"){
    header('Location: ./schedule.php');
    exit();
}else{
    //ログインしていなかった何もしない
}
?>