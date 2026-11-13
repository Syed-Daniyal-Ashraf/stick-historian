/* ============================== shots: He Gave America the Yo-Yo. Duncan Owned the Word.
   LAYOUT (screen px 1080x1920): picture that matters in y 290-1110, subtitle baseline 1190 (src/meta.js), below that floor only.
   Wide shots use stage(): world ground y=1700 sits at screen y=FEET whatever the zoom. Hats: keep z <= .93.
   Poses never snap: every change goes through tween() or a continuous mix(). */
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const COVER_T=1.5;
const FEET=1115;
const stage=(x,z,g,F=FEET)=>cam({x,y:1700,z},g,F);
const under=col=>`<rect x="-900" y="-900" width="2900" height="4600" fill="${col}"/>`;
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="scale(${N(w/1080*1000)/1000}) translate(-540 -960)">${cam(c,inner)}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="10"/></g>`; }
const fedoraSvg=(x,y,rot,k,col='#d8cba6')=>`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${N(k*100)/100})"><ellipse cx="4" cy="-30" rx="66" ry="14" fill="${col}" stroke="${INK}" stroke-width="4.5"/><path d="M-38 -32Q-40 -78 4 -80Q46 -78 44 -32Z" fill="${col}" stroke="${INK}" stroke-width="4.5"/><path d="M-38 -42Q4 -50 44 -42" stroke="#1e1610" stroke-width="9" fill="none"/></g>`;

/* 1 HOOK: he has the toy (left) / they have the word (right) */
const PA={x:40,y:300,w:490,h:810}, PB={x:550,y:300,w:490,h:810}, PCAM={x:540,y:1240,z:1.5};
function pedroPanel(u,t){ const kh=cu(1,'hooked'), kc=cu(1,'company');
  let g=`<rect x="-300" y="-300" width="1680" height="2000" fill="#9fd4ec"/><circle cx="880" cy="820" r="100" fill="#fff3c4"/><circle cx="880" cy="820" r="170" fill="#fff3c4" opacity=".25"/>`+FLOOR(1700,'#d8c08a')+palm(900,1700,1.05,u);
  const P0=full({hF:[46,-150],hB:[-10,-112],handF:'hold',expr:'proud',lean:2,tilt:-3,look:[5,-1]}), P1=full({...P0,expr:'sad',lean:-2,tilt:5,look:[3,5],hF:[44,-136]});
  const p=tween(u,kc+.05,P0,P1,.35), X=370, s=2.15, hp=handPt(X,1700,s,1,p);
  [['kidA',545,0],['kidB',665,.3],['kidC',790,.55]].forEach(([w,kx,ph],i)=>{ const k=seg(u,kh+i*.09,kh+i*.09+.3,E.back); if(k<=0) return; const kp=full({hF:[40,-114],hB:[-10,-118],handF:'hold',expr:'joy',lean:3,tilt:-4}), kh2=handPt(kx,1700,1.4,-1,kp);
    g+=toon(w,kx,1700,1.4*k,-1,kp,t,20+i)+yoyo(kh2[0],kh2[1],u,'bob',{s:1.0*k,len:120,per:.8,ph}); });
  g+=toon('pedroBell',X,1700,s,1,p,t,2);
  g+=yoyo(hp[0],hp[1],u,u<kc?'sleep':'return',{s:1.5,len:215,k:(u-kc)/.45});
  return g; }
function duncanPanel(u,t){ const kc=cu(1,'company'), kw=cu(1,'word'), bump=Math.max(0,wob(u,kw,1,18,6));
  let g=WALLBG('#2f5a46')+FLOOR(1700,'#1f3a2e'); for(let i=0;i<10;i++) g+=`<rect x="${-200+i*150}" y="-300" width="70" height="2000" fill="#2a5040" opacity=".7"/>`;
  g+=bigWord(655,1330,96,{reg:1,bump});
  const D0=full({lean:8,tilt:-4,hy:0,expr:'smug',look:[5,-1],hF:[100,-176],hB:[84,-150],handF:'open',handB:'open'}), D1=full({...D0,lean:13,tilt:-9,expr:'happy',hF:[104,-186],hB:[90,-160],handF:'fist',handB:'fist'});
  g+=toon('duncan',270,1700,2.15,1,tween(u,kc-.05,D0,D1,.35),t,3);
  return g; }
