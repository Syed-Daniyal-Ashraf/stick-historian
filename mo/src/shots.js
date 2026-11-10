/* ============================== shots: She Invented Monopoly. She Got $500.
   LAYOUT (screen px, 1080x1920). The Reels interface covers the top 270 and everything below 1250, so:
     290-1110  picture: every face, hand, prop and label that matters
     1125-1215 subtitle line (baseline 1190, set in src/meta.js)
     below     floor / paper only
   Wide shots use stage(): the ground line (world y=1700) sits at screen y=FEET, so zooming never pushes feet into the
   subtitle. Labels are drawn in screen space after the camera, so they stay inside the safe area whatever the zoom.
   Poses never snap: every change goes through tween() (anticipation + overshoot) or a continuous mix(). */
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const COVER_T=5.4;
const FEET=1115;
const stage=(x,z,g,F=FEET)=>cam({x,y:1700,z},g,F);
const under=col=>`<rect x="-900" y="-900" width="2900" height="4600" fill="${col}"/>`;   // fills the frame behind sets when the camera is pulled back
/* a framed panel: renders inner world svg (1080x1920 space) into a rect, with its own camera */
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="scale(${N(w/1080*1000)/1000}) translate(-540 -960)">${cam(c,inner)}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="10"/></g>`; }
const tableBoard=(x,y,S=460,col='#f1e6c8')=>`<g transform="translate(${x} ${y}) scale(1 .35)">${magieBoard(0,0,S,{title:false}).replace('#f1e6c8',col)}</g>`;

/* 1 HOOK: he got rich (left) / she got $500 (right) */
function sh1(t){ const u=t-S(1), kr=cu(1,'rich'), kw=cu(1,'woman'), kd=cu(1,'dollars');
  const hop=Math.sin(sat((u-kr+.1)/.5)*Math.PI)*60;
  let L=burst(540,900,u,'#ffe08a','#f6b84a',16)+moneyPile(540,1500,1.6);
  L+=toon('darrow',540,1330-hop,2.3,1,tween(u,kr-.1,full({lean:2,tilt:-4,expr:'smug',hF:[44,-150],hB:[-34,-150],handF:'fist',handB:'fist'}),full({lean:-6,tilt:-10,expr:'joy',hF:[56,-296],hB:[-56,-296],handF:'open',handB:'open'}),.3),t,3);
  L+=moneyRain(u,kr-.15,26,4,[-40,-200,1160,2000]);
  const chk={svg:`<g transform="rotate(-8) translate(30 -20) scale(.42)">${check(0,0,0,1)}</g>`};
  const R0=full({tilt:4,expr:'neutral',look:[-2,2],hF:[50,-176],handF:'hold'}), R1=full({lean:5,tilt:15,hy:6,expr:'tired',look:[3,5],hF:[58,-158],handF:'hold'});
  const Rg=parlor(u,t)+toon('lizzieOld',520,1700,2.35,1,{...tween(u,kd+.1,R0,R1,.45,E.io),holdF:chk},t,5);
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=panelBox(40,380,490,730,L,{x:540,y:1060,z:1.45+u*.012},{rot:-1,id:'h1'});
  g+=panelBox(550,380,490,730,Rg,{x:540,y:1290,z:1.62+u*.014},{rot:1,id:'h2'});
  g+=`<rect x="542" y="370" width="506" height="750" rx="16" fill="#000" opacity="${N((1-seg(u,kw-.15,kw+.1))*.6*100)/100}" transform="rotate(1 795 745)"/>`;
  g+=tag('$500',815,470,64,DOLLAR,'#fff',{k:seg(u,kd,kd+.15),rot:-6});
  return finish(g,t,{boil:2.2}); }

/* 2 1904: the typist; the patent */
function sh2(t){ const u=t-S(2), kp=cu(2,'patented'), kg=cu(2,'game'), kt=cu(2,'typist');
  if(u<kp-.2){ const tn=kt+.55, z=lerp(.98,1.04,seg(u,0,kp,E.io));
    let g=parlor(u,t)+`<g transform="translate(250 1700)"><rect x="-80" y="-180" width="160" height="26" rx="6" ${st('#5a3a22',5)}/><path d="M-70 -154V0M70 -154V0M-70 -420V-180" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-70 -154V0M70 -154V0M-70 -420V-180" stroke="#6a4424" stroke-width="8" stroke-linecap="round"/></g>`+desk(560,1500,560,'#6a3e22')+typewriter(560,1460,1.25,u,u<tn);
    const seat={hy:52,fF:[86,0],fB:[66,0]};
    const A=full({...seat,lean:18,tilt:8,expr:'hopeful',look:[4,5],hF:[120+Math.sin(u*30)*5,-120],hB:[106+Math.cos(u*28)*5,-122],handF:'open',handB:'open'});
    const B=full({...seat,lean:-4,tilt:-8,expr:'proud',look:[2,-2],hF:[94,-180],hB:[64,-170],handF:'hold',handB:'hold'});
    const p=tween(u,tn,A,B,.34), bk=seg(u,tn+.06,tn+.34,E.back);
    if(bk>0) p.holdF={svg:`<g transform="translate(30 -52) rotate(${N(-4+wob(u,tn+.3,5,16,6))}) scale(${N(.3*bk*100)/100})">${magieBoard(0,0,420,{title:false})}</g>`,over:true};
    g+=toon('lizzie',290,1700,2.35,1,p,t,5);
    return finish(stage(480,z,g)+tag('TYPIST · WASHINGTON, D.C.',735,332,36,NAVY,'#fff',{k:seg(u,kt-.1,kt+.1)*(1-seg(u,tn-.05,tn+.15)),rot:-2}),t); }
  const k=u-(kp-.2), z=lerp(.76,.8,seg(k,0,1.8,E.io));
  let g=under('#9a6236')+deskTop()+`<g transform="translate(540 1000) rotate(-2)"><rect x="-470" y="-620" width="940" height="1240" ${st('#f4ecd4',6)}/><text y="-540" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="50" fill="${INK}">UNITED STATES PATENT OFFICE</text><text y="-484" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="30" fill="#5a5040">No. 748,626 · JANUARY 5, 1904</text>`;
  g+=magieBoard(0,60,720,{draw:seg(k,.05,.9,E.io)})+`</g>`;
  g+=stampMark(800,1290,['PATENTED','1904'],CRIM,seg(u,kg-.05,kg+.05),-12,64);
  return finish(jolt(shakeV(u,kg-.05,22,.3),cam({x:540,y:1000,z},g,290+620*z)),t); }

