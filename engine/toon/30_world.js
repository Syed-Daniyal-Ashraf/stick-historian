/* ============================== props */
const st=(f,w=5)=>`fill="${f}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
function fan(x,y,t,spd=7,s=1){ const a=t*spd*360; let g=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-90" width="12" height="70" ${st('#7a6a5a',4)}/>`;
  const bl=[]; for(let i=0;i<3;i++){ const th=rad(a+i*120), cx=Math.cos(th)*110, cy=Math.sin(th)*22; bl.push({cy,d:`<ellipse cx="${N(cx)}" cy="${N(cy+6)}" rx="${N(Math.abs(Math.cos(th))*70+18)}" ry="12" transform="rotate(${N(Math.sin(th)*6)} ${N(cx)} ${N(cy)})" ${st('#9a8a76',4)}/>`}); }
  bl.sort((p,q)=>p.cy-q.cy); g+=bl.filter(b=>b.cy<0).map(b=>b.d).join('')+`<ellipse cx="0" cy="0" rx="34" ry="16" ${st('#5a4a3a',4)}/><ellipse cx="0" cy="10" rx="20" ry="9" ${st('#3a2e24',3)}/>`+bl.filter(b=>b.cy>=0).map(b=>b.d).join('');
  if(spd>3) g+=`<ellipse cx="0" cy="6" rx="150" ry="30" fill="#fff" opacity=".07"/>`;
  return g+`</g>`; }
function calendar(x,y,yr,s=1,flip=0,rot=-2){ let g=`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 -96L0 -110L10 -96" fill="none" stroke="${INK}" stroke-width="4"/><rect x="-80" y="-96" width="160" height="200" rx="6" ${st('#fbf6ea')}/><rect x="-80" y="-96" width="160" height="46" rx="6" ${st(CRIM)}/><text y="-62" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="#fff">कैलेंडर</text><text y="10" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="58" fill="${INK}">${yr}</text>`;
  for(let r=0;r<3;r++) for(let c=0;c<6;c++) g+=`<rect x="${-62+c*21}" y="${32+r*20}" width="13" height="10" fill="#c9bfa8"/>`;
  if(flip>0&&flip<1){ const k=flip; g+=`<path d="M-80 -50L80 -50L${N(80-k*20)} ${N(104-k*240)}L${N(-80+k*10)} ${N(104-k*250)}Z" fill="#f2ead8" stroke="${INK}" stroke-width="4" opacity="${op(1.2-k)}"/>`; }
  return g+`</g>`; }
