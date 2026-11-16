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

/* ============================== Stage C: costumes */
Object.assign(TC,{
  sailor2:{...TC.sailor,skin:'#d9a67a',hair:'#2a1e16',top:'#cfd8e6',topDk:'#aeb9cc',capC:'#7a2e3a',build:.4},
  mate:{...TC.sailor,top:'#2c3a5a',topDk:'#202c46',pants:'#e8e1cf',capC:'#1e2a44',mus:'thick',headS:1.16,build:.5},
  worker:{skin:'#e9b98e',hair:'#3a2a1e',top:'#6a4a38',topDk:'#523a2c',pants:'#3a3a40',shoe:'#2a1e16',cap:'flat',capC:'#3a3a40',headS:1.14,build:.3,shoes:true},
  worker2:{skin:'#d9a67a',hair:'#1e1610',top:'#4a5a6e',topDk:'#38465a',pants:'#4a3a30',shoe:'#2a1e16',cap:'flat',capC:'#5a4a3a',mus:'thin',headS:1.12,build:.15,shoes:true},
  tanner:{skin:'#d6a274',hair:'#2a2420',top:'#cbb690',topDk:'#a9946c',vest:'#6a4a2e',pants:'#5a4a3a',shoe:'#3a2a1e',mus:'thick',headS:1.14,build:.6,shoes:true},
  buyer:{skin:'#f0c4a0',hair:'#cfc9bf',suit:true,top:'#f4efe2',topDk:'#d6cdb8',shirt:'#fffaf0',tie:'#8a2a2a',pants:'#f4efe2',shoe:'#1e1610',mus:'thick',headS:1.16,build:.55},
  buyer2:{skin:'#efc6a0',hair:'#7a5a3a',suit:true,top:'#d9d2c0',topDk:'#bdb6a2',shirt:'#fffaf0',tie:'#2c5e8a',pants:'#d9d2c0',shoe:'#1e1610',headS:1.14,build:.2},
  porter:{skin:'#a8723f',hair:'#1a120c',top:'#efe7d2',topDk:'#cfc5ab',pants:'#efe7d2',shoe:'#4a2e1a',cap:'pagri',capC:'#e6a23a',dhoti:true,headS:1.14,build:.2},
});
const walkPose=(u,v=2.4,amp=1)=>{ const s=Math.sin(u*v*Math.PI*2), c=Math.cos(u*v*Math.PI*2);
  return full({fF:[22+s*26*amp,-Math.max(0,c)*12*amp],fB:[-14-s*26*amp,-Math.max(0,-c)*12*amp],hF:[22-s*22*amp,-112],hB:[-12+s*22*amp,-114],lean:3,hy:Math.abs(c)*3}); };
const HSG=(x,y,w,h,col)=>`<rect x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(h)}" fill="${col}"/>`;