function sh1(t){ const u=t-S(1), kc=cu(1,'company'), kw=cu(1,'word');
  const lit=seg(u,kc-.1,kc+.2), zB=1.5+seg(u,kc,kc+.9,E.io)*.22;
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=panelBox(PA.x,PA.y,PA.w,PA.h,pedroPanel(u,t),{x:540,y:1240,z:1.5+u*.006},{rot:-1,border:TEAL,id:'h1'});
  g+=panelBox(PB.x,PB.y,PB.w,PB.h,duncanPanel(u,t),{x:540,y:1240,z:zB},{rot:1,border:CRIM,id:'h2'});
  g+=`<rect x="32" y="292" width="506" height="826" rx="16" fill="#000" opacity="${N(lit*.5*100)/100}" transform="rotate(-1 285 705)"/>`;
  return finish(jolt(shakeV(u,kw,12,.25),g),t,{boil:2.2}); }

/* 2 HOTEL -> PHILIPPINES -> THE LOOP -> IT SLEEPS */
function sh2(t){ const u=t-S(2), kh=cu(2,'hotel'), kp=cu(2,'philippines'), kl=cu(2,'looped'), kz=cu(2,'sleep');
  if(u>=kl-.12){ const kk=u-kl, ring=seg(kk,0,.55,E.o), knot=1-seg(kk,.1,.4,E.i), HY=300, LEN=440, S3=3.4, cy=HY+LEN;
    let g=`<rect width="1080" height="1920" fill="#efe2bf"/><circle cx="540" cy="${cy}" r="520" fill="#fff6dc" opacity=".8"/>`;
    const awake=u>kl+.42;
    g+=yoyo(540,HY,u,'sleep',{s:S3,len:LEN,spin:awake?u*2.8:.12,fast:awake,cap:seg(u,kz,kz+.18),zzz:seg(u,kz+.05,kz+.3)});
    if(knot>0.02) g+=`<g transform="translate(540 ${cy-6}) scale(${N(knot*100)/100})"><circle r="30" fill="${YO_STR}" stroke="${INK}" stroke-width="6"/><path d="M-14 -4Q0 8 14 -4" fill="none" stroke="${INK}" stroke-width="4"/></g>`;
    if(ring>0&&ring<1.001){ const ry=lerp(HY+60,cy-8,ring); g+=`<ellipse cx="540" cy="${N(ry)}" rx="${N(lerp(30,60,ring))}" ry="${N(lerp(14,26,ring))}" fill="none" stroke="${INK}" stroke-width="13"/><ellipse cx="540" cy="${N(ry)}" rx="${N(lerp(30,60,ring))}" ry="${N(lerp(14,26,ring))}" fill="none" stroke="${YO_STR}" stroke-width="6"/>`; }
    return finish(g,t,{boil:2}); }
  const z=.9; let lob=hotelLobby(u,t);
  const stack={svg:`<g transform="rotate(${N(Math.sin(u*4.6)*3+wob(u,.1,8,9,.5))})">${suitcase(0,0,120,70,'#8a4a2a')}${suitcase(0,-70,100,60,'#2c5e8a',3)}${suitcase(0,-130,84,52,'#c8572e',-4)}${suitcase(0,-182,60,40,'#5f8f3a',5)}</g>`};
  const L0=full({lean:-6,tilt:4,hF:[66,-146],hB:[52,-186],handF:'hold',handB:'open',expr:'tired',look:[4,-3]}), L1=full({...L0,lean:-2,tilt:-10,expr:'hopeful',look:[-3,-6],shrug:0});
  lob+=toon('pedroBell',400,1700,2.2,1,{...tween(u,kp-.25,L0,L1,.35),holdF:stack},t,2);
  let g=stage(480,z,lob);
  g+=tag('HOTEL',540,335,48,'#7a1f2a','#ffe9a8',{k:seg(u,kh-.1,kh+.1),rot:-2});
  const w=seg(u,kp-.15,kp+.65,E.io);
  if(w>0){ const R=lerp(40,1600,w), bx=lerp(500,600,w), by=lerp(470,520,w);
    let yard=philYard(u,t)+toon('kidA',250,1700,1.6,1,{hF:[44,-114],hB:[-10,-118],handF:'hold',expr:'joy',lean:3},t,21)+toon('kidB',500,1700,1.6,1,{hF:[30,-114],handF:'hold',expr:'happy',lean:5,hB:[-8,-118]},t,22)+toon('kidC',740,1700,1.6,-1,{hF:[44,-114],hB:[-10,-118],handF:'hold',expr:'happy',lean:3},t,23);
    const kA=handPt(250,1700,1.6,1,{hF:[44,-114]}), kB=handPt(500,1700,1.6,1,{hF:[30,-114]}), kC=handPt(740,1700,1.6,-1,{hF:[44,-114]});
    yard+=yoyo(kA[0],kA[1],u,'bob',{s:1.1,len:140,per:.8})+yoyo(kC[0],kC[1],u,'bob',{s:1.1,len:140,per:.7,ph:.4})+yoyo(kB[0],kB[1],u,'walk',{s:1.1,wx:500+90+Math.sin(u*2.4)*30,gy:1698,len:140});
    g+=`<clipPath id="tb"><circle cx="${N(bx)}" cy="${N(by)}" r="${N(R)}"/></clipPath><g clip-path="url(#tb)">${stage(480,z,yard)}</g><circle cx="${N(bx)}" cy="${N(by)}" r="${N(R)}" fill="none" stroke="${INK}" stroke-width="10" opacity="${N((1-seg(w,.85,1))*100)/100}"/>`;
    [[470,620,12],[490,560,18],[520,505,26]].forEach(([dx,dy,r],i)=>{ g+=`<circle cx="${dx}" cy="${dy}" r="${r*seg(u,kp-.4+i*.08,kp-.2+i*.08,E.back)}" fill="#fff" stroke="${INK}" stroke-width="5" opacity="${N((1-seg(w,.2,.4))*100)/100}"/>`; }); }
  else [[470,620,12],[490,560,18],[520,505,26]].forEach(([dx,dy,r],i)=>{ g+=`<circle cx="${dx}" cy="${dy}" r="${r*seg(u,kp-.4+i*.08,kp-.2+i*.08,E.back)}" fill="#fff" stroke="${INK}" stroke-width="5"/>`; });
  return finish(g,t); }