function clock(x,y,t,s=1,fast=0){ const hA=(t*fast*30+300)%360, mA=(t*fast*360+60)%360; return `<g transform="translate(${x} ${y}) scale(${s})"><circle r="62" ${st('#fbf6ea',6)}/><circle r="62" fill="none" stroke="#8a5a2a" stroke-width="10"/>${[...Array(12)].map((_,i)=>`<path d="M0 -48V-40" stroke="${INK}" stroke-width="4" transform="rotate(${i*30})"/>`).join('')}<path d="M0 0V-28" stroke="${INK}" stroke-width="7" stroke-linecap="round" transform="rotate(${N(hA)})"/><path d="M0 0V-44" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(${N(mA)})"/><circle r="6" fill="${INK}"/></g>`; }
/* loan form / generic paper */
const paper=(w=150,h=190,lines=6,col='#fbf6ea')=>`<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="3" ${st(col,4)}/>`+[...Array(lines)].map((_,i)=>`<path d="M${-w/2+18} ${-h/2+30+i*((h-50)/lines)}h${w-36-(i%3)*16}" stroke="#9a8e78" stroke-width="5" stroke-linecap="round"/>`).join('');
function note(x,y,rot=0,s=1,val='100'){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-70" y="-34" width="140" height="68" rx="5" ${st('#c9a06a',4)}/><rect x="-60" y="-24" width="120" height="48" rx="3" fill="none" stroke="#8a6a3a" stroke-width="2.5"/><circle cx="-30" cy="0" r="16" fill="#b08850" stroke="#7a5a2a" stroke-width="2.5"/><text x="26" y="12" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="#5a3a1a">₹${val}</text></g>`; }
/* ledger: open register lying on a counter (drawn flat-on, slightly skewed) */
function ledger(x,y,s,{entry=null,page=0,hl=0,finger=null}={}){ let g=`<g transform="translate(${x} ${y}) scale(${s}) skewX(-8)"><path d="M-170 -10L0 0L170 -10L170 -128L0 -118L-170 -128Z" ${st('#7a2e2a',5)}/><path d="M-160 -18L-4 -8V-122L-160 -132Z" ${st('#fbf3df',4)}/><path d="M4 -8L160 -18V-132L4 -122Z" ${st('#f7eed8',4)}/>`;
  for(let i=0;i<7;i++){ g+=`<path d="M-148 ${-34-i*13}L-16 ${-26-i*13}M16 ${-26-i*13}L148 ${-34-i*13}" stroke="#c9bb98" stroke-width="2.4"/>`; }
  for(let i=0;i<6;i++){ g+=`<path d="M-140 ${-38-i*13}l${50+((i*37)%40)} 2M24 ${-30-i*13}l${40+((i*53)%50)} -1" stroke="#5a6a8a" stroke-width="3.2" stroke-linecap="round"/>`; }
  if(entry){ g+=`<rect x="20" y="-66" width="128" height="22" fill="${MARI}" opacity="${N(hl*.55*100)/100}"/><text x="26" y="-49" font-family="Kalam, ${BAL}" font-weight="700" font-size="20" fill="#2a3a6a">${entry}</text>`; }
  if(page>0&&page<1){ const k=page, cx=lerp(160,-160,E.io(k)); g+=`<path d="M4 -8Q${N(cx*.6)} ${N(-30-Math.sin(k*Math.PI)*40)} ${N(cx)} ${N(-18+Math.sin(k*Math.PI)*-16)}V${N(-132+Math.sin(k*Math.PI)*-16)}Q${N(cx*.6)} ${N(-150-Math.sin(k*Math.PI)*40)} 4 -122Z" ${st('#fffaf0',3.5)}/>`; }
  return g+`</g>`; }
/* rubber stamp held in a hand (hand-local, pointing down) */
const stampProp=(col=CRIM)=>`<g><rect x="-14" y="-6" width="28" height="44" rx="12" ${st('#8a4a2a',4)}/><rect x="-26" y="34" width="52" height="16" rx="4" ${st('#5a3a2a',4)}/><rect x="-28" y="48" width="56" height="10" rx="3" fill="${col}" stroke="${INK}" stroke-width="3"/></g>`;
function speedLines(x,y,a,len,n,k,col='#fffaf0'){ if(k<=0) return ''; let g=''; for(let i=0;i<n;i++){ const th=rad(a+(i-n/2)*14), r0=60+((i*37)%30); g+=`<path d="M${N(x+Math.cos(th)*r0)} ${N(y+Math.sin(th)*r0)}L${N(x+Math.cos(th)*(r0+len*k))} ${N(y+Math.sin(th)*(r0+len*k))}" stroke="${col}" stroke-width="7" stroke-linecap="round" opacity="${op(1.5-k)}"/>`; } return g; }
function impact(x,y,k,s=1,col='#fff3c4'){ if(k<=0||k>=1) return ''; const r=lerp(30,150,E.o(k))*s; let g=''; for(let i=0;i<10;i++){ const th=rad(i*36+18); g+=`<path d="M${N(x+Math.cos(th)*r*.55)} ${N(y+Math.sin(th)*r*.55)}L${N(x+Math.cos(th)*r)} ${N(y+Math.sin(th)*r)}" stroke="${col}" stroke-width="${N(9*s*(1-k))}" stroke-linecap="round"/>`; } return g; }
function dust(n,u,box,seed,col='#fff3d0',sz=1){ let g=''; for(let i=0;i<n;i++){ const x=box[0]+(rnd(i*3+seed)*box[2]+Math.sin(u*.6+i)*30+u*8)%box[2], y=box[1]+(rnd(i*7+seed)*box[3]-u*12*(.4+rnd(i)))%box[3];
  const yy=y<box[1]?y+box[3]:y; g+=`<circle cx="${N(x)}" cy="${N(yy)}" r="${N((2+rnd(i+4)*3.5)*sz)}" fill="${col}" opacity="${N((.25+.5*Math.abs(Math.sin(u*1.3+i)))*100)/100}"/>`; } return g; }
const beam=(pts,op2=.22,col='#ffe6a8')=>`<path d="M${pts.map(p=>p.join(' ')).join('L')}Z" fill="${col}" opacity="${op2}" style="mix-blend-mode:screen"/>`;
function sweat(x,y,k,u,s=1){ if(k<=0) return ''; const b=Math.sin(u*6)*4; return `<g transform="translate(${N(x)} ${N(y+b)}) scale(${N(k*s*100)/100})"><path d="M0 -22Q13 -2 0 10Q-13 -2 0 -22Z" fill="#bfe6ff" stroke="${INK}" stroke-width="4"/></g>`; }
const qmark=(x,y,k,s=1,rot=8)=>k>0?`<g transform="translate(${N(x)} ${N(y)}) rotate(${rot}) scale(${N(E.back(sat(k))*s*100)/100})"><text text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="120" fill="${MARI}" stroke="${INK}" stroke-width="10" paint-order="stroke fill">?</text></g>`:'';

/* ============================== sets */
function bankSet(u,t){ let g=`<rect x="-200" y="-200" width="1480" height="2400" fill="url(#gBankWall)"/>`;
  g+=`<rect x="-200" y="980" width="1480" height="40" fill="#1a6460" opacity=".5"/>`;   // dado line
  for(let i=0;i<6;i++){ g+=`<ellipse cx="${N(80+rnd(i)*900)}" cy="${N(150+rnd(i+9)*700)}" rx="${N(30+rnd(i+3)*50)}" ry="${N(16+rnd(i+5)*20)}" fill="#7ac2b4" opacity=".18"/>`; }
  // window with bars and hot afternoon outside
  g+=`<rect x="40" y="240" width="330" height="470" rx="10" ${st('#ffd98a',7)}/><rect x="40" y="240" width="330" height="470" rx="10" fill="url(#gOutside)"/>`;
  g+=`<path d="M60 640Q140 600 210 640T360 630V700H60Z" fill="#7aa64a" opacity=".85"/><circle cx="300" cy="330" r="38" fill="#fff3c0" opacity=".8"/>`;
  for(let i=1;i<6;i++) g+=`<path d="M${40+i*55} 240V710" stroke="#5a4636" stroke-width="9"/>`;
  g+=`<rect x="40" y="240" width="330" height="470" rx="10" fill="none" stroke="#6a4a30" stroke-width="18"/><rect x="40" y="240" width="330" height="470" rx="10" fill="none" stroke="${INK}" stroke-width="5"/>`;
  g+=calendar(700,560,'1976',.9);
  g+=`<g transform="translate(860 520) rotate(2)"><rect x="-120" y="-44" width="240" height="88" rx="8" ${st('#2a2a2a',5)}/><text y="-4" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${MARI}">ऋण · LOANS</text><text y="30" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="22" fill="#e8e0cc">WINDOW 3</text></g>`;
  return g; }
function bankBeam(u){ return beam([[60,300],[370,300],[900,1500],[240,1500]],.16)+dust(26,u,[160,400,760,1100],5); }
/* counter seen front-on; returns [behind-the-grille, in-front] layers so the clerk can sit between */
function counter(){ let back=`<path d="M380 1120L1180 1120L1180 1186L380 1186Z" fill="#c99a5e" stroke="${INK}" stroke-width="5"/>`;
  let front=`<rect x="360" y="1180" width="860" height="760" fill="url(#gWood)" stroke="${INK}" stroke-width="6"/><rect x="350" y="1172" width="880" height="30" rx="6" ${st('#d9aa6a',6)}/>`;
  for(let i=0;i<4;i++) front+=`<rect x="${410+i*200}" y="1250" width="160" height="260" rx="10" fill="none" stroke="#5a3a1e" stroke-width="6"/>`;
  front+=`<rect x="540" y="1560" width="200" height="40" rx="5" fill="#d8b45a" stroke="${INK}" stroke-width="4"/>`;
  return {back,front}; }
function grille(){ let g=''; for(let i=0;i<14;i++){ const x=420+i*52; if(x>630&&x<1030) continue; g+=`<path d="M${x} 600V1176" stroke="#3a3a3a" stroke-width="9"/>`; }
  for(let i=0;i<8;i++){ const x=650+i*52; g+=`<path d="M${x} 600V700" stroke="#3a3a3a" stroke-width="9"/>`; }
  g+=`<path d="M630 1176V760Q630 700 690 700H970Q1030 700 1030 760V1176" fill="none" stroke="#5a4a3a" stroke-width="16"/><path d="M630 1176V760Q630 700 690 700H970Q1030 700 1030 760V1176" fill="none" stroke="${INK}" stroke-width="5"/><path d="M400 600H1100" stroke="#3a3a3a" stroke-width="12"/>`;
  return g; }
/* village (flashback + finale) */
function villageSet(u,t,{sun=1,grade='warm'}={}){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gVillSky)"/>`;
  g+=`<circle cx="820" cy="380" r="${N(110)}" fill="#ffe7a0" opacity=".9"/><circle cx="820" cy="380" r="190" fill="#ffe7a0" opacity=".18"/>`;
  g+=`<path d="M-300 900Q200 820 540 880T1380 860V1300H-300Z" fill="#c9a86a" opacity=".55"/>`;
  g+=`<path d="M-300 980Q300 930 700 960T1380 950V2300H-300Z" fill="url(#gField)"/>`;
  for(let i=0;i<9;i++){ g+=`<path d="M-300 ${1040+i*90}Q540 ${1010+i*90} 1380 ${1030+i*92}" fill="none" stroke="#8a9a3a" stroke-width="${6+i*1.5}" opacity=".45"/>`; }
  return g; }
