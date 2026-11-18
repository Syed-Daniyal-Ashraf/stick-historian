/* ============================== shots: He Gave America the Yo-Yo. Duncan Owned the Word.  (section 13 rebuild: ic standard)
   LAYOUT (screen px 1080x1920): picture and faces in y 290-1040, ground line at screen y 1005 (GY), big captions below (letters y 1050-1175).
   Every set is painted on the canvas (paint(ctx=>...)) with the SAME camera object as cam(). Hard cuts only (painted shots).
   Every narrated shot is split by CUT_EP (end of file): part(n,u) gives {i, pu}. Poses never snap: tween()/mix() only. */
const COVER_T=1.0;
const GY=1005, FEET=GY, W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const SC=(x,z,y=1700,oy=GY)=>({x,y,z,oy});                       /* world point (x,y) lands at screen (540,oy); default: ground y 1700 at GY */
const FIN=(g,t,o={})=>finish(g,t,{boil:2.2,paper:.2,vig:.45,...o});
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="scale(${N(w/1080*1000)/1000}) translate(-540 -960)">${cam(c,inner)}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="10"/></g>`; }
const fedoraSvg=(x,y,rot,k,col='#4e4236')=>`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${N(k*100)/100})"><ellipse cx="4" cy="-30" rx="64" ry="12" fill="${col}" stroke="${INK}" stroke-width="4.5"/><path d="M-36 -32Q-40 -66 -18 -76Q4 -64 24 -76Q46 -66 42 -32Z" fill="${col}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-36 -42Q4 -50 42 -42" stroke="#1e1610" stroke-width="9" fill="none"/></g>`;
const sign=(x,y,s,rot,l1,l2,l3,c1=CRIM)=>`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${N(s*100)/100})"><path d="M-120 -120L-90 -10M120 -120L90 -10" stroke="${INK}" stroke-width="8"/><rect x="-200" y="-10" width="400" height="200" rx="10" ${st('#efe6cc',7)}/><text y="72" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="80" fill="${c1}">${l1}</text><text y="134" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="54" fill="${NAVY}">${l2}</text><text y="172" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="32" fill="#6a5e48">${l3}</text></g>`;

/* ---------- 1 HOOK: he has the toy / they have the word ---------- */
const PA={x:40,y:130,w:490,h:1400}, PB={x:550,y:130,w:490,h:1400};
const throwExt=u=>{ const c=((u+1.0)%1.9); return c<1.25?1:c<1.55?1-E.io((c-1.25)/.3):E.i((c-1.55)/.35); };
function pedroPanel(u,t){ const P0=full({hF:[46,-150],hB:[-10,-112],handF:'hold',expr:'proud',lean:2,tilt:-3,look:[5,-1]});
  const ext=throwExt(u), flick=1-ext, p={...P0,hF:[P0.hF[0]+flick*6,P0.hF[1]-flick*26],tilt:P0.tilt-flick*4}, X=350, s=2.15, hp=handPt(X,1700,s,1,p);
  return `<path d="M-600 1700H1700" stroke="${INK}" stroke-width="7"/>`+palm(900,1700,1.05,u)+toon('pedroBell',X,1700,s,1,p,t,2)+yoyo(hp[0],hp[1],u,'ext',{s:1.85,len:235,e:ext}); }
function duncanPanel(u,t,{bump=0,lean=0}={}){ const X=402, s=2.15, WX=560, WY=1450, WS=150, top=WY-WS*.72+6, gA=[458,top], gB=[624,top];
  const D=full({lean:4+lean,tilt:-3-lean,expr:lean>1?'happy':'smug',look:[4,1],hF:W2L(X,1700,s,1,gB),hB:W2L(X,1700,s,1,gA),handF:'fist',handB:'fist'});
  let g=`<path d="M-600 1700H1700" stroke="${INK}" stroke-width="7"/>`+toon('duncan',X,1700,s,1,D,t,3)+bigWord(WX,WY,WS,{reg:1,bump});
  [gA,gB].forEach(([hx,hy])=>{ g+=`<g transform="translate(${hx} ${hy})">`+[-24,-8,8,24].map(dx=>`<rect x="${dx-9}" y="-12" width="18" height="30" rx="9" fill="${TC.duncan.skin}" stroke="${INK}" stroke-width="4.5"/>`).join('')+`</g>`; });
  return g; }
const PCAM=(u)=>({x:540,y:1424,z:1.5+u*.012}), PCAMB=(u)=>({x:540,y:1424,z:1.5+u*.02});
function sh1_a(pu,u,t){ const cA=PCAM(u), cB=PCAMB(u);
  paint(ctx=>{ PNT.frame(ctx,c=>{ c.fillStyle='#20160f'; c.fillRect(0,0,1080,1920); }); pGrain(ctx,0,0,1080,1920,.5);
    paintPanel(ctx,PA,-1,x=>paintOut(x,t,cA,{groundY:1700,ground:'#d8c08a',sun:[880,820,60],top:'#5aa4dc',bot:'#fff1d0',sh:[[350,1700,170,22]]}));
    paintPanel(ctx,PB,1,x=>paintRoom(x,t,cB,{wall:'#2f5a46',stripes:.55,stripeCol:'#264a3a',floor:'#3a2c20',floorY:1700,lights:[[540,900,700,'#ffe7a8',.35]],sh:[[480,1700,260,30,.4]]})); });
  let g=panelBox(PA.x,PA.y,PA.w,PA.h,pedroPanel(u,t),cA,{rot:-1,border:TEAL,id:'h1'})+panelBox(PB.x,PB.y,PB.w,PB.h,duncanPanel(u,t),cB,{rot:1,border:CRIM,id:'h2'});
  return FIN(g,t,{vig:.3}); }