/* 3 HIS OWN COMPANY -> THREE FACTORIES */
function sh3(t){ const u=t-S(3), kn=cu(3,'nineteen'), kt=cu(3,'three'), kf=cu(3,'factories');
  if(u<kt-.12){ const z=lerp(.9,.93,seg(u,0,kt,E.io)), a=u*7;
    let g=WALLBG('#a8794a'); for(let i=0;i<14;i++) g+=`<path d="M${-200+i*130} -300V1500" stroke="#8a5e34" stroke-width="5"/>`; g+=FLOOR(1500,'#5a3a22');
    const wc=[640,1300], R=60, cr=[560+Math.sin(a*.5)*5,1325+Math.cos(a*.7)*6];
    g+=`<rect x="480" y="1440" width="330" height="40" rx="6" ${st('#9a6a3c',6)}/><path d="M510 1480V1700M780 1480V1700" stroke="${INK}" stroke-width="16"/><path d="M510 1480V1700M780 1480V1700" stroke="#7a4a28" stroke-width="8"/><path d="M${wc[0]} ${wc[1]}V1440" stroke="${INK}" stroke-width="16"/><path d="M${wc[0]} ${wc[1]}V1440" stroke="#7a7a82" stroke-width="8"/>`;
    g+=`<g transform="translate(${wc[0]} ${wc[1]}) scale(2.1)">${yoyoBody(a/6.283,YO_RED,true)}</g>`;
    for(let i=0;i<6;i++){ const th=a*2+i*1.05; g+=`<path d="M${N(wc[0]+Math.cos(th)*96)} ${N(wc[1]+Math.sin(th)*96)}l${N(Math.cos(th)*26)} ${N(Math.sin(th)*26)}" stroke="#ffe9a8" stroke-width="5" stroke-linecap="round"/>`; }
    const P0=full({lean:7,tilt:6,hF:W2L(380,1700,2.3,1,cr),handF:'fist',hB:[40,-130],handB:'open',expr:'determined',look:[5,2]});
    g+=toon('pedroSuit',380,1700,2.3,1,{...P0,cos:{top:'#d9cfa8',topDk:'#bfb58c'}},t,2);
    const sk=seg(u,kn-.05,kn+.35,E.back), sw=wob(u,kn+.3,6,9,3);
    g+=`<g transform="translate(790 ${N(620-(1-sk)*500)}) rotate(${N(sw-2)}) scale(.9)"><path d="M-120 -120L-90 -10M120 -120L90 -10" stroke="${INK}" stroke-width="8"/><rect x="-190" y="-10" width="380" height="190" rx="10" ${st('#efe6cc',7)}/><text y="68" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="76" fill="${CRIM}">FLORES</text><text y="132" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="${NAVY}">YO-YO</text><text y="165" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="22" fill="#6a5e48">SANTA BARBARA · 1928</text></g>`;
    return finish(stage(540,z,g),t); }
  const k=u-(kt-.12), z=lerp(1.6,.85,seg(k,0,.5,E.o)), pop=i=>seg(u,kt+i*.2,kt+i*.2+.35,E.back);
  let g=`<rect x="-900" y="-900" width="2900" height="2600" fill="#9fd4ec"/><circle cx="880" cy="1000" r="110" fill="#fff3c4"/>`+FLOOR(1700,'#8cbf5a');
  [[170,1.15],[540,1.25],[910,1.15]].forEach(([x,s],i)=>{ g+=factory(x,1700,s,pop(i),u,i); });
  [0,1,2].forEach(i=>{ const x=[170,540,910][i]; g+=impact(x,1500,seg(u,kt+i*.2,kt+i*.2+.5),2.2); });
  g+=conveyor(1706,u);
  return finish(jolt(addV(shakeV(u,kt+.0,12,.25),shakeV(u,kt+.2,12,.25),shakeV(u,kt+.4,12,.25)),stage(540,z,g)),t); }

