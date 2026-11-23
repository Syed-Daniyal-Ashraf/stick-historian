/* ============================== props: Ice to Calcutta (ic/) - costumes, props and painted sets
   STAGE B TEST BUILD: only what the painted-layer test shot (storyboard cut 5b, the doldrums) needs. Stage C adds the rest
   (iceBlock, ship, holdCutaway, cutter, horse, slate, iceHouse, and the other painters in brief section 7). */
Object.assign(TC,{
  sailor:{skin:'#e3b088',hair:'#4a3020',top:'#f1ece0',topDk:'#d4cdbd',pants:'#3c4a66',shoe:'#2a1e16',cap:'flat',capC:'#2a3550',mus:'thin',headS:1.16,build:.1},
});

/* ---- the sky's day: k = 0..1 through one day, midnight at 0 and 1, noon at .5.
   Light follows one smooth sine per day, so the time-lapse never jumps from day to night between two frames: at ~2 days a
   second that would be a full-screen flash (WCAG 2.3.1 allows at most 3 a second, and smooth is safer than sharp).
   The sun sets into the sea (it is painted under the sea), so no separate sunrise/sunset switch is needed. ---- */
const SKY_DAY  ={top:'#2f74b8',mid:'#93c7e6',bot:'#f1ecd8'};
const SKY_DUSK ={top:'#3a4a86',mid:'#de8c62',bot:'#f4c47e'};
const SKY_NIGHT={top:'#1a2b5a',mid:'#33508a',bot:'#5674a6'};     // deep blue, never black: keeps the swing gentle
function skyAt(k){
  const mixC=(A,B,f)=>({top:mixHex(A.top,B.top,f),mid:mixHex(A.mid,B.mid,f),bot:mixHex(A.bot,B.bot,f)});
  const L=.5-.5*Math.cos(2*Math.PI*k);                                         // 0 at midnight, 1 at noon
  const col=L<.5?mixC(SKY_NIGHT,SKY_DUSK,smoothstep(0,.5,L)):mixC(SKY_DUSK,SKY_DAY,smoothstep(.5,1,L));
  const a=(k-.08)/.84, el=Math.sin(Math.PI*a), sun=[lerp(-90,1170,a),800-600*el];   // at night it sits below the horizon, hidden by the sea
  return {...col,sun,vis:smoothstep(0,.25,el),light:lerp(.45,1,L),night:1-smoothstep(.1,.42,L)};   // vis: everything the sun casts fades with it
}

