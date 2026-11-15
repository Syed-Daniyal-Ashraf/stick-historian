/* ============================== Ice to Calcutta: episode costumes, painted sets and props */
Object.assign(TC,{
  sailor: {skin:'#e9b98e',hair:'#4a3020',top:'#f4efe2',topDk:'#d6cdb8',pants:'#34466a',shoe:'#2a1e16',cap:'flat',capC:'#2c3a5a',headS:1.16,build:.1,shoes:true},
});
/* --- day cycle: ph 0 sunrise, .25 noon, .5 sunset, .75 midnight. Everything the light touches is keyed from this one phase. --- */
const DAY={
  top:[[0,'#4474b4'],[.08,'#3f86cf'],[.25,'#2b78d2'],[.42,'#3f6fb8'],[.5,'#51478e'],[.58,'#1d2452'],[.75,'#0b1030'],[.92,'#1d2452']],
  mid:[[0,'#f0a070'],[.08,'#a4d2ee'],[.25,'#8ccdf4'],[.42,'#f2c078'],[.5,'#e8765a'],[.58,'#4c3c70'],[.75,'#151b46'],[.92,'#4c3c70']],
  bot:[[0,'#ffd8a0'],[.08,'#e8f3f5'],[.25,'#f6fcff'],[.42,'#ffe2a6'],[.5,'#ffb46c'],[.58,'#80608a'],[.75,'#222c60'],[.92,'#80608a']],
  sea:[[0,'#2c5c84'],[.25,'#176a9a'],[.42,'#2a5c88'],[.5,'#3a4674'],[.58,'#18224e'],[.75,'#081232'],[.92,'#18224e']],
  wood:[[0,'#c08a5c'],[.25,'#cfa066'],[.42,'#c8905a'],[.5,'#b0694a'],[.58,'#5a4a66'],[.75,'#3a3a5c'],[.92,'#5a4a66']],
  fig:[[0,'#ffd9b0'],[.1,'#ffffff'],[.4,'#ffffff'],[.5,'#ffb890'],[.58,'#8088c0'],[.75,'#6470b0'],[.92,'#8088c0']],   // light colour multiplied onto figures and props
  cloud:[[0,'#ffd2b0'],[.1,'#ffffff'],[.4,'#ffffff'],[.5,'#ff9e80'],[.58,'#5a5488'],[.75,'#2c3466'],[.92,'#5a5488']],
};
function dayLight(ph){ ph=((ph%1)+1)%1; const day=ph<.5, a=Math.PI*(day?ph/.5:(ph-.5)/.5), up=Math.sin(a);
  const sun=day?{x:540-Math.cos(a)*430,y:HZ-up*490,col:pMix('#ff9a4a','#fffbe8',Math.pow(up,.6)),up}:null;
  const moon=!day?{x:540-Math.cos(a)*400,y:HZ-up*430,up}:null, night=day?0:sat(ph<.75?(ph-.5)/.07:(1-ph)/.07);
  const c={}; for(const k in DAY) c[k]=pCycle(ph,DAY[k]); return {ph,day,sun,moon,night,up,c}; }
const HZ=820, DECK=1092, RAIL=1000;   // horizon, deck edge and rail top in world y
/* light tint for SVG figures and props so they sit in the painted scene: multiplies col onto whatever is drawn, k = strength */
function lit(svg,col,k=1){ if(k<=0||col==='#ffffff') return svg; const id='lit'+col.slice(1)+Math.round(k*100);
  return `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feFlood flood-color="${col}" flood-opacity="${N(k*100)/100}" result="f"/><feBlend mode="multiply" in="SourceGraphic" in2="f" result="b"/><feComposite in="b" in2="SourceGraphic" operator="in"/></filter><g filter="url(#${id})">${svg}</g>`; }
