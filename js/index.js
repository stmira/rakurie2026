    //javascriptを修正する
    // ===== 遷移先 =====
    // const ROUTES = {
    //   production: './todo.php',      // 生産部 → todo画面
    //   sales: './schedule.php'        // 営業部 → 工程表一覧画面
    // };
//
    // ===== 社員IDから部署を判定 =====ここはロジックとしては使っていない所
    // async function authenticate(employeeId, password) {

    //   const userid = document.getElementById('employeeId');
    //   // if (Number.isNaN(num)) return { ok: false };
    //   return { ok: true, department: userid < 15 ? 'production' : 'sales' };
    // }

    // ===== パスワード表示切替 =====
    const pw = document.getElementById('password');//htmlのidを取得している
    const toggle = document.getElementById('togglePw');//htmlのid(目隠しトグル)を取得している
    //目隠しトグルの仕組みづくり
    toggle.addEventListener('click', () => {//トグルがクリックされたら
      const show = pw.type === 'password';//今現状passwordが隠れているのかどうかを示す(隠れていたら、true/表示されていたら、false)。
      pw.type = show ? 'text' : 'password';//ボタンを押した時点の状態を見て、表示と非表示を入れ替えている(textであれば、password●の状態に変更する)
      toggle.classList.toggle('is-visible', show);//「パスワードが表示状態かどうかに合わせて、ボタンに is-visible クラスを付け外しする(アイコンの見た目を切り替えるため)」
    });

    // ===== ログイン処理 =====
    //htmlのidを取得している
    const form = document.getElementById('loginForm');
    const idInput = document.getElementById('employeeId');
    const errorEl = document.getElementById('errorMessage');
    const button = document.getElementById('loginButton');

    //catchで取得したエラーを表示する為の関数を作る
    function showError(msg, targets) {
      errorEl.textContent = msg;// エラー表示用の要素に、受け取ったメッセージを文字として入れる
      [idInput, pw].forEach(el => el.classList.remove('is-error'));// ID欄とパスワード欄を1つずつ取り出し、前回の is-error クラスを外す(リセット) elはforeachで取り出した要素の事
      targets.forEach(el => el.classList.add('is-error'));// 今回問題があった入力欄だけを1つずつ取り出し、is-error クラスを付ける
    }

    //ボタンを押すというイベントがおきたら
   form.addEventListener('submit', (e) => {
    const id = idInput.value.trim();//空白とか余分なものをなくしidに入れる
    const password = pw.value;

    let msg = '', targets = [];//
    if (!id){ 
      msg = '社員ＩＤを入力してください。';
      targets = [idInput]; 
    }
    else if (!password) { 
      msg = 'パスワードを入力してください。';     
      targets = [pw]; 
    }
    else if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      msg = 'パスワードは８文字以上で、大文字・小文字を１文字以上含めてください。'; 
      targets = [pw];
    }
    if (msg) { e.preventDefault(); showError(msg, targets); }   // 問題があるときだけ止める
    //エラーメッセージがあれば、ここでエラーメッセージを表示させる
  });