/* ============================== History Has Receipts #1: the workmen's absence register (BM EA5634, c. 1250 BC)
   Facts used: British Museum collection record EA5634; University of Hamburg CSMC, Manuscript of the Month 54.
   Everything acted out is illustration; the register's entries are quoted in translation. */
const CAM0={x:540,y:960,z:1};
const RED='#c0281e', INK='#1d1712', STONE='#e6dbc2';

/* ---------- props */
// faux hieratic: deterministic brush squiggles (decorative, not real script)
function inkRow(x,y,w,col,seed,k=1,sz=1){ let d='', cx=x; let i=0;
  while(cx<x+w*k-6){ const r=rnd(seed*31+i), r2=rnd(seed*17+i*3), h=(14+r*16)*sz, ww=(10+r2*16)*sz;
    if(r<.33) d+=`M${N(cx)} ${N(y)}q${N(ww*.3)} ${N(-h)} ${N(ww)} ${N(-h*.3)}`;
    else if(r<.66) d+=`M${N(cx)} ${N(y-h)}v${N(h)}m${N(ww*.4)} 0q${N(ww*.4)} ${N(-h*.8)} ${N(ww*.6)} 0`;
    else d+=`M${N(cx)} ${N(y-h*.5)}h${N(ww)}m${N(-ww*.5)} ${N(-h*.5)}v${N(h)}`;
    cx+=ww+6*sz; i++; }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${N(5*sz)}" stroke-linecap="round" stroke-linejoin="round"/>`; }
// a limestone flake (ostracon): irregular outline
function flake(cx,cy,w,h,seed=1,fill=STONE){ const pts=[]; for(let i=0;i<14;i++){ const a=i/14*Math.PI*2, r=1+(rnd(seed*7+i)-.5)*.14; pts.push([cx+Math.cos(a)*w/2*r, cy+Math.sin(a)*h/2*r]); }
  return `<path d="${smooth([...pts,pts[0]])}Z" fill="${fill}" stroke="${OUT}" stroke-width="7" stroke-linejoin="round"/>`; }
// the scribe's hand-held flake and red-tipped brush
const heldFlake=h=>`<g transform="translate(${N(h[0]-50)} ${N(h[1]-30)}) rotate(-8) scale(.72)">${flake(70,50,150,110,3)}${inkRow(16,40,110,INK,2,1,.6)}${inkRow(16,72,90,RED,5,1,.6)}</g>`+handDot(h,'#b77a4e');
const brush=h=>`<path d="M${N(h[0])} ${N(h[1])}L${N(h[0]+34)} ${N(h[1]-70)}" stroke="#d9c08a" stroke-width="7" stroke-linecap="round"/><circle cx="${N(h[0]+36)}" cy="${N(h[1]-74)}" r="6" fill="${RED}" stroke="${OUT}" stroke-width="2.5"/>`+handDot(h,'#b77a4e');
const handDot=(h,col)=>`<circle cx="${N(h[0])}" cy="${N(h[1])}" r="9.5" fill="${col}" stroke="${OUT}" stroke-width="4"/>`;
function scorpion(x,y,s,u,face=1){ const w=Math.sin(u*40)*6;
  let g=''; for(let i=0;i<4;i++){ const lx=-18+i*14, ph=i%2?w:-w; g+=`<path d="M${lx} 0L${lx-10+ph} 18M${lx} 0L${lx+4-ph} 18" stroke="${OUT}" stroke-width="5" stroke-linecap="round"/>`; }
  g+=`<ellipse cx="0" cy="0" rx="34" ry="14" fill="#7a4a1e" stroke="${OUT}" stroke-width="4"/>`;
  g+=`<path d="M-30 -2Q-70 -10 -72 -46Q-70 -76 -40 -70" fill="none" stroke="${OUT}" stroke-width="13" stroke-linecap="round"/><path d="M-30 -2Q-70 -10 -72 -46Q-70 -76 -40 -70" fill="none" stroke="#8a5424" stroke-width="7" stroke-linecap="round"/><path d="M-40 -70L-30 -60L-44 -58Z" fill="${OUT}"/>`;
  g+=`<path d="M30 -4L56 -16M30 4L58 14" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/><path d="M52 -24L66 -14L54 -8ZM54 6L68 16L54 22Z" fill="#8a5424" stroke="${OUT}" stroke-width="3"/>`;
  return `<g transform="translate(${N(x)} ${N(y)}) scale(${N(s*face*100)/100} ${N(s*100)/100})">${g}</g>`; }
function stone(x,y,s=1){ return `<g transform="translate(${N(x)} ${N(y)}) scale(${s})"><path d="M-70 -50L60 -60L76 30L-64 40Z" fill="#d9c49a" stroke="${OUT}" stroke-width="6" stroke-linejoin="round"/><path d="M-40 -20L30 -26M-30 10L44 4" stroke="#b9a37a" stroke-width="5" stroke-linecap="round"/></g>`; }
function pot(x,y,u){ let g=`<path d="M-56 -70Q-80 0 -40 30H40Q80 0 56 -70Z" fill="#b8643a" stroke="${OUT}" stroke-width="6"/><ellipse cx="0" cy="-70" rx="58" ry="14" fill="#5a3a1e" stroke="${OUT}" stroke-width="5"/>`;
  for(let i=0;i<4;i++){ const k=(u*1.6+i/4)%1; g+=`<circle cx="${N(-24+i*16+Math.sin(u*5+i)*6)}" cy="${N(-80-k*90)}" r="${N(8+k*10)}" fill="#e9f1e2" opacity="${N((1-k)*.8*100)/100}" stroke="${OUT}" stroke-width="2"/>`; }
  return `<g transform="translate(${N(x)} ${N(y)})">${g}</g>`; }
function stars(x,y,u,k){ if(k<=0) return ''; let g=''; for(let i=0;i<4;i++){ const a=u*6+i*Math.PI/2, px=x+Math.cos(a)*60, py=y+Math.sin(a)*18;
  g+=`<path d="M${N(px)} ${N(py-14)}L${N(px+4)} ${N(py-4)}L${N(px+14)} ${N(py)}L${N(px+4)} ${N(py+4)}L${N(px)} ${N(py+14)}L${N(px-4)} ${N(py+4)}L${N(px-14)} ${N(py)}L${N(px-4)} ${N(py-4)}Z" fill="#ffd34a" stroke="${OUT}" stroke-width="3"/>`; }
  return `<g opacity="${N(k*100)/100}">${g}</g>`; }
const fitSize=(txt,size,maxW)=>Math.min(size,size*maxW/textW(txt,size));
const fctx=document.createElement('canvas').getContext('2d');
const fellW=(txt,size)=>{ fctx.font=`italic ${size}px Fell, Georgia, serif`; return fctx.measureText(txt).width; };
const zoomed=(cx,cy,z,svg)=>`<g transform="translate(540 960) scale(${z}) translate(${-cx} ${-cy})">${svg}</g>`;

/* ---------- sets */
const tombBack=()=>memo('tomb',()=>{ let g=`<rect x="-600" y="-400" width="2300" height="2700" fill="#6a4026"/>`;
  let d=''; for(let r=0;r<16;r++){ const y=-200+r*110; d+=`M-600 ${y}H1700`; for(let c=0;c<14;c++) d+=`M${-600+c*170+(r%2)*85} ${y}v110`; } g+=`<path d="${d}" stroke="#55301c" stroke-width="6"/>`;
  g+=`<rect x="-600" y="300" width="2300" height="70" fill="#c8963c" stroke="${OUT}" stroke-width="5"/><rect x="-600" y="384" width="2300" height="26" fill="#2f5f7a" stroke="${OUT}" stroke-width="4"/>`;
  for(const x of [80,1000]) g+=`<circle cx="${x}" cy="760" r="420" fill="url(#gLampGlow)"/><rect x="${x-10}" y="760" width="20" height="120" fill="#5a3a1e" stroke="${OUT}" stroke-width="4"/><path d="M${x-22} 760Q${x} 680 ${x+22} 760Z" fill="#ffb347" stroke="${OUT}" stroke-width="4"/>`;
  g+=`<rect x="-600" y="1500" width="2300" height="900" fill="#b88a55"/><path d="M-600 1500H1700" stroke="${OUT}" stroke-width="6"/>`; return g; });
const plainBack=(c1,c2)=>`<rect x="-10" y="-10" width="1100" height="1940" fill="${c1}"/><rect x="-10" y="1500" width="1100" height="440" fill="${c2}"/><path d="M-10 1500H1090" stroke="${OUT}" stroke-width="6"/>`;
const villageBack=()=>memo('village',()=>{ let g=`<rect x="-900" y="-400" width="2900" height="2700" fill="#f2d79b"/>`;
  g+=`<path d="M-900 1000L-500 620L-200 700L200 520L560 640L900 480L1300 600L1700 540L2000 700V1500H-900Z" fill="#d49a5c" stroke="#a8703a" stroke-width="6"/>`;
  for(let i=0;i<6;i++){ const x=-700+i*420; g+=`<rect x="${x}" y="1080" width="300" height="420" fill="#c99a68" stroke="${OUT}" stroke-width="6"/><rect x="${x+110}" y="1300" width="80" height="200" fill="#5a3a22" stroke="${OUT}" stroke-width="5"/><rect x="${x+30}" y="1150" width="60" height="50" fill="#5a3a22" stroke="${OUT}" stroke-width="4"/>`; }
  g+=`<rect x="-900" y="1500" width="2900" height="900" fill="#d8b47a"/><path d="M-900 1500H2000" stroke="${OUT}" stroke-width="6"/>`; return g; });

/* ============================== shot 1: cold open, a scorpion has just stung Seba; the scribe logs it */
function sebaHop(x,u,s=1.6,face=1){ const lift=Math.abs(Math.sin(u*Math.PI*2.8))*44;
  const p={lean:16,tilt:-10,fF:[48,-84],fB:[-14,0],hF:[62,-96],hB:[40,-104],expr:'shock',mouth:.9,look:[2,3]};
  const pain=`<g stroke="#c8302a" stroke-width="6" stroke-linecap="round"><path d="M80 -96l22 -14M84 -80l26 0M80 -64l22 12"/></g>`;
  return fig('seba',x,G-lift,s,face,p,u,3,pain); }
function rOpen(t){ const u=t-S(1), D=SE(1)-S(1);
  const cam=keys(u,[[0,{x:600,y:1240,z:1.5}],[D,{x:600,y:1250,z:1.58}]]);
  const sx=lerp(470,1300,seg(u,0,2.4,E.lin));
  const scr=Math.sin(u*16)*4*seg(u,1.4,1.6)*(1-seg(u,2.6,2.8));
  const sp={lean:4,tilt:6,hB:[40,-150],hF:[56+scr,-170-scr],expr:u<1.4?'bored':'stern',look:[-3,2]};
  return `<rect width="1080" height="1920" fill="#6a4026"/>`+layer(cam,CAM0,.85,tombBack())+layer(cam,CAM0,1,
    sebaHop(400+Math.sin(u*3)*24,u,1.7)+fig('scribe',830,G,1.7,-1,add(sp,idle(t,2)),t,5,heldFlake(sp.hB)+brush(sp.hF))+(sx<1260?scorpion(sx,G+24,1.6,u):'')); }

/* ============================== shot 2: the Stick Historian leans in: "Prove it." */
function rMascot(t){ const u=t-S(2);
  const x=lerp(1350,640,seg(u,0,.35,E.back));
  const p=keys(u,[[0,{lean:-10,tilt:-6,hB:[-6,-132],hF:[30,-200],expr:'meh',look:[-2,0]}],[.9,{lean:-6,tilt:8,hB:[-6,-132],hF:[36,-210],expr:'stern',look:[-3,1]},E.io],[2.5,{lean:-6,tilt:8,hB:[-6,-132],hF:[36,-210],expr:'stern',look:[-3,1]}]]);
  return `<rect width="1080" height="1920" fill="#4c5a54"/><path d="M0 0H1080V1920H0Z" fill="url(#gVig)"/>`+fig('mascot',x,2060,3.3,-1,add(p,idle(t,7)),t,12); }

/* ============================== shot 3: the log, then four logged reasons acted out */
const LOG=[ // [label shown in red ink, small note, start u]
  ['ILL','THE MOST COMMON REASON',4.7],
  ['EYE TROUBLE','TWO WORKERS',6.05],
  ['MAKING REMEDIES','"WITH KONS" · THE MOST ENTRIES',7.35],
  ['BADLY STUNG','BY A SCORPION · SEBA',8.6],
];
function logCard(label,note,k){ if(k<=0) return ''; const fs=Math.min(110,110*820/fellW(label,110)), w=Math.max(fellW(label,fs),textW(note,34))+120;
  return `<g transform="translate(540 600) rotate(-2) scale(${N(lerp(.6,1,E.back(k))*100)/100})" opacity="${N(Math.min(1,k*2)*100)/100}"><rect x="${N(-w/2)}" y="-110" width="${N(w)}" height="190" rx="18" fill="${STONE}" stroke="${OUT}" stroke-width="7"/><text y="10" text-anchor="middle" font-family="Fell, Georgia, serif" font-style="italic" font-size="${N(fs)}" fill="${RED}">${label}</text><text y="58" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="3" fill="${INK}">${note}</text></g>`; }
function rLog(t){ const u=t-S(3);
  if(u<LOG[0][2]){ // the register itself, being written
    const cam=keys(u,[[0,{x:540,y:1000,z:1.0}],[LOG[0][2],{x:540,y:980,z:1.12}]]);
    const rows=6, kr=seg(u,3.0,4.5,E.lin); let g=flake(540,1080,880,1000,4);
    for(let r=0;r<rows;r++){ const y=740+r*124; g+=inkRow(180,y,560,INK,10+r,seg(u,.2+r*.35,.6+r*.35)); g+=inkRow(200,y-58,300,RED,40+r,clamp(kr*rows-r,0,1)); }
    const hx=lerp(200,760,(u*.7)%1), hy=740+Math.floor((u*.7)%rows)*124;
    g+=`<path d="M${N(hx)} ${N(hy)}L${N(hx+90)} ${N(hy-170)}" stroke="#d9c08a" stroke-width="12" stroke-linecap="round"/><circle cx="${N(hx)}" cy="${N(hy)}" r="9" fill="${u>3?RED:INK}" stroke="${OUT}" stroke-width="3"/>`;
    return `<rect width="1080" height="1920" fill="#3a2a1e"/>`+layer(cam,CAM0,1,g); }
  const i=LOG.findIndex((L,j)=>u>=L[2]&&(j===LOG.length-1||u<LOG[j+1][2])), v=u-LOG[i][2];
  let g='';
  if(i===0){ // ill: lying on a mat, damp cloth on the forehead
    const cough=Math.max(0,Math.sin(v*9))*6*(v>.4?1:0);
    g=plainBack('#d9b98a','#a8835a')+zoomed(560,1380,1.45,`<rect x="240" y="1440" width="700" height="40" rx="12" fill="#e8d9a8" stroke="${OUT}" stroke-width="5"/><g transform="translate(840 1420) rotate(-90)">${fig('worker',0,0,1.5,1,{lean:0,tilt:-14-cough,hB:[-30,-110],hF:[24,-250],expr:'worried',sick:.55,look:[0,-2],mouth:.3},t,2)}</g><path d="M600 1450Q700 1330 900 1360V1450Z" fill="#c8b07a" stroke="${OUT}" stroke-width="5"/>`);
  } else if(i===1){ // eye trouble: squints, walks into a pillar
    const w=walker(v,180,470,0,.62,70,1.6), hit=seg(v,.6,.72), back=seg(v,.62,.9,E.o);
    const p=v<.62?{...w.p,expr:'glare',look:[3,0]}:{...w.p,lean:-14*back,tilt:-10*back,expr:'shock',mouth:.4};
    g=plainBack('#e3c590','#b88a55')+zoomed(470,1240,1.5,`<rect x="600" y="300" width="170" height="1200" fill="#d8b47a" stroke="${OUT}" stroke-width="7"/><path d="M600 420H770M600 1380H770" stroke="${OUT}" stroke-width="5"/>`+fig('worker2',w.x-back*20,G,1.6,1,p,t,4)+stars(w.x-back*20+40,G-520,v,hit*(1-seg(v,1.1,1.3))));
  } else if(i===2){ // making remedies: the healer stirs, Kons grinds
    const st=[48+Math.cos(v*10)*24,-150+Math.sin(v*10)*10];
    g=plainBack('#e6cf9e','#b88a55')+zoomed(560,1300,1.35,pot(540,1530,v)+fig('healer',360,G,1.6,1,{lean:10,tilt:8,hB:[40,-170],hF:st,expr:'content',look:[3,3]},t,6,`<path d="M${N(st[0])} ${N(st[1])}L${N(st[0]+60)} ${N(st[1]+90)}" stroke="#8a5a2a" stroke-width="9" stroke-linecap="round"/>`+handDot(st,'#b07448'))+fig('kons',760,G,1.6,-1,{lean:16,tilt:6,hB:[50,-100+Math.sin(v*14)*12],hF:[60,-110+Math.sin(v*14)*12],expr:'stern',look:[3,4]},t,7)+`<path d="M600 1560L640 1500H700L740 1560Z" fill="#9a9a8a" stroke="${OUT}" stroke-width="5"/>`);
  } else { // badly stung: Seba again, close
    g=`<rect width="1080" height="1920" fill="#6a4026"/>`+layer({x:520,y:1240,z:1.7},CAM0,.85,tombBack())+layer({x:520,y:1240,z:1.7},CAM0,1,sebaHop(470,v+1,1.7)+scorpion(lerp(640,1000,seg(v,0,1)),G+24,1.6,v));
  }
  return g; }

/* ============================== shot 4: "carrying stones... for the scribe" */
function rStones(t){ const u=t-S(4), kc=cu(4,'carrying'), ks=cu(4,'scribe');
  const cam=keys(u,[[0,{x:440,y:1120,z:1.15}],[ks-.35,{x:470,y:1120,z:1.15}],[ks+.25,{x:700,y:1120,z:1.08},E.io],[SE(4)-S(4),{x:710,y:1120,z:1.1}]]);
  const drop=ks+.75, w=walker(u,-120,700,0,drop,72,1.6);
  const strain=Math.sin(u*9)*3;
  let pp=u<drop?{...w.p,lean:12,tilt:-8,hB:[-10,-330+strain],hF:[30,-336+strain],expr:'worried',look:[3,-1]}:{...w.p,...keys(u,[[drop,{lean:20,tilt:6,hB:[60,-60],hF:[80,-60],expr:'shock',mouth:.5}],[drop+.5,{lean:2,tilt:-4,hB:[-6,-132],hF:[8,-132],expr:'meh',look:[3,0]},E.o]])};
  const hd=headPos(w.x,G,1.6,1,pp);
  const stoneSvg=u<drop?stone(w.x+16,G-330*1.6-40+strain,1.15):stone(840,G-44,1.15);
  const sp={lean:-6,tilt:-4,hB:[-30,-170],hF:u>ks?[96,-150]:[30,-200],expr:u>ks?'content':'bored',look:[-3,1]};
  const mas=seg(u,ks+1.35,ks+1.7,E.back);
  let actors=fig('scribe',1080,G,1.6,-1,add(sp,idle(t,2)),t,5,u>ks?'':heldFlake(sp.hF))+fig('pennub',w.x,G,1.6,1,add(pp,u>drop?idle(t,3):{}),t,8)+stoneSvg+sweat(hd[0]+40,hd[1]-40,u<drop?1:0,u);
  return `<rect width="1080" height="1920" fill="#f2d79b"/>`+layer(cam,CAM0,.8,villageBack())+layer(cam,CAM0,1,actors)
    +(mas>0?fig('mascot',lerp(1250,900,mas),2040,2.6,-1,{lean:-8,tilt:10,hB:[-6,-132],hF:[30,-210],expr:'meh',look:[-1,0]},t,12):''); }

/* ============================== shot 5: the receipt (redrawn), and the stamp */
function ostracon(k){ let g=flake(540,980,700,820,9,'#e2d5b8');
  for(let r=0;r<7;r++){ const y=700+r*96; g+=inkRow(270,y,520,INK,70+r,1,.8); if(r%2===0) g+=inkRow(300,y-40,220,RED,90+r,1,.7); }
  return g; }
function rReceipt(t){ const u=t-S(5), kr=cu(5,'real');
  const cam=keys(u,[[0,{x:540,y:1000,z:1.0}],[kr,{x:540,y:980,z:1.1},E.io],[SE(5)-S(5),{x:560,y:990,z:1.14}]]);
  let g=`<rect width="1080" height="1920" fill="#1e1c1f"/><ellipse cx="540" cy="1000" rx="560" ry="760" fill="#3a3530" opacity=".9"/>`;
  g+=layer(cam,CAM0,1,ostracon(1)+`<g transform="translate(540 1520)"><rect x="-330" y="-60" width="660" height="150" rx="8" fill="#efe6d0" stroke="${OUT}" stroke-width="5"/><text y="0" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="46" letter-spacing="3" fill="#2a2a2a">BRITISH MUSEUM · EA5634</text><text y="44" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="26" letter-spacing="2" fill="#5a5048">LIMESTONE · DEIR EL-MEDINA · c. 1250 BC · REDRAWN</text></g>`);
  const st=kr-.25;
  const mp=keys(u,[[0,{lean:6,tilt:4,hB:[-6,-132],hF:[60,-280],expr:'stern',look:[-2,1]}],[st,{lean:14,tilt:10,hB:[-6,-132],hF:[80,-170],expr:'stern',look:[-2,2]},E.i],[st+.3,{lean:2,tilt:0,hB:[-6,-132],hF:[40,-210],expr:'smile',look:[-2,0]}],[9,{lean:2,tilt:0,hB:[-6,-132],hF:[40,-210],expr:'smile',look:[-2,0]}]]);
  const tool=u<st+.35?`<g transform="translate(${N(mp.hF[0])} ${N(mp.hF[1])})"><rect x="-10" y="-46" width="20" height="40" rx="6" fill="#7a4e2a" stroke="${OUT}" stroke-width="3"/><rect x="-24" y="-8" width="48" height="16" rx="3" fill="#2a2a2a" stroke="${OUT}" stroke-width="3"/></g>`:'';
  g+=fig('mascot',975,1890,2.1,-1,add(mp,idle(t,7)),t,12,tool);
  return g; }

/* ============================== shot 6: two of the forty never missed a day */
function rTwo(t){ const u=t-S(6), k2=cu(6,'two');
  const cam=keys(u,[[0,{x:540,y:1150,z:1.0}],[SE(6)-S(6),{x:540,y:1170,z:1.08}]]);
  let crowd='';
  const kinds=['worker','worker2','seba','pennub','kons'];
  for(let r=0;r<2;r++) for(let c=0;c<7;c++){ const i=r*7+c, x=70+c*156+(r%2)*70, y=1230+r*120, kd=kinds[i%5], v=t+i;
    const ill=i%3===0, hop=i%7===2, eye=i%5===1;
    const p=hop?{lean:14,fF:[40,-70],hF:[50,-80],hB:[30,-90],expr:'shock'}:ill?{lean:-6,tilt:10,hB:[-6,-132],hF:[20,-250],expr:'worried',sick:.5}:eye?{expr:'glare',hB:[-6,-132],hF:[8,-132]}:{expr:'bored',hB:[-6,-132],hF:[8,-132]};
    crowd+=fig(kd,x,y-(hop?Math.abs(Math.sin(v*6))*18:0),.7,c%2?1:-1,p,v,i); }
  const glow=seg(u,k2-.1,k2+.4,E.o);
  const hero=(x,f,seed)=>fig(seed%2?'worker2':'worker',x,G,1.55,f,{lean:-4,tilt:-6,hB:[-30,-120],hF:[30,-120],expr:'happy'},t,seed);
  let g=`<rect width="1080" height="1920" fill="#f2d79b"/>`+layer(cam,CAM0,.8,villageBack())+layer(cam,CAM0,1,crowd+`<circle cx="540" cy="1260" r="${N(330*glow)}" fill="#ffe38a" opacity="${N(glow*.55*100)/100}"/>`+hero(430,1,21)+hero(650,-1,22));
  const mc=seg(u,k2+1.4,k2+1.7,E.back);
  if(mc>0){ const clap=Math.abs(Math.sin((u-k2-1.7)*10))*22*seg(u,k2+1.7,k2+1.8); g+=fig('mascot',lerp(1250,960,mc),1960,2.2,-1,{lean:-4,tilt:6,hB:[30+clap,-220],hF:[40-clap,-226],expr:'smile',look:[-2,0]},t,12); }
  return g; }

const SEQ=[
  {from:1, r:rOpen,    out:'cut'},
  {from:2, r:rMascot,  out:'cut'},
  {from:3, r:rLog,     out:'cut'},
  {from:4, r:rStones,  out:'cut'},
  {from:5, r:rReceipt, out:'cut'},
  {from:6, r:rTwo,     out:'cut'},
];
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });

