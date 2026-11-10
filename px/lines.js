const { chromium } = require('playwright');
(async () => { const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})); const p = await b.newPage();
 await p.goto('file://' + __dirname + '/../pliny-vesuvius.html'); await p.waitForFunction(() => window.film); await p.waitForTimeout(400);
 console.log(JSON.stringify(await p.evaluate(() => { const W=window.film, c=document.getElementById('caps'); let max=0, at=0, gapsOver=[]; 
   for(let t=0;t<W.TOTAL;t+=.05){ W.renderAt(t); const ys=new Set([...c.querySelectorAll('text.cap')].map(e=>e.getAttribute('y'))); if(ys.size>max){max=ys.size;at=t;} }
   // narration words without a subtitle on screen
   let uncovered=[]; for(const s of W.SHOTS) for(const w of s.words){ W.renderAt(w.t+.1); if(!c.querySelector('text.cap')) uncovered.push(w.w); }
   return {maxLines:max, at:+at.toFixed(2), chunks:W.SUBS.length, uncoveredWords:uncovered}; })));
 await b.close(); })();