/* ---- painted set: open sea from the deck. h = horizon (screen y). ---- */
function paintSeaDeck(ctx,c,t,S,{h=700,deckY=1050,mastX=800}={}){
  PNT.sky(ctx,{top:S.top,mid:S.mid,bot:S.bot,midAt:.6,y1:h+40,sun:[S.sun[0],S.sun[1],46,'#fff6dc'],halo:(.5+.3*S.light)*S.vis});
  PNT.stars(ctx,{alpha:S.night,y1:h-60,t,seed:11});
  PNT.clouds(ctx,c,t,{alt:h-150,h:150,alpha:.55*S.light+.12,drift:22,scale:1.5,tint:['#2a3560',S.night*.6]});
  PNT.clouds(ctx,c,t,{alt:h-60,h:90,alpha:.4*S.light+.1,drift:40,scale:1.1,seed:3,tint:['#2a3560',S.night*.6]});
  const sea=mixHex('#0c3f63','#06152e',S.night), sh=mixHex('#5f9fc0','#1b3358',S.night), hz=mixHex(S.bot,'#ffffff',.25);
  PNT.sea(ctx,c,t,{horizon:h,bottom:deckY-60,deep:sea,shallow:sh,haze:hz,swell:.12,speed:.35,glint:[S.sun[0],.9*S.light*S.vis]});
  PNT.haze(ctx,h+120,h-40,hz,.0);
  // the ship, in world space (follows the camera): bulwark, deck, mast
  ctx.save(); camCtx(ctx,c);
  const dl=lerp(.35,-.1,S.night);
  const night=S.night*.7;
  PNT.deck(ctx,deckY,deckY+880,{x0:-120,x1:1200,tone:mixHex('#c08a50','#4a4868',night),rows:13,grow:3.2,light:.3*S.light,shade:.45});
  // bulwark (the ship's side wall) with a rail on top
  PNT.wood(ctx,[-120,deckY-64,1320,64],{tone:mixHex('#7a4a28','#2e2c46',night),light:dl*.6,scale:.5});
  PNT.wood(ctx,[-120,deckY-82,1320,22],{tone:mixHex('#5a361e','#22203a',night),light:.3,scale:.35});
  PNT.wood(ctx,[mastX-42,-400,84,deckY-60+400],{tone:mixHex('#8a5a32','#34304c',night),light:0,scale:.55,rot:90});
  // mast shading: lit side follows the sun
  const side=clamp((S.sun[0]-mastX)/200,-1,1)*S.vis, g=ctx.createLinearGradient(mastX-36,0,mastX+36,0);
  g.addColorStop(0,`rgba(0,0,0,${N(.06+.34*sat(side))})`); g.addColorStop(.5,'rgba(0,0,0,0)'); g.addColorStop(1,`rgba(0,0,0,${N(.06+.34*sat(-side))})`);
  ctx.fillStyle=g; ctx.fillRect(mastX-42,-400,84,deckY-60+400);
  // the mast's shadow across the deck, swinging with the sun
  if(S.vis>.01){ const sx=(mastX-S.sun[0])*.9; ctx.fillStyle=`rgba(20,10,30,${.22*S.light*S.vis})`; ctx.beginPath(); ctx.moveTo(mastX-40,deckY+4); ctx.lineTo(mastX+40,deckY+4); ctx.lineTo(mastX+40+sx,deckY+900); ctx.lineTo(mastX-40+sx,deckY+900); ctx.fill(); }
  ctx.restore();
  if(S.vis>.01) PNT.glow(ctx,S.sun[0],S.sun[1],260,'#fff1c4',.22*S.light*S.vis);
}
/* tally marks scratched on the mast: n marks in groups of five (fifth one across) */
function tallies(n,x,y,{col='#f6eed8',gap=15,len=64,k=1}={}){ let g='';
  for(let i=0;i<n;i++){ const grp=Math.floor(i/5), j=i%5, gx=x+grp*0, gy=y+grp*88, a=i===n-1?k:1; if(a<=0) continue;
    if(j<4) g+=`<path d="M${N(gx+j*gap)} ${N(gy)}l${N(2)} ${N(len*a)}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`;
    else g+=`<path d="M${N(gx-6)} ${N(gy+len*.75)}L${N(gx-6+(gap*3+12)*a)} ${N(gy+len*.75-30*a)}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`; }
  return g; }

