/* ============================== Ice to Calcutta: shots (Stage C).
   LAYOUT (screen px 1080x1920): picture and faces in y 290-1040, ground line at y 1005, big captions below (letters y 1050-1175).
   Painted shots only: hard cuts between shots and sub-shots. Every sub-shot is split by CUT_EP (end of file): part(n,u) gives {i, pu}.
   Poses never snap: tween()/mix() only. Each painter is called with the SAME camera object as cam(). */
const COVER_T=.9;
const GY=1005, W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const FIN=(g,t,o={})=>finish(g,t,{boil:2.2,paper:.2,vig:.5,...o});
const DECKCAM=(z=1,x=540)=>({x,y:DECK-45/z,z});                       /* camera that puts the deck edge at screen y 1005 */
function paintDeck(ctx,t,L,c,sh=[],o={}){ paintDoldrums(ctx,t,L,c,o); ctx.save(); camCtx(ctx,c); sh.forEach(([x,y,rx,ry,a])=>PNT.shadow(ctx,x,y,rx,ry,a)); ctx.restore(); }
const deckLines=L=>lit(`<path d="M150 -400V${DECK+52}M234 -400V${DECK+52}" stroke="${INK}" stroke-width="6"/><path d="M-600 ${RAIL}H1700M-600 ${RAIL+24}H1700" stroke="${INK}" stroke-width="5"/><path d="M-600 ${DECK}H1700" stroke="${INK}" stroke-width="5" opacity=".8"/><path d="M234 250L900 ${RAIL}M150 330L-200 ${RAIL}" stroke="${INK}" stroke-width="4" opacity=".75" fill="none"/>`,L.c.fig,.55);
const arc=(x,y,r,col,w=4)=>`<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="none" stroke="${col}" stroke-width="${w}"/>`;

/* ---------- 1 HOOK: 180 tons of ice, four months, across the equator, twice ---------- */
function sh1_a(pu,u,t){ const c=DECKCAM(lerp(1,1.07,seg(pu,0,2.5,E.lin)),560), L=dayLight(.25), Y=DECK+24, s=1.12, bx=410, bw=330, bh=390, by=Y-6, X=640;
  paint(ctx=>paintDeck(ctx,t,L,c,[[bx+20,Y+4,bw*.62,22,.45],[X-60,Y+10,150,24,.4]]));
  const A=full({hF:[26,-136],hB:[-8,-130],expr:'shock',look:[-3,-3],tilt:-4}), H=full({lean:-6,tilt:8,hF:W2L(X,Y,s,-1,[bx+bw/2+8,by-bh*.78]),hB:W2L(X,Y,s,-1,[bx+bw/2+6,by-bh*.5]),handF:'open',handB:'open',expr:'tired',look:[-4,0],fF:[24,0],fB:[-10,0]});
  const pose=tween(pu,.25,A,H,.4);
  let g=iceBlock(bx,by,bw,bh,{frost:seg(pu,.2,1.3),mist:.9,t,melt:.03,drip:.6})+toon('sailor',X,Y,s,-1,pose,t,3)+sweat(X-60,Y-300*s,seg(pu,.5,.8),pu,1);
  return FIN(cam(c,lit(deckLines(L)+g,L.c.fig,.8)).replace(/$/,'')+tag('1833',200,340,64,'#fff3c4',INK,{k:seg(pu,0,.01),rot:-3}),t); }
function sh1_b(pu,u,t){ const k=seg(pu,0,2.07,E.io), cl=lerp(-48,36,k), rt=seg(pu,.15,1.9,E.io);
  paint(ctx=>paintGlobe(ctx,t,{cl,route:rt}));
  const b=gproj(-71,42,cl), cc=gproj(88,21.5,cl); let g='';
  if(b[2]>.2) g+=tag('BOSTON',b[0]-70,b[1]-50,48,'#fff3c4',INK,{k:seg(pu,0,.15,E.back),rot:-3});
  if(cc[2]>.25&&rt>.88) g+=tag('CALCUTTA',cc[0]-20,cc[1]-56,48,'#fff3c4',INK,{k:seg(pu,1.7,1.95,E.back),rot:3});
  return FIN(g,t,{paper:.12}); }
function sailAndLine(pu,t,dir){ const s=.95, HZ=720, wl=960, x0=dir>0?650:430, L=dayLight(.24), lineX=540+(x0-540)*(wl-HZ)/(1750-HZ);
  const shipX=dir>0?lerp(170,620,seg(pu,0,2.5,E.lin)):lerp(900,640,seg(pu,0,1.05,E.lin));
  paint(ctx=>paintOpenSea(ctx,t,{x0,ph:.24,HZ}));
  const sx=shipX+dir*405*s, sy=wl-140*s, jump=Math.sin(Math.PI*sat((pu-(dir>0?1.45:.28))/.5))*60*(dir>0?(pu>1.4&&pu<2?1:0):1);
  const A=full({hF:[30,-120],hB:[-10,-114],expr:'happy',look:[3,-2],lean:2}), J=full({lean:-6,tilt:-10,hF:[52,-300],hB:[-34,-292],handF:'fist',handB:'fist',expr:'joy',fF:[18,-34],fB:[-16,-30]});
  const jk=dir>0?seg(pu,1.4,1.62,E.o)*(1-seg(pu,1.9,2.2,E.i)):seg(pu,.2,.34,E.o)*(1-seg(pu,.62,.9,E.i));
  const fig=toon('sailor',sx,sy-jump,.58,dir,mix(A,J,jk),t,5)+`<ellipse cx="${N(sx)}" cy="${N(sy+2)}" rx="${N(40-jump*.3)}" ry="9" fill="#1a1020" opacity="${N(.3*(1-jump/90)*100)/100}"/>`;
  let g=shipSide(shipX,wl,s,dir,{t,jib:0})+lit(fig,L.c.fig,.8);
  g+=`<g transform="translate(${N(dir>0?770:330)} 1000) rotate(${dir>0?-9:9})">`+ttl('EQUATOR',0,0,58,'#fffaf0',{rot:0})+`</g>`;
  if(dir<0){ const kk=seg(pu,.5,.9,E.lin); g+=`<g transform="translate(${N(shipX-40*s*-1)} ${N(wl-300*s)})">`+ttl('×2',0,0,86,'#fff8dc',{k:seg(pu,.45,.7,E.back),rot:-6})+`</g>`; }
  return FIN(g,t,{paper:.15}); }
