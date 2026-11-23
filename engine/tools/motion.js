// Motion gate: finds stretches where the picture barely moves, sudden jumps that are not cuts, and hard cuts
// that film.CUTS doesn't know about. Reads a rendered video, so run it after the draft (or final) export.
//
// usage: node engine/tools/motion.js EP [video]     default video: EP/out/draft.mp4, else EP/out/video.mp4
//
// How it measures: the video is read at 15 fps, 180x320 grey. Each frame is split into 10x10-pixel blocks and
// compared with the previous frame; "motion" is the average change of the 10 most-changed blocks, so one
// character moving counts fully while paper grain and line boil (which change everywhere a little) do not.
// The caption band (y 970-1270 px) is ignored, because captions change on every word.
//
// Results:
//   still  - 1 s or more where motion stays under STILL (6). FAIL when a stretch reaches STILL_MAX (2 s), unless
//            it ends the film (last 1.5 s) or lies inside a range in HOLD_OK_EP, e.g. in shots.js:
//            const HOLD_OK_EP=[[43.0,45.2,'reading the patent quote']];
//   pop    - one frame where part of the picture changes far more than the frames around it, away from a cut:
//            a snapped pose, an inset or prop that appears with no animation, or an intended shake/slam. WARN: look at it.
//   uncut  - the whole picture changes at a time that is not in film.CUTS (an in-shot scene switch without CUT_EP).
//            WARN: verify.js measures shot length from film.CUTS, so it can't see these.
// Thresholds were tuned on yo/tn/mo drafts (2026-11). Prints MOTION: PASS or FAIL and a contact-sheet command.
const {episode,open}=require('./common'); const {spawnSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const FPS=15, W=180, H=320, BS=10, TOPN=10, STILL=+(process.env.STILL||6), STILL_MAX=+(process.env.STILL_MAX||2.0);
const CAP0=Math.round(970/6), CAP1=Math.round(1270/6);          // caption band in 180x320 rows
const POP_MIN=25, POP_RATIO=3, SCENE=20;

(async()=>{
  const ep=episode(process.argv[2]);
  const vid=process.argv[3]?path.resolve(process.argv[3]):['draft.mp4','video.mp4'].map(f=>path.join(ep.dir,'out',f)).find(f=>fs.existsSync(f));
  if(!vid||!fs.existsSync(vid)){ console.error('no video: run DRAFT=1 node engine/tools/export.js '+path.basename(ep.dir)+' first'); process.exit(2); }
  if(fs.existsSync(ep.html)&&fs.statSync(vid).mtimeMs<fs.statSync(ep.html).mtimeMs) console.log('WARNING: '+path.basename(vid)+' is older than '+path.basename(ep.html)+': re-export it, or these results describe the old cut.');
  const {b,p}=await open(ep.html);
  const info=await p.evaluate(()=>({cuts:window.film.CUTS,total:window.film.TOTAL,ok:typeof HOLD_OK_EP!=='undefined'?HOLD_OK_EP:[]}));
  await b.close();

  const r=spawnSync('ffmpeg',['-v','error','-i',vid,'-vf',`fps=${FPS},scale=${W}:${H},format=gray`,'-f','rawvideo','-'],{maxBuffer:1<<30});
  if(r.status){ console.error(String(r.stderr)); process.exit(2); }
  const buf=r.stdout, N=Math.floor(buf.length/(W*H));
  const rows=[]; for(let y=0;y<H;y++) if(y<CAP0||y>=CAP1) rows.push(y);
  const by=Math.floor(rows.length/BS), bx=W/BS;
  const top=new Float64Array(N), glob=new Float64Array(N);     // index i = change from frame i-1 to i
  for(let i=1;i<N;i++){ const a=(i-1)*W*H, c=i*W*H, blk=new Float64Array(by*bx); let g=0;
    for(let k=0;k<by*BS;k++){ const y=rows[k], rb=Math.floor(k/BS);
      for(let x=0;x<W;x++){ const d=Math.abs(buf[c+y*W+x]-buf[a+y*W+x]); g+=d; blk[rb*bx+Math.floor(x/BS)]+=d; } }
    glob[i]=g/(by*BS*W); const s=Array.from(blk,v=>v/(BS*BS)).sort((u,v)=>v-u); top[i]=s.slice(0,TOPN).reduce((u,v)=>u+v,0)/TOPN; }

  const nearCut=(t,tol)=>info.cuts.some(c=>Math.abs(c-t)<=tol);
  const okHold=(t0,t1)=>info.ok.some(o=>t0>=o[0]-.1&&t1<=o[1]+.1);
  const med=a=>{ if(!a.length) return 0; const s=[...a].sort((u,v)=>u-v); return s[Math.floor(s.length/2)]; };

  // still stretches: every 1 s window whose mean motion is under STILL marks its frames
  const still=new Uint8Array(N);
  for(let s=1;s+FPS<=N;s++){ let m=0; for(let i=s;i<s+FPS;i++) m+=top[i]; if(m/FPS<STILL) for(let i=s;i<s+FPS;i++) still[i]=1; }
  const stills=[]; for(let i=1;i<N;i++) if(still[i]){ let j=i; while(j+1<N&&still[j+1]) j++; stills.push([(i-1)/FPS,j/FPS]); i=j; }

  const pops=[], uncut=[];
  for(let i=1;i<N;i++){ const t=i/FPS; if(nearCut(t,1.5/FPS)) continue;
    if(glob[i]>SCENE){ uncut.push(t); continue; }
    const before=med(Array.from(top.slice(Math.max(1,i-4),i))), after=med(Array.from(top.slice(i+1,i+5)));
    if(top[i]>POP_MIN&&top[i]>POP_RATIO*Math.max(before,after,2)) pops.push([t,top[i]]); }
  const merge=a=>a.filter((t,k)=>k===0||t-(Array.isArray(a[k-1])?a[k-1][0]:a[k-1])>.2);

  let fail=false; const lines=[];
  for(const [t0,t1] of stills){ const d=t1-t0, end=t1>=info.total-1.5;
    let tag='WARN'; if(d>=STILL_MAX&&!end&&!okHold(t0,t1)){ tag='FAIL'; fail=true; } else if(end||okHold(t0,t1)) tag='ok  ';
    lines.push(`  ${tag} still ${t0.toFixed(2)}-${t1.toFixed(2)} s (${d.toFixed(1)} s)${end?' end hold':''}${okHold(t0,t1)?' HOLD_OK_EP':''}`); }
  const P=merge(pops), U=merge(uncut);
  console.log(`motion: ${path.basename(vid)}, ${N} frames at ${FPS} fps, ${info.cuts.length} cuts in film.CUTS`);
  console.log(`still stretches (motion < ${STILL} for >= 1 s; FAIL at ${STILL_MAX} s):`+(lines.length?'\n'+lines.join('\n'):' none'));
  console.log('pops (look at each: snapped pose, prop/inset appearing with no animation, or an intended shake):'+(P.length?'\n'+P.map(([t,v])=>`  WARN pop ${t.toFixed(2)} s (${v.toFixed(0)})`).join('\n'):' none'));
  console.log('hard cuts missing from film.CUTS (add them to CUT_EP so verify.js counts shot length):'+(U.length?' '+U.map(t=>t.toFixed(2)).join(', '):' none'));
  const look=[...stills.map(s=>[s[0]+.1,s[1]-.1]).flat(),...P.flatMap(([t])=>[t-1/FPS,t])].map(t=>Math.max(0,t).toFixed(2));
  if(look.length) console.log(`look: SAFE=1 SCALE=.25 COLS=8 node engine/tools/shots.js ${path.basename(ep.dir)} motion.png ${look.join(' ')}`);
  const stats=Array.from(top.slice(1)).sort((u,v)=>u-v);
  console.log(`motion median ${stats[Math.floor(stats.length/2)].toFixed(1)}, 10th percentile ${stats[Math.floor(stats.length*.1)].toFixed(1)}`);
  console.log('MOTION: '+(fail?'FAIL':'PASS'));
  process.exit(fail?1:0);
})();
