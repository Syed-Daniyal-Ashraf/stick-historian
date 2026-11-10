const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
  const out = {};
  const p = await b.newPage({ viewport: { width: 520, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/../monopoly-magie.html');
  await p.waitForFunction(() => window.film); await p.evaluate(()=>window.__fontsReady); await p.waitForTimeout(300);
  // 1. seek determinism: same t gives identical SVG regardless of what was rendered before
  out.determinism = await p.evaluate(() => { const W = window.film, w = document.getElementById('world'), c = document.getElementById('caps');
    const ts = [...Array(60)].map((_, i) => +(i * 0.925 + 0.13).toFixed(3)); let bad = [];
    const ref = ts.map(t => { W.renderAt(t); return w.innerHTML + c.innerHTML; });
    const order = [...ts.keys()].sort((a, b) => Math.sin(a * 7.1) - Math.sin(b * 7.1));
    for (const i of order) { W.renderAt(ts[i]); if (w.innerHTML + c.innerHTML !== ref[i]) bad.push(ts[i]); }
    return { checked: ts.length, mismatches: bad }; });
  // 2. grip / joint attachment: max distance between a gripping hand and its target, sampled every 1/30 s
  out.grip = await p.evaluate(() => { const W = window.film; W.DBG.maxGrip = 0; W.DBG.log=[]; for (let t = 0; t < W.TOTAL; t += 1/30) W.renderAt(t); return { maxGripErrorUnits: +W.DBG.maxGrip.toFixed(2), at: +(W.DBG.gripAt||0).toFixed(2), who: W.DBG.who||null, over2: W.DBG.log.length, sample: W.DBG.log.filter((_, i) => i % 6 === 0).slice(0, 40) }; });
  // 3. captions inside safe area and max 2 lines
  out.captions = await p.evaluate(() => { const W = window.film, c = document.getElementById('caps'); let worst = { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9 }, maxLines = 0;
    for (let t = 0; t < W.TOTAL; t += 0.1) { W.renderAt(t); const texts = c.querySelectorAll('text.cap'); const sv=document.getElementById('sv').getBoundingClientRect(), k=1080/sv.width; const groups = c.querySelectorAll(':scope > g[opacity]');
      groups.forEach(g => { maxLines = Math.max(maxLines, g.querySelectorAll('text').length); });
      texts.forEach(tx => { const r = tx.getBoundingClientRect(); const bb={x:(r.left-sv.left)*k,y:(r.top-sv.top)*k,width:r.width*k,height:r.height*k}; worst.minX = Math.min(worst.minX, bb.x); worst.maxX = Math.max(worst.maxX, bb.x + bb.width); worst.minY = Math.min(worst.minY, bb.y); worst.maxY = Math.max(worst.maxY, bb.y + bb.height); }); }
    for (const k in worst) worst[k] = Math.round(worst[k]); return { ...worst, maxLines }; });
  // 4. perf
  out.renderMs = await p.evaluate(() => { const W = window.film, s = performance.now(); for (let k = 0; k < 300; k++) W.renderAt((k * 0.37) % W.TOTAL); return +((performance.now() - s) / 300).toFixed(2); });
  // 5. controls: play advances time, pause holds, scrub seeks, restart goes to 0
  await p.click('#start'); await p.waitForTimeout(1200);
  const t1 = await p.evaluate(() => window.film.state.t);
  await p.click('#pp'); const t2 = await p.evaluate(() => window.film.state.t); await p.waitForTimeout(600); const t3 = await p.evaluate(() => window.film.state.t);
  await p.$eval('#scrub', el => { el.value = '30.2'; el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); });
  const t4 = await p.evaluate(() => [window.film.state.t, document.getElementById('now').textContent.slice(0, 8)]);
  await p.click('#rs'); await p.waitForTimeout(300); const t5 = await p.evaluate(() => [window.film.state.t, window.film.state.playing]);
  await p.click('#pp');
  await p.keyboard.press('ArrowRight'); const t6 = await p.evaluate(() => window.film.state.t);
  out.controls = { afterPlay1_2s: +t1.toFixed(2), pausedAt: +t2.toFixed(2), afterWaitPaused: +t3.toFixed(2), scrubTo31_2: [+t4[0].toFixed(2), t4[1]], restart: [+t5[0].toFixed(2), t5[1]], arrowRight: +t6.toFixed(2) };
  // 6. aspect ratio at several viewport sizes
  out.aspect = [];
  for (const [w, h] of [[360, 640], [390, 844], [768, 1024], [1280, 720], [1920, 1080], [300, 1000]]) {
    await p.setViewportSize({ width: w, height: h }); await p.waitForTimeout(100);
    out.aspect.push(await p.evaluate(([w, h]) => { const r = document.getElementById('stage').getBoundingClientRect(); const ctr = document.querySelector('.controls').getBoundingClientRect();
      return { viewport: `${w}x${h}`, stage: `${Math.round(r.width)}x${Math.round(r.height)}`, ratio: +(r.width / r.height).toFixed(4), fitsWidth: r.right <= w + 0.5, controlsBottom: Math.round(ctr.bottom) }; }, [w, h]));
  }
  await p.setViewportSize({ width: 1280, height: 720 }); await p.screenshot({ path: __dirname + '/frames/page-1280x720.png' });
  await p.setViewportSize({ width: 390, height: 844 }); await p.screenshot({ path: __dirname + '/frames/page-390x844.png' });
  out.errors = errs;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
