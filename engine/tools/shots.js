// usage: node engine/tools/shots.js <episode> out.png t1 t2 ...   (SAFE=1 draws the Reels safe area in red; CLIP=x,y,w,h crops every frame, for dense strips)
const {episode,open,SAFE}=require('./common'); const fs=require('fs'); const os=require('os'); const path=require('path'); const {execFileSync}=require('child_process');
const CLIP=process.env.CLIP?(([x,y,width,height])=>({x,y,width,height}))(process.env.CLIP.split(',').map(Number)):{x:0,y:0,width:1080,height:1920};
(async()=>{ const [epArg,out,...ts]=process.argv.slice(2); const ep=episode(epArg); const {b,p,errs}=await open(ep.html,{scale:+(process.env.SCALE||.5)});
  if(process.env.SAFE) await p.evaluate(S=>{ const g=document.createElementNS('http://www.w3.org/2000/svg','g'); const r=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f00" opacity=".3"/>`;
    g.innerHTML=r(0,0,1080,S.y0)+r(0,S.y1,1080,1920-S.y1)+r(0,S.y0,S.x0,S.y1-S.y0)+r(S.x1,S.y0,1080-S.x1,S.y1-S.y0); document.getElementById('sv').appendChild(g); },SAFE);
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'shots-')); const files=[];
  for(const [i,t] of ts.entries()){ await p.evaluate(t=>window.film.renderAt(+t),t); const f=path.join(dir,`s${String(i).padStart(3,'0')}.png`); await p.screenshot({path:f,clip:CLIP}); files.push(f); }
  await b.close(); console.log('errors',JSON.stringify(errs.slice(0,3)));
  execFileSync('python3',['-c',`
from PIL import Image,ImageDraw;import sys
out,ts=sys.argv[1],sys.argv[2].split(',');fs=sys.argv[3:];ims=[Image.open(f) for f in fs];w,h=ims[0].size;c=min(len(ims),int(${+(process.env.COLS||8)}));r=(len(ims)+c-1)//c
S=Image.new('RGB',(w*c,(h+22)*r),'#222');d=ImageDraw.Draw(S)
for i,(im,t) in enumerate(zip(ims,ts)):
  x,y=(i%c)*w,(i//c)*(h+22);S.paste(im,(x,y+22));d.text((x+4,y+4),t+'s',fill='yellow')
S.save(out)`,path.resolve(out),ts.join(','),...files],{stdio:'inherit'}); fs.rmSync(dir,{recursive:true}); })();
