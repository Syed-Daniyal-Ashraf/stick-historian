const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
  const p = await b.newPage({ viewport: { width: 520, height: 1100 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || m.type()==='warning') errs.push(m.type()+' '+m.text()); });
  await p.goto('file://' + __dirname + '/../receipts-sick-log.html');
  await p.waitForFunction(() => window.film, null, { timeout: 15000 });
  await p.waitForTimeout(400);
  await p.evaluate(()=>{document.getElementById('start').hidden=true;});
  const el = await p.$('#sv');
  const times = process.argv.slice(2).map(Number);
  let i=0;
  for (const t of times) { await p.evaluate(t => window.film.renderAt(t), t); await el.screenshot({ path: `${__dirname}/frames/f${String(i).padStart(3,'0')}.png` }); i++; }
  const perf = await p.evaluate(() => { const s = performance.now(); for (let k = 0; k < 60; k++) window.film.renderAt(k * .92); return (performance.now() - s) / 60; });
  console.log('avg render ms', perf.toFixed(1));
  console.log('errors:', JSON.stringify(errs.slice(0, 10)));
  await b.close();
})();