const sh1_c=(pu,u,t)=>sailAndLine(pu,t,1), sh1_d=(pu,u,t)=>sailAndLine(pu,t,-1);
function sh1(t){ const u=t-S(1), P=part(1,u); return P.i===0?sh1_a(P.pu,u,t):P.i===1?sh1_b(P.pu,u,t):P.i===2?sh1_c(P.pu,u,t):sh1_d(P.pu,u,t); }

/* ---------- 2 HOW DID IT SURVIVE: the question, the ice machine, the two-foot block ---------- */
function sh2_a(pu,u,t){ const c=DECKCAM(1.3,520), L=dayLight(.25), Y=DECK+24, s=1.12, bx=420, bw=270, bh=310, by=Y-6, X=690, fan=Math.sin(pu*11);
  paint(ctx=>paintDeck(ctx,t,L,c,[[bx+20,Y+4,bw*.62,22,.45],[X-60,Y+10,150,24,.4]]));
  const hat=hatProp(), F=full({lean:-4,tilt:6,hF:W2L(X,Y,s,-1,[bx+bw/2+50+fan*22,by-bh*.82-Math.abs(fan)*12]),hB:[24,-120],handF:'hold',expr:'wince',look:[-6,-2],holdF:hat}), W=full({...F,tilt:0,hF:[56,-176],expr:'plead',look:[0,0],holdF:hat});
  const pose=tween(pu,1.5,F,W,.35);
  const g=iceBlock(bx,by,bw,bh,{melt:.05+.12*seg(pu,0,2.6),mist:.6,t,drip:1})+toon('sailor',X,Y,s,-1,pose,t,3)+sweat(X-40,Y-310*s,seg(pu,.2,.5),pu,1.1);
  return FIN(cam(c,lit(deckLines(L)+g,L.c.fig,.8)),t); }
function sh2_b(pu,u,t){ const c={x:540,y:960,z:1}, hx=lerp(330,600,seg(pu,0,3.0,E.lin)), hs=.95, gy=1000, bl=hx-100*hs-205*.85;
  paint(ctx=>paintPond(ctx,t,{c}));
  let g=`<path d="M0 ${gy-8}H${N(bl)}M0 ${gy+30}H${N(bl)}" stroke="#6e8fb0" stroke-width="7" stroke-linecap="round" opacity=".85"/><path d="M0 ${gy-4}H${N(bl)}M0 ${gy+34}H${N(bl)}" stroke="#fff" stroke-width="2.5" opacity=".7"/>`;
  g+=cutterSled(hx-100*hs,gy+4,.85,1,pu)+horse(hx,gy+6,hs,1,pu)+`<path d="M${N(hx+110*hs)} ${N(gy-190*hs)}L${N(hx-100*hs)} ${N(gy+4-60*.85)}" stroke="${INK}" stroke-width="6"/>`;
  [[880,'worker',TP.armsCross,-1],[985,'worker2',full({hF:[56,-170],hB:[30,-112],handF:'open',expr:'happy'}),-1]].forEach(([x,who,pz,d],i)=>{ const w=tween(pu,1.2+i*.3,full({}),full(pz),.4); g+=toon(who,x,gy+8,.9,d,{...w,tilt:(w.tilt||0)+Math.sin(pu*3+i)*2},t,7+i); });
  g+=[0,1,2].map(i=>{ const q=((pu*.8+i*.33)%1); return `<ellipse cx="${N(hx+215*hs+q*60)}" cy="${N(gy-300*hs-q*40)}" rx="${N(10+q*14)}" ry="${N(6+q*8)}" fill="#fff" opacity="${N((1-q)*.5*100)/100}"/>`; }).join('');
  return FIN(lit(g,'#ffe6d0',.4),t,{paper:.18}); }
function sh2_c(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>{ PNT.sea(ctx,t,{horizon:-60,bottom:2200,far:'#cfe4f0',mid:'#b4d4e6',near:'#9cc4dc',rip:.14,dk:.12,ripCol:'#ffffff',swell:0,speed:0,n:60,seed:7}); PNT.vignette(ctx,.3,'#10243a'); });
  let g='';
  for(let r=0;r<4;r++) for(let q=0;q<5;q++){ const i=r*5+q, k=sat((pu+.2-i*.045)/.3), sc=lerp(.6,1,E.back(k)), cx=190+q*175, cy=420+r*158; if(k<=0) continue;
    g+=`<g transform="translate(${cx} ${cy}) scale(${N(sc*100)/100})" opacity="${N(sat(k*4)*100)/100}"><rect x="-76" y="-76" width="152" height="152" rx="12" fill="url(#gIceTop)" stroke="${INK}" stroke-width="6"/><rect x="-62" y="-62" width="124" height="22" rx="8" fill="#fff" opacity=".75"/><path d="M-50 54L-14 6" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".6"/></g>`; }
  const rk=seg(pu,.7,1.0,E.o), rx=lerp(1250,615,rk);
  g+=`<g transform="translate(${N(rx)} 612)">${rulerProp().svg.replace('scale','scale')}</g>`;
  g+=tag('2 FT',470,330,86,'#fff3c4',INK,{k:seg(pu,.95,1.2,E.back),rot:-3});
  return FIN(g,t,{paper:.18}); }
function sh2(t){ const u=t-S(2), P=part(2,u); return P.i===0?sh2_a(P.pu,u,t):P.i===1?sh2_b(P.pu,u,t):sh2_c(P.pu,u,t); }

