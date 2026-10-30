//ここは、あまりにもAIに書いてもらいすぎている所だから、バックエンドのコーディングの時に、もっと頭を悩ませてコーディングしたい
// (() => {
//   'use strict';
 
//   const API = window.EMP_API || 'employees_api.php';
//   const DEPTS = ['生産部', '営業部'];
//   const $ = (sel, root = document) => root.querySelector(sel);
 
//   const ICON = {
//     pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M14.5 6.5l3 3"/></svg>',
//     check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7"/></svg>'
//   };
 
//   /* ---------- 共通ユーティリティ ---------- */
//   function el(tag, props = {}, ...kids) {
//     const n = document.createElement(tag);
//     for (const [k, v] of Object.entries(props)) {
//       if (k === 'class') n.className = v;
//       else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
//       else if (v === true) n.setAttribute(k, '');
//       else if (v !== false && v != null) n.setAttribute(k, v);
//     }
//     kids.flat().forEach(c => n.append(c));
//     return n;
//   }
 
//   let toastTimer;
//   function toast(msg, isError = false) {
//     const t = $('#toast');
//     t.textContent = msg;
//     t.className = 'toast' + (isError ? ' error' : '');
//     t.hidden = false;
//     clearTimeout(toastTimer);
//     toastTimer = setTimeout(() => (t.hidden = true), 3000);
//   }
 
//   async function api(url, options) {
//     const res = await fetch(url, options);
//     const text = await res.text();
//     let data = null;
//     try { data = JSON.parse(text); } catch (_) { /* JSONではない応答(404ページやPHPの警告など) */ }
 
//     if (!res.ok || data === null) {
//       const msg = data && data.message
//         ? data.message
//         : (res.ok ? 'サーバーの応答が正しくありません(JSONではありません)。' : `通信に失敗しました。(HTTP ${res.status})`);
//       const err = new Error(msg);
//       err.status = res.status;
//       err.details = (data && data.errors) || [];
//       // JSONでない応答は、先頭部分を表示して原因を調べやすくする
//       err.detail = (data && data.detail) || (data === null ? text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) : '');
//       throw err;
//     }
//     return data;
//   }
 
//   // サーバー側 employees_api.php と同じルール
//   function validate(r, isNew) {
//     const e = {};
//     const id = String(r.id).trim();
//     if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 2147483647) e.employee_id = '社員IDは半角数字で入力してください。';
//     const name = r.name.trim();
//     if (!name || name.length > 50) e.employee_name = '氏名は50文字以内で入力してください。';
//     if (!DEPTS.includes(r.dept)) e.department_name = '部署を選択してください。';
//     const email = r.email.trim();
//     if (!email || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'メールアドレスを正しい形式で入力してください。';
//     if (isNew || r.password !== '') {
//       const p = r.password;
//       if (!/^[A-Za-z0-9]{8,}$/.test(p) || !/[A-Z]/.test(p) || !/[a-z]/.test(p)) {
//         e.password = 'パスワードは半角英数字８文字以上で、大文字・小文字を各１文字以上含めてください。';
//       }
//     }
//     return e;
//   }
 
//   const toPayload = (r, isNew) => ({
//     is_new: isNew,
//     employee_id: String(r.id).trim(),
//     employee_name: r.name.trim(),
//     department_name: r.dept,
//     email: r.email.trim(),
//     password: r.password
//   });
 
//   /* ---------- 一覧 ---------- */
//   // row: { key, id, name, dept, email, password, mode: 'view'|'edit'|'new', orig, errors }
//   let rows = [];
//   let seq = 0;
 
//   const body = $('#empBody');
//   const listMsg = $('#listMessage');
 
//   const makeRow = (s, mode = 'view') => ({
//     key: ++seq,
//     id: String(s.employee_id),
//     name: s.employee_name,
//     dept: s.department_name,
//     email: s.email,
//     password: '',
//     mode,
//     orig: { name: s.employee_name, dept: s.department_name, email: s.email },
//     errors: {}
//   });
 
