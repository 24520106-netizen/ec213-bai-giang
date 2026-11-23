/* Mã dùng chung: mục lục, trắc nghiệm, điểm, trang chủ. Không thư viện ngoài, chạy được cả khi mở file:// */
(function () {
  'use strict';
  var SITE = window.SITE || { lessons: [], groups: [] };
  var KEY = 'ec213-bg:';
  var store = {
    get: function (k) { try { return localStorage.getItem(KEY + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(KEY + k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(KEY + k); } catch (e) {} }
  };
  var PARTS = [['kt', 'Kiến thức'], ['ud', 'Ứng dụng'], ['da', 'Đồ án']];
  var root = document.body.getAttribute('data-root') || '';
  var curId = document.body.getAttribute('data-id');
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function score(id, part) { var s = store.get(id + ':' + part); if (!s) return null; var p = s.split('/').map(Number); return { r: p[0], n: p[1] }; }
  function lessonScore(l) { var r = 0, n = 0, done = 0; PARTS.forEach(function (p) { var s = score(l.id, p[0]); if (s) { r += s.r; n += s.n; done++; } }); return { r: r, n: n, done: done }; }

  /* ---------- mục lục bên trái ---------- */
  function buildNav() {
    var nav = document.querySelector('nav.side'); if (!nav) return;
    nav.innerHTML = '';
    var a = el('a', 'brand', 'EC213 · Bài giảng'); a.href = root + 'index.html'; nav.appendChild(a);
    nav.appendChild(el('div', 'sub', 'Đồ án CRM Biti\'s · Frappe CRM'));
    SITE.groups.forEach(function (g) {
      nav.appendChild(el('h2', null, g.ten));
      SITE.lessons.filter(function (l) { return l.gd === g.id; }).forEach(function (l) {
        var it = el('a', 'item' + (l.id === curId ? ' cur' : ''));
        it.href = root + 'bai/' + l.id + '.html';
        it.appendChild(el('span', null, l.thu_tu + ' ' + l.tieu_de));
        var s = lessonScore(l), sc = el('span', 'sc' + (s.done === 3 ? ' done' : ''), s.done ? s.r + '/' + s.n : '');
        it.appendChild(sc); nav.appendChild(it);
      });
      (g.sap_co || []).forEach(function (t) { var it = el('a', 'item soon'); it.appendChild(el('span', null, t + ' (sắp có)')); nav.appendChild(it); });
    });
  }

  /* ---------- trắc nghiệm ---------- */
  var LET = ['A', 'B', 'C', 'D', 'E'];
  function mountQuiz(box, part, data) {
    var qs = (data.cau_hoi || []).filter(function (q) { return q.phan === part; });
    var mt = data.muc_tieu || {};
    var head = el('h4', null, 'Trắc nghiệm: ' + (PARTS.filter(function (p) { return p[0] === part; })[0] || ['', part])[1]);
    var label = el('div', 'qscore'); box.appendChild(head); box.appendChild(label);
    var saved = store.get(curId + ':' + part);
    label.textContent = saved ? 'Lần gần nhất: ' + saved + ' câu đúng' : 'Chọn đáp án; kết quả hiện ngay. ' + qs.length + ' câu.';
    var right = 0, done = 0, missed = {}, lois = [];
    var diag = el('div', 'diag');
    function finish() {
      store.set(curId + ':' + part, right + '/' + qs.length);
      label.textContent = 'Hoàn thành: ' + right + '/' + qs.length + ' câu đúng';
      var parts = [];
      Object.keys(missed).forEach(function (m) { parts.push('Mục tiêu "' + (mt[m] || m) + '": sai ' + missed[m] + ' câu, nên đọc lại.'); });
      if (!parts.length) parts.push('Đúng hết. Có thể sang phần tiếp theo.');
      diag.innerHTML = ''; var ul = el('div'); parts.forEach(function (t) { ul.appendChild(el('div', null, t)); });
      if (lois.length) { var u = lois.filter(function (x, i) { return lois.indexOf(x) === i; }); ul.appendChild(el('div', null, 'Lỗi hiểu nhầm đã gặp: ' + u.join('; ') + '.')); }
      diag.appendChild(ul); diag.className = 'diag show'; refreshScores();
    }
    qs.forEach(function (q, qi) {
      var multi = q.loai === 'nhieu_dap_an';
      var d = el('div', 'q'), p = el('p', 'qt', (qi + 1) + '. ' + q.cau_hoi);
      if (multi) p.appendChild(el('span', 'multi', 'Nhiều đáp án'));
      d.appendChild(p);
      var keys = Object.keys(q.dap_an), btns = {}, picked = {}, why = el('div', 'why'), checked = false;
      function reveal() {
        checked = true;
        var okAll = true; var wrongPicked = [];
        keys.forEach(function (k) {
          var isRight = q.dung.indexOf(k) >= 0, isPicked = !!picked[k]; btns[k].disabled = true; btns[k].classList.remove('sel');
          if (isRight && isPicked) btns[k].classList.add('ok');
          else if (isRight && !isPicked) { btns[k].classList.add('miss'); okAll = false; }
          else if (!isRight && isPicked) { btns[k].classList.add('bad'); okAll = false; wrongPicked.push(k); }
        });
        var html = '<b class="v">' + (okAll ? 'Đúng. ' : 'Chưa đúng. ') + '</b>';
        why.innerHTML = ''; var s = el('span'); s.innerHTML = ''; s.appendChild(document.createTextNode((okAll ? 'Đúng. ' : 'Chưa đúng. ') + (q.giai_thich || '')));
        why.appendChild(s);
        wrongPicked.forEach(function (k) { if (q.loi_sai && q.loi_sai[k]) { var l = el('span', 'loi', 'Lỗi hiểu nhầm của đáp án ' + k + ': ' + q.loi_sai[k]); why.appendChild(l); lois.push(q.loi_sai[k]); } });
        if (q.doan_goc) why.appendChild(el('span', 'loi', 'Nguồn: ' + q.doan_goc)), why.lastChild.style.color = 'var(--muted)';
        why.classList.add('show'); done++; if (okAll) right++; else missed[q.muc_tieu] = (missed[q.muc_tieu] || 0) + 1;
        label.textContent = 'Đã làm ' + done + '/' + qs.length + ' · đúng ' + right;
        if (cbtn) cbtn.disabled = true;
        if (done === qs.length) finish();
      }
      var cbtn = null;
      keys.forEach(function (k) {
        var b = el('button', 'opt'); b.type = 'button';
        b.appendChild(el('span', 'L', k + '.')); b.appendChild(el('span', null, q.dap_an[k]));
        b.addEventListener('click', function () {
          if (checked) return;
          if (multi) { picked[k] = !picked[k]; b.classList.toggle('sel', picked[k]); }
          else { picked = {}; picked[k] = true; reveal(); }
        });
        btns[k] = b; d.appendChild(b);
      });
      if (multi) { cbtn = el('button', 'btn', 'Kiểm tra câu này'); cbtn.type = 'button'; cbtn.addEventListener('click', function () { if (Object.keys(picked).some(function (k) { return picked[k]; })) reveal(); }); d.appendChild(cbtn); }
      d.appendChild(why); box.appendChild(d);
    });
    box.appendChild(diag);
  }

  function initLesson() {
    var data = null, tag = document.getElementById('quiz-data');
    if (tag) { try { data = JSON.parse(tag.textContent); } catch (e) { console.error('quiz-data lỗi', e); } }
    document.querySelectorAll('.quiz[data-quiz]').forEach(function (b) { if (data) mountQuiz(b, b.getAttribute('data-quiz'), data); });
    var pb = document.querySelector('.parts');
    if (pb) { pb.innerHTML = ''; PARTS.forEach(function (p) { var a = el('a'); a.href = '#' + p[0]; a.appendChild(document.createTextNode(p[1])); var s = score(curId, p[0]); a.appendChild(el('span', 'sc' + (s && s.r === s.n ? ' done' : ''), s ? s.r + '/' + s.n : '')); pb.appendChild(a); }); }
    var bar = document.getElementById('bar');
    addEventListener('scroll', function () { var h = document.documentElement; if (bar) bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%'; }, { passive: true });
  }
  function refreshScores() { buildNav(); var pb = document.querySelector('.parts'); if (pb && curId) { PARTS.forEach(function (p, i) { var s = score(curId, p[0]); var sc = pb.children[i] && pb.children[i].querySelector('.sc'); if (sc) { sc.textContent = s ? s.r + '/' + s.n : ''; sc.className = 'sc' + (s && s.r === s.n ? ' done' : ''); } }); } }

  function pager() {
    var host = document.querySelector('.pager'); if (!host || !curId) return;
    var i = SITE.lessons.findIndex(function (l) { return l.id === curId; }); host.innerHTML = '';
    var mk = function (l, dir) { var a = el('a'); a.href = root + 'bai/' + l.id + '.html'; a.appendChild(el('small', null, dir)); a.appendChild(document.createTextNode(l.thu_tu + ' ' + l.tieu_de)); return a; };
    if (i > 0) host.appendChild(mk(SITE.lessons[i - 1], '← Bài trước')); else host.appendChild(el('span'));
    if (i >= 0 && i < SITE.lessons.length - 1) host.appendChild(mk(SITE.lessons[i + 1], 'Bài sau →'));
  }

  /* ---------- trang chủ ---------- */
  function home() {
    var box = document.getElementById('home-groups'); if (!box) return;
    var totalR = 0, totalN = 0, totalQ = 0;
    SITE.groups.forEach(function (g) {
      box.appendChild(el('h2', null, g.ten)); if (g.mo_ta) box.appendChild(el('p', null, g.mo_ta));
      var grid = el('div', 'grid');
      SITE.lessons.filter(function (l) { return l.gd === g.id; }).forEach(function (l) {
        var c = el('a', 'card'); c.href = root + 'bai/' + l.id + '.html';
        c.appendChild(el('b', null, l.thu_tu + ' ' + l.tieu_de)); c.appendChild(el('span', null, l.tom_tat || ''));
        var s = lessonScore(l); totalQ += 3; totalN += s.done; totalR += s.r;
        c.appendChild(el('span', 'sc', s.done ? 'Đã làm ' + s.done + '/3 phần trắc nghiệm · ' + s.r + '/' + s.n + ' câu đúng' : 'Chưa làm trắc nghiệm'));
        grid.appendChild(c);
      });
      (g.sap_co || []).forEach(function (t) { var c = el('div', 'card soon'); c.appendChild(el('b', null, t)); c.appendChild(el('span', null, 'Sắp có')); grid.appendChild(c); });
      box.appendChild(grid);
    });
    var pr = document.getElementById('home-progress');
    if (pr) { pr.innerHTML = ''; pr.appendChild(el('p', null, 'Đã làm ' + totalN + '/' + totalQ + ' phần trắc nghiệm.')); var b = el('div', 'bar'); var i = el('i'); i.style.width = (totalQ ? totalN / totalQ * 100 : 0) + '%'; b.appendChild(i); pr.appendChild(b); }
  }

  function wireTop() {
    var t = document.getElementById('theme');
    if (t) t.addEventListener('click', function () { var r = document.documentElement; var dark = r.dataset.theme === 'dark' || (!r.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches); r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem(KEY + 'theme', r.dataset.theme); } catch (e) {} });
    try { var th = localStorage.getItem(KEY + 'theme'); if (th) document.documentElement.dataset.theme = th; } catch (e) {}
    var r = document.getElementById('reset');
    if (r) r.addEventListener('click', function () { if (!confirm('Xóa điểm trắc nghiệm đã lưu trong trình duyệt này?')) return; SITE.lessons.forEach(function (l) { PARTS.forEach(function (p) { store.del(l.id + ':' + p[0]); }); }); location.reload(); });
  }
  wireTop(); buildNav(); if (curId) { initLesson(); pager(); } home();
})();