/* 3 THE POINT: the landlord collects; everyone else goes broke */
function sh3(t){ const u=t-S(3), kr=cu(3,'rich'), kb=cu(3,'everyone');
  if(u<kb-.08){ const z=lerp(.88,.93,seg(u,0,kb,E.io)), land=[700,800];
    let g=under('#9a6236')+deskTop()+magieBoard(540,960,880,{houses:[[-180,380,'#c8a23a'],[-110,380,'#c8a23a'],[-40,380,'#c8a23a'],[380,180,'#c8a23a'],[380,110,'#c8a23a']].filter((_,i)=>u>.3+i*.22)});
    const pawns=[[330,720,'#2c5e8a'],[380,1200,'#c8572e'],[840,700,'#5f8f3a']];
    pawns.forEach(([x,y,col],i)=>{ const t0=kr-.25+i*.12, k=seg(u,t0,t0+.5,E.io); g+=pawn(x,y,col,1.6,Math.max(0,wob(u,t0,10,20,7)));
      if(k>0&&k<1) g+=coin(lerp(x,land[0],k),lerp(y,land[1],k)-Math.sin(k*Math.PI)*160,1.6); });
    g+=pawn(land[0],land[1],'#e8c34a',2.1,Math.max(0,wob(u,kr+.4,14,16,6)));
    g+=tag('LANDLORD',land[0],land[1]-170,40,'#e8c34a',INK,{k:seg(u,.4,.6),rot:-4});
    return finish(cam({x:540,y:960,z},g,700),t); }
  const k=u-kb, z=lerp(.9,.95,seg(k,0,1.6,E.io));
  let g=streetSet(u,t,{x:830,y:965,s:.8,l1:'RENT',l2:'DUE',l3:''});
  const flap=seg(k,.3,.5,E.back);
  g+=toon('p1',520,1700,2.4,1,tween(k,.22,full({expr:'neutral',look:[2,2],hF:[30,-120],hB:[-22,-118]}),full({expr:'sad',look:[2,4],hF:[62,-134],hB:[-44,-130],handF:'open',handB:'open',tilt:8,shrug:10}),.3),t,7);
  g+=`<g opacity="${op(flap)}"><path d="M${N(520+50*2.4)} ${N(1700-110*2.4)}q22 10 10 40q-20 4 -22 -36Z" fill="#fbf6ea" stroke="${INK}" stroke-width="4"/><path d="M${N(520-40*2.4)} ${N(1700-110*2.4)}q-22 10 -10 40q20 4 22 -36Z" fill="#fbf6ea" stroke="${INK}" stroke-width="4"/></g>`;
  const mx=640+k*120, my=1300-k*200+Math.sin(k*14)*20; if(k>.4) g+=`<g transform="translate(${N(mx)} ${N(my)})"><ellipse rx="10" ry="6" fill="#8a7a6a"/><path d="M0 0Q-18 -${N(16+Math.abs(Math.sin(k*30))*10)} -26 -4Q-14 6 0 0ZM0 0Q18 -${N(16+Math.abs(Math.sin(k*30))*10)} 26 -4Q14 6 0 0Z" fill="#b8a898" stroke="${INK}" stroke-width="2.5"/></g>`;
  return finish(stage(540,z,g),t); }