/* 1b "got America hooked on the yo-yo": a crowd of kids catches it, every yo-yo in time */
function sh1_b(pu,u,t){ const c=SC(600,lerp(.88,.94,seg(pu,0,1.3,E.io))), ky=cu(1,'yoyo');
  paint(ctx=>paintOut(ctx,t,c,{groundY:1500,ground:'#c9b48c',far:x=>{ farRoofs(x,1500,'#b9a58a',6); x.fillStyle=pA('#fff1d0',.35); x.fillRect(-900,1100,2900,400); },sh:[[300,1700,150,22],[650,1700,90,16],[860,1700,90,16],[1070,1700,90,16]]}));
  const P0=full({hF:[46,-150],hB:[-10,-112],handF:'hold',expr:'proud',lean:2,tilt:-3,look:[5,-1]}), ext=throwExt(u+.4), flick=1-ext, pp={...P0,hF:[46+flick*6,-150-flick*26]};
  let g=`<path d="M-600 1500H1700" stroke="${INK}" stroke-width="6" opacity=".6"/>`, X=300, s=1.85, hp=handPt(X,1700,s,1,pp);
  g+=toon('pedroBell',X,1700,s,1,pp,t,2)+yoyo(hp[0],hp[1],u,'ext',{s:1.6,len:200,e:ext});
  [['kidD',650,1.25],['kidA',860,1.3],['kidB',1070,1.25]].forEach(([w,kx,ks],i)=>{ const k=seg(pu,i*.12,i*.12+.3,E.back); if(k<=0) return;
    const kp=full({hF:[28,-112],hB:[-10,-118],handF:'hold',expr:pu>ky-cu(1,'hooked')+.1?'joy':'awe',look:[-4,1],lean:3,tilt:-4}), kh=handPt(kx,1700,ks,-1,kp);
    g+=toon(w,kx,1700,ks*k,-1,kp,t,20+i)+yoyo(kh[0],kh[1],u,'bob',{s:1.1*k,len:120,per:.75,ph:0}); });
  return FIN(cam(c,g),t); }
/* 1c "An American company ended up owning the word": Duncan hugs the giant word; the (R) bumps on "word" */
function sh1_c(pu,u,t){ const kw=cu(1,'word'), ko=cu(1,'owning'), c=SC(520,lerp(1.0,1.05,seg(pu,0,3.2,E.io)));
  const X=500, s=1.75, WX=600, WY=1500, WS=170, top=WY-WS*.72+6, gA=[540,top], gB=[680,top], bump=Math.max(0,wob(u,kw,1,18,6)), hug=seg(u,ko-.1,ko+.3,E.io);
  paint(ctx=>paintRoom(ctx,t,c,{wall:'#5c4430',wain:'#3e2a1a',wainY:1180,floor:'#3a2a1e',floorY:1700,planks:90,lights:[[560,820,640,'#ffe2a0',.55],[560,1500+0*u,300,'#ffd23a',.18+.25*seg(u,kw-.05,kw+.2)*(1-seg(u,kw+.3,kw+1))]],sh:[[580,1700,330,34,.45]]}));
  const D0=full({lean:4,tilt:-3,expr:'smug',look:[4,1],hF:W2L(X,1700,s,1,gB),hB:W2L(X,1700,s,1,gA),handF:'fist',handB:'fist'}), D1=full({...D0,lean:9,tilt:-9,expr:'happy',look:[3,-2],hy:6});
  let g=`<path d="M-600 1180H1700M-600 1700H1700" stroke="${INK}" stroke-width="6"/>`+toon('duncan',X,1700,s,1,tween(u,ko-.05,D0,D1,.35),t,3)+bigWord(WX,WY,WS,{reg:1,bump});
  [gA,gB].forEach(([hx,hy])=>{ g+=`<g transform="translate(${hx} ${hy+hug*4})">`+[-24,-8,8,24].map(dx=>`<rect x="${dx-9}" y="-12" width="18" height="30" rx="9" fill="${TC.duncan.skin}" stroke="${INK}" stroke-width="4.5"/>`).join('')+`</g>`; });
  return FIN(jolt(shakeV(u,kw,12,.25),cam(c,g)),t); }
function sh1(t){ const u=t-S(1), P=part(1,u); return [sh1_a,sh1_b,sh1_c][P.i](P.pu,u,t); }

/* ---------- 2 HOTEL -> PHILIPPINES -> THE LOOP -> IT SLEEPS ---------- */
function sh2_a(pu,u,t){ const kh=cu(2,'hotel'), c=SC(480,lerp(.85,.89,seg(pu,0,2.7,E.io)));
  paint(ctx=>paintLobby(ctx,t,c,{sh:[[400,1700,170,24]]}));
  const stack={svg:`<g transform="rotate(${N(Math.sin(u*4.6)*3+wob(u,.1,8,9,.5))})">${suitcase(0,0,120,70,'#8a4a2a')}${suitcase(0,-70,100,60,'#2c5e8a',3)}${suitcase(0,-130,84,52,'#c8572e',-4)}${suitcase(0,-182,60,40,'#5f8f3a',5)}</g>`};
  const L0=full({lean:-6,tilt:4,hF:[66,-140],hB:[52,-176],handF:'hold',handB:'open',expr:'tired',look:[4,-3]}), L1=full({...L0,lean:-2,tilt:-10,expr:'hopeful',look:[-3,-6]});
  const g=lobbySvg(u)+toon('pedroBell',400,1700,2.0,1,{...tween(u,kh-.3,L0,L1,.35),holdF:stack},t,2);
  return FIN(cam(c,g)+tag('HOTEL',760,360,52,'#7a1f2a','#ffe9a8',{k:seg(u,kh-.1,kh+.1,E.back),rot:-3}),t); }
function sh2_b(pu,u,t){ const c=SC(520,lerp(.86,.93,seg(pu,0,2,E.io)));
  paint(ctx=>paintOut(ctx,t,c,{groundY:1380,ground:'#8cbf5a',top:'#4f9ed8',mid:'#a8dcef',bot:'#fff0c8',sun:[860,560,70],far:x=>{ farHills(x,1300,'#6f9f68',90,3); farHills(x,1380,'#7fb064',50,7); },sh:[[190,1700,90,16],[470,1700,90,16],[830,1700,90,16]]}));
  const kA=full({hF:[44,-114],hB:[-10,-118],handF:'hold',expr:'joy',lean:3}), kB=full({hF:[30,-114],handF:'hold',expr:'happy',lean:5,hB:[-8,-118]}), kC=full({hF:[44,-114],hB:[-10,-118],handF:'hold',expr:'happy',lean:3});
  let g=yardSvg(u)+toon('phA',190,1700,1.6,1,kA,t,21)+toon('phB',450,1700,1.6,1,kB,t,22)+toon('phC',830,1700,1.6,-1,kC,t,23);
  const a=handPt(190,1700,1.6,1,kA), b=handPt(450,1700,1.6,1,kB), d=handPt(830,1700,1.6,-1,kC);
  g+=yoyo(a[0],a[1],u,'bob',{s:1.1,len:140,per:.8})+yoyo(d[0],d[1],u,'bob',{s:1.1,len:140,per:.7,ph:.4})+yoyo(b[0],b[1],u,'walk',{s:1.1,wx:450+110+Math.sin(u*2.4)*40,gy:1698,len:140});
  return FIN(cam(c,g),t); }