/* ============================== Stage C: SVG props */
/* ice block, bottom-centre (x,y). melt 0-1 shrinks it and grows a puddle; frost 0-1 crystals on the edge; mist 0-1 cold vapour rolling off; t drives drips and mist */
function iceBlock(x,y,w,h,{melt=0,frost=0,mist=0,t=0,drip=0,wob=0}={}){
  const m=1-.55*melt, W=w*m, H=h*m, x0=x-W/2, y0=y-H; let g='';
  if(melt>.02) g+=`<ellipse cx="${N(x)}" cy="${N(y+3)}" rx="${N(w*(.3+.7*Math.min(1,melt*1.2)))}" ry="${N(7+12*melt)}" fill="#a8dcf0" stroke="${INK}" stroke-width="3.5" opacity=".85"/><ellipse cx="${N(x-w*.12)}" cy="${N(y)}" rx="${N(w*.2*melt)}" ry="3" fill="#fff" opacity=".7"/>`;
  g+=`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(wob)}) translate(${N(-x)} ${N(-y)})">`;
  g+=`<rect x="${N(x0)}" y="${N(y0)}" width="${N(W)}" height="${N(H)}" rx="${N(Math.min(14,W*.1))}" fill="url(#gIce)" stroke="${INK}" stroke-width="6" stroke-linejoin="round" opacity=".93"/>`;
  g+=`<rect x="${N(x0+W*.07)}" y="${N(y0+H*.06)}" width="${N(W*.86)}" height="${N(Math.max(6,H*.13))}" rx="6" fill="#fff" opacity=".8"/>`;
  g+=`<path d="M${N(x0+W*.16)} ${N(y0+H*.88)}L${N(x0+W*.46)} ${N(y0+H*.3)}M${N(x0+W*.34)} ${N(y0+H*.9)}L${N(x0+W*.56)} ${N(y0+H*.5)}" stroke="#fff" stroke-width="${N(Math.max(3,W*.03))}" stroke-linecap="round" opacity=".6"/>`;
  if(frost>0) for(let i=0;i<14;i++){ const k=sat(frost*1.6-rnd(i+4)*.6); if(k<=0) continue; const side=i%4, px=side<2?x0+rnd(i)*W:(side===2?x0:x0+W), py=side<2?(side?y0+H:y0):y0+rnd(i+9)*H, r=(5+rnd(i+2)*9)*k;
    g+=`<path d="M${N(px-r)} ${N(py)}H${N(px+r)}M${N(px)} ${N(py-r)}V${N(py+r)}M${N(px-r*.7)} ${N(py-r*.7)}L${N(px+r*.7)} ${N(py+r*.7)}M${N(px-r*.7)} ${N(py+r*.7)}L${N(px+r*.7)} ${N(py-r*.7)}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`; }
  g+=`</g>`;
  if(drip>0) for(let i=0;i<2;i++){ const q=(t*1.3+i*.5)%1, dx=x0+W*(.25+.5*i); g+=`<ellipse cx="${N(dx)}" cy="${N(y0+H+q*q*(40+60*drip))}" rx="${N(4+drip*2)}" ry="${N(6+drip*4)}" fill="#bfeaff" stroke="${INK}" stroke-width="2.5" opacity="${N((1-q*.5)*100)/100}"/>`; }
  if(mist>0) for(let i=0;i<5;i++){ const q=(t*.5+i*.2)%1, side=i%2?1:-1, mx=x+side*(W/2+q*34)+Math.sin(t*2+i)*8, my=y0+H*(.55+.4*(i/5))+q*40, r=(20+q*26)*mist;
    g+=`<ellipse cx="${N(mx)}" cy="${N(my)}" rx="${N(r*1.4)}" ry="${N(r*.7)}" fill="#fff" opacity="${N((1-q)*.55*mist*100)/100}"/>`; }
  return g; }
/* square-rigger seen from the side. Origin = waterline centre; bow at +x when dir=1. Foam hides the hull's bottom edge. */
function shipSide(x,y,s,dir,{name=true,sails=1,jib=1,t=0}={}){
  const sail=(cx,y0,w,h)=>`<path d="M${cx-w/2} ${y0}Q${cx} ${y0+14} ${cx+w/2} ${y0}L${cx+w/2-8} ${y0+h}Q${cx} ${y0+h+20} ${cx-w/2+8} ${y0+h}Z" fill="url(#gSail)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  let g=`<g transform="translate(${N(x)} ${N(y)}) scale(${N(s*dir*1000)/1000} ${s})">`;
  [[-250,-380,230],[-40,-560,300],[220,-470,260]].forEach(([mx,top,hh])=>{ g+=`<path d="M${mx} -100V${top}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${mx} -100V${top}" stroke="#7a5230" stroke-width="5" stroke-linecap="round"/>`; });
  if(sails){ g+=sail(-40,-540,250,150)+sail(-40,-370,300,190)+sail(220,-450,210,120)+sail(220,-310,250,150)+sail(-250,-360,170,140);
    if(jib) g+=`<path d="M410 -96L320 -330" stroke="${INK}" stroke-width="5"/><path d="M420 -118L322 -312L330 -140Z" fill="url(#gSail)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`; }
  g+=`<path d="M-250 -100L-300 -112M-40 -100L-300 -112M-40 -100L220 -108M220 -100L420 -118" stroke="${INK}" stroke-width="3.5" opacity=".7" fill="none"/>`;
  g+=`<path d="M-400 -126L-376 -20Q-352 22 -296 28L300 28Q372 20 410 -66L452 -140Z" fill="#2c3a5a" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`;
  g+=`<path d="M-396 -104L450 -118L444 -96L-390 -82Z" fill="#f4efe2" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M-402 -134L452 -148" stroke="${INK}" stroke-width="7"/>`;
  if(name) g+=`<g transform="scale(${dir} 1)">${ttl('TUSCANY',-40*dir*0+(dir>0?-24:24),-30,34,'#fffaf0',{sw:.1,shadow:false})}</g>`;
  g+=`<path d="M-420 22Q-380 6 -330 22T-230 22T-130 22T-30 22T70 22T170 22T270 22T370 22T470 22" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round" opacity=".92"/>`;
  g+=`<path d="M380 20Q440 -10 470 26" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".85"/>`;
  return g+`</g>`; }
