const { chromium } = require('playwright'); const path=require('path');
(async () => { const b = await chromium.launch((process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}));
 const p = await b.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor: 2 });
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../lal-bihari.html')+'?export'); await p.waitForFunction(()=>window.film); await p.evaluate(()=>window.__fontsReady); await p.waitForTimeout(800);
 const box=await (await p.$('#sv')).boundingBox();
 await p.evaluate(()=>window.film.renderCover()); await p.waitForTimeout(200);
 await p.screenshot({path:path.resolve(__dirname,'..','Lal-Bihari-Cover-4K.png'),clip:{x:box.x,y:box.y,width:1080,height:1920}});
 console.log('errors',JSON.stringify(errs)); await b.close(); })();
