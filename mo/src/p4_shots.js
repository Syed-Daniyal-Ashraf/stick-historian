/* ============================== shots: She Invented Monopoly. She Got $500. */
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const COVER_T=4.9;
/* a framed panel: renders inner world svg (1080x1920 space) into a rect, with its own camera */
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="scale(${N(w/1080*1000)/1000}) translate(-540 -960)">${cam(c,inner)}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="10"/></g>`; }
/* 1 HOOK: he got rich (top) / she got $500 (bottom) */
function sh1(t){ const u=t-S(1), kr=cu(1,'rich'), kw=cu(1,'woman'), kd=cu(1,'dollars');
  let top=burst(540,900,u,'#ffe08a','#f6b84a',16)+moneyPile(540,1500,1.6);
  top+=toon('darrow',540,1330-Math.max(0,Math.sin(Math.min(1,Math.max(0,u-kr+.1)/.5)*Math.PI))*60,2.3,1,{lean:-6,tilt:-10,expr:u>kr-.1?'joy':'smug',hF:[70,-300],hB:[-60,-300],handF:'open',handB:'open'},t,3);
  top+=moneyRain(u,kr-.15,26,4,[-40,-200,1160,2000]);
  let bot=parlor(u,t)+toon('lizzieOld',520,1700,2.35,1,{lean:0,tilt:4,expr:u>kd?'bored':'neutral',look:[-2,2],hF:[50,-176],handF:'hold',holdF:{svg:`<g transform="rotate(-8) translate(30 -20) scale(.42)">${check(0,0,0,1)}</g>`},hB:[-10,-112]},t,5);
  if(u>kd) bot+=tag('$500',780,900,64,DOLLAR,'#fff',{k:seg(u,kd,kd+.15),rot:-6});
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=panelBox(40,100,1000,760,top,{x:540,y:930,z:.82+u*.01},{rot:-1.2,k:1,id:'h1'});
  g+=panelBox(40,950,1000,760,bot,{x:560,y:1100,z:1.05+u*.012},{rot:1.2,k:1,id:'h2'})+`<rect x="30" y="930" width="1020" height="800" fill="#000" opacity="${N((1-seg(u,kw-.15,kw+.1))*.62*100)/100}" transform="rotate(1.2 540 1330)"/>`;
  return finish(g,t,{boil:2.2}); }
/* 2 1904: the typist; the patent */
function sh2(t){ const u=t-S(2), kp=cu(2,'patented'), kg=cu(2,'game'), kt=cu(2,'typist');
  if(u<kp-.2){ const c=keys(u,[[0,{x:520,y:1100,z:1.12}],[kp,{x:500,y:1060,z:1.22},E.io]]), turn=u>kt+.6;
    let g=parlor(u,t)+`<g transform="translate(250 1700)"><rect x="-80" y="-180" width="160" height="26" rx="6" ${st('#5a3a22',5)}/><path d="M-70 -154V0M70 -154V0M-70 -420V-180" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-70 -154V0M70 -154V0M-70 -420V-180" stroke="#6a4424" stroke-width="8" stroke-linecap="round"/></g>`+desk(560,1500,560,'#6a3e22')+typewriter(560,1460,1.25,u,!turn);
    g+=toon('lizzie',290,1700,2.35,1,turn?{hy:52,fF:[86,0],fB:[66,0],lean:-4,tilt:-8,expr:'proud',hF:[90,-250],handF:'hold',hB:[40,-250],handB:'hold',holdF:{svg:`<g transform="translate(40 -60) rotate(-4) scale(.36)">${magieBoard(0,0,420,{title:false})}</g>`,over:true}}:{hy:52,fF:[86,0],fB:[66,0],lean:14,tilt:10,expr:'hopeful',look:[4,5],hF:[150+Math.sin(u*30)*6,-118],hB:[130+Math.cos(u*28)*6,-120],handF:'open',handB:'open'},t,5);
    g+=tag('TYPIST · WASHINGTON, D.C.',540,620,40,NAVY,'#fff',{k:seg(u,kt-.1,kt+.1),rot:-3});
    return finish(cam(c,g),t); }
  const k=u-(kp-.2), c=keys(k,[[0,{x:540,y:1000,z:1.0}],[1.8,{x:540,y:1000,z:1.08},E.io]]);
  let g=deskTop()+`<g transform="translate(540 1000) rotate(-2)"><rect x="-470" y="-620" width="940" height="1240" ${st('#f4ecd4',6)}/><text y="-540" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="50" fill="${INK}">UNITED STATES PATENT OFFICE</text><text y="-484" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="30" fill="#5a5040">No. 748,626 · JANUARY 5, 1904</text>`;
  g+=magieBoard(0,60,720,{draw:seg(k,.05,.9,E.io)})+`</g>`;
  g+=stampMark(800,1290,['PATENTED','1904'],CRIM,seg(u,kg-.05,kg+.05),-12,64);
  return finish(jolt(shakeV(u,kg-.05,22,.3),cam(c,g)),t); }