/* horse (side view) walking: x,y = hoof line, dir 1 faces right */
function horse(x,y,s,dir,u){ const sw=a=>Math.sin(u*5+a)*22, lift=a=>Math.max(0,Math.cos(u*5+a))*10, col='#7a4a2a', dk='#4a2a18';
  const leg=(lx,a)=>`<path d="M${lx} -118L${N(lx+sw(a))} ${N(-lift(a))}" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M${lx} -118L${N(lx+sw(a))} ${N(-lift(a))}" stroke="${col}" stroke-width="18" stroke-linecap="round"/><ellipse cx="${N(lx+sw(a))}" cy="${N(-lift(a))}" rx="14" ry="7" fill="${INK}"/>`;
  return `<g transform="translate(${N(x)} ${N(y)}) scale(${N(s*dir*1000)/1000} ${s})">${leg(-70,0)}${leg(-40,Math.PI)}${leg(60,Math.PI)}${leg(90,0)}`
    +`<path d="M-120 -170Q-120 -250 -40 -250L70 -250Q130 -250 130 -190Q130 -130 60 -120L-60 -118Q-120 -120 -120 -170Z" ${st(col,7)}/>`
    +`<path d="M110 -230Q150 -300 190 -330L230 -310Q246 -280 224 -262Q196 -240 160 -204Z" ${st(col,7)}/><path d="M196 -330L190 -354L214 -334Z" ${st(dk,5)}/><circle cx="214" cy="-296" r="5" fill="${INK}"/><path d="M110 -236Q130 -300 170 -338L160 -290Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>`
    +`<path d="M-118 -214Q-166 -190 -150 -128" fill="none" stroke="${dk}" stroke-width="16" stroke-linecap="round"/><path d="M-60 -250Q0 -262 60 -250" fill="none" stroke="#2a1e16" stroke-width="12"/><path d="M112 -246Q96 -196 122 -150" fill="none" stroke="#2a1e16" stroke-width="16" stroke-linecap="round"/><path d="M112 -246Q96 -196 122 -150" fill="none" stroke="#c8372d" stroke-width="7" stroke-linecap="round"/></g>`; }
/* ice cutter: two blades on a low sled, pulled by the horse; grooves are drawn separately */
function cutterSled(x,y,s,dir,u=0){ const ch=[0,1,2,3,4].map(i=>{ const q=(u*1.7+i*.2)%1; return `<rect x="${N(-300-q*90)}" y="${N(-16-Math.sin(q*Math.PI)*70)}" width="13" height="9" rx="3" fill="#e8f6ff" stroke="${INK}" stroke-width="2.5" opacity="${N((1-q)*100)/100}" transform="rotate(${N(q*200)} ${N(-300-q*90)} ${N(-16-Math.sin(q*Math.PI)*70)})"/>`; }).join('');
  const blade=bx=>`<path d="M${bx} -40H${bx-110}V-10H${bx}Z" fill="#9aa3ae" stroke="${INK}" stroke-width="6"/>`+[0,1,2,3,4].map(i=>`<path d="M${bx-6-i*22} -10l-11 18l-11 -18Z" fill="#9aa3ae" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`).join('');
  return `<g transform="translate(${N(x)} ${N(y)}) scale(${N(s*dir*1000)/1000} ${s})"><path d="M0 -60L-150 -52" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 -60L-150 -52" stroke="#c9a06a" stroke-width="5" stroke-linecap="round"/>`
    +blade(-150)+blade(-205)+`<path d="M-140 -70H-330V-40H-140Z" fill="#8a5a32" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>`
    +`<path d="M-300 -70L-370 -200M-326 -66L-396 -196" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-300 -70L-370 -200M-326 -66L-396 -196" stroke="#a9784a" stroke-width="6" stroke-linecap="round"/>`+ch+`</g>`; }
