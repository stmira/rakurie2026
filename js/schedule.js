// ========================工程表一覧画面===========================
// データは API (api/schedules.php) から取得。取得できない場合はサンプルを表示します。
// API が返す JSON: { employees:[], schedules:[], purchase_orders:[], leaves:[] }
(function () {
  'use strict';
  var DAYS = 6;                         // 一度に表示する日数
  var API = 'api/schedules.php';
  var WD = ['日', '月', '火', '水', '木', '金', '土'];
  var HOLIDAYS = [];                    // 祝日・会社休日 'YYYY-MM-DD'
  var CLS = { '未着手': 'todo', '作業中': 'doing', '完了': 'done', '遅延': 'late' };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function key(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function add(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var T = key(today);
  var state = { start: today, q: '', emp: null, data: { employees: [], schedules: [], purchase_orders: [], leaves: [] } };

  // ---------- サンプルデータ（今日を基準に生成） ----------
  function sample() {
    var d = function (n) { return key(add(today, n)); };
    function s(id, emp, task, co, detail, ps, pe, as, ae) {
      return { schedule_id: id, employee_id: emp, task_name: task, company_name: co, detail: detail, planned_start_date: d(ps), planned_end_date: d(pe), actual_start_date: as == null ? null : d(as), actual_end_date: ae == null ? null : d(ae) };
    }
    return {
      employees: [
        { employee_id: 1, name: '大原', role: '板金・生産管理' }, { employee_id: 2, name: 'Tさん', role: '設計・作図' },
        { employee_id: 3, name: 'Hさん', role: '製造・溶接' }, { employee_id: 4, name: 'Yさん', role: 'アームロボット' }],
      purchase_orders: [
        { purchase_order_id: 1, summary: 'H150', spec: '7m×1本・8m×6本', supplier_name: 'K社', arrival_date: d(0), status: '完了' },
        { purchase_order_id: 2, summary: 'プレス M10', spec: 'L2196×6本', supplier_name: 'N社', arrival_date: d(0), status: '遅延' },
        { purchase_order_id: 3, summary: 'プレス M10', spec: 'L290×90本', supplier_name: 'N社', arrival_date: d(1) },
        { purchase_order_id: 4, summary: 'H150', spec: '8m×3本', supplier_name: 'M社（O社）', arrival_date: d(4) },
        { purchase_order_id: 5, summary: '平鋼 350×150×9t', spec: '1枚', supplier_name: 'M林業（D鋼業）', arrival_date: d(5) }],
      schedules: [
        s(1, 1, '図めん配布', 'K社', '', 0, 0, 0, 0), s(2, 1, '発注業務', 'N社', '', 0, 0, 0, null),
        s(3, 1, 'LWB', 'N社', '', -2, -1, -2, null), s(4, 1, '封筒作成', 'K社', '', 0, 0),
        s(5, 1, '封筒作成', 'M社', '', 4, 4), s(6, 1, '発注業務', 'M社', '', 4, 4),
        s(7, 2, '作図', 'M林業', '', 0, 0, 0, null), s(8, 2, '作図', 'O工業', '', 1, 1),
        s(9, 2, '図面確認', 'O工業', '', 2, 2), s(10, 2, '作図', 'R屋', '', 4, 4), s(11, 2, '作図', 'A屋', '', 5, 5),
        s(12, 3, 'ポスト溶接', 'N社', '', 0, 0, 0, null), s(13, 3, '出荷準備', 'Q S', '', 2, 2),
        s(14, 3, 'ポスト溶接', 'K社H社', '', 4, 4), s(15, 3, 'ベース製作', 'M社', '', 5, 5),
        s(16, 4, 'アームロボット', 'N社', '', 0, 0, 0, 0), s(17, 4, 'アームロボット', 'K社H社', '', 2, 2),
        s(18, 4, 'アームロボット', 'K社H社 51・Y社 9', '', 4, 4), s(19, 4, 'アームロボット', 'Y社 34・M社 3', '', 5, 5)],
      leaves: [{ employee_id: 1, date: d(1) }]
    };
  }

  function load() {
    return fetch(API, { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .catch(function () { return sample(); });
  }

  // ---------- 表示ロジック ----------
  // その日の状態：完了日以降=完了 / 着手済み=作業中 / 未着手のまま日が過ぎた=遅延
  function dayStatus(s, d) {
    if (s.actual_end_date && d >= s.actual_end_date) return '完了';
    if (s.actual_start_date && s.actual_start_date <= d) return '作業中';
    return d < T ? '遅延' : '未着手';
  }

  // 予定日のタスク ＋ 作業中のまま予定日を過ぎたタスク（繰越：一番上に表示）
  function tasksFor(empId, d) {
    var list = [];
    state.data.schedules.forEach(function (s) {
      if (s.employee_id !== empId) return;
      if (s.actual_end_date && d > s.actual_end_date) return;
      var inPlan = s.planned_start_date <= d && d <= s.planned_end_date;
      var carried = !inPlan && d > s.planned_end_date && d <= T && !!s.actual_start_date && s.actual_start_date <= d;
      if (inPlan || carried) list.push({ s: s, carried: carried, st: dayStatus(s, d) });
    });
    return list.sort(function (a, b) { return (b.carried ? 1 : 0) - (a.carried ? 1 : 0); });
  }

  function match(text) { return !state.q || text.toLowerCase().indexOf(state.q) >= 0; }

  function card(title, st, lines, carried) {
    return '<div class="sc-card ' + CLS[st] + '"><div class="sc-card-top"><b>' + esc(title) + '</b><span class="sc-st">' +
      (carried ? '<span class="sc-carry">繰越</span>' : '') + st + '</span></div>' +
      lines.filter(Boolean).map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div>';
  }

  function render() {
    var data = state.data, days = [], i;
    for (i = 0; i < DAYS; i++) days.push(add(state.start, i));
    var keys = days.map(key), grid = $('scGrid');
    grid.style.setProperty('--days', DAYS);

    var html = '<div class="sc-h corner">担当／作業日</div>';
    days.forEach(function (d, i) {
      var off = d.getDay() === 0 || HOLIDAYS.indexOf(keys[i]) >= 0;
      html += '<div class="sc-h' + (keys[i] === T ? ' today' : '') + (off ? ' off' : '') + '">' + (d.getMonth() + 1) + '/' + d.getDate() +
        '（' + WD[d.getDay()] + '）' + (keys[i] === T ? '<small>今日</small>' : '') + '</div>';
    });

    var rows = '';
    // 入荷予定行（purchase_orders）
    var cells = '', any = false;
    keys.forEach(function (k, i) {
      var off = days[i].getDay() === 0 || HOLIDAYS.indexOf(k) >= 0;
      var cs = data.purchase_orders.filter(function (p) {
        return p.arrival_date === k && match([p.summary, p.spec, p.supplier_name].join(' ').toLowerCase());
      }).map(function (p) {
        any = true;
        return card(p.summary, p.status || (k < T ? '完了' : '未着手'), [p.spec, p.supplier_name]);
      });
      cells += '<div class="sc-cell' + (off ? ' off' : '') + '">' + (off ? '<span class="sc-offlabel">休日</span>' : '') + (cs.join('') || (off ? '' : '<span class="none">—</span>')) + '</div>';
    });
    if (any || !state.q) rows += '<div class="sc-rh"><b><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 17.5a1.5 1.5 0 1 0 0 .01zM17 17.5a1.5 1.5 0 1 0 0 .01z"/></svg>入荷予定</b><span>部材・数量・入荷元</span></div>' + cells;

    // 担当者ごとの行（schedules）
    data.employees.forEach(function (e) {
      if (state.emp && !state.emp[e.employee_id]) return;
      var any2 = false, cl = '';
      keys.forEach(function (k, i) {
        var off = days[i].getDay() === 0 || HOLIDAYS.indexOf(k) >= 0;
        var leave = data.leaves.some(function (l) { return l.employee_id === e.employee_id && l.date === k; });
        var cs = tasksFor(e.employee_id, k).filter(function (t) {
          return match([t.s.company_name, t.s.detail, t.s.task_name].join(' ').toLowerCase());
        }).map(function (t) {
          any2 = true;
          return card(t.s.task_name, t.st, [t.s.detail, t.s.company_name], t.carried);
        });
        cl += '<div class="sc-cell' + (off ? ' off' : '') + '">' + (off ? '<span class="sc-offlabel">休日</span>' : '') +
          (leave ? '<span class="sc-leave">有休</span>' : '') + (cs.join('') || (off || leave ? '' : '<span class="none">—</span>')) + '</div>';
      });
      if (any2 || !state.q) rows += '<div class="sc-rh"><b>' + esc(e.name) + '</b><span>' + esc(e.role) + '</span></div>' + cl;
    });

    grid.innerHTML = html + (rows || '<div class="sc-empty">該当する予定はありません。</div>');

    var a = days[0], b = days[DAYS - 1];
    $('scRange').textContent = a.getFullYear() + '年' + (a.getMonth() + 1) + '月' + a.getDate() + '日〜' +
      (b.getMonth() !== a.getMonth() ? (b.getMonth() + 1) + '月' : '') + b.getDate() + '日';
  }

  // ---------- 絞り込み（担当者） ----------
  function buildFilter() {
    var p = $('scFilterPanel');
    p.innerHTML = '<label><input type="checkbox" id="scAll" checked>全員</label><hr>' + state.data.employees.map(function (e) {
      return '<label><input type="checkbox" class="scEmp" value="' + e.employee_id + '" checked>' + esc(e.name) + '</label>';
    }).join('');
    p.addEventListener('change', function (ev) {
      var boxes = [].slice.call(p.querySelectorAll('.scEmp'));
      if (ev.target.id === 'scAll') boxes.forEach(function (b) { b.checked = ev.target.checked; });
      var sel = boxes.filter(function (b) { return b.checked; });
      $('scAll').checked = sel.length === boxes.length;
      state.emp = sel.length === boxes.length ? null : {};
      if (state.emp) sel.forEach(function (b) { state.emp[b.value] = true; });
      var c = $('scFilterCount');
      c.hidden = !state.emp; c.textContent = sel.length;
      render();
    });
  }

  function init() {
    $('scSearch').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
    $('scPrev').addEventListener('click', function () { state.start = add(state.start, -DAYS); render(); });
    $('scNext').addEventListener('click', function () { state.start = add(state.start, DAYS); render(); });
    $('scToday').addEventListener('click', function () { state.start = today; render(); });
    $('scFilterBtn').addEventListener('click', function (e) { e.stopPropagation(); var p = $('scFilterPanel'); p.hidden = !p.hidden; });
    document.addEventListener('click', function (e) { var p = $('scFilterPanel'); if (!p.contains(e.target)) p.hidden = true; });
    load().then(function (d) { state.data = d; buildFilter(); render(); });
  }
  if ($('scGrid')) init();
})();
// ========================工程表一覧画面===========================
