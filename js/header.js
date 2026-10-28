const showButton = document.getElementById('show_btn')
const notificationArea = document.getElementById('notification_area')
const closeButton = document.getElementById('close_btn')

showButton.addEventListener('click', function() {
    notificationArea.classList.toggle('is-show')
});

closeButton.addEventListener('click', function() {
    notificationArea.classList.remove('is-show')
})
