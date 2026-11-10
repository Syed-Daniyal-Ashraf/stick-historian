/* ============================== Monopoly episode: sets and props (no Monopoly trademarks: the board drawn is
   Magie's 1904 patent layout - railroads, a "Go to Jail" corner and a "Public Park" corner - as public-domain reference) */
TC.judge={skin:'#e8c0a0',hair:'#d8d4cc',suit:true,top:'#1c1c22',topDk:'#121216',shirt:'#f4efe2',tie:'#1c1c22',pants:'#1c1c22',shoe:'#120c08',bald:true,glasses:true,mus:'thick',grey:.9,headS:1.2,build:.5};
const DOLLAR='#5f8f5a', DOLLAR_DK='#3f6a3c';
function wallpaper(col1,col2,u=0){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="${col1}"/>`;
  for(let r=0;r<16;r++) for(let c=0;c<9;c++){ const x=-120+c*150+(r%2)*75, y=-120+r*140; g+=`<path d="M${x} ${y-34}Q${x+22} ${y} ${x} ${y+34}Q${x-22} ${y} ${x} ${y-34}Z" fill="${col2}" opacity=".55"/><circle cx="${x}" cy="${y}" r="6" fill="${col2}" opacity=".7"/>`; }
  return g; }
function parlor(u,t){ let g=wallpaper('#7a3a3a','#9a5048');
  g+=`<rect x="-300" y="1260" width="1680" height="1800" fill="#5a3a26"/><rect x="-300" y="1240" width="1680" height="30" fill="#3a2418"/>`;
  for(let i=0;i<9;i++) g+=`<path d="M${-300+i*220} 1270L${-420+i*260} 2300" stroke="#4a2e1e" stroke-width="5"/>`;
  g+=`<rect x="640" y="230" width="340" height="520" rx="8" ${st('#fbe9b8',7)}/><rect x="640" y="230" width="340" height="520" fill="url(#gOutside)" opacity=".8"/><path d="M810 230V750M640 490H980" stroke="#5a3a26" stroke-width="12"/>`;
  g+=`<path d="M610 210Q660 480 620 780L700 780Q680 480 720 210Z" fill="#c8a23a" stroke="${INK}" stroke-width="5"/><path d="M1010 210Q960 480 1000 780L920 780Q940 480 900 210Z" fill="#c8a23a" stroke="${INK}" stroke-width="5"/>`;
  g+=`<g transform="translate(250 430)"><rect x="-110" y="-140" width="220" height="280" ${st('#c8a23a',8)}/><rect x="-86" y="-116" width="172" height="232" fill="#e8dcc0"/><circle cx="0" cy="-20" r="46" fill="#9a8a70"/><path d="M-60 100Q0 30 60 100Z" fill="#9a8a70"/></g>`;
  return g; }
function typewriter(x,y,s=1,u=0,typing=0){ const k=typing?Math.abs(Math.sin(u*28))*4:0; return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-130" y="-70" width="260" height="90" rx="20" ${st('#2a2a2a',6)}/><path d="M-110 -70L-90 -120H90L110 -70Z" ${st('#3a3a3a',5)}/><rect x="-80" y="-200" width="160" height="110" ${st('#fbf6ea',4)}/><path d="M-60 -170h${N(60+u*40%60)}M-60 -150h90M-60 -130h70" stroke="#5a5a5a" stroke-width="4"/>${[...Array(10)].map((_,i)=>`<circle cx="${-100+i*22}" cy="${-30+(i%2)*14+(i===3?k:0)}" r="9" fill="#e8e0cc" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="-150" y="-112" width="300" height="20" rx="8" ${st('#5a5a5a',4)}/></g>`; }
/* Magie's board, top-down: 9 spaces a side between corners */
function magieBoard(cx,cy,S,{title=true,houses=[],coins=[],tint=null,label='THE LANDLORD\'S GAME',draw=1}={}){ const h=S/2, c=S*.14, side=(S-2*c)/9;
  let g=`<g transform="translate(${cx} ${cy})"><rect x="${-h}" y="${-h}" width="${S}" height="${S}" rx="10" ${st('#f1e6c8',8)}/>`;
  const cols=['#c8572e','#2c5e8a','#5f8f3a','#c8a23a','#7a3a6a','#2a8a8a'];
  const tile=(x,y,w,hh,i,vertical)=>{ const band=i%3===1?'#3a3a3a':cols[i%6]; const rail=i===4; return `<rect x="${N(x)}" y="${N(y)}" width="${N(w)}" height="${N(hh)}" fill="#f8f0d8" stroke="${INK}" stroke-width="3"/>`+(rail?`<text x="${N(x+w/2)}" y="${N(y+hh/2+6)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(side*.22)}" fill="${INK}" transform="rotate(${vertical?90:0} ${N(x+w/2)} ${N(y+hh/2)})">RR</text>`:`<rect x="${N(x+(vertical?0:2))}" y="${N(y+(vertical?2:0))}" width="${N(vertical?w*.28:w-4)}" height="${N(vertical?hh-4:hh*.28)}" fill="${band}"/>`); };
  let n=0; const total=36, shown=Math.floor(draw*total);
  for(let i=0;i<9;i++){ if(n++<shown) g+=tile(-h+c+i*side,-h,side,c,i,false); }
  for(let i=0;i<9;i++){ if(n++<shown) g+=tile(h-c,-h+c+i*side,c,side,i+3,true); }
  for(let i=0;i<9;i++){ if(n++<shown) g+=tile(h-c-(i+1)*side,h-c,side,c,i+1,false); }
  for(let i=0;i<9;i++){ if(n++<shown) g+=tile(-h,h-c-(i+1)*side,c,side,i+5,true); }
  const corner=(x,y,t1,t2,col)=>`<rect x="${N(x)}" y="${N(y)}" width="${N(c)}" height="${N(c)}" fill="${col}" stroke="${INK}" stroke-width="4"/><text x="${N(x+c/2)}" y="${N(y+c/2-2)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(c*.17)}" fill="${INK}">${t1}</text><text x="${N(x+c/2)}" y="${N(y+c/2+c*.2)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(c*.17)}" fill="${INK}">${t2}</text>`;
  if(draw>=.25) g+=corner(-h,-h,'GO TO','JAIL','#e8b8a8');
  if(draw>=.5) g+=corner(h-c,-h,'PUBLIC','PARK','#b8d8a0');
  if(draw>=.75) g+=corner(h-c,h-c,'','','#f1e6c8');
  if(draw>=1) g+=corner(-h,h-c,'','','#f1e6c8');
  if(title&&draw>=1) g+=`<text y="${N(-S*.04)}" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="${N(S*.058)}" fill="${INK}">${label}</text><text y="${N(S*.06)}" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="${N(S*.035)}" fill="#6a5e48">PATENTED 1904 · L. J. MAGIE</text>`;
  for(const [hx,hy,col] of houses) g+=`<path d="M${hx-16} ${hy+12}V${hy-4}L${hx} ${hy-18}L${hx+16} ${hy-4}V${hy+12}Z" fill="${col||'#3f8a4a'}" stroke="${INK}" stroke-width="3.5"/>`;
  for(const [mx,my] of coins) g+=coin(mx,my,1);
  if(tint) g+=`<rect x="${-h}" y="${-h}" width="${S}" height="${S}" rx="10" fill="${tint}" opacity=".25"/>`;
  return g+`</g>`; }
const pawn=(x,y,col,s=1,lift=0)=>`<g transform="translate(${N(x)} ${N(y-lift)}) scale(${s})"><ellipse cx="0" cy="${N(26+lift)}" rx="26" ry="8" fill="#000" opacity=".2"/><path d="M-24 26Q-24 10 -12 4Q-20 -8 -14 -20Q0 -30 14 -20Q20 -8 12 4Q24 10 24 26Z" fill="${col}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-30" r="14" fill="${col}" stroke="${INK}" stroke-width="4"/><circle cx="-4" cy="-34" r="4" fill="#fff" opacity=".6"/></g>`;
const coin=(x,y,s=1)=>`<g transform="translate(${N(x)} ${N(y)}) scale(${s})"><circle r="15" fill="#f3c84a" stroke="${INK}" stroke-width="3.5"/><text y="6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="16" fill="#8a6a1a">$</text></g>`;
function bill(x,y,rot=0,s=1,val='$'){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-64" y="-30" width="128" height="60" rx="5" ${st('#cfe0c0',3.5)}/><rect x="-56" y="-22" width="112" height="44" rx="3" fill="none" stroke="${DOLLAR}" stroke-width="2.5"/><ellipse cx="0" cy="0" rx="17" ry="17" fill="${DOLLAR}" opacity=".5"/><text y="9" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="24" fill="${DOLLAR_DK}">${val}</text></g>`; }
function moneyRain(u,t0,n,seed,box=[-40,-200,1160,2100],spd=1){ let g=''; for(let i=0;i<n;i++){ const st0=t0+rnd(i+seed)*1.2, k=u-st0; if(k<0) continue; const x=box[0]+rnd(i*5+seed)*box[2]+Math.sin(k*2.4+i)*60, y=box[1]+k*(380+rnd(i)*260)*spd; if(y>box[1]+box[3]) continue;
  g+=bill(x,y,Math.sin(k*3+i)*40,.8+rnd(i+3)*.4); } return g; }
function moneyPile(x,y,s=1){ let g=`<g transform="translate(${x} ${y}) scale(${s})">`; for(let i=0;i<34;i++){ const r=Math.floor(Math.sqrt(i*2)); g+=bill(-170+((i*97)%340)*.95+r*4,-i*7-r*8,(i*37)%30-15,.9); } return g+`</g>`; }
function check(x,y,rot,s,amt='$500.00',payee='E. M. Phillips'){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-170" y="-70" width="340" height="140" rx="6" ${st('#e6efe0',4)}/><text x="-150" y="-36" font-family="${BAL}" font-weight="800" font-size="20" fill="#3a5a3a">PARKER BROTHERS · 1935</text><text x="-150" y="0" font-family="${BAL}" font-weight="700" font-size="18" fill="#5a6a5a">PAY TO</text><text x="-84" y="2" font-family="Kalam, ${BAL}" font-weight="700" font-size="25" fill="#1d3a8a">${payee}</text><rect x="46" y="-28" width="116" height="36" rx="4" fill="#fff" stroke="#3a5a3a" stroke-width="2.5"/><text x="104" y="-2" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="22" fill="${INK}">${amt}</text><path d="M-150 40h200" stroke="#9aa89a" stroke-width="3"/></g>`; }
function streetSet(u,t,sign={x:900,y:330,s:1,l1:'NO HELP',l2:'WANTED',l3:'1932'}){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#8a8e96"/>`;
  for(let r=0;r<22;r++) for(let c=0;c<9;c++){ const x=-150+c*150+(r%2)*75, y=-160+r*70; g+=`<rect x="${x}" y="${y}" width="140" height="62" rx="4" fill="${['#7a5a52','#6e5048','#835e54'][(r+c)%3]}" stroke="#4a3632" stroke-width="3"/>`; }
  g+=`<rect x="-300" y="1450" width="1680" height="1800" fill="#5a5a60"/><path d="M-300 1450H1380" stroke="${INK}" stroke-width="7"/>`;
  g+=`<g transform="translate(${sign.x} ${sign.y}) rotate(3) scale(${sign.s})"><rect x="-150" y="-110" width="300" height="${sign.l3?220:170}" ${st('#e8e0cc',5)}/><text y="-40" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="56" fill="${CRIM}">${sign.l1}</text><text y="20" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="56" fill="${CRIM}">${sign.l2}</text>${sign.l3?`<text y="80" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="28" fill="${INK}">${sign.l3}</text>`:''}</g>`;
  g+=`<path d="M160 1450V420" stroke="${INK}" stroke-width="22"/><path d="M160 1450V420" stroke="#3a3a40" stroke-width="12"/><path d="M110 420H210L190 360H130Z" ${st('#3a3a40',5)}/><circle cx="160" cy="440" r="24" fill="#ffe7a0" opacity=".9"/>`;
  return g; }
function kitchen(u,t){ let g=wallpaper('#d9c48a','#c9ae6a'); g+=`<rect x="-300" y="1300" width="1680" height="1800" fill="#7a5a3a"/>`;
  g+=`<path d="M540 -100V260" stroke="${INK}" stroke-width="5"/><path d="M460 260H620L580 200H500Z" ${st('#2c5e4a',5)}/><path d="M440 270L640 270L1000 1400L80 1400Z" fill="#ffe7a0" opacity=".14"/>`;
  return g; }
function parkerOffice(u,t){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#7a4e2e"/>`;
  for(let i=0;i<9;i++) g+=`<rect x="${-120+i*160}" y="160" width="140" height="1080" rx="6" fill="#86583a" stroke="#5a3a22" stroke-width="5"/>`;
  g+=`<rect x="-300" y="1300" width="1680" height="1800" fill="#3a2a1e"/>`;
  return g; }
function courtroom(u,t,slam=-9){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#c97a3a"/>`;
  for(let i=0;i<14;i++) g+=`<rect x="${-200+i*100}" y="-200" width="60" height="1600" fill="#b86a30" opacity=".6"/>`;
  g+=`<rect x="-300" y="1380" width="1680" height="1800" fill="#5a3a22"/><path d="M-300 1380H1380" stroke="${INK}" stroke-width="7"/>`;
  const bang=seg(u,slam-.14,slam,E.i)*(1-seg(u,slam+.05,slam+.35,E.o));
  g+=toon('judge',570,1420,1.7,1,{expr:bang>.3?'angry':'stern',look:[0,3],tilt:bang*8,lean:bang*6,hF:mix([40,-304],[80,-238],bang),handF:'hold',hB:[-30,-230],noShadow:true,
    holdF:{svg:`<g transform="rotate(${N(-60+bang*70)})"><rect x="-5" y="-70" width="10" height="80" rx="4" ${st('#8a5a32',3)}/><rect x="-26" y="-92" width="52" height="30" rx="8" ${st('#6a3e1e',4)}/></g>`,over:true}},t,9);
  g+=`<rect x="375" y="1040" width="420" height="36" rx="6" ${st('#8a5630',6)}/><rect x="395" y="1076" width="380" height="330" ${st('#6a3e1e',6)}/><rect x="435" y="1116" width="300" height="200" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/>`;
  return g; }
function gameBox(x,y,rot,s,title,sub,col){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-150" y="-100" width="300" height="200" rx="8" ${st(col,6)}/><rect x="-130" y="-80" width="260" height="160" rx="4" fill="none" stroke="#fff" stroke-width="4"/><text y="-6" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="32" fill="#fff">${title}</text><text y="38" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="22" fill="#fff">${sub}</text></g>`; }
function censusForm(u,k0,k1,k2){ let g=`<g transform="translate(540 980) rotate(-2)"><rect x="-440" y="-560" width="880" height="1120" ${st('#efe6cc',6)}/>`;
  g+=`<text y="-480" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="46" fill="${INK}">SIXTEENTH CENSUS OF THE</text><text y="-424" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="46" fill="${INK}">UNITED STATES: 1940</text>`;
  for(let i=0;i<12;i++) g+=`<path d="M-400 ${-360+i*70}H400" stroke="#b8ae94" stroke-width="3"/>`;
  for(let i=0;i<5;i++) g+=`<path d="M${-400+i*200} -360V420" stroke="#b8ae94" stroke-width="3"/>`;
  g+=`<text x="-380" y="-300" font-family="${BAL}" font-weight="700" font-size="30" fill="#5a5040">NAME</text><clipPath id="cf0"><rect x="-160" y="-350" width="${N(440*seg(u,k0,k0+.5,E.lin))}" height="70"/></clipPath><text x="-160" y="-300" clip-path="url(#cf0)" font-family="Kalam, ${BAL}" font-weight="700" font-size="40" fill="#1d3a6a">Phillips, Elizabeth</text>`;
  g+=`<text x="-380" y="-160" font-family="${BAL}" font-weight="700" font-size="30" fill="#5a5040">OCCUPATION</text>`;
  const w1=seg(u,k1,k1+.6,E.lin), w2=seg(u,k2,k2+.3,E.lin);
  g+=`<clipPath id="cf1"><rect x="-160" y="-210" width="${N(560*w1)}" height="80"/></clipPath><text x="-160" y="-150" clip-path="url(#cf1)" font-family="Kalam, ${BAL}" font-weight="700" font-size="52" fill="#1d3a6a">Maker of games</text>`;
  g+=`<text x="-380" y="0" font-family="${BAL}" font-weight="700" font-size="30" fill="#5a5040">INCOME</text>`;
  g+=`<clipPath id="cf2"><rect x="-160" y="-110" width="${N(400*w2)}" height="200"/></clipPath><text x="-140" y="40" clip-path="url(#cf2)" font-family="Kalam, ${BAL}" font-weight="700" font-size="140" fill="${CRIM}">0</text>`;
  return g+`</g>`; }
function bulb(x,y,k){ if(k<=0) return ''; const s=E.back(sat(k)); return `<g transform="translate(${x} ${y}) scale(${N(s*100)/100})"><circle r="44" fill="#ffe27a" stroke="${INK}" stroke-width="5"/><rect x="-18" y="40" width="36" height="26" rx="4" ${st('#9a9a9a',4)}/>${[...Array(8)].map((_,i)=>`<path d="M${N(Math.cos(i*.785)*62)} ${N(Math.sin(i*.785)*62)}L${N(Math.cos(i*.785)*86)} ${N(Math.sin(i*.785)*86)}" stroke="#ffe27a" stroke-width="8" stroke-linecap="round"/>`).join('')}</g>`; }