function sh2_c(pu,u,t){ const kl=cu(2,'looped'), kz=cu(2,'sleep'), kk=u-kl, ring=seg(kk,0,.55,E.o), knot=1-seg(kk,.1,.4,E.i), HY=300, LEN=440, S3=3.4, cy=HY+LEN;
  paint(ctx=>PNT.frame(ctx,x=>{ x.fillStyle='#e6d4a8'; x.fillRect(0,0,1080,1920); PNT.glow(x,540,cy,620,'#fff6dc',.9); PNT.glow(x,540,cy,260,'#ffffff',.35); pGrain(x,0,0,1080,1920,.6); }));
  const awake=u>kl+.42; let g=yoyo(540,HY,u,'sleep',{s:S3,len:LEN,spin:awake?u*2.8:.12,fast:awake,cap:seg(u,kz+.05,kz+.25),zzz:seg(u,kz+.15,kz+.4)});
  if(knot>0.02) g+=`<g transform="translate(540 ${cy-6}) scale(${N(knot*100)/100})"><circle r="30" fill="${YO_STR}" stroke="${INK}" stroke-width="6"/><path d="M-14 -4Q0 8 14 -4" fill="none" stroke="${INK}" stroke-width="4"/></g>`;
  if(ring>0&&ring<1.001){ const ry=lerp(HY+60,cy-8,ring); g+=`<ellipse cx="540" cy="${N(ry)}" rx="${N(lerp(30,60,ring))}" ry="${N(lerp(14,26,ring))}" fill="none" stroke="${INK}" stroke-width="13"/><ellipse cx="540" cy="${N(ry)}" rx="${N(lerp(30,60,ring))}" ry="${N(lerp(14,26,ring))}" fill="none" stroke="${YO_STR}" stroke-width="6"/>`; }
  return FIN(g,t,{vig:.6}); }
function sh2(t){ const u=t-S(2), P=part(2,u); return [sh2_a,sh2_b,sh2_c][P.i](P.pu,u,t); }

/* ---------- 3 HIS OWN COMPANY -> THREE FACTORIES ---------- */
function sh3_a(pu,u,t){ const kn=cu(3,'nineteen'), c=SC(540,lerp(.9,.95,seg(pu,0,2.3,E.io))), a=u*7;
  paint(ctx=>paintRoom(ctx,t,c,{wall:'#a8794a',floor:'#5a3a22',floorY:1500,lights:[[150,560,560,'#fff1c8',.5]],shafts:{x:150,y:330,angle:62,spread:18,n:4,len:1300,alpha:.18,motes:28,seed:4},sh:[[380,1700,160,22],[645,1700,190,22]]}));
  let g=`<path d="M-600 1500H1700" stroke="${INK}" stroke-width="6"/><rect x="60" y="360" width="200" height="300" rx="6" fill="#fff4d6" stroke="${INK}" stroke-width="7" opacity=".85"/><path d="M160 360V660M60 510H260" stroke="#7a4a28" stroke-width="10"/>`;
  const wc=[640,1300], cr=[556+Math.cos(a)*20,1322+Math.sin(a)*20];
  g+=`<rect x="480" y="1440" width="330" height="40" rx="6" ${st('#9a6a3c',6)}/><path d="M510 1480V1700M780 1480V1700" stroke="${INK}" stroke-width="16"/><path d="M510 1480V1700M780 1480V1700" stroke="#7a4a28" stroke-width="8"/><path d="M${wc[0]} ${wc[1]}V1440" stroke="${INK}" stroke-width="16"/><path d="M${wc[0]} ${wc[1]}V1440" stroke="#7a7a82" stroke-width="8"/>`;
  g+=`<g transform="translate(${wc[0]} ${wc[1]}) scale(2.1)">${yoyoBody(a/6.283,YO_RED,true)}</g>`;
  for(let i=0;i<6;i++){ const th=a*2+i*1.05; g+=`<path d="M${N(wc[0]+Math.cos(th)*96)} ${N(wc[1]+Math.sin(th)*96)}l${N(Math.cos(th)*26)} ${N(Math.sin(th)*26)}" stroke="#ffe9a8" stroke-width="5" stroke-linecap="round"/>`; }
  g+=toon('pedroSuit',380,1700,2.05,1,{...full({lean:7,tilt:6,hF:W2L(380,1700,2.05,1,cr),handF:'fist',hB:[40,-130],handB:'open',expr:'determined',look:[5,2]}),cos:{top:'#d9cfa8',topDk:'#bfb58c'}},t,2);
  const sk=seg(u,kn-.05,kn+.35,E.back), sw=wob(u,kn+.3,6,9,3);
  g+=sign(820,lerp(300,1050,sk),.82,sw-2,'YO-YO','MFG. CO.','SANTA BARBARA · 1928');
  return FIN(cam(c,g),t); }
function sh3_b(pu,u,t){ const kt=cu(3,'own')+.1, z=lerp(1.5,.85,seg(pu,0,.5,E.o)), c=SC(540,z), pop=i=>seg(u,kt+i*.2,kt+i*.2+.35,E.back);
  paint(ctx=>paintOut(ctx,t,c,{groundY:1560,ground:'#8cbf5a',sun:[260,560,64],far:x=>farHills(x,1520,'#a9c98a',50,4),sh:[[120,1700,240,26],[540,1700,280,28],[960,1700,240,26]]}));
  let g=`<path d="M-600 1560H1700" stroke="${INK}" stroke-width="5" opacity=".5"/>`;
  [[120,1.5,0],[960,1.5,2],[540,1.75,1]].forEach(([x,s,i])=>{ g+=factory(x,1700,s,pop(i),u,i); });
  [0,1,2].forEach(i=>{ g+=impact([120,540,960][i],1440,seg(u,kt+i*.2,kt+i*.2+.5),2.6); });
  g+=conveyor(1690,u);
  return FIN(jolt(addV(shakeV(u,kt,12,.25),shakeV(u,kt+.2,12,.25),shakeV(u,kt+.4,12,.25)),cam(c,g)),t); }
function sh3(t){ const u=t-S(3), P=part(3,u); return [sh3_a,sh3_b][P.i](P.pu,u,t); }