function hut(x,y,s=1){ return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-190" width="300" height="190" ${st('#c98a5a',6)}/><path d="M-190 -170L0 -300L190 -170Z" ${st('#a8743a',6)}/><path d="M-170 -180L0 -290L170 -180" fill="none" stroke="#7a5228" stroke-width="5" stroke-dasharray="14 12"/><rect x="-40" y="-120" width="80" height="120" rx="6" ${st('#5a3a22',5)}/><rect x="70" y="-140" width="50" height="50" ${st('#3a2a1e',4)}/><path d="M-150 -40H150" stroke="#b07448" stroke-width="5"/></g>`; }
function neem(x,y,s=1,u=0){ const sw=Math.sin(u*1.2)*4; let g=`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 0Q-20 -200 -40 -330L30 -330Q12 -200 34 0Z" ${st('#6a4a2e',6)}/><path d="M-10 -260Q-80 -320 -150 -330M10 -280Q80 -330 140 -360" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-10 -260Q-80 -320 -150 -330M10 -280Q80 -330 140 -360" fill="none" stroke="#6a4a2e" stroke-width="12" stroke-linecap="round"/>`;
  const blobs=[[-180,-420,130],[0,-500,160],[170,-430,130],[-90,-560,120],[100,-590,120],[-260,-360,90],[250,-380,90]];
  for(const [bx,by,r] of blobs) g+=`<circle cx="${N(bx+sw)}" cy="${by}" r="${r}" ${st('#4f8a34',6)}/>`;
  for(const [bx,by,r] of blobs) g+=`<circle cx="${N(bx+sw-r*.25)}" cy="${by-r*.25}" r="${N(r*.55)}" fill="#6aa84a"/>`;
  return g+`</g>`; }
function charpai(x,y,s=1){ let g=`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-170 -70L170 -70L190 -40L-150 -40Z" ${st('#e8d4a0',5)}/>`;
  for(let i=0;i<9;i++) g+=`<path d="M${-160+i*40} -68L${-140+i*40} -42" stroke="#b89a60" stroke-width="3"/>`;
  g+=`<path d="M-160 -40V0M180 -40V0M-140 -70V-40" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-160 -40V0M180 -40V0" stroke="#7a4a24" stroke-width="9" stroke-linecap="round"/>`; return g+`</g>`; }
function officeSet(u,t){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gOffWall)"/>`;
  g+=`<rect x="-300" y="1380" width="1680" height="1000" fill="#8a7454"/><path d="M-300 1380H1380" stroke="${INK}" stroke-width="6"/>`;
  for(let i=0;i<8;i++) g+=`<path d="M${-300+i*240} 1380L${-560+i*320} 2300" stroke="#76603e" stroke-width="5"/>`;
  g+=`<rect x="80" y="260" width="220" height="150" rx="6" ${st('#e9dfc6',5)}/><text x="190" y="330" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="#6a2a2a">तहसील</text><text x="190" y="372" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="22" fill="${INK}">LAND RECORDS</text>`;
  return g; }