/* ======================= Stage C additions: costumes ======================= */
/* Stage D: sailor2 (Boston packer) now dark cap, waistcoat, dark trousers; buyers lost the white topi; buyer3 replaces lb's 'lekh' in 8a (the subscribers were British residents). */
Object.assign(TC,{
  sailor2:{skin:'#d9a57c',hair:'#2a1c12',top:'#ddd2b8',topDk:'#bdb298',vest:'#4a3a30',pants:'#4a4048',shoe:'#2a1e16',cap:'flat',capC:'#2e2a28',mus:'thick',headS:1.14,build:.35},
  scarfy:{skin:'#e3b088',hair:'#7a4a22',top:'#6a4a3a',topDk:'#523a2e',pants:'#3c3a44',shoe:'#2a1e16',cap:'flat',capC:'#3a3a44',headS:1.14,build:.2},
  mate:{skin:'#dba67a',hair:'#8a8a86',grey:.6,suit:true,top:'#27324f',topDk:'#1c2540',shirt:'#f1ece0',tie:'#c8372d',pants:'#27324f',shoe:'#1a120c',cap:'flat',capC:'#1c2540',mus:'thick',headS:1.16,build:.6},
  coatA:{skin:'#e6b794',hair:'#4a3020',suit:true,top:'#6a4030',topDk:'#52301f',shirt:'#8a7a60',tie:'#8a7a60',pants:'#4a4048',shoe:'#1e1610',cap:'flat',capC:'#4a3a30',mus:'thin',headS:1.14,build:.3},
  coatB:{skin:'#d9a37a',hair:'#2a1e16',suit:true,top:'#3a5a4a',topDk:'#2c4639',shirt:'#8a8470',tie:'#8a8470',pants:'#3a3a40',shoe:'#1e1610',cap:'flat',capC:'#2c2c34',beard:true,headS:1.14,build:.5},
  tanner:{skin:'#c8946a',hair:'#1c1410',top:'#8a6a4a',topDk:'#6a4e34',pants:'#5a4a3a',shoe:'#2a1e16',bald:true,mus:'thick',headS:1.16,build:.7},
  buyer:{skin:'#efc4a0',hair:'#c8b898',suit:true,top:'#f6f2e6',topDk:'#d8d2c0',shirt:'#fffaf0',tie:'#2c5e8a',pants:'#f6f2e6',shoe:'#d8d2c0',capC:'#f1ead8',mus:'thick',headS:1.14,build:.6},
  buyer2:{skin:'#ecbc94',hair:'#4a3a2a',suit:true,top:'#e8e0c8',topDk:'#c8c0a8',shirt:'#fffaf0',tie:'#8a2a2a',pants:'#e8e0c8',shoe:'#d0c8b0',capC:'#e8e0c8',glasses:true,headS:1.14,build:.2},
  buyer3:{skin:'#f0c8a4',hair:'#7a4a22',suit:true,top:'#3a4a3a',topDk:'#2c382c',shirt:'#fffaf0',tie:'#2a2a2a',pants:'#3a3a40',shoe:'#1a120c',mus:'thin',headS:1.14,build:.5},
  boatman:{skin:'#a8723f',hair:'#1a120c',top:'#efe9da',topDk:'#d5ceba',pants:'#efe9da',dhoti:true,shoe:'#4a2e1a',cap:'pagri',capC:'#c8572e',mus:'thin',headS:1.14,build:.1},
  porter:{skin:'#b07848',hair:'#1a120c',top:'#d9c49a',topDk:'#b8a478',pants:'#efe9da',dhoti:true,shoe:'#4a2e1a',headS:1.14,build:.2},
});

/* ======================= ice ======================= */
/* One block of ice. (x,y) = bottom centre of the front face. melt 0..1 shrinks it; frost 0..1 draws crackle lines; a = opacity. */
function iceCube(x,y,w,h,{d=.26,a=.9,frost=0,melt=0,hot=0,sheen=1,pud=1}={}){ const f=1-.62*melt, W=w*f, H=h*f, dx=W*d, dy=H*d*.55, id=++UID;
  const x0=x-W/2, y0=y-H, sw=Math.max(3,Math.min(6,W*.03));
  let g=`<defs><linearGradient id="ic${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e4f8ff"/><stop offset=".55" stop-color="#a8dcee"/><stop offset="1" stop-color="#78b8d6"/></linearGradient></defs>`;
  if(pud&&melt>0.02) g+=`<ellipse cx="${N(x+W*.1)}" cy="${N(y+4)}" rx="${N(W*(.55+.9*melt))}" ry="${N(10+W*.09*melt)}" fill="#8fd0ea" opacity=".75" stroke="${INK}" stroke-width="3"/>`;
  g+=`<g opacity="${N(a*100)/100}"><path d="M${N(x0+W)} ${N(y0)}L${N(x0+W+dx)} ${N(y0-dy)}L${N(x0+W+dx)} ${N(y-dy)}L${N(x0+W)} ${N(y)}Z" fill="#6aa8c8" stroke="${INK}" stroke-width="${N(sw)}" stroke-linejoin="round"/>`
   +`<path d="M${N(x0)} ${N(y0)}L${N(x0+dx)} ${N(y0-dy)}L${N(x0+W+dx)} ${N(y0-dy)}L${N(x0+W)} ${N(y0)}Z" fill="#f2fcff" stroke="${INK}" stroke-width="${N(sw)}" stroke-linejoin="round"/>`
   +`<rect x="${N(x0)}" y="${N(y0)}" width="${N(W)}" height="${N(H)}" rx="${N(W*.04)}" fill="url(#ic${id})" stroke="${INK}" stroke-width="${N(sw)}" stroke-linejoin="round"/>`;
  if(sheen) g+=`<path d="M${N(x0+W*.14)} ${N(y0+H*.16)}L${N(x0+W*.34)} ${N(y0+H*.1)}M${N(x0+W*.14)} ${N(y0+H*.3)}L${N(x0+W*.22)} ${N(y0+H*.27)}" stroke="#fff" stroke-width="${N(sw*1.5)}" stroke-linecap="round" opacity=".9"/>`;
  if(frost>0){ for(let i=0;i<7;i++){ const px=x0+W*(.1+.8*rnd(i*5+2)), k=sat(frost*1.4-rnd(i)*.4), L=H*.5*k;
      g+=`<path d="M${N(px)} ${N(y0)}l${N((rnd(i+9)-.5)*W*.2)} ${N(L*.5)}l${N((rnd(i+4)-.5)*W*.16)} ${N(L*.5)}" fill="none" stroke="#fff" stroke-width="${N(sw*.7)}" stroke-linecap="round" opacity=".9"/>`; } }
  g+=`</g>`;
  if(hot>0&&melt<.95){ const dp=(hot*3.1)%1; g+=`<path d="M${N(x0+W*.3)} ${N(y+dp*40)}q-6 11 0 15q6 -4 0 -15z" fill="#bfe9f7" stroke="${INK}" stroke-width="2.5" opacity="${op(1.2-dp)}"/>`; }
  return g; }
