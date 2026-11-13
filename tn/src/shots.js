/* ============================== shots: The Day America Got Noon Twice (tn/)
   LAYOUT (screen px 1080x1920): picture in y 290-1040, ground line at y GY, big captions sit below (letters y 1050-1175, baseline 1166).
   Every narrated shot is split by CUT_EP (end of file) into sub-shots: part(n,u) gives {i, pu}. A cut changes set, subject or framing.
   Poses never snap: every change goes through tween() or a continuous mix(). */
const COVER_T=1.0;
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const GY=1005;
const under=col=>`<rect x="-900" y="-900" width="2900" height="4600" fill="${col}"/>`;
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${N(-w/2)} ${N(-h/2)})">${inner}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="9"/></g>`; }
const watchSvg=(open=1)=>({svg:`<g><path d="M0 -4Q-10 -26 -4 -44" fill="none" stroke="${INK}" stroke-width="3"/><circle r="15" ${st('#e8d28a',3.5)}/><circle r="10" fill="#fbf6ea"/><path d="M0 0V-6M0 0L5 3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>`});
/* shared poses */
const PS={stand:full({}),
  look:full({hF:[46,-178],hB:[-12,-114],handF:'hold',expr:'confused',look:[4,-2],tilt:6,lean:2}),
  ear:full({hF:[16,-228],hB:[-12,-114],handF:'hold',expr:'confused',look:[2,0],tilt:-8,lean:-2}),
  shrug:full({hF:[88,-196],hB:[-70,-192],handF:'open',handB:'open',expr:'confused',shrug:10,tilt:5}),
  gawk:full({hF:[40,-120],hB:[-8,-116],expr:'shock',look:[3,-6],tilt:-8,lean:-3}),
  reset:full({hF:[40,-172],hB:[26,-178],handF:'hold',handB:'open',expr:'determined',look:[3,3],tilt:5,lean:3})};
const bellSwing=(u,k,A=26)=>u<k?0:A*Math.exp(-(u-k)*1.6)*Math.sin((u-k)*10);

/* ---------- 1 HOOK: a church rings noon, then rings noon again ---------- */
function church(u,t,o){ // wide street. o: zoom-ish layout options; o.trinity draws Trinity's spire (the second noon)
  const mins=o.mins||0, wk=o.workman;
  let g=`<rect x="-300" y="-300" width="1680" height="1400" fill="url(#gSky)"/>`+skyline(GY-6,o.trinity?7:3,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:160,h1:300,clocks:false});
  if(o.trinity){ g+=trinity(540,330,GY-6,{cy:780,r:92,swing:o.swing,dong:o.dong}); g+=street(GY,'#8b8678'); return g; }
  g+=steeple(540,300,GY-6,{cy:650,r:105,mins,swing:o.swing,dong:o.dong,glow:o.glow||0});
  g+=street(GY,'#8b8678');
  return g; }
function sh1_a(u,t){ // first frame: the premise, readable without sound
  let g=church(u,t,{mins:0,swing:bellSwing(u+.2,0,22)+Math.sin(u*9)*6*Math.exp(-u*.8),dong:seg(u,0,.5,E.lin)<1?seg(u,0,.5,E.lin):1});
  g+=ladder(318,GY,410,610,50);
  const crank=Math.sin(u*7)*.5+.5, WP=full({lean:-4,tilt:-4,hF:[84+crank*10,-250-crank*14],hB:[20,-190],handF:'fist',handB:'hold',expr:'determined',look:[6,-4],fF:[26,0],fB:[-12,0]});
  g+=toon('workman',398,700,.5,1,WP,t,5);
  const s0=.8, yy=GY;
  [['coatA',250,'look'],['coatB',840,'ear'],['coatC',710,'shrug']].forEach(([w,x,pk],i)=>{ const tw=tween(u,.6+i*.35,PS.stand,PS[pk],.4); g+=toon(w,x,yy,s0,i===1?-1:1,{...tw,holdF:pk==='look'||pk==='ear'?watchSvg():undefined},t,10+i); });
  // curved arrow: the minute hand is being cranked BACKWARDS
  g+=`<g opacity="${N((.55+.4*Math.sin(u*6))*100)/100}"><path d="M664 632Q654 566 604 548" fill="none" stroke="${CRIM}" stroke-width="12" stroke-linecap="round"/><path d="M612 524L572 546L610 572Z" fill="${CRIM}" stroke="${INK}" stroke-width="4"/></g>`;
  g+=tag('NOON?',540,330+0,64,'#fff3c4',INK,{k:seg(u,.15,.45,E.back),rot:-3});
  return g; }
function sh1_b(pu,u,t){ // tight on the bell: the first noon
  const k=cu(1,'noon')-p1b0(); let g=`<rect width="1080" height="1920" fill="#c9b38a"/><rect x="-100" y="260" width="1280" height="900" fill="#3a2e28"/>`;
  g+=`<path d="M170 1010V520Q170 300 540 300Q910 300 910 520V1010Z" ${st('#2c221c',8)}/>`+beam([[300,300],[780,300],[1000,1100],[80,1100]],.12);
  g+=bellProp(540,360,3.2,bellSwing(pu,Math.max(0,k),30),seg(pu,Math.max(0,k),Math.max(0,k)+.4,E.lin));
  g+=ttl('DONG',540,930,170,'#fff3c4',{k:seg(pu,Math.max(0,k),Math.max(0,k)+.12,E.back),rot:-5});
  g+=`<rect y="1000" width="1080" height="1000" fill="#5a4636"/><path d="M0 1000H1080" stroke="${INK}" stroke-width="7"/>`;
  return g; }
