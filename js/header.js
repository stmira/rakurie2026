const showButton = document.getElementById('show_btn')
const notificationArea = document.getElementById('notification_area')
const closeButton = document.getElementById('close_btn')
const badge = document.querySelector('.badge-unread')

showButton.addEventListener('click', function() {
    notificationArea.style.display = 'block'
    showButton.setAttribute('aria-expanded', 'true')
});

closeButton.addEventListener('click', function() {
    notificationArea.style.display = 'none'
    showButton.setAttribute('aria-expanded', 'false')
})
