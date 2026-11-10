/* ============================== shots */
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];      // world point -> figure-local
const COVER_T=3.0;
const LAL1={x:250,y:1730,s:2.45}, CLK={x:830,y:1660,s:2.35};
const formSvg=(title='ऋण आवेदन',sub='LOAN PAPERS',col=CRIM)=>`${paper(300,380,0)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${col}">${title}</text><text y="-88" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="24" fill="${INK}">${sub}</text><text x="-120" y="-30" font-family="${BAL}" font-weight="700" font-size="22" fill="#6a5e48">NAME</text><text x="-120" y="4" font-family="Kalam, ${BAL}" font-weight="700" font-size="34" fill="#2a3a6a">Lal Bihari</text>${[0,1,2,3].map(i=>`<path d="M-120 ${44+i*30}h${230-i*30}" stroke="#9a8e78" stroke-width="5" stroke-linecap="round"/>`).join('')}`;
/* 1 HOOK: a man with a sign that says he is alive; the state stamps him DEAD */
function sh1(t){ const u=t-S(1), kd=cu(1,'dead');
  const hit=kd-.02, droop=seg(u,hit+.1,hit+.5,E.io);
  const c=keys(u,[[0,{x:540,y:1080,z:1.18}],[hit,{x:540,y:1060,z:1.25},E.io],[hit+.08,{x:540,y:1080,z:1.34},E.o],[3.7,{x:540,y:1080,z:1.36}]]);
  let g=villageSet(u,t)+hut(930,1180,.8)+neem(120,1260,.9,u);
  const sign=`<g transform="rotate(${N(-4+droop*24)})">${placard('मैं जीवित हूँ','I AM ALIVE',CRIM,360)}</g>`;
  g+=toon('lal',430,1730,2.45,1,{lean:-2,tilt:-6+droop*10,expr:u>hit?'confused':'hopeful',look:u>hit?[3,-5]:[5,-1],hF:[150,-210+droop*50],hB:[110,-170+droop*40],handF:'hold',handB:'hold',holdF:{svg:`<g transform="scale(.55) translate(0 -160)">${sign}</g>`,over:true}},t,1);
  g+=stampMark(540,1180,['मृत','DEAD'],CRIM,seg(u,hit,hit+.08),-14,150)+impact(540,1180,seg(u,hit,hit+.3),3.2);
  return finish(jolt(shakeV(u,hit,34,.4),cam(c,g)),t); }
/* 2 THE LAND OFFICE: loan papers, a clerk, a register */
function sh2(t){ const u=t-S(2), kl=cu(2,'loan');
  const c=keys(u,[[0,{x:560,y:1010,z:1.04}],[4.9,{x:590,y:1000,z:1.18},E.io]]);
  const place=seg(u,1.0,1.7,E.io), pull=seg(u,1.9,2.4,E.io);
  const formW=[lerp(lerp(330,600,place),720,pull), lerp(lerp(1060,1150,place),1150,pull)];
  const handW=[lerp(330,600,place)-(u>1.9?60*seg(u,1.9,2.3):0), lerp(1060,1150,place)];
  const lalP=u<.9?{...TP.namaste,tilt:-6+Math.sin(u*5)*2,look:[5,-1]}:{...TP.hopeful,hF:W2L(LAL1.x,LAL1.y,LAL1.s,1,handW),handF:'flat',hB:[30,-150],lean:6*place,tilt:-4,look:[5,0]};
  const flip1=seg(u,2.5,2.9), flip2=seg(u,2.95,3.35), slide=seg(u,3.4,4.0,E.io), lookUp=seg(u,kl-.1,kl+.4,E.o);
  const fingerW=[lerp(900,880,slide),lerp(1090,1112,slide)];
  const clkP={lean:-6+lookUp*-4,tilt:10-lookUp*18,expr:lookUp>.5?'stern':'bored',look:lookUp>.5?[5,-4]:[4,5],lidAdd:lookUp>.5?-.2:0,
    hF:u<1.9?W2L(CLK.x,CLK.y,CLK.s,-1,[880,1120]):u<2.4?W2L(CLK.x,CLK.y,CLK.s,-1,[lerp(700,720,pull),1150]):W2L(CLK.x,CLK.y,CLK.s,-1,u>3.4?fingerW:[900,1100]),
    handF:u>3.4?'point':'flat', hB:W2L(CLK.x,CLK.y,CLK.s,-1,[960,1130]),handB:'flat'};
  const ctr=counter();
  let g=bankSet(u,t)+fan(560,40,t,6,1.1)+ctr.back+toon('clerk',CLK.x,CLK.y,CLK.s,-1,clkP,t,4)+grille();
  g+=ledger(880,1170,.95,{entry:'लाल बिहारी — मृत',page:flip1>0&&flip1<1?flip1:flip2,hl:seg(u,3.9,4.1)});
  g+=`<g transform="translate(${N(formW[0])} ${N(formW[1])}) rotate(${N(-8+pull*10)}) scale(.31)">${formSvg()}</g>`;
  g+=ctr.front+toon('lal',LAL1.x,LAL1.y,LAL1.s,1,lalP,t,1)+bankBeam(u);
  return finish(cam(c,g),t); }
