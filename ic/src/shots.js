/* ============================== shots: Ice to Calcutta (ic/) - STAGE C
   Picture sits in y 290-1040, big captions below (letters y 1050-1175). Every narrated shot is split by CUT_EP (end of file) into
   sub-shots (part(n,u) -> {i,pu}); each sub-shot is its own function. P = painted canvas (paint()), S = SVG on top.
   Poses never snap: tween() or continuous mix()/sin. Narration timings: ic/vo/timing.json. */
const COVER_T=1.2;
const GYD=1130;                           // deck / floor line for figures on the ship
const NOON=skyAt(.5);
const DAY_S=1.1;                           // 5b: seconds per day/night (brief section 9: option a, <= ~1 day a second)
const SK={stand:full({}),
  hug:full({lean:3,tilt:-4,hF:[74,-168],hB:[58,-128],handF:'open',handB:'open',expr:'tired',look:[3,2]}),
  worry:full({lean:-2,hF:[40,-190],hB:[-8,-116],handF:'open',expr:'plead',look:[0,0]}),
  smug:full({lean:-3,tilt:-4,hF:[50,-176],hB:[40,-170],handF:'fist',handB:'fist',expr:'smug',look:[4,0]}),
  shock:full({lean:-6,tilt:-6,hF:[66,-236],hB:[36,-226],handF:'open',handB:'open',expr:'shock'}),
  point:full({lean:3,hF:[80,-190],hB:[-8,-116],handF:'point',expr:'determined'})};
const decks=(c,t,S_,o)=>paint(ctx=>paintSeaDeck(ctx,c,t,S_,o));
const FIN={boil:2.2,paper:.22,vig:.6};
const fin=(g,t,o)=>finish(g,t,{...FIN,...(o||{})});

/* ---------- 1 HOOK ---------- */
function sh1(t){ const u=t-S(1), P=part(1,u); return [sh1a,sh1b,sh1c,sh1c][P.i](P.pu,u,t,P.i); }
function sh1a(pu,u,t){ const c={x:540+22*u,y:960,z:1+.05*u}; decks(c,t,NOON,{mastX:900});
  const fr=seg(u,.5,1.4,E.o), pose0=tween(u,.2,full({...SK.hug,hF:[68,-160]}),full({...SK.hug,hF:[76,-176],hB:[56,-136],tilt:-6}),.5), pose={...pose0,hF:[pose0.hF[0]+Math.sin(u*5)*4,pose0.hF[1]+Math.sin(u*3.4)*5],lean:pose0.lean+Math.sin(u*2.6)*2.5};
  let g=`<text x="300" y="1030" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="#f6efdc" stroke="${INK}" stroke-width="2" letter-spacing="6" opacity=".92">TUSCANY</text>`;
  g+=`<ellipse cx="560" cy="1126" rx="210" ry="22" fill="#000" opacity=".28"/>`+iceCube(560,1120,330,300,{frost:fr,hot:1,a:.92})+coldMist(560,830,330,t,7,.4);
  g+=`<ellipse cx="330" cy="1134" rx="120" ry="16" fill="#000" opacity=".28"/>`+toon('sailor',330,GYD,1.7,1,pose,t,3)+sweat(404,598,.9,u,1.2);
  return fin(cam(c,g)+tag('1833',160,350,66,'#fff3c4',INK,{k:1,rot:-3}),t); }
function sh1b(pu,u,t){ const R=360, cx=540, cy=650, k=seg(pu,.25,2.05,E.io);
  paint(ctx=>{ const g=ctx.createLinearGradient(0,0,0,1920); g.addColorStop(0,'#0e1a3a'); g.addColorStop(1,'#1d3a6a'); ctx.fillStyle=g; ctx.fillRect(0,0,1080,1920); PNT.stars(ctx,{n:420,alpha:.9,y1:1900,t:0,seed:4}); PNT.glow(ctx,cx,cy,520,'#5aa0e0',.18); PNT.glow(ctx,540,1560,700,'#3a6ab0',.22); paintGlobe(ctx,t,cx,cy,R,{spin:pu*.5}); });
  const sp=pu*.5, route=[[-135,-120],[-112,-30],[-62,82],[0,190],[62,216],[142,152],[214,84],[250,10],[262,-40]].map(p=>globePt(cx,cy,R,p,sp));
  let len=[0]; for(let i=1;i<route.length;i++) len.push(len[i-1]+Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]));
  const L=len[len.length-1], at=d=>{ let i=1; while(i<len.length-1&&len[i]<d) i++; const f=(d-len[i-1])/(len[i]-len[i-1]); return [lerp(route[i-1][0],route[i][0],f),lerp(route[i-1][1],route[i][1],f)]; };
  let g=''; for(let d=0;d<=L*k;d+=24){ const p=at(d); g+=`<circle cx="${N(p[0])}" cy="${N(p[1])}" r="7.5" fill="${MARI}" stroke="${INK}" stroke-width="3"/>`; }
  const hd=at(L*k); g+=`<g transform="translate(${N(hd[0])} ${N(hd[1]-10)}) scale(.16)">${shipSvg(0,0,1,{sail:1,name:false})}</g>`;
  g+=tag('BOSTON',route[0][0]-120,route[0][1]-70,38,'#fff3c4',INK,{k:seg(pu,0,.3,E.back),rot:-3})+tag('CALCUTTA',route[8][0]-40,route[8][1]-80,38,MARI,INK,{k:seg(pu,1.9,2.2,E.back),rot:2});
  return fin(g,t,{vig:.8}); }
function sh1c(pu,u,t,i){ const flip=i===3, c={x:540,y:960,z:1}, lineX=flip?470:600, dur=flip?.98:2.1;
  const p=seg(pu,0,dur,E.lin), shipX=flip?lerp(1120,0,p):lerp(40,1120,p), dir=flip?-1:1, bob=Math.sin(t*2.1)*6, sy=1010;
  paint(ctx=>{ PNT.sky(ctx,{top:NOON.top,mid:NOON.mid,bot:NOON.bot,midAt:.6,y1:760,sun:[220,200,60,'#fff6dc'],halo:.7}); PNT.clouds(ctx,c,t,{alt:560,h:130,alpha:.6,drift:20,scale:1.4});
    PNT.sea(ctx,c,t,{horizon:720,bottom:1940,deep:'#0c4a78',shallow:'#6fb0cc',haze:'#e8efe0',swell:.2,speed:.5,glint:[220,.7]}); });
  let g=''; for(let j=0;j<9;j++){ const y0=736+Math.pow(j/8,1.6)*620, y1=736+Math.pow((j+.55)/8,1.6)*620, xa=540+(lineX-540)*(1+(y0-736)/380), xb=540+(lineX-540)*(1+(y1-736)/380);
    g+=`<path d="M${N(xa)} ${N(y0)}L${N(xb)} ${N(y1)}" stroke="#fffaf0" stroke-width="${N(10+j*3.2)}" stroke-linecap="round" opacity=".95"/>`; }
  g+=tag('EQUATOR',lineX+(flip?-30:30),500,64,'#fff3c4',INK,{k:seg(pu,0,.2,E.back),rot:flip?3:-3});
  g+=shipSvg(shipX,sy,.82,{dir,bob});
  const jump=Math.sin(Math.PI*seg(pu,flip?.3:.85,flip?.7:1.3,E.lin)), jx=shipX+60*dir, pose=full({...SK.shock,hF:[50,-250],hB:[20,-250],expr:'joy'});
  g+=toon('sailor',jx,sy-26+bob-80*jump,.62,dir,jump>.02?pose:full({hF:[30,-120],hB:[-6,-118],expr:'happy'}),t,5);
  if(flip){ const kk=seg(pu,.55,.8,E.o); g+=tallies(2,shipX-150*.82,sy-330,{k:kk,len:44,gap:11}); }
  return fin(g,t); }