const p1b0=()=>cutPts(1)[0];
function sh1_c(pu,u,t){ // the clock face: four minutes pass (elapsed time; no source says this church's clock was set back)
  const k0=.12, back=seg(pu,k0,k0+1.0,E.io), mins=lerp(0,4,back), cx=540, cy=640, r=320;
  let g=`<rect width="1080" height="1920" fill="#b99a74"/><rect x="60" y="270" width="960" height="800" rx="40" ${st('#f4f0e6',8)}/>`;
  g+=clockFace(cx,cy,r,mins,{rim:'#2a2a32',sw:9});
  g+=`<path d="M${cx} ${cy}L${cx} ${cy-r*.86}A${r*.86} ${r*.86} 0 0 1 ${N(cx+Math.sin(rad(mins*6))*r*.86)} ${N(cy-Math.cos(rad(mins*6))*r*.86)}Z" fill="${MARI}" opacity=".35"/>`;
  g+=ttl('+4 MIN',800,410,84,'#ffe9a8',{k:seg(pu,k0+.6,k0+.8,E.back),rot:5});
  g+=`<rect y="1070" width="1080" height="1000" fill="#7a6246"/><path d="M0 1070H1080" stroke="${INK}" stroke-width="7"/>`;
  return g; }
function sh1_d(pu,u,t){ // wide again, low and close: the second noon
  const k=cu(1,'again')-cutPts(1)[2]; let g=church(u,t,{trinity:1,mins:0,swing:bellSwing(pu,Math.max(0,k),28),dong:seg(pu,k,k+.45,E.lin)});
  g=`<g transform="translate(540 1005) scale(1.12) translate(-540 -1005)">${g}</g>`;
  [['coatA',130,'look','ear'],['coatB',900,'shrug','shrug'],['coatC',280,'ear','look']].forEach(([w,x,a,b],i)=>{ const tw=tween(pu,.9+i*.2,PS[a],PS[b],.35); g+=toon(w,x,GY+4,1.1,i===1?-1:1,{...tw,holdF:(a==='look'||a==='ear')?watchSvg():undefined},t,20+i); });
  g+=tag('NOON. AGAIN.',540,330,60,'#fff3c4',INK,{k:seg(pu,k,k+.2,E.back),rot:2});
  return g; }
function sh1(t){ const u=t-S(1), P=part(1,u); let g=P.i===0?sh1_a(u,t):P.i===1?sh1_b(P.pu,u,t):P.i===2?sh1_c(P.pu,u,t):sh1_d(P.pu,u,t);
  return finish(g,t,{boil:2.2}); }

/* the master clock's pendulum: PEND(t) is its angle in degrees; the bob is stopped from 'stopped' to 'restarted' (shot 3) and resumes from the same phase */
const PT=1.154, PA_DEG=15;
function pendEff(t){ const a=S(3)+cu(3,'stopped'), b=S(3)+cu(3,'restarted'); return t-Math.min(Math.max(t-a,0),b-a); }
const PEND=t=>PA_DEG*Math.sin(2*Math.PI*pendEff(t)/PT);
const bobPos=(px,py,L,ang)=>[px+Math.sin(rad(ang))*L, py+Math.cos(rad(ang))*L];

/* ---------- 2 RAILROADS + THE MAN WITH A CLOCK ---------- */
function sh2_a(pu,u,t){ const k=seg(pu,0,1.47,E.i), s=lerp(.35,1.55,k);
  let g=`<rect width="1080" height="1920" fill="#d8b48a"/><rect y="560" width="1080" height="1400" fill="#7a6a5a"/><path d="M-100 560H1200" stroke="${INK}" stroke-width="7"/>`;
  g+=`<path d="M0 560H1080L1080 0H0Z" fill="url(#gDusk)"/>`;
  for(let i=-5;i<=5;i++) g+=`<path d="M${540+i*14} 600L${540+i*330} 1920" stroke="#4a3e34" stroke-width="${N(5+Math.abs(i))}" opacity=".6"/>`;
  for(let j=0;j<9;j++){ const y=640+Math.pow(j/8,2.2)*1300; g+=`<path d="M${N(540-(y-560)*.8)} ${N(y)}H${N(540+(y-560)*.8)}" stroke="#4a3e34" stroke-width="${N(5+j*2)}" opacity=".5"/>`; }
  for(let i=0;i<14;i++){ const a=rad(i*25.7), r0=480+rnd(i)*80; g+=`<path d="M${N(540+Math.cos(a)*r0*1.1)} ${N(700+Math.sin(a)*r0*.8)}L${N(540+Math.cos(a)*(r0+260*k))} ${N(700+Math.sin(a)*(r0+260*k)*.8)}" stroke="#fffaf0" stroke-width="9" stroke-linecap="round" opacity="${N(k*.8*100)/100}"/>`; }
  g+=[0,1,2,3].map(i=>steamPuff(380+i*95,330-(i%2)*30,50,((pu*1.4+i*.27)%1))).join('');
  g+=locomotive(540,700,s,u,{mins:0});
  return jolt(shakeV(pu,.2,10*k,1.2),g); }
function wuRoom(u,t,o={}){ let g=`<rect width="1080" height="1920" fill="#7d6648"/><rect y="0" width="1080" height="1005" fill="#8a7050"/>`;
  for(let i=0;i<9;i++) g+=`<path d="M${i*135} 0V1005" stroke="#6a5438" stroke-width="5"/>`;
  g+=`<rect x="70" y="360" width="230" height="400" rx="10" ${st('#3a2a22',9)}/><rect x="88" y="378" width="194" height="364" fill="#cfe9f4" stroke="${INK}" stroke-width="6"/><path d="M185 378V742M88 560H282" stroke="${INK}" stroke-width="7"/>`+beam([[88,378],[282,378],[640,1000],[200,1000]],.22,'#fff3c4');
  for(let i=0;i<4;i++) g+=`<path d="M0 ${300+i*18}Q540 ${340+i*18} 1080 ${290+i*18}" fill="none" stroke="#2a2a32" stroke-width="4"/>`;   // telegraph wires along the ceiling
  g+=FLOOR(1005,'#5a3e28'); for(let i=0;i<8;i++) g+=`<path d="M${-100+i*170} 1005L${-300+i*220} 1920" stroke="#47301e" stroke-width="5"/>`;
  return g; }