//   const isEditing = () => rows.some(r => r.mode !== 'view');
 
//   function showListMessage(lines) {
//     listMsg.textContent = Array.isArray(lines) ? lines.join('\n') : lines;
//     listMsg.hidden = !lines || (Array.isArray(lines) && !lines.length);
//   }
 
//   function updateToolbar() {
//     const editing = isEditing();
//     $('#btnEditLabel').textContent = editing ? '保存' : '編集';
//     $('#btnEditIcon').innerHTML = editing ? ICON.check : ICON.pencil;
//     $('#btnCancelEdit').hidden = !editing;
//   }
 
//   function input(row, field, props = {}) {
//     const map = { id: 'employee_id', name: 'employee_name', dept: 'department_name', email: 'email', password: 'password' };
//     const cls = 'cell-input' + (row.errors[map[field]] ? ' invalid' : '');
//     const n = el('input', { class: cls, type: 'text', value: row[field], ...props });
//     n.addEventListener('input', () => { row[field] = n.value; n.classList.remove('invalid'); });
//     return n;
//   }
 
//   function deptSelect(row) {
//     const sel = el('select', { class: 'cell-input' + (row.errors.department_name ? ' invalid' : ''), 'aria-label': '部署' },
//       el('option', { value: '' }, '選択'),
//       DEPTS.map(d => el('option', { value: d, selected: row.dept === d }, d)));
//     sel.addEventListener('change', () => { row.dept = sel.value; sel.classList.remove('invalid'); });
//     return sel;
//   }
 
//   function renderRow(row) {
//     const tr = el('tr', { class: row.mode === 'view' ? '' : 'is-editing' });
 
//     if (row.mode === 'view') {
//       tr.append(
//         el('td', {}, row.id),
//         el('td', {}, row.name),
//         el('td', {}, row.dept),
//         el('td', {}, el('span', { class: 'mask' }, '••••••••')),
//         el('td', { title: row.email }, row.email),
//         el('td', {}, el('button', {
//           type: 'button', class: 'row-btn', 'aria-label': `${row.name}を編集`,
//           onclick: () => { row.mode = 'edit'; render(); }
//         }, '', '編集'))
//       );
//       tr.lastChild.firstChild.insertAdjacentHTML('afterbegin', ICON.pencil);
//       return tr;
//     }
 
//     const isNew = row.mode === 'new';
//     const idCell = isNew
//       ? input(row, 'id', { inputmode: 'numeric', maxlength: 10, placeholder: '社員ID', 'aria-label': '社員ID' })
//       : el('input', { class: 'cell-input', type: 'text', value: row.id, readonly: true, 'aria-label': '社員ID(変更不可)', title: '社員IDは変更できません' });
 
//     tr.append(
//       el('td', {}, idCell),
//       el('td', {}, input(row, 'name', { maxlength: 50, placeholder: '氏名', 'aria-label': '氏名' })),
//       el('td', {}, deptSelect(row)),
//       el('td', {}, input(row, 'password', {
//         type: 'password', autocomplete: 'new-password', 'aria-label': 'パスワード',
//         placeholder: isNew ? '8文字以上の英数字' : '変更する場合のみ'
//       })),
//       el('td', {}, input(row, 'email', { type: 'email', maxlength: 255, placeholder: 'メールアドレス', 'aria-label': 'メールアドレス' })),
//       el('td', {}, isNew
//         ? el('button', { type: 'button', class: 'row-btn danger', onclick: () => { rows = rows.filter(r => r !== row); render(); } }, '削除')
//         : el('button', { type: 'button', class: 'row-btn', onclick: () => { Object.assign(row, row.orig, { password: '', mode: 'view', errors: {} }); render(); } }, '取消'))
//     );
//     return tr;
//   }
 