/* ---------- THE HOLD (cut-away): hull timbers, a stack of blocks, bark either side, hay on top ---------- */
const HB={x0:330,bw:105,bh:54,cols:4,rows:5,yb:870};
function holdSvg(t,{drop=0,merge=0,bark=0,floor=0,hay=0,planks=0,sx=1,sy=1,puddle=0,lampK=1,hatch=0}={}){
  let g='';
  g+=`<rect x="190" y="470" width="28" height="480" ${st('#c9a06a',5)}/><rect x="862" y="470" width="28" height="480" ${st('#c9a06a',5)}/>`;                      /* inner planking */
  g+=`<rect x="190" y="910" width="700" height="44" ${st('#c9a06a',5)}/>`;                                                                                     /* floor planks */
  const chips=(x0,x1,yTop,yBot,seed)=>{ let s=''; for(let i=0;i<46;i++){ const x=x0+rnd(i+seed)*(x1-x0), y=yTop+rnd(i*3+seed)*(yBot-yTop); s+=`<rect x="${N(x)}" y="${N(y)}" width="${N(9+rnd(i)*10)}" height="5" rx="2" fill="${i%3?'#8a6238':'#4a3020'}" transform="rotate(${N(rnd(i*7)*80-40)} ${N(x)} ${N(y)})"/>`; } return s; };
  if(floor>0){ const h=40*sat(floor); g+=`<rect x="218" y="${N(910-h)}" width="644" height="${N(h)}" fill="#6b4a2c" stroke="${INK}" stroke-width="5"/>`+chips(222,858,910-h+4,908,3); }
  if(bark>0){ const h=(910-560)*sat(bark), yT=910-h; [[218,330],[750,862]].forEach(([a,b],i)=>{ g+=`<rect x="${a}" y="${N(yT)}" width="${b-a}" height="${N(h)}" fill="#6b4a2c" stroke="${INK}" stroke-width="5"/>`+chips(a+4,b-14,yT+6,908,i*9+5); }); }
  /* the stack */
  g+=`<g transform="translate(540 ${HB.yb}) scale(${N(sx*1000)/1000} ${N(sy*1000)/1000}) translate(-540 ${-HB.yb})">`;
  for(let r=0;r<HB.rows;r++) for(let c=0;c<HB.cols;c++){ const i=r*HB.cols+c, k=drop>=100?1:sat((drop-(.08+i*.085))/.28); if(k<=0) continue;
    const x=HB.x0+c*HB.bw, y=HB.yb-(r+1)*HB.bh, dy=-(1-E.o(k))*620, land=k>=1?0:0, sq=k>.85&&k<1?.9:1;
    g+=`<g transform="translate(${x} ${N(y+dy+(1-sq)*HB.bh)}) scale(1 ${sq})" opacity="${N(sat(k*6)*100)/100}"><rect width="${HB.bw}" height="${HB.bh}" fill="url(#gIce)" stroke="${INK}" stroke-width="${N(5*(1-merge))}"/><rect x="8" y="7" width="${HB.bw-16}" height="10" rx="4" fill="#fff" opacity=".7"/></g>`; }
  if(merge>0){ const W=HB.cols*HB.bw, H=HB.rows*HB.bh; g+=`<rect x="${HB.x0}" y="${HB.yb-H}" width="${W}" height="${H}" rx="14" fill="none" stroke="${INK}" stroke-width="${N(7+8*Math.sin(Math.PI*merge))}" opacity="${N(merge*100)/100}"/><rect x="${HB.x0+10}" y="${HB.yb-H+10}" width="${W-20}" height="${N(26)}" rx="10" fill="#fff" opacity="${N(merge*.7*100)/100}"/>`; }
  g+=`</g>`;
  if(puddle>0) g+=`<ellipse cx="540" cy="${HB.yb+4}" rx="${N(280*puddle)}" ry="${N(10+16*puddle)}" fill="#8fd0ea" stroke="${INK}" stroke-width="3.5" opacity=".85"/>`;
  if(hay>0){ const w=700*sat(hay); g+=`<rect x="190" y="530" width="${N(w)}" height="64" fill="#e8c860" stroke="${INK}" stroke-width="5"/>`; for(let i=0;i<Math.floor(34*sat(hay));i++){ const x=194+rnd(i)*w*.98, y=534+rnd(i*3)*54; g+=`<path d="M${N(x)} ${N(y)}l${N(rnd(i*5)*18-9)} 12" stroke="#b8902a" stroke-width="3.5" stroke-linecap="round"/>`; } }
  if(planks>0){ const w=700*sat(planks); g+=`<rect x="190" y="498" width="${N(w)}" height="36" ${st('#c9a06a',5)}/>`; for(let i=0;i*140<w;i++) g+=`<path d="M${190+i*140} 498V534" stroke="${INK}" stroke-width="4"/>`; }
  if(lampK>0) g+=lantern(260,470,'#ffb85a',lampK);
  return g; }
const HOLDCAM=(x=540,y=720,z=1)=>({x,y:y+(960-720)*0+(0),z,oy:880});
const workerAt=(who,x,y,s,dir,pose,t,seed)=>toon(who,x,y,s,dir,pose,t,seed);
function sh3_a(pu,u,t){ const c=HOLDCAM(), L='#ffd9a0'; paint(ctx=>paintHold(ctx,t,{c}));
  const W=full({}), Pn=full({hF:[44,-196],hB:[-12,-114],handF:'point',expr:'determined',look:[-4,3],tilt:4}), P2=full({hF:[56,-296],hB:[-30,-270],handF:'fist',handB:'fist',expr:'proud',lean:-4,tilt:-6});
  const pose=tween(pu,1.65,Pn,P2,.4);
  const g=holdSvg(t,{drop:pu})+lit(toon('worker',830,900,.62,-1,pose,t,4),L,.6);
  return FIN(cam(c,g,880),t,{vig:.7}); }
function sh3_b(pu,u,t){ const c=HOLDCAM(540,790,lerp(1.55,1.4,seg(pu,0,1.1,E.io))); paint(ctx=>paintHold(ctx,t,{c,la:.8+.2*seg(pu,0,.6)}));
  const g=holdSvg(t,{drop:100,merge:seg(pu,.1,.55,E.io)});
  return FIN(cam(c,g,880),t,{vig:.7}); }