/* 4 TWO SETS OF RULES (share = 0..1, crush = 0..1 drive the acting continuously) */
function rulesA(u,t,share){ let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+tableBoard(540,1460,420);
  [['p1',330,1],['p2',540,1],['p3',750,-1]].forEach(([w,x,d],i)=>{ const s=sat(share*1.3-i*.12), up=E.back(s);
    g+=toon(w,x,1700,2.1,d,{lean:-4,hy:-Math.sin(s*Math.PI)*8,expr:s>.45?'happy':'neutral',look:[0,-3],hF:mix([60,-150],[50,-292],up),hB:mix([40,-140],[-40,-284],up),handF:s>.45?'fist':'open',handB:s>.45?'fist':'open'},t,10+i); });
  if(share>0) for(let i=0;i<9;i++){ const tx=[330,540,750][i%3], k=sat(share); g+=coin(lerp(540,tx,k)+((i*37)%40-20),lerp(1420,1300,k)-Math.sin(k*Math.PI)*120-(Math.floor(i/3))*18,1.6); }
  return g; }
function rulesB(u,t,crush){ const c=sat(crush); let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+tableBoard(540,1460,420);
  g+=moneyPile(720,1470,1.15*crush+.01);
  g+=toon('p3',740,1700,2.1,-1,{lean:mix(-4,6,c),expr:c>.5?'smug':'neutral',look:[-4,0],hF:mix([60,-170],[74,-196],c),hB:mix([40,-160],[52,-188],c),handF:'fist',handB:'fist',tilt:mix(0,-8,c)},t,13);
  g+=toon('p1',320,1700,2.1,1,{lean:mix(2,10,c),hy:mix(0,8,c),expr:c>.5?'sad':'neutral',look:[4,2],hF:[30,-130],hB:[-10,-120],tilt:mix(0,14,c)},t,10);
  g+=toon('p2',480,1700,2.0,1,{lean:mix(4,-6,c),expr:c>.5?'shock':'neutral',look:[5,0],hF:mix([40,-150],[60,-232],c),hB:mix([20,-146],[40,-222],c),handF:'open',handB:'open'},t,11);
  return g; }