/* ---------- 4 TRADEMARKED -> REJECTED ---------- */
function patentSvg(){ return `<path d="M-600 1000H1700M-600 1300H1700" stroke="${INK}" stroke-width="6"/><rect x="520" y="300" width="520" height="640" rx="10" fill="none" stroke="${INK}" stroke-width="9"/><path d="M780 300V940M520 620H1040" stroke="#8a6a3a" stroke-width="10"/><g transform="translate(160 640)"><rect x="-90" y="-210" width="180" height="420" ${st('#e8dcc0',6)}/><circle cy="-60" r="62" fill="#e8c34a" stroke="${INK}" stroke-width="5"/><path d="M0 -60V-100M0 -60L28 -48" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`; }
const paintPatent=(ctx,t,c,sh=[])=>paintRoom(ctx,t,c,{wall:'#6e8a68',stripes:.35,stripeCol:'#5f7a5a',wain:'#7a5a3a',wainY:1000,floorY:1300,floor:'#5a4a3a',lights:[[780,620,700,'#fff6dc',.55]],shafts:{x:780,y:320,angle:100,spread:16,n:4,len:1200,alpha:.14,motes:20,seed:6},sh});
const exPose=(u,kf,kj,look)=>{ const up=seg(u,kj-.35,kj-.05,E.o), hit=seg(u,kj-.05,kj,E.i), down=Math.max(seg(u,kf-.25,kf-.02,E.i)*(1-seg(u,kf+.02,kf+.3,E.o)),hit*(1-seg(u,kj+.05,kj+.35,E.o)));
  return full({lean:12,tilt:look*-6,expr:look>.5?'confused':'stern',look:[-5*look,-5*look],hF:mix(mix([34,-130],[44,-236],Math.max(seg(u,kf-.5,kf-.25,E.o)*(1-seg(u,kf-.25,kf-.02)),up*(1-hit))),[52,-182],down),hB:[20,-120],handF:'hold'}); };
function sh4_a(pu,u,t){ const kf=cu(4,'flores'), kj=cu(4,'rejected'), c=SC(470,lerp(.86,.9,seg(pu,0,2.2,E.io))), stampK=seg(u,kf,kf+.1), cs=seg(u,.15,1.0,E.io);
  paint(ctx=>paintPatent(ctx,t,c,[[190,1700,160,22]]));
  let g=patentSvg()+toon('examiner',560,1560,1.9,1,{...exPose(u,kf,kj,0),holdF:{svg:stampProp(CRIM),rot:0}},t,9)+counterFront();
  g+=certificate(lerp(420,610,cs),1250,.8,0,{stamp:stampK,ss:58});
  const P0=full({lean:2,expr:'proud',look:[5,-1],hF:[60,-176],hB:[-10,-112],handF:'open'}), P1=full({lean:-3,tilt:-5,expr:'proud',look:[5,-4],hF:[66,-232],hB:[40,-150],handF:'point'});
  g+=toon('pedroSuit',190,1700,2.0,1,tween(u,kf+.3,P0,P1,.4),t,2);
  return FIN(jolt(shakeV(u,kf,8,.2),cam(c,g)),t); }
function sh4_b(pu,u,t){ const kf=cu(4,'flores'), kd=cu(4,'donald'), kj=cu(4,'rejected'), c=SC(720,lerp(.9,.94,seg(pu,0,3,E.io)));
  paint(ctx=>paintPatent(ctx,t,c,[[925,1700,150,22]]));
  const fs=seg(u,kd-.2,kd+.55,E.io), look=seg(u,kd+.5,kd+.8)*(1-seg(u,kj-.5,kj-.3));
  let g=patentSvg()+certificate(385,1100,.6,-3,{stamp:1,ss:58});
  g+=toon('examiner',560,1560,1.9,1,{...exPose(u,kf,kj,look),holdF:{svg:stampProp(CRIM),rot:0}},t,9)+counterFront();
  const D0=full({lean:3,tilt:-3,expr:'smug',look:[-5,0],hF:[56,-176],hB:[-10,-112],handF:'flat'}), D1=full({lean:-6,tilt:8,expr:'angry',look:[-5,-1],hF:[64,-196],hB:[50,-168],handF:'fist',handB:'fist'});
  const dw=strut(u,1330,925,kd-1.25,kd-.25,1.9,120,.25), DW={...full(dw.p),hF:[dw.p.hF[0]*.5+8,-116],hB:[dw.p.hB[0]*.5-4,-118],lean:dw.moving?7:3,tilt:-3,expr:'smug',look:[-5,0]};
  const dp=u<kd-.2?(dw.moving?DW:mix(DW,D0,seg(u,kd-.25,kd-.2))):tween(u,kd+.1,D0,D1,.3);
  g+=toon('duncan',u<kd-.2?dw.x:925,1700,1.9,-1,dp,t,3)+formYoYo(lerp(1060,700,fs),1262,.6,2,{rej:0});
  return FIN(cam(c,g),t); }
function sh4_c(pu,u,t){ const kf=cu(4,'flores'), kj=cu(4,'rejected'), c=SC(690,1.5,1330,1005), rej=seg(u,kj,kj+.1), hatK=seg(u,kj+.05,kj+.95,E.lin);
  paint(ctx=>paintPatent(ctx,t,c));
  let g=patentSvg()+toon('examiner',560,1560,1.9,1,{...exPose(u,kf,kj,0),holdF:{svg:stampProp(CRIM),rot:0}},t,9)+counterFront()+formYoYo(700,1262,.6,2,{rej});
  const D=tween(u,kj+.05,full({lean:-6,tilt:8,expr:'angry',look:[-5,-1],hF:[64,-196],hB:[50,-168],handF:'fist',handB:'fist'}),full({lean:-14,tilt:10,expr:'shock',look:[-5,-1],hF:[64,-196],hB:[50,-168],handF:'fist',handB:'fist'}),.35);
  g+=toon('duncan',925,1700,1.9,-1,{...D,cos:u>=kj+.03&&u<kj+.95?{cap:''}:{}},t,3);
  if(u>=kj+.03&&u<kj+.95) g+=`<g transform="translate(0 ${N(-4*260*hatK*(1-hatK))})">${fedoraSvg(907,1700-290*1.9+10-30,N(hatK*280),2.1)}</g>`;
  return FIN(jolt(shakeV(u,kj,18,.3),cam(c,g)+(rej>0?`<g transform="translate(540 800) rotate(-7)" opacity="${op(rej*3)}"><rect x="-300" y="-82" width="600" height="164" rx="10" ${st('#f4ecd4',6)}/></g>`:'')+stampMark(540,800,['REJECTED'],'#d0281e',rej,-7,100)),t); }
function sh4(t){ const u=t-S(4), P=part(4,u); return [sh4_a,sh4_b,sh4_c][P.i](P.pu,u,t); }