function sh2_b(pu,u,t){ let g=wuRoom(u,t);
  const ang=PEND(t); g+=regulator(760,410,190,595,ang,{mins:540});
  const kn=Math.sin(pu*15)*.5+.5, crack=seg(pu,.6,.9,E.lin)*(1-seg(pu,1.2,1.5,E.lin));
  const A=full({lean:3,tilt:-3,hF:[60,-168],hB:[52,-172],handF:'fist',handB:'fist',expr:'smug',look:[6,-1]}), B=full({...A,hF:[66+kn*4,-176-kn*6],hB:[56,-170],expr:'determined'});
  g+=toon('hamblet',330,GY,1.3,1,tween(pu,.5,A,B,.3),t,31);
  g+=impact(405,560,seg(pu,.62,.95,E.lin),.5);
  return g; }
function sh2(t){ const u=t-S(2), P=part(2,u); return finish(P.i===0?sh2_a(P.pu,u,t):sh2_b(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 3 THE PENDULUM STOPS: three minutes fifty-eight ---------- */
function sh3_a(pu,u,t){ const stopU=cu(3,'stopped'), px=540, py=300, L=650, ang=PEND(t), bp=bobPos(px,py,L,ang);
  let g=`<rect width="1080" height="1920" fill="#3b2a1f"/><rect y="270" width="1080" height="760" fill="#6a5238"/>`+beam([[300,270],[800,270],[1100,1040],[-60,1040]],.18,'#fff3c4');
  g+=dust(16,Math.min(u,stopU),[40,300,1000,700],6,'#fff3d0',1.2);
  g+=`<rect x="140" y="270" width="800" height="46" ${st('#7a4a2a',8)}/>`+pendulum(px,py+10,L,ang,100,{});
  const hs=seg(u,stopU-.75,stopU,E.io), hand=[lerp(1250,bp[0]+78,hs),lerp(900,bp[1]+10,hs)], jig=wob(u,stopU,10,24,7);
  g+=bigArm([1350,1300],[hand[0]-jig*2,hand[1]+jig],'#efc6a0','#f1ead8',u<stopU?'open':'fist','',1.1);
  g+=impact(bp[0],bp[1],seg(u,stopU,stopU+.35,E.o),1.1);
  g+=FLOOR(1030,'#4a3624');
  return g; }
function sh3_b(pu,u,t){ const secs=lerp(0,238,seg(pu,.1,1.7,E.io));
  let g=`<rect width="1080" height="1920" fill="#b9a27c"/>`+jewelerWindow(40,300,1000,430,u,{run:0,frost:1});
  g+=FLOOR(1005,'#8b8678'); for(let i=0;i<30;i++) g+=`<path d="M${N(-40+rnd(i*3+9)*1160)} ${N(1030+rnd(i*7)*800)}h40" stroke="#6f6a5e" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  const C=[full({hF:[84,-232],handF:'point',hB:[-12,-114],expr:'shock',lean:-6,look:[6,-8]}),full({hF:[70,-250],hB:[40,-240],handF:'open',handB:'open',expr:'shock',lean:-10,tilt:-8}),full({hF:[62,-150],hB:[-8,-120],handF:'fist',expr:'angry',lean:4,look:[4,-4]})];
  [['coatA',190,0,1],['coatC',540,1,-1],['coatB',880,2,-1]].forEach(([w,x,i,d])=>g+=frozen(w,x,GY+6,.95,d,C[i],40+i));
  const fx=540+Math.cos(pu*5.5)*70, fy=610+Math.sin(pu*8.3)*26; g+=`<path d="M${N(fx-Math.cos(pu*5.5-.5)*70+Math.cos(pu*5.5)*70)} ${N(fy)}" stroke="none"/><g transform="translate(${N(fx)} ${N(fy)})"><ellipse rx="9" ry="6" fill="${INK}"/><ellipse cx="-7" cy="-9" rx="9" ry="4" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(${N(Math.sin(pu*90)*20-20)})"/></g>`;
  g+=`<circle cx="905" cy="445" r="162" fill="#fff" opacity=".35"/>`+stopwatch(905,452,118,secs);
  return g; }
function sh3_c(pu,u,t){ const kw=.35; let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`+skyline(GY-6,9,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:300,h1:560,w0:130,w1:210});
  g+=street(GY);
  for(let i=0;i<6;i++){ const cx=330+i*138, cy=i%2?520:460, m0=(i*211+90)%720, f=seg(pu,kw+i*.17,kw+i*.17+.3,E.back), mins=lerp(m0,540+720*Math.sign(0),f);
    g+=`<path d="M${cx} ${cy+66}V${GY}" stroke="${INK}" stroke-width="14"/><path d="M${cx} ${cy+66}V${GY}" stroke="#3a3a44" stroke-width="7"/>`+clockFace(cx,cy,56,mins,{rim:'#2a2a32',sw:4,glow:f>0&&f<1?1:0})+impact(cx,cy,seg(pu,kw+i*.17,kw+i*.17+.35,E.lin),.55); }
  const A=full({hF:[46,-190],hB:[-12,-114],handF:'open',expr:'awe',look:[4,-8],tilt:-6}), B=full({...A,hF:[30,-150],expr:'happy',tilt:0,look:[5,-3]});
  [['coatB',400,0],['coatC',660,1],['coatD',930,0]].forEach(([w,x,i],q)=>g+=toon(w,x,GY+6,.95,q===2?-1:1,tween(pu,kw+.9+q*.15,A,B,.35),t,50+q));
  const pk=panelBox(24,300,230,330,`<rect width="230" height="330" fill="#3b2a1f"/><rect x="45" y="14" width="140" height="24" ${st('#7a4a2a',5)}/>`+pendulum(115,32,230,PEND(t),36,{}),{},{k:seg(pu,0,.2,E.back),rot:-2,border:TEAL,id:'p3c'});
  return g+pk; }
function sh3(t){ const u=t-S(3), P=part(3,u); return finish(P.i===0?sh3_a(P.pu,u,t):P.i===1?sh3_b(P.pu,u,t):sh3_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 4 ONE CLOCK COULD DO THAT: telegraph wires ---------- */
const beatClick=t=>{ const ph=((t/(60/104))%1+1)%1; return Math.max(0,1-Math.abs(ph-.1)/.12); };
function sh4_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`+skyline(GY-6,21,['#a9856a','#b08f72','#9b7a60'],{h0:160,h1:380,x0:380,w0:120,w1:190});
  g+=`<rect x="30" y="470" width="350" height="${GY-470}" ${st('#a85a46',8)}/><path d="M10 470H400L380 436H30Z" ${st('#8a4636',8)}/>`;
  for(let r=0;r<5;r++) for(let c=0;c<4;c++) g+=`<rect x="${64+c*80}" y="${560+r*82}" width="44" height="54" rx="4" fill="#ffe9a8" stroke="${INK}" stroke-width="5"/>`;
  g+=clockFace(205,500,0,0)+pole(120,260,436,160)+pole(300,300,436,150);
  const W=[[[60,282],[1100,720],70],[[180,330],[1100,800],50],[[240,282],[1100,650],80],[[360,330],[1100,770],60]];
  W.forEach(([p0,p1,sg],i)=>{ let d=''; for(let k=0;k<=20;k++){ const q=wirePt(p0,p1,sg,k/20); d+=(k?'L':'M')+N(q[0])+' '+N(q[1]); } g+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="6"/>`; });
  W.forEach(([p0,p1,sg],i)=>{ for(let j=0;j<2;j++){ const k=((pu*.5+i*.27+j*.5)%1), q=wirePt(p0,p1,sg,k); g+=`<circle cx="${N(q[0])}" cy="${N(q[1])}" r="20" fill="#fff3c4" opacity=".55"/><circle cx="${N(q[0])}" cy="${N(q[1])}" r="9" fill="#ffd23a" stroke="${INK}" stroke-width="4"/>`; } });
  g+=street(GY,'#8b8678'); return g; }
function sh4_b(pu,u,t){ const off=pu*720; let g=`<rect width="1080" height="1920" fill="url(#gSky)"/><g transform="translate(${N(-off)} 0)">`+skyline(GY-6,33,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:200,h1:520,x0:-100,x1:2400,w0:130,w1:230,clocks:true})+`</g>`;
  for(let i=0;i<4;i++){ const px=((i*430-pu*1700)%1720+1720)%1720-300; g+=pole(px,470,GY,170,22); }
  g+=`<path d="M-60 640Q540 700 1140 660" fill="none" stroke="${INK}" stroke-width="12"/>`+`<path d="M-60 640Q540 700 1140 660" fill="none" stroke="#fff3c4" stroke-width="3" opacity=".6"/>`;
  g+=street(GY,'#8b8678');
  for(let i=0;i<6;i++) g+=`<path d="M${N(560-i*90-20)} ${N(676+i*1.5)}h${N(-60-i*6)}" stroke="#ffd23a" stroke-width="${N(11-i)}" stroke-linecap="round" opacity="${N((.7-i*.11)*100)/100}"/>`;
  g+=`<circle cx="560" cy="676" r="50" fill="#fff3c4" opacity=".55"/><circle cx="560" cy="676" r="22" fill="#ffd23a" stroke="${INK}" stroke-width="6"/>`;
  return `<g transform="rotate(${N(Math.sin(pu*3.4)*1.6)} 540 700)">${g}</g>`; }
function sh4_c(pu,u,t){ const clk=beatClick(t); let g=`<rect width="1080" height="1920" fill="#b9a27c"/>`+jewelerWindow(40,300,1000,430,u,{run:2.6,frost:0});
  g+=FLOOR(1005,'#8b8678'); for(let i=0;i<30;i++) g+=`<path d="M${N(-40+rnd(i*3+9)*1160)} ${N(1030+rnd(i*7)*800)}h40" stroke="#6f6a5e" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  const A=full({lean:3,hF:[40,-150],hB:[-4,-120],expr:'awe',look:[-4,-8],tilt:-6}), B=full({lean:7,hF:[66,-232],hB:[40,-228],handF:'open',handB:'open',expr:'joy',look:[0,-8],tilt:-8});
  [['coatB',140,1],['coatA',400,1],['coatD',660,1]].forEach(([w,x,d],i)=>g+=toon(w,x,GY+6,.95,d,tween(pu,.25+i*.18,A,B,.4),t,60+i));
  g+=sounder(895,990,.95,clk)+ttl('tk',895,640,60,'#fff3c4',{k:clk,rot:-6});
  return g; }
function sh4(t){ const u=t-S(4), P=part(4,u); return finish(P.i===0?sh4_a(P.pu,u,t):P.i===1?sh4_b(P.pu,u,t):sh4_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 5 WHY BOTHER: the sun, 38 times, four zones, no law ---------- */
function sh5_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="url(#gDusk)"/>`;
  const sx=880, sy=420; for(let i=0;i<16;i++){ const a=rad(i*22.5+pu*10), r0=96, r1=150+10*Math.sin(pu*6+i); g+=`<path d="M${N(sx+Math.cos(a-.1)*r0)} ${N(sy+Math.sin(a-.1)*r0)}L${N(sx+Math.cos(a)*r1)} ${N(sy+Math.sin(a)*r1)}L${N(sx+Math.cos(a+.1)*r0)} ${N(sy+Math.sin(a+.1)*r0)}Z" ${st('#ffb627',5)}/>`; }
  g+=`<circle cx="${sx}" cy="${sy}" r="96" ${st('#ffd25a',8)}/>`;
  const cols=['#b8704a','#c9a86a','#7a8f6a','#a85a46','#d8c08a','#8a6a8a'];
  for(let i=0;i<6;i++){ const x=i<3?-20+i*150:630+(i-3)*150, h=300+rnd(i*5)*90; if(i===2||i===3) continue; g+=`<rect x="${x}" y="${GY-h}" width="140" height="${h+6}" ${st(cols[i],7)}/><path d="M${x-8} ${GY-h}h156" stroke="${INK}" stroke-width="7"/>`+clockFace(x+70,GY-h+60,36,(i*213+90)%720,{num:false,sw:3}); for(let r=0;r<2;r++) g+=`<rect x="${x+20+r*58}" y="${GY-h+130}" width="44" height="64" fill="#2b3a52" opacity=".55"/>`; }
  g+=FLOOR(GY,'#cdb37a'); for(let i=0;i<5;i++) g+=`<path d="M${60+i*210} ${GY+30+i*14}q40 -14 90 0" stroke="#b99a62" stroke-width="5" fill="none"/>`;
  for(let i=0;i<6;i++){ const hx=380+i*60; g+=`<path d="M${hx} ${GY-20}q-16 -40 0 -70t0 -70" fill="none" stroke="#fff3c4" stroke-width="5" opacity="${N((.3+.3*Math.sin(pu*5+i))*100)/100}" stroke-linecap="round"/>`; }
  const shade=Math.sin(rad(60+pu*8)); g+=sundial(580,GY-6,1.25,70-pu*6);
  const A=full({lean:6,tilt:6,hF:[46,-150],hB:[22,-146],handF:'hold',handB:'point',expr:'determined',look:[8,6]}), B=full({...A,hF:[50,-158],hB:[30,-152],expr:'smug'});
  g+=toon('farmer',360,GY+4,1.05,1,{...tween(pu,1.0,A,B,.4),holdF:watchSvg()},t,70);
  g+=tag('SUN TIME',540,330,50,'#ffe9a8',INK,{k:seg(pu,.2,.45,E.back),rot:-3}); return g; }
function sh5_b(pu,u,t){ const z=lerp(2.0,1,seg(pu,0,.8,E.io)), n=Math.floor(38*seg(pu,.3,1.36,E.lin)+.001);
  let g=`<rect width="1080" height="1920" fill="#9fc3d8"/>`; const mx=100,my=300,ms=8.2;
  let m=`<path d="${polyPath(WISC,mx,my,ms)}" ${st('#dfe8b4',9)}/>`, pts=[];
  for(let gx=12;gx<=92;gx+=11) for(let gy=14;gy<=90;gy+=11){ if(inPoly(gx,gy,WISC)&&inPoly(gx-3,gy,WISC)&&inPoly(gx+3,gy,WISC)&&inPoly(gx,gy-3,WISC)&&inPoly(gx,gy+3,WISC)) pts.push([gx,gy]); }
  pts.sort((a,b)=>((a[0]-50)**2+(a[1]-52)**2)-((b[0]-50)**2+(b[1]-52)**2)); pts.slice(0,38).forEach(([gx,gy],i)=>{ const k=seg(pu,-.2+i*.03,-.2+i*.03+.18,E.back); if(k>0) m+=`<g transform="translate(${N(mx+gx*ms)} ${N(my+gy*ms)}) scale(${N(k*100)/100})">`+clockFace(0,0,27,(i*137+60)%720,{num:false,sw:3})+`</g>`; });
  g+=`<g transform="translate(540 690) scale(${N(z*1000)/1000}) translate(-540 -690)">${m}</g>`;
  g+=tag('WISCONSIN',300,330,52,'#fffaf0',INK,{k:seg(pu,.5,.8,E.back),rot:-3})+ttl(String(n),840,470,170,'#ffd23a',{k:seg(pu,.25,.4,E.back),rot:4});
  return g; }
function sh5_c(pu,u,t){ let g=WALLBG('#a8855a')+FLOOR(GY,'#5a3e28');
  const fx=90, fy=320, fw=900, fh=440; g+=`<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="10" ${st('#f4ecd0',9)}/>`;
  const P=NAMER.map(p=>[fx+30+p[0]*(fw-60)/100,fy+16+(p[1]-4)*(fh-32)/90]);
  g+=`<clipPath id="nam"><path d="M${P.map(p=>p.map(N).join(' ')).join('L')}Z"/></clipPath><path d="M${P.map(p=>p.map(N).join(' ')).join('L')}Z" ${st('#d9e0b0',7)}/><g clip-path="url(#nam)">`;
  const zx0=fx+30+20*(fw-60)/100, zw=(fw-60)*.6/4, zy1=fy+16+(66-4)*(fh-32)/90;
  [TEAL,MARI,CRIM,'#2c5e8a'].forEach((c,i)=>{ const k=seg(pu,.3+i*.17,.3+i*.17+.22,E.o); g+=`<rect x="${N(zx0+i*zw)}" y="${fy}" width="${N(zw*k)}" height="${N(zy1-fy)}" fill="${c}" opacity=".78"/>`; });
  g+=`</g>`;
  const A=full({lean:4,hF:[70,-300],hB:[-6,-114],handF:'point',expr:'determined',look:[8,-6],tilt:-4}), B=full({...A,hF:[84,-312],lean:6});
  const gx=Math.min(1,pu/1.1);
  g+=toon('railman',200,GY+4,.9,1,{...A,hF:[60+gx*40,-300],lean:2+gx*4},t,80)+toon('coatB',500,GY+4,.9,1,full({hF:[40,-170],hB:[30,-176],handF:'fist',handB:'fist',expr:'stern',look:[6,-8]}),t,81)+toon('coatD',860,GY+4,.9,-1,full({hF:[56,-176],hB:[44,-170],handF:'fist',handB:'fist',expr:'smug',look:[4,-6]}),t,82);
  return g; }
function sh5_d(pu,u,t){ let g=WALLBG('#9a5a44')+FLOOR(GY,'#6a5a46'); for(let r=0;r<6;r++) for(let c=0;c<9;c++) g+=`<rect x="${-30+c*130+(r%2)*60}" y="${280+r*108}" width="124" height="100" fill="none" stroke="#7a4636" stroke-width="3" opacity=".5"/>`;
  for(let i=0;i<4;i++){ const cx=140+i*267, sec=((t*6)%360); g+=`<g>`+clockFace(cx,560,106,540+i*60,{rim:'#2a2a32',sw:6})+`<circle cx="${N(cx+Math.sin(rad(sec))*88)}" cy="${N(560-Math.cos(rad(sec))*88)}" r="8" fill="${CRIM}" stroke="${INK}" stroke-width="3"/></g>`;
    if(i<3) g+=tag('+1h',cx+133,560,38,'#ffe9a8',INK,{k:seg(pu,.25+i*.2,.45+i*.2,E.back),rot:i%2?3:-3}); }
  const A=full({hF:[84,-250],hB:[-10,-114],handF:'point',expr:'smug',look:[-8,-8],lean:-3}), B=full({...A,hF:[96,-262],lean:3,look:[8,-8]});
  g+=toon('railyoung',540,GY+4,.95,1,tween(pu,.5,A,B,.8,E.io),t,83); return g; }
function sh5_e(pu,u,t){ let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="640" y="340" width="300" height="400" ${st('#6a3e1e',8)}/>`+[0,1,2].map(r=>`<path d="M650 ${420+r*100}H930" stroke="${INK}" stroke-width="6"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${662+i*42}" y="${352+r*100}" width="30" height="${60+((i*7+r*5)%3)*8}" fill="${['#5a2a1e','#2a3a5a','#3a5a3a'][(i+r)%3]}" stroke="${INK}" stroke-width="3"/>`).join('')).join('');
  const low=seg(pu,.75,1.15,E.io), A=full({hF:[70,-200],hB:[70,-196],handF:'hold',handB:'hold',expr:'smug',look:[0,-2]}), B=full({hF:[88,-196],hB:[-74,-192],handF:'open',handB:'open',expr:'confused',shrug:0,tilt:0,look:[0,-3]});
  const pose=tween(pu,.7,A,B,.45); g+=toon('tophat',420,GY+4,1.1,1,pose,t,84)+topHat(420+10,GY-338*1.1,1.05,pose.tilt*.8);
  g+=lawBook(lerp(520,470,low),lerp(930,975,low),380,200,lerp(1,.9,low))+qmark(700,560,seg(pu,.9,1.2),1.1);
  return g; }
function sh5(t){ const u=t-S(5), P=part(5,u); return finish([sh5_a,sh5_b,sh5_c,sh5_d,sh5_e][P.i](P.pu,u,t),t,{boil:2.2}); }

/* ---------- 6 CLOCKS IN THE EAST WENT BACK ---------- */
function backPanel(pu,k0,from,wall,kind){ const mins=lerp(from,0,seg(pu,k0,k0+.8,E.back)); let g=WALLBG(wall);
  g+=kind?`<rect x="40" y="120" width="400" height="640" ${st('#f4f0e6',8)}/><path d="M150 120L240 20L330 120" ${st('#f4f0e6',8)}/>`:`<rect x="0" y="760" width="480" height="300" fill="#6a5a46"/>`;
  g+=clockFace(240,kind?330:300,170,mins,{rim:'#2a2a32',sw:8});
  g+=`<g opacity="${N(seg(pu,k0,k0+.15,E.lin)*(1-seg(pu,k0+.7,k0+.95,E.lin))*100)/100}"><path d="M110 560Q240 640 370 560" fill="none" stroke="${CRIM}" stroke-width="14" stroke-linecap="round"/><path d="M118 590L96 548L148 556Z" fill="${CRIM}" stroke="${INK}" stroke-width="4"/></g>`; return g; }
function sh6_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="#2a2018"/>`;
  g+=panelBox(40,290,480,720,backPanel(pu,.25,4,'#9a5a44',0),{},{rot:-1.5,border:TEAL,id:'pa6',k:seg(pu,0,.12,E.back)})+panelBox(560,290,480,720,backPanel(pu,.45,9,'#9fc3d8',1),{},{rot:1.5,border:MARI,id:'pb6',k:seg(pu,.08,.2,E.back)});
  return g; }
function sh6_b(pu,u,t){ const crankA=-pu*620, mins=lerp(4,0,seg(pu,.1,1.4,E.io)), cx=540, cy=650;
  let g=`<rect width="1080" height="1920" fill="url(#gSky)"/><g transform="translate(540 650) scale(1.55) translate(-540 -650)">`+steeple(540,300,GY+40,{cy:650,r:105,mins}) +`</g>`;
  g+=`<path d="M420 700L335 780" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M420 700L335 780" stroke="#8a8a96" stroke-width="9" stroke-linecap="round"/><circle cx="335" cy="780" r="56" ${st('#6a6a76',8)}/>`;
  const hp=[335+Math.cos(rad(crankA))*40, 780+Math.sin(rad(crankA))*40], fp=[235,1012], s=1.12;
  g+=`<path d="M335 780L${N(hp[0])} ${N(hp[1])}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="${N(hp[0])}" cy="${N(hp[1])}" r="12" ${st('#c9a03a',4)}/>`;
  g+=ladder(180,GY+20,300,820,52);
  g+=toon('workman',fp[0],fp[1],s,1,full({lean:4,tilt:4,hF:W2L(fp[0],fp[1],s,1,hp),hB:[-12,-130],handF:'fist',handB:'open',expr:'determined',look:[6,-2]}),t,5);
  g+=`<g opacity=".75"><path d="M690 430Q760 470 770 540" fill="none" stroke="${CRIM}" stroke-width="14" stroke-linecap="round" transform="scale(-1 1) translate(-1500 0)"/></g>`;
  g+=street(GY+30); return g; }
function sh6_c(pu,u,t){ const k=.1; let g=`<rect width="1080" height="1920" fill="#d8c8a8"/><rect y="0" width="1080" height="1005" fill="#e9e1cd"/>`;
  for(let i=0;i<7;i++) g+=`<path d="M${i*180} 0V1005" stroke="#cfc6ae" stroke-width="5"/>`;
  g+=bellProp(540,380,1.6,bellSwing(pu,k,30),seg(pu,k,k+.45,E.lin))+FLOOR(GY+10,'#8b8678');
  const A=PS.shrug, B=PS.reset;
  g+=toon('coatB',300,GY+14,1.5,1,{...tween(pu,.1,A,B,.5),holdF:watchSvg()},t,90)+toon('coatC',790,GY+14,1.5,-1,{...tween(pu,.25,A,B,.5),holdF:watchSvg()},t,91);
  return g; }
function sh6(t){ const u=t-S(6), P=part(6,u); return finish(P.i===0?sh6_a(P.pu,u,t):P.i===1?sh6_b(P.pu,u,t):sh6_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 7 THE INDIANA PAPER ---------- */
function sh7_a(pu,u,t){ const slam=1.55, sh=shakeV(pu,slam,16,.4); let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="520" y="330" width="460" height="300" fill="#b8c9d3" stroke="${INK}" stroke-width="8"/><path d="M750 330V630M520 480H980" stroke="${INK}" stroke-width="7"/>`;
  g+=press(780,GY-6,1.05,pu,{spin:1})+`<g>`+[0,1,2].map(i=>{ const k=((pu*1.5+i*.33)%1); return `<rect x="${N(560+k*30)}" y="${N(930-k*260)}" width="90" height="60" transform="rotate(${N(-10+k*40)} ${N(600+k*30)} ${N(960-k*260)})" ${st('#f6f0dc',4)} opacity="${N((1-k)*100)/100}"/>`; }).join('')+`</g>`;
  const A=full({lean:-2,hF:[56,-150],hB:[44,-154],handF:'hold',handB:'hold',expr:'neutral',look:[4,2]}), B=full({lean:10,tilt:-4,hF:[62,-120],hB:[40,-118],handF:'fist',handB:'fist',expr:'angry',look:[4,2]});
  g+=toon('editor',235,GY-10,1.42,1,tween(pu,slam-.35,A,B,.3,E.o),t,95);
  g+=`<g transform="translate(${N(sh[0])} ${N(sh[1])})"><rect x="40" y="880" width="420" height="${GY-880}" ${st('#7a4a2a',9)}/><rect x="20" y="860" width="460" height="34" rx="6" ${st('#9a6a3c',8)}/><rect x="190" y="832" width="150" height="30" fill="#f6f0dc" stroke="${INK}" stroke-width="5"/></g>`+impact(300,850,seg(pu,slam,slam+.35,E.lin),.9);
  return g; }
function sh7_b(pu,u,t){ const py=lerp(1250,665,seg(pu,0,.3,E.o)), rv=seg(pu,.25,.85,E.lin), hl=seg(pu,.85,1.3,E.io);
  let g=`<rect width="1080" height="1920" fill="#4a3624"/>`+press(180,GY+20,1.1,pu,{spin:1})+`<rect x="0" y="0" width="1080" height="1920" fill="#000" opacity=".3"/>`;
  g+=newsPage(540,py,880,740,hl,{rot:lerp(4,-1,seg(pu,0,.3)),reveal:rv}); return g; }
function sh7_c(pu,u,t){ const sx=lerp(540,1250,seg(pu,.75,1.25,E.i)); let g=`<rect width="1080" height="1920" fill="url(#gDusk)"/>`;
  [[200,420,1.0],[880,360,1.2],[560,330,.8]].forEach(([x,y,s],i)=>g+=`<g transform="translate(${x+Math.sin(pu*1.3+i)*14} ${y}) scale(${s})" opacity=".9"><circle r="50" ${st('#fffaf0',6)}/><circle cx="56" cy="14" r="40" ${st('#fffaf0',6)}/><circle cx="-54" cy="16" r="36" ${st('#fffaf0',6)}/></g>`);
  g+=FLOOR(GY,'#c9a86a');
  const bob=Math.abs(Math.sin(pu*9))*10*seg(pu,.75,1.25,E.lin), bx=sx, by=860-bob;
  g+=sunFace(sx,590-bob,120,pu,'sad',1);
  g+=`<g transform="translate(${N(bx)} ${N(by)})"><rect x="-150" y="0" width="300" height="190" ${st('#c9a46a',9)}/><path d="M-150 0L-110 -34H110L150 0" ${st('#b08f58',8)}/>`;
  const k1=seg(pu,.05,.25,E.back), k2=seg(pu,.25,.45,E.back), k3=seg(pu,.45,.65,E.back);
  g+=`<g transform="translate(-80 0) scale(${N(k1*100)/100})"><path d="M0 -10Q-20 -60 -50 -80M0 -10Q20 -70 50 -70M0 -10V-90" stroke="#3a8a3a" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="-36" y="-14" width="72" height="26" rx="6" ${st('#a85a46',6)}/></g>`;
  g+=`<g transform="translate(10 0) scale(${N(k2*100)/100})"><path d="M0 -10L40 -110L100 -130" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="108" cy="-128" rx="34" ry="18" ${st('#ffd25a',6)}/><rect x="-24" y="-14" width="56" height="20" rx="6" ${st('#4a4a54',6)}/></g>`;
  g+=`<g transform="translate(98 0) scale(${N(k3*100)/100})"><rect x="-24" y="-52" width="48" height="52" rx="8" ${st('#f4f0e6',6)}/><path d="M24 -38q26 0 26 22q0 20 -26 20" fill="none" stroke="${INK}" stroke-width="7"/></g></g>`;
  g+=`<path d="M${N(bx-190)} ${N(by+30)}L${N(bx-120)} ${N(by+30)}" stroke="${INK}" stroke-width="0"/>`;
  g+=sweat(sx+130,520-bob,seg(pu,.1,.3),pu,1.2); return g; }
function sh7(t){ const u=t-S(7), P=part(7,u); return finish(P.i===0?sh7_a(P.pu,u,t):P.i===1?sh7_b(P.pu,u,t):sh7_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 8 THE LAW: THIRTY-FIVE YEARS LATE ---------- */
function bigWatch(open){ return {svg:`<g transform="scale(2.6)"><circle cy="-18" r="4" fill="none" stroke="${INK}" stroke-width="2.6"/><circle r="15" ${st('#e8d28a',3.5)}/><circle r="10.5" fill="#fbf6ea"/><path d="M0 0V-7M0 0L5 3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>${open?'':`<circle r="15" ${st('#e8d28a',3.5)}/><path d="M-9 -6Q0 -12 9 -6" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>`}</g>`}; }
function sh8_a(pu,u,t){ const z=lerp(1,1.14,seg(pu,0,1.7,E.io)); let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`;
  [[180,430,1.1],[860,520,1.4]].forEach(([x,y,s],i)=>g+=`<g transform="translate(${N(x+pu*18)} ${y}) scale(${s})" opacity=".9"><circle r="46" ${st('#fffaf0',6)}/><circle cx="50" cy="12" r="36" ${st('#fffaf0',6)}/><circle cx="-48" cy="14" r="32" ${st('#fffaf0',6)}/></g>`);
  g+=`<g transform="translate(540 ${GY}) scale(${N(z*1000)/1000}) translate(-540 ${-GY})">`+capitol(540,GY,1.05)+`</g>`+FLOOR(GY,'#9aa87a');
  for(let i=0;i<3;i++){ const k=((pu*.5+i*.3)%1); g+=`<path d="M${N(120+k*820)} ${N(380+i*40+Math.sin(k*9)*14)}l14 -8l14 8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
  return g; }
function sh8_b(pu,u,t){ let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  const st1=.22, down=seg(pu,st1-.22,st1,E.i)*(1-seg(pu,st1+.05,st1+.4,E.o)), A=full({lean:3,hF:[60,-300],hB:[-8,-150],handF:'hold',expr:'smug',look:[4,3]}), B=full({lean:10,tilt:-4,hF:[84,-140],hB:[-8,-150],handF:'hold',expr:'smug',look:[4,6]});
  const pose=mix(A,B,down), stamp={svg:`<g transform="translate(0 -12)"><rect x="-24" y="-70" width="48" height="26" rx="8" ${st('#5a2a1e',5)}/><rect x="-6" y="-46" width="12" height="42" fill="#8a5a32" stroke="${INK}" stroke-width="4"/><rect x="-34" y="-8" width="68" height="14" rx="3" ${st('#3a3a44',5)}/></g>`,over:true};
  g+=`<rect x="20" y="800" width="520" height="${GY-800}" ${st('#7a4a2a',9)}/><rect x="0" y="780" width="560" height="34" rx="6" ${st('#9a6a3c',8)}/>`;
  g=g.replace(/$/,'');
  g+=toon('senator',210,GY-30,1.1,1,{...pose,holdF:stamp},t,96);
  g+=`<g transform="rotate(-4 380 780)"><rect x="250" y="752" width="320" height="52" ${st('#f6f0dc',5)}/></g>`+stampMark(400,760,['OFFICIAL'],CRIM,seg(pu,st1,st1+.15,E.lin),-8,32);
  const tap=Math.abs(Math.sin(pu*7))*14;
  g+=toon('railman',850,GY+4,1.1,-1,full({lean:-2,tilt:3,hF:[40,-176],hB:[24,-120],handF:'hold',handB:'fist',fF:[22,-tap],fB:[-16,0],expr:'tired',look:[-6,2]}),t,97).replace(/$/,'');
  g+=panelBox(730,290,270,270,`<rect width="270" height="270" fill="#d8c8a8"/>`+wallCalendar(135,145,.72,1883,seg(pu,.62,1.0,E.io)),{},{rot:2,k:seg(pu,.3,.5,E.back),border:CRIM,id:'cal8'});
  return g; }
function sh8_c(pu,u,t){ const kl=cu(8,'late')-cutPts(8)[1], snap=seg(pu,kl-.15,kl,E.i), look=seg(pu,kl+.1,kl+.5,E.io);
  let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="90" y="330" width="260" height="360" ${st('#6a3e1e',8)}/><rect x="110" y="350" width="220" height="320" fill="#b8c9d3" stroke="${INK}" stroke-width="6"/>`+`<rect x="730" y="340" width="260" height="330" ${st('#6a3e1e',8)}/>`;
  const A=full({lean:-2,hF:[76,-196],hB:[-8,-120],handF:'hold',expr:'tired',look:[4,6]}), B=full({lean:2,tilt:-3,hF:[66,-148],hB:[-8,-120],handF:'fist',expr:'stern',look:[-4,0]});
  const pose=mix(A,B,snap), wob2=wob(pu,kl,1,22,8);
  g+=toon('railman',540,GY+16,1.55,1,{...pose,tilt:pose.tilt+look*5,lean:pose.lean+wob2*2,holdF:bigWatch(snap<.5)},t,98);
  g+=impact(650,640,seg(pu,kl,kl+.3,E.lin),.8); const zz=lerp(1,1.12,seg(pu,0,kl+.8,E.io));
  return `<g transform="translate(540 700) scale(${N(zz*1000)/1000}) translate(-540 -700)">${g}</g>`; }
function sh8(t){ const u=t-S(8), P=part(8,u); return finish(P.i===0?sh8_a(P.pu,u,t):P.i===1?sh8_b(P.pu,u,t):sh8_c(P.pu,u,t),t,{boil:2.2}); }
const CUT_EP={1:[['church',-.3],'four',['again',-.25]], 2:[['man',-.3]], 3:[['three',-.25],['restarted',-.2]], 4:[['telegraph',-.1],['jewelers',-.15]],
  5:[['wisconsin',-.15],['so',-.1],['zones',-.35],['no',-.1]], 6:[['went',-.1],['noon',-.25]], 7:[['sun',-.15],['job',-.2]], 8:[['official',-.2],['thirty',-.1]]};
const CUT_HOLD_EP=[8];
const SEQ=[1,2,3,4,5,6,7,8].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