/* ---------- 2 NO REFRIGERATION: how did it survive? ---------- */
function sh2(t){ const u=t-S(2), P=part(2,u); return [sh2a,sh2b,sh2c][P.i](P.pu,u,t); }
function sh2a(pu,u,t){ const c={x:520,y:980,z:1.28}; decks(c,t,NOON,{mastX:1000});
  paint(ctx=>PNT.haze(ctx,900,1060,'#fff4d6',.35));
  const fan=Math.sin(u*14)*14, drop=(u*1.3)%1, look=seg(u,1.3,1.7,E.io);
  let g=`<ellipse cx="610" cy="1132" rx="220" ry="22" fill="#000" opacity=".28"/>`+iceCube(640,1120,300,270,{hot:1,melt:.06})+coldMist(640,850,300,t,6,.34);
  const hat={svg:`<ellipse rx="42" ry="14" ${st('#f1ece0',4)}/><path d="M-26 0Q0 -34 26 0Z" ${st('#f1ece0',4)}/>`,rot:fan*.8};
  const pose=full({lean:-2,hF:[84+fan*.6,-176+fan*1.4],hB:[-10,-116],handF:'hold',holdF:hat,expr:look>.5?'plead':'tired',look:[lerp(5,-2,look),lerp(-2,2,look)]});
  g+=`<ellipse cx="330" cy="1134" rx="120" ry="16" fill="#000" opacity=".28"/>`+toon('sailor',330,GYD,1.55,1,{...pose,tilt:lerp(-3,4,look)},t,3)+sweat(392,626,.8,u,1.1);
  g+=`<path d="M${N(560)} ${N(940+drop*190)}q-8 14 0 20q8 -6 0 -20z" fill="#bfe9f7" stroke="${INK}" stroke-width="3" opacity="${op(1.3-drop)}"/>`;
  return fin(cam(c,g),t); }
function sh2b(pu,u,t){ const mv=seg(pu,0,3,E.lin), hx=lerp(380,700,mv); paint(ctx=>paintPond(ctx,t,{h:600}));
  let g=''; for(let j=0;j<3;j++){ const y=800+j*100; g+=`<path d="M-100 ${y}H${N(hx-120)}" stroke="#4f86ae" stroke-width="${8+j*3}" stroke-linecap="round" opacity=".8"/><path d="M-100 ${y+6}H${N(hx-120)}" stroke="#eaf8ff" stroke-width="3" opacity=".7"/>`; }
  const GYP=1000; g+=`<ellipse cx="${N(hx-40)}" cy="${GYP+8}" rx="260" ry="22" fill="#2a4a66" opacity=".35"/>`+horseSvg(hx+40,GYP,.78,t,{walk:1})+
    `<g transform="translate(${N(hx-190)} ${GYP})"><rect x="-160" y="-60" width="300" height="26" rx="6" ${st('#6a4a2e',5)}/><path d="M-130 -34V0M-50 -34V0M30 -34V0M100 -34V0" stroke="${INK}" stroke-width="12"/><path d="M-130 -34V0M-50 -34V0M30 -34V0M100 -34V0" stroke="#c9ccd2" stroke-width="5"/><path d="M140 -48L220 -90" stroke="${INK}" stroke-width="8"/></g>`;
  g+=toon('coatA',hx-160,GYP+10,1.1,1,full({lean:4,hF:[60,-150],hB:[44,-146],handF:'fist',handB:'fist',expr:'determined',fF:[22+Math.sin(t*5.2)*14,0],fB:[-14-Math.sin(t*5.2)*14,0]}),t,7);
  g+=toon('coatB',250,GYP+30,1.0,1,full({lean:-2,hF:[50,-176],hB:[-8,-118],handF:'point',expr:'neutral'}),t,9);
  g=`<g transform="translate(540 1040) scale(1.2) translate(-540 -1000)">${g}</g>`;
  return fin(g,t,{grade:['#8aa8d8',.12]}); }
function sh2c(pu,u,t){ paint(ctx=>{ const g=ctx.createLinearGradient(0,0,0,1920); g.addColorStop(0,'#c8e6f4'); g.addColorStop(1,'#8fc2dc'); ctx.fillStyle=g; ctx.fillRect(0,0,1080,1920); ctx.save(); ctx.globalAlpha=.25; { const pp=pat(ctx,'water'); pp.setTransform(new DOMMatrix([1,0,0,1,0,0])); ctx.fillStyle=pp; } ctx.fillRect(0,0,1080,1920); ctx.restore(); });
  let g=''; const n=4, bw=200, bh=200, x0=540-n*bw/2, gap=14;
  for(let r=0;r<3;r++) for(let c2=0;c2<n;c2++){ const i=r*n+c2, k=seg(pu,.1+i*.07,.3+i*.07,E.back); if(k<=0) continue;
    const bx=x0+c2*(bw+gap)+bw/2, by=470+r*(bh+gap)+bh; g+=`<g transform="translate(${N(bx)} ${N(by-bh/2)}) scale(${N(lerp(.5,1,E.back(sat(k)))*100)/100}) translate(${-N(bx)} ${-N(by-bh/2)})">${iceCube(bx,by,bw,bh,{d:.0,sheen:i%2===0,a:.95})}</g>`; }
  const rk=seg(pu,.7,1.0,E.back);
  g+=`<g transform="translate(${N(x0+bw*1.5)} 400) rotate(-6)" opacity="${op(rk*3)}"><rect x="-190" y="-14" width="380" height="28" rx="5" ${st('#e8c46a',5)}/>${[...Array(9)].map((_,i)=>`<path d="M${-170+i*42} -14v${i%2?14:22}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;
  g+=tag('2 FT',x0+bw*1.5,330,72,MARI,INK,{k:rk,rot:-3});
  g+=bigArm([1250,1500],[x0+bw*3.4,640],'#e6b794','#6a4030','hold','',1.0);
  return fin(g,t); }