/* ---------- 5 BOUGHT OUT: the money, the name, the sash ---------- */
const paintOffice=(ctx,t,c,sh=[])=>paintRoom(ctx,t,c,{wall:'#6a4a2e',wain:'#4e3420',wainY:1160,floor:'#3a2a1e',floorY:1300,planks:90,lights:[[250,440,620,'#cfe0ff',.35],[700,900,700,'#ffd890',.3]],sh});
function nameSign(roll){ const rx=lerp(-230,230,roll); let g=`<path d="M-130 -210V-100M130 -210V-100" stroke="${INK}" stroke-width="7"/><rect x="-260" y="-110" width="520" height="290" rx="12" ${st('#efe6cc',8)}/>`;
  g+=`<clipPath id="oldn"><rect x="${N(rx)}" y="-110" width="520" height="200"/></clipPath><clipPath id="newn"><rect x="-260" y="-110" width="${N(rx+260)}" height="200"/></clipPath>`;
  g+=`<g clip-path="url(#oldn)"><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="104" fill="${CRIM}">FLORES</text></g><g clip-path="url(#newn)"><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="104" fill="#3f6a4a">DUNCAN</text></g><text y="92" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="84" fill="${NAVY}">YO-YO</text>`;
  if(roll>0&&roll<1) g+=`<g transform="translate(${N(rx)} -10)"><rect x="-26" y="-92" width="52" height="150" rx="14" ${st('#e8c34a',6)}/><path d="M0 58V120" stroke="${INK}" stroke-width="10"/></g>`;
  return g; }
const officeSvg=()=>`<path d="M-600 1160H1700M-600 1300H1700" stroke="${INK}" stroke-width="6"/><rect x="120" y="260" width="260" height="360" rx="8" fill="#9ec0e0" stroke="${INK}" stroke-width="8" opacity=".9"/><path d="M250 260V620M120 440H380" stroke="#5a3a26" stroke-width="10"/>`;
function sh5_a(pu,u,t){ const kb=cu(5,'bought'), c=SC(540,lerp(.86,.9,seg(pu,0,1.5,E.io))), give=seg(u,kb-.25,kb+.45,E.io), bx=lerp(660,520,give);
  paint(ctx=>paintOffice(ctx,t,c,[[270,1700,150,22],[560,1520,380,30,.3]]));
  let g=officeSvg()+`<g transform="translate(560 1020) scale(.5)">${nameSign(0)}</g>`;
  const exe=full({lean:-6,tilt:-3,expr:'smug',look:[-4,2],hF:W2L(790,1640,1.9,-1,[bx+70,1262]),handF:'hold',hB:[30,-130]});
  g+=toon('duncan',790,1640,1.9,-1,tween(u,kb-.3,full({lean:2,expr:'smug',look:[-4,0],hF:[40,-150],hB:[30,-130]}),exe,.3),t,3)+desk(560,1500,700,'#5a3a22')+moneyBag(bx,1272,1.1,give*-6);
  g+=toon('pedroSuit',270,1700,2.0,1,tween(u,kb+.15,full({lean:2,expr:'hopeful',look:[5,1],hF:[30,-120],hB:[-12,-114]}),full({lean:8,tilt:10,expr:'sad',look:[4,5],hF:[60,-140],hB:[30,-130],handF:'open'}),.4),t,2);
  return FIN(jolt(shakeV(u,kb+.35,10,.2),cam(c,g)),t); }
function sh5_b(pu,u,t){ const kn=cu(5,'name'), roll=seg(u,cu(5,'company')-.05,kn+.1,E.io), c=SC(560,lerp(2.5,2.62,seg(pu,0,1.3,E.io)),1040,640);
  paint(ctx=>paintOffice(ctx,t,c));
  return FIN(jolt(shakeV(u,kn+.12,8,.2),cam(c,officeSvg()+`<g transform="translate(560 1020) scale(.5)">${nameSign(roll)}</g>`)),t); }
function streetSvg(){ return `<path d="M-600 1450H1700" stroke="${INK}" stroke-width="7"/>`+[0,1,2,3,4,5,6].map(i=>`<path d="M${-300+i*300} 1450L${-420+i*320} 2300" stroke="#7a7a80" stroke-width="5"/>`).join('')+`<path d="M1100 1450V420" stroke="${INK}" stroke-width="22"/><path d="M1100 1450V420" stroke="#3a3a40" stroke-width="12"/><path d="M1050 420H1150L1130 360H1070Z" ${st('#3a3a40',5)}/>`; }
function paintStreet(ctx,t,c,sh=[]){ ctx.save(); camCtx(ctx,c); paintBrick(ctx,-900,-900,2000,1450,{seed:4}); PNT.glow(ctx,1100,440,420,'#ffe7a0',.35); PNT.glow(ctx,300,500,800,'#fff4dc',.25);
  const g=ctx.createLinearGradient(0,1450,0,2400); g.addColorStop(0,'#a8a8ae'); g.addColorStop(1,'#77777e'); ctx.fillStyle=g; ctx.fillRect(-900,1450,2900,1600); pGrain(ctx,-900,1450,2900,1600,.5); PNT.band(ctx,1450,30,'#000000',.2);
  sh.forEach(([x,y,rx,ry,a])=>PNT.shadow(ctx,x,y,rx,ry,a==null?.35:a)); ctx.restore(); }
const sash=(X,s)=>`<g transform="translate(${X} 1700) scale(${s} ${s})"><path d="M-22 -224L30 -146" stroke="${INK}" stroke-width="27" stroke-linecap="round"/><path d="M-22 -224L30 -146" stroke="#3f6a4a" stroke-width="19" stroke-linecap="round"/><text transform="translate(-12 -204) rotate(56)" font-family="${BAL}" font-weight="800" font-size="12" fill="#ffe9a8" letter-spacing="1">DUNCAN</text></g>`;
function sh5_c(pu,u,t){ const kk=cu(5,'kids'), kp=cu(5,'pedro'), c=SC(560,lerp(.85,.89,seg(pu,0,2.2,E.io))), X=330, s=2.0, wx=lerp(540,600,E.io(sat((u-(kk-.7))/1.2)));
  paint(ctx=>paintStreet(ctx,t,c,[[330,1700,150,22],[730,1700,90,16],[990,1700,90,16]]));
  const hand=keys(u,[[kp-.05,[50,-122]],[kk-.7,[56,-120],E.io],[kk+.3,[58,-118],E.io],[kk+2,[58,-118]]]), pp=full({lean:8,tilt:2,expr:'happy',look:[5,3],hF:hand,hB:[-14,-114],handF:'hold'}), hp=handPt(X,1700,s,1,pp);
  let g=streetSvg();
  [['kidA',730,1.45],['kidC',990,1.45]].forEach(([w,x,ks],i)=>{ g+=toon(w,x,1700,ks,-1,full({lean:3,tilt:Math.sin(u*3+i)*4,hF:[40,-112],hB:[-10,-118],expr:'awe',look:[-4,1],handF:'open'}),t,30+i); });
  g+=toon('pedroSash',X,1700,s,1,pp,t,2)+sash(X,s)+yoyo(hp[0],hp[1],u,'walk',{s:1.4,wx,gy:1698,len:200});
  return FIN(cam(c,g),t); }
