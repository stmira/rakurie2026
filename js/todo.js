/* ==========================================================
   楽ラック  今日のタスク画面
   schedules テーブルの内容を表示する
   - order_id あり … 工程カード（会社名・概要・注番・本数を表示）
   - order_id なし … 工程なしカード（打ち合わせなど）
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 状態の定義（色分けは todo.css の is-◯◯ と対応） ---------- */
  var STATUS = {
    '未着手': { cls: 'is-todo' },
    '作業中': { cls: 'is-working' },
    '完了':   { cls: 'is-done' }
  };
  var STATUS_NAMES = Object.keys(STATUS);

  var WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  /* ---------- 表示する日付 ---------- */
  // 通常は今日。画面確認用に ?date=2026-09-24 でも指定できる
  function getTargetDate() {
    var m = /[?&]date=(\d{4})-(\d{2})-(\d{2})/.exec(location.search);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toYmd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function toJa(d) {
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日（' + WEEKDAYS[d.getDay()] + '）';
  }

  /* ---------- データ取得 ----------
     schedules を tasks / orders と JOIN した1行1スケジュールの配列を返す。
     いまは画面確認用のサンプル。DB接続後は下の fetch に差し替える。
       return fetch('api/schedules.php?date=' + ymd).then(function (r) { return r.json(); });
     返す項目:
       schedule_id, employee_id, order_id, task_id, detail, status, quantity,
       actual_start_date, actual_end_date, planned_start_date, planned_end_date,
       task_name (tasks), company_name / summary / order_no (orders)
  ---------- */
  function fetchSchedules(ymd) {
    return Promise.resolve([
      {
        schedule_id: 1, employee_id: 1, order_id: 101, task_id: 1,
        task_name: '図めん配布', company_name: 'N社', summary: 'H150', order_no: '260924-01',
        detail: '製造担当へ最新の製作図面を配布してください。',
        status: '作業中', quantity: 10,
        actual_start_date: ymd, actual_end_date: null,
        planned_start_date: ymd, planned_end_date: ymd
      },
      {
        schedule_id: 2, employee_id: 1, order_id: null, task_id: 9,
        task_name: 'LWB', company_name: null, summary: null, order_no: null,
        detail: '本日の打ち合わせ・確認事項の共有',
        status: '完了', quantity: null,
        actual_start_date: ymd, actual_end_date: ymd,
        planned_start_date: ymd, planned_end_date: ymd
      }
    ]);
  }

  // 本日出荷の案件（orders 側のデータ。いまはサンプル）
  function fetchShipments(ymd) {
    return Promise.resolve([{ company_name: 'N社' }]);
  }

  /* ---------- 描画 ---------- */
  var rows = [];

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cls(status) { return (STATUS[status] || STATUS['未着手']).cls; }

  var ICON_CHEVRON = '<svg class="chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var ICON_DOC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>';
  var ICON_CHECK = '<svg class="simple-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/></svg>';

  function statusSelect(row) {
    var options = STATUS_NAMES.map(function (name) {
      return '<li><button type="button" class="status-option" data-id="' + row.schedule_id + '" data-status="' + name + '">' +
             '<span class="badge ' + cls(name) + '">' + name + '</span></button></li>';
    }).join('');
    return '' +
      '<div class="status-select">' +
        '<button type="button" class="status-btn" aria-haspopup="listbox" aria-label="状態を変更">' +
          '<span class="badge ' + cls(row.status) + '">' + esc(row.status) + '</span>' + ICON_CHEVRON +
        '</button>' +
        '<ul class="status-menu" role="listbox">' + options + '</ul>' +
      '</div>';
  }

  // 工程カード
  function processCard(row) {
    var qty = row.quantity != null
      ? '<div class="task-qty">' + esc(row.quantity) + '<small>本</small></div>'
      : '<div></div>';
    var note = row.detail
      ? '<div class="task-note">' + ICON_DOC + '<span>' + esc(row.detail) + '</span></div>'
      : '';
    return '' +
      '<article class="task-card is-process ' + cls(row.status) + '">' +
        '<div class="task-head">' +
          '<span class="check-circle" aria-hidden="true"></span>' +
          '<h2 class="task-name">' + esc(row.task_name) + '</h2>' +
          '<span class="task-tag">工程</span>' +
        '</div>' +
        '<div class="task-body">' +
          '<div class="task-info">' +
            '<div class="info-row"><span class="info-label">会社名</span><span class="info-value">' + esc(row.company_name) + '</span></div>' +
            '<div class="info-row"><span class="info-label">概要</span><span class="info-value is-sub">' + esc(row.summary) + '</span></div>' +
            '<div class="info-row"><span class="info-label">注番</span><span class="info-value is-sub">' + esc(row.order_no) + '</span></div>' +
          '</div>' +
          '<div class="task-side">' + qty + statusSelect(row) + '</div>' +
        '</div>' +
        note +
      '</article>';
  }

  // 工程なしカード（打ち合わせなど）
  function simpleCard(row) {
    return '' +
      '<article class="task-card is-simple ' + cls(row.status) + '">' +
        '<span class="accent"></span>' +
        ICON_CHECK +
        '<div class="simple-text">' +
          '<h2 class="simple-title">' + esc(row.task_name) + '</h2>' +
          (row.detail ? '<p class="simple-sub">' + esc(row.detail) + '</p>' : '') +
        '</div>' +
        statusSelect(row) +
      '</article>';
  }

  function render() {
    var list = document.getElementById('task-list');
    var withOrder = rows.filter(function (r) { return r.order_id != null; });
    var noOrder   = rows.filter(function (r) { return r.order_id == null; });

    if (rows.length === 0) {
      list.innerHTML = '<p class="empty">この日のタスクはありません。</p>';
      return;
    }
    list.innerHTML = withOrder.map(processCard).join('') + noOrder.map(simpleCard).join('');
  }

  function renderShipments(items) {
    var box = document.getElementById('shipping-list');
    box.innerHTML = items.length
      ? items.map(function (s) { return '<p class="shipping-item">' + esc(s.company_name) + '</p>'; }).join('')
      : '<p class="shipping-empty">本日出荷の案件はありません。</p>';
  }

  /* ---------- 状態ドロップダウン ---------- */
  function closeMenus() {
    document.querySelectorAll('.status-select.is-open').forEach(function (el) { el.classList.remove('is-open'); });
  }

  document.addEventListener('click', function (e) {
    var option = e.target.closest('.status-option');
    if (option) {
      var id = Number(option.dataset.id);
      rows.forEach(function (r) { if (r.schedule_id === id) r.status = option.dataset.status; });
      // DB接続後はここで更新APIを呼ぶ（例: fetch('api/update_status.php', {method:'POST', ...})）
      render();
      return;
    }
    var btn = e.target.closest('.status-btn');
    if (btn) {
      var wrap = btn.parentElement;
      var willOpen = !wrap.classList.contains('is-open');
      closeMenus();
      if (willOpen) wrap.classList.add('is-open');
      return;
    }
    closeMenus();
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenus(); });

  /* ---------- 起動 ---------- */
  var target = getTargetDate();
  var ymd = toYmd(target);
  document.getElementById('date-text').textContent = toJa(target);

  fetchSchedules(ymd).then(function (data) {
    // 表示日が予定期間に含まれるスケジュールだけを表示
    rows = data.filter(function (r) {
      return r.planned_start_date <= ymd && ymd <= r.planned_end_date;
    });
    render();
  });
  fetchShipments(ymd).then(renderShipments);
})();