function slate(x,y,w,h,lines,k=1,rot=0,size=64){ if(k<=0) return ''; const n=lines.length, id='sl'+Math.round(x+y);
  let g=`<g transform="translate(${N(x)} ${N(y)}) rotate(${rot})"><rect x="${-w/2-14}" y="${-h/2-14}" width="${w+28}" height="${h+28}" rx="10" ${st('#8a5a32',8)}/><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="4" fill="#2f4a42" stroke="${INK}" stroke-width="5"/>`;
  g+=`<clipPath id="${id}"><rect x="${-w/2+4}" y="${-h/2}" width="${N((w-8)*sat(k))}" height="${h}"/></clipPath><g clip-path="url(#${id})">`;
  lines.forEach((l,i)=>{ g+=ttl(l,0,-h/2+h*(i+.5)/n+size*.34,size,'#f4efe2',{stroke:'none',shadow:false,sw:0}); });
  return g+`</g></g>`; }
/* hat held out upside down, optionally with coins in it */
const hatProp=(coins=0)=>({svg:`<g><path d="M-34 -4Q-34 -26 0 -26Q34 -26 34 -4Z" ${st('#3a3a44',5)}/><ellipse cx="0" cy="-4" rx="46" ry="9" ${st('#2a2a32',5)}/>${coins>0?`<ellipse cx="0" cy="-12" rx="${N(10+coins*2)}" ry="5" fill="#ffd25a" stroke="${INK}" stroke-width="2.5"/>`:''}</g>`});
const shovelProp=(load=0)=>({svg:`<g><path d="M0 40L-6 -90" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 40L-6 -90" stroke="#9a6a3c" stroke-width="6" stroke-linecap="round"/><path d="M-22 -82L22 -84L18 -126Q0 -140 -18 -126Z" ${st('#8a8f9a',5)}/>${load>0?`<ellipse cx="0" cy="-130" rx="18" ry="9" fill="#6b4a2c" stroke="${INK}" stroke-width="3"/>`:''}</g>`,rot:0});
const forkProp=(load=0)=>({svg:`<g><path d="M0 40L0 -100" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 40L0 -100" stroke="#9a6a3c" stroke-width="6" stroke-linecap="round"/><path d="M-24 -96V-146M0 -96V-150M24 -96V-146M-24 -100H24" stroke="#8a8f9a" stroke-width="7" stroke-linecap="round"/>${load>0?`<path d="M-44 -150Q-30 -190 0 -178Q36 -196 48 -150Z" fill="#e8c860" stroke="${INK}" stroke-width="4"/>`:''}</g>`});
const hammerProp=()=>({svg:`<g><path d="M0 30L0 -60" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 30L0 -60" stroke="#9a6a3c" stroke-width="6" stroke-linecap="round"/><rect x="-26" y="-92" width="52" height="34" rx="5" ${st('#6a6f7a',5)}/></g>`});
const sackProp=()=>({svg:`<g><path d="M-30 20Q-44 -20 -26 -50L-12 -64H12L26 -50Q44 -20 30 20Z" ${st('#c9b48a',5)}/><path d="M-14 -62L14 -62" stroke="${INK}" stroke-width="6"/><path d="M-16 -4L-4 -16M6 -2L18 -14" stroke="#6b4a2c" stroke-width="5" opacity=".7"/></g>`});
const cubeProp=(melt=0)=>({svg:`<g transform="scale(${N(1-.6*melt)})"><rect x="-22" y="-44" width="44" height="44" rx="6" fill="url(#gIce)" stroke="${INK}" stroke-width="5"/><rect x="-14" y="-38" width="28" height="9" rx="4" fill="#fff" opacity=".8"/></g>`});
const chalkProp=()=>({svg:`<g><rect x="-6" y="-8" width="12" height="40" rx="3" fill="#f4efe2" stroke="${INK}" stroke-width="4" transform="rotate(20)"/></g>`});
const rulerProp=()=>({svg:`<g><rect x="-80" y="-9" width="160" height="18" fill="#e8c878" stroke="${INK}" stroke-width="4"/><path d="M-70 -9v8M-50 -9v12M-30 -9v8M-10 -9v12M10 -9v8M30 -9v12M50 -9v8M70 -9v12" stroke="${INK}" stroke-width="2.4"/></g>`});
const lantern=(x,y,col='#ffb85a',k=1)=>`<g transform="translate(${x} ${y})"><path d="M0 -90V-34" stroke="${INK}" stroke-width="5"/><path d="M-18 -34H18L24 4H-24Z" ${st('#4a3a2a',5)}/><rect x="-14" y="-28" width="28" height="28" rx="6" fill="${col}" stroke="${INK}" stroke-width="4" opacity="${N(.7+.3*k)}"/><path d="M-12 -34Q0 -52 12 -34" fill="none" stroke="${INK}" stroke-width="5"/></g>`;