function sh3_c(pu,u,t){ const c=DECKCAM(1.25,560), L=dayLight(.25), Y=DECK+24, s=.98, bx=770, bw=250, bh=290, by=Y-6, melt=seg(pu,.5,2.8,E.lin);
  paint(ctx=>paintDeck(ctx,t,L,c,[[330,Y+8,100,18,.4],[bx+10,Y+6,bw*.65,20,.45]]));
  const hold=full({lean:-3,tilt:4,hF:[60,-176],hB:[-12,-114],handF:'hold',expr:'happy',look:[3,3],holdF:cubeProp(melt)}), sad=full({...hold,hF:[60,-150],expr:'shock',look:[1,6]});
  const A=tween(pu,1.6,hold,sad,.4);
  const sitA=full({...TP.sit,lean:2,hF:[50,-176],hB:[56,-168],handF:'fist',handB:'fist',expr:'smug',look:[-2,0],fF:[56,-26],fB:[36,-20]});
  const pud={x:300,y:Y+2};
  let g=iceBlock(bx,by,bw,bh,{melt:.1*seg(pu,.5,2.8)+.02,mist:.5,t,drip:.4})+toon('sailor2',bx+70,Y-bh+34,.9,-1,{...sitA,hy:0},t,9).replace(/$/,'');
  g+=`<ellipse cx="${pud.x+40}" cy="${Y+2}" rx="${N(14+60*melt)}" ry="${N(5+10*melt)}" fill="#a8dcf0" stroke="${INK}" stroke-width="3" opacity="${N(melt*100)/100}"/>`;
  g+=toon('sailor',330,Y,1.08,1,A,t,3);
  return FIN(cam(c,lit(deckLines(L)+g,L.c.fig,.8)),t); }
function sh3(t){ const u=t-S(3), P=part(3,u); return P.i===0?sh3_a(P.pu,u,t):P.i===1?sh3_b(P.pu,u,t):sh3_c(P.pu,u,t); }

/* ---------- 4 THE TRICK: bury it in bark and hay ---------- */
const barkChips=(x,y,k,n=10)=>{ let g=''; for(let i=0;i<n;i++){ const q=sat(k*1.2-i*.05); if(q<=0||q>=1) continue; g+=`<rect x="${N(x+q*(60+rnd(i)*80)*(i%2?1:.7))}" y="${N(y-Math.sin(q*Math.PI)*(90+rnd(i+3)*60)+q*40)}" width="12" height="6" rx="2" fill="#6b4a2c" stroke="${INK}" stroke-width="2.5" transform="rotate(${N(q*300)})"/>`; } return g; };
function sh4_a(pu,u,t){ const c=HOLDCAM(), L='#ffd9a0'; paint(ctx=>paintHold(ctx,t,{c}));
  const fall=seg(pu,.05,.5,E.i), wy=lerp(380,910,fall), land=pu>.5?Math.exp(-(pu-.5)*8)*Math.sin((pu-.5)*30):0;
  const dig=Math.abs(Math.sin(pu*9))*(pu>.55?1:0), A=full({lean:-4,hF:[30,-130],hB:[14,-118],handF:'hold',handB:'hold',expr:'determined',look:[3,3],holdF:shovelProp(dig>.5?1:0)});
  const sq=fall<1?0:Math.max(0,land)*.12;
  const g=holdSvg(t,{drop:100})+lit(toon('worker',276,wy,.58,1,{...A,sq},t,4),L,.6)+(pu>.55?barkChips(300,880,((pu-.55)*2.2)%1):'');
  return FIN(cam(c,g,880),t,{vig:.7}); }
function sh4_b(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintTannery(ctx,t,{c}));
  const give=seg(pu,.55,1.2,E.io), tA=full({lean:-2,hF:[56,-150],hB:[-12,-114],handF:'hold',expr:'smug',look:[4,0],holdF:sackProp()}), tB=full({...tA,hF:[84,-150],lean:3,holdF:sackProp()});
  const wA=full({hF:[40,-120],hB:[-10,-114],expr:'neutral'}), wB=full({hF:[66,-150],hB:[40,-144],handF:'open',handB:'open',expr:'shock',tilt:-8,lean:-5}), W=tween(pu,1.05,wA,wB,.35);
  let g=`<g opacity=".92"><path d="M60 560H1020" stroke="${INK}" stroke-width="8"/>`+[0,1,2,3,4].map(i=>`<path d="M${150+i*190} 560l-26 190Q${150+i*190} 760 ${180+i*190} 750L${176+i*190} 560Z" fill="${i%2?'#9a6a42':'#7a4a2a'}" stroke="${INK}" stroke-width="5"/>`).join('')+`</g>`;
  g+=toon('tanner',300,GY,1.05,1,tween(pu,.5,tA,tB,.5),t,31)+toon('worker',760,GY,1.05,-1,{...W,tilt:(W.tilt||0)+Math.sin(pu*8)*(pu>1.3?2:0)},t,32);
  return FIN(lit(g,'#fff0d6',.5),t,{paper:.18}); }
function sh4_c(pu,u,t){ const c=HOLDCAM(), L='#ffd9a0', k=seg(pu,0,1.1,E.io); paint(ctx=>paintHold(ctx,t,{c,shafts:1}));
  const dig=Math.abs(Math.sin(pu*9)), A=full({lean:-4,hF:[30,-130],hB:[14,-118],handF:'hold',handB:'hold',expr:'determined',look:[3,3],holdF:shovelProp(dig>.5?1:0)});
  const g=holdSvg(t,{drop:100,floor:1,bark:k})+lit(toon('worker',276,910,.58,1,A,t,4),L,.6)+barkChips(300,880,(pu*2.4)%1);
  return FIN(cam(c,g,880)+tag('1 FT BARK',720,360,64,'#fff3c4',INK,{k:seg(pu,.1,.35,E.back),rot:2}),t,{vig:.7}); }