/* cold mist rolling off a block: soft white blobs drifting down and out */
function coldMist(x,y,w,t,n=6,a=.34){ let g=''; for(let i=0;i<n;i++){ const k=((t*.35+rnd(i*3+1))%1), px=x+(rnd(i*7+4)-.5)*w+(k-.2)*w*.9*(i%2?1:-1), py=y-8-k*10+k*k*40;
  g+=`<ellipse cx="${N(px)}" cy="${N(py)}" rx="${N(w*(.14+.12*k))}" ry="${N(w*.05*(1+k))}" fill="#fff" opacity="${N(a*Math.sin(Math.PI*k)*100)/100}"/>`; } return g; }
/* stack of blocks, columns x rows, front view: gap closes to 0 (seam lines remain at 0 as thin marks) */
function iceStack(x,y,cols,rows,bw,bh,{gap=0,a=1,seams=1}={}){ let g=''; const W=cols*bw+(cols-1)*gap, x0=x-W/2;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) g+=iceCube(x0+bw/2+c*(bw+gap),y-r*(bh+gap),bw,bh,{d:0,a,sheen:(r+c)%2===0});
  return g; }

/* ======================= ship (side view, generic square-rigger; masts are not a feature) ======================= */
function shipSvg(x,y,s,{dir=1,bob=0,sail=1,name=true,wet=1}={}){ const Y=y+bob;
  let g=`<g transform="translate(${N(x)} ${N(Y)}) scale(${N(s*dir*1000)/1000} ${s})">`;
  [[-150,-520,340],[110,-560,380]].forEach(([mx,top,h],i)=>{ g+=`<rect x="${mx-8}" y="${top}" width="16" height="${-top-20}" ${st('#6a4a2e',4)}/>`;
    if(sail){ const sw=130+i*14; for(let j=0;j<2;j++){ const sy=top+30+j*140, bl=.9+.1*Math.sin(j*2+i); g+=`<path d="M${mx-sw} ${sy}Q${mx} ${N(sy+22*bl)} ${mx+sw} ${sy}L${mx+sw-14} ${sy+120}Q${mx} ${N(sy+138*bl)} ${mx-sw+14} ${sy+120}Z" ${st('#f6efdc',5)}/>`; } } });
  g+=`<path d="M-290 -30L-250 40L260 40L340 -48L-290 -30Z" ${st('#2a2e3e',6)}/><path d="M-290 -30L340 -48L330 -32L-285 -14Z" ${st('#e9d9a8',4)}/>`
   +`<path d="M-250 40L260 40L250 56L-230 56Z" ${st('#5a2a22',5)}/>`;
  if(name) g+=`<text transform="translate(20 22) scale(${dir<0?-1:1} 1)" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="#f6efdc" stroke="${INK}" stroke-width="1.5" letter-spacing="3">TUSCANY</text>`;
  g+=`<path d="M340 -48L420 -92" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M340 -48L420 -92" stroke="#6a4a2e" stroke-width="6" stroke-linecap="round"/></g>`;
  return g; }