/* ============================== on-screen text */
function stampMark(x,y,txt,k,col='#c8302a',size=96,rot=-10){ const sc=lerp(1.9,1,k), w=textW(txt,size)+80;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${N(Math.min(1,k*1.4)*.95*100)/100}"><rect x="${N(-w/2)}" y="${N(-size*.92)}" width="${N(w)}" height="${N(size*1.42)}" rx="14" fill="#fffaf0" fill-opacity=".92" stroke="${col}" stroke-width="14"/><text y="${N(size*.34)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${size}" letter-spacing="6" fill="${col}">${txt}</text></g>`; }
function bubble(txt,x,y,k){ if(k<=0) return ''; const fs=96, w=textW(txt,fs)+90;
  return `<g transform="translate(${x} ${y}) scale(${N(lerp(.5,1,E.back(k))*100)/100})"><path d="M${N(-w/2)} -90H${N(w/2)}V60H${N(w*.18)}L${N(w*.32)} 130L${N(w*.02)} 60H${N(-w/2)}Z" fill="#fffaf0" stroke="${OUT}" stroke-width="8" stroke-linejoin="round"/><text y="18" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs}" letter-spacing="4" fill="${INK}">${txt}</text></g>`; }
const T1='A SCORPION STUNG HIM.', T2='THE SCRIBE LOGGED IT.';
function overlays(t){ let g='';
  if(t<SE(1)){ const u=t-S(1);
    g+=pill('EGYPT · c. 1250 BC',540,250,40,'#6b4a2a','#fffaf0',-2,seg(u,.05,.25));
    if(u>.25) g+=`<g opacity="${N(seg(u,.25,.4)*100)/100}">${bigTitle(T1,540,400,N(fitSize(T1,104,960)),'#ffc23d','transform="rotate(-2 540 360)"')}</g>`;
    if(u>1.55) g+=`<g opacity="${N(seg(u,1.55,1.7)*100)/100}">${bigTitle(T2,540,530,N(fitSize(T2,88,940)),'#fffaf0','transform="rotate(-2 540 490)"')}</g>`; }
  if(t>=S(2)&&t<SE(2)){ const u=t-S(2);
    g+=pill('HISTORY HAS RECEIPTS · #1',540,260,40,'#c8302a','#fffaf0',-2,seg(u,.05,.2));
    g+=bubble('PROVE IT.',420,640,seg(u,.85,1.1)); }
  if(t>=S(3)){ const u=t-S(3); for(let j=0;j<LOG.length;j++){ const L=LOG[j], end=j<LOG.length-1?LOG[j+1][2]:SE(3)-S(3); if(u>=L[2]&&u<end&&t<SE(3)) g+=logCard(L[0],L[1],seg(u,L[2]+.05,L[2]+.3)); } }
  if(t>=S(4)&&t<SE(4)){ const u=t-S(4), kc=cu(4,'carrying'), ks=cu(4,'scribe');
    if(u>=kc) g+=logCard(u>=ks?'CARRYING STONES FOR THE SCRIBE':'CARRYING STONES…',u>=ks?'PENNUB\'S ENTRY':'PENNUB\'S ENTRY',seg(u,kc,kc+.25)); }
  if(t>=S(5)&&t<SE(5)){ const ks=S(5)+cu(5,'real')-.05; if(t>=ks) g+=stampMark(560,1180,'RECEIPT',seg(t,ks,ks+.16,E.o),'#c8302a',96,-9); }
  if(t>=S(6)){ const u=t-S(6), k2=cu(6,'two'); if(u>=k2) g+=pill('2 OF 40',540,860,64,'#2f7d3a','#fffaf0',-3,seg(u,k2,k2+.2));
    const ke=k2+2.2; if(u>=ke){ const k=seg(u,ke,ke+.3); g+=`<g opacity="${N(k*100)/100}">${pill('HISTORY HAS RECEIPTS',540,1640,34,'#c8302a','#fffaf0',-2)}<text x="540" y="1716" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="34" letter-spacing="4" fill="#fffaf0" stroke="${OUT}" stroke-width="7" paint-order="stroke fill">THE STICK HISTORIAN</text></g>`; } }
  return g; }