function sh4_d(pu,u,t){ const z=lerp(1.45,1.9,seg(pu,1.25,1.8,E.io)), c={x:lerp(470,820,seg(pu,1.25,1.8,E.io)),y:lerp(640,600,seg(pu,1.25,1.8,E.io)),z,oy:880}, L='#ffd9a0'; paint(ctx=>paintHold(ctx,t,{c}));
  const hayK=seg(pu,0,.8,E.lin), stomp=Math.abs(Math.sin(pu*12))*(pu>.8&&pu<1.3?1:0), plK=seg(pu,1.0,1.4,E.lin);
  const fork=full({lean:-3,hF:[30,-132],hB:[14,-120],handF:'hold',handB:'hold',expr:'determined',look:[3,2],holdF:forkProp(hayK<1?1:0),fF:[20,0],fB:[-14,-stomp*12]});
  const ham=Math.sin(sat((pu-1.5)/.18)*Math.PI), hamPose=full({lean:2,hF:[52,-190-ham*70],hB:[20,-120],handF:'hold',expr:'determined',look:[3,3],holdF:hammerProp()});
  const wL=lit(toon('worker',276,pu<1.2?600:600,.58,1,fork,t,4),L,.6);
  let g=holdSvg(t,{drop:100,floor:1,bark:1,hay:hayK,planks:plK,lampK:1})+(pu<1.2?wL:'')+(pu>=1.2?lit(toon('worker',852,520,.58,-1,hamPose,t,6),L,.6):'');
  g+=impact(842,498,seg(pu,1.64,1.9,E.lin),.5);
  return FIN(cam(c,g,880),t,{vig:.7}); }
function sh4(t){ const u=t-S(4), P=part(4,u); return P.i===0?sh4_a(P.pu,u,t):P.i===1?sh4_b(P.pu,u,t):P.i===2?sh4_c(P.pu,u,t):sh4_d(P.pu,u,t); }

/* ---------- 5 THE TROPICS: hot above, cold below, ten days ---------- */
const breath=(x,y,u,dir=1)=>[0,1,2].map(i=>{ const q=((u*.9+i*.33)%1); return `<ellipse cx="${N(x+dir*q*46)}" cy="${N(y-q*30)}" rx="${N(8+q*18)}" ry="${N(5+q*10)}" fill="#fff" opacity="${N((1-q)*.65*100)/100}"/>`; }).join('');
function sh5_a(pu,u,t){ const L=dayLight(.25), cT={x:600,y:DECK,z:1.1,oy:660}, cB={x:540,y:800,z:.9,oy:880}, SPL=690;
  paint(ctx=>{ ctx.save(); ctx.beginPath(); ctx.rect(0,0,1080,SPL); ctx.clip(); paintDeck(ctx,t,L,cT,[[600,DECK+30,140,22,.45]]); ctx.restore();
               ctx.save(); ctx.beginPath(); ctx.rect(0,SPL,1080,1300); ctx.clip(); paintHold(ctx,t,{c:cB,lamp:[300,560],lc:'#7fb2ff',la:.9,cold:.7,r:460}); ctx.restore(); });
  const fan=Math.sin(pu*10), hot=full({lean:-6,tilt:10,hF:[58+fan*16,-214+Math.abs(fan)*8],hB:[40,-96],handF:'flat',expr:'tired',look:[3,-2],...TP.sit,hF:[58+fan*16,-214+Math.abs(fan)*8]}), shv=Math.sin(pu*38)*2.4;
  const cold=full({lean:2+shv,tilt:-3,hF:[44,-150],hB:[40,-146],handF:'fist',handB:'fist',expr:'wince',look:[2,3],hy:-2});
  const topFig=toon('sailor',600,DECK+30,1.05,-1,{...hot,hF:[58+fan*16,-214+Math.abs(fan)*8]},t,3);
  const gT=lit(deckLines(L)+topFig+sweat(560,DECK-250,1,pu,.9)+sweat(640,DECK-210,.8,pu+.4,.8),L.c.fig,.8);
  const gB=holdSvg(t,{drop:100,floor:1,bark:1,hay:1,planks:1,lampK:0})+lantern(300,470,'#9fc8ff',1)+lit(toon('sailor',830,925,.9,-1,cold,t,5),'#c8d8ff',.7)+breath(765,735,pu,-1);
  let g=`<clipPath id="c5t"><rect width="1080" height="${SPL}"/></clipPath><clipPath id="c5b"><rect y="${SPL}" width="1080" height="1300"/></clipPath>`
    +`<g clip-path="url(#c5t)">${cam(cT,gT,652)}</g><g clip-path="url(#c5b)">${cam(cB,gB,880)}</g><path d="M0 ${SPL}H1080" stroke="${INK}" stroke-width="14"/>`;
  return FIN(g,t,{vig:.4}); }
function sh5_b(pu,u,t){ const ph=.06+pu/1.0, L=dayLight(ph), c=DECKCAM(1.1,480), X=650, Y=DECK+24, s=1.3, crate=[X-120,Y-97*s,196,97*s], n=Math.min(10,Math.floor(pu/2.31*10.4)), kT=sat((pu/2.31*10.4)%1);
  paint(ctx=>paintDoldrums(ctx,t,L,c,{crate,fig:[X,Y]}));
  const fan=Math.sin(pu*9), hot=full({...TP.sit,lean:-6,tilt:10+fan*2,hF:[58+fan*16,-214+Math.abs(fan)*8],hB:[40,-96],handF:'flat',expr:'tired',look:[3,-2]}), sleep=full({...TP.sit,lean:-16,tilt:-22,hF:[62,-104],hB:[40,-96],handF:'open',expr:'bored',look:[0,4]});
  const pose=mix(hot,sleep,L.night);
  const figs=`<rect x="${N(crate[0])}" y="${N(crate[1])}" width="${crate[2]}" height="${N(crate[3])}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${N(crate[0])} ${N(crate[1]+30)}h${crate[2]}M${N(crate[0])} ${N(crate[1]+62)}h${crate[2]}" stroke="${INK}" stroke-width="3.5" opacity=".7"/>`+toon('sailor',X,Y,s,1,pose,t,3);
  const ship=`<path d="M150 -400V${DECK+52}M234 -400V${DECK+52}" stroke="${INK}" stroke-width="6"/><path d="M-600 ${RAIL}H1700M-600 ${RAIL+24}H1700" stroke="${INK}" stroke-width="5"/><path d="M-600 ${DECK}H1700" stroke="${INK}" stroke-width="5" opacity=".8"/><path d="M234 250L900 ${RAIL}M150 330L-200 ${RAIL}" stroke="${INK}" stroke-width="4" opacity=".75" fill="none"/>`+tally(192,560,n,kT);
  return FIN(cam(c,lit(ship,L.c.fig,.55)+lit(figs,L.c.fig,.8)),t); }