/* 4 TRADEMARKED -> REJECTED */
function sh4(t){ const u=t-S(4), kt=cu(4,'trademarked'), kf=cu(4,'flores'), kd=cu(4,'donald'), kj=cu(4,'rejected'), z=lerp(.9,.93,seg(u,0,5,E.io));
  const cs=seg(u,.15,1.0,E.io), cx=lerp(300,690,cs), stampK=seg(u,kf,kf+.1), pin=seg(u,kf+.6,kf+1.25,E.io);
  const fs=seg(u,kd-.2,kd+.55,E.io), fx=lerp(1060,700,fs), rej=seg(u,kj,kj+.1);
  let g=patentCounter(u,t);
  /* examiner (behind the counter): looks at the wall, then stamps */
  const up=seg(u,kj-.35,kj-.05,E.o), hit=seg(u,kj-.05,kj,E.i), look=seg(u,kd+.5,kd+.8)*(1-seg(u,kj-.5,kj-.3));
  const stp=(a,b)=>{ const ex=full({lean:12,tilt:look*-6,expr:look>.5?'confused':'stern',look:[4*look,-5*look],hF:[48,-124],hB:[20,-120],handF:'open'}); return ex; };
  const stampDown=Math.max(seg(u,kf-.25,kf-.02,E.i)*(1-seg(u,kf+.02,kf+.3,E.o)), hit*(1-seg(u,kj+.05,kj+.35,E.o)));
  const stampUp=Math.max(seg(u,kf-.5,kf-.25,E.o)*(1-seg(u,kf-.25,kf-.2)), up*(1-hit));
  const arm=mix([30,-190],[48,-176],stampDown)[0]===0?0:0; /* (unused) */
  const exPose=full({lean:12,tilt:look*-6,expr:look>.5?'confused':'stern',look:[4*look,-5*look],hF:mix(mix([34,-130],[44,-236],Math.max(seg(u,kf-.5,kf-.25,E.o)*(1-seg(u,kf-.25,kf-.02)), up*(1-hit))), [52,-182], stampDown),hB:[20,-120],handF:'hold'});
  g+=toon('examiner',560,1560,2.1,1,{...exPose,holdF:{svg:stampProp(CRIM),rot:0}},t,9);
  g+=`<g transform="translate(${N(lerp(790,790,pin))} ${N(lerp(560,560,pin))})"></g>`;
  if(pin>0) g+=certificate(lerp(690,790,pin),lerp(1262,590,pin),lerp(.5,.62,pin),lerp(0,-3,pin),{stamp:stampK});
  g+=counterFront();
  if(pin<=0) g+=certificate(cx,1262,.5,0,{stamp:stampK});
  if(u>kd-.3) g+=formYoYo(fx,1262,.5,2,{rej});
  /* customers in front of the counter */
  const pk=seg(u,.2,.8,E.io), P0=full({lean:2,expr:'proud',look:[5,-1],hF:[60,-176],hB:[-10,-112],handF:'open'}), P1=full({lean:-3,tilt:-5,expr:'proud',look:[5,-4],hF:[66,-232],hB:[40,-150],handF:'point'});
  g+=toon('pedroSuit',190,1700,2.3,1,tween(u,kf+.5,P0,P1,.4),t,2);
  const D0=full({lean:3,tilt:-3,expr:'smug',look:[-5,0],hF:[56,-176],hB:[-10,-112],handF:'flat'}), D1=full({lean:-6,tilt:8,expr:'angry',look:[-5,-1],hF:[64,-196],hB:[50,-168],handF:'fist',handB:'fist'}), D2=full({...D1,lean:-14,tilt:10,expr:'shock'});
  const dp=u<kj?tween(u,kd+.1,D0,D1,.3):tween(u,kj+.05,D1,D2,.35);
  const hatK=seg(u,kj+.05,kj+.95,E.lin), hy0=1700-290*2.3+10;
  g+=toon('duncan',960,1700,2.3,-1,{...dp,cos:u>=kj+.03&&u<kj+.95?{cap:''}:{}},t,3);
  if(u>=kj+.03&&u<kj+.95) g+=`<g transform="translate(0 ${N(-4*330*hatK*(1-hatK))})">${fedoraSvg(942,hy0-30,N(hatK*280),2.5,'#a89060')}</g>`;
  return finish(jolt(shakeV(u,kj,18,.3),stage(540,z,g)),t); }