/* ---------- 3 THE TRICK: packed with no gaps, one giant block ---------- */
const FLOORH='#2a1c12';
function holdFloor(y=1000){ return `<rect x="-20" y="${y}" width="1120" height="1000" fill="${FLOORH}"/><path d="M-20 ${y}H1100" stroke="${INK}" stroke-width="8"/>`+[...Array(7)].map((_,i)=>`<path d="M${i*180} ${y+8}L${i*230-60} 1920" stroke="#1a110a" stroke-width="5"/>`).join(''); }
function sh3(t){ const u=t-S(3), P=part(3,u); return [sh3a,sh3b,sh3c][P.i](P.pu,u,t); }
function sh3a(pu,u,t){ paint(ctx=>paintHold(ctx,t,{warm:.55,lx:170,ly:430})); const bw=190, x0=160, FY=1000;
  let g=holdFloor(FY)+lanternSvg(170,330,t,1.1), push=null;
  for(let i=0;i<4;i++){ const t0=.08+i*.27, k=seg(pu,t0,t0+.2,E.o), land=seg(pu,t0+.18,t0+.34,E.lin); if(k<=0) continue;
    const bx=x0+bw/2+i*bw+(1-k)*(i===0?420:520); g+=iceCube(bx,FY,bw,bw,{d:.0,sheen:i%2===0,a:.95}); g+=impact(bx+bw/2,FY-bw*.4,land,.35);
    if(k<1) push=[bx,i]; }
  const pi=push||[x0+bw/2+3*bw,3], wx=pi[0]+bw/2+60;
  g+=toon('sailor2',wx+30,FY+24,1.15,-1,full({lean:9,hF:[92,-150],hB:[74,-132],handF:'open',handB:'open',expr:'determined',look:[-4,2],fF:[26,0],fB:[-14,0]}),t,5);
  return fin(g,t,{grade:['#ffb060',.12]}); }
function sh3b(pu,u,t){ const k=seg(pu,.2,1.0,E.io), gap=lerp(16,0,k), pulse=seg(pu,1.0,1.5,E.lin), bw=290, bh=240, W=3*bw+2*gap, FY=930;
  paint(ctx=>paintHold(ctx,t,{warm:lerp(.55,.9,seg(pu,.9,1.6)),lx:150,ly:360}));
  let g=holdFloor(FY)+lanternSvg(150,300,t,1.2)+iceStack(540,FY,3,2,bw,bh,{gap});
  if(k>0){ const al=Math.sin(Math.PI*pulse)*.95, x0=540-W/2, y0=FY-2*bh-gap-6; g+=`<rect x="${N(x0-10)}" y="${N(y0-10)}" width="${N(W+20)}" height="${N(2*bh+gap+16)}" rx="14" fill="none" stroke="${MARI}" stroke-width="${N(10+8*pulse)}" opacity="${N(al*100)/100}"/>`; }
  g+=toon('sailor2',130,FY+30,1.1,1,tween(pu,.9,full({lean:-2,hF:[50,-150],hB:[-8,-118],expr:'neutral',look:[4,-2]}),full({lean:-5,tilt:-4,hF:[70,-250],hB:[44,-244],handF:'open',handB:'open',expr:'awe',look:[5,-5]}),.4),t,5);
  return fin(g,t,{grade:['#ffb060',.1]}); }
function sh3c(pu,u,t){ const c={x:540+10*pu,y:960,z:1+.035*pu}; decks(c,t,NOON,{mastX:1010});
  const mA=seg(pu,.5,2.55,E.lin), gone=seg(pu,2.5,2.9,E.io), look=seg(pu,2.9,3.2,E.io);
  const cube={svg:iceCube(0,6,70,64,{melt:mA,pud:0,d:.2,a:.95})+(mA>.02&&mA<.97?`<path d="M${N(10)} ${N(10+((pu*3)%1)*60)}q-5 9 0 13q5 -4 0 -13z" fill="#bfe9f7" stroke="${INK}" stroke-width="2" opacity="${op(1.3-((pu*3)%1))}"/>`:''),rot:0};
  const A=full({lean:-1+Math.sin(pu*6)*2,hF:[84+Math.sin(pu*9)*3,-158+Math.sin(pu*7)*5],hB:[-8,-116],handF:'open',holdF:cube,expr:'worry',look:[2,3]}), B=full({...A,expr:'shock',hF:[90,-180],look:[6,-2],tilt:-5});
  let g=`<ellipse cx="260" cy="1134" rx="110" ry="15" fill="#000" opacity=".28"/>`;
  g+=`<ellipse cx="${N(340+60)}" cy="1128" rx="${N(10+120*mA)}" ry="${N(4+14*mA)}" fill="#8fd0ea" opacity="${N(.8*sat(mA*6)*100)/100}" stroke="${INK}" stroke-width="3"/>`;
  g+=toon('sailor',250,GYD,1.55,1,tween(pu,2.6,A,B,.3),t,3);
  g+=`<ellipse cx="760" cy="1136" rx="230" ry="22" fill="#000" opacity=".28"/>`;
  g+=toon('sailor2',770,GYD+6,1.45,-1,tween(pu,2.9,{...SK.smug,lean:-3+Math.sin(pu*3.2)*2.5,tilt:-4+Math.sin(pu*2.4)*3},full({...SK.smug,expr:'smug',tilt:-6}),.4),t,6)+iceCube(740,1128,360,300,{melt:seg(pu,0,3.3,E.lin)*.08,hot:.5,a:.62})+coldMist(740,830,340,t,5,.3);
  return fin(cam(c,g),t); }