function sh5_c(pu,u,t){ const c=HOLDCAM(480,760,1.35), L='#c8d8ff'; paint(ctx=>paintHold(ctx,t,{c,lamp:[300,560],lc:'#7fb2ff',la:.9,cold:.55,r:520}));
  const shv=Math.sin(pu*38)*2.4*(1-seg(pu,.1,.4)), off=seg(pu,.25,.6,E.io)*(1-seg(pu,1.05,1.3,E.io)*.0), A=full({lean:2+shv,tilt:-3,hF:[44,-150],hB:[40,-146],handF:'fist',handB:'fist',expr:'wince',look:[2,3]}), B=full({lean:-2,tilt:-6,hF:[50,-250],hB:[20,-200],handF:'open',handB:'open',expr:'joy',look:[3,-3]}), pose=mix(A,B,off);
  const scarf=sat(1-seg(pu,.3,.6)+seg(pu,1.1,1.3));
  let g=holdSvg(t,{drop:100,floor:1,bark:1,hay:1,planks:1,lampK:0})+lantern(300,470,'#9fc8ff',1)+lit(toon('sailor',480,910,1.12,1,pose,t,5),L,.45);
  g+=`<g transform="translate(494 ${N(910-250*1.12)})" opacity="${N(scarf*100)/100}"><path d="M-44 0Q0 30 44 4L40 28Q0 52 -40 24Z" fill="#c8372d" stroke="${INK}" stroke-width="5"/></g>`+`<g opacity="${N(scarf*100)/100}">${breath(526,700,pu,1)}</g>`;
  return FIN(cam(c,g,880)+tag('DAY 10',830,350,70,'#fff3c4',INK,{k:seg(pu,.05,.3,E.back),rot:3}),t,{vig:.7}); }
function sh5(t){ const u=t-S(5), P=part(5,u); return P.i===0?sh5_a(P.pu,u,t):P.i===1?sh5_b(P.pu,u,t):sh5_c(P.pu,u,t); }

/* ---------- 6 CALCUTTA: the Hooghly at morning, the hatch opens ---------- */
const crowdFig=(x,y,s,col,u,i)=>{ const w=Math.sin(u*5+i*1.7)*.5+.5; return `<g transform="translate(${N(x)} ${N(y)}) scale(${s})"><circle cy="-92" r="13" fill="#c08654" stroke="${INK}" stroke-width="4"/><path d="M0 -78V-30M0 -66L-16 -${N(40+w*40)}M0 -66L16 -${N(40+(1-w)*30)}M0 -30L-12 0M0 -30L12 0" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0 -78V-30M0 -66L-16 -${N(40+w*40)}M0 -66L16 -${N(40+(1-w)*30)}M0 -30L-12 0M0 -30L12 0" stroke="${col}" stroke-width="6" stroke-linecap="round"/></g>`; };
function sh6_a(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintRiver(ctx,t,{c}));
  const x=lerp(180,600,seg(pu,0,2.3,E.o)), wl=960, s=.74; let g='';
  for(let i=0;i<9;i++) g+=crowdFig(70+i*118+(i%2)*30,885+((i*7)%3)*6,.66,['#efe7d2','#e6a23a','#c8372d','#2c5e8a'][i%4],pu,i);
  [[200,1010],[880,990]].forEach(([bx,by],i)=>{ g+=`<g transform="translate(${bx+Math.sin(pu*1.4+i)*8} ${by})"><path d="M-70 -10Q0 24 70 -10L56 -22H-56Z" ${st('#7a4a2a',5)}/><path d="M0 -14V-110" stroke="${INK}" stroke-width="5"/></g>`; });
  g+=shipSide(x,wl,s,1,{t})+`<ellipse cx="${N(x+330*s)}" cy="${wl+14}" rx="${N(90+20*Math.sin(pu*3))}" ry="12" fill="#fff" opacity=".6"/>`;
  return FIN(lit(g,'#fff2d6',.4),t,{paper:.15}); }
function sh6_b(pu,u,t){ const c=HOLDCAM(540,700,1), L='#ffe6c0'; paint(ctx=>paintHold(ctx,t,{c,shafts:seg(pu,0,.5),lc:'#ffe6b0',la:.7}));
  const open=seg(pu,0,.5,E.o);
  let g=holdSvg(t,{drop:100,floor:1,bark:1,hay:0,planks:0,sx:.78,sy:.56,puddle:.9,lampK:0});
  g+=[[420,'porter',1],[560,'buyer2',-1],[700,'mate',-1]].map(([x,w,d],i)=>{ const pz=full({hF:[44,-170],hB:[30,-150],handF:'open',handB:'open',expr:'awe',look:[0,8],lean:8,tilt:6+Math.sin(pu*3+i)*2}); return lit(toon(w,x,520+(1-open)*-200,.62,d,pz,t,6+i),L,.7); }).join('');
  g+=`<rect x="280" y="440" width="520" height="40" ${st('#8a5a32',6)}/><rect x="262" y="478" width="556" height="22" ${st('#6a4222',6)}/>`;
  return FIN(cam(c,g,880),t,{vig:.7}); }
function sh6(t){ const u=t-S(6), P=part(6,u); return P.i===0?sh6_a(P.pu,u,t):sh6_b(P.pu,u,t); }

/* ---------- 7 THE REAL MELTING: 55 tons at sea, almost 30 on the river and the docks ---------- */
function derrick(x,top,u,mel){ const sw=Math.sin(u*2.2)*34, rx=640+sw, ry=top+230;
  return `<path d="M${x} 1010V${top}L${x+60} 1010M${x-60} 1010L${x} ${top}" stroke="${INK}" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M${x} ${top}L${x+60} 1010M${x-60} 1010L${x} ${top}" stroke="#8a5a32" stroke-width="5" fill="none"/><path d="M${x} ${top+10}L${x+560} ${top-30}" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${x} ${top+10}L${x+560} ${top-30}" stroke="#9a6a3c" stroke-width="8" stroke-linecap="round"/>`
    +`<path d="M${x+540} ${top-26}L${N(rx)} ${N(ry)}" stroke="${INK}" stroke-width="5"/>`; }