/* 3 THE POINT: the landlord collects; everyone else goes broke */
function sh3(t){ const u=t-S(3), kr=cu(3,'rich'), kb=cu(3,'everyone');
  if(u<kb-.08){ const c=keys(u,[[0,{x:540,y:960,z:1.0}],[kb,{x:560,y:950,z:1.12},E.io]]);
    const land=[700,800];
    let g=deskTop()+magieBoard(540,960,880,{houses:[[-180,380,'#c8a23a'],[-110,380,'#c8a23a'],[-40,380,'#c8a23a'],[380,180,'#c8a23a'],[380,110,'#c8a23a']].filter((_,i)=>u>.3+i*.22)});
    const pawns=[[330,720,'#2c5e8a'],[380,1200,'#c8572e'],[840,700,'#5f8f3a']];
    pawns.forEach(([x,y,col],i)=>{ g+=pawn(x,y,col,1.6); const k=seg(u,kr-.25+i*.12,kr+.25+i*.12,E.io); if(k>0&&k<1) g+=coin(lerp(x,land[0],k),lerp(y,land[1],k)-Math.sin(k*Math.PI)*160,1.6); });
    g+=pawn(land[0],land[1],'#e8c34a',2.1,wob(u,kr+.4,14,16,6));
    g+=tag('LANDLORD',land[0],land[1]-170,40,'#e8c34a',INK,{k:seg(u,.4,.6),rot:-4});
    return finish(cam(c,g),t); }
  const k=u-kb, c=keys(k,[[0,{x:540,y:1080,z:1.2}],[1.6,{x:540,y:1060,z:1.3},E.io]]);
  let g=streetSet(u,t).replace(/NO HELP/,'RENT').replace(/WANTED/,'DUE').replace('>1932<','><');
  const flap=seg(k,.25,.45,E.back);
  g+=toon('p1',520,1700,2.4,1,{...TP.shrug,expr:'sad',look:[2,4],hF:[60,-130+flap*-10],hB:[-40,-128],handF:'open',handB:'open',tilt:8},t,7);
  g+=`<g opacity="${op(flap)}"><path d="M${N(520+50*2.4)} ${N(1700-110*2.4)}q22 10 10 40q-20 4 -22 -36Z" fill="#fbf6ea" stroke="${INK}" stroke-width="4"/><path d="M${N(520-40*2.4)} ${N(1700-110*2.4)}q-22 10 -10 40q20 4 22 -36Z" fill="#fbf6ea" stroke="${INK}" stroke-width="4"/></g>`;
  const mx=640+k*120, my=1300-k*260+Math.sin(k*14)*20; if(k>.4) g+=`<g transform="translate(${N(mx)} ${N(my)})"><ellipse rx="10" ry="6" fill="#8a7a6a"/><path d="M0 0Q-18 -${N(16+Math.abs(Math.sin(k*30))*10)} -26 -4Q-14 6 0 0ZM0 0Q18 -${N(16+Math.abs(Math.sin(k*30))*10)} 26 -4Q14 6 0 0Z" fill="#b8a898" stroke="${INK}" stroke-width="2.5"/></g>`;
  return finish(cam(c,g),t); }