/* 5 BOUGHT OUT: the money, the name, the sash */
function sh5(t){ const u=t-S(5), kb=cu(5,'bought'), kn=cu(5,'name'), kk=cu(5,'kids'), kd2=cu(5,'with')+.22, kp=cu(5,'pedro');
  if(u<kp-.05){ const z=lerp(.9,.93,seg(u,0,3,E.io)), give=seg(u,kb-.25,kb+.45,E.io), bx=lerp(660,520,give), roll=seg(u,kn-.35,kn+.45,E.io);
    let g=duncanOffice(u,t);
    g+=`<g transform="translate(540 760)"><path d="M-130 -210V-100M130 -210V-100" stroke="${INK}" stroke-width="7"/><rect x="-260" y="-110" width="520" height="290" rx="12" ${st('#efe6cc',8)}/>`;
    const rx=lerp(-230,230,roll);
    g+=`<clipPath id="oldn"><rect x="${N(rx)}" y="-110" width="${N(520)}" height="200"/></clipPath><clipPath id="newn"><rect x="-260" y="-110" width="${N(rx+260)}" height="200"/></clipPath>`;
    g+=`<g clip-path="url(#oldn)"><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="104" fill="${CRIM}">FLORES</text></g><g clip-path="url(#newn)"><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="104" fill="#3f6a4a">DUNCAN</text></g>`;
    g+=`<text y="92" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="84" fill="${NAVY}">YO-YO</text>`;
    if(roll>0&&roll<1) g+=`<g transform="translate(${N(rx)} -10)"><rect x="-26" y="-92" width="52" height="150" rx="14" ${st('#e8c34a',6)}/><path d="M0 58V120" stroke="${INK}" stroke-width="10"/></g>`;
    g+=`</g>`;
    const exe=full({lean:-6,tilt:-3,expr:'smug',look:[-4,2],hF:W2L(780,1640,2.1,-1,[bx+70,1262]),handF:'hold',hB:[30,-130]});
    g+=toon('duncan',790,1640,2.1,-1,tween(u,kb-.3,full({lean:2,expr:'smug',look:[-4,0],hF:[40,-150],hB:[30,-130]}),exe,.3),t,3)+desk(560,1500,700,'#5a3a22')+moneyBag(bx,1272,1.1,give*-6);
    const P0=full({lean:2,expr:'hopeful',look:[5,1],hF:[30,-120],hB:[-12,-114]}), P1=full({lean:8,tilt:10,expr:'sad',look:[4,5],hF:[60,-140],hB:[30,-130],handF:'open'});
    g+=toon('pedroSuit',270,1700,2.25,1,tween(u,kb+.15,P0,P1,.4),t,2);
    return finish(jolt(shakeV(u,kb+.35,10,.2),stage(540,z,g)),t); }
  const k=u-(kp-.05), z=lerp(.9,.93,seg(k,0,3,E.io)), X=330, s=2.2, wd=seg(u,kk-.6,kk-.2), wx=lerp(560,660,E.io(sat((u-(kk-.7))/1.2)));
  let g=streetCorner(u,t);
  const hand=keys(u,[[kp-.05,[50,-122]],[kk-.7,[56,-120],E.io],[kk+.3,[58,-118],E.io],[kk+2,[58,-118]]]);
  const P0=full({lean:8,tilt:2,expr:'happy',look:[5,3],hF:hand,hB:[-14,-114],handF:'hold'}), P1=full({...P0,expr:'determined',tilt:6,lean:6});
  const pp=tween(u,kd2+.05,P0,P1,.3), hp=handPt(X,1700,s,1,pp);
  const kidP=(v,x,ph,i)=>{ const kp2=full({lean:3,hF:[40,-112],hB:[-10,-118],expr:'awe',look:[-4,0],handF:'open'}); return toon(v,x,1700,1.6,-1,kp2,t,30+i); };
  g+=kidP('kidA',760,0,0)+kidP('kidB',865,0,1);
  const raise=seg(u,kd2-.05,kd2+.3,E.back), cardP=full({lean:3,expr:'proud',look:[-4,0],hF:mix([40,-112],[44,-232],raise),hB:[-10,-118],handF:'hold'});
  g+=toon('kidC',975,1700,1.6,-1,{...cardP,holdF:{svg:`<g transform="translate(-6 -70) rotate(-8) scale(-1 1)"><rect x="-70" y="-46" width="140" height="92" rx="6" ${st('#fbf6ea',5)}/><text y="12" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="#3f6a4a">DUNCAN</text></g>`}},t,32);
  g+=toon('pedroSash',X,1700,s,1,pp,t,2);
  g+=`<g transform="translate(${X} 1700) scale(${s} ${s})"><path d="M-22 -224L30 -146" stroke="${INK}" stroke-width="27" stroke-linecap="round"/><path d="M-22 -224L30 -146" stroke="#3f6a4a" stroke-width="19" stroke-linecap="round"/><text transform="translate(-12 -204) rotate(56)" font-family="${BAL}" font-weight="800" font-size="12" fill="#ffe9a8" letter-spacing="1">DUNCAN</text></g>`;
  g+=yoyo(hp[0],hp[1],u,'walk',{s:1.5,wx,gy:1698,len:200});
  return finish(stage(540,z,g),t); }