/* 3 THE RECORDS: the register says he died in 1976 */
function sh3(t){ const u=t-S(3), kd=cu(3,'died'), kr=cu(3,'records');
  if(u<kd-.05){ const c=keys(u,[[0,{x:540,y:1000,z:1.0}],[kd,{x:560,y:1010,z:1.16},E.io]]);
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#6a2a26"/>`;
    g+=`<g transform="translate(540 1000) rotate(-3)"><rect x="-520" y="-640" width="1040" height="1260" rx="20" ${st('#7a2e2a',8)}/><rect x="-490" y="-610" width="480" height="1200" ${st('#fbf3df',5)}/><rect x="10" y="-610" width="480" height="1200" ${st('#f7eed8',5)}/>`;
    for(let i=0;i<15;i++){ g+=`<path d="M-460 ${-540+i*76}H-40M40 ${-540+i*76}H460" stroke="#c9bb98" stroke-width="3"/>`; if(i!==9&&i!==10) g+=`<path d="M-440 ${-556+i*76}l${150+((i*61)%160)} 0M60 ${-556+i*76}l${120+((i*83)%180)} 0" stroke="#5a6a8a" stroke-width="7" stroke-linecap="round" opacity=".8"/>`; }
    g+=`<rect x="44" y="${-540+8*76}" width="420" height="72" fill="${MARI}" opacity="${N(seg(u,kr,kr+.3)*55)/100}"/><text x="64" y="${-540+9*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="52" fill="#2a3a6a">लाल बिहारी</text><text x="340" y="${-540+9*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="56" fill="${CRIM}">मृत</text><text x="64" y="${-540+10*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="40" fill="#2a3a6a">30 · 7 · 1976</text>`;
    const ring=seg(u,kd-.7,kd-.25); if(ring>0) g+=`<ellipse cx="392" cy="${-540+9*76-38}" rx="96" ry="58" fill="none" stroke="${CRIM}" stroke-width="10" stroke-dasharray="${N(ring*480)} 600" transform="rotate(-6 392 ${-540+9*76-38})"/>`;
    g+=`<text x="392" y="${-540+9*76+102}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${CRIM}" opacity="${op(seg(u,kd-.45,kd-.25))}">(DEAD)</text></g>`;
    const tap=Math.abs(Math.sin(Math.max(0,u-kr)*10))*seg(u,kr,kr+.1)*(1-seg(u,kr+.6,kr+.7));
    g+=bigArm([1500,1500],[lerp(1000,820,seg(u,0,.6,E.io)),lerp(1400,1130,seg(u,0,.6,E.io))-tap*40],TC.clerk.skin,TC.clerk.top,'point','',.8);
    return finish(cam(c,g),t,{vig:1.1}); }
  const k=u-kd, c=keys(k,[[0,{x:250,y:1110,z:2.6}],[.18,{x:250,y:1110,z:2.15},E.o],[3,{x:250,y:1120,z:2.2}]]);
  const pulse=seg(k,.6,.85,E.io);
  const p={...TP.shock,lean:-10,tilt:-10-wob(u,kd,8,16,5),hF:pulse>0?mix([70,-250],[34,-176],pulse):[70,-250],hB:pulse>0?mix([40,-240],[40,-172],pulse):[40,-240],handF:pulse>.5?'point':'open',handB:'open',expr:k>1?'confused':'shock',mouth:1,look:pulse>.5?[2,6]:[4,-1]};
  let g=`<rect x="-400" y="-400" width="1880" height="2800" fill="url(#gRed)"/>`+speedLines(250,1050,0,500,28,seg(k,0,.35))+speedLines(250,1050,180,500,28,seg(k,0,.35));
  g+=toon('lal',LAL1.x,LAL1.y,LAL1.s,1,p,t,1)+sweat(380,860,seg(k,.9,1.1),u,1.4)+qmark(430,820,seg(k,1.0,1.2),.8);
  return finish(cam(c,g),t,{vig:1.2}); }
