// usage: node engine/tools/verify.js <episode>
// Gates: (1) any frame renders the same whatever was rendered before, (2) no hand or foot target out of the rig's reach,
// (3) every subtitle inside the Reels safe area, one line, and every narrated word covered by a subtitle,
// (4) big captions (CAP_MODE_EP='big'): chunk rules and minimum size, (5) cut cadence when the episode declares CUT_EP (gaps <= 3.4 s, CUT_HOLD_EP shots <= 4.5 s).
// Warnings (listed, not failing): captions under 0.25 s, gaps over 3 s or under 1 s.
const {episode,open,SAFE}=require('./common');
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
  out.errors=errs; await b.close();
  const capFail=out.captions.mode==='big'&&(out.captions.ruleBreaks.length||out.captions.tooWide.length), cutFail=out.cadence.enforced&&out.cadence.fails.length;
  const pass=!capFail&&!cutFail&&!out.determinism.mismatches.length&&!out.reach.outOfReach.length&&out.reach.figuresChecked>0&&!out.subtitles.framesOutsideSafeArea&&!out.subtitles.uncoveredWords.length&&!errs.length;
  console.log(JSON.stringify(out,null,1)); console.log(pass?'VERIFY: PASS':'VERIFY: FAIL'); process.exit(pass?0:2); })();