/* 6 DECADES LATER: calendar, then court */
function sh6(t){ const u=t-S(6), kd=cu(6,'decades'), kr=cu(6,'rival'), kl=cu(6,'lost'), z=.82;
  const yr=Math.round(lerp(1932,1965,seg(u,.15,1.25,E.io))), gr=lerp(.1,.9,seg(u,.15,1.35,E.io));
  if(u<1.3){ let g=under('#c9b48a'); for(let i=-4;i<26;i++) g+=`<path d="M-900 ${i*150}H2000" stroke="#b49a6a" stroke-width="4"/>`;
    g+=`<g transform="translate(700 860) rotate(-3)"><rect x="-190" y="-250" width="380" height="460" rx="12" ${st('#fbf6ea',8)}/><rect x="-190" y="-250" width="380" height="110" rx="12" ${st(CRIM,8)}/><text y="52" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="150" fill="${INK}">${yr}</text></g>`;
    for(let i=0;i<7;i++){ const k=((u*3.2+i/7)%1); g+=`<g transform="translate(${N(700+Math.sin(i*2.1)*170)} ${N(640-k*560)}) rotate(${N(k*260*(i%2?1:-1))})" opacity="${N((1-k)*100)/100}"><rect x="-60" y="-70" width="120" height="140" ${st('#f4ecd4',5)}/></g>`; }
    g+=toon('duncan',270,1700,2.2,1,full({lean:0,expr:'smug',look:[4,0],hF:[40,-130],hB:[-8,-120],cos:{grey:gr}}),t,3);
    return finish(stage(540,.9,g),t); }
  const k=u-1.3; let g=courtroom(u,t,kl);
  const pt=seg(u,kr-.25,kr+.1,E.back);
  g+=toon('duncan',250,1700,2.2,1,tween(u,kr-.3,full({lean:2,expr:'determined',look:[4,0],hF:[40,-130],hB:[-8,-120],cos:{grey:.9}}),full({lean:6,tilt:-5,expr:'angry',look:[5,-1],hF:[100,-210],hB:[-14,-150],handF:'point',cos:{grey:.9}}),.3),t,3);
  const lost=seg(u,kl-.05,kl+.3,E.back);
  g+=toon('rival',860,1700,2.2,-1,tween(u,kr-.5,full({lean:0,expr:'neutral',look:[-4,0],hF:[48,-176],hB:[24,-150],handF:'hold'}),full({lean:-2,expr:'smug',look:[-4,0],hF:[48,-176],hB:[24,-150],handF:'hold'}),.4),t,6);
  g+=`<g transform="translate(${N(860-48*2.2)} ${N(1700-176*2.2)})">${royalBox(-10,-60,-4,.4)}</g>`;
  g=g.replace(/$/,'')+`<g transform="translate(250 1540)"></g>`;
  const word=`<g transform="scale(1)">${bigWord(0,0,84,{reg:1,crack:seg(u,kl-.02,kl+.55,E.lin)})}</g>`;
  return finish(jolt(shakeV(u,kl,16,.3),stage(540,z,g)+`<g transform="translate(300 400)" opacity="${op(seg(u,1.3,1.5)*3)}">${word}</g>`),t); }

