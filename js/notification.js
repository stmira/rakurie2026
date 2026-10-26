const read_all_btn = document.getElementById('read_all_btn')
const list = document.getElementById('list_area')

read_all_btn.addEventListener('click', function() {
    list_area.style.display = 'none'
    showButton.setAttribute('aria-expanded', 'true')
    list_area.style.backgroundColor = '#ffff'
})