function fileStack(x,y,n,s=1,seed=0,tilt=0){ let g=`<g transform="translate(${x} ${y}) scale(${s})">`; for(let i=0;i<n;i++){ const dx=(rnd(i+seed)-.5)*22+tilt*i, c=['#d9c49a','#c9ae7a','#e2d2aa','#bfa47a'][i%4];
  g+=`<rect x="${N(-90+dx)}" y="${-30-i*30}" width="180" height="30" rx="3" ${st(c,4)}/><path d="M${N(-20+dx)} ${-30-i*30}V${-i*30}" stroke="#c8372d" stroke-width="5"/>`; } return g+`</g>`; }
/* ============================== more sets and props */
/* planted-foot walk adapted to the toon rig: x moves, feet plant, arms swing, chest bobs */
function strut(u,x0,x1,u0,u1,s,step=78,swing=1){ const w=walker(u,x0,x1,u0,u1,step,s); const sw=w.moving?clamp((w.p.hF[0]-8)/24,-1,1):0;
  return {x:w.x,moving:w.moving,p:{fF:[w.p.fF[0]+2,w.p.fF[1]],fB:[w.p.fB[0]-2,w.p.fB[1]],hy:w.p.hy*1.4,hF:[22+46*sw*swing,-112+Math.abs(sw)*10],hB:[-12-46*sw*swing,-114+Math.abs(sw)*10],lean:w.moving?5:0}}; }