/* ============================== Stage C: painted sets (canvas, under the SVG). Each is a pure function of its arguments. */
/* the hold, cut away: boards at the back, hull timbers either side, keelson under, a lamp's glow. c = camera (pass the same one to cam()) */
function paintHold(ctx,t,{c,tone='#8a5c36',lamp=[260,560],lc='#ffb85a',la=.8,r=520,cold=0,dim=0,shafts=0}={}){
  ctx.save(); camCtx(ctx,c);
  PNT.wood(ctx,[-500,-300,2100,2200],{tone:shade(tone,.7),sc:.9,rot:90,ox:40,light:[0,300,0,1100,.45]});
  const hull=new Path2D(); hull.rect(60,330,130,730); hull.rect(890,330,130,730); hull.rect(-500,958,2100,300);
  PNT.wood(ctx,hull,{tone:shade(tone,.5),sc:.7,ox:20,light:[60,0,300,0,.4]});
  PNT.glow(ctx,lamp[0],lamp[1],r,lc,la);
  if(cold>0){ ctx.fillStyle=pA('#2a4a96',.34*cold); ctx.fillRect(-500,-300,2100,2200); }
  if(dim>0){ ctx.fillStyle=pA('#0a0612',dim); ctx.fillRect(-500,-300,2100,2200); }
  if(shafts>0) PNT.shafts(ctx,t,{x:560,y:300,angle:90,spread:30,n:5,len:850,alpha:.2*shafts,motes:36,seed:2});
  ctx.restore(); }
/* a painted globe: ocean, coarse continents, graticule, terminator. cl = centre longitude, route = progress 0-1 of the voyage */
const GLOBE={cx:540,cy:690,r:330,tilt:.3};
function gproj(lon,lat,cl){ const l=rad(lon-cl), p=rad(lat), cp=Math.cos(p), sp=Math.sin(p), ct=Math.cos(GLOBE.tilt), sn=Math.sin(GLOBE.tilt);
  return [GLOBE.cx+cp*Math.sin(l)*GLOBE.r, GLOBE.cy-(ct*sp-sn*cp*Math.cos(l))*GLOBE.r, sn*sp+ct*cp*Math.cos(l)]; }
const LAND=[[[-125,50],[-100,60],[-80,64],[-62,58],[-55,48],[-67,44],[-75,38],[-81,31],[-80,25],[-90,29],[-97,26],[-105,20],[-118,32],[-125,42]],
  [[-80,10],[-62,11],[-50,0],[-35,-6],[-40,-22],[-58,-38],[-66,-55],[-74,-50],[-72,-20],[-80,-5]],
  [[-10,36],[-9,44],[0,50],[10,56],[28,70],[40,66],[40,45],[28,40],[15,38]],
  [[-17,21],[-10,35],[10,37],[32,31],[43,12],[51,12],[40,-5],[40,-15],[33,-27],[20,-35],[14,-22],[9,-1],[-8,5],[-17,14]],
  [[35,30],[50,28],[58,22],[52,13],[44,13],[38,22]],
  [[45,40],[60,55],[90,62],[120,55],[125,40],[105,25],[92,26],[80,30],[70,35],[55,38]],
  [[68,24],[73,19],[77,8],[80,10],[80,15],[87,21],[89,22],[92,26],[88,27],[80,30],[74,34],[70,28]]];
