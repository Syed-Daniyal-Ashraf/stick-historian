// usage: node engine/tools/verify.js <episode>
// Gates: (1) any frame renders the same whatever was rendered before, (2) no hand or foot target out of the rig's reach,
// (3) every subtitle inside the Reels safe area, one line, and every narrated word covered by a subtitle,
// (4) big captions (CAP_MODE_EP='big'): chunk rules and minimum size, (5) cut cadence when the episode declares CUT_EP (gaps <= 3.4 s, CUT_HOLD_EP shots <= 4.5 s).
// (6) painted layer: 60 frames hashed (canvas pixels + SVG markup) must match in a scrambled order AND in a second, freshly
//     started browser (the export renders with parallel browsers, so unseeded boot or texture baking would show up here).
// Warnings (listed, not failing): captions under 0.25 s, gaps over 3 s or under 1 s; painted frames changed since the last run.
// Reports renderMs (whole frame) and, for episodes that paint, paintMs {median,p95} for the paint pass alone and bakeMs.
const {episode,open,SAFE}=require('./common'); const fs=require('fs'); const path=require('path');
/* hash of the finished frame at t: painted canvas pixels + world SVG + captions (FNV-1a) */
const HASH=ts=>{ const W=window.film,w=document.getElementById('world'),c=document.getElementById('caps'),cv=document.getElementById('paint');
  const fnv=(h,v)=>Math.imul(h^v,16777619)>>>0; let painted=0;
  return {hashes:ts.map(t=>{ W.renderAt(t); let h=2166136261; if(cv.width){ painted++; const d=new Uint32Array(cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data.buffer); for(let i=0;i<d.length;i++) h=fnv(h,d[i]); }
    const s=w.innerHTML+c.innerHTML; for(let i=0;i<s.length;i++) h=fnv(h,s.charCodeAt(i)); return h.toString(16).padStart(8,'0'); }),painted}; };