/* a desk seen from the side-front (office, police station, pension counter) */
function desk(x,y,w=520,col='#8a5a32'){ return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-30" width="${w}" height="34" rx="6" ${st(shade(col,1.25),6)}/><rect x="${-w/2+20}" y="4" width="${w-40}" height="330" ${st(col,6)}/><rect x="${-w/2+50}" y="40" width="${w*.36}" height="110" rx="6" fill="none" stroke="${shade(col,.7)}" stroke-width="5"/><circle cx="${-w/2+50+w*.18}" cy="95" r="8" fill="#d8b45a" stroke="${INK}" stroke-width="3"/></g>`; }
function officeFacade(u){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gVillSky)"/>`;
  g+=`<rect x="-300" y="1500" width="1680" height="900" fill="#c9a86a"/><path d="M-300 1500H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=`<rect x="360" y="420" width="900" height="1080" ${st('#f1dfb4',7)}/><rect x="360" y="420" width="900" height="80" ${st('#c8372d',7)}/>`;
  for(let i=0;i<3;i++) g+=`<rect x="${430+i*260}" y="620" width="150" height="220" rx="75" ${st('#5f8fa8',6)}/><path d="M${505+i*260} 620V840M${430+i*260} 740H${580+i*260}" stroke="${INK}" stroke-width="5"/>`;
  g+=`<path d="M600 1500V1110Q600 960 760 960Q920 960 920 1110V1500Z" ${st('#6a3e1e',7)}/><path d="M760 980V1500" stroke="${INK}" stroke-width="5"/>`;
  g+=`<g transform="translate(810 900)"><rect x="-300" y="-56" width="600" height="112" rx="10" ${st('#1f5a4a',6)}/><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${MARI}">तहसील कार्यालय</text><text y="38" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="28" fill="#fffaf0">GOVERNMENT OFFICE</text></g>`;
  g+=`<path d="M560 1500h400v24h-400zM530 1524h460v26h-460z" ${st('#d9c49a',5)}/>`;
  return g; }