/* 4 FLASHBACK: three notes of a hundred; a word in a register; a sign on a field */
const UNC={x:250,y:1600,s:2.3}, LEK={x:800,y:1600,s:2.2};
function sh4(t){ const u=t-S(4), kn=[cu(4,'three'),cu(4,'hundred'),cu(4,'rupees')], kd=cu(4,'make'), kl=cu(4,'and');
  const sepia=['#c48a4a',.42,'multiply'];
  if(u<kl-.1){ const c=keys(u,[[0,{x:540,y:1080,z:1.12}],[kl,{x:540,y:1060,z:1.25},E.io]]);
    let g=villageSet(u,t)+hut(900,1180,.9)+neem(170,1240,1.1,u)+charpai(250,1640,1.25);
    const given=kn.map(k0=>seg(u,k0-.05,k0+.32,E.io));
    const unP={hy:56,fF:[86,0],fB:[60,0],lean:6,expr:u>kd?'smug':'sneaky',look:[5,0],hF:[110,-180],handF:'hold',hB:[70,-150],handB:'hold'};
    const lekP={lean:-4,expr:given[2]>=1?'smug':'neutral',look:[-4,2],hF:u>kd?[60,-150]:[90,-170],handF:u>kd?'hold':'open',hB:[40,-160],handB:'hold',
      holdB:{svg:`<g transform="rotate(-20)"><rect x="-10" y="-90" width="120" height="90" rx="4" ${st('#7a2e2a',4)}/><rect x="-2" y="-82" width="104" height="74" fill="#fbf3df"/>${u>kd?`<text x="50" y="-34" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="${N(34*seg(u,kd,kd+.4))}" fill="${CRIM}">मृत</text>`:''}</g>`}};
    if(u>kd) lekP.holdF={svg:`<path d="M0 0L-34 -40" stroke="#2c5e8a" stroke-width="8" stroke-linecap="round"/>`,rot:Math.sin(u*30)*10};
    g+=toon('uncle',UNC.x,UNC.y,UNC.s,1,unP,t,2)+toon('lekh',LEK.x,LEK.y,LEK.s,-1,lekP,t,6);
    const from=[UNC.x+110*UNC.s,UNC.y-180*UNC.s], to=[LEK.x-90*LEK.s,LEK.y-170*LEK.s];
    given.forEach((k,i)=>{ if(u<kn[i]-.05) return; const x=lerp(from[0],to[0]-i*8,k), y=lerp(from[1],to[1]-i*10,k)-Math.sin(k*Math.PI)*140; g+=note(x,y,lerp(-20,10,k)+i*6,1.35); });
    g+=given.map((k,i)=>u>kn[i]-.05?ttl(`₹${(i+1)*100}`,560,640,96,MARI,{k:seg(u,kn[i]-.05,kn[i]+.15)*(i<2?1-seg(u,kn[i+1]-.1,kn[i+1]-.05):1),rot:-4}):'').join('');
    return finish(cam(c,g),t,{grade:sepia,paper:.4}); }
  const k=u-kl, flip=seg(k,.25,.55,E.io), c=keys(k,[[0,{x:560,y:1180,z:1.3}],[1.3,{x:560,y:1160,z:1.42},E.io]]);
  let g=villageSet(u,t)+hut(150,1180,.7)+plough(980,1560,1.1);
  const sx=lerp(1,-1,flip);
  g+=`<g transform="translate(760 1560)"><path d="M0 0V-330" stroke="${INK}" stroke-width="22"/><path d="M0 0V-330" stroke="#7a4a24" stroke-width="12"/><g transform="translate(0 -330) scale(${N(sx*100)/100} 1) rotate(${N(wob(k,.55,6,20,6))})"><rect x="-170" y="-90" width="340" height="150" rx="8" ${st(flip<.5?'#f7ebd4':'#f3c84a',6)}/><text y="-36" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="38" fill="${INK}" transform="scale(${sx<0?-1:1} 1)">ज़मीन · LAND</text><text y="30" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="52" fill="${flip<.5?TEAL:CRIM}" transform="scale(${sx<0?-1:1} 1)">${flip<.5?'LAL BIHARI':'HIS UNCLE'}</text></g></g>`;
  g+=toon('uncle',440,1600,2.3,1,{lean:-4,expr:'smug',look:[5,-2],hF:[70,-130],hB:[-60,-130],handF:'fist',handB:'fist',tilt:-6},t,2);
  return finish(cam(c,g),t,{grade:sepia,paper:.4}); }
