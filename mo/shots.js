// usage: node shots.js out.png t1 t2 ... (renders frames at 540x960 and tiles them)
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async () => { const [out,...ts]=process.argv.slice(2); const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
  const p = await b.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor: .5 }); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('file://'+path.resolve(__dirname,'../monopoly-magie.html')+'?export'); await p.waitForFunction(()=>window.film,{timeout:20000}).catch(()=>{}); await p.evaluate(()=>window.__fontsReady); await p.waitForTimeout(600);
  if(errs.length){ console.log('ERR',errs.slice(0,5).join(' | ')); }
  const box=await (await p.$('#sv')).boundingBox(); fs.mkdirSync(__dirname+'/fr',{recursive:true}); const files=[];
  for(const [i,t] of ts.entries()){ await p.evaluate(t=>window.film.renderAt(+t),t); const f=__dirname+`/fr/s${String(i).padStart(3,'0')}.png`; await p.screenshot({path:f,clip:{x:box.x,y:box.y,width:box.width,height:box.height}}); files.push(f); }
  console.log('errors',JSON.stringify(errs.slice(0,3))); await b.close();
  require('child_process').execSync(`python3 -c "
from PIL import Image,ImageDraw;import sys
fs=sys.argv[2:];ims=[Image.open(f) for f in fs];w,h=ims[0].size;c=min(len(ims),6);r=(len(ims)+c-1)//c
S=Image.new('RGB',(w*c,(h+22)*r),'#222');d=ImageDraw.Draw(S)
for i,(im,t) in enumerate(zip(ims,sys.argv[1].split(','))):x,y=(i%c)*w,(i//c)*(h+22);S.paste(im,(x,y+22));d.text((x+4,y+4),t+'s',fill='yellow')
S.save('${out}')" ${ts.join(',')} ${files.join(' ')}`);
})();