(async()=>{ const ep=episode(process.argv[2]); const {b,p,errs}=await open(ep.html); const out={};
  out.determinism=await p.evaluate(()=>{ const W=window.film,w=document.getElementById('world'),c=document.getElementById('caps');
    const ts=[...Array(60)].map((_,i)=>+(i*W.TOTAL/60+.13).toFixed(3)); const ref=ts.map(t=>{ W.renderAt(t); return w.innerHTML+c.innerHTML; });
    const order=[...ts.keys()].sort((a,b)=>Math.sin(a*7.1)-Math.sin(b*7.1)), bad=[]; for(const i of order){ W.renderAt(ts[i]); if(w.innerHTML+c.innerHTML!==ref[i]) bad.push(ts[i]); }
    return {checked:ts.length,mismatches:bad}; });
  out.reach=await p.evaluate(()=>{ const W=window.film; W.DBG.maxGrip=0; W.DBG.log=[]; W.DBG.figs=0; for(let t=0;t<W.TOTAL;t+=1/15) W.renderAt(t);
    const seen=new Map(); for(const [t,who,e] of W.DBG.log){ if(e<6) continue;   /* under 6 units is a tween overshoot, not a miss */ const k=who+'@'+Math.floor(t); if(!seen.has(k)||seen.get(k)[2]<e) seen.set(k,[t,who,e]); }
    return {figuresChecked:W.DBG.figs,worstUnits:+W.DBG.maxGrip.toFixed(1),outOfReach:[...seen.values()].slice(0,20)}; });
  out.subtitles=await p.evaluate(S=>{ const W=window.film,c=document.getElementById('caps'),sv=document.getElementById('sv').getBoundingClientRect(),k=1080/sv.width;
    const box={minX:1e9,maxX:-1e9,minY:1e9,maxY:-1e9}; const outside=[]; let frames=0;
    for(let t=0;t<W.TOTAL;t+=.1){ W.renderAt(t); const tx=[...c.querySelectorAll('text.cap')]; if(!tx.length) continue; frames++; let bad=false;
      for(const e of tx){ const r=e.getBoundingClientRect(),x0=(r.left-sv.left)*k,x1=(r.right-sv.left)*k,y0=(r.top-sv.top)*k,y1=(r.bottom-sv.top)*k;
        box.minX=Math.min(box.minX,x0); box.maxX=Math.max(box.maxX,x1); box.minY=Math.min(box.minY,y0); box.maxY=Math.max(box.maxY,y1); if(x0<S.x0||x1>S.x1||y0<S.y0||y1>S.y1) bad=true; }
      if(bad) outside.push(+t.toFixed(1)); }
    const uncovered=[]; for(const s of W.SHOTS) for(const w of s.words){ W.renderAt(w.t+.1); if(!c.querySelector('text.cap')) uncovered.push(w.w); }
    for(const q in box) box[q]=Math.round(box[q]);
    return {framesWithSubtitles:frames,box,framesOutsideSafeArea:outside.length,firstOutside:outside.slice(0,8),uncoveredWords:uncovered}; },SAFE);
  /* B1: big captions (only when the episode sets CAP_MODE_EP='big') */
  out.captions=await p.evaluate(()=>{ const C=window.film.CAPS; if(!C||C.mode!=='big') return {mode:C?C.mode:'line'};
    const ch=C.chunks.map(c=>({t:+c.t0.toFixed(2),dur:+(c.t1-c.t0).toFixed(2),text:c.words.map(w=>w.w).join(' '),n:c.words.length,ok:C.ok(c.words),...(f=>({size:Math.round(f.size),fit:f.fit}))(C.fit(c))}));
    const s=ch.reduce((a,c)=>c.dur<a.dur?c:a,ch[0]||{dur:0});
    return {mode:'big',chunks:ch.length,maxWords:Math.max(0,...ch.map(c=>c.n)),shortest:[s.t,s.dur,s.text],
      ruleBreaks:ch.filter(c=>!c.ok).map(c=>[c.t,c.text]),tooWide:ch.filter(c=>!c.fit).map(c=>[c.t,c.text,c.size]),
      under025:ch.filter(c=>c.dur<.25).map(c=>[c.t,c.dur,c.text]),smallest:Math.min(...ch.map(c=>c.size))}; });
  /* B2: shot-change cadence (enforced only when the episode declares CUT_EP; otherwise reported for information) */
  out.cadence=await p.evaluate(()=>{ const W=window.film, c=[...(W.CUTS||W.SEQ.map(q=>q.start)),W.TOTAL], gaps=[], hold=W.CUT_HOLD||[];
    for(let i=0;i+1<c.length;i++){ const sh=W.SHOTS.filter(s=>s.start<=c[i]+1e-6).pop().n; gaps.push({t0:c[i],t1:c[i+1],len:+(c[i+1]-c[i]).toFixed(2),shot:sh,hold:hold.includes(sh)}); }
    const long=gaps.reduce((a,g)=>g.len>a.len?g:a,gaps[0]), f=g=>[+g.t0.toFixed(2),+g.t1.toFixed(2),g.len];
    return {enforced:!!W.CUT_OPT,cuts:c.length-1,longestGap:f(long),
      fails:gaps.filter(g=>g.hold?g.len>4.5:g.len>3.4).map(f),gapsOver3:gaps.filter(g=>g.len>3&&!g.hold).map(f),gapsUnder1:gaps.filter(g=>g.len<1).map(f)}; });
  out.renderMs=await p.evaluate(()=>{ const W=window.film,s=performance.now(); for(let q=0;q<200;q++) W.renderAt((q*.37)%W.TOTAL); return +((performance.now()-s)/200).toFixed(2); });
  /* (6) painted layer */
  const ts=await p.evaluate(()=>[...Array(60)].map((_,i)=>+(i*window.film.TOTAL/60+.13).toFixed(3)));
  const A=await p.evaluate(HASH,ts), order=[...ts.keys()].sort((a,b)=>Math.sin(a*7.1)-Math.sin(b*7.1));
  const A2=await p.evaluate(HASH,order.map(i=>ts[i])); const same=[]; order.forEach((i,k)=>{ if(A2.hashes[k]!==A.hashes[i]) same.push(ts[i]); });
  const painted=await p.evaluate(()=>{ let n=0; for(let i=0;i<40;i++) if(window.film.paintProbe(i*window.film.TOTAL/40).painters) n++; return n; });
  out.paint={painted:painted>0};
  if(painted){ const p2=await open(ep.html); const bakeMs=await p2.p.evaluate(()=>{ const f=window.film.paintBake; if(!f) return null; const per=f(); return {total:Object.values(per).reduce((a,b)=>a+b,0),per};   /* per-texture times recorded when each was first baked */ });
    const B=await p2.p.evaluate(HASH,ts); await p2.b.close(); const across=ts.filter((t,i)=>B.hashes[i]!==A.hashes[i]);
    const pm=await p.evaluate(()=>{ const W=window.film, ms=[]; for(let i=0;i<120;i++){ const r=W.paintProbe((i+.5)*W.TOTAL/120); if(r.painters) ms.push(r.ms); } ms.sort((a,b)=>a-b);
      return ms.length?{frames:ms.length,median:+ms[Math.floor(ms.length/2)].toFixed(1),p95:+ms[Math.min(ms.length-1,Math.floor(ms.length*.95))].toFixed(1)}:null; });
    const hf=path.join(ep.dir,'out','paint_hashes.json'); let changed=null; const cur=Object.fromEntries(ts.map((t,i)=>[t,A.hashes[i]]));
    if(fs.existsSync(hf)){ const old=JSON.parse(fs.readFileSync(hf,'utf8')); changed=ts.filter(t=>old[t]!==undefined&&old[t]!==cur[t]).length; }
    fs.mkdirSync(path.dirname(hf),{recursive:true}); fs.writeFileSync(hf,JSON.stringify(cur));
    out.paint={painted:true,pages:2,checked:ts.length,framesPainted:A.painted,mismatchesSamePage:same,mismatchesAcrossPages:across,changedSinceLastRun:changed,paintMs:pm,bakeMs}; }
  else out.paint.mismatchesSamePage=same;   /* unpainted episodes: the same-page check still covers the SVG */
  out.errors=errs; await b.close();
  const capFail=out.captions.mode==='big'&&(out.captions.ruleBreaks.length||out.captions.tooWide.length), cutFail=out.cadence.enforced&&out.cadence.fails.length;
  const paintFail=out.paint.mismatchesSamePage.length||(out.paint.mismatchesAcrossPages||[]).length;
  const pass=!paintFail&&!capFail&&!cutFail&&!out.determinism.mismatches.length&&!out.reach.outOfReach.length&&out.reach.figuresChecked>0&&!out.subtitles.framesOutsideSafeArea&&!out.subtitles.uncoveredWords.length&&!errs.length;
  console.log(JSON.stringify(out,null,1)); console.log(pass?'VERIFY: PASS':'VERIFY: FAIL'); process.exit(pass?0:2); })();