/* 5 AGAIN AND AGAIN: the waiting years; two offices, one answer; the file */
function sh5(t){ const u=t-S(5), ke=cu(5,'every'), kf=cu(5,'file');
  if(u<ke-.12){ const k=seg(u,0,ke-.12), yr=1977+Math.floor(k*5.99);
    const c=keys(u,[[0,{x:540,y:1060,z:1.1}],[ke,{x:540,y:1040,z:1.2},E.io]]);
    let g=officeSet(u,t)+calendar(760,560,String(yr),1.6,(u*4)%1,-3)+bench(420,1700,1.3);
    g+=fileStack(830,1700,Math.floor(3+k*12),1.3,3)+fileStack(110,1700,Math.floor(2+k*8),1.2,8,2);
    g+=toon('lal',360,1700,2.3,1,{...TP.sit,expr:'tired',look:[4,-3],tilt:4,cos:{grey:k*.15}},t,1)+web(170,760,k,1.6);
    return finish(cam(c,g),t); }
  if(u<kf-.08){ const panel=(i,k0,who,rot,yy,yr)=>{ const k=seg(u,k0-.08,k0+.1,E.back); if(k<=0) return '';
      const inner=officeSet(u,t)+desk(560,1500,700)+toon(who,720,1500,2.2,-1,{lean:-10,tilt:6,expr:'stern',look:[-5,3],hF:[110,-140],handF:'point',hB:[40,-140],handB:'hold'},t,i+3)+fileCard(400,1330,.95,-6,{});
      return `<g transform="translate(540 ${yy}) rotate(${rot}) scale(${N(lerp(.6,1,k)*100)/100})"><clipPath id="pc${i}"><rect x="-500" y="-250" width="1000" height="500" rx="18"/></clipPath><g clip-path="url(#pc${i})"><g transform="scale(.62) translate(-560 -1150)">${inner}</g></g><rect x="-500" y="-250" width="1000" height="500" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>${tag(yr,-380,-180,40,MARI,INK,{rot:-4})}</g>`; };
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a1e16"/>`+panel(0,ke,'clerk',-2,500,'1979')+panel(1,cu(5,'office'),'lekh',1.5,1060,'1984');
    return finish(g,t,{boil:2}); }
  const k=u-kf, c=keys(k,[[0,{x:540,y:960,z:1.0}],[1,{x:540,y:980,z:1.08},E.io]]);
  const hit=kf+.08, hy=u<hit?lerp(600,1000,seg(u,kf-.08,hit,E.i)):lerp(1000,640,seg(u,hit+.12,hit+.45,E.o));
  let g=deskTop()+fileCard(540,1000,2.1,-3,{})+stampMark(540,1180,['मृत','DEAD'],CRIM,seg(u,hit,hit+.08),-10,90);
  g+=bigArm([1500,-200],[600,hy],TC.clerk2.skin,TC.clerk2.top,'hold',`<g transform="translate(0 -8)">${stampProp()}</g>`,.9);
  return finish(jolt(shakeV(u,hit,26,.3),cam(c,g)),t); }