function sh5_d(pu,u,t){ const kd2=cu(5,'with')+.22, c=SC(600,1.3,1350,860), X=380, s=2.0;
  paint(ctx=>paintStreet(ctx,t,c,[[380,1700,150,22],[860,1700,90,16]]));
  const P0=full({lean:8,tilt:2,expr:'happy',look:[5,3],hF:[58,-118],hB:[-14,-114],handF:'hold'}), P1=full({...P0,expr:'determined',tilt:6,lean:5,look:[6,-2]});
  const pp=tween(u,kd2+.1,P0,P1,.35), hp=handPt(X,1700,s,1,pp), raise=seg(u,kd2-.05,kd2+.3,E.back);
  const cardP=full({lean:3,expr:'proud',look:[-4,-1],hF:mix([40,-112],[38,-300],raise),hB:[-10,-118],handF:'hold'});
  let g=streetSvg()+toon('kidC',860,1700,1.45,-1,{...cardP,holdF:{svg:`<g transform="translate(-6 -70) rotate(-8) scale(-1 1)"><rect x="-80" y="-50" width="160" height="100" rx="6" ${st('#fbf6ea',5)}/><text y="14" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="36" fill="#3f6a4a">DUNCAN</text></g>`}},t,32);
  g+=toon('pedroSash',X,1700,s,1,pp,t,2)+sash(X,s)+yoyo(hp[0],hp[1],u,'sleep',{s:1.4,len:200,ph:.2});
  return FIN(cam(c,g),t); }
function sh5(t){ const u=t-S(5), P=part(5,u); return [sh5_a,sh5_b,sh5_c,sh5_d][P.i](P.pu,u,t); }

/* ---------- 6 DECADES LATER: calendar, court, the (R) cracks ---------- */
const paintCourt=(ctx,t,c,sh=[])=>paintRoom(ctx,t,c,{wall:'#a8662e',wain:'#6a3e1e',wainY:1140,floor:'#5a3a22',floorY:1380,planks:90,lights:[[540,560,760,'#ffe2a8',.45]],shafts:{x:880,y:250,angle:115,spread:16,n:4,len:1300,alpha:.13,motes:24,seed:8},sh});
const courtSvg=()=>`<path d="M-600 1140H1700M-600 1380H1700" stroke="${INK}" stroke-width="6"/>`;
function sh6_a(pu,u,t){ const c=SC(540,.9), yr=Math.round(lerp(1932,1965,seg(u,.1,1.2,E.io))), gr=lerp(.1,.9,seg(u,.1,1.25,E.io));
  paint(ctx=>paintRoom(ctx,t,c,{wall:'#c9b48a',stripes:.4,stripeCol:'#b9a070',floor:'#5a4a3a',floorY:1560,lights:[[700,1130,520,'#fff6dc',.5]],sh:[[270,1700,150,22]]}));
  let g=`<path d="M-600 1560H1700" stroke="${INK}" stroke-width="6"/><g transform="translate(720 1150) rotate(-3) scale(.85)"><rect x="-190" y="-250" width="380" height="460" rx="12" ${st('#fbf6ea',8)}/><rect x="-190" y="-250" width="380" height="110" rx="12" ${st(CRIM,8)}/><text y="52" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="150" fill="${INK}">${yr}</text></g>`;
  for(let i=0;i<7;i++){ const k=((u*3.2+i/7)%1); g+=`<g transform="translate(${N(720+Math.sin(i*2.1)*170)} ${N(1000-k*480)}) rotate(${N(k*260*(i%2?1:-1))})" opacity="${N((1-k)*100)/100}"><rect x="-60" y="-70" width="120" height="140" ${st('#f4ecd4',5)}/></g>`; }
  g+=toon('duncan',270,1700,1.9,1,full({lean:0,expr:'smug',look:[4,0],hF:[40,-130],hB:[-8,-120],cos:{grey:gr}}),t,3);
  return FIN(cam(c,g),t); }
const D_PT=full({lean:6,tilt:-5,expr:'angry',look:[5,-1],hF:[100,-210],hB:[-14,-150],handF:'point',cos:{grey:.9}}), D_SLUMP=full({lean:-9,tilt:12,hy:8,shrug:-8,expr:'shock',look:[3,-5],hF:[34,-128],hB:[-16,-118],handF:'open',cos:{grey:.9}});
function sh6_b(pu,u,t){ const kr=cu(6,'rival'), c=SC(560,lerp(.85,.9,seg(pu,0,1.5,E.io)));
  paint(ctx=>paintCourt(ctx,t,c,[[250,1700,150,22],[860,1700,150,22]]));
  let g=courtSvg()+`<g transform="translate(560 1140)">`+`<rect x="-260" y="-40" width="520" height="40" rx="6" ${st('#8a5630',6)}/><rect x="-240" y="0" width="480" height="240" ${st('#6a3e1e',6)}/></g>`;
  g+=toon('duncan',250,1700,1.9,1,tween(u,kr-.3,full({lean:2,expr:'determined',look:[4,0],hF:[40,-130],hB:[-8,-120],cos:{grey:.9}}),D_PT,.3),t,3);
  g+=toon('rival',860,1700,1.9,-1,tween(u,kr-.5,full({lean:0,expr:'neutral',look:[-4,0],hF:[48,-176],hB:[24,-150],handF:'hold'}),full({lean:-2,expr:'smug',look:[-4,0],hF:[48,-176],hB:[24,-150],handF:'hold'}),.4),t,6);
  g+=`<g transform="translate(${N(860-48*1.9)} ${N(1700-176*1.9)})">${royalBox(-10,-70,-4,.55)}</g>`;
  return FIN(cam(c,g)+`<g transform="translate(560 420)" opacity="${op(seg(pu,0,.15)*3)}">${bigWord(0,0,108,{reg:1})}</g>`,t); }
function sh6_c(pu,u,t){ const kl=cu(6,'lost'), c=SC(430,1.35,1300,820);
  paint(ctx=>paintCourt(ctx,t,c,[[250,1700,150,22]]));
  let g=courtSvg()+toon('duncan',250,1700,1.9,1,tween(u,kl+.02,D_PT,D_SLUMP,.35),t,3);
  const word=bigWord(0,0,112,{reg:1,crack:seg(u,kl-.02,kl+.6,E.o)});
  return FIN(jolt(shakeV(u,kl,16,.3),cam(c,g)+`<g transform="translate(650 430)">${word}</g>`),t); }
