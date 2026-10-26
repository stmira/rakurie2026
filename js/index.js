
    // ===== 遷移先 =====
    const ROUTES = {
      production: 'todo.html',      // 生産部 → todo画面
      sales: 'schedule.html'        // 営業部 → 工程表一覧画面
    };

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

      // --- 動作確認用ダミー(DB連携前) ---
      // 0001〜4999 → 生産部 / 5000〜 → 営業部 としています
      const num = parseInt(employeeId, 10);
      if (Number.isNaN(num)) return { ok: false };
      return { ok: true, department: num < 5000 ? 'production' : 'sales' };
    }

    // ===== パスワード表示切替 =====
    const pw = document.getElementById('password');
    const toggle = document.getElementById('togglePw');
    toggle.addEventListener('click', () => {
      const show = pw.type === 'password';
      pw.type = show ? 'text' : 'password';
      toggle.classList.toggle('is-visible', show);
      toggle.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示する');
    });

    // ===== ログイン処理 =====
    const form = document.getElementById('loginForm');
    const idInput = document.getElementById('employeeId');
    const errorEl = document.getElementById('errorMessage');
    const button = document.getElementById('loginButton');

    function showError(msg, targets) {
      errorEl.textContent = msg;
      [idInput, pw].forEach(el => el.classList.remove('is-error'));
      targets.forEach(el => el.classList.add('is-error'));
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = idInput.value.trim();
      const password = pw.value;

      if (!id) return showError('社員ＩＤを入力してください。', [idInput]);
      if (!password) return showError('パスワードを入力してください。', [pw]);
      if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        return showError('パスワードは８文字以上で、大文字・小文字を１文字以上含めてください。', [pw]);
      }

      button.disabled = true;
      try {
        const result = await authenticate(id, password);
        if (!result.ok) {
          return showError('社員ＩＤまたはパスワードが正しくありません。', [idInput, pw]);
        }
        const dest = ROUTES[result.department];
        if (!dest) return showError('部署の情報を取得できませんでした。管理者にお問い合わせください。', []);
        window.location.href = dest;
      } catch (err) {
        showError('通信に失敗しました。時間をおいて再度お試しください。', []);
      } finally {
        button.disabled = false;
      }
    });
