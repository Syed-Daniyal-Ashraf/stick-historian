// usage: node engine/tools/cover.js <episode>   -> <Name>-Cover-4K.png in the project root (frame at COVER_T)
const {episode,open}=require('./common'); const path=require('path');
(async()=>{ const ep=episode(process.argv[2]); const {b,p,errs}=await open(ep.html,{scale:2});
  await p.evaluate(()=>window.film.renderCover()); await p.waitForTimeout(200);
  const f=path.join(ep.root,ep.name+'-Cover-4K.png'); await p.screenshot({path:f,clip:{x:0,y:0,width:1080,height:1920}}); console.log('cover',f,'errors',JSON.stringify(errs)); await b.close(); })();