const PA={x:40,y:300,w:490,h:810}, PB={x:550,y:300,w:490,h:810}, PCAM={x:540,y:1240,z:1.5};
function sh4(t){ const u=t-S(4), k1=cu(4,'one'), ks=cu(4,'shares'), k2=cu(4,'other'), kc=cu(4,'crushes');
  if(u<k1-.12){ const z=lerp(1,1.05,seg(u,0,k1,E.io));
    let g=under('#9a6236')+deskTop();
    [['ANTI-MONOPOLIST','RULES',-240,-5,0],['MONOPOLIST','RULES',240,4,.5]].forEach(([a,b,x,r,d])=>{ const w=seg(u,.2+d,.9+d,E.lin), drop=seg(u,d*.3,d*.3+.3,E.back);
      g+=`<g transform="translate(${540+x} ${N(1000-(1-drop)*500)}) rotate(${N(r+(1-drop)*14)})" opacity="${op(drop*3)}">${paper(400,600,0)}<text y="-220" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${a.length>12?34:44}" fill="${x<0?TEAL:CRIM}">${a}</text><text y="-176" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="${INK}">${b}</text>${[0,1,2,3,4,5].map(i=>`<path d="M-150 ${-110+i*56}h${N(290*sat(w*6-i))}" stroke="#5a6a8a" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>`; });
    return finish(cam({x:540,y:1000,z},g,750)+tag('TWO SETS OF RULES',540,335,54,MARI,INK,{k:seg(u,.15,.35),rot:-2}),t); }
  const kA=seg(u,k1-.13,k1+.02), lit=seg(u,k2-.1,k2+.05);
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=panelBox(PA.x,PA.y,PA.w,PA.h,rulesA(u,t,seg(u,ks-.1,ks+.5,E.io)),PCAM,{rot:-1,k:kA,border:TEAL,id:'ra'});
  g+=panelBox(PB.x,PB.y,PB.w,PB.h,rulesB(u,t,seg(u,kc-.1,kc+.12,E.back)),PCAM,{rot:1,k:seg(u,k1-.05,k1+.1),border:CRIM,id:'rb'});
  g+=`<rect x="542" y="290" width="506" height="830" rx="16" fill="#000" opacity="${N((1-lit)*.62*seg(u,k1-.05,k1+.1)*100)/100}" transform="rotate(1 795 705)"/>`;
  g+=tag('EVERYONE',285,352,46,TEAL,'#fff',{k:kA,rot:-3})+tag('SHARES',285,428,46,TEAL,'#fff',{k:kA,rot:-3})+tag('WINNER',795,352,46,CRIM,'#fff',{k:lit,rot:3})+tag('TAKES ALL',795,428,46,CRIM,'#fff',{k:lit,rot:3});
  return finish(jolt(shakeV(u,kc,18,.3),g),t,{boil:2}); }

/* 5 GUESS WHICH ONE CAUGHT ON: the sharing panel drops away, the monopoly panel takes the whole frame */
function sh5(t){ const u=t-S(5), kc=cu(5,'caught');
  const fall=seg(u,kc-.1,kc+.5,E.i), grow=seg(u,kc,kc+.5,E.io), wig=Math.sin(u*16)*(1-sat(fall*4))*seg(u,.1,.4)*1.2;
  let g=`<rect width="1080" height="1920" fill="#20160f"/>`;
  g+=`<g transform="translate(${N(285-fall*420)} ${N(705+fall*3000)}) rotate(${N(-1+wig-fall*60)}) translate(-285 -705)">${panelBox(PA.x,PA.y,PA.w,PA.h,rulesA(u,t,1),PCAM,{rot:0,border:TEAL,id:'ra'})}${tag('EVERYONE',285,352,46,TEAL,'#fff',{rot:-3})+tag('SHARES',285,428,46,TEAL,'#fff',{rot:-3})}</g>`;
  g+=panelBox(lerp(PB.x,40,grow),PB.y,lerp(PB.w,1000,grow),PB.h,rulesB(u,t,1),{x:540,y:lerp(1240,1250,grow),z:lerp(1.5,.92,grow)},{rot:lerp(1-wig,0,grow),border:CRIM,id:'rb'});
  g+=tag('WINNER',lerp(795,425,grow),lerp(352,346,grow),46,CRIM,'#fff',{rot:lerp(3,-2,grow)})+tag('TAKES ALL',lerp(795,690,grow),lerp(428,346,grow),46,CRIM,'#fff',{rot:lerp(3,-2,grow)});
  return finish(jolt(shakeV(u,kc+.45,14,.3),g),t,{boil:2}); }

/* 6 FOR DECADES: copies drawn by hand */
function sh6(t){ const u=t-S(6), kh=cu(6,'hand'), z=lerp(.78,.82,seg(u,0,3.2,E.io));
  let g=under('#c9b48a'); for(let i=-4;i<26;i++) g+=`<path d="M-900 ${i*150}H2000" stroke="#b49a6a" stroke-width="4"/>`;
  const boards=[[300,560,-6,0,'#f1e6c8',[-260,1000]],[800,720,5,.5,'#e8dcc0',[1320,1120]],[390,1060,3,1.0,'#efe0c4',[-260,1130]]];
  boards.forEach(([x,y,r,d,col,sh],i)=>{ const dr=seg(u,d,d+1.4,E.lin); g+=`<g transform="translate(${x} ${y}) rotate(${r})">${magieBoard(0,0,440,{title:false,draw:dr}).replace('#f1e6c8',col)}</g>`;
    if(dr>0&&dr<1){ const a=dr*Math.PI*2, hx=x+Math.cos(a)*190+Math.sin(u*40+i)*4, hy=y+Math.sin(a)*190; g+=bigArm(sh,[hx,hy],['#f0c9a4','#d9a37a','#ecbc94'][i],['#fbf6ea','#6a7a5a','#3c5a6e'][i],'hold',`<g transform="rotate(${i===1?140:-140})"><rect x="-6" y="-8" width="12" height="90" rx="4" ${st('#e8c34a',3)}/></g>`,.55); } });
  g+=stampMark(820,1120,['HOMEMADE'],'#2c5e8a',seg(u,kh-.05,kh+.05),-8,60);
  return finish(jolt(shakeV(u,kh-.05,14,.25),cam({x:550,y:810,z},g,300+470*z)),t); }

/* 7 DARROW: Depression street; a friend's kitchen; Parker Brothers */
function sh7(t){ const u=t-S(7), kn=cu(7,'charles'), kl=cu(7,'learned'), ka=cu(7,'and'), ko=cu(7,'own'), kout=cu(7,'out'), ksal=cu(7,'salesman');
  if(u<kl-.1){ const stop=kout-.1, z=lerp(.9,.93,seg(u,0,kl,E.io));
    const w=strut(u,-60,340,0,stop,2.3,130,.25), caseSvg={svg:`<rect x="-46" y="0" width="92" height="64" rx="8" ${st('#5a3a22',4)}/><path d="M-16 0V-12H16V0" fill="none" stroke="${INK}" stroke-width="5"/>`};
    const P0={...full(w.p),hB:[w.p.hB[0]*.55,-118],lean:w.moving?8:2,tilt:12,expr:'sad',look:[3,4],hF:[40,-112],handF:'hold'};
    const P1={...P0,lean:-3,tilt:-14,expr:'plead',look:[4,-5]}, P2={...P0,lean:9,tilt:17,hy:7,shrug:-6,expr:'sad',look:[2,5]};
    const p=u<ksal+.25?tween(u,stop+.08,P0,P1,.3):tween(u,ksal+.4,P1,P2,.5,E.io);
    let g=streetSet(u,t,{x:815,y:960,s:.8,l1:'NO HELP',l2:'WANTED',l3:'1932'})+toon('darrow',w.x,1700,2.3,1,{...p,holdF:caseSvg},t,3);
    for(let i=0;i<14;i++){ const k=(u*.5+i*.13)%1; g+=`<ellipse cx="${N(1100-k*1300+Math.sin(u*3+i)*30)}" cy="${N(900+i*58+Math.sin(u*4+i)*40)}" rx="14" ry="7" fill="#a8743a" opacity=".7" transform="rotate(${N(u*90+i*40)} ${N(1100-k*1300)} ${N(900+i*58)})"/>`; }
    const hud=tag('OUT OF WORK',815,612,36,CRIM,'#fff',{k:seg(u,kout-.05,kout+.15),rot:3})+tag('CHARLES DARROW',800,696,44,'#3a3a40','#fff',{k:seg(u,kn-.05,kn+.15),rot:-3});
    return finish(stage(500,z,g)+hud,t,{grade:['#6a7a8a',.18,'multiply']}); }
  if(u<ka-.05){ const k=u-(kl-.1), z=lerp(.9,.93,seg(k,0,1.1,E.io));
    let g=kitchen(u,t)+desk(540,1500,820,'#7a4a2a')+tableBoard(540,1462,460,'#e8dcc0');
    g+=toon('pal',820,1700,2.2,-1,{lean:-8,expr:'happy',look:[-4,4],hF:[76,-162+Math.abs(Math.sin(k*9))*10*(1-sat(k-.5))],handF:'point',hB:[40,-140]},t,8);
    g+=toon('darrow',260,1700,2.2,1,tween(k,.4,full({lean:4,expr:'neutral',look:[4,4],hF:[40,-128],hB:[10,-122],tilt:4}),full({lean:14,expr:'awe',look:[5,5],hF:[78,-150],hB:[52,-142],handF:'open',handB:'open',tilt:8}),.3),t,3);
    const b=seg(k,.5,.7), bs=E.back(sat(b));
    const hud=b>0?`<g transform="translate(590 405) scale(${N(.7*bs*100)/100})">${bulb(0,0,1)}</g>`:'';
    return finish(stage(540,z,g)+hud,t); }
  const k=u-ka, give=seg(k,.1,.8,E.io), z=lerp(.9,.93,seg(k,0,2.6,E.io)), bx=lerp(380,560,give), kst=ko-.2;
  let g=parkerOffice(u,t)+desk(780,1520,560,'#5a3a22');
  const ex=seg(k,.9,1.4,E.io)*(1-seg(k,2.0,2.4,E.io)), take=seg(k,.55,.9,E.io);
  g+=toon('exec',860,1700,2.3,-1,{lean:mix(0,7-ex*3,take),tilt:ex*14+wob(k,2.4,6,14,5),expr:take>.5?(ex>.5?'awe':'happy'):'neutral',look:ex>.5?[-3,6]:[-5,2],hF:mix([40,-150],W2L(860,1700,2.3,-1,[bx+60,1300]),take),handF:'hold',hB:[40,-150]},t,6);
  g+=`<g transform="translate(${N(bx)} 1290) rotate(${N(-4+give*6)}) scale(.38)">${magieBoard(0,0,460,{title:false}).replace('#f1e6c8','#e8dcc0')}</g>`;
  const D0=full({lean:8,expr:'hopeful',look:[5,-1],hF:W2L(300,1700,2.3,1,[bx-60,1300]),handF:'hold',tilt:-4}), D1=full({lean:-5,expr:'smug',look:[4,-2],hF:[36,-190],handF:'point',hB:[-30,-150],handB:'fist',tilt:-9});
  g+=toon('darrow',300,1700,2.3,1,tween(u,kst-.1,D0,D1,.3),t,3);
  const hud=tag('PARKER BROTHERS · 1935',745,335,36,'#1d2a24','#e8c34a',{k:seg(k,0,.15),rot:-2})+tag('INVENTOR: C. DARROW',540,900,46,'#fbf6ea','#1d3a8a',{k:seg(u,kst,kst+.12),rot:-7});
  return finish(jolt(shakeV(u,kst,16,.25),stage(540,z,g)+hud),t); }

/* 8 HE GOT RICH / SHE GOT $500 */
function sh8(t){ const u=t-S(8), kr=cu(8,'rich'), kp=cu(8,'parker'), kf=cu(8,'five'), kb=cu(8,'bought');
  if(u<kp-.12){ const z=.82, b=Math.abs(Math.sin(u*7)), sq=(1-b)*.08;
    let g=burst(540,1000,u,'#ffe08a','#f6b84a',16)+moneyPile(560,1760,1.7)+toon('darrow',540,1560-b*26,2.4,1,{...TP.cheer,hF:[34,-322],hB:[-34,-318],expr:'joy',sq},t,3)+moneyRain(u,0,30,9);
    return finish(cam({x:540,y:1560,z},under('#f6b84a')+g,1080),t,{vig:.7}); }
  { const k=u-(kp-.12), give=seg(u,kb-.2,kb+.4,E.io), cx=lerp(720,560,give), read=seg(u,kf-.05,kf+.4,E.io);
    const c=keys(k,[[0,{x:560,y:1700,z:.93,oy:FEET}],[1.4,{x:560,y:1700,z:.95,oy:FEET},E.io],[3.2,{x:560,y:1240,z:1.28,oy:700},E.io]]);
    let g=parlor(u,t);
    g+=toon('exec',840,1700,2.3,-1,{lean:mix(0,-8,give),expr:'neutral',look:[-5,2],hF:W2L(840,1700,2.3,-1,[cx+118,1252]),handF:'hold',hB:[40,-150]},t,6);
    g+=check(cx,1240,-4,.8)+(u>kf-.1?`<circle cx="${N(cx+83)}" cy="1232" r="${N(62+Math.sin(u*8)*3)}" fill="none" stroke="${CRIM}" stroke-width="8" stroke-dasharray="${N(seg(u,kf-.1,kf+.3)*400)} 500"/>`:'');
    const L0=full({lean:4,expr:'hopeful',look:[5,0],hF:[40,-150],handF:'hold'}), L1=full({lean:6,expr:'hopeful',look:[5,3],hF:W2L(300,1700,2.3,1,[cx-118,1252]),handF:'hold'}), L2={...L1,lean:8,tilt:13,hy:5,expr:'sad',look:[4,6]};
    g+=toon('lizzieOld',300,1700,2.3,1,read>0?mix(L1,L2,read):tween(u,kb+.1,L0,L1,.3),t,5);
    return finish(cam(c,g)+tag('1935',540,335,48,'#3a2a1e','#ffd890',{k:seg(k,0,.15),rot:-3}),t); }
}

/* 9 THE 1970s: Anti-Monopoly; the 1904 board comes out of the files */
function sh9(t){ const u=t-S(9), ka=cu(9,'anti'), kun=cu(9,'until'), kf=cu(9,'fight');
  if(u<kun-.1){ const z=lerp(.95,1.08,seg(u,0,kun,E.io));
    let g=under('#3a2e24'); for(let i=-3;i<14;i++) g+=`<path d="M${-200+i*160} -900L${-260+i*190} 3400" stroke="#2e241c" stroke-width="40"/>`;
    g+=`<g transform="translate(540 1100) rotate(-4)"><rect x="-330" y="-240" width="660" height="480" rx="10" ${st('#8a6a42',7)}/><path d="M-330 -240L-280 -330H280L330 -240" ${st('#a8844e',6)}/></g>`;
    g+=`<g transform="translate(540 900) rotate(-6) scale(.9)">${magieBoard(0,0,520,{})}</g><rect x="-900" y="-900" width="2900" height="4600" fill="#9a8a70" opacity=".22"/>`;
    g+=web(260,680,1,2.2)+web(860,620,1,1.6)+dust(30,u,[100,300,880,1300],4,'#d8ccb4',1.4);
    return finish(cam({x:540,y:930,z},g,700)+tag('FORGOTTEN',540,340,52,'#5a4a3a','#e8dcc0',{k:seg(u,cu(9,'forgotten')-.1,cu(9,'forgotten')+.1),rot:-3}),t,{grade:['#6a5a4a',.2,'multiply']}); }
  const k=u-(kun-.1), z=lerp(.9,.93,seg(k,0,3.4,E.io));
  const argue=Math.sin(u*9), slam=seg(u,kf-.15,kf,E.i), reveal=seg(u,ka-.05,ka+.4,E.io), see=seg(u,ka+.15,ka+.45);
  let g=courtroom(u,t,kf);
  g+=toon('lawyer',860,1700,2.2,-1,{lean:mix(-10-argue*3,6,see),tilt:mix(0,-8,see),expr:see>.5?'shock':'angry',look:mix([-5,0],[-4,-4],see),hF:mix([84+argue*6,-246-argue*8],[60,-200],see),handF:see>.5?'open':'point',hB:[40,-150]},t,6);
  const Pa=full({lean:-2+slam*10,tilt:-6+wob(u,kf,6,14,5),expr:'angry',look:[5,-2],hF:[96,lerp(-236,-176,slam)],handF:'hold',hB:[40,-150]}), Pb=full({lean:-4,tilt:-8,expr:'determined',look:[5,-3],hF:[44,-300],handF:'hold',hB:[66,-250],handB:'open'});
  g+=toon('prof',225,1700,2.25,1,{...tween(u,ka-.5,Pa,Pb,.32),holdF:{svg:`<g transform="translate(14 -52) scale(.38)">${gameBox(0,0,0,1,'ANTI-MONOPOLY','A BOARD GAME · 1973',CRIM)}</g>`}},t,7);
  g+=desk(240,1470,400,'#6a3e1e')+desk(850,1470,400,'#6a3e1e');
  let hud=tag('1970s',850,335,44,'#3a2a1e','#ffd890',{k:seg(k,0,.15)*(1-reveal),rot:3});
  if(reveal>0) hud+=`<g transform="translate(540 ${N(lerp(1000,705,reveal))}) scale(${N(lerp(.2,.74,reveal)*100)/100}) rotate(${N((1-reveal)*-20+wob(u,ka+.4,3,14,6))})"><rect x="-330" y="-330" width="660" height="660" fill="#fff6d8" opacity=".35" filter="url(#soft)"/>${magieBoard(0,0,560,{})}</g>`;
  return finish(jolt(addV(shakeV(u,kf,16,.25),shakeV(u,ka+.4,10,.2)),stage(540,z,g)+hud),t); }

/* 10 1940: maker of games; income 0 */
function sh10(t){ const u=t-S(10), kcen=cu(10,'census'), km=cu(10,'maker'), kz=cu(10,'zero');
  if(u<kz+.6){ const c=keys(u,[[0,{x:540,y:980,z:.92,oy:300+560*.92}],[km,{x:540,y:980,z:.98,oy:300+560*.98},E.io],[kz,{x:470,y:1010,z:1.3,oy:770},E.io]]);
    /* the enumerator's pen: world position of the writing point on the (slightly rotated) form */
    const F=(lx,ly)=>[540+lx+ly*.035,980+ly-lx*.035];
    const pen=keys(u,[[kcen-.45,F(560,-240)],[kcen,F(-160,-300)],[kcen+.5,F(180,-300),E.lin],[km-.2,F(-160,-150)],[km+.6,F(240,-150),E.lin],[kz-.2,F(-130,-60)],[kz+.3,F(-70,10),E.lin],[kz+.55,F(380,200)]]);
    const jit=[Math.sin(u*46)*3,Math.cos(u*39)*3];
    const g=under('#9a6236')+deskTop()+censusForm(u,kcen,km,kz)+bigArm([1380,1180],[pen[0]+jit[0]+44,pen[1]+jit[1]+66],'#e2ad84','#3a3a40','hold',`<g transform="rotate(150)"><rect x="-5" y="-6" width="10" height="96" rx="4" ${st('#22160f',2)}/><path d="M-5 -6L0 -22L5 -6Z" fill="#c8a23a" stroke="${INK}" stroke-width="2"/></g>`,.6);
    return finish(jolt(shakeV(u,kz+.3,10,.2),cam(c,g)),t); }
  const k=u-(kz+.6), z=lerp(.76,.72,seg(k,0,2.4,E.io));
  let g=parlor(u,t).replace(/#ffe9b0|#ffc870/g,'#c9a46a')+desk(620,1500,640,'#6a3e22')+tableBoard(620,1462,460);
  g+=toon('lizzieOld',330,1700,2.3,1,tween(k,.35,full({lean:4,tilt:6,expr:'neutral',look:[4,5],hF:[88,-154],handF:'open',hB:[74,-146]}),full({lean:8,tilt:13,hy:5,shrug:-5,expr:'tired',look:[4,6],hF:[96,-150],handF:'flat',hB:[80,-144]}),.6,E.io),t,5);
  return finish(stage(540,z,g),t,{grade:['#3a3a6a',.18,'multiply']}); }

const SEQ=[1,2,3,4,5,6,7,8,9,10].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9,sh10][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ let g='';
  if(t<S(2)) g+=ttl('WHO REALLY INVENTED MONOPOLY?',540,335,50,'#fffaf0',{k:seg(t,0,.15),rot:-1,sw:.14});
  if(t>=S(10)){ const u=t-S(10), k0=cu(10,'zero')+.9; g+=`<g opacity="${op(seg(u,k0,k0+.2))}"><rect y="270" width="1080" height="180" fill="${INK}" opacity=".72"/></g>`+ttl('LIZZIE MAGIE',540,362,84,MARI,{k:seg(u,k0,k0+.2),rot:-1})+ttl("PATENTED THE LANDLORD'S GAME, 1904",540,424,38,'#fffaf0',{k:seg(u,k0+.15,k0+.35),rot:-1}); }
  return g+mySubs(t); }
