const read_all_btn = document.getElementById('read_all_btn')           // すべて既読にする
const items = document.querySelectorAll('.item')                       // 通知（複数）
const badge = document.querySelector('.badge-unread')                  // 「未読○件」
const bell_dot = document.querySelector('.bell .dot')

// ===== 未読の数を数えて、バッジを更新する =====
function updateBadge() {
    const count = document.querySelectorAll('.item.is-unread').length
    // 数字を全角にする（2 → ２）
    const zenkaku = String(count).replace(/[0-9]/g, function (d) {
        return String.fromCharCode(d.charCodeAt(0) + 0xFEE0)
    })
    badge.textContent = '未読' + zenkaku + '件'
    badge.style.display = (count === 0) ? 'none' : ''   // 0件ならバッジを隠す
    bell_dot.style.display = (count === 0) ? 'none' : ''   // 0件ならベルの黄色い丸も隠す
}

// ===== すべて既読にする =====
read_all_btn.addEventListener('click', function () {
    items.forEach(function (item) {
        item.classList.remove('is-unread')
    })
    updateBadge()
})

// ===== 通知を1つ押したら、その通知だけ既読にする =====
items.forEach(function (item) {
    item.addEventListener('click', function (event) {
        event.preventDefault()               // href="#" でページの先頭に戻らないようにする
        item.classList.remove('is-unread')
        updateBadge()
    })
})

// ===== 画面を開いたときに、バッジの数を正しくそろえる =====
updateBadge()