// ========================お客様情報登録画面===========================
// customer.php から <script src="js/customer.js"></script> で読み込みます。
(function () {
  'use strict';
 
  var form = document.getElementById('customerForm');
  var nextAction = document.getElementById('next_action');
  if (!form) return;
 
  // ---------- ① 右のテーブルの高さを、左の基本情報フォームに合わせる ----------
  var leftCol = document.querySelector('.form-col-left');
  var rightCol = document.querySelector('.form-col-right');
  var wrapper = document.querySelector('.process-table-wrapper');
  var infoNote = rightCol ? rightCol.querySelector('.info-note') : null;
  var oneColumn = window.matchMedia('(max-width: 900px)');
 
  function syncTableHeight() {
    if (!leftCol || !rightCol || !wrapper) return;
 
    // スマホ・タブレット（1列表示）は固定の高さでスクロール
    if (oneColumn.matches) {
      wrapper.style.maxHeight = '420px';
      return;
    }
 
    // 右カラムの「テーブル以外」の高さ（見出し・説明文・下の注釈）を引く
    var topOffset = wrapper.offsetTop - rightCol.offsetTop;
    var noteHeight = 0;
    if (infoNote) {
      noteHeight = infoNote.offsetHeight +
        parseFloat(getComputedStyle(infoNote).marginTop || 0);
    }
 
    var h = leftCol.offsetHeight - topOffset - noteHeight;
    wrapper.style.maxHeight = Math.max(h, 200) + 'px';
  }
 
  syncTableHeight();
  window.addEventListener('load', syncTableHeight);   // フォント読み込み後に再計算
  window.addEventListener('resize', syncTableHeight);
  if (window.ResizeObserver && leftCol) {
    // 概要欄のサイズ変更など、左カラムの高さが変わったときも追従
    new ResizeObserver(syncTableHeight).observe(leftCol);
  }
 
  // ---------- ② 登録ボタンの動き ----------
  // 通常の「お客様情報を登録」ボタン：遷移指定をクリアして送信
  form.addEventListener('submit', function () {
    if (!form.dataset.toProcess) {
      nextAction.value = '';
    }
  });
 
  // 「工程表情報を登録」ボタン：お客様情報を保存してから工程表情報の登録へ進む
  // （HTMLの onclick="submitToProcess()" から呼ばれるため、グローバルに公開）
  window.submitToProcess = function () {
    // 必須項目（注文ID・会社名・納期）のチェック
    if (!form.reportValidity()) {
      return;
    }
    nextAction.value = 'process';   // save_customer.php 側でこの値を見て工程表登録へ遷移
    form.dataset.toProcess = '1';
    form.submit();
  };
})();
// ========================お客様情報登録画面===========================