function bench(x,y,s=1){ return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-230" y="-120" width="460" height="28" rx="6" ${st('#9a6a3c',5)}/><rect x="-230" y="-230" width="460" height="22" rx="6" ${st('#9a6a3c',5)}/><path d="M-200 -92V0M200 -92V0M-200 -208V-120M200 -208V-120" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-200 -92V0M200 -92V0" stroke="#6a4424" stroke-width="7" stroke-linecap="round"/></g>`; }
function web(x,y,k,s=1){ if(k<=0) return ''; let g=''; const R=90*s*k; for(let i=0;i<7;i++){ const th=rad(90+i*15); g+=`<path d="M${x} ${y}L${N(x+Math.cos(th)*R)} ${N(y+Math.sin(th)*R)}" stroke="#fffaf0" stroke-width="2.5" opacity=".8"/>`; }
  for(let r=1;r<4;r++){ let d=''; for(let i=0;i<7;i++){ const th=rad(90+i*15), rr=R*r/4; d+=(i?'L':'M')+N(x+Math.cos(th)*rr)+' '+N(y+Math.sin(th)*rr); } g+=`<path d="${d}" fill="none" stroke="#fffaf0" stroke-width="2" opacity=".7"/>`; } return g; }
function fileCard(x,y,s,rot,{title='FILE 1976/LB',status='मृत · DEAD',col='#d9c49a'}={}){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><path d="M-170 -200H-40L-20 -230H80L100 -200H170V200H-170Z" ${st(col,6)}/><rect x="-140" y="-160" width="280" height="330" ${st('#fbf6ea',4)}/><text y="-110" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="${INK}">${title}</text><text y="-62" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="34" fill="#2a3a6a">लाल बिहारी</text>${[0,1,2].map(i=>`<path d="M-110 ${-20+i*34}h${200-i*40}" stroke="#9a8e78" stroke-width="5" stroke-linecap="round"/>`).join('')}<text y="130" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${CRIM}">${status}</text></g>`; }
/* top-down desk insert: wood, a document, a big arm coming in from off-screen */
function deskTop(){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#9a6236"/>`; for(let i=0;i<14;i++) g+=`<path d="M-300 ${i*150+40}Q540 ${i*150+(i%2?70:10)} 1380 ${i*150+40}" stroke="#7a4a26" stroke-width="5" fill="none" opacity=".6"/>`; return g; }
function bigArm(sh,hand,skin,sleeve,kind='hold',hold='',w=1){ w*=1.35; const mid=[lerp(sh[0],hand[0],.5)+50,lerp(sh[1],hand[1],.5)-30]; const d=`M${N(sh[0])} ${N(sh[1])}Q${N(mid[0])} ${N(mid[1])} ${N(hand[0])} ${N(hand[1])}`;
  const cuff=[lerp(mid[0],hand[0],.55),lerp(mid[1],hand[1],.55)], ds=`M${N(sh[0])} ${N(sh[1])}Q${N(mid[0])} ${N(mid[1])} ${N(cuff[0])} ${N(cuff[1])}`, a2=ang(mid,hand);
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${N(92*w)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${skin}" stroke-width="${N(74*w)}" stroke-linecap="round"/><path d="M${N(lerp(cuff[0],hand[0],.1))} ${N(lerp(cuff[1],hand[1],.1))}q${N(Math.cos(rad(a2+90))*20*w)} ${N(Math.sin(rad(a2+90))*20*w)} 0 0" stroke="${shade(skin,.8)}" stroke-width="6"/><path d="${ds}" fill="none" stroke="${INK}" stroke-width="${N(118*w)}" stroke-linecap="butt"/><path d="${ds}" fill="none" stroke="${sleeve}" stroke-width="${N(100*w)}" stroke-linecap="butt"/><path d="${ds}" fill="none" stroke="${shade(sleeve,.85)}" stroke-width="${N(30*w)}" stroke-linecap="butt" transform="translate(${N(Math.cos(rad(a2-90))*30*w)} ${N(Math.sin(rad(a2-90))*30*w)})" opacity=".7"/>`+
    `<g transform="translate(${N(hand[0])} ${N(hand[1])}) scale(${N(3.4*w*100)/100})">${hold}${mitt([0,0],ang(mid,hand),kind,skin,false)}</g>`; }
function cinemaSet(u,t){ const fl=.75+.25*Math.sin(t*23)*Math.sin(t*7.3);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gCinema)"/>`;
  g+=`<rect x="80" y="160" width="920" height="520" rx="10" fill="#e8f0ff" opacity="${N(fl*100)/100}"/><rect x="80" y="160" width="920" height="520" rx="10" fill="none" stroke="#4a2030" stroke-width="16"/>`;
  g+=`<g opacity="${N((.5+.4*fl)*100)/100}"><path d="M200 640Q300 420 420 640Z" fill="#9fb0d0"/><circle cx="700" cy="420" r="90" fill="#c8d2ea"/><path d="M560 640L700 500L860 640Z" fill="#aab8d8"/></g>`;
  g+=`<path d="M540 -100L80 160L1000 160Z" fill="#fff8d8" opacity="${N(fl*.08*100)/100}"/>`;
  g+=`<path d="M-300 520Q540 500 1380 520V2300H-300Z" fill="#000" opacity=".25"/>`;
  return g; }
function seatRow(y,s=1,col='#7a1e2a'){ let g=''; for(let i=-1;i<7;i++){ const x=i*190+40; g+=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-200" width="160" height="210" rx="34" ${st(col,6)}/><rect x="-70" y="-190" width="140" height="70" rx="26" fill="${shade(col,1.25)}"/></g>`; } return g; }
function copSet(u,t){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gCop)"/>`;
  g+=`<rect x="-300" y="1360" width="1680" height="1000" fill="#7a6a4a"/><path d="M-300 1360H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=`<g transform="translate(300 380)"><rect x="-210" y="-70" width="420" height="140" rx="10" ${st('#1d3a6a',6)}/><text y="-8" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="56" fill="#fffaf0">थाना</text><text y="44" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="34" fill="${MARI}">POLICE STATION</text></g>`;
  g+=`<g transform="translate(850 420) rotate(3)"><rect x="-110" y="-140" width="220" height="280" ${st('#f4ecd8',5)}/><text y="-90" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${CRIM}">WANTED</text><circle cx="0" cy="0" r="50" fill="#c9bfa8"/><path d="M-60 90h120" stroke="#9a8e78" stroke-width="6"/></g>`;
  return g; }
function lathi(len=260){ return `<path d="M0 0L0 ${len}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M0 0L0 ${len}" stroke="#a8743a" stroke-width="10" stroke-linecap="round"/>`; }
function rickshaw(x,y,s,u){ const wr=u*240; return `<g transform="translate(${x} ${y}) scale(${s})"><g transform="translate(-230 -110) rotate(${N(wr)})"><circle r="110" fill="none" stroke="${INK}" stroke-width="14"/>${[0,45,90,135].map(a=>`<path d="M0 -104V104" stroke="${INK}" stroke-width="4" transform="rotate(${a})"/>`).join('')}</g><g transform="translate(250 -110) rotate(${N(wr)})"><circle r="110" fill="none" stroke="${INK}" stroke-width="14"/>${[0,45,90,135].map(a=>`<path d="M0 -104V104" stroke="${INK}" stroke-width="4" transform="rotate(${a})"/>`).join('')}</g>
  <path d="M-330 -230H330L300 -140H-300Z" ${st('#2c7a5a',6)}/><rect x="-300" y="-560" width="600" height="330" rx="14" ${st('#f7ebd4',6)}/><text y="-480" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="${CRIM}">VOTE</text><text y="-390" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="58" fill="${INK}">LAL BIHARI</text><text y="-300" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="64" fill="${TEAL}">'मृतक'</text>
  ${[...Array(9)].map((_,i)=>`<circle cx="${-280+i*70}" cy="${-560+Math.sin(i)*6}" r="22" fill="${i%2?SAFF:MARI}" stroke="${INK}" stroke-width="4"/>`).join('')}</g>`; }
function horn(x,y,s=1,rot=0){ return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 -14L120 -60V60L0 14Z" ${st('#c9c9c9',5)}/><ellipse cx="120" cy="0" rx="16" ry="60" ${st('#8a8a8a',5)}/><rect x="-30" y="-16" width="34" height="32" rx="6" ${st('#5a5a5a',4)}/></g>`; }
function petals(n,u,t0,seed,box=[-60,-200,1200,2300]){ let g=''; for(let i=0;i<n;i++){ const st0=t0+rnd(i+seed)*.8, k=u-st0; if(k<0) continue; const x=box[0]+rnd(i*5+seed)*box[2]+Math.sin(k*3+i)*40, y=box[1]+k*(260+rnd(i)*240); if(y>box[1]+box[3]) continue;
  g+=`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(k*200*(rnd(i+7)-.5)+i*40)})"><ellipse rx="${N(14+rnd(i+2)*8)}" ry="9" fill="${i%3?SAFF:MARI}" stroke="${shade(SAFF,.7)}" stroke-width="2.5"/></g>`; } return g; }
function burst(cx,cy,u,col1='#ffd25a',col2='#f6a23a',n=16){ let g=`<rect x="-400" y="-400" width="1880" height="2800" fill="${col2}"/>`; const r0=u*12; for(let i=0;i<n;i++){ const a=rad(i*360/n+r0), b=rad((i+.5)*360/n+r0); g+=`<path d="M${cx} ${cy}L${N(cx+Math.cos(a)*2400)} ${N(cy+Math.sin(a)*2400)}L${N(cx+Math.cos(b)*2400)} ${N(cy+Math.sin(b)*2400)}Z" fill="${col1}"/>`; } return g; }
function placard(txt,sub,col,w=300){ return `<g><path d="M0 0V300" stroke="${INK}" stroke-width="16"/><path d="M0 0V300" stroke="#8a5a2a" stroke-width="8"/><rect x="${-w/2}" y="-150" width="${w}" height="160" rx="10" ${st('#fbf6ea',6)}/><text y="-78" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${col}">${txt}</text><text y="-26" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="30" fill="${INK}">${sub}</text></g>`; }
function plough(x,y,s=1){ return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-160 -150L120 -10" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M-160 -150L120 -10" stroke="#8a5a2a" stroke-width="11" stroke-linecap="round"/><path d="M100 -30L150 10L80 6Z" ${st('#7a7a7a',5)}/><path d="M-170 -160L-200 -200" stroke="${INK}" stroke-width="16" stroke-linecap="round"/></g>`; }
/* ---- courtroom + judge (shared by mo/ and yo/). slam = time (episode seconds) of the gavel blow. */
TC.judge={skin:'#e8c0a0',hair:'#d8d4cc',suit:true,top:'#1c1c22',topDk:'#121216',shirt:'#f4efe2',tie:'#1c1c22',pants:'#1c1c22',shoe:'#120c08',bald:true,glasses:true,mus:'thick',grey:.9,headS:1.2,build:.5};
function courtroom(u,t,slam=-9){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#c97a3a"/>`;
  for(let i=0;i<14;i++) g+=`<rect x="${-200+i*100}" y="-200" width="60" height="1600" fill="#b86a30" opacity=".6"/>`;
  g+=`<rect x="-300" y="1380" width="1680" height="1800" fill="#5a3a22"/><path d="M-300 1380H1380" stroke="${INK}" stroke-width="7"/>`;
  const bang=seg(u,slam-.14,slam,E.i)*(1-seg(u,slam+.05,slam+.35,E.o));
  g+=toon('judge',570,1420,1.7,1,{expr:bang>.3?'angry':'stern',look:[0,3],tilt:bang*8,lean:bang*6,hF:mix([40,-304],[80,-238],bang),handF:'hold',hB:[-30,-230],noShadow:true,
    holdF:{svg:`<g transform="rotate(${N(-60+bang*70)})"><rect x="-5" y="-70" width="10" height="80" rx="4" ${st('#8a5a32',3)}/><rect x="-26" y="-92" width="52" height="30" rx="8" ${st('#6a3e1e',4)}/></g>`,over:true}},t,9);
  g+=`<rect x="375" y="1040" width="420" height="36" rx="6" ${st('#8a5630',6)}/><rect x="395" y="1076" width="380" height="330" ${st('#6a3e1e',6)}/><rect x="435" y="1116" width="300" height="200" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/>`;
  return g; }
