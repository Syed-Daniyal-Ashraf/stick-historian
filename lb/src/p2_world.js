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
