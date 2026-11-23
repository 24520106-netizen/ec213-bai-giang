// Thử trang bằng Edge chạy ẩn (DevTools): đếm câu hỏi, bấm thử câu đầu mỗi phần, đọc kết quả, báo lỗi console.
// node tools/thu-trinh-duyet.js <id-bài> [id-bài…]
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', PORT = 9448;
const ids = process.argv.slice(2), ROOT = path.resolve(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-thu-'));
  const proc = cp.spawn(EDGE, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  try {
    let tabs; for (let i = 0; i < 60; i++) { try { tabs = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch (e) { await sleep(500); } }
    const ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
    let id = 0; const pend = new Map(), errs = [];
    ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result || m.error); pend.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : 'lỗi'); if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push(m.params.args.map(a => a.value).join(' ')); });
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    await send('Page.enable'); await send('Runtime.enable'); await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    for (const lid of ids) {
      errs.length = 0;
      await send('Page.navigate', { url: 'file:///' + path.join(ROOT, 'bai', lid + '.html').replace(/\\/g, '/') }); await sleep(1500);
      const r = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => { const out = {}; out.q = document.querySelectorAll('.q').length; out.parts = [...document.querySelectorAll('.quiz')].map(b => b.dataset.quiz + ':' + b.querySelectorAll('.q').length);
        out.title = document.querySelector('h1') && document.querySelector('h1').textContent; out.nav = document.querySelectorAll('nav.side a.item').length; out.imgs = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length;
        const first = document.querySelector('.quiz .q .opt'); if (first) first.click(); const why = document.querySelector('.quiz .q .why'); out.whyAfterClick = why ? why.textContent.slice(0, 60) : null; out.leftover = /\\{\\{|TODO/.test(document.body.textContent); return out; })()` });
      console.log(lid, JSON.stringify(r.result.value), errs.length ? 'LỖI CONSOLE: ' + errs.join(' | ') : 'không lỗi console');
    }
    ws.close();
  } finally { proc.kill(); }
})();
