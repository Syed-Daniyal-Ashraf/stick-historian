/* ============================== History Has Receipts #2: Theon's letter to his father (P.Oxy. I 119, Bodleian Library)
   Quotes on screen are Grenfell & Hunt's 1898 translation, verbatim. Reactions, rooms and boats are illustration. */
const CAM0={x:540,y:960,z:1};
const RED='#c0281e', INK='#1d1712', PAPY='#e8d6a6';

/* ---------- small helpers */
const fitSize=(txt,size,maxW)=>Math.min(size,size*maxW/textW(txt,size));
const fctx=document.createElement('canvas').getContext('2d');
const fellW=(txt,size)=>{ fctx.font=`italic ${size}px Fell, Georgia, serif`; return fctx.measureText(txt).width; };
const handDot=(h,col)=>`<circle cx="${N(h[0])}" cy="${N(h[1])}" r="9.5" fill="${col}" stroke="${OUT}" stroke-width="4"/>`;
const vig=()=>`<rect width="1080" height="1920" fill="url(#gVig)"/>`;
function inkRow(x,y,w,col,seed,k=1,sz=1){ let d='', cx=x, i=0;
  while(cx<x+w*k-6){ const r=rnd(seed*31+i), r2=rnd(seed*17+i*3), h=(14+r*16)*sz, ww=(10+r2*16)*sz;
    if(r<.33) d+=`M${N(cx)} ${N(y)}q${N(ww*.3)} ${N(-h)} ${N(ww)} ${N(-h*.3)}`;
    else if(r<.66) d+=`M${N(cx)} ${N(y-h)}v${N(h)}m${N(ww*.4)} 0q${N(ww*.4)} ${N(-h*.8)} ${N(ww*.6)} 0`;
    else d+=`M${N(cx)} ${N(y-h*.5)}h${N(ww)}m${N(-ww*.5)} ${N(-h*.5)}v${N(h)}`;
    cx+=ww+6*sz; i++; }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${N(4.5*sz)}" stroke-linecap="round" stroke-linejoin="round"/>`; }
// a papyrus sheet: fibre texture, ragged edges, rows of (decorative) uncial-like strokes
function papyrus(x,y,w,h,seed,rows=6,k=1){ let g=`<path d="M${x} ${y+6}L${x+w*.3} ${y}L${x+w*.7} ${y+5}L${x+w} ${y+2}L${x+w-4} ${y+h*.5}L${x+w} ${y+h}L${x+w*.6} ${y+h-6}L${x+w*.2} ${y+h}L${x+3} ${y+h-3}L${x} ${y+h*.5}Z" fill="${PAPY}" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/>`;
  let f=''; for(let i=1;i<9;i++) f+=`M${x+8} ${N(y+i*h/9)}H${x+w-8}`; for(let i=1;i<7;i++) f+=`M${N(x+i*w/7)} ${y+8}V${y+h-8}`; g+=`<path d="${f}" stroke="#c9b27a" stroke-width="2" opacity=".7"/>`;
  for(let r=0;r<rows;r++) g+=inkRow(x+w*.08,y+h*.16+r*h*.72/rows+12,w*.84,INK,seed+r,clamp(k*rows-r,0,1),w/600);
  return g; }
function lyre(x,y,s,k){ if(k<=0) return ''; return `<g transform="translate(${x} ${y}) scale(${N(s*lerp(.4,1,E.back(k))*100)/100}) rotate(${N((1-k)*30)})"><path d="M-60 60Q-90 -40 -50 -110M60 60Q90 -40 50 -110" fill="none" stroke="${OUT}" stroke-width="20" stroke-linecap="round"/><path d="M-60 60Q-90 -40 -50 -110M60 60Q90 -40 50 -110" fill="none" stroke="#c9a24a" stroke-width="12" stroke-linecap="round"/><path d="M-70 -80H70" stroke="${OUT}" stroke-width="14" stroke-linecap="round"/><path d="M-70 -80H70" stroke="#8a5a2a" stroke-width="8" stroke-linecap="round"/><rect x="-60" y="50" width="120" height="34" rx="12" fill="#8a5a2a" stroke="${OUT}" stroke-width="5"/>${[-36,-12,12,36].map(s=>`<path d="M${s} -80V54" stroke="#f4efe2" stroke-width="3"/>`).join('')}</g>`; }
function bowl(x,y){ return `<g transform="translate(${x} ${y})"><path d="M-60 -30Q-56 20 0 24Q56 20 60 -30Z" fill="#b8643a" stroke="${OUT}" stroke-width="5"/><ellipse cx="0" cy="-32" rx="58" ry="14" fill="#e9c46a" stroke="${OUT}" stroke-width="4"/><circle cx="-16" cy="-38" r="9" fill="#d98a3a" stroke="${OUT}" stroke-width="3"/><circle cx="14" cy="-40" r="8" fill="#8fb85a" stroke="${OUT}" stroke-width="3"/><path d="M-20 -60q6 -16 0 -30M10 -62q6 -16 0 -30" stroke="#ffffff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/></g>`; }
function puffs(x,y,u,k){ if(k<=0) return ''; let g=''; for(let i=0;i<3;i++){ const q=(u*1.8+i/3)%1; g+=`<circle cx="${N(x+(i-1)*34+Math.sin(u*6+i)*6)}" cy="${N(y-q*90)}" r="${N(14+q*16)}" fill="#f2f2f2" stroke="${OUT}" stroke-width="3" opacity="${N(k*(1-q)*100)/100}"/>`; } return g; }

/* ---------- sets */
const nileBack=()=>memo('nile',()=>{ let g=`<rect x="-900" y="-400" width="2900" height="2700" fill="url(#gNileSky)"/>`;
  g+=`<circle cx="860" cy="330" r="90" fill="#fff1b8" opacity=".8"/>`;
  g+=`<path d="M-900 1180Q-300 1140 300 1170T1500 1160T2000 1170V1260H-900Z" fill="#c9a86a"/>`;
  for(let i=0;i<9;i++){ const x=-700+i*330+rnd(i)*80, h=200+rnd(i+5)*120; g+=`<path d="M${x} 1180Q${x-6} ${1180-h*.5} ${x+8} ${1180-h}" stroke="#6b4a2a" stroke-width="10" fill="none"/>`+[0,1,2,3,4].map(j=>{ const a=-2.6+j*.55; return `<path d="M${x+8} ${1180-h}q${N(Math.cos(a)*70)} ${N(Math.sin(a)*30)} ${N(Math.cos(a)*110)} ${N(Math.sin(a)*10+40)}" stroke="#4f7a3a" stroke-width="12" fill="none" stroke-linecap="round"/>`; }).join(''); }
  g+=`<rect x="-900" y="1250" width="2900" height="1300" fill="#4f8fa8"/>`; return g; });
function waves(u){ let d=''; for(let r=0;r<8;r++){ const y=1300+r*80, off=((u*(40+r*8))%160); for(let c=-2;c<16;c++) d+=`M${N(-900+c*160+off+(r%2)*80)} ${y}q20 -10 40 0`; } return `<path d="${d}" stroke="#d9eef4" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`; }
const dock=()=>memo('dock',()=>{ let g=`<rect x="-500" y="1500" width="900" height="40" fill="#8a5a2a" stroke="${OUT}" stroke-width="6"/>`; let d=''; for(let x=-480;x<400;x+=70) d+=`M${x} 1500v40`; g+=`<path d="${d}" stroke="#5a3a1e" stroke-width="4"/>`; for(const x of [-200,100,360]) g+=`<rect x="${x}" y="1540" width="26" height="260" fill="#6a4224" stroke="${OUT}" stroke-width="5"/>`; return g; });
function boat(x,y,u,actor){ const bob=Math.sin(u*2.4)*6;
  let g=`<g transform="translate(${N(x)} ${N(y+bob)})"><path d="M-10 -40V-520" stroke="${OUT}" stroke-width="16"/><path d="M-10 -40V-520" stroke="#6a4224" stroke-width="9"/><path d="M-180 -480H170L150 -170H-160Z" fill="#efe2c2" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-170 -380H160M-166 -280H156" stroke="#c0281e" stroke-width="12"/>`;
  g+=actor||'';
  g+=`<path d="M-330 -40H330Q300 60 180 80H-180Q-300 60 -330 -40Z" fill="#9a6a3a" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/><path d="M-300 0H300" stroke="#6a4224" stroke-width="5"/></g>`;
  return g; }
const homeBack=()=>memo('home',()=>{ let g=`<rect x="-600" y="-400" width="2300" height="2700" fill="#e7cf9f"/>`;
  g+=`<rect x="640" y="560" width="260" height="320" fill="#9cc6dc" stroke="${OUT}" stroke-width="8"/><path d="M770 560V880M640 720H900" stroke="#8a6a3a" stroke-width="8"/>`;
  g+=`<rect x="80" y="840" width="380" height="20" fill="#8a5a2a" stroke="${OUT}" stroke-width="5"/>`+[0,1,2].map(i=>`<path d="M${120+i*120} 840q-30 -60 0 -110h40q30 50 0 110Z" fill="${['#b8643a','#c98a4a','#9a6a3a'][i]}" stroke="${OUT}" stroke-width="5"/>`).join('');
  g+=`<rect x="-600" y="1500" width="2300" height="900" fill="#c49a68"/><path d="M-600 1500H1700" stroke="${OUT}" stroke-width="6"/>`; let d=''; for(let x=-600;x<1700;x+=150) d+=`M${x} 1500l-80 420`; g+=`<path d="${d}" stroke="#a8804e" stroke-width="5"/>`; return g; });
const lowTable=()=>`<rect x="420" y="1400" width="460" height="30" rx="6" fill="#9a6a3a" stroke="${OUT}" stroke-width="6"/><rect x="450" y="1430" width="30" height="72" fill="#7a4e2a" stroke="${OUT}" stroke-width="5"/><rect x="820" y="1430" width="30" height="72" fill="#7a4e2a" stroke="${OUT}" stroke-width="5"/>`;
const studyBack=()=>memo('study',()=>{ let g=`<rect x="-600" y="-400" width="2300" height="2700" fill="#5a3f33"/>`;
  for(let s=0;s<4;s++){ const y=380+s*250; g+=`<rect x="-200" y="${y+200}" width="760" height="22" fill="#3a2820" stroke="${OUT}" stroke-width="4"/>`; for(let b=0;b<14;b++){ const h=120+rnd(s*20+b)*70, w=34+rnd(b+s)*16; g+=`<rect x="${-180+b*52}" y="${N(y+200-h)}" width="${N(w)}" height="${N(h)}" fill="${['#7a2f2a','#2f4a5a','#5a5a2a','#4a2f4a','#8a6a3a'][(b+s)%5]}" stroke="${OUT}" stroke-width="3"/>`; } }
  g+=`<rect x="640" y="420" width="300" height="440" fill="#283848" stroke="${OUT}" stroke-width="8"/><path d="M790 420V860M640 640H940" stroke="#5a3f33" stroke-width="10"/><circle cx="880" cy="500" r="26" fill="#f4ecd8"/>`;
  g+=`<rect x="-600" y="1500" width="2300" height="900" fill="#3a2a22"/>`; return g; });
const desk=()=>`<rect x="160" y="1330" width="760" height="40" fill="#7a4e2a" stroke="${OUT}" stroke-width="6"/><rect x="190" y="1370" width="40" height="160" fill="#5e3a1e" stroke="${OUT}" stroke-width="5"/><rect x="850" y="1370" width="40" height="160" fill="#5e3a1e" stroke="${OUT}" stroke-width="5"/><g transform="translate(820 1330)"><rect x="-14" y="-110" width="28" height="110" fill="#c9a24a" stroke="${OUT}" stroke-width="4"/><path d="M-50 -110L50 -110L30 -170L-30 -170Z" fill="#3f7a4a" stroke="${OUT}" stroke-width="5"/><ellipse cx="0" cy="-100" rx="60" ry="22" fill="#ffe7a8" opacity=".5"/></g>`;

/* ============================== shot 1: dad sails off; Theon is left on the dock */
function rDock(t){ const u=t-S(1), D=SE(1)-S(1), kw=cu(1,'without');
  const cam=keys(u,[[0,{x:520,y:1180,z:1.05}],[kw-.2,{x:560,y:1180,z:1.05}],[kw+.3,{x:300,y:1240,z:1.55},E.io],[D,{x:300,y:1240,z:1.6}]]);
  const bx=lerp(560,1500,seg(u,0,D,E.i));
  const dadP={lean:-4,tilt:-6,hB:[-6,-132],hF:wave(u,0,22),expr:'happy',look:[-2,0]};
  const dadSvg=fig('dad',60,-40,1.15,-1,add(dadP,idle(t,2)),t,4);
  const stomp=seg(u,kw+.05,kw+.2)*(1-seg(u,kw+.2,kw+.4));
  const tap=Math.max(0,Math.sin(u*10))*10*(u<kw?1:0);
  const kp={...P('cross'),expr:u<kw?'stern':'angry',lean:-2,tilt:u<kw?-4:6,fF:[22,-tap-stomp*40],look:[3,0]};
  const kid=fig('theon',250,1500,1.25,1,add(kp,idle(t,1)),t,3);
  const hd=headPos(250,1500,1.25,1,kp);
  return `<rect width="1080" height="1920" fill="#7fb6d8"/>`+layer(cam,CAM0,.7,nileBack())+layer(cam,CAM0,.9,waves(u))+layer(cam,CAM0,1,boat(bx,1290,u,dadSvg)+dock()+kid+puffs(hd[0],hd[1]-60,u,seg(u,kw+.1,kw+.4)))+vig(); }

/* ============================== shot 2: he writes the letter; the sarcastic opening line */
function rWrite(t){ const u=t-S(2), D=SE(2)-S(2), ks=cu(2,'sarcasm');
  const cam=keys(u,[[0,{x:580,y:1200,z:1.3}],[ks,{x:600,y:1160,z:1.5},E.io],[D,{x:600,y:1150,z:1.56}]]);
  const scr=Math.sin(u*22)*10, sm=seg(u,ks-.1,ks+.25,E.o);
  const writing=u<ks-.1||u>ks+1.6;
  const p={lean:24-sm*20,tilt:14-sm*22,hx:0,hy:62,fB:[-80,-4],fF:[-44,-2],hB:[64,-92],hF:writing?[96+scr,-96-Math.abs(scr)*.4]:[90,-200],expr:sm>.5?'smile':'angry',look:sm>.5?[3,-1]:[3,4]};
  const pen=writing?`<path d="M${N(p.hF[0])} ${N(p.hF[1])}L${N(p.hF[0]+30)} ${N(p.hF[1]-60)}" stroke="#c9a24a" stroke-width="6" stroke-linecap="round"/>`:'';
  const kid=fig('theon',470,1500,1.6,1,add(p,idle(t,1)),t,3);
  return `<rect width="1080" height="1920" fill="#e7cf9f"/>`+layer(cam,CAM0,.85,homeBack())+layer(cam,CAM0,1,kid+lowTable()+papyrus(560,1340,200,62,30,3,seg(u,.2,ks))+`<circle cx="800" cy="1384" r="16" fill="#2a2a2a" stroke="${OUT}" stroke-width="4"/>`+(writing?`<g transform="translate(470 1500) scale(1.6)">${pen}${handDot(p.hF,'#b57a50')}</g>`:''))+vig(); }

/* ============================== shot 3: the threats (dad reads them), the demand, the hunger strike */
function rThreats(t){ const u=t-S(3), D=SE(3)-S(3), kl=cu(3,'letters'), kt=cu(3,'talking'), kg=cu(3,'goodbye'), kd=cu(3,'demand'), ks=cu(3,'hunger');
  const cutA=kd-.65, cutB=ks-.35;
  if(u<cutA){ // dad reading on the deck, reactions escalate
    const lvl=u<kl?0:u<kt?1:u<kg?2:3;
    const cam=keys(u,[[0,{x:520,y:1150,z:1.35}],[kl,{x:520,y:1110,z:1.45},E.o],[kt,{x:520,y:1080,z:1.6},E.o],[kg,{x:520,y:1040,z:1.8},E.o],[cutA,{x:520,y:1040,z:1.84}]]);
    const ex=['content','meh','worried','shock'][lvl];
    const dp={lean:4-lvl*3,tilt:6-lvl*5,hB:[56,-236],hF:[60,-150],expr:ex,look:[3,2-lvl],mouth:lvl===3?.5:null,scroll:110};
    const dad=fig('dad',440,1500,1.5,1,add(dp,idle(t,2)),t,4);
    return `<rect width="1080" height="1920" fill="#7fb6d8"/>`+layer(cam,CAM0,.7,nileBack())+layer(cam,CAM0,.9,waves(u))+layer(cam,CAM0,1,`<path d="M-400 1500H1500V1900H-400Z" fill="#9a6a3a" stroke="${OUT}" stroke-width="7"/><path d="M-400 1560H1500" stroke="#6a4224" stroke-width="5"/>`+dad+sweat(...headPos(440,1500,1.5,1,dp).map((v,i)=>v+(i?-40:50)),lvl>=2?1:0,u))+vig(); }
  if(u<cutB){ // the demand: on his knees, pleading
    const v=u-cutA, cam={x:560,y:1170,z:1.5}, sh=Math.sin(v*14)*4;
    const p={lean:-6,tilt:-14,hy:70,fB:[-70,-4],fF:[-36,-2],hB:[34+sh,-212],hF:[44-sh,-216],expr:'worried',look:[2,-4]};
    return `<rect width="1080" height="1920" fill="#e7cf9f"/>`+layer(cam,CAM0,.85,homeBack())+layer(cam,CAM0,1,fig('theon',460,1500,1.6,1,p,t,3)+lyre(800,1260,1.1,seg(u,kd+.15,kd+.5)))+vig(); }
  // the hunger strike: flat on the floor, arms crossed, bowl untouched; mother walks past
  const v=u-cutB, cam={x:560,y:1260,z:1.45};
  const turn=seg(v,.3,.5)*(1-seg(v,2.6,2.8));
  const kp={noShadow:true,lean:0,tilt:-30*turn,hB:[30,-198],hF:[24,-208],expr:'angry',look:[0,-3],fF:[18,0],fB:[-20,0]};
  const mw=walker(v,1300,-200,1.2,3.6,64,1.2);
  const mp={...mw.p,expr:'meh',look:[-3,1],lean:2};
  return `<rect width="1080" height="1920" fill="#e7cf9f"/>`+layer(cam,CAM0,.85,homeBack())+layer(cam,CAM0,1,fig('mom',mw.x,1500,1.2,-1,mp,t,9)+`<g transform="translate(760 1480) rotate(-90)">${fig('theon',0,0,1.5,1,kp,t,3)}</g>`+bowl(860,1470))+vig(); }

/* ============================== shot 4: "Prove it." */
function rMascot(t){ const u=t-S(4);
  const x=lerp(1350,640,seg(u,0,.35,E.back));
  const p=keys(u,[[0,{lean:-10,tilt:-6,hB:[-6,-132],hF:[40,-250],expr:'meh',look:[-2,0]}],[.8,{lean:-6,tilt:8,hB:[-6,-132],hF:[46,-262],expr:'stern',look:[-3,1]},E.io],[3,{lean:-6,tilt:8,hB:[-6,-132],hF:[46,-262],expr:'stern',look:[-3,1]}]]);
  const glass=`<g transform="translate(${N(p.hF[0])} ${N(p.hF[1])})"><path d="M0 0L-24 46" stroke="#5a3a1e" stroke-width="10" stroke-linecap="round"/><circle cx="14" cy="-28" r="30" fill="#cfe8f2" fill-opacity=".5" stroke="${OUT}" stroke-width="7"/></g>`;
  return `<rect width="1080" height="1920" fill="#4c5a54"/>`+fig('mascot',x,2060,3.3,-1,add(p,idle(t,7)),t,12,glass)+vig(); }

/* ============================== shot 5: the receipt (redrawn) and the stamp */
function rReceipt(t){ const u=t-S(5), kr=cu(5,'real');
  const cam=keys(u,[[0,{x:540,y:1000,z:1.0}],[kr,{x:540,y:980,z:1.12},E.io],[SE(5)-S(5),{x:550,y:990,z:1.16}]]);
  let g=`<rect width="1080" height="1920" fill="#1e1c1f"/><ellipse cx="540" cy="980" rx="600" ry="780" fill="#3a3530" opacity=".9"/>`;
  g+=layer(cam,CAM0,1,`<rect x="190" y="560" width="700" height="820" rx="10" fill="#2a2622" stroke="${OUT}" stroke-width="8"/>`+papyrus(260,640,560,700,60,9)+`<rect x="190" y="560" width="700" height="820" rx="10" fill="url(#gGlass)" stroke="#9aa0a6" stroke-width="5"/>`+`<g transform="translate(540 1500)"><rect x="-340" y="-60" width="680" height="150" rx="8" fill="#efe6d0" stroke="${OUT}" stroke-width="5"/><text y="0" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="44" letter-spacing="3" fill="#2a2a2a">BODLEIAN LIBRARY · P.OXY. I 119</text><text y="44" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="25" letter-spacing="2" fill="#5a5048">PAPYRUS · OXYRHYNCHUS · 2ND–3RD CENTURY AD · REDRAWN</text></g>`);
  const st=kr-.25;
  const mp=keys(u,[[0,{lean:6,tilt:4,hB:[-6,-132],hF:[60,-280],expr:'stern',look:[-2,1]}],[st,{lean:14,tilt:10,hB:[-6,-132],hF:[80,-170],expr:'stern',look:[-2,2]},E.i],[st+.3,{lean:2,tilt:0,hB:[-6,-132],hF:[40,-210],expr:'smile',look:[-2,0]}],[9,{lean:2,tilt:0,hB:[-6,-132],hF:[40,-210],expr:'smile',look:[-2,0]}]]);
  const tool=u<st+.35?`<g transform="translate(${N(mp.hF[0])} ${N(mp.hF[1])})"><rect x="-10" y="-46" width="20" height="40" rx="6" fill="#7a4e2a" stroke="${OUT}" stroke-width="3"/><rect x="-24" y="-8" width="48" height="16" rx="3" fill="#2a2a2a" stroke="${OUT}" stroke-width="3"/></g>`:'';
  g+=fig('mascot',985,1890,2.1,-1,add(mp,idle(t,7)),t,12,tool);
  return g+vig(); }

/* ============================== shot 6: Oxford, 1898: the editors' note; Theon reacts */
function rRoast(t){ const u=t-S(6), D=SE(6)-S(6), kr=cu(6,'roasted');
  if(u<kr-.15){
    const cam=keys(u,[[0,{x:540,y:1200,z:1.3}],[kr,{x:560,y:1180,z:1.42}]]);
    const wr=Math.sin(u*18)*6, kn=cu(6,'note');
    const gp={lean:14,tilt:12,hB:[60,-150],hF:[84,-200],expr:u>kn?'content':'stern',look:[3,4]};
    const hp={lean:10,tilt:8,hB:[40,-150],hF:[96+wr,-140],expr:u>kn?'smile':'stern',look:[3,3]};
    const glass=`<g transform="translate(${N(gp.hF[0])} ${N(gp.hF[1])})"><path d="M0 0L-10 40" stroke="#5a3a1e" stroke-width="8" stroke-linecap="round"/><circle cx="16" cy="-20" r="22" fill="#cfe8f2" fill-opacity=".5" stroke="${OUT}" stroke-width="6"/></g>`;
    const pen=`<path d="M${N(hp.hF[0])} ${N(hp.hF[1])}L${N(hp.hF[0]+24)} ${N(hp.hF[1]-50)}" stroke="#1d1712" stroke-width="5" stroke-linecap="round"/>`+handDot(hp.hF,'#eec29c');
    return `<rect width="1080" height="1920" fill="#5a3f33"/>`+layer(cam,CAM0,.85,studyBack())+layer(cam,CAM0,1,fig('grenfell',300,1560,1.5,1,add(gp,idle(t,4)),t,5,glass)+fig('hunt',760,1560,1.5,-1,add(hp,idle(t,6)),t,6,pen)+desk()+papyrus(380,1290,150,44,61,2)+`<rect x="600" y="1300" width="160" height="34" fill="#f4efe2" stroke="${OUT}" stroke-width="4"/>`)+vig(); }
  // back in Roman Egypt: Theon takes it personally
  const v=u-kr+.15, cam={x:580,y:1180,z:1.6};
  const p=keys(v,[[0,{lean:-14,tilt:-16,hy:62,fB:[-80,-4],fF:[-44,-2],hB:[40,-230],hF:[70,-226],expr:'shock',mouth:1,look:[-3,-2]}],[1.4,{lean:-10,tilt:-10,hy:62,fB:[-80,-4],fF:[-44,-2],hB:[40,-230],hF:[70,-226],expr:'shock',mouth:.7,look:[-3,-2]}],[1.8,{lean:24,tilt:12,hy:62,fB:[-80,-4],fF:[-44,-2],hB:[64,-92],hF:[96,-96],expr:'glare',look:[3,4]},E.io],[9,{lean:24,tilt:12,hy:62,fB:[-80,-4],fF:[-44,-2],hB:[64,-92],hF:[96,-96],expr:'glare',look:[3,4]}]]);
  if(v>1.8) p.hF=[96+Math.sin(v*24)*10,-96];
  return `<rect width="1080" height="1920" fill="#e7cf9f"/>`+layer(cam,CAM0,.85,homeBack())+layer(cam,CAM0,1,fig('theon',470,1500,1.6,1,add(p,idle(t,1)),t,3)+lowTable()+papyrus(560,1340,200,62,90,3,seg(v,1.8,3.5))+(v>1.8?`<g transform="translate(470 1500) scale(1.6)">${handDot(p.hF,'#b57a50')}</g>`:''))+vig(); }

const SEQ=[
  {from:1, r:rDock,    out:'whip'},
  {from:2, r:rWrite,   out:'cut'},
  {from:3, r:rThreats, out:'cut'},
  {from:4, r:rMascot,  out:'cut'},
  {from:5, r:rReceipt, out:'dissolve'},
  {from:6, r:rRoast,   out:'cut'},
];
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });

/* ============================== on-screen text */
function stampMark(x,y,txt,k,col='#c8302a',size=96,rot=-10){ const sc=lerp(1.9,1,k), w=textW(txt,size)+80;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${N(Math.min(1,k*1.4)*.95*100)/100}"><rect x="${N(-w/2)}" y="${N(-size*.92)}" width="${N(w)}" height="${N(size*1.42)}" rx="14" fill="#fffaf0" fill-opacity=".92" stroke="${col}" stroke-width="14"/><text y="${N(size*.34)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${size}" letter-spacing="6" fill="${col}">${txt}</text></g>`; }
function bubble(txt,x,y,k){ if(k<=0) return ''; const fs=96, w=textW(txt,fs)+90;
  return `<g transform="translate(${x} ${y}) scale(${N(lerp(.5,1,E.back(k))*100)/100})"><path d="M${N(-w/2)} -90H${N(w/2)}V60H${N(w*.18)}L${N(w*.32)} 130L${N(w*.02)} 60H${N(-w/2)}Z" fill="#fffaf0" stroke="${OUT}" stroke-width="8" stroke-linejoin="round"/><text y="18" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs}" letter-spacing="4" fill="${INK}">${txt}</text></g>`; }
// a quotation card: papyrus colour, black ink serif, small attribution line
function quoteCard(lines,attr,x,y,k,{fs=74,rot=-2,col=INK,bg=PAPY}={}){ if(k<=0) return '';
  const size=Math.min(fs,...lines.map(L=>fs*860/fellW(L,fs))); const w=Math.max(...lines.map(L=>fellW(L,size)),attr?textW(attr,28):0)+90, lh=size*1.12, h=lines.length*lh+(attr?70:40);
  let g=`<rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="${bg}" stroke="${OUT}" stroke-width="7"/>`;
  lines.forEach((L,i)=>{ g+=`<text y="${N(-h/2+30+size*.8+i*lh)}" text-anchor="middle" font-family="Fell, Georgia, serif" font-style="italic" font-size="${N(size)}" fill="${col}">${L}</text>`; });
  if(attr) g+=`<text y="${N(h/2-24)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="28" letter-spacing="3" fill="#5a4a32">${attr}</text>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${N(lerp(.6,1,E.back(k))*100)/100})" opacity="${N(Math.min(1,k*2)*100)/100}">${g}</g>`; }
const ATTR='THEON TO HIS FATHER · TRANSL. GRENFELL & HUNT, 1898';
function overlays(t){ let g='';
  if(t<SE(1)){ const u=t-S(1); g+=pill('ROMAN EGYPT · 2ND–3RD CENTURY AD',540,250,38,'#6b4a2a','#fffaf0',-2,seg(u,.05,.25)); }
  if(t>=S(2)&&t<SE(2)){ const u=t-S(2), ks=cu(2,'sarcasm'); g+=quoteCard(['“It was a fine thing of you','not to take me with you','to the city!”'],ATTR,540,600,seg(u,ks+.25,ks+.5)); }
  if(t>=S(3)&&t<SE(3)){ const u=t-S(3), kl=cu(3,'letters'), kt=cu(3,'talking'), kg=cu(3,'goodbye'), kd=cu(3,'demand'), ks=cu(3,'hunger');
    if(u<kd-.65){ g+=quoteCard(['“I won’t write you a letter”'],'',540,560,seg(u,kl-.05,kl+.2),{fs:66,rot:-3});
      g+=quoteCard(['“or speak to you”'],'',560,700,seg(u,kt-.05,kt+.2),{fs:66,rot:2});
      g+=quoteCard(['“or say goodbye to you”'],'',530,840,seg(u,kg-.05,kg+.2),{fs:66,rot:-2}); }
    else if(u<ks-.35) g+=quoteCard(['“Send me a lyre,','I implore you.”'],ATTR,540,580,seg(u,kd+.1,kd+.35));
    else g+=quoteCard(['“If you don’t, I won’t eat,','I won’t drink; there now!”'],ATTR,540,580,seg(u,ks+.45,ks+.7)); }
  if(t>=S(4)&&t<SE(4)){ const u=t-S(4); g+=pill('HISTORY HAS RECEIPTS · #2',540,260,40,'#c8302a','#fffaf0',-2,seg(u,.05,.2)); g+=bubble('PROVE IT.',420,640,seg(u,.7,.95)); }
  if(t>=S(5)&&t<SE(5)){ const ks=S(5)+cu(5,'real')-.05; if(t>=ks) g+=stampMark(560,1180,'RECEIPT',seg(t,ks,ks+.16,E.o),'#c8302a',96,-9); }
  if(t>=S(6)){ const u=t-S(6), kn=cu(6,'note'), kr=cu(6,'roasted');
    if(u>=kn&&u<kr-.15) g+=quoteCard(['“Its grammar and spelling','leave a good deal','to be desired.”'],'GRENFELL & HUNT · THE OXYRHYNCHUS PAPYRI, 1898',540,600,seg(u,kn+.05,kn+.3),{bg:'#f4efe2',rot:2});
    if(u>=kr-.05&&u<kr+1.9) g+=`<g opacity="${N((1-seg(u,kr+1.55,kr+1.9))*100)/100}">${stampMark(540,1080,'ROASTED',seg(u,kr-.05,kr+.11,E.o),'#c8302a',120,-8)}</g>`;
    const ke=kr+2.0; if(u>=ke){ const k=seg(u,ke,ke+.3); g+=`<g opacity="${N(k*100)/100}">${pill('HISTORY HAS RECEIPTS · #2',540,1640,34,'#c8302a','#fffaf0',-2)}<text x="540" y="1716" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="4" fill="#fffaf0" stroke="${OUT}" stroke-width="7" paint-order="stroke fill">THE STICK HISTORIAN</text></g>`; } }
  return g; }