/* 4 TWO SETS OF RULES */
function rulesA(u,t,share){ let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+magieBoard(540,1460,420,{title:false}).replace('<g transform="translate(540 1460)">','<g transform="translate(540 1460) scale(1 .35)">');
  const who=[['p1',330,-1],['p2',540,1],['p3',750,-1]];
  who.forEach(([w,x,d],i)=>{ g+=toon(w,x,1700,2.1,i===2?-1:1,{lean:-4,expr:share>.5?'happy':'neutral',look:[0,-3],hF:share>.5?[50,-300]:[60,-150],hB:share>.5?[-40,-290]:[40,-140],handF:share>.5?'fist':'open'},t,10+i); });
  for(let i=0;i<9;i++){ const k=seg(u,share>0?0:9,9); }
  if(share>0) for(let i=0;i<9;i++){ const tx=[330,540,750][i%3], k=seg(share,0,1); g+=coin(lerp(540,tx,k)+((i*37)%40-20),lerp(1420,1300,k)-Math.sin(k*Math.PI)*120-(Math.floor(i/3))*18,1.6); }
  return g; }
function rulesB(u,t,crush){ let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+magieBoard(540,1460,420,{title:false}).replace('<g transform="translate(540 1460)">','<g transform="translate(540 1460) scale(1 .35)">');
  g+=moneyPile(720,1470,1.15*crush+.01);
  g+=toon('p3',740,1700,2.1,-1,{lean:-4,expr:crush>.5?'smug':'neutral',look:[-4,0],hF:[60,-170],hB:[40,-160],handF:'fist',handB:'fist',tilt:-6},t,13);
  g+=toon('p1',320,1700,2.1,1,{lean:6,expr:crush>.5?'sad':'neutral',look:[4,2],hF:[30,-130],hB:[-10,-120],tilt:crush>.5?12:0},t,10)+toon('p2',480,1700,2.0,1,{lean:4,expr:crush>.5?'shock':'neutral',look:[5,0],hF:[60,-230],hB:[40,-220],handF:'open'},t,11);
  return g; }
