(function () {
    'use strict';

    // ===== 設定 =====
    // 画面確認用：今日の日付を固定しています。本番は null にしてください。
    const TODAY_OVERRIDE = '2026-10-23';
    const SOON_DAYS = 3; // 「3日以内の納期」の日数

    // ===== 出荷日の状態（色） =====
    // 当日は、登録した日になると自動で切り替わります（進行中のときだけ）
    const SHIP_STATES = [
        { key: 'undecided', label: '未定' },
        { key: 'today',     label: '当日' },
        { key: 'shipped',   label: '出荷済' },
        { key: 'progress',  label: '進行中' }   // 色なし
    ];

    // ===== 製作図〜アングルの色（データベースの数字 1〜11） =====
    // 0 は「色なし」。番号と色の対応は、ここを変えるだけで直せます。
    const DESIGN_COLORS = [
        { code: 1,  key: 'distributed', label: '配布済' },
        { code: 2,  key: 'checking',    label: '確認中' },
        { code: 3,  key: 'ready',       label: '配布可' },
        { code: 4,  key: 'check',       label: 'チェック' },
        { code: 5,  key: 'cut',         label: '切断' },
        { code: 6,  key: 'punch',       label: 'ポンチング' },
        { code: 7,  key: 'weld',        label: '溶接' },
        { code: 8,  key: 'paint',       label: '塗装' },
        { code: 9,  key: 'outsource',   label: '外注' },
        { code: 10, key: 'pack',        label: '梱包可' },
        { code: 11, key: 'shipready',   label: '出荷可' }
    ];
    const CODE_TO_KEY = {};
    DESIGN_COLORS.forEach(function (c) { CODE_TO_KEY[c.code] = c.key; });

    // 表に出す列（カラム名: orders テーブルの物理名）
    const DESIGN_COLS = [
        { key: 'drawing', label: '製作図' },
        { key: 'post_l',  label: 'ポストL' },
        { key: 'post_t',  label: 'ポストT' },
        { key: 'base',    label: 'ベース' },
        { key: 'arm',     label: 'アーム' },
        { key: 'angle',   label: 'アングル' },
        { key: 'A_base',   label: 'Aベース' },
        { key: 'others1',   label: 'その他1' },
        { key: 'others2',   label: 'その他2' },
        { key: 'others3',   label: 'その他3' },
        { key: 'others4',   label: 'その他4' },
        { key: 'others5',   label: 'その他5' },
        { key: 'breath',   label: 'ブレス' },
        { key: 'w_check',   label: 'wチェック' },
        { key: 'salesperson',   label: '営業担当' },
    ];

    // ===== 画面確認用のサンプルデータ =====
    // 本番は PHP から window.REF_ORDERS に入れます（reference.html の下のコメント参照）。
    // customer_name は、orders と顧客テーブルを customer_id でつないで取ります。
    const EMPTY = {
        drawing: 0, drawing_detail: '',
        post_l: 0, post_l_detail: '',
        post_t: 0, post_t_detail: '',
        base: 0, base_detail: '',
        arm: 0, arm_detail: '',
        angle: 0, angle_detail: '',
        A_base: 0, A_base_detail: ''
    };
    const SAMPLE_ORDERS = [
        Object.assign({}, EMPTY, {
        order_id: 26041, customer_name: 'A社', summary: 'H150', due_date: '2026-10-23',
        production: true, progress: 0, ship_status: 'today',
        post_l: 8, post_l_detail: '6 (2.4m)  XXX\nH125　7m*2本\n（大戸）10/1am',
        arm: 7, arm_detail: '12 R (L1200)\n上部にアングル付ける',
        A_base: 7, A_base_detail: 'aaaaaaaaa'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26042, customer_name: 'B社', summary: 'H100', due_date: '2026-10-22',
        production: true, progress: 100, ship_status: 'shipped',
        post_l: 11, post_l_detail: '6 (3.3m) URP\nH125　10m*2本在庫使用'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26043, customer_name: 'A社', summary: 'アーム', due_date: '2026-10-23',
        production: true, progress: 50, ship_status: 'progress',
        post_l: 8, post_l_detail: '800 R (L1200)',
        post_t: 11, post_t_detail: '3 (1.8m)'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26044, customer_name: 'D社', summary: '750アーム', due_date: '2026-10-26',
        production: false, progress: 0, ship_status: 'progress'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26045, customer_name: 'B社', summary: '移設セット', due_date: '2026-10-28',
        production: true, progress: 0, ship_status: 'progress'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26046, customer_name: 'F社', summary: 'H150　アーム', due_date: '2026-10-30',
        production: true, progress: 0, ship_status: 'progress'
        }),
        Object.assign({}, EMPTY, {
        order_id: 26040, customer_name: 'D社', summary: 'H125', due_date: '2026-10-20',
        production: false, progress: 0, ship_status: 'progress'
        })
    ];
    const ORDERS = window.REF_ORDERS || SAMPLE_ORDERS;

    // ===== 変更を保存する（今は動作確認用） =====
    // 本番は PHP に送って、データベースを書き換えます。
    function saveChange(change) {
        // 例:
        // fetch('api/update_order.php', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(change)
        // });
        console.log('保存する内容:', change);
    }

    // ===== 要素の取得 =====
    const page = document.getElementById('ref-page');
    const form = document.getElementById('ref-search-form');
    const keywordInput = document.getElementById('ref-keyword');
    const resetBtn = document.getElementById('ref-reset');
    const tbody = document.getElementById('ref-tbody');
    const cards = document.getElementById('ref-cards');
    const emptyMsg = document.getElementById('ref-empty');
    const totalEl = document.getElementById('ref-total');
    const lateEl = document.getElementById('ref-late');
    const soonEl = document.getElementById('ref-soon');
    const scroller = document.getElementById('ref-scroll');
    const menu = document.getElementById('ref-menu');

    const filterWrap = document.getElementById('ref-filter');
    const filterBtn = document.getElementById('ref-filter-btn');
    const filterPop = document.getElementById('ref-filter-pop');
    const filterSearch = document.getElementById('ref-filter-search');
    const filterList = document.getElementById('ref-filter-list');
    const filterClear = document.getElementById('ref-filter-clear');
    const filterCount = document.getElementById('ref-filter-count');

    // ===== 画面の状態 =====
    const state = {
        keyword: '',
        companies: new Set()   // 選んだ会社名
    };
    const collapsed = new Set(); // スマホで「工程内訳」を閉じているカード
    let menuTarget = null;

    // ===== 便利な関数 =====
    function esc(value) {
        return String(value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    // 全角・半角、大文字・小文字をそろえる
    function norm(value) {
        return String(value).normalize('NFKC').toLowerCase();
    }

    const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
    function parseDate(s) {
        const p = s.split('-').map(Number);
        return new Date(p[0], p[1] - 1, p[2]);
    }
    function today() {
        if (TODAY_OVERRIDE) return parseDate(TODAY_OVERRIDE);
        const n = new Date();
        return new Date(n.getFullYear(), n.getMonth(), n.getDate());
    }
    function formatDate(s) {
        const d = parseDate(s);
        return (d.getMonth() + 1) + '/' + d.getDate() + '（' + WEEK[d.getDay()] + '）';
    }
    function diffDays(s) {
        return Math.round((parseDate(s) - today()) / 86400000);
    }

    // 出荷日の状態。進行中のまま日付が来たら、自動で「当日」にする
    function shipState(o) {
        if (o.ship_status === 'progress' && diffDays(o.due_date) === 0) return 'today';
        return o.ship_status;
    }
    function shipClass(o) {
        const s = shipState(o);
        return s === 'progress' ? '' : ' ref-c-' + s;
    }
    function shipLabel(key) {
        const f = SHIP_STATES.filter(function (s) { return s.key === key; })[0];
        return f ? f.label : '';
    }

    // ===== 検索・絞り込み =====
    function matches(o) {
        if (state.companies.size && !state.companies.has(o.customer_name)) return false;

        const words = norm(state.keyword).split(/\s+/).filter(Boolean);
        if (!words.length) return true;

        // 注番・概要と、「〜詳細」の列すべてを対象にする
        const parts = [o.order_id, o.summary];
        Object.keys(o).forEach(function (k) {
        if (k.slice(-7) === '_detail') parts.push(o[k]);
        });
        const hay = norm(parts.join(' '));
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }

    // ===== 表示（パソコン：表の1行） =====
    function rowHtml(o) {
        const cells = DESIGN_COLS.map(function (c) {
        const code = o[c.key];
        const detail = o[c.key + '_detail'] || '';
        const cls = code ? ' ref-c-' + CODE_TO_KEY[code] : '';
        return '<td class="ref-cell ref-edit' + cls + '" data-edit="design" data-id="' + esc(o.order_id) +
            '" data-col="' + c.key + '" tabindex="0" role="button" aria-label="' + c.label + 'の色を変更">' +
            (detail ? esc(detail) : '<span class="ref-dash">—</span>') + '</td>';
        }).join('');

        return '<tr>' +
        '<td><a href="#" class="ref-order-no">' + esc(o.order_id) + '</a></td>' +
        '<td>' + (o.production ? '可' : '待ち') + '</td>' +
        '<td class="ref-progress">' + esc(o.progress) + '%</td>' +
        '<td>' + esc(o.customer_name) + '</td>' +
        '<td>' + esc(o.summary) + '</td>' +
        '<td class="ref-ship ref-edit' + shipClass(o) + '" data-edit="ship" data-id="' + esc(o.order_id) +
            '" tabindex="0" role="button" aria-label="出荷日の状態を変更">' + formatDate(o.due_date) + '</td>' +
        cells +
        '</tr>';
    }

    // ===== 表示（スマホ：カード） =====
    function cardHtml(o) {
        const id = esc(o.order_id);
        const isOpen = !collapsed.has(String(o.order_id));
        const rows = DESIGN_COLS.map(function (c) {
        const code = o[c.key];
        const detail = o[c.key + '_detail'] || '';
        const cls = code ? ' ref-c-' + CODE_TO_KEY[code] : '';
        return '<div class="ref-drow"><span class="ref-dlabel">' + c.label + '</span>' +
            '<span class="ref-dval ref-edit' + cls + '" data-edit="design" data-id="' + id + '" data-col="' + c.key +
            '" tabindex="0" role="button" aria-label="' + c.label + 'の色を変更">' +
            (detail ? esc(detail) : '<span class="ref-dash">—</span>') + '</span></div>';
        }).join('');

        return '<article class="ref-card">' +
        '<div class="ref-card-top">' +
            '<span class="ref-card-no"><small>注番</small><a href="#">' + id + '</a></span>' +
            '<span class="ref-card-shipwrap"><small>出荷</small>' +
            '<button type="button" class="ref-ship-badge ref-edit' + shipClass(o) + '" data-edit="ship" data-id="' + id + '">' +
            formatDate(o.due_date) + '</button></span>' +
        '</div>' +
        '<div class="ref-card-mid">' +
            '<span class="ref-card-company">' + esc(o.customer_name) + '</span>' +
            '<span class="ref-card-summary">' + esc(o.summary) + '</span>' +
            '<span class="ref-badge' + (o.production ? '' : ' is-wait') + '">' + (o.production ? '製作可' : '製作待ち') + '</span>' +
        '</div>' +
        '<div class="ref-card-progress"><small>進捗</small>' +
            '<span class="ref-bar"><i style="width:' + Number(o.progress) + '%"></i></span><b>' + esc(o.progress) + '%</b>' +
            '<button type="button" class="ref-toggle" data-toggle="' + id + '" aria-expanded="' + isOpen + '">工程内訳 ' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 15 12 9 18 15"/></svg>' +
            '</button>' +
        '</div>' +
        '<div class="ref-detail-list"' + (isOpen ? '' : ' hidden') + '>' + rows + '</div>' +
        '</article>';
    }

    // ===== 画面を作り直す =====
    function render() {
        const list = ORDERS.filter(matches);
        tbody.innerHTML = list.map(rowHtml).join('');
        cards.innerHTML = list.map(cardHtml).join('');
        emptyMsg.hidden = list.length !== 0;

        // 件数（出荷済のものは、遅延・納期の数に入れない）
        const active = list.filter(function (o) { return shipState(o) !== 'shipped'; });
        const late = active.filter(function (o) { return diffDays(o.due_date) < 0; }).length;
        const soon = active.filter(function (o) {
        const d = diffDays(o.due_date);
        return d >= 0 && d < SOON_DAYS;
        }).length;
        totalEl.textContent = '全 ' + list.length + ' 件';
        lateEl.textContent = '遅延 ' + late + ' 件';
        soonEl.textContent = SOON_DAYS + '日以内の納期 ' + soon + ' 件';
    }

    // ===== 客先フィルター =====
    const companies = Array.from(new Set(ORDERS.map(function (o) { return o.customer_name; })))
        .sort(function (a, b) { return a.localeCompare(b, 'ja'); });

    function renderFilterList() {
        const q = norm(filterSearch.value);
        const items = companies.filter(function (c) { return !q || norm(c).indexOf(q) !== -1; });
        filterList.innerHTML = items.length
        ? items.map(function (c) {
            return '<li><label><input type="checkbox" value="' + esc(c) + '"' +
                (state.companies.has(c) ? ' checked' : '') + '><span>' + esc(c) + '</span></label></li>';
            }).join('')
        : '<li class="ref-pop-none">該当する会社がありません</li>';
    }
    function updateFilterCount() {
        const n = state.companies.size;
        filterCount.hidden = n === 0;
        filterCount.textContent = n;
    }
    function openFilter() {
        renderFilterList();
        filterPop.hidden = false;
        filterBtn.setAttribute('aria-expanded', 'true');
        filterSearch.focus();
    }
    function closeFilter() {
        filterPop.hidden = true;
        filterBtn.setAttribute('aria-expanded', 'false');
    }

    filterBtn.addEventListener('click', function () {
        if (filterPop.hidden) openFilter(); else closeFilter();
    });
    filterSearch.addEventListener('input', renderFilterList);
    filterList.addEventListener('change', function (e) {
        if (!e.target.matches('input[type="checkbox"]')) return;
        if (e.target.checked) state.companies.add(e.target.value);
        else state.companies.delete(e.target.value);
        updateFilterCount();
        render();
    });
    filterClear.addEventListener('click', function () {
        state.companies.clear();
        updateFilterCount();
        renderFilterList();
        render();
    });

    // ===== キーワード検索・リセット =====
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        state.keyword = keywordInput.value;
        render();
    });
    resetBtn.addEventListener('click', function () {
        keywordInput.value = '';
        filterSearch.value = '';
        state.keyword = '';
        state.companies.clear();
        updateFilterCount();
        renderFilterList();
        render();
    });

    // ===== 色を選ぶメニュー =====
    function openMenu(el, byKeyboard) {
        const type = el.dataset.edit;
        const o = ORDERS.filter(function (x) { return String(x.order_id) === el.dataset.id; })[0];
        if (!o) return;
        menuTarget = { type: type, id: el.dataset.id, col: el.dataset.col };

        let items;
        let current;
        if (type === 'ship') {
        current = o.ship_status;
        items = SHIP_STATES.map(function (s) {
            return { value: s.key, label: s.label, cls: s.key === 'progress' ? '' : 'ref-c-' + s.key };
        });
        } else {
        current = o[el.dataset.col];
        items = [{ value: 0, label: '色なし', cls: '' }].concat(DESIGN_COLORS.map(function (c) {
            return { value: c.code, label: c.label, cls: 'ref-c-' + c.key };
        }));
        }

        menu.innerHTML = items.map(function (it) {
        return '<button type="button" role="menuitem" data-pick="' + it.value + '"' +
            (String(it.value) === String(current) ? ' class="is-current"' : '') + '>' +
            '<i class="ref-swatch ' + it.cls + '"></i>' + esc(it.label) + '</button>';
        }).join('');

        menu.hidden = false;
        const r = el.getBoundingClientRect();
        const w = menu.offsetWidth;
        const h = menu.offsetHeight;
        let left = Math.min(r.left, window.innerWidth - w - 8);
        let top = r.bottom + 4;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
        menu.style.left = Math.max(8, left) + 'px';
        menu.style.top = top + 'px';

        if (byKeyboard) {
        const first = menu.querySelector('button');
        if (first) first.focus();
        }
    }
    function closeMenu() {
        menu.hidden = true;
        menuTarget = null;
    }

    menu.addEventListener('click', function (e) {
        const b = e.target.closest('[data-pick]');
        if (!b || !menuTarget) return;
        const o = ORDERS.filter(function (x) { return String(x.order_id) === menuTarget.id; })[0];
        if (o) {
        if (menuTarget.type === 'ship') {
            o.ship_status = b.dataset.pick;
            saveChange({ order_id: o.order_id, column: 'ship_status', value: o.ship_status });
        } else {
            o[menuTarget.col] = Number(b.dataset.pick);
            saveChange({ order_id: o.order_id, column: menuTarget.col, value: o[menuTarget.col] });
        }
        }
        closeMenu();
        render();
    });

    // ===== クリック・キー操作 =====
    document.addEventListener('click', function (e) {
        const edit = e.target.closest('[data-edit]');
        const toggle = e.target.closest('[data-toggle]');

        if (!menu.contains(e.target)) closeMenu();
        if (!filterWrap.contains(e.target)) closeFilter();

        if (edit && page.contains(edit)) openMenu(edit, false);

        if (toggle && page.contains(toggle)) {
        const id = toggle.dataset.toggle;
        if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
        const open = !collapsed.has(id);
        toggle.setAttribute('aria-expanded', open);
        const box = toggle.closest('.ref-card').querySelector('.ref-detail-list');
        box.hidden = !open;
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
        closeMenu();
        closeFilter();
        return;
        }
        const edit = e.target.closest && e.target.closest('td[data-edit], span[data-edit]');
        if (edit && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openMenu(edit, true);
        }
    });

    window.addEventListener('resize', closeMenu);
    scroller.addEventListener('scroll', closeMenu);

    // ===== 表を横にスライド（マウスでつかんで動かす） =====
    (function () {
        let startX = 0;
        let startLeft = 0;
        let down = false;
        let moved = false;

        scroller.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return; // タッチは、ふつうのスクロール
        down = true;
        moved = false;
        startX = e.clientX;
        startLeft = scroller.scrollLeft;
        });
        window.addEventListener('pointermove', function (e) {
        if (!down) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 4) {
            moved = true;
            scroller.classList.add('is-dragging');
            closeMenu();
        }
        if (moved) scroller.scrollLeft = startLeft - dx;
        });
        window.addEventListener('pointerup', function () {
        down = false;
        scroller.classList.remove('is-dragging');
        });
        // ドラッグしたあとの指離しを、クリックとして扱わない
        scroller.addEventListener('click', function (e) {
        if (moved) {
            e.stopPropagation();
            e.preventDefault();
            moved = false;
        }
        }, true);
    })();

  // ===== 最初の表示 =====
    updateFilterCount();
    render();
})();