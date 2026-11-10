const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'); const path=require('path');
const OUTDIR=__dirname+'/out'; fs.mkdirSync(OUTDIR,{recursive:true});
(async () => {
  const FPS = +(process.env.FPS||30), W = +(process.env.W||1080), H = Math.round(W*16/9), OUT = process.env.OUT||'video.mp4';
  const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname,'../pliny-vesuvius.html') + '?export');
  await p.waitForFunction(() => window.film, null, { timeout: 20000 }); await p.waitForTimeout(800);
  // effects track
  const sfx = await p.evaluate(async () => {
    const {buf,errs} = await window.film.renderSfxOffline(48000);
    const n = buf.length, L = buf.getChannelData(0), R = buf.getChannelData(1), ab = new ArrayBuffer(44 + n * 4), v = new DataView(ab);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0,'RIFF'); v.setUint32(4,36+n*4,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,2,true); v.setUint32(24,48000,true); v.setUint32(28,192000,true); v.setUint16(32,4,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*4,true);
    let o=44; for (let i=0;i<n;i++){ v.setInt16(o,Math.max(-1,Math.min(1,L[i]))*32767,true); v.setInt16(o+2,Math.max(-1,Math.min(1,R[i]))*32767,true); o+=4; }
    let s=''; const u8=new Uint8Array(ab); for(let i=0;i<u8.length;i+=0x8000) s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));
    return {b64:btoa(s),errs};
  });
  fs.writeFileSync(OUTDIR+'/sfx.wav', Buffer.from(sfx.b64,'base64'));
  console.log('sfx done', JSON.stringify(sfx.errs));
  const T = await p.evaluate(() => window.film.TOTAL), Nf = Math.round(T * FPS);
  const box = await (await p.$('#sv')).boundingBox(); console.log('svg box', JSON.stringify(box));
  const ff = spawn('ffmpeg', ['-y','-v','error','-f','image2pipe','-framerate',String(FPS),'-c:v','png','-i','-',...(W<1080?['-vf',`scale=${W}:-2`]:[]),'-c:v','libx264','-preset',process.env.FPS?'veryfast':'slow','-crf',process.env.FPS?'24':'14','-tune','animation','-profile:v','high','-pix_fmt','yuv420p','-r',String(FPS),'-an',OUTDIR+'/'+OUT]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const t0 = Date.now();
  for (let i = 0; i < Nf; i++) {
    await p.evaluate(t => window.film.renderAt(t), i / FPS);
    const buf = await p.screenshot({ type: 'png', clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${Nf} ${((Date.now()-t0)/1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('video done', Nf, 'frames', ((Date.now()-t0)/1000).toFixed(0)+'s', 'errors', JSON.stringify(errs));
  await b.close();
})();