//   function render() {
//     body.replaceChildren();
//     if (!rows.length) {
//       body.append(el('tr', {}, el('td', { colspan: 6, class: 'empty' }, '社員が登録されていません。')));
//     } else {
//       rows.forEach(r => body.append(renderRow(r)));
//     }
//     updateToolbar();
//   }
 
//   async function loadList() {
//     try {
//       const data = await api(`${API}?action=list`, { headers: { Accept: 'application/json' } });
//       // 編集中・追加中の行は残し、それ以外はサーバーの最新で置き換える
//       const editing = new Map(rows.filter(r => r.mode === 'edit').map(r => [r.id, r]));
//       const adding = rows.filter(r => r.mode === 'new');
//       rows = data.employees.map(s => editing.get(String(s.employee_id)) || makeRow(s)).concat(adding);
//       render();
//     } catch (err) {
//       console.error(err);
//       body.replaceChildren(el('tr', {}, el('td', { colspan: 6, class: 'empty' }, err.message + (err.detail ? '\n' + err.detail : ''))));
//     }
//   }
 
//   /* 保存(編集・追加した行をまとめて送信) */
//   async function saveRows() {
//     showListMessage('');
//     const targets = rows.filter(r => r.mode !== 'view');
//     const payload = [];
//     let hasError = false;
 
//     targets.forEach(r => {
//       const isNew = r.mode === 'new';
//       const changed = isNew || r.password !== '' ||
//         r.name.trim() !== r.orig.name || r.dept !== r.orig.dept || r.email.trim() !== r.orig.email;
//       r.errors = {};
//       if (!changed) return;
//       r.errors = validate(r, isNew);
//       if (Object.keys(r.errors).length) hasError = true;
//       payload.push(toPayload(r, isNew));
//     });
 
//     if (hasError) {
//       render();
//       showListMessage(['入力内容を確認してください。', ...targets.flatMap(r => Object.values(r.errors).map(m => `・社員ID ${r.id || '(未入力)'}:${m}`))]);
//       return;
//     }
 
//     if (payload.length) {
//       const btn = $('#btnEdit');
//       btn.disabled = true;
//       try {
//         await api(API, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ action: 'save', rows: payload })
//         });
//       } catch (err) {
//         showListMessage([err.message, ...err.details.map(d => `・社員ID ${d.employee_id}:${d.message}`)]);
//         return;
//       } finally {
//         btn.disabled = false;
//       }
//       toast('保存しました');
//     }
 
//     rows.forEach(r => { r.mode = 'view'; });   // 変更なしの編集行も閲覧に戻す
//     rows = rows.filter(r => r.mode === 'view');
//     await loadList();
//   }
 
//   $('#btnEdit').addEventListener('click', () => {
//     if (isEditing()) { saveRows(); return; }
//     rows.forEach(r => { r.mode = 'edit'; });
//     showListMessage('');
//     render();
//   });
 
//   $('#btnCancelEdit').addEventListener('click', () => {
//     rows = rows.filter(r => r.mode !== 'new');
//     rows.forEach(r => Object.assign(r, r.orig, { password: '', mode: 'view', errors: {} }));
//     showListMessage('');
//     render();
//   });
 
//   /* 「追加」ボタン:右側に社員登録パネルを表示/非表示 */
//   const layout = $('.emp-layout');
//   const regPanel = $('#regPanel');
//   const btnAdd = $('#btnAdd');
 
//   //追加ボタンを押して表示する
//   function openPanel() {
//     regPanel.hidden = false;
//     layout.classList.add('is-registering');
//     btnAdd.setAttribute('aria-expanded', 'true');
//     regPanel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
//     $('#fName').focus({ preventScroll: true });
//   }

 
//   //非表示になる
//   function closePanel() {
//     regPanel.hidden = true;
//     layout.classList.remove('is-registering');
//     btnAdd.setAttribute('aria-expanded', 'false');
//   }
 