/* 7 THE RULING */
function sh7(t){ const u=t-S(7), ky=cu(7,'yoyo'), kp=cu(7,'philippine'), ko=cu(7,'own'), z=.82;
  let g=courtBg();
  /* window with kids outside */
  g+=`<rect x="780" y="680" width="300" height="360" rx="8" ${st('#bfe0e8',8)}/><clipPath id="win"><rect x="788" y="688" width="284" height="344"/></clipPath><g clip-path="url(#win)"><rect x="780" y="680" width="300" height="360" fill="#bfe0e8"/><rect x="780" y="900" width="300" height="140" fill="#8cbf5a"/>`;
  const ck=seg(u,ko-.1,ko+.4,E.back);
  g+=toon('kidA',860,1010,1.15,-1,full({hF:mix([40,-112],[50,-230],ck),hB:[-6,-118],handF:'open',expr:ck>.5?'joy':'awe',look:[-3,-3]}),t,41)+toon('kidB',990,1010,1.15,-1,full({hF:mix([40,-112],[50,-230],ck),hB:[-6,-118],handF:'open',expr:ck>.5?'joy':'awe',look:[-3,-3]}),t,42);
  g+=`</g><path d="M930 680V1040M780 860H1080" stroke="#8a5630" stroke-width="10"/>`;
  g+=`<g transform="translate(295 900)"><path d="M-90 -170L-130 160M90 -170L130 160" stroke="${INK}" stroke-width="14"/><rect x="-150" y="-190" width="300" height="190" rx="8" ${st('#fbf6ea',7)}/></g>`;
  const lift=[0,1,2,3,4].map(i=>i===2?0:seg(u,kp+.05+i*.04,kp+.7+i*.04,E.io)*(1-seg(u,ko,ko+.01)));
  const out=[0,1,2,3,4].map(i=>seg(u,ko-.05+i*.06,ko+.8+i*.06,E.io));
  const hold=seg(u,ky-.25,ky+.1,E.back);
  const J0=full({lean:2,expr:'stern',look:[0,3],hF:[40,-190],hB:[-30,-230],handF:'hold',noShadow:true}), J1=full({lean:-4,tilt:-8,expr:'stern',look:[0,-2],hF:[60,-300],hB:[-30,-230],handF:'hold'});
  const jp=tween(u,ky-.3,J0,J1,.35), jh=handPt(570,1420,2.0,1,jp);
  g+=toon('judge',570,1420,2.0,1,{...jp,noShadow:true,cos:{}},t,9)+courtBench();
  g+=yoyo(jh[0],jh[1],u,'sleep',{s:1.3,len:80,ph:.3,spin:u*2.4,fast:true});
  /* letters: they lift off the exhibit at "Philippine", then float out of the window at "own" */
  ['Y','O','Y','O'].forEach((c,i)=>{ const L=lift[i<2?i:i+1], O=out[i<2?i:i+1], sx=235+i*55+(i>1?20:0), sy=815, ex=900+i*28, ey=800-i*12, x=lerp(sx+(L*(i-1.5)*30),ex,O), y=lerp(sy-L*190,ey+Math.sin(u*5+i)*10,O)+Math.sin(u*4+i)*8*L;
    if(L>0||O>0) g+=`<g transform="translate(${N(x)} ${N(y)}) rotate(${N((i*17-25)*L*(1-O*.4))})" opacity="${op(1.5)}"><text text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(lerp(64,84,L))}" fill="#ffd23a" stroke="${INK}" stroke-width="6" paint-order="stroke fill">${c}</text></g>`; });
  const idle=lift.every(v=>v===0)&&out.every(v=>v===0);
  if(idle) g+=['Y','O','-','Y','O'].map((c,i)=>`<text x="${191+i*52}" y="830" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="58" fill="#ffd23a" stroke="${INK}" stroke-width="6" paint-order="stroke fill">${c}</text>`).join('');
  return finish(cam({x:615,y:1050,z:1.0},g,710),t); }

