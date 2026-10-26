// 目のアイコンでパスワードの表示/非表示を切り替える
document.querySelectorAll('.toggle').forEach(function (btn) {
btn.addEventListener('click', function () {
    var input = document.getElementById(btn.dataset.target);
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示');
});
});