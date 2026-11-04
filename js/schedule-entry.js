// ========================工程表情報登録画面===========================
// schedule-entry.php から <script src="js/schedule-entry.js"></script> で読み込みます。
// データベースにはまだ接続せず、画面の見本と同じ仮データで動きます。
// 登録時に作る1件は、schedules テーブルの列名と同じ形です。
//   schedule_id, employee_id, order_id, task_id, detail, status, quantity,
//   actual_start_date, actual_end_date, planned_start_date, planned_end_date
(function () {
  'use strict';
  if (!document.getElementById('seGrid')) return;

  var DAYS = 6;                          // 一度に表示する日数
  var WD = ['日', '月', '火', '水', '木', '金', '土'];
  var CLS = { '未着手': 'todo', '作業中': 'doing', '完了': 'done', '遅延': 'late' };
  var HOLIDAYS = [];                     // 祝日・会社休日 'YYYY-MM-DD'（日曜は自動で休日）
  var BASE = new Date(2026, 8, 24);      // 仮データの基準日（見本の 9/24）

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function key(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function add(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function isOff(d) { return d.getDay() === 0 || HOLIDAYS.indexOf(key(d)) >= 0; }

  // 「今日」。画面確認用に ?today=2026-09-26 のように指定できます。
  // （DB接続後は new Date() の日付に変えてください）
  var m = /[?&]today=(\d{4}-\d{2}-\d{2})/.exec(location.search);
  var today = m ? parse(m[1]) : BASE;
  var T = key(today);

  // ---------- 仮データ（見本の画面と同じ内容） ----------
  var EMPLOYEES = [
    { employee_id: 1, name: '大原', role: 'MCT・旋盤' },
    { employee_id: 2, name: '小原', role: 'アームロボット' },
    { employee_id: 3, name: 'Tさん', role: '加工・検査' },
    { employee_id: 4, name: 'Hさん', role: 'MC・旋盤' },
    { employee_id: 5, name: 'Yさん', role: 'アームロボット' }
  ];
  var TASKS = [   // 作業名（tasks テーブル）
    { task_id: 1, task_name: 'HIS10' }, { task_id: 2, task_name: 'アルミ加工' }, { task_id: 3, task_name: 'アルミ M10' },
    { task_id: 4, task_name: '平板 250×250' }, { task_id: 5, task_name: '部品入荷確認' }, { task_id: 6, task_name: '溶接準備' },
    { task_id: 7, task_name: '材料受入' }, { task_id: 8, task_name: 'ロット1' }, { task_id: 9, task_name: '作図' },
    { task_id: 10, task_name: '図面修正' }, { task_id: 11, task_name: '図面確認' }, { task_id: 12, task_name: 'ボルト加工' },
    { task_id: 13, task_name: 'ケース製作' }, { task_id: 14, task_name: 'アームロボット' }
  ];
  var ORDERS = [  // 会社名（orders テーブル）
    { order_id: 1, company_name: '株式会社A社' }, { order_id: 2, company_name: '株式会社B社' },
    { order_id: 3, company_name: '株式会社C社' }, { order_id: 4, company_name: '株式会社G社' }
  ];

  function d(n) { return key(add(BASE, n)); }
  // s(ID, 担当者, 作業, 受注, 詳細, 本数, 状態, 予定開始(基準日から何日目), 予定終了)
  function s(id, emp, task, order, detail, qty, status, ps, pe) {
    var done = status === '完了', doing = status === '作業中';
    return {
      schedule_id: id, employee_id: emp, order_id: order, task_id: task, detail: detail, status: status, quantity: qty,
      actual_start_date: (done || doing) ? d(ps) : null, actual_end_date: done ? d(pe) : null,
      planned_start_date: d(ps), planned_end_date: d(pe)
    };
  }

  var state = {
    start: BASE, q: '', emp: null, sel: null,
    schedules: [
      s(1, 1, 1, null, 'MC加工・ロット10', 10, '完了', 0, 0), s(2, 1, 2, null, '1236-5-NB', null, '遅延', 0, 0),
      s(3, 1, 3, null, 'MC加工 100本', 100, '未着手', 1, 1), s(4, 1, 1, null, 'MC加工 60本', 60, '未着手', 4, 4),
      s(5, 1, 4, null, '切断・穴あけ', null, '未着手', 5, 5),
      s(6, 2, 5, 1, '', null, '完了', 0, 0), s(7, 2, 6, null, '治具の確認', null, '作業中', 0, 0),
      s(8, 2, 7, 2, '', null, '未着手', 4, 4), s(9, 2, 8, null, '溶接・仕上げ', null, '未着手', 5, 5),
      s(10, 3, 9, null, '図面確認', null, '作業中', 0, 0), s(11, 3, 9, null, '寸法確認', null, '未着手', 1, 1),
      s(12, 3, 10, null, '修正 2件', 2, '未着手', 2, 2), s(13, 3, 9, 3, '', null, '未着手', 4, 4),
      s(14, 3, 9, null, '最終確認', null, '未着手', 5, 5),
      s(15, 4, 12, null, 'M8　50本', 50, '作業中', 0, 0), s(16, 4, 11, null, '仕様の確認', null, '未着手', 2, 2),
      s(17, 4, 12, null, 'MC仕上げ', null, '未着手', 4, 4), s(18, 4, 13, null, 'アルミ切削', null, '未着手', 5, 5),
      s(19, 5, 14, null, '加工・検査', null, '完了', 0, 0), s(20, 5, 14, null, 'MC仕上げ', null, '未着手', 2, 2),
      s(21, 5, 14, null, 'パレット製作', null, '未着手', 4, 4), s(22, 5, 14, null, 'MC仕上げ', null, '未着手', 5, 5)
    ]
  };

  // ---------- 表示ロジック ----------
  function taskName(id) { var t = TASKS.filter(function (x) { return x.task_id === id; })[0]; return t ? t.task_name : ''; }
  function companyName(id) { var o = ORDERS.filter(function (x) { return x.order_id === id; })[0]; return o ? o.company_name : ''; }
  function empName(id) { var e = EMPLOYEES.filter(function (x) { return x.employee_id === id; })[0]; return e ? e.name : ''; }

  // カードの2行目は「詳細」。なければ会社名
  function view(sc) {
    var co = companyName(sc.order_id);
    return { title: taskName(sc.task_id), line2: sc.detail || co, text: [taskName(sc.task_id), sc.detail, co].join(' ').toLowerCase() };
  }

  // その日のタスク ＋ 「作業中」のまま予定日を過ぎたタスク（繰越：一番上に表示）
  function tasksFor(empId, k) {
    var list = [];
    state.schedules.forEach(function (sc) {
      if (sc.employee_id !== empId) return;
      var inPlan = sc.planned_start_date <= k && k <= sc.planned_end_date;
      var carried = !inPlan && sc.status === '作業中' && !sc.actual_end_date && k > sc.planned_end_date && k <= T;
      if (inPlan || carried) list.push({ s: sc, carried: carried });
    });
    return list.sort(function (a, b) {
      return (b.carried ? 1 : 0) - (a.carried ? 1 : 0) || a.s.schedule_id - b.s.schedule_id;
    });
  }

  function match(text) { return !state.q || text.indexOf(state.q) >= 0; }

  function card(sc, carried) {
    var v = view(sc);
    return '<div class="sc-card ' + CLS[sc.status] + '"><div class="sc-card-top"><b>' + esc(v.title) + '</b><span class="sc-st">' +
      (carried ? '<span class="sc-carry">繰越</span>' : '') + esc(sc.status) + '</span></div>' +
      (v.line2 ? '<p>' + esc(v.line2) + '</p>' : '') + '</div>';
  }

  var PLUS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

  function render() {
    var days = [], i;
    for (i = 0; i < DAYS; i++) days.push(add(state.start, i));
    var keys = days.map(key), grid = $('seGrid'), sel = state.sel;
    grid.style.setProperty('--days', DAYS);

    var html = '<div class="se-h corner">担当／作業日</div>';
    days.forEach(function (dt, idx) {
      html += '<div class="se-h' + (sel && sel.date === keys[idx] ? ' is-sel' : '') + '">' +
        (dt.getMonth() + 1) + '/' + dt.getDate() + '（' + WD[dt.getDay()] + '）</div>';
    });

    var rows = '';
    EMPLOYEES.forEach(function (e) {
      if (state.emp && !state.emp[e.employee_id]) return;
      var any = false, cells = '';
      keys.forEach(function (k, idx) {
        var off = isOff(days[idx]);
        var all = tasksFor(e.employee_id, k);
        var shown = all.filter(function (t) { return match(view(t.s).text); });
        var inner = off ? '<span class="sc-offlabel">休日</span>' : '';
        shown.forEach(function (t) { any = true; inner += card(t.s, t.carried); });
        if (!all.length && !off) {   // 何も登録されていない枠だけ、選択できる
          var picked = sel && sel.emp === e.employee_id && sel.date === k;
          inner += picked
            ? '<div class="se-pick">' + PLUS + '<span>登録する</span></div>'
            : '<button type="button" class="se-empty" data-emp="' + e.employee_id + '" data-date="' + k +
              '" aria-label="' + esc(e.name) + 'の' + (days[idx].getMonth() + 1) + '月' + days[idx].getDate() + '日に工程を登録">–</button>';
        }
        cells += '<div class="se-cell' + (off ? ' is-off' : '') + '">' + inner + '</div>';
      });
      if (any || !state.q) {
        rows += '<div class="se-rh' + (sel && sel.emp === e.employee_id ? ' is-sel' : '') + '"><b>' + esc(e.name) + '</b><span>' + esc(e.role) + '</span></div>' + cells;
      }
    });
    grid.innerHTML = html + (rows || '<div class="se-none">該当する予定はありません。</div>');

    var a = days[0], b = days[DAYS - 1];
    $('seRange').textContent = a.getFullYear() + '年' + (a.getMonth() + 1) + '月' + a.getDate() + '日〜' +
      (b.getMonth() !== a.getMonth() ? (b.getMonth() + 1) + '月' : '') + b.getDate() + '日';
  }

  // ---------- 右の登録パネル ----------
  function fillSelect(id, placeholder, items, val, label) {
    $(id).innerHTML = (placeholder ? '<option value="">' + placeholder + '</option>' : '') +
      items.map(function (x) { return '<option value="' + x[val] + '">' + esc(x[label]) + '</option>'; }).join('');
  }

  function syncSelected() {
    if (!state.sel) return;
    var dt = parse(state.sel.date);
    $('seSelected').textContent = '選択中：' + empName(state.sel.emp) + '／' +
      dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日（' + WD[dt.getDay()] + '）';
  }

  function syncWindow(dateKey) {   // 選んだ日が画面の外なら、表示を合わせる
    var dt = parse(dateKey);
    if (dt < state.start || dt > add(state.start, DAYS - 1)) state.start = dt;
  }

  function setError(name, msg) {
    var f = document.querySelector('.se-field[data-field="' + name + '"]');
    if (!f) return;
    var p = f.querySelector('.se-error');
    f.classList.toggle('has-error', !!msg);
    p.textContent = msg || '';
    p.hidden = !msg;
  }
  function clearErrors() { document.querySelectorAll('.se-field').forEach(function (f) { setError(f.dataset.field, ''); }); }

  function openPanel() { $('sePanel').hidden = false; $('seLayout').classList.remove('is-closed'); }
  function closePanel() { $('sePanel').hidden = true; $('seLayout').classList.add('is-closed'); }

  function selectCell(emp, date) {
    state.sel = { emp: emp, date: date };
    $('seEmp').value = String(emp);
    $('seStart').value = date;
    $('seEnd').value = date;
    clearErrors();
    syncSelected();
    openPanel();
    render();
  }

  function cancel() {
    $('seForm').reset();
    clearErrors();
    state.sel = null;
    closePanel();
    render();
  }

  var toastTimer;
  function toast(msg) {
    var t = $('seToast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3000);
  }

  function validate(r) {
    var e = {};
    if (!r.task_id) e.task_id = '作業名を選択してください。';
    if (r.detail.length > 100) e.detail = '詳細は100文字以内で入力してください。';
    if (r.quantity !== null && (!isFinite(r.quantity) || r.quantity < 0 || Math.floor(r.quantity) !== r.quantity)) {
      e.quantity = '本数は0以上の整数で入力してください。';
    }
    if (!r.planned_start_date) e.planned_start_date = '作業開始予定日を入力してください。';
    if (!r.planned_end_date) e.planned_end_date = '作業終了予定日を入力してください。';
    else if (r.planned_start_date && r.planned_end_date < r.planned_start_date) e.planned_end_date = '作業終了予定日は、開始予定日以降にしてください。';
    return e;
  }

  var CONTROL = { employee_id: 'seEmp', order_id: 'seOrder', task_id: 'seTask', detail: 'seDetail', quantity: 'seQty', planned_start_date: 'seStart', planned_end_date: 'seEnd' };

  function submit(ev) {
    ev.preventDefault();
    clearErrors();
    var ids = state.schedules.map(function (x) { return x.schedule_id; });
    var rec = {
      schedule_id: (ids.length ? Math.max.apply(null, ids) : 0) + 1,
      employee_id: +$('seEmp').value,
      order_id: $('seOrder').value ? +$('seOrder').value : null,
      task_id: $('seTask').value ? +$('seTask').value : null,
      detail: $('seDetail').value.trim(),
      status: '未着手',                                   // 登録時は未着手（NOT NULL）
      quantity: $('seQty').value === '' ? null : Number($('seQty').value),
      actual_start_date: null, actual_end_date: null,
      planned_start_date: $('seStart').value, planned_end_date: $('seEnd').value
    };
    var errs = validate(rec), names = Object.keys(errs);
    if (names.length) {
      names.forEach(function (n) { setError(n, errs[n]); });
      $(CONTROL[names[0]]).focus();
      return;
    }
    // DB接続後は、ここで rec を API に送って保存します
    console.log('登録するデータ（schedules）:', rec);
    state.schedules.push(rec);
    toast('工程を登録しました');
    $('seForm').reset();
    state.sel = null;
    closePanel();
    render();
  }

  // ---------- 左の絞り込み（担当者） ----------
  function buildFilter() {
    var p = $('seFilterPanel');
    p.innerHTML = '<label><input type="checkbox" id="seAll" checked>全員</label><hr>' + EMPLOYEES.map(function (e) {
      return '<label><input type="checkbox" class="seEmpChk" value="' + e.employee_id + '" checked>' + esc(e.name) + '</label>';
    }).join('');
    p.addEventListener('change', function (ev) {
      var boxes = [].slice.call(p.querySelectorAll('.seEmpChk'));
      if (ev.target.id === 'seAll') boxes.forEach(function (b) { b.checked = ev.target.checked; });
      var on = boxes.filter(function (b) { return b.checked; });
      $('seAll').checked = on.length === boxes.length;
      state.emp = on.length === boxes.length ? null : {};
      if (state.emp) on.forEach(function (b) { state.emp[b.value] = true; });
      var c = $('seFilterCount');
      c.hidden = !state.emp; c.textContent = on.length;
      render();
    });
  }

  // ---------- 起動 ----------
  function init() {
    fillSelect('seEmp', '', EMPLOYEES, 'employee_id', 'name');
    fillSelect('seOrder', '会社名を選択', ORDERS, 'order_id', 'company_name');
    fillSelect('seTask', '作業名を選択', TASKS, 'task_id', 'task_name');
    buildFilter();

    $('seSearch').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
    $('sePrev').addEventListener('click', function () { state.start = add(state.start, -DAYS); render(); });
    $('seNext').addEventListener('click', function () { state.start = add(state.start, DAYS); render(); });
    $('seToday').addEventListener('click', function () { state.start = today; render(); });
    $('seFilterBtn').addEventListener('click', function (e) { e.stopPropagation(); var p = $('seFilterPanel'); p.hidden = !p.hidden; });
    document.addEventListener('click', function (e) { var p = $('seFilterPanel'); if (!p.contains(e.target)) p.hidden = true; });

    // 空白の枠をクリック → 右の登録パネルを表示
    $('seGrid').addEventListener('click', function (e) {
      var b = e.target.closest('.se-empty');
      if (b) selectCell(+b.dataset.emp, b.dataset.date);
    });

    // フォームと表の連動
    $('seEmp').addEventListener('change', function () {
      if (!state.sel) return;
      state.sel.emp = +this.value; syncSelected(); render();
    });
    $('seStart').addEventListener('change', function () {
      var v = this.value; if (!v) return;
      if ($('seEnd').value < v) $('seEnd').value = v;
      if (state.sel) { state.sel.date = v; syncWindow(v); syncSelected(); render(); }
    });
    document.querySelectorAll('.se-field').forEach(function (f) {
      var clear = function () { setError(f.dataset.field, ''); };
      f.addEventListener('input', clear); f.addEventListener('change', clear);
    });
    $('seForm').addEventListener('submit', submit);
    $('seCancel').addEventListener('click', cancel);

    // 見本の画面と同じ「大原 × 9/26」を選択した状態で開く
    // （最初は何も選ばずに開きたいときは、次の1行を render(); に変えてください）
    selectCell(1, d(2));
  }
  init();
})();
// ========================工程表情報登録画面===========================