function sh4(t){ const u=t-S(4), k1=cu(4,'one'), ks=cu(4,'shares'), k2=cu(4,'other'), kc=cu(4,'crushes');
  if(u<k1-.12){ const c=keys(u,[[0,{x:540,y:980,z:1.0}],[k1,{x:540,y:990,z:1.08},E.io]]);
    let g=deskTop();
    [['ANTI-MONOPOLIST','RULES',-260,-5,0],['MONOPOLIST','RULES',260,4,.5]].forEach(([a,b,x,r,d])=>{ const w=seg(u,.2+d,.9+d,E.lin);
      g+=`<g transform="translate(${540+x} 1000) rotate(${r})">${paper(440,600,0)}<text y="-220" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${a.length>12?36:44}" fill="${x<0?TEAL:CRIM}">${a}</text><text y="-176" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="${INK}">${b}</text>${[0,1,2,3,4,5].map(i=>`<path d="M-170 ${-110+i*56}h${N(330*sat(w*6-i))}" stroke="#5a6a8a" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>`; });
    g+=tag('TWO SETS OF RULES',540,520,54,MARI,INK,{k:seg(u,.15,.35),rot:-3});
    return finish(cam(c,g),t); }
  const kA=seg(u,k1-.13,k1+.02), kB=seg(u,k2-.1,k2+.05);
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=panelBox(30,180,500,1300,rulesA(u,t,seg(u,ks-.1,ks+.4,E.io)),{x:540,y:1240,z:1.5},{rot:-1,k:kA,border:TEAL,id:'ra'});
  g+=panelBox(550,180,500,1300,rulesB(u,t,seg(u,kc-.1,kc+.1,E.back)),{x:540,y:1240,z:1.5},{rot:1,k:kB,border:CRIM,id:'rb'});
  g+=tag('EVERYONE',280,250,54,TEAL,'#fff',{k:kA,rot:-3})+tag('SHARES',280,330,54,TEAL,'#fff',{k:kA,rot:-3})+tag('WINNER',800,250,54,CRIM,'#fff',{k:kB,rot:3})+tag('TAKES ALL',800,330,54,CRIM,'#fff',{k:kB,rot:3});
  return finish(jolt(shakeV(u,kc,18,.3),g),t,{boil:2}); }
/* 5 GUESS WHICH ONE CAUGHT ON */
function sh5(t){ const u=t-S(5), kc=cu(5,'caught');
  const fall=seg(u,kc-.1,kc+.5,E.i), grow=seg(u,kc,kc+.5,E.io);
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=`<g transform="translate(${N(280-fall*420)} ${N(830+fall*3000)}) rotate(${N(-1-fall*60)}) translate(-280 -830)">${panelBox(30,180,500,1300,rulesA(u,t,1),{x:540,y:1240,z:1.5},{rot:0,border:TEAL,id:'ra'})}</g>`;
  const x=lerp(550,40,grow), w=lerp(500,1000,grow);
  g+=panelBox(x,180,w,1300,rulesB(u,t,1),{x:540,y:lerp(1240,1220,grow),z:lerp(1.5,1.25,grow)},{rot:lerp(1,0,grow),border:CRIM,id:'rb'});
  g+=`<g opacity="${op(seg(u,.05,.25))}" transform="translate(${N(lerp(800,540,grow))} ${N(140+Math.sin(u*10)*8)})"><path d="M-40 -60H40V0H80L0 70L-80 0H-40Z" fill="${MARI}" stroke="${INK}" stroke-width="7"/></g>`;
  return finish(g,t,{boil:2}); }
/* 6 FOR DECADES: copies drawn by hand */
function sh6(t){ const u=t-S(6), kh=cu(6,'hand');
  const c=keys(u,[[0,{x:540,y:960,z:1.0}],[3.4,{x:540,y:940,z:1.08},E.io]]);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#c9b48a"/>`;
  for(let i=0;i<14;i++) g+=`<path d="M-300 ${i*150}H1380" stroke="#b49a6a" stroke-width="4"/>`;
  const boards=[[300,560,-6,0,'#f1e6c8'],[790,760,5,.5,'#e8dcc0'],[420,1300,3,1.0,'#efe0c4']];
  boards.forEach(([x,y,r,d,col],i)=>{ const dr=seg(u,d,d+1.4,E.lin); g+=`<g transform="translate(${x} ${y}) rotate(${r})">${magieBoard(0,0,460,{title:false,draw:dr}).replace('#f1e6c8',col)}</g>`;
    if(dr>0&&dr<1){ const a=dr*Math.PI*2, hx=x+Math.cos(a)*200, hy=y+Math.sin(a)*200; g+=bigArm([x+330,y+470],[hx,hy],['#f0c9a4','#d9a37a','#ecbc94'][i],['#fbf6ea','#6a7a5a','#3c5a6e'][i],'hold',`<g transform="rotate(-140)"><rect x="-6" y="-8" width="12" height="90" rx="4" ${st('#e8c34a',3)}/></g>`,.55); } });
  g+=stampMark(800,1500,['HOMEMADE'],'#2c5e8a',seg(u,kh-.05,kh+.05),-8,60);
  return finish(cam(c,g),t); }
/* 7 DARROW: Depression street; a friend's kitchen; Parker Brothers */
function sh7(t){ const u=t-S(7), kn=cu(7,'charles'), kl=cu(7,'learned'), ka=cu(7,'and'), ko=cu(7,'own');
  if(u<kl-.1){ const c=keys(u,[[0,{x:520,y:1060,z:1.05}],[kn,{x:540,y:1060,z:1.12},E.io],[kl,{x:540,y:1060,z:1.16}]]);
    const w=strut(u,-80,420,0,kn-.2,2.35,150,.25);
    let g=streetSet(u,t)+toon('darrow',w.x,1720,2.35,1,{...w.p,lean:w.moving?8:2,tilt:12,expr:'sad',look:[3,4],hF:[40,-112],handF:'hold',holdF:{svg:`<rect x="-46" y="0" width="92" height="64" rx="8" ${st('#5a3a22',4)}/><path d="M-16 0V-12H16V0" fill="none" stroke="${INK}" stroke-width="5"/>`},hB:[-14,-112]},t,3);
    for(let i=0;i<14;i++){ const k=(u*.5+i*.13)%1; g+=`<ellipse cx="${N(1100-k*1300+Math.sin(u*3+i)*30)}" cy="${N(400+i*80+Math.sin(u*4+i)*40)}" rx="14" ry="7" fill="#a8743a" opacity=".7" transform="rotate(${N(u*90+i*40)} ${N(1100-k*1300)} ${N(400+i*80)})"/>`; }
    g+=tag('CHARLES DARROW',w.x+20,560,52,'#3a3a40','#fff',{k:seg(u,kn-.05,kn+.15),rot:-4})+tag('OUT OF WORK',w.x+20,650,36,CRIM,'#fff',{k:seg(u,cu(7,'out')-.05,cu(7,'out')+.15),rot:3});
    return finish(cam(c,g),t,{grade:['#6a7a8a',.18,'multiply']}); }
  if(u<ka-.05){ const k=u-(kl-.1), c=keys(k,[[0,{x:540,y:1140,z:1.15}],[1.1,{x:540,y:1120,z:1.25},E.io]]);
    let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+`<g transform="translate(540 1462) scale(1 .35)">${magieBoard(0,0,460,{title:false}).replace('#f1e6c8','#e8dcc0')}</g>`;
    g+=toon('pal',820,1700,2.2,-1,{lean:-8,expr:'happy',look:[-4,4],hF:[90,-140],handF:'point',hB:[40,-140]},t,8);
    g+=toon('darrow',260,1700,2.2,1,{lean:12,expr:k>.5?'awe':'neutral',look:[4,4],hF:[60,-140],hB:[30,-130],tilt:6},t,3)+bulb(300,780,seg(k,.45,.65));
    return finish(cam(c,g),t); }
  const k=u-ka, give=seg(k,.1,.8,E.io), c=keys(k,[[0,{x:540,y:1120,z:1.08}],[2.6,{x:540,y:1110,z:1.14},E.io]]);
  let g=parkerOffice(u,t)+desk(780,1520,560,'#5a3a22');
  const bx=lerp(380,560,give);
  const ex=seg(k,.9,1.4,E.io)*(1-seg(k,2.0,2.4,E.io));
  g+=toon('exec',860,1700,2.3,-1,{lean:give>.8?-6-ex*6:0,tilt:ex*14+wob(k,2.4,6,14,5),expr:give>.8?(ex>.5?'awe':'happy'):'neutral',look:ex>.5?[-3,6]:[-5,2],hF:give>.85?W2L(860,1700,2.3,-1,[bx+60,1300]):[40,-150],handF:'hold',hB:[40,-150]},t,6);
  g+=`<g transform="translate(${N(bx)} 1290) rotate(${N(-4+give*6)}) scale(.38)">${magieBoard(0,0,460,{title:false}).replace('#f1e6c8','#e8dcc0')}</g>`;
  g+=toon('darrow',300,1700,2.3,1,{lean:give<1?8:-2,expr:u>ko-.2?'smug':'hopeful',look:[5,-1],hF:give<.95?W2L(300,1700,2.3,1,[bx-60,1300]):[50,-140],handF:'hold',hB:[-10,-112],tilt:-4},t,3);
  g+=stampMark(bx,1300,['INVENTOR:','C. DARROW'],'#1d3a8a',seg(u,ko-.25,ko-.15),-10,40);
  return finish(cam(c,g),t); }
/* 8 HE GOT RICH / SHE GOT $500 */
function sh8(t){ const u=t-S(8), kr=cu(8,'rich'), kp=cu(8,'parker'), kf=cu(8,'five'), kb=cu(8,'bought');
  if(u<kp-.12){ const c={x:540,y:1080,z:1.15};
    let g=burst(540,900,u,'#ffe08a','#f6b84a',16)+moneyPile(560,1760,1.7)+toon('darrow',540,1560,2.4,1,{...TP.cheer,expr:'joy'},t,3)+moneyRain(u,0,30,9);
    return finish(cam(c,g),t,{vig:.7}); }
  { const k=u-(kp-.12), give=seg(u,kb-.2,kb+.4,E.io), c=keys(k,[[0,{x:560,y:1120,z:1.12}],[1.6,{x:560,y:1100,z:1.2},E.io],[3.4,{x:500,y:1060,z:1.5},E.io]]);
    let g=parlor(u,t);
    const cx=lerp(720,560,give);
    g+=toon('exec',840,1700,2.3,-1,{lean:give>.2?-8:0,expr:'neutral',look:[-5,2],hF:W2L(840,1700,2.3,-1,[cx+60,1250]),handF:'hold',hB:[40,-150]},t,6);
    g+=check(cx,1240,-4,.55)+(u>kf-.1?`<circle cx="${N(cx+57)}" cy="1232" r="${N(48+Math.sin(u*8)*3)}" fill="none" stroke="${CRIM}" stroke-width="7" stroke-dasharray="${N(seg(u,kf-.1,kf+.3)*310)} 400"/>`:'');
    g+=toon('lizzieOld',300,1700,2.3,1,{lean:4,expr:'hopeful',look:[5,0],hF:give>.7?W2L(300,1700,2.3,1,[cx-80,1250]):[40,-150],handF:'hold',hB:[-10,-112]},t,5);
    g+=tag('1935',540,600,52,'#3a2a1e','#ffd890',{k:seg(k,0,.15),rot:-3});
    return finish(cam(c,g),t); }
}
/* 9 THE 1970s: Anti-Monopoly; the 1904 board comes out of the files */
function sh9(t){ const u=t-S(9), ka=cu(9,'anti'), kun=cu(9,'until'), kf=cu(9,'fight');
  if(u<kun-.1){ const c=keys(u,[[0,{x:540,y:1000,z:1.0}],[kun,{x:540,y:980,z:1.25},E.io]]);
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#3a2e24"/>`;
    for(let i=0;i<10;i++) g+=`<path d="M${-200+i*160} -300L${-260+i*190} 2300" stroke="#2e241c" stroke-width="40"/>`;
    g+=`<g transform="translate(540 1100) rotate(-4)"><rect x="-330" y="-240" width="660" height="480" rx="10" ${st('#8a6a42',7)}/><path d="M-330 -240L-280 -330H280L330 -240" ${st('#a8844e',6)}/></g>`;
    g+=`<g transform="translate(540 900) rotate(-6) scale(.9)">${magieBoard(0,0,520,{})}</g><rect x="-300" y="-300" width="1680" height="2600" fill="#9a8a70" opacity=".22"/>`;
    g+=web(260,680,1,2.2)+web(860,620,1,1.6)+dust(30,u,[100,300,880,1300],4,'#d8ccb4',1.4);
    g+=tag('FORGOTTEN',540,520,56,'#5a4a3a','#e8dcc0',{k:seg(u,cu(9,'forgotten')-.1,cu(9,'forgotten')+.1),rot:-4});
    return finish(cam(c,g),t,{grade:['#6a5a4a',.2,'multiply']}); }
  const k=u-(kun-.1), c=keys(k,[[0,{x:540,y:1120,z:1.05}],[1.4,{x:540,y:1100,z:1.12},E.io],[3.4,{x:540,y:1040,z:1.2},E.io]]);
  const argue=Math.sin(u*9), slam=seg(u,kf-.15,kf,E.i);
  let g=courtroom(u,t);
  g+=toon('lawyer',860,1700,2.2,-1,{lean:-10-argue*3,expr:'angry',look:[-5,0],hF:[150+argue*14,-250-argue*20],handF:'point',hB:[40,-150]},t,6);
  const lift=seg(u,ka-.2,ka+.1,E.back), reveal=seg(u,ka+.3,ka+.75,E.io);
  g+=toon('prof',230,1700,2.25,1,{lean:-2+slam*10,tilt:-6+wob(u,kf,6,14,5),expr:reveal>0?'determined':'angry',look:[5,-2],hF:lift>0?[90,-300]:[110,lerp(-260,-150,slam)],handF:'hold',hB:reveal>0?[100,-240]:[40,-150],handB:'hold',holdF:{svg:`<g transform="translate(60 -40) scale(.38)">${gameBox(0,0,0,1,'ANTI-MONOPOLY','A BOARD GAME · 1973',CRIM)}</g>`}},t,7);
  g+=desk(260,1470,440,'#6a3e1e')+desk(840,1470,440,'#6a3e1e');
  if(reveal>0) g+=`<g transform="translate(540 ${N(lerp(1500,880,reveal))}) scale(${N(lerp(.2,1,reveal)*100)/100}) rotate(${N((1-reveal)*-20)})"><rect x="-330" y="-330" width="660" height="660" fill="#fff6d8" opacity=".35" filter="url(#soft)"/>${magieBoard(0,0,560,{})}</g>`;
  return finish(jolt(shakeV(u,kf,16,.25),cam(c,g)),t); }

/* 10 1940: maker of games; income 0 */
function sh10(t){ const u=t-S(10), km=cu(10,'maker'), kz=cu(10,'zero');
  if(u<kz+.6){ const c=keys(u,[[0,{x:540,y:960,z:1.0}],[km,{x:540,y:880,z:1.12},E.io],[kz,{x:500,y:940,z:1.3},E.io]]);
    return finish(cam(c,deskTop()+censusForm(u,km,kz)),t); }
  const k=u-(kz+.6), c=keys(k,[[0,{x:540,y:1180,z:1.2}],[2.2,{x:540,y:1160,z:1.12},E.io]]);
  let g=parlor(u,t).replace(/#ffe9b0|#ffc870/g,'#c9a46a')+desk(620,1500,640,'#6a3e22')+`<g transform="translate(620 1462) scale(1 .35)">${magieBoard(0,0,460,{title:false})}</g>`;
  g+=toon('lizzieOld',330,1700,2.3,1,{hy:0,lean:6,tilt:10,expr:'tired',look:[4,5],hF:[110,-140],handF:'flat',hB:[90,-136]},t,5);
  return finish(cam(c,g),t,{grade:['#3a3a6a',.18,'multiply']}); }
const SEQ=[1,2,3,4,5,6,7,8,9,10].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9,sh10][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ let g='';
  if(t<S(2)) g+=ttl('WHO REALLY INVENTED MONOPOLY?',540,74,50,'#fffaf0',{k:seg(t,0,.15),rot:-1,sw:.14});
  if(t>=S(10)){ const u=t-S(10), k0=cu(10,'zero')+.9; g+=`<g opacity="${op(seg(u,k0,k0+.2))}"><rect y="1240" width="1080" height="320" fill="${INK}" opacity=".72"/></g>`+ttl('LIZZIE MAGIE',540,1360,92,MARI,{k:seg(u,k0,k0+.2),rot:-2})+ttl("PATENTED THE LANDLORD'S GAME, 1904",540,1450,46,'#fffaf0',{k:seg(u,k0+.15,k0+.35),rot:-2}); }
  return g+mySubs(t); }