function sh6(t){ const u=t-S(6), P=part(6,u); return [sh6_a,sh6_b,sh6_c][P.i](P.pu,u,t); }

/* ---------- 7 THE RULING: the letters go back where they came from ---------- */
function sh7_a(pu,u,t){ const ky=cu(7,'yoyo'), kp=cu(7,'philippine'), c={x:600,y:1050,z:lerp(1.0,1.06,seg(pu,0,2.6,E.io)),oy:700};
  paint(ctx=>paintCourt(ctx,t,c));
  let g=courtSvg()+`<g transform="translate(275 960)"><path d="M-90 -170L-130 160M90 -170L130 160" stroke="${INK}" stroke-width="14"/><rect x="-150" y="-190" width="300" height="190" rx="8" ${st('#fbf6ea',7)}/></g>`;
  const lift=[0,1,2,3,4].map(i=>i===2?0:seg(u,kp+.05+i*.04,kp+.7+i*.04,E.io));
  const J0=full({lean:2,expr:'stern',look:[0,3],hF:[40,-190],hB:[-30,-230],handF:'hold',noShadow:true}), J1=full({lean:3,tilt:-4,expr:'stern',look:[-4,-1],hF:[84,-158],hB:[-30,-230],handF:'hold'});
  const jp=tween(u,ky-.3,J0,J1,.35), jh=handPt(600,1420,2.0,1,jp);
  g+=toon('judge',600,1420,2.0,1,{...jp,noShadow:true},t,9)+`<rect x="405" y="1040" width="420" height="36" rx="6" ${st('#8a5630',6)}/><rect x="425" y="1076" width="380" height="330" ${st('#6a3e1e',6)}/><rect x="465" y="1116" width="300" height="200" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/>`;
  g+=yoyo(jh[0],jh[1],u,'sleep',{s:1.1,len:90,ph:.3,spin:u*2.4,fast:true});
  ['Y','O','-','Y','O'].forEach((ch,i)=>{ const L=lift[i], sx=171+i*52, x=sx+L*(70+i*46), y=890-L*170+Math.sin(u*4+i)*8*L;
    g+=`<g transform="translate(${N(x)} ${N(y)}) rotate(${N((i*17-34)*L)})"><text text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(lerp(58,96,L))}" fill="#ffd23a" stroke="${INK}" stroke-width="6" paint-order="stroke fill">${ch}</text></g>`; });
  return FIN(cam(c,g),t); }
function sh7_b(pu,u,t){ const ko=cu(7,'own'), ck=seg(u,ko-.1,ko+.4,E.back), c={x:540,y:960,z:1,oy:960}, WIN=[150,330,780,700];
  paint(ctx=>{ paintCourt(ctx,t,{x:540,y:1250,z:1,oy:1005}); ctx.save(); ctx.beginPath(); ctx.rect(WIN[0],WIN[1],WIN[2],WIN[3]); ctx.clip(); paintOut(ctx,t,c,{groundY:880,ground:'#8cbf5a',sun:[760,470,56],far:x=>farRoofs(x,880,'#b8c6a0',9)}); ctx.restore(); });
  let g=''; const kids=[['kidA',400,1.65],['kidB',690,1.65]];
  kids.forEach(([w,x,ks],i)=>{ g+=toon(w,x,1240,ks,i?-1:1,full({hF:mix([40,-112],[50,-240],ck),hB:mix([-6,-118],[-20,-230],ck),handF:'open',handB:'open',expr:ck>.5?'joy':'awe',look:[i?-3:3,-4]}),t,41+i); });
  g+=`<rect x="${WIN[0]-30}" y="${WIN[1]+WIN[3]}" width="${WIN[2]+60}" height="60" rx="6" ${st('#8a5630',7)}/><rect x="${WIN[0]}" y="${WIN[1]}" width="${WIN[2]}" height="${WIN[3]}" fill="none" stroke="${INK}" stroke-width="22"/><rect x="${WIN[0]}" y="${WIN[1]}" width="${WIN[2]}" height="${WIN[3]}" fill="none" stroke="#a87a48" stroke-width="12"/><path d="M${WIN[0]+WIN[2]/2} ${WIN[1]}V${WIN[1]+WIN[3]}" stroke="#a87a48" stroke-width="12"/><rect x="-100" y="${WIN[1]+WIN[3]+60}" width="1280" height="1000" fill="#6a3e1e"/>`;
  ['Y','O','Y','O'].forEach((ch,i)=>{ const O=seg(u,ko-.4+i*.06,ko+.35+i*.06,E.io), x=lerp(150+i*55,330+i*130,O), y=lerp(560+i*20,470-(i%2)*40,O)-Math.sin(Math.PI*O)*120+Math.sin(u*5+i)*8;
    g+=`<g transform="translate(${N(x)} ${N(y)}) rotate(${N((1-O)*(i*40-60))})" opacity="${op(seg(pu,0,.25)*2+O*2)}"><text text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="104" fill="#ffd23a" stroke="${INK}" stroke-width="7" paint-order="stroke fill">${ch}</text></g>`; });
  return FIN(g,t); }
function sh7(t){ const u=t-S(7), P=part(7,u); return [sh7_a,sh7_b][P.i](P.pu,u,t); }

/* ---------- 8 THE EVIDENCE: Duncan's own 1931 filing ---------- */
const paintDesk=(ctx,t)=>PNT.frame(ctx,x=>{ PNT.wood(x,[0,0,1080,1920],{tone:'#8a5a32',sc:1.2,rot:0,light:[540,300,540,1500,.35]}); PNT.glow(x,300,250,900,'#fff1c8',.35); });
function filing(u,ke,ko,slideY,zoom,rot){ const hl=seg(u,ko-.1,ko+.4,E.io), L=['“…the applicant understands','the term ‘Yo-Yo’ is used in','the Philippine Islands…”'], FF='Fell, '+BAL, h0=tW('the ',50,FF,400), hw=tW('Philippine Islands',50,FF,400);
  let g=`<g transform="translate(540 ${N(slideY)}) scale(${N(zoom*100)/100}) rotate(${N(rot)})"><rect x="-400" y="-340" width="800" height="680" ${st('#ecd9a0',8)}/><rect x="-370" y="-310" width="740" height="620" fill="none" stroke="#b8a26a" stroke-width="3"/>`;
  g+=`<text y="-250" text-anchor="middle" font-family="Fell, ${BAL}" font-size="22" fill="#5a4a2a">DUNCAN’S REPLY TO THE PATENT OFFICE · DEC. 19, 1931</text><path d="M-340 -224H340" stroke="#8a7a4a" stroke-width="3"/>`;
  g+=`<rect x="${N(-340+h0-6)}" y="${N(-130+2*84+8)}" width="${N((hw+12)*hl)}" height="64" fill="#ffd23a" opacity=".7"/>`;
  L.forEach((s2,i)=>{ const k=seg(u,ke+.3+i*.22,ke+.3+i*.22+.4,E.lin); g+=`<clipPath id="ty${i}"><rect x="-380" y="${-130+i*84}" width="${N(760*k)}" height="80"/></clipPath><text clip-path="url(#ty${i})" x="-340" y="${-80+i*84}" font-family="${FF}" font-size="50" fill="#2a1e10">${s2}</text>`; });
  return g+`<text x="-340" y="250" font-family="${FF}" font-size="40" fill="#5a4a2a" opacity="${op(seg(u,ke+1.2,ke+1.5)*2)}">— DUNCAN, SR.</text></g>`; }