function sh7_a(pu,u,t){ const c={x:540,y:960,z:1}, sw=Math.sin(pu*2.2)*34; paint(ctx=>paintDocks(ctx,t,{c,wall:1}));
  let g=derrick(120,430,pu)+iceBlock(640+sw,690,250,200,{melt:.35,drip:1,t,mist:.2,wob:sw*.1});
  [[330,'porter',1],[860,'mate',-1]].forEach(([x,w,d],i)=>{ const A=full({hF:[60,-180],hB:[34,-170],handF:'fist',handB:'fist',expr:'determined',look:[4,-4],lean:-4,fF:[16,0],fB:[-14,0]}); g+=toon(w,x,GY,.95,d,{...A,lean:A.lean+sw*.05},t,12+i); });
  g+=`<g opacity=".8">`+[0,1,2,3,4].map(i=>`<ellipse cx="${N(520+i*45+sw)}" cy="${GY+6}" rx="${N(18+i*3)}" ry="6" fill="#a8dcf0" stroke="${INK}" stroke-width="2.5" opacity="${N(.25+.12*i)}"/>`).join('')+`</g>`;
  return FIN(lit(g,'#fff6dc',.5),t,{paper:.16}); }
function sh7_b(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintDocks(ctx,t,{c,wall:1}));
  const w=seg(pu,.2,1.6,E.io), A=full({lean:3,tilt:-2,hF:[56,-224],hB:[-12,-114],handF:'hold',expr:'smug',look:[4,-2],holdF:chalkProp(),fF:[22,0],fB:[-14,0]}), B=full({...A,hF:[84+Math.sin(pu*14)*10,-244+Math.cos(pu*11)*8]});
  let g=toon('mate',250,GY,1.3,1,mix(A,B,seg(pu,.1,.3)),t,15)+slate(715,640,560,300,['4 MONTHS','−55 T'],w,-2,100);
  return FIN(lit(g,'#fff6dc',.5),t,{paper:.16}); }
function sh7_c(pu,u,t){ const wx=lerp(180,700,seg(pu,0,1.8,E.lin)), c={x:lerp(540,wx+120,.9),y:960,z:1}, melt=seg(pu,.2,1.8,E.lin); paint(ctx=>paintDocks(ctx,t,{c,wall:1}));
  const s=1.12, H=full({lean:3,hF:[56,-128],hB:[34,-130],handF:'open',handB:'open',expr:'smug',look:[4,-1]}), wk=walkPose(pu,2.3,1), pose={...wk,hF:H.hF,hB:H.hB,handF:'open',handB:'open',expr:melt<.6?'smug':'confused',lean:3,hy:wk.hy};
  const bH=lerp(150,34,melt), bW=lerp(130,36,melt);
  let g=toon('buyer',wx,GY,s,1,pose,t,16)+iceBlock(wx+84*s,GY-82*s+bH*.5,bW,bH,{melt:0,drip:.8,t})+`<ellipse cx="${N(wx+60)}" cy="${GY+6}" rx="${N(30+40*(1-melt))}" ry="7" fill="#a8dcf0" opacity=".5"/>`;
  for(let i=0;i<4;i++){ const q=(i*.27+pu*.5)%1; g+=`<ellipse cx="${N(wx-40-q*260)}" cy="${GY+8}" rx="${N(6+q*8)}" ry="4" fill="#a8dcf0" stroke="${INK}" stroke-width="2" opacity="${N((1-q)*.7*100)/100}"/>`; }
  return FIN(cam(c,lit(g,'#fff6dc',.5)),t,{paper:.16}); }
function sh7_d(pu,u,t){ const c={x:700,y:900,z:1.35,oy:1010}; paint(ctx=>paintDocks(ctx,t,{c,wall:1}));
  const look=seg(pu,.5,.9,E.io), A=full({lean:2,hF:[56,-166],hB:[-8,-116],handF:'hold',expr:'confused',look:[4,2],holdF:cubeProp(.35)}), B=full({lean:5,tilt:6,hF:[52,-150],hB:[-8,-116],handF:'hold',expr:'sad',look:[4,6],holdF:cubeProp(.35)});
  let g=toon('buyer',470,GY,1.15,1,mix(A,B,look),t,16)+slate(850,640,370,230,['DAYS','≈ −30 T'],seg(pu,.1,.7,E.lin),2,70);
  return FIN(cam(c,lit(g,'#fff6dc',.5),1010),t,{paper:.16}); }
function sh7(t){ const u=t-S(7), P=part(7,u); return P.i===0?sh7_a(P.pu,u,t):P.i===1?sh7_b(P.pu,u,t):P.i===2?sh7_c(P.pu,u,t):sh7_d(P.pu,u,t); }

/* ---------- 8 THE ICE HOUSE ---------- */
const coin=(x,y)=>`<circle cx="${N(x)}" cy="${N(y)}" r="11" fill="#ffd25a" stroke="${INK}" stroke-width="3.5"/>`;
function sh8_a(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintDocks(ctx,t,{c,wall:1}));
  const mk=(who,x,d,i)=>{ const A=full({hF:[30,-124],hB:[-12,-114],expr:'neutral'}), B=full({lean:-4,hF:[60,-170],hB:[-12,-114],handF:'open',expr:'happy',look:[4,-2]}); return toon(who,x,GY,.9,d,tween(pu,.3+i*.6,A,B,.3),t,20+i); };
  const bear=full({lean:2,hF:[60,-150],hB:[-12,-114],handF:'hold',expr:'smug',look:[0,2],holdF:hatProp(Math.min(5,Math.floor(pu*1.9)))});
  let g=mk('buyer',200,1,0)+mk('buyer2',880,-1,1)+toon('porter',540,GY,.9,1,bear,t,24);
  const hx=618, hy=GY-150*.9-30;
  [[0,230],[1,850]].forEach(([i,x0])=>{ const k=sat((pu-(.5+i*.6))/.45), px=lerp(x0,hx,k), py=lerp(GY-190,hy,k)-Math.sin(k*Math.PI)*120; if(k>0&&k<1) g+=coin(px,py); });
  const k2=sat((pu-1.8)/.45); if(k2>0&&k2<1) g+=coin(lerp(330,hx,k2),lerp(GY-170,hy,k2)-Math.sin(k2*Math.PI)*110);
  return FIN(lit(g,'#fff6dc',.5),t,{paper:.16}); }
