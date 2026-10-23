<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>パスワード再設定</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<main class="page">
    <form class="card" action="#" method="post" novalidate>

    <div class="icon-box" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="11" width="16" height="10" rx="2"></rect>
        <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
        <circle cx="12" cy="16" r="1"></circle>
        </svg>
    </div>

    <h1 class="title">パスワード再設定</h1>
    <p class="lead">登録済みの名前とメールアドレスを入力し、新しいパスワードを設定してください。</p>

    <div class="field">
        <label for="name" class="label">名前<span class="badge">必須</span></label>
        <input class="input" type="text" id="name" name="name" value="" autocomplete="name" required>
    </div>

    <div class="field">
        <label for="email" class="label">メールアドレス<span class="badge">必須</span></label>
        <input class="input" type="email" id="email" name="email" value="" autocomplete="email" required>
    </div>

    <div class="field">
        <label for="password" class="label">新しいパスワード<span class="badge">必須</span></label>
        <div class="input-wrap">
        <input class="input has-icon" type="password" id="password" name="password" value="" autocomplete="new-password" aria-describedby="password-hint" required>
        <button type="button" class="toggle" data-target="password" aria-label="パスワードを表示">
            <svg class="eye-off" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        </button>
        </div>
        <p class="hint" id="password-hint">8文字以上、大文字・小文字を1文字以上含む</p>
    </div>

    <div class="field">
        <label for="password-confirm" class="label">新しいパスワード（確認）<span class="badge">必須</span></label>
        <div class="input-wrap">
        <input class="input has-icon" type="password" id="password-confirm" name="password_confirm" value="" autocomplete="new-password" required>
        <button type="button" class="toggle" data-target="password-confirm" aria-label="パスワード（確認）を表示">
            <svg class="eye-off" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        </button>
        </div>
    </div>

    <div class="actions">
        <button type="reset" class="btn btn-reset">リセット</button>
        <button type="submit" class="btn btn-submit">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        登録
        </button>
    </div>

    <a href="login.html" class="back-link">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        ログイン画面に戻る
    </a>

    </form>
</main>

<script>
    // 目のアイコンでパスワードの表示/非表示を切り替える
    document.querySelectorAll('.toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var input = document.getElementById(btn.dataset.target);
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示');
    });
    });
</script>
</body>
</html>