    //javascriptを修正する
    // ===== 遷移先 =====
    const ROUTES = {
      production: './todo.php',      // 生産部 → todo画面
      sales: './schedule.php'        // 営業部 → 工程表一覧画面
    };
//
    // ===== 社員IDから部署を判定 =====
    // 本番では、社員登録DBを参照するAPIに差し替えてください。
    // 期待するレスポンス例: { ok: true, department: "production" | "sales" }
    async function authenticate(employeeId, password) {
      /* --- 本番用(例) ---
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password })
      });
      if (!res.ok) return { ok: false };
      return await res.json();
      ---------------------- */

      const userid = document.getElementById('employeeId');
      // if (Number.isNaN(num)) return { ok: false };
      return { ok: true, department: userid < 15 ? 'production' : 'sales' };
    }

    // ===== パスワード表示切替 =====
    const pw = document.getElementById('password');//htmlのidを取得している
    const toggle = document.getElementById('togglePw');//htmlのidを取得している
    //目隠しトグルの仕組みづくり
    toggle.addEventListener('click', () => {
      const show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      toggle.classList.toggle('is-visible', show);
      toggle.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示する');
    });

    // ===== ログイン処理 =====
    //htmlのidを取得している
    const form = document.getElementById('loginForm');
    const idInput = document.getElementById('employeeId');
    const errorEl = document.getElementById('errorMessage');
    const button = document.getElementById('loginButton');

    //catchで取得したエラーを表示する為の関数を作る
    function showError(msg, targets) {
      errorEl.textContent = msg;
      [idInput, pw].forEach(el => el.classList.remove('is-error'));
      targets.forEach(el => el.classList.add('is-error'));
    }

    //ボタンを押すというイベントがおきたら
   form.addEventListener('submit', (e) => {
    const id = idInput.value.trim();
    const password = pw.value;

    let msg = '', targets = [];
    if (!id)            { msg = '社員ＩＤを入力してください。';      targets = [idInput]; }
    else if (!password) { msg = 'パスワードを入力してください。';     targets = [pw]; }
    else if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      msg = 'パスワードは８文字以上で、大文字・小文字を１文字以上含めてください。'; targets = [pw];
    }
    if (msg) { e.preventDefault(); showError(msg, targets); }   // 問題があるときだけ止める
    // 問題なければ何もしない → そのままPOSTされる
  });