function sh8_b(pu,u,t){ const c={x:540,y:960,z:1}; paint(ctx=>paintIceHouse(ctx,t,{c}));
  /* an illustration, not a reconstruction (its look is not documented): a big windowless masonry block, thick walls, one deep door, no date */
  const course=[];for(let y=470;y<1000;y+=44) course.push(`<path d="M172 ${y}H908" stroke="#b9a986" stroke-width="3" opacity=".6"/>`);
  let g=`<path d="M160 1005V440H920V1005Z" ${st('#ece0c4',10)}/>`+course.join('')+`<path d="M760 442V1003H918V442Z" fill="#a9b8c8" opacity=".35"/>`
    +`<path d="M130 440H950L920 396H160Z" ${st('#c9b994',10)}/><path d="M150 440H930V462H150Z" fill="#b9a986" opacity=".6"/>`
    +[176,904].map(x=>`<rect x="${x-22}" y="462" width="44" height="543" ${st('#e2d4b2',7)}/>`).join('')
    +`<path d="M440 1005V760Q540 670 640 760V1005Z" fill="#d8c9a8" stroke="${INK}" stroke-width="10"/><path d="M468 1005V772Q540 708 612 772V1005Z" fill="#1e2a36" stroke="${INK}" stroke-width="8"/>`
    +`<path d="M482 1003V782Q540 730 598 782V1003Z" fill="#9fd0ee" opacity="${N((.18+.08*Math.sin(t*3))*100)/100}"/>`
    +`<path d="M140 1005H940V1030H140Z" ${st('#bfb39a',7)}/><path d="M420 1030H660V1052H420Z" ${st('#cfc3a8',6)}/>`;
  const wx=lerp(70,500,seg(pu,0,1.15,E.io)), op=1-seg(pu,.75,1.05,E.io), A=walkPose(pu,2,1), H=full({hF:[50,-128],hB:[40,-126],handF:'hold',handB:'hold'});
  g+=`<g opacity="${N(op*100)/100}">`+toon('porter',wx,GY,.85,1,{...A,hF:H.hF,hB:H.hB,handF:'hold',handB:'hold',expr:'determined'},t,26)+iceBlock(wx+98,GY-54,86,86,{drip:.5,t})+`</g>`;
  return FIN(lit(g,'#e6f0ff',.35),t,{paper:.14}); }
function sh8_c(pu,u,t){ const slam=.75, j=pu>slam?Math.exp(-(pu-slam)*9)*Math.sin((pu-slam)*46)*7:0, z=2.1, c={x:540,y:900+j,z,oy:760}; paint(ctx=>paintStone(ctx,t,{c}));
  const cl=seg(pu,.1,slam,E.i); let g='';
  g+=`<path d="M380 1000V700Q380 560 540 560Q700 560 700 700V1000Z" fill="#14100c" stroke="${INK}" stroke-width="9"/>`;
  g+=`<path d="M392 1000V704Q392 574 540 574Q688 574 688 704V1000Z" fill="#9fd0ee" opacity="${N(.35*(1-cl)*100)/100}"/>`;
  [[380,1],[700,-1]].forEach(([hx,d])=>{ const w=lerp(40,160,cl); g+=`<g transform="translate(${hx} 0)"><path d="M0 1000V700Q0 620 0 600L${d*w} 600V1000Z" ${st('#7a4e2a',8)}/>`+[640,760,880].map(y=>`<path d="M0 ${y}H${d*w}" stroke="#2a2a30" stroke-width="12"/>`).join('')+`</g>`; });
  g+=`<circle cx="540" cy="850" r="9" fill="#2a2a30" stroke="${INK}" stroke-width="3" opacity="${N(seg(pu,slam-.05,slam+.05)*100)/100}"/>`;
  /* the cold puff: out of the keyhole and the door seam the moment it slams, curling outward and fading */
  g+=[0,1,2,3,4,5,6,7].map(i=>{ const q=sat((pu-slam-.02-i*.035)/.9); if(q<=0||q>=1) return ''; const sd=i%2?1:-1, ang=(.25+.12*(i>>1))*sd, d=40+q*(120+i*14), r=16+q*(36+(i%3)*10);
    return `<circle cx="${N(540+Math.sin(ang)*d)}" cy="${N(850+Math.cos(ang)*d*.6-q*30)}" r="${N(r)}" fill="#eef8ff" opacity="${N((1-q)*(1-q)*.75*100)/100}"/>`; }).join('');
  g+=[0,1,2,3,4].map(i=>{ const q=sat((pu-slam-.1-i*.07)/.6); if(q<=0||q>=1) return ''; const x=540+(i-2)*46*q, y=850-60*q+(i%2)*30; return `<path d="M${N(x-9)} ${N(y)}H${N(x+9)}M${N(x)} ${N(y-9)}V${N(y+9)}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${N((1-q)*100)/100}"/>`; }).join('');
  return FIN(cam(c,g,760),t,{paper:.14,vig:.7}); }
function sh8(t){ const u=t-S(8), P=part(8,u); return P.i===0?sh8_a(P.pu,u,t):P.i===1?sh8_b(P.pu,u,t):sh8_c(P.pu,u,t); }

const CUT_EP={1:[['carried',-.05],['india',-.1],['twice',-.15]], 2:[['step',-.1],['two',-.1]], 3:[['one',-.3],['less',-.1]], 4:[['foot',-.3],['on',-.05],['hay',-.6]],
  5:[['ten',-.15],4.7], 6:[['with',-.07]], 7:[['four',-.1],['days',-.1],['almost',-.07]], 8:[['the',-.1],['house',-.1]]};
const CUT_HOLD_EP=[8];
const SEQ=[1,2,3,4,5,6,7,8].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