//   btnAdd.addEventListener('click', () => (regPanel.hidden ? openPanel() : closePanel()));
 
//   /* ---------- 右側:社員登録フォーム ---------- */
//   const form = $('#regForm');
//   const f = {
//     employee_name: $('#fName'),
//     employee_id: $('#fId'),
//     department_name: $('#fDept'),
//     password: $('#fPw'),
//     email: $('#fEmail')
//   };
 
//   function setFieldError(name, msg) {
//     const wrap = $(`.field[data-field="${name}"]`);
//     const p = $('.field-error', wrap);
//     wrap.classList.toggle('has-error', !!msg);
//     p.textContent = msg || '';
//     p.hidden = !msg;
//   }
 
//   function clearFormErrors() {
//     Object.keys(f).forEach(k => setFieldError(k, ''));
//     $('#formError').hidden = true;
//   }
 
//   Object.entries(f).forEach(([name, input]) => {
//     const evt = input.tagName === 'SELECT' ? 'change' : 'input';
//     input.addEventListener(evt, () => setFieldError(name, ''));
//   });
 
//   $('#fPwToggle').addEventListener('click', (e) => {
//     const btn = e.currentTarget;
//     const show = f.password.type === 'password';
//     f.password.type = show ? 'text' : 'password';
//     btn.classList.toggle('is-visible', show);
//     btn.setAttribute('aria-label', show ? 'パスワードを隠す' : 'パスワードを表示する');
//   });
 
//   $('#btnReset').addEventListener('click', () => {
//     form.reset();
//     f.password.type = 'password';
//     $('#fPwToggle').classList.remove('is-visible');
//     clearFormErrors();
//     closePanel();
//   });
 
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     clearFormErrors();
 
//     const draft = {
//       id: f.employee_id.value,
//       name: f.employee_name.value,
//       dept: f.department_name.value,
//       email: f.email.value,
//       password: f.password.value
//     };
 
//     // 全項目必須
//     const errors = validate(draft, true);
//     if (!draft.name.trim()) errors.employee_name = '氏名を入力してください。';
//     if (!draft.id.trim()) errors.employee_id = '社員IDを入力してください。';
//     if (!draft.dept) errors.department_name = '部署を選択してください。';
//     if (!draft.password) errors.password = '初期パスワードを入力してください。';
//     if (!draft.email.trim()) errors.email = 'メールアドレスを入力してください。';
 
//     if (Object.keys(errors).length) {
//       Object.entries(errors).forEach(([k, m]) => setFieldError(k, m));
//       const first = Object.keys(f).find(k => errors[k]);
//       if (first) f[first].focus();
//       return;
//     }
 
//     const btn = $('#btnRegister');
//     btn.disabled = true;
//     try {
//       await api(API, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ action: 'save', rows: [toPayload(draft, true)] })
//       });
//       toast('社員を登録しました');
//       $('#btnReset').click();
//       await loadList();
//     } catch (err) {
//       if (err.details && err.details.length) {
//         err.details.forEach(d => setFieldError(d.field, d.message));
//       } else if (err.status === 409) {
//         setFieldError('employee_id', err.message);
//       } else {
//         const box = $('#formError');
//         box.textContent = err.message;
//         box.hidden = false;
//       }
//     } finally {
//       btn.disabled = false;
//     }
//   });
 
//   /* ---------- 初期表示 ---------- */
//   // 一覧はPHPがページに埋め込んでいるので、通信を待たずにそのまま使う
//   const initial = document.getElementById('empData');
//   updateToolbar();
//   if (initial) {
//     try {
//       const data = JSON.parse(initial.textContent);
//       if (data.error) {
//         // 取得に失敗していた場合は、PHPが表示したエラー文をそのまま残す
//       } else {
//         rows = data.employees.map(s => makeRow(s));
//         render();
//       }
//     } catch (err) {
//       console.error(err);
//       loadList();
//     }
//   } else {
//     loadList();
//   }
// })();