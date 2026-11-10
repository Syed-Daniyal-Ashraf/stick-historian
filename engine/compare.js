// usage: node engine/compare.js old.html new.html  -> pixel-compares 24 frames + subtitle/cue data
const { chromium } = require('playwright'); const path=require('path');
(async()=>{ const b=await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
 const shots=async f=>{ const p=await b.newPage({viewport:{width:1080,height:1920}}); await p.goto('file://'+path.resolve(f)+'?export'); await p.waitForFunction(()=>window.film||window.pigWar); await p.waitForTimeout(600);
   const W='window.film||window.pigWar'; const T=await p.evaluate(`(${W}).TOTAL`); const box=await (await p.$('#sv')).boundingBox(); const imgs=[];
   for(let i=0;i<24;i++){ const t=+(i*T/24+.13).toFixed(3); await p.evaluate(`(${W}).renderAt(${t})`); imgs.push(await p.screenshot({clip:{x:box.x,y:box.y,width:1080,height:1920}})); }
   const data=await p.evaluate(`JSON.stringify({subs:(${W}).SUBS.length,cues:(${W}).CUES.map(c=>[+c.t.toFixed(3),c.name]),seq:(${W}).SEQ.map(q=>q.start)})`); await p.close(); return {imgs,data,T}; };
 const A=await shots(process.argv[2]), B=await shots(process.argv[3]);
 let diff=0; A.imgs.forEach((x,i)=>{ if(!x.equals(B.imgs[i])) diff++; });
 console.log(JSON.stringify({total:[A.T,B.T],framesCompared:A.imgs.length,framesDifferent:diff,dataIdentical:A.data===B.data}));
 await b.close(); })();