/* ======================= horse + ice cutter (side view, faces right) ======================= */
function horseSvg(x,y,s,t,{walk=1,col='#8a5a38'}={}){ const ph=t*5.2*walk; let g=`<g transform="translate(${N(x)} ${N(y)}) scale(${s})">`;
  const leg=(lx,p,back)=>{ const sw=Math.sin(ph+p)*22*walk, lift=Math.max(0,Math.cos(ph+p))*14*walk; return `<path d="M${lx} -120L${N(lx+sw*.6)} -62L${N(lx+sw)} ${N(-lift)}" fill="none" stroke="${back?shade(col,.8):col}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M${N(lx+sw)} ${N(-lift)}l2 0" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>`; };
  g+=leg(-72,Math.PI,true)+leg(66,0,true);
  g+=`<ellipse cx="0" cy="-150" rx="120" ry="58" ${st(col,5)}/><path d="M92 -176Q138 -222 152 -250L196 -226Q184 -190 134 -130Z" ${st(col,5)}/><path d="M146 -252Q176 -280 200 -234L226 -214Q232 -196 210 -196L190 -204Z" ${st(col,5)}/><path d="M132 -262Q104 -250 96 -200" fill="none" stroke="#2a1e16" stroke-width="12" stroke-linecap="round"/><circle cx="186" cy="-236" r="5" fill="${INK}"/><path d="M-118 -170Q-160 -150 -150 -100" fill="none" stroke="#2a1e16" stroke-width="12" stroke-linecap="round"/>`;
  g+=leg(-52,0)+leg(88,Math.PI);
  return g+`</g>`; }

/* ======================= painters for new sets (all deterministic: t + seeds only) ======================= */
/* the hold: dark planking all over, lantern glow, vignette. warm 0..1 shifts the light from blue-cold to amber */
/* static layers are baked once into a half-resolution canvas, keyed by their full input (brief section 9: bake static planes) */
function baked(key,fn,sc=.5){ const d=Math.min(window.devicePixelRatio||1,2);
  return cached('ic:'+key+':'+d,()=>{ const c=document.createElement('canvas'); c.width=Math.round(1080*sc); c.height=Math.round(1920*sc); const x=c.getContext('2d'); x.scale(sc,sc); fn(x); return c; }); }
const drawBaked=(ctx,c)=>ctx.drawImage(c,0,0,1080,1920);
/* the hold: dark planking all over (baked), a cold blue cast that fades with warm, lantern glow, vignette */
function paintHold(ctx,t,{warm=.6,lx=180,ly=420,tone='#4a2f1e',lant=1}={}){
  drawBaked(ctx,baked('hold:'+tone,x=>{ PNT.wood(x,[-20,-20,1120,1960],{tone,light:.05,scale:.6,rot:90}); for(let i=0;i<4;i++){ x.fillStyle='rgba(8,5,3,.35)'; x.fillRect(i*300+40,-20,10,1960); } }));
  if(warm<1){ ctx.fillStyle=`rgba(36,56,112,${N(.58*(1-warm)*100)/100})`; ctx.fillRect(0,0,1080,1920); }
  const fl=.92+.08*Math.sin(t*9.3)*Math.sin(t*3.7);
  if(lant>0){ PNT.glow(ctx,lx,ly,640,warm>.5?'#ffcf7a':'#7aa8ff',.34*fl*lant); PNT.glow(ctx,lx,ly,170,'#fff2c0',.5*fl*lant); }
  PNT.vignette(ctx,.55); }