/* 8 THE EVIDENCE: a typed filing */
function sh8(t){ const u=t-S(8), ke=cu(8,'evidence'), ko=cu(8,'own'), kt=cu(8,'thirty');
  const slide=seg(u,ke-.2,ke+.55,E.o), zoom=lerp(.86,1,seg(u,ke+.5,ke+1.4,E.io));
  let g=deskTop();
  g+=`<g transform="translate(540 1180)"><path d="M-300 -40L-260 -190H260L300 -40V190H-300Z" ${st('#d9c08a',7)}/></g>`;
  const ln=(i,a,b)=>seg(u,a+i*.28,a+i*.28+.45,E.lin);
  const hl=seg(u,ko-.1,ko+.4,E.io);
  g+=`<g transform="translate(540 ${N(lerp(1180,620,slide))}) scale(${N(zoom*100)/100}) rotate(${N(lerp(4,-1,slide))})"><rect x="-400" y="-340" width="800" height="680" ${st('#ecd9a0',8)}/><rect x="-370" y="-310" width="740" height="620" fill="none" stroke="#b8a26a" stroke-width="3"/>`;
  g+=`<text y="-250" text-anchor="middle" font-family="Fell, ${BAL}" font-size="30" fill="#5a4a2a" letter-spacing="3">PATENT OFFICE · RESPONSE OF DEC. 19, 1931</text><path d="M-340 -224H340" stroke="#8a7a4a" stroke-width="3"/>`;
  const L=['“…the applicant understands','the term ‘Yo-Yo’ is used in','the Philippine Islands…”'], FF='Fell, '+BAL, h0=tW('the ',50,FF,400), hw=tW('Philippine Islands',50,FF,400);
  g+=`<rect x="${N(-340+h0-6)}" y="${N(-130+2*84+8)}" width="${N((hw+12)*hl)}" height="64" fill="#ffd23a" opacity=".7"/>`;
  L.forEach((s2,i)=>{ const k=seg(u,ke+.3+i*.22,ke+.3+i*.22+.4,E.lin); g+=`<clipPath id="ty${i}"><rect x="-380" y="${-130+i*84}" width="${N(760*k)}" height="80"/></clipPath><text clip-path="url(#ty${i})" x="-340" y="${-80+i*84}" font-family="Fell, ${BAL}" font-size="50" fill="#2a1e10">${s2}</text>`; });
  g+=`<text x="-340" y="250" text-anchor="start" font-family="Fell, ${BAL}" font-size="40" fill="#5a4a2a" opacity="${op(seg(u,ke+1.2,ke+1.5)*2)}">— DUNCAN, SR.</text></g>`;
  const dk=seg(u,ko-.05,ko+.25,E.back);
  const inset=panelBox(655,800,355,310,`${WALLBG('#6a4a2e')}${toon('duncan',540,1700,2.4,1,full({lean:-6,tilt:6,hy:0,expr:'shock',look:[3,2],hF:[30,-150],hB:[-10,-120],mouth:1.4}),t,3)}`,{x:548,y:1010,z:2.3},{rot:3,k:dk,border:CRIM,id:'in8'});
  const hx=lerp(980,660+200,slide), hyy=lerp(1500,620+330,slide);
  g+=bigArm([1420,1700],[hx,hyy],'#e8bc98','#2e2e34','hold','',.7);
  return finish(g+inset,t); }

/* 9 THE ENDING: the empty desk, the portrait, the yo-yo */
function sh9(t){ const u=t-S(9), kr=cu(9,'ruling'), kd=cu(9,'died'), kb=cu(9,'before'), z=lerp(.88,.93,seg(u,0,5,E.io));
  const dusk=lerp(0,.45,seg(u,kr,kd+.3,E.io));
  let g=hotelLobby(u,t,{dusk:0});
  const fx=490, fy=1090, FW=280, FH=360;
  const wob2=wob(u,0,.6,3,.4);
  g+=`<g transform="translate(${fx} ${fy}) rotate(${N(wob2)})"><path d="M-80 -${FH/2}L0 -${FH/2+90}L80 -${FH/2}" fill="none" stroke="${INK}" stroke-width="6"/><rect x="${-FW/2}" y="${-FH/2}" width="${FW}" height="${FH}" rx="8" ${st('#c8a23a',10)}/><rect x="${-FW/2+22}" y="${-FH/2+22}" width="${FW-44}" height="${FH-44}" fill="#efe2bf" stroke="${INK}" stroke-width="5"/><clipPath id="por"><rect x="${-FW/2+24}" y="${-FH/2+24}" width="${FW-48}" height="${FH-48}"/></clipPath><g clip-path="url(#por)"><rect x="-200" y="-300" width="400" height="700" fill="#b9a374"/>${toon('pedroBell',0,330,1.6,1,full({lean:0,expr:'happy',look:[3,0],hF:[22,-112],hB:[-12,-114],tilt:-2}),t,2)}</g><rect x="${-110}" y="${FH/2+16}" width="220" height="50" rx="6" ${st('#e8c34a',6)}/><text y="${FH/2+52}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="${INK}">PEDRO FLORES</text></g>`;
  const cornerX=fx+FW/2-26, cornerY=fy+FH/2-10;
  const rate=2.6*Math.exp(-u/2.2), spin=2.6*2.2*(1-Math.exp(-u/2.2)), back=seg(u,kb,kb+.9,E.i);
  g+=yoyo(cornerX,cornerY,u,u<kb?'sleep':'return',{s:1.5,len:150,k:(u-kb)/.9,spin:spin,fast:rate>1.4&&u<kb,ph:0});
  if(dusk>0) g+=`<rect x="-300" y="-300" width="1680" height="2800" fill="#1d2a4a" opacity="${N(dusk*100)/100}"/>`;
  return finish(stage(560,z,g),t,{vig:1,grade:['#3a4a6a',.12,'multiply']}); }

const SEQ=[1,2,3,4,5,6,7,8,9].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
