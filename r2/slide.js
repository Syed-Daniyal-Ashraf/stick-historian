const { chromium } = require('playwright');
const fs=require('fs');
(async () => {
  const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
  const p = await b.newPage();
  // instrument a copy: record planted-foot world x per character per frame
  let html=fs.readFileSync(__dirname+'/../receipts-theon.html','utf8');
  html=html.replace("const lB=ik(hip,p.fB||STANCE.fB,80,78,-1), lF=ik(hip,p.fF||STANCE.fF,80,78,-1);",
   "const lB=ik(hip,p.fB||STANCE.fB,80,78,-1), lF=ik(hip,p.fF||STANCE.fF,80,78,-1); if(window.__FT){ for(const [k,f] of [['B',p.fB||STANCE.fB],['F',p.fF||STANCE.fF]]) window.__FT.push([DBG.now,who+':'+seed+k,x+f[0]*s*face,f[1]]); }");
  fs.writeFileSync(__dirname+'/inst.html',html.replace("'/../","'/"));
  await p.goto('file://' + __dirname + '/inst.html'); await p.waitForFunction(() => window.film);
  const res = await p.evaluate(() => { const W=window.film, dt=1/30; const SH=W.SHOTS.map(s=>s.start);
    const shotOf=t=>{let i=0;SH.forEach((s,k)=>{if(t>=s)i=k});return i+1;};
    let prev=new Map(), ev=[];
    for(let t=0;t<W.TOTAL;t+=dt){ window.__FT=[]; W.renderAt(t); const cur=new Map(); for(const [tt,id,wx,fy] of window.__FT){ cur.set(id,[wx,fy]); const q=prev.get(id); if(q && fy>-.5 && q[1]>-.5 && shotOf(t)===shotOf(t-dt)){ const v=Math.abs(wx-q[0])/dt; if(v>15) ev.push([+t.toFixed(2),shotOf(t),id,Math.round(v)]); } } prev=cur; }
    // group into runs
    const runs={}; for(const [t,s,id,v] of ev){ const k=s+'|'+id.split(':')[0]; (runs[k]=runs[k]||{shot:s,who:id.split(':')[0],from:t,to:t,maxV:0,frames:0}); const r=runs[k]; r.to=t; r.maxV=Math.max(r.maxV,v); r.frames++; }
    return Object.values(runs).sort((a,b)=>b.frames-a.frames); });
  console.log(JSON.stringify(res));
  await b.close();
})();
