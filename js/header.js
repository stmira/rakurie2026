const showButton = document.getElementById('show_btn')
const closeButton = document.getElementById('close_btn')
const notificationArea = document.getElementById('notification_area')
const hamburgerBtn = document.getElementById('hamburger_btn');
const mobileNav = document.getElementById('mobile_nav');
const hamburgerCloseBtn = document.getElementById('hamburger_close_btn');

showButton.addEventListener('click', function() {
    notificationArea.classList.toggle('is-show')
});

closeButton.addEventListener('click', function() {
    notificationArea.classList.remove('is-show')
})

// ハンバーガーボタンを押したとき
if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('is-show');
        const expanded = mobileNav.classList.contains('is-show');
        hamburgerBtn.setAttribute('aria-expanded', expanded);
    });
}

// メニュー内の閉じるボタンを押したとき
if (hamburgerCloseBtn && mobileNav) {
    hamburgerCloseBtn.addEventListener('click', function() {
        mobileNav.classList.remove('is-show');
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}