/* 6 THE NAME: he paints it on his own wall */
function sh6(t){ const u=t-S(6), km=cu(6,'mritak'), kdm=cu(6,'the'), kl=cu(6,'lal');
  const wr=seg(u,kl-.35,km+.25,E.lin);
  const c=keys(u,[[0,{x:560,y:1000,z:1.18}],[km+.3,{x:600,y:980,z:1.25},E.io],[4.3,{x:600,y:990,z:1.3}]]);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#d9a066"/>`;
  for(let i=0;i<10;i++) g+=`<ellipse cx="${N(rnd(i)*1080)}" cy="${N(300+rnd(i+4)*1200)}" rx="${N(60+rnd(i+2)*80)}" ry="${N(20+rnd(i+6)*20)}" fill="#c98a52" opacity=".6"/>`;
  g+=`<rect x="-300" y="1560" width="1680" height="800" fill="#a8743a"/><path d="M-300 1560H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=`<rect x="820" y="760" width="260" height="800" ${st('#5a3a22',7)}/><circle cx="1030" cy="1180" r="12" fill="#d8b45a" stroke="${INK}" stroke-width="3"/>`;
  const tx=560, ty=720;
  g+=`<clipPath id="wrc"><rect x="${N(tx-380)}" y="${ty-170}" width="${N(760*wr)}" height="330"/></clipPath><g clip-path="url(#wrc)"><text x="${tx}" y="${ty-30}" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="120" fill="${NAVY}">लाल बिहारी</text><text x="${tx}" y="${ty+110}" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="140" fill="${CRIM}">'मृतक'</text></g>`;
  const turned=u>km+.35;
  const brushW=[tx-380+760*wr, wr<.55?ty-60:ty+80];
  const brush=`<g transform="rotate(-30)"><rect x="-6" y="-70" width="12" height="70" ${st('#8a5a2a',3.5)}/><path d="M-10 -70L10 -70L6 -100L-6 -100Z" ${st('#3a2a1e',3)}/></g>`;
  const p=turned?{...TP.proud,hF:[110,-170],handF:'hold',holdF:{svg:`<g transform="rotate(60)">${brush}</g>`},expr:u>kdm?'proud':'happy',look:[-3,-1]}:{lean:4,tilt:-10,expr:'determined',look:[4,-4],hF:W2L(330,1700,2.3,1,brushW),handF:'hold',holdF:{svg:brush},hB:[20,-120]};
  g+=toon('lal',330,1700,2.3,1,{...p,cos:{grey:.18}},t,1);
  const tr=seg(u,km,km+.2)*(1-seg(u,kdm-.15,kdm));
  g+=`<text x="${tx}" y="${ty+190}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${INK}" opacity="${op(tr)}">LAL BIHARI 'MRITAK'</text>`;
  return finish(cam(c,g),t); }
/* 7 ARREST ME: the young cousin, the cinema, every day */
function sh7(t){ const u=t-S(7), km=cu(7,'and'), kw=cu(7,'it'), kid=cu(7,'kidnapped');
  if(u<kid-.25){ const c=keys(u,[[0,{x:540,y:1080,z:1.08}],[1.4,{x:560,y:1070,z:1.14},E.io]]);
    let g=copSet(u,t)+toon('cop',820,1680,2.35,-1,{lean:-4,expr:'bored',look:[-2,4],hF:[54,-262],hB:[44,-256],handF:'hold',handB:'hold',holdF:{svg:`<g transform="scale(.62)"><rect x="-90" y="-120" width="180" height="140" rx="4" ${st('#f4ecd8',5)}/><path d="M-70 -90h140M-70 -60h120M-70 -30h130" stroke="#9a8e78" stroke-width="7"/></g>`}},t,7);
    g+=toon('lal',250,1700,2.35,1,{lean:10,tilt:-6,expr:'hopeful',look:[5,-2],hF:[110,-180],hB:[104,-172],handF:'fist',handB:'fist',cos:{grey:.22}},t,1);
    g+=tag('ARREST ME!',330,820,54,CRIM,'#fff',{k:seg(u,.5,.7),rot:-5});
    return finish(cam(c,g),t); }
  if(u<km-.08){ const w=strut(u,60,640,kid-.25,km,2.2,120,.4), w2=strut(u,-90,490,kid-.25,km,1.55,90,.5);
    const c={x:420,y:1100,z:1.02};
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gNight)"/><circle cx="820" cy="320" r="90" fill="#fff6d8"/>`;
    for(let i=0;i<30;i++) g+=`<circle cx="${N(rnd(i)*1080)}" cy="${N(rnd(i+3)*800)}" r="${N(2+rnd(i+5)*3)}" fill="#fff" opacity="${N((.4+.5*Math.abs(Math.sin(u*2+i)))*100)/100}"/>`;
    g+=`<path d="M-300 1500Q540 1460 1380 1500V2300H-300Z" fill="#1e2a2a"/>`+hut(900,1500,.9).replace(/#c98a5a/g,'#4a4a6a').replace(/#a8743a/g,'#3a3a5a');
    const lx=w.x, cxk=w2.x;
    g+=toon('cousin',cxk,1700,1.55,1,{...w2.p,expr:'confused',look:[5,-4],hF:W2L(cxk,1700,1.55,1,[lx-60,1430]),handF:'hold',cos:{headS:1.35,young:true}},t,9);
    g+=toon('lal',lx,1700,2.2,1,{...w.p,lean:10,expr:'sneaky',look:[-5,1],hB:W2L(lx,1700,2.2,1,[lx-60,1430]),handB:'hold',tilt:-2,cos:{grey:.22}},t,1);
    g+=tag('HIS YOUNG COUSIN',540,560,50,TEAL,'#fff',{k:seg(u,cu(7,'cousin')-.2,cu(7,'cousin')),rot:3});
    return finish(cam(c,g),t,{grade:['#3a3a8a',.15,'multiply']}); }
  const k=u-km, days=Math.min(3,1+Math.floor(k/.45)), sad=u>kw;
  const c=keys(k,[[0,{x:540,y:1180,z:1.06}],[2.9,{x:540,y:1200,z:1.14},E.io]]);
  const fl=.8+.2*Math.sin(t*23)*Math.sin(t*7.3);
  let g=cinemaSet(u,t);
  g+=toon('cousin',660,1700,1.6,1,{hy:52,fF:[86,0],fB:[66,0],hF:[60,-170],hB:[50,-150],handF:'hold',handB:'hold',expr:'happy',look:[2,-5],holdF:{svg:`<path d="M-26 -10L26 -10L0 70Z" ${st('#f3e6c0',4)}/>${[0,1,2].map(i=>`<circle cx="${-14+i*14}" cy="-16" r="9" fill="#d8a85a" stroke="${INK}" stroke-width="2.5"/>`).join('')}`},noShadow:true,cos:{headS:1.35,young:true}},t,9);
  g+=toon('lal',330,1640,2.25,1,{hy:52,fF:[86,0],fB:[66,0],hF:[70,-112],hB:[56,-110],expr:sad?'sad':'sneaky',look:sad?[2,4]:[-6,0],tilt:sad?14:-4,lean:sad?8:0,noShadow:true,cos:{grey:.24}},t,1);
  g+=`<rect x="-300" y="-300" width="1680" height="2600" fill="#9fb8ff" opacity="${N((fl-.8)*.4*100)/100}" style="mix-blend-mode:screen"/>`+seatRow(1880,1.35);
  if(!sad) g+=tag(`DAY ${days}`,820,980,60,MARI,INK,{k:seg(k,(days-1)*.45,(days-1)*.45+.12),rot:4});
  return finish(cam(c,g),t); }