function sh8_a(pu,u,t){ const ke=cu(8,'evidence'), slide=seg(u,0,ke+.3,E.o), y=lerp(1400,680,slide);
  paint(ctx=>paintDesk(ctx,t));
  return FIN(filing(u,ke,cu(8,'own'),y,1.0,lerp(6,-1,slide))+bigArm([1420,1500],[lerp(1060,880,slide),lerp(1700,940,slide)],'#e8bc98','#2e2e34','hold','',.7),t); }
function sh8_b(pu,u,t){ const ke=cu(8,'evidence'), ko=cu(8,'own'), dk=seg(u,ko-.05,ko+.25,E.back), z=lerp(1.2,1.24,seg(pu,0,2.9,E.io));
  paint(ctx=>paintDesk(ctx,t));
  const inset=panelBox(690,826,310,214,`<rect x="-600" y="-600" width="2280" height="4400" fill="#6a4a2e"/>${toon('duncan',540,1700,2.4,1,full({lean:-6,tilt:6,expr:'shock',look:[3,2],hF:[30,-150],hB:[-10,-120],mouth:1.4}),t,3)}`,{x:548,y:1010,z:2.3},{rot:3,k:dk,border:CRIM,id:'in8'});
  return FIN(filing(u,ke,ko,680,z,-1)+inset,t); }
function sh8(t){ const u=t-S(8), P=part(8,u); return [sh8_a,sh8_b][P.i](P.pu,u,t); }

/* ---------- 9 THE ENDING: the empty lobby, the portrait, the yo-yo comes back ---------- */
const FX=490, FY=1130, FW=280, FH=360;
function portrait(u,t){ return `<g transform="translate(${FX} ${FY}) rotate(${N(wob(u,0,.6,3,.4))})"><path d="M-80 -${FH/2}L0 -${FH/2+90}L80 -${FH/2}" fill="none" stroke="${INK}" stroke-width="6"/><rect x="${-FW/2}" y="${-FH/2}" width="${FW}" height="${FH}" rx="8" ${st('#c8a23a',10)}/><rect x="${-FW/2+22}" y="${-FH/2+22}" width="${FW-44}" height="${FH-44}" fill="#efe2bf" stroke="${INK}" stroke-width="5"/><clipPath id="por"><rect x="${-FW/2+24}" y="${-FH/2+24}" width="${FW-48}" height="${FH-48}"/></clipPath><g clip-path="url(#por)"><rect x="-200" y="-300" width="400" height="700" fill="#b9a374"/>${toon('pedroBell',0,330,1.6,1,full({lean:0,expr:'happy',look:[3,0],hF:[22,-112],hB:[-12,-114],tilt:-2}),t,2)}</g><rect x="-110" y="${FH/2+16}" width="220" height="50" rx="6" ${st('#e8c34a',6)}/><text y="${FH/2+52}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="${INK}">PEDRO FLORES</text></g>`; }
const capOnDesk=`<g transform="translate(900 1228) scale(1.4)"><path d="M-32 -2L-28 -34Q4 -42 36 -32L40 0Q4 10 -32 -2Z" fill="#7a1f2a" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="4" cy="-35" rx="32" ry="8" fill="${shade('#7a1f2a',1.25)}" stroke="${INK}" stroke-width="4"/><path d="M-31 -6Q4 4 39 -4" stroke="#e8c34a" stroke-width="7" fill="none"/></g>`;
function sh9_a(pu,u,t){ const c=SC(560,lerp(.86,.9,seg(pu,0,2.4,E.io))), dusk=lerp(.15,.4,seg(pu,0,2.4,E.io));
  paint(ctx=>paintLobby(ctx,t,c,{dusk}));
  return FIN(cam(c,lobbySvg(u*.2)+portrait(u,t)+capOnDesk),t,{grade:['#3a4a6a',.12,'multiply']}); }
function sh9_b(pu,u,t){ const kb=cu(9,'before'), m=seg(pu,0,4.2,E.io), c={x:lerp(560,520,m),y:FY,z:lerp(1.5,1.68,m),oy:600}, dusk=lerp(.4,.6,m);
  paint(ctx=>paintLobby(ctx,t,c,{dusk}));
  const cornerX=FX+FW/2+6, cornerY=FY-20, spin=2.6*2.2*(1-Math.exp(-u/2.2)), rate=2.6*Math.exp(-u/2.2);
  const g=lobbySvg(u*.2)+portrait(u,t)+yoyo(cornerX,cornerY,u,u<kb?'sleep':'return',{s:1.2,len:120,k:(u-kb)/.9,spin,fast:rate>1.4&&u<kb,ph:0});
  return FIN(cam(c,g),t,{vig:.9,grade:['#3a4a6a',.14,'multiply']}); }
function sh9(t){ const u=t-S(9), P=part(9,u); return [sh9_a,sh9_b][P.i](P.pu,u,t); }

const CUT_EP={1:[['hooked',-.1],['an',-.1]], 2:[['from',-.1],['looped',-.27]], 3:[['own',-.02]], 4:[['when',-.1],['was',-.35]], 5:[['the',-.1],['pedro',-.1],['with',-.1]],
  6:[1.3,['and',-.1]], 7:[['nobody',-.1]], 8:[['duncan',-.1]], 9:[['had',-.29]]};
const CUT_HOLD_EP=[9];   /* the ending holds on the portrait while the yo-yo comes back (4.2 s) */
const SEQ=[1,2,3,4,5,6,7,8,9].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