function lanternSvg(x,y,t,s=1){ const fl=.9+.1*Math.sin(t*9.3); return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -70V-40" stroke="${INK}" stroke-width="5"/><path d="M-24 -40H24L30 40H-30Z" ${st('#3a3a42',5)}/><path d="M-18 -34H18L22 34H-22Z" fill="#ffe29a" opacity="${N(fl*100)/100}"/><rect x="-30" y="-52" width="60" height="14" rx="5" ${st('#2a2a32',5)}/></g>`; }

/* a stylised globe: ocean sphere, flat-coloured continents clipped to the circle, soft terminator. Atlantic faces the viewer. */
const LAND=[ // polygons around the globe centre (units: px at r=360)
 [[-335,-175],[-255,-255],[-150,-245],[-85,-170],[-118,-92],[-192,-42],[-244,-62],[-292,-112]],       // North America
 [[-205,12],[-132,0],[-98,70],[-148,182],[-200,272],[-218,150]],                                        // South America
 [[-12,-205],[58,-236],[124,-204],[92,-142],[22,-132]],                                                  // Europe
 [[-32,-112],[72,-122],[122,-52],[112,62],[72,172],[12,202],[-8,100],[-58,0],[-50,-72]],                // Africa
 [[112,-212],[254,-232],[334,-152],[324,-60],[282,-44],[262,-34],[240,56],[214,124],[188,44],[168,-8],[150,-40],[112,-102]] // Asia + India (Stage D: a clear peninsula; Calcutta at its north-east corner, ~[264,-36])
];
function paintGlobe(ctx,t,cx,cy,r,{spin=0}={}){ const k=r/360;
  ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.clip();
  let g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.1,cx,cy,r); g.addColorStop(0,'#59b0dc'); g.addColorStop(.6,'#2a74b0'); g.addColorStop(1,'#12396e'); ctx.fillStyle=g; ctx.fillRect(cx-r,cy-r,2*r,2*r);
  ctx.strokeStyle='rgba(255,255,255,.14)'; ctx.lineWidth=2; for(let i=-3;i<=3;i++){ ctx.beginPath(); ctx.ellipse(cx+spin*r*.0,cy+i*r*.25,r,Math.abs(r*.07*i)+1,0,0,7); ctx.stroke(); }
  for(let i=-3;i<=3;i++){ const m=Math.cos(i*.45+spin*.08)*r; ctx.beginPath(); ctx.ellipse(cx,cy,Math.abs(m),r,0,0,7); ctx.stroke(); }
  const sh=spin*14; LAND.forEach((poly,i)=>{ ctx.beginPath(); poly.forEach(([x,y],j)=>{ const X=cx+(x+sh)*k, Y=cy+y*k; j?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.closePath();
    ctx.fillStyle=i===4?'#7fa24c':i===3?'#b79a4c':'#6e9a4a'; ctx.fill(); ctx.strokeStyle='rgba(30,50,20,.55)'; ctx.lineWidth=3; ctx.stroke(); });
  g=ctx.createLinearGradient(cx-r,cy,cx+r,cy); g.addColorStop(0,'rgba(255,255,255,.12)'); g.addColorStop(.55,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(4,10,40,.62)'); ctx.fillStyle=g; ctx.fillRect(cx-r,cy-r,2*r,2*r);
  ctx.save(); ctx.setLineDash([22,14]); ctx.lineWidth=6; ctx.strokeStyle='#f2b630'; ctx.beginPath(); ctx.ellipse(cx,cy+28*k,r*.995,10*k,0,0,Math.PI); ctx.stroke(); ctx.restore();   // equator (Stage D), front half only
  ctx.restore(); ctx.strokeStyle='rgba(20,12,6,.85)'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.stroke(); }
const globePt=(cx,cy,r,p,spin=0)=>[cx+(p[0]+spin*14)*r/360, cy+p[1]*r/360];

/* winter pond at dusk */
function paintPond(ctx,t,{h=620}={}){ PNT.sky(ctx,{top:'#8aa2c4',mid:'#d8c4c8',bot:'#f6e2cc',midAt:.6,y1:h+40,sun:[820,h-30,40,'#ffe6c0'],halo:.5});
  ctx.fillStyle='#e9eef4'; ctx.beginPath(); ctx.moveTo(-20,h); for(let x=-20;x<=1100;x+=60) ctx.lineTo(x,h-26-34*Math.sin(x*.013)-14*Math.sin(x*.05)); ctx.lineTo(1100,h+30); ctx.lineTo(-20,h+30); ctx.fill();
  ctx.fillStyle='#4a5a54'; for(let i=0;i<14;i++){ const x=i*86+(i%3)*14, th=60+rnd(i+3)*70; ctx.beginPath(); ctx.moveTo(x-18,h-6); ctx.lineTo(x,h-6-th); ctx.lineTo(x+18,h-6); ctx.fill(); }
  let g=ctx.createLinearGradient(0,h,0,1500); g.addColorStop(0,'#cfe6f2'); g.addColorStop(.5,'#a8d0e6'); g.addColorStop(1,'#7eb2d0'); ctx.fillStyle=g; ctx.fillRect(-20,h,1120,1400);
  PNT.glow(ctx,820,h+20,300,'#ffe0b0',.22); ctx.save(); ctx.globalAlpha=.3; { const pp=pat(ctx,'glint'); pp.setTransform(new DOMMatrix([1,0,0,1,0,0])); ctx.fillStyle=pp; } ctx.fillRect(-20,h,1120,700); ctx.restore();
  PNT.haze(ctx,h-80,h+60,'#f6e2cc',.5); }
/* the Hooghly at morning: golden haze, river, layered banks */
function paintRiver(ctx,c,t,{h=640}={}){
  drawBaked(ctx,baked('river',x=>{ PNT.sky(x,{top:'#f2c27a',mid:'#f8d9a0',bot:'#fff0d0',midAt:.55,y1:h+40,sun:[760,h-120,70,'#fff6dc'],halo:.8});
  const bank=(y,col,amp,seed)=>{ x.fillStyle=col; x.beginPath(); x.moveTo(-20,y+80); for(let X=-20;X<=1100;X+=40) x.lineTo(X,y-amp*(.5+.5*Math.sin(X*.021+seed))-amp*.6*rnd(X*.01+seed)); x.lineTo(1100,y+80); x.fill(); };
  bank(h-6,'#9a8a6a',34,1); PNT.haze(x,h-110,h,'#fbe3b0',.55);
  [[h+4,'#7a8a56',44,2],[h+20,'#5a7a44',70,5]].forEach(([y,col,amp,s],i)=>{ bank(y,col,amp,s); for(let j=0;j<9;j++){ const X=60+j*125+rnd(j+i*9)*40, th=90+rnd(j*3+i)*60; x.fillStyle=i?'#3e5c34':'#6a7a4e'; x.beginPath(); x.arc(X,y-amp*.4-th*.35,th*.32,0,7); x.fill(); x.fillRect(X-4,y-amp*.4-th*.1,8,th*.5); } PNT.haze(x,y-90,y+20,'#fbe3b0',.38-i*.1); }); }));
  PNT.sea(ctx,c,t,{horizon:h+60,bottom:1060,deep:'#8a7a54',shallow:'#d9b878',haze:'#fbe3b0',glint:[760,.8],swell:.08,speed:.2}); }
/* river docks at noon: bleached sky, planked quay, heat shimmer */
function paintDocks(ctx,t,{h=640}={}){
  drawBaked(ctx,baked('docks',x=>{ PNT.sky(x,{top:'#8ec0e0',mid:'#e6efe6',bot:'#fff8e4',midAt:.5,y1:h+40,sun:[300,160,80,'#ffffff'],halo:.7});
  x.fillStyle='#b8b098'; for(let i=0;i<7;i++){ const X=i*170-40, w=90+rnd(i)*80, hh=110+rnd(i+3)*130; x.fillRect(X,h-hh,w,hh+40); x.fillStyle=i%2?'#a89e86':'#bdb59d'; }
  PNT.haze(x,h-200,h+40,'#fff4d6',.55); x.fillStyle='#6a4a30'; x.fillRect(-20,h+30,1120,1400); PNT.deck(x,h+30,1940,{x0:-200,x1:1280,tone:'#a08058',rows:12,grow:3,light:.5,shade:.3}); }));
  /*shimmer removed: cost*/ }
