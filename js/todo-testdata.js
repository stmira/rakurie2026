/* ==========================================================
   今日のタスク画面 用 仮データ（PHP / DB が出来るまでの一時的なもの）
   PHP実装後は、todo.php からこのファイルの <script> を削除すれば不要になります。

   ■ このデータは「ログイン中の1人分」の予定です
     employee_id はすべて 1（= ログイン中の社員）にしています。
     工程カード（会社名などが出る大きいカード）は、1人1日につき1件を想定しています。
     打ち合わせなどの小さいカード（order_id が null）は、無くても、何件あっても構いません。
     ※ 実際は、PHP(SQL)側で「ログイン中の社員の分だけ」を取り出して返します。

   ■ タスクを追加するには
     schedules の中に { ... }, を1つ足すだけです。下のひな形をコピーして使ってください。

   ■ 日付の書き方
     d(0) = 今日 / d(1) = 明日 / d(-1) = 昨日
     固定の日付にしたい場合は '2026-10-30' のように書きます。
     表示されるのは「作業開始予定日 <= 表示日 <= 作業終了予定日」のタスクです。
     （複数日にまたがる作業は、開始と終了の日付を変えます）

   ■ 工程あり／なしの違い
     order_id に数字を入れる … 工程カード（会社名・概要・注番・本数が出る）
     order_id を null にする … 打ち合わせなどのカード（会社名・本数は不要なので null）

   ■ status は '未着手' / '作業中' / '完了' のどれか
   ■ schedule_id は他と重ならない番号にしてください（状態変更に使います）

   ■ ひな形（工程あり）
     { schedule_id: 40, employee_id: 1, order_id: 103, task_id: 5,
       task_name: '塗装', company_name: 'K社', summary: 'H200', order_no: '261029-03',
       detail: '備考やメモ（100文字まで）',
       status: '未着手', quantity: 5,
       actual_start_date: null, actual_end_date: null,
       planned_start_date: d(0), planned_end_date: d(0) },

   ■ ひな形（工程なし）
     { schedule_id: 41, employee_id: 1, order_id: null, task_id: 9,
       task_name: '打ち合わせ', company_name: null, summary: null, order_no: null,
       detail: '確認事項の共有',
       status: '未着手', quantity: null,
       actual_start_date: null, actual_end_date: null,
       planned_start_date: d(0), planned_end_date: d(0) },
   ========================================================== */
(function () {
  'use strict';

  // 今日を基準にした日付文字列（YYYY-MM-DD）を返す
  function d(offsetDays) {
    var t = new Date();
    t.setDate(t.getDate() + offsetDays);
    var m = t.getMonth() + 1, day = t.getDate();
    return t.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  window.TODO_TEST_DATA = {

    schedules: [

      /* ===== 今日：画面イメージと同じ2件（工程1件 ＋ 打ち合わせ1件） ===== */

      { schedule_id: 1, employee_id: 1, order_id: 101, task_id: 1,
        task_name: '図めん配布', company_name: 'N社', summary: 'H150', order_no: '260924-01',
        detail: '製造担当へ最新の製作図面を配布してください。',
        status: '作業中', quantity: 10,
        actual_start_date: d(0), actual_end_date: null,
        planned_start_date: d(0), planned_end_date: d(0) },

      { schedule_id: 2, employee_id: 1, order_id: null, task_id: 9,
        task_name: 'LWB', company_name: null, summary: null, order_no: null,
        detail: '本日の打ち合わせ・確認事項の共有',
        status: '完了', quantity: null,
        actual_start_date: d(0), actual_end_date: d(0),
        planned_start_date: d(0), planned_end_date: d(0) },

      /* ===== 昨日：工程1件 ===== */

      { schedule_id: 10, employee_id: 1, order_id: 102, task_id: 3,
        task_name: '切断', company_name: 'S社', summary: 'H200', order_no: '260925-02',
        detail: '図面どおりに切断',
        status: '完了', quantity: 4,
        actual_start_date: d(-1), actual_end_date: d(-1),
        planned_start_date: d(-1), planned_end_date: d(-1) },

      /* ===== 明日：工程1件 ===== */

      { schedule_id: 20, employee_id: 1, order_id: 103, task_id: 5,
        task_name: '塗装', company_name: 'K社', summary: 'H150', order_no: '260926-01',
        detail: '',
        status: '未着手', quantity: 8,
        actual_start_date: null, actual_end_date: null,
        planned_start_date: d(1), planned_end_date: d(1) }

      // ↓ ここに追加（直前の } のあとにカンマ , を付けるのを忘れずに）

    ],

    // 「本日出荷の案件」に出る会社。ship_date が表示日と同じものが出ます
    shipments: [
      { ship_date: d(0), company_name: 'N社' },
      { ship_date: d(1), company_name: 'K社' }
    ]
  };
})();