/* 8 THE BRIBE THAT CAME BACK */
function sh8(t){ const u=t-S(8), kb=cu(8,'bribed'), kc=cu(8,'charge'), kg=cu(8,'gave'), kk=cu(8,'back');
  const nx=keys(u,[[0,{v:450}],[kb,{v:450}],[kb+.45,{v:640},E.io],[kg-.05,{v:640}],[kg+.25,{v:470},E.o],[kk+.15,{v:470}],[kk+.35,{v:640},E.io],[kk+.5,{v:640}],[kk+.65,{v:470},E.o]]).v;
  const copPush=(u>kg-.1&&u<kg+.35)||(u>kk+.45&&u<kk+.75);
  const c=keys(u,[[0,{x:540,y:1140,z:1.05}],[kg,{x:540,y:1150,z:1.14},E.io],[4.3,{x:540,y:1150,z:1.16}]]);
  let g=copSet(u,t)+desk(560,1500,760,'#7a4a2a');
  g+=toon('cop',800,1660,2.3,-1,{lean:copPush?-14:-4,expr:u>kg-.1?'stern':u>kb+.4?'confused':'neutral',look:u>kb+.2&&u<kg?[-2,6]:[-5,-1],hF:copPush?W2L(800,1660,2.3,-1,[nx+50,1462]):[40,-160],handF:copPush?'flat':'fist',hB:[60,-150],handB:'fist'},t,7);
  g+=note(nx,1472,-4,1.7,'500');
  const lalPush=u>kb&&u<kb+.5||(u>kk+.1&&u<kk+.4);
  const lp=u>kc-.1&&u<kg-.1?{...TP.pointSelf,expr:'hopeful',hB:[100,-180],handB:'fist'}:{lean:lalPush?14:2,expr:u>kg+.2?'sad':'hopeful',look:[5,1],hF:lalPush?W2L(300,1700,2.35,1,[nx-60,1470]):[40,-130],handF:'flat',hB:[-10,-112]};
  g+=toon('lal',300,1700,2.35,1,{...lp,cos:{grey:.28}},t,1);
  return finish(cam(c,g),t); }
/* 9 WIDOW'S PENSION (he is standing right behind her) */
function sh9(t){ const u=t-S(9), kd=cu(9,'denied'), kp=cu(9,'pension');
  const c=keys(u,[[0,{x:560,y:1100,z:1.02}],[kd,{x:570,y:1100,z:1.1},E.io],[3.5,{x:570,y:1110,z:1.14}]]);
  const down=seg(u,kd-.12,kd,E.i), hit=kd;
  let g=officeSet(u,t)+desk(720,1500,560);
  g+=toon('clerk2',880,1660,2.2,-1,{lean:-8+down*-8,expr:u>hit?'stern':'bored',look:[-4,u>kp?-3:3],hF:W2L(880,1660,2.2,-1,[640,lerp(1300,1440,down)]),handF:'hold',holdF:{svg:`<g transform="rotate(90) translate(0 -20)">${stampProp()}</g>`},hB:[40,-150],handB:'flat'},t,5);
  g+=`<g transform="translate(640 1478) scale(.42) skewX(-10)">${formSvg('विधवा पेंशन','WIDOW PENSION','#2c5e8a')}</g>`+stampMark(640,1470,['REJECTED'],CRIM,seg(u,hit,hit+.08),-10,34)+impact(640,1460,seg(u,hit,hit+.3),1.2);
  g+=toon('wife',470,1700,2.2,1,{lean:6,expr:u>hit?'sad':'neutral',look:[5,1],hF:[90,-150],handF:'flat',hB:[30,-140]},t,3);
  const wv=Math.sin(u*14)*30;
  g+=toon('lal',230,1720,2.25,1,{lean:-4,tilt:-8,expr:u>hit+.1?'confused':'happy',look:[5,-2],hF:u>hit+.1?[90,-200]:[60+wv*.3,-330+wv],hB:u>hit+.1?[-70,-196]:[-20-wv*.3,-320-wv],handF:'open',handB:'open',cos:{grey:.32}},t,1);
  if(u<hit) g+=tag("I'M RIGHT HERE!",360,780,44,TEAL,'#fff',{k:seg(u,.4,.6),rot:-5});
  return finish(cam(c,g),t); }
/* 10 PARLIAMENT */
function sh10(t){ const u=t-S(10), ka=cu(10,'about'), kv=cu(10,'votes');
  if(u<ka-.12){ const c=keys(u,[[0,{x:500,y:1060,z:1.08}],[ka,{x:600,y:1040,z:1.15},E.io]]);
    let g=villageSet(u,t)+hut(1040,1180,.7)+rickshaw(760,1640,.95,u*.2);
    const shout=Math.abs(Math.sin(u*6));
    g+=toon('lal',330,1700,2.3,1,{lean:-6,tilt:-10,expr:'joy',hF:[78,-276],handF:'hold',holdF:{svg:horn(-10,0,.8,-28)},hB:[-60,-320],handB:'fist',garland:true,cos:{grey:.38}},t,1);
    g+=`<g transform="translate(530 1000)">${[0,1,2].map(i=>`<path d="M${40+i*40} ${-20-i*10}q30 ${30+i*10} 0 ${60+i*20}" fill="none" stroke="#fffaf0" stroke-width="10" stroke-linecap="round" opacity="${op(shout-i*.2)}"/>`).join('')}</g>`;
    g+=toon('v1',1080,1780,1.9,-1,{expr:'confused',look:[-4,-2],hF:[30,-200],handF:'open',tilt:8},t,11);
    g+=petals(30,u,0,3);
    return finish(cam(c,g),t); }
  const k=u-ka, roll=seg(u,ka,kv+.05,E.o), val=Math.round(roll*1600);
  const c=keys(k,[[0,{x:540,y:980,z:1.08}],[1.9,{x:540,y:990,z:1.14},E.io]]);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a3a2e"/>`;
  g+=`<g transform="translate(540 760)"><rect x="-460" y="-330" width="920" height="660" rx="16" ${st('#1e3a2a',10)}/><rect x="-460" y="-330" width="920" height="660" rx="16" fill="none" stroke="#8a5a2a" stroke-width="22"/><text y="-230" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="54" fill="${MARI}">RESULT · ALLAHABAD 1988</text><path d="M-400 -190H400" stroke="#fffaf0" stroke-width="4" opacity=".6"/><text x="-400" y="-80" font-family="${BAL}" font-weight="800" font-size="56" fill="#fffaf0">LAL BIHARI 'MRITAK'</text><text x="400" y="120" text-anchor="end" font-family="${BAL}" font-weight="800" font-size="170" fill="#fffaf0">~${val.toLocaleString('en-US')}</text><text x="400" y="220" text-anchor="end" font-family="${BAL}" font-weight="700" font-size="44" fill="#cfd8cf">VOTES</text></g>`;
  g+=toon('lal',220,1820,2.4,1,{...TP.shrug,expr:u>kv?'proud':'confused',cos:{grey:.38}},t,1);
  return finish(cam(c,g),t); }
