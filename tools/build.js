// Dựng trang từ src/: node tools/build.js
// Mỗi bài: src/<id>/meta.json, src/<id>/noi-dung.html (3 phần kt, ud, da), src/<id>/de.json (định dạng skill trac-nghiem, mỗi câu có "phan").
// Ra: bai/<id>.html, assets/manifest.js, index.html. Thêm bài mới = thêm thư mục src/<id>/ rồi chạy lại.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'src');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const groups = JSON.parse(fs.readFileSync(path.join(SRC, 'groups.json'), 'utf8'));
const PARTS = { kt: '1. Kiến thức tổng quát', ud: '2. Ứng dụng trong đồ án', da: '3. Hiểu sâu đồ án' };
let warn = 0; const W = m => { console.log('  CẢNH BÁO: ' + m); warn++; };
const lessons = [];
for (const id of fs.readdirSync(SRC).filter(d => fs.existsSync(path.join(SRC, d, 'meta.json'))).sort()) {
  const dir = path.join(SRC, id);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  let body = fs.readFileSync(path.join(dir, 'noi-dung.html'), 'utf8');
  const de = fs.existsSync(path.join(dir, 'de.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'de.json'), 'utf8')) : { cau_hoi: [], muc_tieu: {} };
  if (meta.id !== id) W(`${id}: meta.id khác tên thư mục`);
  for (const p of Object.keys(PARTS)) {
    if (!new RegExp(`<section[^>]*id="${p}"`).test(body)) W(`${id}: thiếu <section id="${p}">`);
    const n = de.cau_hoi.filter(q => q.phan === p).length;
    if (n < 4) W(`${id}: phần ${p} chỉ có ${n} câu trắc nghiệm (cần ≥ 4)`);
    // chèn khung trắc nghiệm vào cuối mỗi section nếu chưa có
    body = body.replace(new RegExp(`(<section[^>]*id="${p}"[\\s\\S]*?)(</section>)`), (m, a, b) => a.includes(`data-quiz="${p}"`) ? m : `${a}<div class="quiz" data-quiz="${p}"></div>\n${b}`);
  }
  for (const q of de.cau_hoi) if (!q.phan) W(`${id}: câu ${q.id} thiếu "phan"`);
  const quiz = { muc_tieu: de.muc_tieu || {}, cau_hoi: de.cau_hoi.map(q => ({ id: q.id, phan: q.phan, muc_tieu: q.muc_tieu, loai: q.loai || 'mot_dap_an', cau_hoi: q.cau_hoi, dap_an: q.dap_an, dung: q.dung, loi_sai: q.loi_sai, giai_thich: q.giai_thich, doan_goc: q.doan_goc })) };
  const gr = groups.find(g => g.id === meta.gd);
  const nguon = (meta.nguon || []).map(n => `<li><b>${esc(n.ten)}</b>${n.chi_tiet ? ': ' + esc(n.chi_tiet) : ''}</li>`).join('');
  const mt = (meta.muc_tieu_bai || []).map(x => `<li>${x}</li>`).join('');
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.thu_tu + ' ' + meta.tieu_de)} · EC213</title>
<meta name="description" content="${esc(meta.tom_tat || '')}">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body data-root="../" data-id="${id}">
<div class="progress" id="bar"></div>
<div class="layout">
<nav class="side" aria-label="Mục lục"></nav>
<main>
<header class="hero">
  <div class="tag">${esc(gr ? gr.ten : meta.gd)} · Bài ${esc(meta.thu_tu)}</div>
  <h1>${esc(meta.tieu_de)}</h1>
  <p>${esc(meta.tom_tat || '')}</p>
  <div class="top"><button id="theme" type="button">Đổi sáng/tối</button><button id="reset" type="button">Xóa điểm đã làm</button><a class="btn2" href="../index.html">Trang chủ</a></div>
</header>
<div class="parts" aria-label="Các phần của bài"></div>
${mt ? `<div class="goal"><b class="t">Học xong bài này bạn làm được</b><ul>${mt}</ul></div>` : ''}
${body}
${nguon ? `<section class="refs"><h3>Tài liệu tham khảo của bài</h3><ul>${nguon}</ul><p><small class="kh">Bài giảng diễn đạt lại bằng lời của nhóm, không sao chép giáo trình. Chương và trang ghi để bạn tra lại bản gốc.</small></p></section>` : ''}
<div class="pager"></div>
</main>
</div>
<script type="application/json" id="quiz-data">${JSON.stringify(quiz).replace(/<\//g, '<\\/')}</script>
<script src="../assets/manifest.js"></script>
<script src="../assets/site.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'bai', id + '.html'), html, 'utf8');
  lessons.push({ id, gd: meta.gd, thu_tu: meta.thu_tu, tieu_de: meta.tieu_de, tom_tat: meta.tom_tat || '', so_cau: de.cau_hoi.length });
  console.log(`bai/${id}.html  (${de.cau_hoi.length} câu)`);
}
lessons.sort((a, b) => a.gd === b.gd ? String(a.thu_tu).localeCompare(String(b.thu_tu), 'vi', { numeric: true }) : groups.findIndex(g => g.id === a.gd) - groups.findIndex(g => g.id === b.gd));
fs.writeFileSync(path.join(ROOT, 'assets', 'manifest.js'), 'window.SITE = ' + JSON.stringify({ groups, lessons }, null, 1) + ';\n', 'utf8');
const idx = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EC213 · Bài giảng đồ án CRM Biti's</title>
<meta name="description" content="Bài giảng tự học cho đồ án EC213: kiến thức giáo trình CRM, ví dụ từ đồ án Biti's trên Frappe CRM, và phần hiểu sâu đồ án, mỗi phần có trắc nghiệm.">
<link rel="stylesheet" href="assets/site.css">
</head>
<body data-root="">
<div class="layout">
<nav class="side" aria-label="Mục lục"></nav>
<main>
<header class="hero">
  <div class="tag">EC213 · Quản trị quan hệ khách hàng · Nhóm 04</div>
  <h1>Bài giảng đồ án CRM Biti's</h1>
  <p>Học từ giáo trình, thấy ngay kiến thức nằm ở đâu trong đồ án, rồi hiểu sâu đồ án để trả lời được câu hỏi của thầy. Mỗi bài có ba phần, mỗi phần có trắc nghiệm.</p>
  <div class="top"><button id="theme" type="button">Đổi sáng/tối</button><button id="reset" type="button">Xóa điểm đã làm</button></div>
</header>
<div class="goal"><b class="t">Mỗi bài gồm ba phần</b>
<ol><li><b>Kiến thức tổng quát:</b> khái niệm theo giáo trình (Prior, Buttle, Maklan, <i>Customer Relationship Management</i>, 5th ed.) và sách phân tích yêu cầu (Wiegers, Hokanson), có ghi chương để tra lại.</li>
<li><b>Ứng dụng trong đồ án:</b> cùng khái niệm đó, với số liệu và bản ghi thật của đồ án Biti's.</li>
<li><b>Hiểu sâu đồ án:</b> làm gì, vì sao, cái nào của Frappe, cái nào của nhóm, và những câu thầy có thể hỏi.</li></ol></div>
<div id="home-progress"></div>
<div id="home-groups"></div>
<h2>Về trang này</h2>
<p>Đây là sản phẩm học tập của nhóm 04, môn EC213. Dữ liệu khách hàng trong đồ án là dữ liệu giả; thông tin về Biti's lấy từ nguồn công khai và đánh dấu <code>[GIẢ ĐỊNH]</code> khi nhóm tự đặt. Điểm trắc nghiệm chỉ lưu trong trình duyệt của bạn. Mã nguồn và cách thêm bài: xem <code>README.md</code> trong repo.</p>
</main>
</div>
<script src="assets/manifest.js"></script>
<script src="assets/site.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'index.html'), idx, 'utf8');
console.log(`Xong: ${lessons.length} bài, ${warn} cảnh báo.`);