/* painted doldrums set: sky, sun or moon, stars, clouds, glassy sea, haze, ship's rail, deck planks, mast. L = dayLight(ph), c = camera */
function paintDoldrums(ctx,t,L,c,{crate=null,fig=null}={}){
  ctx.save(); camCtx(ctx,camPar(c,.25));                                  // far plane: sky moves a quarter as much as the deck
  PNT.sky(ctx,{top:L.c.top,mid:L.c.mid,bot:L.c.bot,y0:120,y1:HZ,midAt:.62,to:HZ+6});
  PNT.stars(ctx,t,{n:110,a:L.night*.95,y0:60,y1:HZ-40,seed:7});
  if(L.sun) PNT.sun(ctx,L.sun.x,L.sun.y,46,L.sun.col,.55+.45*L.sun.up);
  if(L.moon){ PNT.glow(ctx,L.moon.x,L.moon.y,230,'#b8c6ff',.3*L.night); ctx.save(); ctx.beginPath(); ctx.arc(L.moon.x,L.moon.y,30,0,7); ctx.clip();                 // crescent: the disc minus an offset disc
    ctx.beginPath(); ctx.arc(L.moon.x,L.moon.y,30,0,7); ctx.arc(L.moon.x+14,L.moon.y-8,27,0,7); ctx.fillStyle='#eef2ff'; ctx.globalAlpha=L.night; ctx.fill('evenodd'); ctx.restore(); }
  PNT.clouds(ctx,t,{alt:520,h:300,drift:9,alpha:.8-.45*L.night,sc:2.4,col:L.c.cloud,seed:2});
  PNT.clouds(ctx,t,{alt:700,h:150,drift:5,alpha:.55-.3*L.night,sc:1.3,col:pMix(L.c.cloud,L.c.bot,.5),seed:5,flat:.4});
  ctx.restore();
  ctx.save(); camCtx(ctx,camPar(c,.6));                                   // middle plane: the sea
  const body=L.sun||L.moon, gl=L.sun?[L.sun.x,330,L.sun.col,.4+.6*Math.pow(L.sun.up,.5)]:[L.moon.x,190,'#cfd8ff',.55*L.night];
  PNT.sea(ctx,t,{horizon:HZ,far:pMix(L.c.bot,L.c.sea,.32),mid:pMix(L.c.mid,L.c.sea,.62),near:L.c.sea,rip:.34-.14*L.night,dk:.26,ripCol:pMix('#ffffff',L.c.bot,.4),glint:body.y<HZ-8?gl:null,swell:5,speed:7,n:80,to:RAIL+60});
  PNT.band(ctx,HZ,46,L.c.bot,.55);                                        // haze sitting on the horizon
  PNT.haze(ctx,HZ+260,HZ,L.c.bot,.3);
  ctx.restore();
  ctx.save(); camCtx(ctx,c);                                              // near plane: the ship, same camera as the SVG
  const lx=body.x, dir=(lx-540)/500;                                      // light comes from the sun or moon side
  PNT.wood(ctx,[-600,RAIL+22,2400,DECK-RAIL-22],{tone:shade(L.c.wood,.7),sc:.62,oy:RAIL+22,ox:140,light:[0,RAIL+22,0,DECK,.35]});          // bulwark
  PNT.wood(ctx,[-600,RAIL,2400,24],{tone:shade(L.c.wood,1.06),sc:.4,oy:RAIL,light:[0,RAIL,0,RAIL+24,.5]});                                // cap rail
  PNT.wood(ctx,[-600,DECK,2400,1400],{tone:L.c.wood,sc:.95,oy:DECK,ox:60,light:[540+dir*500,DECK,540-dir*500,DECK+900,.42]});            // deck planks
  PNT.haze(ctx,DECK,DECK+26,'#1a1020',.38);                                                                                               // shade where the bulwark meets the deck
  if(fig) PNT.shadow(ctx,fig[0]-dir*70,DECK+42,150+Math.abs(dir)*60,26,.42*(1-.4*L.night));
  if(crate){ PNT.shadow(ctx,crate[0]+crate[2]/2-dir*50,crate[1]+crate[3]+6,crate[2]*.75,20,.4); PNT.wood(ctx,crate,{tone:shade(L.c.wood,.86),sc:.34,ox:crate[0],oy:crate[1],light:[crate[0]+(dir>0?crate[2]:0),crate[1],crate[0]+(dir>0?0:crate[2]),crate[1]+crate[3],.4]}); }
  PNT.wood(ctx,[150,-400,84,DECK+52+400],{tone:shade(L.c.wood,.8),sc:.55,rot:90,light:[dir>0?234:150,0,dir>0?150:234,0,.6]});               // mast
  ctx.restore();
}
/* tally marks in chalk: n strokes, every fifth crosses the four before it. k = progress of the newest stroke */
function tally(x,y,n,k=1,col='#f4efe2'){ let g=''; for(let i=0;i<n;i++){ const grp=Math.floor(i/5), j=i%5, gx=x+(grp%2)*0, gy=y+grp*62, q=i===n-1?sat(k):1;
    g+=j<4?`<path d="M${N(-21+j*14)} ${N(gy-20)}L${N(-21+j*14+rnd(i)*3-1.5)} ${N(gy-20+40*q)}" stroke="${col}" stroke-width="5" stroke-linecap="round" opacity=".92"/>`
          :`<path d="M-29 ${N(gy+12)}L${N(-29+58*q)} ${N(gy+12-26*q)}" stroke="${col}" stroke-width="5" stroke-linecap="round" opacity=".92"/>`; }
  return `<g transform="translate(${x} 0)">${g}</g>`; }
