// usage: node engine/tools/export.js <episode>            final: 1080x1920, 30 fps -> <episode>/out/video.mp4
//        DRAFT=1 node engine/tools/export.js <episode>    draft: 540x960, 15 fps  -> <episode>/out/draft.mp4
// Frames are captured as JPEG (4x faster than PNG here) by WORKERS parallel browsers (default 2), then joined.
const {episode,open}=require('./common'); const {spawn,spawnSync}=require('child_process'); const fs=require('fs'); const path=require('path');
const ep=episode(process.argv[2]); const OUTDIR=path.join(ep.dir,'out'); fs.mkdirSync(OUTDIR,{recursive:true});
const DRAFT=!!process.env.DRAFT, FPS=+(process.env.FPS||(DRAFT?15:30)), W=+(process.env.W||(DRAFT?540:1080)), WORKERS=+(process.env.WORKERS||2);
const OUT=path.join(OUTDIR,process.env.OUT||(DRAFT?'draft.mp4':'video.mp4'));
async function renderRange(a,b_,file){ const {b,p,errs}=await open(ep.html);
  const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-',...(W<1080?['-vf',`scale=${W}:-2`]:[]),'-c:v','libx264','-preset',DRAFT?'veryfast':'slow','-crf',DRAFT?'24':'14','-tune','animation','-profile:v','high','-pix_fmt','yuv420p','-r',String(FPS),'-an',file]);
  ff.stderr.on('data',d=>process.stderr.write(d)); const t0=Date.now();
  for(let i=a;i<b_;i++){ await p.evaluate(t=>window.film.renderAt(t),i/FPS);
    const buf=await p.screenshot({type:'jpeg',quality:96,clip:{x:0,y:0,width:1080,height:1920}});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if((i-a)%300===0) console.log(`[${path.basename(file)}] frame ${i-a}/${b_-a} ${((Date.now()-t0)/1000).toFixed(0)}s`); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); if(errs.length){ console.error('page errors',JSON.stringify(errs.slice(0,5))); process.exit(3); } }
(async()=>{ const i=process.argv.indexOf('--range');
  if(i>0){ await renderRange(+process.argv[i+1],+process.argv[i+2],process.argv[i+3]); return; }
  const {b,p}=await open(ep.html); const T=await p.evaluate(()=>window.film.TOTAL); await b.close(); const N=Math.round(T*FPS), t0=Date.now();
  const n=Math.max(1,Math.min(WORKERS,Math.ceil(N/60))), segs=[]; const jobs=[];
  for(let k=0;k<n;k++){ const a=Math.round(N*k/n), e=Math.round(N*(k+1)/n), f=path.join(OUTDIR,`seg${k}.mp4`); segs.push(f);
    jobs.push(new Promise((res,rej)=>{ const c=spawn(process.execPath,[__filename,ep.dir,'--range',a,e,f],{stdio:'inherit',env:process.env}); c.on('close',code=>code?rej(new Error('worker '+k+' failed')):res()); })); }
  await Promise.all(jobs);
  const list=path.join(OUTDIR,'segs.txt'); fs.writeFileSync(list,segs.map(f=>`file '${f.replace(/'/g,"'\\''")}'`).join('\n'));
  const r=spawnSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',list,'-c','copy',OUT],{stdio:'inherit'}); if(r.status) process.exit(r.status);
  segs.forEach(f=>fs.unlinkSync(f)); fs.unlinkSync(list);
  console.log('video done',N,'frames',FPS+'fps',W+'px',((Date.now()-t0)/1000).toFixed(0)+'s ->',OUT); })();
