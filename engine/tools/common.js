// Shared by every tool. Usage of the tools: node engine/tools/<tool>.js <episode folder> [args]
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
function episode(arg){ const dir=path.resolve(arg||'.'); const f=path.join(dir,'episode.json');
  if(!fs.existsSync(f)){ console.error('no episode.json in '+dir+' (pass the episode folder, e.g. node engine/tools/shots.js mo ...)'); process.exit(1); }
  const cfg=JSON.parse(fs.readFileSync(f,'utf8')), root=path.resolve(__dirname,'../..');
  return {dir,cfg,root,html:path.join(root,cfg.out+'.html'),name:cfg.file||cfg.out}; }
async function open(html,{scale=1,exportMode=true,viewport={width:1080,height:1920}}={}){
  const b=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  const p=await b.newPage({viewport,deviceScaleFactor:scale}); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('file://'+html+(exportMode?'?export':'')); try{ await p.waitForFunction(()=>window.film,null,{timeout:20000}); }catch(e){ console.error('The page did not start. Script errors:',JSON.stringify(errs.slice(0,5))); await b.close(); process.exit(4); }
  await p.evaluate(()=>window.__fontsReady); await p.waitForTimeout(500);   // fonts load lazily: never screenshot before this
  return {b,p,errs}; }
/* Reels / Shorts safe area on the 1080x1920 frame (Meta: top 14%, bottom 35%, sides 6% are covered by the app's interface) */
const SAFE={x0:65,x1:1015,y0:270,y1:1250};
module.exports={episode,open,SAFE};