/* 11 1994: the calendar races, one signature, and he holds it up */
function sh11(t){ const u=t-S(11), ko=cu(11,'one'), kh=cu(11,'he'), ka=cu(11,'alive'), kn=cu(11,'ninety');
  if(u<ko-.12){ const yr=1985+Math.floor(seg(u,0,kn+.05,E.i)*9.99);
    const c=keys(u,[[0,{x:540,y:960,z:1.0}],[ko,{x:540,y:950,z:1.1},E.io]]);
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a1e16"/>`+calendar(540,900,String(yr),3.4,(u*7)%1*(u<kn?1:0),-3);
    g+=ttl('18 YEARS LATER',540,430,80,MARI,{k:seg(u,kn,kn+.2),rot:-3});
    return finish(cam(c,g),t); }
  if(u<kh-.1){ const k=u-ko, sig=seg(k,.1,1.1,E.lin), c=keys(k,[[0,{x:540,y:1000,z:1.0}],[1.4,{x:540,y:1010,z:1.08},E.io]]);
    let g=deskTop()+`<g transform="translate(540 1060) rotate(-2) scale(2.3)">${paper(300,380,5)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${NAVY}">आदेश · ORDER</text><text y="-88" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="20" fill="${INK}">AZAMGARH · 1994</text><path d="M-100 140${[...Array(8)].map((_,i)=>`q12 ${i%2?24:-24} 24 0`).join('')}" fill="none" stroke="#1d3a8a" stroke-width="5" stroke-dasharray="${N(sig*420)} 600" stroke-linecap="round"/></g>`;
    const px=lerp(310,870,sig), py=1400+Math.sin(sig*40)*26;
    g+=bigArm([1500,1700],[px,py-60],TC.lekh.skin,'#efe7d2','hold',`<g transform="rotate(-150)"><rect x="-8" y="-10" width="16" height="110" rx="6" ${st('#1d3a8a',4)}/></g>`,.85);
    return finish(cam(c,g),t); }
  const k=u-(kh-.1), raise=seg(k,0,.35,E.back), jump=k>.9?Math.max(0,Math.sin(Math.min(1,(k-.9)/.6)*Math.PI))*200:0, land=k>1.5?wob(k,1.5,.16,22,8):0;
  const c=keys(k,[[0,{x:540,y:1000,z:1.22}],[2.4,{x:540,y:1020,z:1.12},E.io]]);
  const order=`<g transform="translate(30 -80) rotate(6) scale(.5)">${paper(300,380,4)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${NAVY}">आदेश · ORDER</text>${stampMark(0,40,['जीवित','ALIVE'],'#1f8a3a',seg(u,ka-.05,ka+.05),-8,64)}</g>`;
  let g=burst(540,900,u,'#ffd25a','#f6a23a',18)+toon('lal',440,1760-jump,2.45,1,{lean:-4,tilt:-10,expr:u>ka?'joy':'awe',hF:mix([70,-150],[140,-320],raise),hB:mix([40,-140],[-40,-320],raise),handF:'hold',handB:'fist',holdF:{svg:order,over:true},sq:-land,fF:jump>0?[30,-30]:[20,0],fB:jump>0?[-30,-40]:[-16,0],cos:{grey:.45}},t,1);
  g+=petals(60,u,ka,7);
  return finish(cam(c,g),t,{vig:.7}); }