const ROUTE=[[-71,42],[-58,34],[-42,18],[-30,4],[-20,-14],[-6,-30],[14,-38],[34,-36],[56,-26],[74,-10],[85,6],[88,21.5]];
function routePt(k){ const n=ROUTE.length-1, f=clamp(k,0,1)*n, i=Math.min(n-1,Math.floor(f)), q=f-i; return [lerp(ROUTE[i][0],ROUTE[i+1][0],q),lerp(ROUTE[i][1],ROUTE[i+1][1],q)]; }
function paintGlobe(ctx,t,{cl=-45,route=0}={}){
  PNT.sky(ctx,{top:'#0d1838',mid:'#1c3466',bot:'#2c4a86',y0:0,y1:1920,midAt:.5}); PNT.stars(ctx,t,{n:90,a:.9,seed:3,y0:120,y1:1100});
  const {cx,cy,r}=GLOBE; PNT.glow(ctx,cx,cy,r*1.5,'#6aa8e8',.28);
  const g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r); g.addColorStop(0,'#5fb2e6'); g.addColorStop(.6,'#2a74b8'); g.addColorStop(1,'#14407a');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.clip();
  ctx.strokeStyle='rgba(255,255,255,.16)'; ctx.lineWidth=2;
  for(let lo=-180;lo<180;lo+=30){ ctx.beginPath(); let on=false; for(let la=-85;la<=85;la+=5){ const p=gproj(lo,la,cl); if(p[2]>0){ on?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); on=true; } else on=false; } ctx.stroke(); }
  for(let la=-60;la<=60;la+=30){ ctx.beginPath(); let on=false; for(let lo=-180;lo<=180;lo+=6){ const p=gproj(lo,la,cl); if(p[2]>0){ on?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); on=true; } else on=false; } ctx.stroke(); }
  LAND.forEach((poly,i)=>{ ctx.beginPath(); poly.forEach(([lo,la],j)=>{ const p=gproj(lo,la,cl); let x=p[0], y=p[1]; if(p[2]<0){ const dx=x-cx, dy=y-cy, d=Math.hypot(dx,dy)||1; x=cx+dx/d*r*1.02; y=cy+dy/d*r*1.02; } j?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.closePath();
    ctx.fillStyle=i===6?'#d8b45a':'#7aa84e'; ctx.fill(); ctx.strokeStyle='rgba(20,30,10,.55)'; ctx.lineWidth=3; ctx.stroke(); });
  const sh=ctx.createRadialGradient(cx-r*.45,cy-r*.3,r*.5,cx+r*.15,cy,r*1.12); sh.addColorStop(0,'rgba(8,14,40,0)'); sh.addColorStop(.7,'rgba(8,14,40,.25)'); sh.addColorStop(1,'rgba(8,14,40,.7)');
  ctx.fillStyle=sh; ctx.fillRect(cx-r,cy-r,2*r,2*r);
  if(route>0){ const n=Math.round(60*sat(route)); for(let i=0;i<=n;i++){ const q=routePt(i/60), p=gproj(q[0],q[1],cl); if(p[2]<.02) continue; ctx.fillStyle='#1a1020'; ctx.beginPath(); ctx.arc(p[0],p[1],8,0,7); ctx.fill(); ctx.fillStyle='#ffc93a'; ctx.beginPath(); ctx.arc(p[0],p[1],5.5,0,7); ctx.fill(); } }
  ctx.restore(); }
/* open ocean with a vanishing-point line across it (the equator). x0 = where the line meets the bottom of the frame */
function paintOpenSea(ctx,t,{x0=650,ph=.24,line=1,HZ=720}={}){
  const L=dayLight(ph);
  PNT.sky(ctx,{top:L.c.top,mid:L.c.mid,bot:L.c.bot,y0:100,y1:HZ,midAt:.6,to:HZ+6});
  PNT.sun(ctx,330,HZ-420,46,L.sun.col,.9);
  PNT.clouds(ctx,t,{alt:420,h:260,drift:8,alpha:.7,sc:2.2,col:L.c.cloud,seed:4});
  PNT.sea(ctx,t,{horizon:HZ,far:pMix(L.c.bot,L.c.sea,.3),mid:pMix(L.c.mid,L.c.sea,.6),near:L.c.sea,rip:.36,dk:.28,ripCol:'#ffffff',glint:[330,300,L.sun.col,.8],swell:7,speed:8,n:90});
  PNT.band(ctx,HZ,40,L.c.bot,.5);
  if(line){ for(let i=0;i<13;i++){ const d0=Math.pow(i/13,1.7), d1=Math.pow((i+.55)/13,1.7), y0=HZ+30+d0*(1750-HZ), y1=HZ+30+d1*(1750-HZ), f0=(y0-HZ)/(1750-HZ), f1=(y1-HZ)/(1750-HZ), xa=540+(x0-540)*f0, xb=540+(x0-540)*f1, w0=2+f0*30, w1=2+f1*30;
      ctx.fillStyle='rgba(255,255,255,.9)'; ctx.beginPath(); ctx.moveTo(xa-w0/2,y0); ctx.lineTo(xa+w0/2,y0); ctx.lineTo(xb+w1/2,y1); ctx.lineTo(xb-w1/2,y1); ctx.closePath(); ctx.fill(); } } }
/* New England pond at dusk: pale sky, dark firs, snow banks, a frozen sheet */
function paintPond(ctx,t,{c}){ ctx.save(); camCtx(ctx,camPar(c,.25));
  PNT.sky(ctx,{top:'#7f9cc4',mid:'#e6c6c0',bot:'#fbe6cc',y0:100,y1:760,midAt:.6,to:790});
  const r=rng(31); ctx.fillStyle='#2c3a4a'; for(let i=0;i<26;i++){ const x=-80+i*52+r()*20, h=70+r()*90; ctx.beginPath(); ctx.moveTo(x-28,760); ctx.lineTo(x,760-h); ctx.lineTo(x+28,760); ctx.fill(); }
  PNT.haze(ctx,640,790,'#f3d8c6',.5); ctx.restore();
  ctx.save(); camCtx(ctx,camPar(c,.6));
  PNT.sea(ctx,t,{horizon:760,far:'#dbe7f0',mid:'#bfd6e6',near:'#9cc0d8',rip:.12,dk:.12,ripCol:'#ffffff',swell:0,speed:0,n:60,seed:5});
  ctx.fillStyle='#f4f8fb'; ctx.strokeStyle='rgba(120,150,190,.5)'; ctx.lineWidth=6;
  [[-60,0],[1080,1]].forEach(([bx,fl])=>{ ctx.beginPath(); ctx.moveTo(bx,1000); ctx.bezierCurveTo(bx+(fl?-60:60),860,bx+(fl?-220:220),800,bx+(fl?-330:330),780); ctx.lineTo(bx+(fl?-330:330),780); ctx.lineTo(bx+(fl?-330:330),1300); ctx.lineTo(bx,1300); ctx.closePath(); ctx.fill(); });
  PNT.haze(ctx,760,1000,'#bcd0e4',.25); ctx.restore(); }
/* tannery yard: warm grey sky, packed earth, vats, hides on a rail */
function paintTannery(ctx,t,{c}){ ctx.save(); camCtx(ctx,camPar(c,.3));
  PNT.sky(ctx,{top:'#a9a89f',mid:'#d6cbb6',bot:'#eadfc8',y0:100,y1:760,midAt:.55,to:790}); PNT.clouds(ctx,t,{alt:420,h:200,drift:5,alpha:.45,sc:2,col:'#e6e0d6',seed:9,flat:.5});
  ctx.fillStyle='#6a5a4a'; for(let i=0;i<7;i++){ const x=-40+i*190; ctx.fillRect(x,560+(i%3)*30,150,230-(i%3)*30); ctx.fillStyle=i%2?'#74634f':'#695847'; }
  ctx.restore(); ctx.save(); camCtx(ctx,c);
  ctx.fillStyle='#8c7656'; ctx.fillRect(-500,800,2100,1200); PNT.haze(ctx,800,1000,'#3a2c1c',.35);
  PNT.wood(ctx,[-500,1010,2100,900],{tone:'#7a6446',sc:1.2,k:.5});
  [[210,0],[560,1],[880,0]].forEach(([vx,k])=>{ const v=new Path2D(); v.rect(vx-120,840,240,200); PNT.wood(ctx,v,{tone:'#7a4e2c',sc:.5,rot:90,light:[vx-120,0,vx+120,0,.5]}); ctx.fillStyle=k?'#5a3a1c':'#3a2a1a'; ctx.beginPath(); ctx.ellipse(vx,842,120,26,0,0,7); ctx.fill(); });
  PNT.shadow(ctx,540,1060,700,60,.35); ctx.restore(); }
/* Hooghly at morning: golden haze, layered banks fading with depth, river */
function paintRiver(ctx,t,{c}){ ctx.save(); camCtx(ctx,camPar(c,.2));
  PNT.sky(ctx,{top:'#8fb4d6',mid:'#f2d3a0',bot:'#ffe9c2',y0:100,y1:840,midAt:.62,to:860}); PNT.sun(ctx,720,640,50,'#fff0c0',.9);
  PNT.clouds(ctx,t,{alt:430,h:240,drift:6,alpha:.5,sc:2,col:'#fff0d8',seed:12}); ctx.restore();
  const bank=(base,col,hh,seed,pk)=>{ const r=rng(seed); ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(-200,base+60); for(let x=-200;x<=1300;x+=26){ const h=hh*(.35+.65*Math.abs(Math.sin(x*.013+seed)))*(r()>.86?1.6:1); ctx.lineTo(x,base-h); } ctx.lineTo(1300,base+60); ctx.closePath(); ctx.fill(); };
  ctx.save(); camCtx(ctx,camPar(c,.35)); bank(840,'#b8bca0',60,3); PNT.haze(ctx,760,860,'#ffe4b8',.55); ctx.restore();
  ctx.save(); camCtx(ctx,camPar(c,.5)); bank(860,'#8a9a6e',80,7); PNT.haze(ctx,780,880,'#ffe4b8',.4); ctx.restore();
  ctx.save(); camCtx(ctx,camPar(c,.75));
  PNT.sea(ctx,t,{horizon:880,far:'#d8c8a0',mid:'#c0a878',near:'#8a7a52',rip:.3,dk:.2,ripCol:'#fff0c8',glint:[720,260,'#fff0c0',.7],swell:3,speed:5,n:60,seed:2});
  bank(880,'#4f6a3e',110,11); ctx.restore();
  ctx.save(); camCtx(ctx,c); PNT.haze(ctx,880,1100,'#ffe4b8',.18); ctx.restore(); }
/* docks at midday: bleached sky, river, a warehouse wall and pier planks. wall=0 hides the wall */
function paintDocks(ctx,t,{c,wall=1,ph=.26}={}){ const L=dayLight(ph); ctx.save(); camCtx(ctx,camPar(c,.25));
  PNT.sky(ctx,{top:'#74b8e8',mid:'#e6f2f2',bot:'#fff2d4',y0:100,y1:760,midAt:.62,to:790}); PNT.sun(ctx,820,360,44,'#fffbe8',.9); ctx.restore();
  ctx.save(); camCtx(ctx,camPar(c,.6));
  PNT.sea(ctx,t,{horizon:760,far:'#d8d0a8',mid:'#b8a878',near:'#8a7a52',rip:.3,dk:.18,ripCol:'#fff6d0',glint:[820,260,'#fffbe8',.7],swell:3,speed:5,n:50,seed:6,to:960});
  PNT.band(ctx,760,50,'#fff2d4',.6); ctx.restore();
  ctx.save(); camCtx(ctx,c);
  if(wall){ PNT.wood(ctx,[-500,300,2100,700],{tone:'#cdb58a',sc:.35,k:.55,light:[0,300,0,1000,.3]}); PNT.haze(ctx,880,1000,'#2a1a10',.3); }
  PNT.wood(ctx,[-500,1000,2100,1000],{tone:'#a8885a',sc:1,rot:0,ox:30,oy:1000,light:[0,1000,0,1600,.35]});
  PNT.haze(ctx,1000,1030,'#1a1020',.35); ctx.restore();
  PNT.band(ctx,980,60,'#fff4dc',.22); }
/* the ice house: pale sky, grass, cool shade pooled around the walls */
function paintIceHouse(ctx,t,{c}){ ctx.save(); camCtx(ctx,camPar(c,.3));
  PNT.sky(ctx,{top:'#8ec0e4',mid:'#dcecf0',bot:'#fbf2dc',y0:100,y1:820,midAt:.6,to:860}); PNT.clouds(ctx,t,{alt:420,h:220,drift:6,alpha:.55,sc:2,col:'#ffffff',seed:14}); ctx.restore();
  ctx.save(); camCtx(ctx,c);
  const r=rng(8); ctx.fillStyle='#4f7a3e'; for(let i=0;i<9;i++){ const x=-60+i*150+r()*40, h=140+r()*120; ctx.beginPath(); ctx.ellipse(x,860-h*.2,70,h*.6,0,0,7); ctx.fill(); }
  PNT.haze(ctx,760,880,'#e6f0e0',.4);
  PNT.wood(ctx,[-500,860,2100,1100],{tone:'#8a9a5e',sc:1.2,k:.4,light:[0,860,0,1500,.3]});
  PNT.shadow(ctx,540,1000,520,70,.45,'#18304a'); ctx.restore(); }
/* stone wall for the door close-up */
function paintStone(ctx,t,{c}){ ctx.save(); camCtx(ctx,c); PNT.wood(ctx,[-500,-300,2100,2400],{tone:'#9d9078',sc:.5,k:.7,light:[0,200,0,1200,.4]});
  const r=rng(5); ctx.strokeStyle='rgba(30,22,14,.4)'; ctx.lineWidth=5; for(let y=300;y<1500;y+=120){ ctx.beginPath(); ctx.moveTo(-300,y); ctx.lineTo(1400,y); ctx.stroke(); for(let x=-300+(y/120%2)*90;x<1400;x+=180){ ctx.beginPath(); ctx.moveTo(x+r()*20,y); ctx.lineTo(x+r()*20,y+120); ctx.stroke(); } }
  PNT.haze(ctx,300,700,'#0a1420',.35); ctx.restore(); }