/* ---------- 4 STEP TWO: bury it in bark and hay ---------- */
function holdStack(){ return iceStack(660,1000,3,3,200,200,{gap:0}); }
const shovel={svg:`<path d="M0 0L16 -150" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M0 0L16 -150" stroke="#a8743a" stroke-width="7" stroke-linecap="round"/><path d="M-22 0L22 0L16 46L-16 46Z" ${st('#8a8a92',4)}/>`,rot:0};
function barkSpeckle(x0,y0,w,h,seed){ let g=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#6a4a2e"/>`; for(let i=0;i<Math.max(8,w*h/900);i++) g+=`<circle cx="${N(x0+rnd(i+seed)*w)}" cy="${N(y0+rnd(i*3+seed)*h)}" r="${N(3+rnd(i+9)*5)}" fill="${i%3?'#8a6a44':'#4a3220'}"/>`; return g; }
function sh4(t){ const u=t-S(4), P=part(4,u); return [sh4a,sh4b,sh4c,sh4d][P.i](P.pu,u,t); }
function sh4a(pu,u,t){ paint(ctx=>paintHold(ctx,t,{warm:.55,lx:200,ly:330})); const FY=1000, dig=seg(pu,.5,.95,E.i), wy=lerp(430,FY+10,dig), dg=Math.sin(pu*16)*.5*seg(pu,.95,1.2);
  let g=holdFloor(FY+40)+lanternSvg(200,260,t,1.0);
  g+=`<rect x="190" y="360" width="120" height="${FY-300}" fill="#120a06"/><rect x="310" y="360" width="46" height="${FY-300}" ${st('#8a5a32',5)}/>`+holdStack();
  g+=toon('sailor2',250,wy,1.05,1,full({lean:3,hF:[66+dg*12,-150-dg*18],hB:[40,-132],handF:'fist',handB:'fist',holdF:shovel,expr:'determined',look:[3,2]}),t,5);
  g+=`<rect x="190" y="360" width="120" height="${N(Math.max(0,430-360))}" fill="#120a06" opacity="0"/>`;
  return fin(g,t,{grade:['#ffb060',.1]}); }
function sh4b(pu,u,t){ paint(ctx=>{ PNT.sky(ctx,{top:'#a8a4a0',mid:'#cfc6b8',bot:'#e8dcc6',midAt:.6,y1:640,halo:.2}); ctx.fillStyle='#8a7a62'; ctx.fillRect(-20,640,1120,1400); PNT.deck(ctx,640,1940,{x0:-200,x1:1280,tone:'#8a7658',rows:12,grow:3,light:.25,shade:.4}); PNT.haze(ctx,560,700,'#d8cfc0',.5); PNT.vignette(ctx,.3); });
  let g=''; [[200,760],[440,800],[720,770]].forEach(([x,y],i)=>{ g+=`<ellipse cx="${x}" cy="${y}" rx="120" ry="34" ${st('#5a3a28',6)}/><path d="M${x-110} ${y}V${y+90}Q${x} ${y+130} ${x+110} ${y+90}V${y}" fill="#6a4a32" stroke="${INK}" stroke-width="6"/><ellipse cx="${x}" cy="${y}" rx="100" ry="24" fill="#3a2418"/>`; });
  for(let i=0;i<4;i++){ const x=110+i*260; g+=`<path d="M${x-80} 420H${x+80}" stroke="${INK}" stroke-width="10"/><path d="M${x-40} 424Q${x-70} 520 ${x-40} 600L${x+30} 580Q${x+60} 500 ${x+40} 424Z" ${st(['#b88a58','#a87848','#c89a68','#a8845a'][i],5)}/>`; }
  const give=seg(pu,.2,.7,E.io), sack=`<g transform="rotate(-8)"><path d="M-30 0Q-40 -50 -10 -70H20Q46 -50 34 0Z" ${st('#c9aa6a',5)}/><path d="M-8 -70Q4 -90 18 -70" fill="none" stroke="${INK}" stroke-width="5"/></g>`;
  g+=toon('tanner',400,1010,1.3,1,tween(pu,.2,full({lean:-2,hF:[26,-140],hB:[-8,-120],handF:'open',expr:'neutral',look:[4,0],shrug:6}),full({lean:3,hF:[80,-170],hB:[-8,-120],handF:'hold',holdF:{svg:sack,rot:0},expr:'smug',look:[4,0]}),.4),t,11);
  g+=toon('sailor2',760,1010,1.3,-1,tween(pu,.5,full({hF:[40,-150],hB:[-8,-118],expr:'confused',look:[-4,0]}),full({lean:-4,tilt:-6,hF:[70,-165],hB:[56,-150],handF:'open',handB:'open',expr:'joy',look:[-4,-2]}),.35),t,5);
  return fin(g,t,{grade:['#c8b898',.12]}); }
function sh4c(pu,u,t){ paint(ctx=>{ paintHold(ctx,t,{warm:.5,lx:900,ly:380,lant:.6}); PNT.shafts(ctx,{x:300,y:0,angle:12,spread:9,n:4,len:1500,width:100,alpha:.2,motes:70,t,seed:3}); }); const FY=1000, k=seg(pu,.1,1.0,E.lin), dg=Math.sin(pu*15)*.5+.5;
  let g;
  g=holdFloor(FY+40)+holdStack()+barkSpeckle(220,400,120*k+10,600,3)+barkSpeckle(340,FY-640-30,620,40,9);
  g+=toon('sailor2',150,FY+30,1.15,1,full({lean:3+dg*3,hF:[70-dg*10,-150+dg*10],hB:[40,-130],handF:'fist',handB:'fist',holdF:shovel,expr:'determined'}),t,5);
  g+=tag('1 FT BARK',540,350,66,'#fff3c4',INK,{k:seg(pu,0,.2,E.back),rot:-3});
  return fin(g,t,{grade:['#ffb060',.1]}); }
function hayMound(x,y,w,h,k,seed=1){ let g=`<path d="M${N(x-w/2)} ${y}Q${N(x-w/3)} ${N(y-h*1.15)} ${N(x)} ${N(y-h)}Q${N(x+w/3)} ${N(y-h*1.1)} ${N(x+w/2)} ${y}Z" ${st('#e0c060',5)}/>`;
  for(let i=0;i<26;i++){ const px=x-w/2+rnd(i+seed)*w, ph=Math.sin(Math.PI*(px-(x-w/2))/w)*h*(.5+.5*rnd(i*3)); g+=`<path d="M${N(px)} ${N(y-ph*.3)}l${N((rnd(i+8)-.5)*30)} ${N(-ph*.6)}" stroke="#b8963a" stroke-width="3" stroke-linecap="round"/>`; } return g; }
function sh4d(pu,u,t){ const FY=1000, z=lerp(1,1.9,E.io(seg(pu,1.9,2.5))), c={x:lerp(540,720,E.io(seg(pu,1.9,2.5))),y:lerp(960,380,E.io(seg(pu,1.9,2.5)))};
  paint(ctx=>paintHold(ctx,t,{warm:.6,lx:900,ly:380,lant:.7}));
  const topY=FY-600, hay=seg(pu,.05,.9,E.o), stomp=seg(pu,1.0,1.9,E.lin), sq=1-.5*E.io(seg(pu,1.0,1.4))*(1-0)-0;
  let g=holdFloor(FY+40)+holdStack()+barkSpeckle(220,400,120,600,3)+barkSpeckle(340,FY-640-30,620,40,9);
  const hh=lerp(0,150,hay)*(1-.62*seg(pu,1.0,1.9,E.io)); g+=hayMound(660,topY-8,620,hh,1,2);
  for(let i=0;i<5;i++){ const k=((pu*2.2+i*.2)%1); if(pu<.9&&hay<1) g+=`<ellipse cx="${N(lerp(980,700,k))}" cy="${N(lerp(560,topY-80,k)-Math.sin(Math.PI*k)*140)}" rx="26" ry="12" fill="#e0c060" stroke="${INK}" stroke-width="3"/>`; }
  const fork={svg:`<path d="M0 0L10 -170" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 0L10 -170" stroke="#a8743a" stroke-width="6" stroke-linecap="round"/><path d="M-20 4L-12 -20M0 4V-22M20 4L12 -20" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,rot:0};
  { const mv=E.io(seg(pu,.9,1.25)), hop=Math.max(0,Math.sin((pu-1.0)*13))*40*seg(pu,1.0,1.9,E.lin)*(1-seg(pu,1.8,1.95,E.lin)), sw=Math.sin(pu*12);
    const FA=full({lean:3,hF:[66+sw*14,-140-sw*20],hB:[40,-120],handF:'fist',handB:'fist',holdF:fork,expr:'determined',look:[-4,0]}), FB=full({lean:1,hF:[50,-176],hB:[-10,-170],handF:'fist',handB:'fist',holdF:fork,expr:'joy',fF:[26+hop*.2,0],fB:[-14,-hop*.3]});
    g+=toon('sailor2',lerp(930,700,mv),lerp(FY+30,topY-hh*.5,mv)-hop-Math.sin(Math.PI*mv)*90,lerp(1,.95,mv),-1,tween(pu,1.0,FA,FB,.3),t,5); }
  const planks=seg(pu,1.7,2.2,E.o); if(planks>0) g+=`<rect x="${N(350+0)}" y="${N(topY-14-60*0)}" width="${N(620*planks)}" height="34" ${st('#8a5a32',5)}/>`+[...Array(5)].map((_,i)=>`<path d="M${350+i*124} ${topY-14}v34" stroke="${INK}" stroke-width="3"/>`).join('');
  const ham=seg(pu,2.2,3.0,E.lin), hit=Math.abs(Math.sin(ham*Math.PI*3)); if(pu>2.2) g+=`<circle cx="900" cy="${N(topY+3)}" r="8" fill="#555" stroke="${INK}" stroke-width="3"/><g transform="translate(900 ${N(topY-6)}) rotate(${N(-50+hit*50)})"><rect x="-8" y="-150" width="16" height="150" rx="5" ${st('#a8743a',4)}/><rect x="-30" y="-176" width="60" height="34" rx="6" ${st('#7a7a82',4)}/></g>`+impact(900,topY,seg(ham*3%1,0,.6,E.lin)*(ham>0&&ham<1?1:0),.4);
  return fin(cam(c,g,960).replace(`scale(${N(c.z*1000)/1000})`,`scale(${N(z*1000)/1000})`),t,{grade:['#ffb060',.1]}); }

/* ---------- 5 TEN DAYS IN THE TROPICS ---------- */
function sh5(t){ const u=t-S(5), P=part(5,u); return [sh5a,sh5b,sh5c][P.i](P.pu,u,t); }
function sh5a(pu,u,t){ const c={x:540,y:960,z:1};
  paint(ctx=>{ ctx.save(); ctx.beginPath(); ctx.rect(0,270,1080,392); ctx.clip(); PNT.sky(ctx,{top:'#4a8ccc',mid:'#cfe6f0',bot:'#fffbe8',midAt:.5,y1:560,sun:[860,330,70,'#ffffff'],halo:.9}); PNT.sea(ctx,c,t,{horizon:520,bottom:700,deep:'#1a6a9a',shallow:'#8cc8dc',haze:'#fff4d6',glint:[860,.8],swell:.1,speed:.4}); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0,672,1080,1250); ctx.clip(); paintHold(ctx,t,{warm:.0,lx:140,ly:760}); ctx.restore(); });
  const fan=Math.sin(u*12)*12, sh=Math.sin(t*38)*3;
  let g=`<rect x="0" y="662" width="1080" height="12" fill="${INK}"/>`;
  g+=`<rect x="0" y="1030" width="1080" height="10" fill="${INK}" opacity=".0"/>`;
  const hat={svg:`<ellipse rx="40" ry="13" ${st('#f1ece0',4)}/><path d="M-24 0Q0 -30 24 0Z" ${st('#f1ece0',4)}/>`,rot:fan*.8};
  g+=toon('sailor',420,650,.82,1,full({lean:-5,hy:10,tilt:-6,hF:[84+fan*.5,-170+fan],hB:[-10,-110],handF:'hold',holdF:hat,expr:'tired',look:[3,-2]}),t,3)+sweat(468,432,.9,u,.9)+sweat(380,440,.7,u+.4,.8);
  g+=toon('scarfy',660,1032,.82,1,full({lean:4,hy:8,hF:[30,-140],hB:[14,-134],handF:'fist',handB:'fist',expr:'wince',look:[2,2]}),t,7);
  for(let i=0;i<3;i++){ const k=((u*1.1+i*.33)%1); g+=`<ellipse cx="${N(716+k*36)}" cy="${N(744-k*30)}" rx="${N(10+14*k)}" ry="${N(7+8*k)}" fill="#fff" opacity="${N(.5*(1-k)*100)/100}"/>`; }
  g+=`<path d="M635 800q10 -12 20 0q-10 -4 -20 0z" fill="none"/>`;
  return fin(g,t,{vig:.5}); }
function sh5b(pu,u,t){ const days=pu/DAY_S+.5, k=days%1, done=Math.max(0,Math.floor(days+.25)), Sk=skyAt(k);
  const c={x:540+8*pu,y:960,z:1+.035*pu}; paint(ctx=>paintSeaDeck(ctx,c,t,Sk));
  const slump=sat(done/7), sunL=clamp((Sk.sun[0]-610)/90,-6,6)*Sk.vis;
  const pose=full({lean:-4-6*slump,hy:8*slump,tilt:-6-4*slump,hF:[34,-150+10*slump],hB:[-30,-118],handF:'open',expr:slump>.55?'tired':'neutral',look:[sunL,lerp(2,-4,Sk.vis)],shrug:2*slump});
  const lightM=`${N(.55+.45*Sk.light)} 0 0 0 ${N(-.02*Sk.night)} 0 ${N(.55+.45*Sk.light)} 0 0 ${N(.01*Sk.night)} 0 0 ${N(.62+.38*Sk.light)} 0 ${N(.05*Sk.night)} 0 0 0 1 0`;
  let g=`<filter id="icLight"><feColorMatrix type="matrix" values="${lightM}"/></filter><ellipse cx="610" cy="1136" rx="120" ry="16" fill="#000" opacity="${op(.25*Sk.light+.08)}"/><g filter="url(#icLight)">${toon('sailor',610,1130,1.75,1,pose,t,3)}`;
  if(Sk.light>.8){ const dp=(pu*1.7)%1; g+=`<path d="M570 ${N(500+dp*60)}q-6 12 0 16q6 -4 0 -16z" fill="#bfe3f2" stroke="${INK}" stroke-width="2" opacity="${op(1-dp)}"/>`; }
  g+=`</g>`+tallies(done,768,430,{k:sat((((days-.75)%1)+1)%1/.3)});
  return fin(cam(c,g),t,{vig:.6}); }
function sh5c(pu,u,t){ paint(ctx=>paintHold(ctx,t,{warm:lerp(.35,.8,seg(pu,.9,1.6)),lx:900,ly:380,lant:.8})); const FY=1040, FX=620;
  const tj=seg(pu,.15,.45,E.back), off=seg(pu,.9,1.25,E.io), back=seg(pu,1.75,2.1,E.io);
  const pose=tween(pu,1.0,full({lean:3,hF:[24,-138],hB:[12,-132],handF:'fist',handB:'fist',expr:'wince',look:[2,2]}),full({lean:-4,tilt:-5,hF:[56,-196],hB:[8,-120],handF:'open',expr:'joy',look:[3,-3]}),.4);
  const pose2=tween(pu,1.75,pose,full({lean:2,hF:[22,-140],hB:[12,-132],handF:'fist',handB:'fist',expr:'wince',look:[2,2]}),.3);
  let g=holdFloor(FY-20)+iceStack(240,FY-20,2,2,200,200,{gap:0})+`<rect x="640" y="300" width="360" height="230" rx="10" ${st('#8a5a32',6)}/>`+tallies(Math.round(lerp(3,10,tj)),700,330,{k:1,len:56});
  g+=tag(pu>.3?'DAY 10':'DAY 3',820,590,44,'#fff3c4',INK,{k:1,rot:-2});
  g+=toon('scarfy',FX,FY,1.2,1,{...pose2,hx:(pose2.hx||0)+Math.sin(t*41)*(off>0&&back<=0?.6:2.4),lean:pose2.lean+Math.sin(t*37)*(off>0&&back<=0?0:1)},t,7);
  const nk=[FX+8,FY-262*1.2], hd=[FX+64*1.2,FY-196*1.2], pos=off>0&&back<=0?[lerp(nk[0],hd[0],off),lerp(nk[1],hd[1]-10,off)]:[lerp(hd[0],nk[0],back),lerp(hd[1]-10,nk[1],back)], band=(off<=0||back>0)?1:0;
  g+=`<g transform="translate(${N(pos[0])} ${N(pos[1]+(off>0&&back<=0?Math.sin(pu*9)*6:0))}) rotate(${N(lerp(0,-20,off)*(1-back))})"><path d="M-44 0Q0 22 44 0V26Q0 48 -44 26Z" ${st('#c8372d',5)}/><path d="M26 22L44 80L10 76L4 36Z" ${st('#a82a22',5)}/></g>`;
  return fin(g,t,{grade:['#ffb060',.08]}); }

/* ---------- 6 SEPTEMBER: the ship reaches Calcutta ---------- */
function sh6(t){ const u=t-S(6), P=part(6,u); return [sh6a,sh6b][P.i](P.pu,u,t); }
function sh6a(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintRiver(ctx,c,t));
  const sx=lerp(-250,520,E.o(seg(pu,0,2.4,E.lin))), bob=Math.sin(t*1.7)*4;
  let g=''; [[780,800,.5,1],[900,840,.4,-1]].forEach(([x,y,s,d],i)=>{ g+=`<g transform="translate(${N(x+Math.sin(t*.5+i)*8)} ${y}) scale(${s*d} ${s})"><path d="M-110 -10Q0 40 110 -10L90 20Q0 50 -90 20Z" ${st('#5a3a24',5)}/><path d="M-30 -14Q0 -60 40 -14" ${st('#efe9da',5)}/></g>`; });
  g+=shipSvg(sx,880,.66,{bob});
  g+=`<defs><linearGradient id="gr6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a7a46"/><stop offset=".5" stop-color="#6a6a3a"/><stop offset="1" stop-color="#4a5a30"/></linearGradient></defs><path d="M-20 980Q300 930 560 970T1100 960V1960H-20Z" fill="url(#gr6)" stroke="${INK}" stroke-width="6"/>`+[...Array(26)].map((_,i)=>`<path d="M${N(rnd(i)*1080)} ${N(1060+rnd(i+4)*800)}l6 -22M${N(rnd(i)*1080+10)} ${N(1066+rnd(i+4)*800)}l-5 -20" stroke="#3a4a26" stroke-width="5" stroke-linecap="round"/>`).join('');
  const folk=[['boatman',90],['porter',200],['buyer',320],['v2',470],['buyer2',640],['v1',780],['boatman',910],['porter',1010]];
  folk.forEach(([w,x],i)=>{ const wv=Math.sin(t*5+i*1.7)*.5+.5, pose=full({lean:2,hF:[34,-196-wv*40*(i%2)],hB:[-8,-116],handF:'open',expr:'happy',look:[4,0]}); g+=toon(w,x,1010+(i%3)*10,.5,i<4?1:-1,pose,t,20+i); });
  g+=tag('CALCUTTA',540,360,56,'#fff3c4',INK,{k:seg(pu,1.6,1.85,E.back),rot:-2});
  return fin(g,t,{grade:['#ffc87a',.1]}); }
function sh6b(pu,u,t){ paint(ctx=>{ paintHold(ctx,t,{warm:.85,lx:900,ly:1000,lant:.0}); ctx.save(); ctx.fillStyle='#fff6d8'; ctx.fillRect(250,240,580,260); ctx.restore(); PNT.shafts(ctx,{x:540,y:300,angle:0,spread:16,n:6,len:1400,width:140,alpha:.28,motes:80,t,seed:5}); });
  const FY=1000; let g=holdFloor(FY);
  g+=iceCube(330,FY,260,210,{melt:.2,d:0,sheen:1,a:.95})+iceCube(540,FY,250,200,{melt:.28,d:0})+iceCube(740,FY,250,190,{melt:.34,d:0,a:.92});
  g+=`<path d="M140 520L250 240H830L940 520Z" fill="#2a1a10" opacity="0"/>`;
  g+=`<clipPath id="hat6"><rect x="250" y="240" width="580" height="270"/></clipPath><g clip-path="url(#hat6)">`;
  [['porter',360],['buyer',540],['boatman',730]].forEach(([w,x],i)=>{ const rise=seg(pu,.1+i*.15,.5+i*.15,E.back); g+=toon(w,x,lerp(760,560,rise),.8,1,full({lean:3+Math.sin(t*2.3+i)*2,tilt:6+Math.sin(t*3.1+i*2)*5,hF:[50,-190],hB:[40,-186],handF:'open',handB:'open',expr:'awe',look:[Math.sin(t*2+i)*3,6]}),t,30+i); });
  g+=`</g><rect x="230" y="500" width="620" height="30" ${st('#6a4a2e',6)}/><path d="M230 240H830" stroke="${INK}" stroke-width="10"/>`;
  g+=`<g opacity=".85">${[0,1,2,3,4].map(i=>`<path d="M${240+rnd(i+3)*500} ${N(980-rnd(i)*180)}l8 -8l8 8l-8 8z" fill="#fff" opacity="${N((.4+.6*Math.abs(Math.sin(t*3+i)))*100)/100}"/>`).join('')}</g>`;
  return fin(g,t,{grade:['#ffd98a',.1]}); }

/* ---------- 7 THEN THE REAL MELTING STARTED ---------- */
function sh7(t){ const u=t-S(7), P=part(7,u); return [sh7a,sh7b,sh7c,sh7d][P.i](P.pu,u,t); }
function docks(t){ paint(ctx=>paintDocks(ctx,t)); return ''; }
function sh7a(pu,u,t){ docks(t); const sw=Math.sin(pu*2.2)*60, bx=470+sw, by=640+Math.sin(pu*2.2+1)*6, dr=(pu*3.4)%1;
  let g=`<rect x="780" y="330" width="26" height="680" ${st('#6a4a2e',5)}/><path d="M793 350L${N(bx)} 350" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M793 350L${N(bx)} 350" stroke="#8a5a32" stroke-width="10" stroke-linecap="round"/><path d="M${N(bx)} 350V${N(by-200)}" stroke="${INK}" stroke-width="5"/>`;
  g+=iceCube(bx,by,250,220,{hot:1,melt:.14,a:.9});
  for(let i=0;i<5;i++){ const k=((pu*3+i*.21)%1); g+=`<path d="M${N(bx-90+i*45)} ${N(by+k*(1000-by))}q-6 11 0 15q6 -4 0 -15z" fill="#bfe9f7" stroke="${INK}" stroke-width="2.5" opacity="${op(1.4-k)}"/>`; }
  g+=`<ellipse cx="${N(bx)}" cy="1000" rx="${N(80+40*sat(pu))}" ry="16" fill="#8fd0ea" opacity=".7" stroke="${INK}" stroke-width="3"/>`;
  g+=toon('boatman',700,1010,1.25,-1,full({lean:6,hF:[70,-170+Math.sin(pu*9)*10],hB:[56,-160],handF:'fist',handB:'fist',expr:'determined',look:[-4,-3]}),t,40);
  g+=toon('mate',220,1010,1.25,1,full({lean:-2,hF:[60,-176],hB:[-8,-118],handF:'point',expr:'stern',look:[4,-2]}),t,41);
  return fin(g,t,{grade:['#fff0c0',.12]}); }
function chalk(txt,x,y,size,k,rot=-2){ if(k<=0) return ''; const w=tW(txt,size)+20; const id=++UID;
  return `<clipPath id="ch${id}"><rect x="${N(x-w/2)}" y="${N(y-size)}" width="${N(w*sat(k))}" height="${N(size*1.4)}"/></clipPath><g clip-path="url(#ch${id})" transform="rotate(${rot} ${x} ${y})"><text x="${x}" y="${y}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${size}" fill="#f4f1e6" stroke="#f4f1e6" stroke-width="1" letter-spacing="2" opacity=".95">${txt}</text></g>`; }
function slate(x,y,w,h,lines,k=1,rot=-2){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${rot})"><rect x="${-w/2+8}" y="${-h/2+10}" width="${w}" height="${h}" rx="12" fill="${INK}" opacity=".5"/><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="12" fill="#2c3a34" stroke="#8a5a32" stroke-width="14"/>${lines.map((l,i)=>chalk(l[0],0,-h/2+l[2],l[1],l[3]!=null?l[3]:k,0)).join('')}</g>`; }
function sh7b(pu,u,t){ docks(t);
  let g=slate(700,560,560,330,[['4 MONTHS',84,120,seg(pu,.08,.9,E.lin)],['−55 T',130,260,seg(pu,1.7,2.2,E.lin)]],1,-2+wob(pu,1.9,3,14,5));
  const sc=Math.sin(pu*18)*.5, pose=tween(pu,.1,full({lean:-2,hF:[40,-176],hB:[-8,-116],handF:'hold',expr:'neutral',look:[6,-2]}),full({lean:2,hF:[96+sc*6,-208+Math.abs(sc)*8],hB:[-8,-116],handF:'hold',expr:'determined',look:[8,-6]}),.4);
  g+=toon('mate',260,1010,1.35,1,{...pose,lean:pose.lean+Math.sin(pu*2.4)*2,tilt:pose.tilt+Math.sin(pu*3)*3},t,41)+impact(592,520,seg(pu,1.9,2.25,E.lin),.5);
  for(let i=0;i<6;i++){ const k=((pu*1.6+i*.17)%1); g+=`<circle cx="${N(620+rnd(i)*220+Math.sin(k*6+i)*10)}" cy="${N(660+k*120)}" r="${N(3+rnd(i+2)*3)}" fill="#f4f1e6" opacity="${N(.6*(1-k)*100)/100}"/>`; }
  return fin(g,t,{grade:['#fff0c0',.12]}); }
function sh7c(pu,u,t){ docks(t); const w=strut(pu,60,880,0,1.6,1.6,130,.25), mlt=seg(pu,0,1.6,E.lin)*.55;
  const blk={svg:iceCube(0,40,180,160,{melt:mlt,pud:0,d:.22,a:.95}),rot:0};
  let g=toon('buyer',w.x,1010,1.6,1,{...full(w.p),hF:[84,-150],hB:[70,-142],handF:'hold',holdF:blk,lean:4,expr:'smug',look:[4,0]},t,50);
  for(let i=0;i<3;i++){ const k=((pu*1.8+i*.33)%1); g+=`<path d="M${N(w.x-40-i*30)} ${N(1010+(k*5))}q-6 11 0 15q6 -4 0 -15z" fill="#bfe9f7" stroke="${INK}" stroke-width="2.5" opacity="${op(1-k)}"/>`; }
  return fin(g,t,{grade:['#fff0c0',.12]}); }
function sh7d(pu,u,t){ docks(t); const sl=seg(pu,.5,.85,E.back);
  let g=slate(760,560,520,290,[['DAYS ≈',70,110,seg(pu,.5,.8,E.lin)],['−30 T',120,240,seg(pu,.75,1.2,E.lin)]],1,2);
  const mt=lerp(.82,.99,seg(pu,0,1.4,E.lin)), cube={svg:iceCube(0,18,60,54,{melt:mt,pud:0,d:.2,a:.95}),rot:0}, sad=seg(pu,.7,1.1,E.io);
  g+=toon('buyer',330,1130,1.5,1,full({lean:-3,hF:[84,-146],hB:[-8,-116],handF:'hold',holdF:cube,expr:sad>.5?'sad':'determined',look:[4,3],tilt:-4*sad}),t,50);
  g+=`<ellipse cx="${N(330+84*1.5)}" cy="1130" rx="40" ry="8" fill="#8fd0ea" opacity=".7"/>`;
  return fin(g,t,{grade:['#fff0c0',.12]}); }

/* ---------- 8 THE ICE GETS A HOUSE ---------- */
function sh8(t){ const u=t-S(8), P=part(8,u); return [sh8a,sh8b,sh8c][P.i](P.pu,u,t); }
function sh8a(pu,u,t){ paint(ctx=>{ PNT.sky(ctx,{top:'#f2c890',mid:'#f8dcae',bot:'#fff0d0',midAt:.5,y1:700,halo:.3}); ctx.fillStyle='#d8b27a'; ctx.fillRect(-20,700,1120,1300); PNT.deck(ctx,700,1940,{x0:-200,x1:1280,tone:'#b8925c',rows:11,grow:3,light:.4,shade:.3}); PNT.vignette(ctx,.3); });
  let g=`<rect x="-20" y="320" width="1120" height="400" fill="url(#gOffWall)"/>`; for(let i=0;i<3;i++) g+=`<path d="M${120+i*340} 700V470Q${120+i*340+100} 380 ${120+i*340+200} 470V700Z" ${st('#4a3a2c',6)}/>`;
  g+=`<rect x="-20" y="692" width="1120" height="16" fill="#8a6a40"/>`;
  const L=[['buyer',250,1],['buyer2',820,-1],['lekh',540,1]], coins=[.3,.65,1.0,1.25,1.55];
  g+=toon('buyer',240,1010,1.25,1,full({lean:3,hF:[90,-172+Math.sin(pu*8)*6],hB:[-8,-118],handF:'open',expr:'determined',look:[6,-2]}),t,50);
  g+=toon('buyer2',840,1010,1.25,-1,full({lean:3,hF:[86,-168],hB:[-8,-118],handF:'open',expr:'happy',look:[6,-2]}),t,51);
  const hatSv=`<path d="M-70 0Q0 -90 70 0Z" ${st('#f1ead8',6)}/><ellipse rx="70" ry="16" ${st('#e0d6bc',6)}/>`;
  g+=toon('lekh',540,1010,1.25,1,full({lean:0,hF:[40,-150],hB:[22,-140],handF:'open',handB:'open',expr:'neutral',look:[0,0]}),t,52);
  g+=`<g transform="translate(540 ${N(906)}) scale(1 -1)">${hatSv}</g>`;
  coins.forEach((c0,i)=>{ const k=seg(pu,c0,c0+.34,E.lin); if(k<=0||k>=1) return; const sx=i%2?790:290; g+=`<g transform="translate(${N(lerp(sx,540,k))} ${N(lerp(840,900,k)-Math.sin(Math.PI*k)*150)})"><circle r="19" ${st('#f4c24a',4)}/><circle r="10" fill="none" stroke="#c28a20" stroke-width="3"/></g>`; });
  const n=coins.filter(c0=>pu>c0+.34).length; for(let i=0;i<n;i++) g+=`<circle cx="${N(505+i*18)}" cy="${N(896-(i%2)*8)}" r="14" ${st('#f4c24a',3)}/>`;
  return fin(g,t,{grade:['#ffc87a',.1]}); }
function sh8b(pu,u,t){ paint(ctx=>{ PNT.sky(ctx,{top:'#8cb4d8',mid:'#e8d8b8',bot:'#fbe9c8',midAt:.55,y1:720,sun:[880,260,50,'#fff0c8'],halo:.5}); ctx.fillStyle='#b8a47a'; ctx.fillRect(-20,720,1120,1300); PNT.deck(ctx,720,1940,{x0:-200,x1:1280,tone:'#b09a6a',rows:12,grow:3,light:.3,shade:.35}); PNT.haze(ctx,640,760,'#fbe9c8',.5); PNT.vignette(ctx,.3); });
  const wx=lerp(110,560,E.io(seg(pu,.1,1.35,E.lin)));
  let g=`<rect x="170" y="410" width="740" height="330" ${st('#d8cdb4',8)}/>`+[...Array(7)].map((_,i)=>`<path d="M170 ${440+i*46}H910" stroke="#bfb396" stroke-width="3"/>`).join('')+`<path d="M280 410Q540 190 800 410Z" ${st('#c8bc9e',8)}/><circle cx="540" cy="322" r="18" ${st('#8a7a5a',5)}/>`;
  g+=`<path d="M400 740V560Q400 500 460 500H620Q680 500 680 560V740Z" fill="#1c2c3e" stroke="${INK}" stroke-width="8"/><ellipse cx="540" cy="740" rx="380" ry="26" fill="#2a4a66" opacity=".35"/>`;
  g+=`<g transform="translate(${N(wx)} 1010)"><g transform="translate(60 -60)">${iceCube(30,-30,150,130,{d:.2,hot:.4,a:.95})}</g><circle cx="20" cy="-30" r="34" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="20" cy="-30" r="34" fill="none" stroke="#8a5a32" stroke-width="6"/><path d="M-10 -80L120 -100M-10 -50L120 -50" stroke="${INK}" stroke-width="10"/></g>`;
  g+=toon('porter',wx-120,1020,1.2,1,full({lean:9,hF:[82,-120],hB:[66,-116],handF:'fist',handB:'fist',expr:'determined',fF:[24+Math.sin(pu*12)*12,0],fB:[-14-Math.sin(pu*12)*12,0]}),t,60);
  return fin(g,t,{grade:['#9ab8e0',.1]}); }
function sh8c(pu,u,t){ const sw=seg(pu,.2,.6,E.io), kw=sw, puff=seg(pu,.75,1.6,E.o);
  paint(ctx=>{ drawBaked(ctx,baked('doorwall',x=>{ PNT.wood(x,[-20,-20,1120,1960],{tone:'#6a6658',light:.1,scale:.7}); x.fillStyle='rgba(0,0,0,.18)'; for(let i=0;i<6;i++) x.fillRect(0,i*330,1080,6); })); PNT.vignette(ctx,.5);
    ctx.save(); ctx.fillStyle='#10202e'; ctx.fillRect(250,330,580,760); ctx.restore();
    ctx.save(); ctx.translate(250,0); ctx.scale(lerp(.16,1,kw),1); PNT.wood(ctx,[0,330,580,760],{tone:'#7a4a28',light:.2,scale:.8}); ctx.fillStyle='rgba(20,10,4,.45)'; for(let i=1;i<6;i++) ctx.fillRect(i*96.6-3,330,6,760); ctx.restore(); });
  const dw=580*lerp(.16,1,kw); let g=`<rect x="250" y="330" width="${N(dw)}" height="760" fill="none" stroke="${INK}" stroke-width="10"/>`;
  [440,740,970].forEach(y=>g+=`<rect x="250" y="${y-24}" width="${N(dw)}" height="48" ${st('#3a3a42',6)}/>`);
  g+=`<circle cx="${N(250+dw*.84)}" cy="710" r="${N(22*kw+2)}" ${st('#c9a24a',5)}/>`; if(kw>.9) g+=`<path d="M${N(250+dw*.84)} 722v18" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  if(puff>0){ for(let i=0;i<7;i++){ const k=sat(puff*1.2-i*.1), px=250+dw*.84+Math.sin(i*2.1)*60*k, py=745+k*(110+i*14); g+=`<ellipse cx="${N(px)}" cy="${N(py)}" rx="${N(18+30*k)}" ry="${N(12+18*k)}" fill="#fff" opacity="${N(.55*(1-k*.7)*Math.min(1,k*6)*100)/100}"/>`; } }
  g+=impact(540,720,seg(pu,.55,.85,E.lin),1.1);
  return fin(jolt(shakeV(pu,.55,14,.35),g),t,{vig:.7}); }

const CUT_EP={1:[['carried',-.2],['four',-.1],['twice',-.08]], 2:[['step',-.1],['two',-.1]], 3:[['they',-.1],['less',-.07]], 4:[['leftover',-.06],['on',-.05],['hay',-.4]],
  5:[['hold',-.1],4.0], 6:[['with',-.05]], 7:[['four',-.07],['days',-.1],['almost',-.2]], 8:[['obvious',.2],['own',-.15]]};
const CUT_HOLD_EP=[8];
const HOLD_OK_EP=[];
const SEQ=[1,2,3,4,5,6,7,8].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