/* 12 THE LAND: he lets his uncle keep it */
function sh12(t){ const u=t-S(12), kl=cu(12,'land');
  const give=seg(u,.2,1.2,E.io);
  const c=keys(u,[[0,{x:560,y:1160,z:1.12}],[2.8,{x:560,y:1150,z:1.22},E.io]]);
  let g=villageSet(u,t)+hut(140,1180,.7)+plough(1000,1600,1.0);
  const deedX=lerp(540,650,give);
  g+=toon('uncle',790,1700,2.3,-1,{lean:give>.8?-6:0,expr:u>kl?'awe':'sad',look:[-5,u>kl?1:3],hF:give>.85?W2L(790,1700,2.3,-1,[deedX+40,1260]):[60,-120],handF:give>.85?'hold':'open',hB:[30,-130],cos:{grey:.55}},t,2);
  g+=`<g transform="translate(${N(deedX)} 1250) rotate(${N(-6+give*10)}) scale(.5)">${formSvg('ज़मीन','LAND','#2f7a3a')}</g>`;
  const ns=u>kl+.1;
  g+=toon('lal',330,1720,2.35,1,{lean:give<1?6:0,expr:'hopeful',look:[5,-1],hF:ns?[58,-196]:give<.9?W2L(330,1720,2.35,1,[deedX-40,1270]):[50,-120],handF:'flat',hB:ns?[52,-192]:[-10,-112],handB:'flat',cos:{grey:.48}},t,1);
  return finish(cam(c,g),t,{grade:['#f6b25a',.12,'multiply']}); }
/* 13 THE ASSOCIATION OF DEAD PEOPLE */
function sh13(t){ const u=t-S(13);
  const c=keys(u,[[0,{x:540,y:1060,z:1.22}],[5.9,{x:540,y:1000,z:1.02},E.io]]);
  let g=villageSet(u,t)+neem(1000,1260,.9,u);
  const crowd=[['v2',540,1580,1.7],['v3',730,1590,1.65],['v4',910,1600,1.65],['v1',560,1740,1.9],['wife',760,1760,1.9],['cousin',950,1770,1.9]];
  const signs=[['मैं जीवित हूँ','I AM ALIVE',CRIM],['मृतक संघ','DEAD PEOPLE',NAVY],['ज़िंदा हूँ','STILL ALIVE',TEAL]];
  const sp=[[430,1000],[690,940],[930,1010]];
  crowd.forEach(([w,x,y,s],i)=>{ const bob=Math.abs(Math.sin(u*5+i))*10; g+=toon(w,x,y-bob,s,1,{expr:i%2?'determined':'happy',look:[5,-2],hF:[40,-150],handF:'fist',hB:[-20,-120]},t,20+i); });
  signs.forEach((sg,i)=>{ g+=`<g transform="translate(${sp[i][0]} ${N(sp[i][1]-Math.abs(Math.sin(u*5+i))*10)}) rotate(${N(Math.sin(u*4+i)*4)}) scale(.82)">${placard(...sg,300)}</g>`; });
  const w=strut(u,260,300,0,5.4,2.4,60);
  g+=toon('lal',300,1820,2.45,1,{lean:-4,expr:'joy',hF:[46,-150],handF:'fist',hB:[-36,-336],handB:'fist',fF:w.p.fF,fB:w.p.fB,cos:{grey:.5}},t,1);
  g+=`<g transform="translate(540 560)"><path d="M-520 -90Q0 -40 520 -90V60Q0 110 -520 60Z" ${st(MARI,7)}/><text y="0" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="${CRIM}">मृतक संघ</text><text y="50" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="${INK}">ASSOCIATION OF DEAD PEOPLE · 1980</text></g>`;
  g+=petals(28,u,0,11);
  return finish(cam(c,g),t,{grade:['#f6b25a',.1,'multiply']}); }
const SEQ=[1,2,3,4,5,6,7,8,9,10,11,12,13].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9,sh10,sh11,sh12,sh13][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ let g='';
  if(t<S(2)){ const u=t; let h=`<rect width="1080" height="640" fill="url(#gTopShade)"/>`;
    h+=ttl('LEGALLY DEAD',540,330,118,MARI,{k:seg(u,0,.18),rot:-2})+ttl('FOR 18 YEARS.',540,440,84,'#fffaf0',{k:seg(u,.12,.3),rot:-2});
    h+=tag('(HE WAS FINE)',790,550,40,TEAL,'#fff',{k:seg(u,1.0,1.2),rot:4});
    g+=h; }
  if(t>=S(4)&&t<SE(4)) g+=tag('FLASHBACK',540,250,42,'#5a3a1a','#ffe9b0',{k:seg(t-S(4),.05,.25),rot:-2});
  if(t>=S(6)&&t<SE(6)){ const u=t-S(6); g+=tag("मृतक = 'THE DEAD'",560,915,52,CRIM,'#fff',{k:seg(u,cu(6,'the')-.05,cu(6,'the')+.15),rot:3}); }
  if(t>=S(13)){ const u=t-S(13); g+=`<g opacity="${op(seg(u,4.95,5.15))}"><rect y="1230" width="1080" height="330" fill="${INK}" opacity=".72"/></g>`+ttl("LAL BIHARI 'MRITAK'",540,1350,84,MARI,{k:seg(u,5.0,5.2),rot:-2})+ttl('DEAD ON PAPER · 1976–1994',540,1450,52,'#fffaf0',{k:seg(u,5.15,5.35),rot:-2}); }
  return g+mySubs(t); }
