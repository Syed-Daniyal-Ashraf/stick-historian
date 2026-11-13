/* ============================== tn/ episode: costumes, clocks, sets and props (The Day of Two Noons, 1883)
   Screen-space sets: every sub-shot draws a full 1080x1920 frame. Figures stand on a ground line at y ~1005 so heads and labels stay above the
   big-caption lane (letters y 1050-1175). Floors overscan to the bottom of the frame. */
const FLOOR=(y,c,line=true)=>`<rect x="-600" y="${y}" width="2280" height="2400" fill="${c}"/>`+(line?`<path d="M-300 ${y}H1380" stroke="${INK}" stroke-width="7"/>`:'');
const WALLBG=c=>`<rect x="-600" y="-600" width="2280" height="4400" fill="${c}"/>`;
/* ---- costumes: 1880s frock coats and waistcoats. The rig has no bowler or top hat (fix list): 'flat' caps and fedoras stand in, many men go hatless. */
Object.assign(TC,{
  workman:{skin:'#d9a37a',hair:'#3a2a1e',top:'#6a7f9a',topDk:'#4f6580',pants:'#6a7f9a',shoe:'#3a2a1e',cap:'flat',capC:'#4a4a52',mus:'thick',headS:1.14,build:.3},
  coatA:{skin:'#efc6a0',hair:'#4a3626',suit:true,top:'#3a3a44',topDk:'#2a2a32',shirt:'#f4efe2',tie:'#7a1f2a',pants:'#3a3a44',shoe:'#1e1610',beard:true,headS:1.14,build:.3},
  coatB:{skin:'#e2b48c',hair:'#8a8378',grey:.4,suit:true,top:'#5a4636',topDk:'#44342a',shirt:'#f4efe2',tie:'#2a3a5a',pants:'#5a4636',shoe:'#1e1610',mus:'thick',glasses:true,headS:1.16,build:.6},
  coatC:{skin:'#d9a37a',hair:'#1e1610',suit:true,top:'#2e4a3e',topDk:'#223a30',shirt:'#f4efe2',tie:'#c8a23a',pants:'#2e4a3e',shoe:'#120c08',bald:true,mus:'curl',headS:1.12,build:.2},
  coatD:{skin:'#f0c4a0',hair:'#d8d4cc',grey:.8,suit:true,top:'#4a3a56',topDk:'#382c42',shirt:'#f4efe2',tie:'#8a2a2a',pants:'#4a3a56',shoe:'#1e1610',beard:true,glasses:true,headS:1.18,build:.5},
  hamblet:{skin:'#efc6a0',hair:'#6a4a2e',vest:'#7a4a2a',top:'#f1ead8',topDk:'#d6ccb2',pants:'#4a4640',shoe:'#2a1e16',mus:'thick',glasses:false,headS:1.14,build:.2},
  railman:{skin:'#e2b48c',hair:'#cfc9bf',grey:.9,suit:true,top:'#2a3a5a',topDk:'#1e2c46',shirt:'#f4efe2',tie:'#c8372d',pants:'#2a3a5a',shoe:'#1e1610',cap:'fedora',capC:'#2a2a32',mus:'thick',headS:1.16,build:.4},
  railyoung:{skin:'#e2b48c',hair:'#4a3626',suit:true,top:'#2a3a5a',topDk:'#1e2c46',shirt:'#f4efe2',tie:'#c8372d',pants:'#2a3a5a',shoe:'#1e1610',cap:'fedora',capC:'#2a2a32',mus:'thick',headS:1.16,build:.4},
  senator:{skin:'#efc4a0',hair:'#b8b2a6',grey:.5,suit:true,top:'#1e1e26',topDk:'#14141a',shirt:'#f4efe2',tie:'#1e1e26',pants:'#1e1e26',shoe:'#120c08',beard:true,headS:1.2,build:.7},
  editor:{skin:'#e8bc98',hair:'#3a2a1e',top:'#f1ead8',topDk:'#d6ccb2',vest:'#3c5a6e',pants:'#4a4640',shoe:'#2a1e16',glasses:true,mus:'thick',headS:1.14,build:.4},
  farmer:{skin:'#d9a37a',hair:'#6a4a2e',top:'#c9b98a',topDk:'#a99a6a',pants:'#5a4a3a',shoe:'#3a2a1e',cap:'flat',capC:'#6a5a48',beard:true,headS:1.14,build:.3},
  tophat:{skin:'#f0c4a0',hair:'#2a221c',suit:true,top:'#222228',topDk:'#18181c',shirt:'#f4efe2',tie:'#6a1f2a',pants:'#222228',shoe:'#120c08',mus:'thin',headS:1.14,build:.3},
});
const MINT='#cfe6df';
/* ---- clock face. mins = minutes since 12:00 (0 = 12:00, 540 = 9:00); the hands are derived from it, so "4 minutes back" is one number. */
function clockFace(x,y,r,mins,{rim='#8a5a2a',face='#fbf6ea',num=true,glow=0,sw=null}={}){ const ma=((mins%60)+60)%60*6, ha=(((mins/720)%1)+1)%1*360, s=sw||Math.max(3,r*.05);
  let g=`<g transform="translate(${N(x)} ${N(y)})">`+(glow>0?`<circle r="${N(r*1.45)}" fill="#fff3c4" opacity="${N(glow*.5*100)/100}"/>`:'')+`<circle r="${N(r)}" ${st(face,s*1.1)}/><circle r="${N(r)}" fill="none" stroke="${rim}" stroke-width="${N(r*.13)}"/>`;
  for(let i=0;i<12;i++){ const a=rad(i*30-90), q=i%3===0; g+=`<path d="M${N(Math.cos(a)*r*(q?.74:.8))} ${N(Math.sin(a)*r*(q?.74:.8))}L${N(Math.cos(a)*r*.88)} ${N(Math.sin(a)*r*.88)}" stroke="${INK}" stroke-width="${N(q?s*1.3:s*.8)}" stroke-linecap="round"/>`; }
  if(num&&r>60) [['12',0,-.55],['3',.55,.06],['6',0,.67],['9',-.55,.06]].forEach(([n,dx,dy])=>g+=`<text x="${N(dx*r)}" y="${N(dy*r+r*.1)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(r*.26)}" fill="${INK}">${n}</text>`);
  g+=`<path d="M0 0L${N(Math.sin(rad(ha))*r*.5)} ${N(-Math.cos(rad(ha))*r*.5)}" stroke="${INK}" stroke-width="${N(s*1.7)}" stroke-linecap="round"/><path d="M0 0L${N(Math.sin(rad(ma))*r*.74)} ${N(-Math.cos(rad(ma))*r*.74)}" stroke="${INK}" stroke-width="${N(s*1.15)}" stroke-linecap="round"/><circle r="${N(s*1.5)}" fill="${INK}"/></g>`; return g; }
/* the church bell, hung from a beam inside the belfry; swing = degrees, dong = 0..1 (motion lines) */
function bellProp(x,y,s,swing,dong=0){ let g=`<g transform="translate(${N(x)} ${N(y)}) scale(${s})"><rect x="-90" y="-6" width="180" height="16" ${st('#6a4a2e',5)}/><g transform="rotate(${N(swing)})"><path d="M-8 8L-8 24L8 24L8 8Z" ${st('#5a4a3a',4)}/><path d="M-52 96Q-50 40 -30 30Q0 20 30 30Q50 40 52 96Q0 108 -52 96Z" ${st('#e0b13a',6)}/><path d="M-40 84Q0 94 40 84" fill="none" stroke="#a87a1c" stroke-width="5"/><circle cx="0" cy="${N(104+Math.sin(rad(swing))*14)}" r="9" ${st('#4a3a2a',4)}/></g>`;
  if(dong>0&&dong<1) for(let i=-2;i<=2;i++){ const a=rad(90+i*26), r0=84, r1=84+34*E.o(dong); g+=`<path d="M${N(Math.cos(a)*r0*1.15)} ${N(40+Math.sin(a)*r0*.6)}L${N(Math.cos(a)*r1*1.3)} ${N(40+Math.sin(a)*r1*.7)}" stroke="${INK}" stroke-width="7" stroke-linecap="round" opacity="${N((1-dong)*100)/100}"/>`; }
  return g+`</g>`; }
/* a generic white Georgian steeple (unlabelled). Tower x0..x1, clock centre (cx,cy), bell visible in the belfry opening. */
function steeple(x,top,base,o={}){ const w=o.w||360, cy=o.cy||top+350, r=o.r||110, mins=o.mins||0, swing=o.swing||0, dong=o.dong||0;
  let g=`<path d="M${x-w*.24} ${top+140}L${x} ${top-10}L${x+w*.24} ${top+140}Z" ${st('#f4f0e6',7)}/><path d="M${x} ${top-10}V${top-60}M${x-16} ${top-40}H${x+16}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  g+=`<rect x="${x-w*.3}" y="${top+130}" width="${w*.6}" height="${o.belf||150}" ${st('#f4f0e6',7)}/><path d="M${x-w*.17} ${top+280}V${top+190}Q${x-w*.17} ${top+160} ${x} ${top+160}Q${x+w*.17} ${top+160} ${x+w*.17} ${top+190}V${top+280}Z" ${st('#4a3a30',6)}/>`;
  g+=bellProp(x,top+172,.85,swing,dong);
  g+=`<rect x="${x-w/2}" y="${top+280}" width="${w}" height="${base-top-280}" ${st('#f4f0e6',7)}/>`;
  for(let i=0;i<5;i++) g+=`<path d="M${x-w/2+20+i*(w-40)/4} ${top+282}V${base}" stroke="#d8d2c2" stroke-width="4"/>`;
  g+=clockFace(x,cy,r,mins,{rim:'#2a2a32',glow:o.glow||0});
  g+=`<path d="M${x-w/2-14} ${top+280}h${w+28}" stroke="${INK}" stroke-width="7"/>`; return g; }
function ladder(x0,y0,x1,y1,w=46){ const a=Math.atan2(y1-y0,x1-x0), nx=-Math.sin(a)*w/2, ny=Math.cos(a)*w/2, L=Math.hypot(x1-x0,y1-y0), n=Math.round(L/46);
  let g=`<path d="M${N(x0+nx)} ${N(y0+ny)}L${N(x1+nx)} ${N(y1+ny)}M${N(x0-nx)} ${N(y0-ny)}L${N(x1-nx)} ${N(y1-ny)}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${N(x0+nx)} ${N(y0+ny)}L${N(x1+nx)} ${N(y1+ny)}M${N(x0-nx)} ${N(y0-ny)}L${N(x1-nx)} ${N(y1-ny)}" stroke="#b8803c" stroke-width="7" stroke-linecap="round"/>`;
  for(let i=1;i<n;i++){ const k=i/n, cx=lerp(x0,x1,k), cy=lerp(y0,y1,k); g+=`<path d="M${N(cx+nx)} ${N(cy+ny)}L${N(cx-nx)} ${N(cy-ny)}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${N(cx+nx)} ${N(cy+ny)}L${N(cx-nx)} ${N(cy-ny)}" stroke="#b8803c" stroke-width="4" stroke-linecap="round"/>`; } return g; }
/* a row of brick buildings as a backdrop: deterministic from the seed. */
function skyline(y,seed,cols,{h0=180,h1=420,w0=110,w1=190,x0=-100,x1=1180,clocks=null}={}){ let g='',x=x0,i=0;
  while(x<x1){ const w=lerp(w0,w1,rnd(seed+i*3)), h=lerp(h0,h1,rnd(seed+i*5+1)), c=cols[i%cols.length]; g+=`<rect x="${N(x)}" y="${N(y-h)}" width="${N(w)}" height="${N(h+8)}" fill="${c}" stroke="${INK}" stroke-width="5"/>`;
    for(let r=0;r<Math.floor(h/70);r++) for(let q=0;q<Math.floor(w/52);q++) g+=`<rect x="${N(x+16+q*50)}" y="${N(y-h+20+r*68)}" width="22" height="34" rx="3" fill="#2b3a52" opacity=".55"/>`;
    if(clocks&&rnd(seed+i*11)>.35) g+=clockFace(x+w/2,y-h-26,22,(i*97)%720,{num:false,sw:2.5});
    x+=w+lerp(0,14,rnd(i+seed)); i++; } return g; }
/* the street: paving with cobble ticks, kerb line; overscans to the bottom of the frame */
function street(y,c1='#8b8678',c2='#6f6a5e'){ let g=FLOOR(y,c1); for(let i=0;i<46;i++){ const px=-40+rnd(i*3+9)*1160, py=y+20+rnd(i*7+2)*(1000), w=26+rnd(i)*34; g+=`<path d="M${N(px)} ${N(py)}h${N(w)}" stroke="${c2}" stroke-width="5" stroke-linecap="round" opacity=".75"/>`; } return g; }
/* ---- steam locomotive, head-on. (cx,cy) = centre of the boiler face, s = scale; lamp is a clock face. */
function locomotive(cx,cy,s,u,{mins=0,glow=1}={}){ let g=`<g transform="translate(${N(cx)} ${N(cy)}) scale(${N(s*1000)/1000})">`;
  g+=`<path d="M-120 -200L-86 -330H86L120 -200Z" ${st('#2a2a32',8)}/><path d="M-150 -336H150L120 -312H-120Z" ${st('#3a3a44',8)}/>`;   // smokestack
  g+=`<circle r="230" ${st('#3a3a44',10)}/><circle r="196" ${st('#2a2a32',8)}/><circle r="210" fill="none" stroke="#6a6a76" stroke-width="10" stroke-dasharray="3 36" stroke-linecap="round"/>`;
  g+=`<circle cy="-20" r="${N(120+Math.sin(u*40)*2)}" fill="#fff3c4" opacity="${N(glow*.35*100)/100}"/>`+clockFace(0,-20,92,mins,{rim:'#c9a03a',glow:glow});
  g+=`<path d="M-230 120L0 330L230 120L170 120L0 250L-170 120Z" ${st('#4a4a54',8)}/><path d="M-140 170L140 170M-100 210L100 210M-60 250L60 250" stroke="${INK}" stroke-width="7"/>`;   // cowcatcher
  g+=`<rect x="-330" y="40" width="110" height="170" rx="22" ${st('#c8372d',8)}/><rect x="220" y="40" width="110" height="170" rx="22" ${st('#c8372d',8)}/><circle cx="-275" cy="125" r="36" fill="${INK}" opacity=".35"/><circle cx="275" cy="125" r="36" fill="${INK}" opacity=".35"/>`;
  return g+`</g>`; }
function steamPuff(x,y,r,k){ if(k<=0||k>=1) return ''; return `<g opacity="${N((1-k)*85)/100}" transform="translate(${N(x)} ${N(y-k*90)})"><circle r="${N(r*(.6+k))}" ${st('#f4f0e6',6)}/><circle cx="${N(r*.7)}" cy="${N(r*.2)}" r="${N(r*.6*(.6+k))}" ${st('#f4f0e6',6)}/></g>`; }
/* ---- pendulum clock (regulator). The bob angle comes from PEND(t) in shots.js so that "stop" freezes the phase and the restart resumes from it. */
function pendulum(px,py,L,ang,R,{rod='#3a3a44',bob='#d9a83a'}={}){ const a=rad(ang), bx=px+Math.sin(a)*L, by=py+Math.cos(a)*L;
  return `<path d="M${N(px)} ${N(py)}L${N(bx)} ${N(by)}" stroke="${INK}" stroke-width="${N(R*.28)}" stroke-linecap="round"/><path d="M${N(px)} ${N(py)}L${N(bx)} ${N(by)}" stroke="${rod}" stroke-width="${N(R*.15)}" stroke-linecap="round"/><circle cx="${N(bx)}" cy="${N(by)}" r="${N(R)}" ${st(bob,Math.max(5,R*.1))}/><circle cx="${N(bx-R*.3)}" cy="${N(by-R*.3)}" r="${N(R*.28)}" fill="#fff3c4" opacity=".55"/>`; }
function regulator(x,y,w,h,ang,{mins=540}={}){ // tall case, dial on top, pendulum in a glass window. (x,y) = centre-top
  let g=`<rect x="${x-w/2}" y="${y}" width="${w}" height="${h}" rx="14" ${st('#7a4a2a',9)}/><rect x="${x-w/2-14}" y="${y-18}" width="${w+28}" height="34" rx="8" ${st('#6a3e1e',8)}/>`;
  g+=clockFace(x,y+w*.42,w*.36,mins,{rim:'#c9a03a',sw:4});
  const wy=y+w*.9, wh=h-w*.9-30; g+=`<rect x="${x-w*.36}" y="${wy}" width="${w*.72}" height="${wh}" rx="8" fill="#e9dfc2" stroke="${INK}" stroke-width="7"/>`;
  g+=`<clipPath id="rg${UID++}"><rect x="${x-w*.36}" y="${wy}" width="${w*.72}" height="${wh}" rx="8"/></clipPath><g clip-path="url(#rg${UID-1})">`+pendulum(x,wy+8,wh*.7,ang,w*.1)+`</g>`;
  g+=`<rect x="${x-w*.36}" y="${wy}" width="${w*.72}" height="${wh}" rx="8" fill="#bfe6ff" opacity=".18"/>`; return g; }
/* stopwatch insert: secs = elapsed seconds (the hand makes one turn a minute) */
function stopwatch(x,y,r,secs){ const a=(secs%60)*6; let g=`<g transform="translate(${N(x)} ${N(y)})"><rect x="-14" y="${N(-r-34)}" width="28" height="30" rx="6" ${st('#c9a03a',6)}/><circle r="${N(r)}" ${st('#fbf6ea',8)}/><circle r="${N(r)}" fill="none" stroke="#c9a03a" stroke-width="12"/>`;
  for(let i=0;i<12;i++){ const q=rad(i*30-90); g+=`<path d="M${N(Math.cos(q)*r*.78)} ${N(Math.sin(q)*r*.78)}L${N(Math.cos(q)*r*.9)} ${N(Math.sin(q)*r*.9)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
  g+=`<path d="M0 0L${N(Math.sin(rad(a))*r*.78)} ${N(-Math.cos(rad(a))*r*.78)}" stroke="${CRIM}" stroke-width="7" stroke-linecap="round"/><circle r="9" fill="${INK}"/>`;
  const m=Math.floor(secs/60), s=Math.floor(secs%60); g+=`<text y="${N(r*.5)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(r*.34)}" fill="${INK}">${m}:${String(s).padStart(2,'0')}</text>`; return g+`</g>`; }
/* jeweller's window: rows of clocks, each a different time (frozen) or running (o.run) */
function jewelerWindow(x,y,w,h,u,{run=0,frost=0,rows=3,cols=4}={}){ let g=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" ${st('#3a2a22',10)}/><rect x="${x+16}" y="${y+16}" width="${w-32}" height="${h-32}" rx="10" fill="#f6e3b4" stroke="${INK}" stroke-width="6"/>`;
  g+=`<rect x="${x+16}" y="${y+16}" width="${w-32}" height="46" fill="#7a1f2a" stroke="${INK}" stroke-width="6"/><text x="${x+w/2}" y="${y+50}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="#ffe9a8" letter-spacing="8">WATCHES · CLOCKS</text>`;
  const cw=(w-60)/cols, rh=(h-90)/rows;
  for(let r=0;r<rows;r++){ g+=`<path d="M${x+16} ${N(y+78+(r+1)*rh-14)}H${x+w-16}" stroke="#7a4a2a" stroke-width="10"/>`; for(let c=0;c<cols;c++){ const m=(r*173+c*79+40)%720, cxp=x+30+cw*(c+.5), cyp=y+78+r*rh+rh*.42;
    g+=clockFace(cxp,cyp,Math.min(cw,rh)*.34,run?m+u*run:m,{num:false,sw:3}); } }
  if(frost>0) g+=`<rect x="${x+16}" y="${y+62}" width="${w-32}" height="${h-78}" fill="#bfe6ff" opacity="${N(frost*.28*100)/100}"/>`; return g; }
/* a frozen crowd member: fixed pose, no idle sway (t is held at 0) */
const frozen=(who,x,y,s,dir,pose,seed)=>toon(who,x,y,s,dir,pose,0,seed);
/* ---- telegraph: sounder on a small table (lever bounces with `click`, 0..1), a pole with crossbars, a quadratic wire */
function sounder(x,y,s,click){ const lev=-12+click*10; return `<g transform="translate(${N(x)} ${N(y)}) scale(${s})"><rect x="-130" y="-24" width="260" height="30" rx="6" ${st('#7a4a2a',7)}/><rect x="-110" y="-44" width="220" height="24" rx="5" ${st('#c9a03a',6)}/>
  <rect x="-80" y="-120" width="40" height="76" rx="10" ${st('#b8803c',6)}/><rect x="40" y="-120" width="40" height="76" rx="10" ${st('#b8803c',6)}/><path d="M-60 -120V-136M60 -120V-136" stroke="${INK}" stroke-width="6"/>
  <g transform="translate(-72 -138) rotate(${N(lev)})"><rect x="0" y="-9" width="164" height="18" rx="6" ${st('#d8c06a',6)}/></g><circle cx="-72" cy="-138" r="9" fill="${INK}"/>
  <path d="M-100 -44q-20 -24 -50 -20M100 -44q20 -24 50 -20" fill="none" stroke="${INK}" stroke-width="5"/></g>`; }
const wirePt=(p0,p1,sag,k)=>[lerp(p0[0],p1[0],k), lerp(p0[1],p1[1],k)+Math.sin(Math.PI*k)*sag];
function pole(x,y0,y1,w=150,t=18){ return `<path d="M${x} ${y0}V${y1}" stroke="${INK}" stroke-width="${t+8}" stroke-linecap="round"/><path d="M${x} ${y0}V${y1}" stroke="#6a4a2e" stroke-width="${t}" stroke-linecap="round"/><path d="M${x-w/2} ${y0+22}H${x+w/2}M${x-w*.36} ${y0+70}H${x+w*.36}" stroke="${INK}" stroke-width="${t*.75+6}" stroke-linecap="round"/><path d="M${x-w/2} ${y0+22}H${x+w/2}M${x-w*.36} ${y0+70}H${x+w*.36}" stroke="#6a4a2e" stroke-width="${t*.75}" stroke-linecap="round"/>`; }
/* ---- sundial in a square, the sun with a face, a pocket watch the farmer sets */
function sundial(x,y,s,shadowAng){ return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="10" rx="120" ry="26" fill="${INK}" opacity=".25"/><path d="M-50 0L-36 -140H36L50 0Z" ${st('#cfc8b6',7)}/><ellipse cy="-140" rx="76" ry="20" ${st('#ddd6c4',7)}/><path d="M0 -140L-30 -176L40 -140Z" ${st('#8a7a5a',6)}/><path d="M0 -140L${N(Math.sin(rad(shadowAng))*150)} ${N(-140+Math.cos(rad(shadowAng))*28)}" stroke="${INK}" stroke-width="9" stroke-linecap="round" opacity=".55"/></g>`; }
function sunFace(x,y,r,u,expr='smug',k=1){ let g=`<g transform="translate(${N(x)} ${N(y)}) scale(${N(k*1000)/1000})">`; const n=14;
  for(let i=0;i<n;i++){ const a=rad(i*360/n+u*14), r0=r*1.04, r1=r*(1.38+.07*Math.sin(u*5+i)); g+=`<path d="M${N(Math.cos(a-.09)*r0)} ${N(Math.sin(a-.09)*r0)}L${N(Math.cos(a)*r1)} ${N(Math.sin(a)*r1)}L${N(Math.cos(a+.09)*r0)} ${N(Math.sin(a+.09)*r0)}Z" ${st('#ffb627',5)}/>`; }
  g+=`<circle r="${r}" ${st('#ffd25a',8)}/><circle cx="${N(-r*.3)}" cy="${N(-r*.32)}" r="${N(r*.5)}" fill="#fff3c4" opacity=".5"/>`;
  const sad=expr==='sad'; g+=`<circle cx="${N(-r*.36)}" cy="${N(-r*.06)}" r="${N(r*.12)}" fill="${INK}"/><circle cx="${N(r*.36)}" cy="${N(-r*.06)}" r="${N(r*.12)}" fill="${INK}"/><path d="M${N(-r*.52)} ${N(-r*.3-(sad?-r*.06:0))}L${N(-r*.2)} ${N(-r*.24+(sad?-r*.1:r*.06))}M${N(r*.52)} ${N(-r*.3-(sad?-r*.06:0))}L${N(r*.2)} ${N(-r*.24+(sad?-r*.1:r*.06))}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  g+=sad?`<path d="M${N(-r*.3)} ${N(r*.5)}Q0 ${N(r*.28)} ${N(r*.3)} ${N(r*.5)}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`:`<path d="M${N(-r*.3)} ${N(r*.34)}Q0 ${N(r*.62)} ${N(r*.3)} ${N(r*.34)}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
  return g+`</g>`; }
/* ---- Wisconsin (rough outline, 0-100 box) and a rough North America for the wall map (0-100 box) */
const WISC=[[10,8],[24,14],[36,10],[44,16],[56,20],[64,26],[72,34],[76,40],[86,28],[90,30],[82,44],[78,52],[81,62],[78,78],[80,92],[28,92],[24,84],[18,72],[12,62],[4,52],[2,40],[8,30],[6,20]];
const NAMER=[[2,20],[8,12],[16,10],[22,14],[28,10],[36,6],[46,4],[48,12],[52,22],[60,26],[64,20],[62,12],[68,6],[74,12],[80,20],[86,24],[94,30],[92,36],[86,38],[88,44],[82,48],[80,54],[78,60],[76,66],[80,74],[76,76],[72,68],[64,68],[58,70],[54,74],[52,82],[56,88],[50,92],[44,90],[36,80],[30,70],[26,62],[22,50],[20,40],[14,32],[10,26],[4,28]];
const inPoly=(x,y,P)=>{ let c=false; for(let i=0,j=P.length-1;i<P.length;j=i++){ const [xi,yi]=P[i],[xj,yj]=P[j]; if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi)) c=!c; } return c; };
const polyPath=(P,x,y,s)=>'M'+P.map(p=>`${N(x+p[0]*s)} ${N(y+p[1]*s)}`).join('L')+'Z';
/* ---- law book (open, blank pages), top hat overlay, capitol, press, newspaper page */
function lawBook(x,y,w,h,k=1){ return `<g transform="translate(${N(x)} ${N(y)}) scale(${N(k*100)/100})"><path d="M${-w/2-14} ${h/2+12}L${-w/2-14} ${-h/2+10}Q${-w/4} ${-h/2-18} 0 ${-h/2+4}Q${w/4} ${-h/2-18} ${w/2+14} ${-h/2+10}L${w/2+14} ${h/2+12}Z" ${st('#5a2a1e',9)}/><path d="M${-w/2} ${h/2}L${-w/2} ${-h/2+14}Q${-w/4} ${-h/2-8} 0 ${-h/2+14}L0 ${h/2}Z" ${st('#f6f0dc',6)}/><path d="M0 ${h/2}L0 ${-h/2+14}Q${w/4} ${-h/2-8} ${w/2} ${-h/2+14}L${w/2} ${h/2}Z" ${st('#faf4e2',6)}/><path d="M0 ${-h/2+14}V${h/2}" stroke="${INK}" stroke-width="5"/></g>`; }
function topHat(x,y,s,rot=0){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><ellipse cy="0" rx="74" ry="14" ${st('#1c1c22',6)}/><path d="M-46 0L-42 -92Q0 -104 42 -92L46 0Z" ${st('#24242c',6)}/><ellipse cy="-92" rx="42" ry="9" fill="#34343e" stroke="${INK}" stroke-width="5"/><path d="M-45 -14Q0 -4 45 -14" stroke="#7a1f2a" stroke-width="12" fill="none"/></g>`; }
function capitol(x,y,s){ let g=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-420" y="-170" width="840" height="170" ${st('#f1ece0',8)}/>`;
  for(let i=0;i<14;i++) g+=`<rect x="${-390+i*56}" y="-150" width="22" height="140" fill="#d8d2c2" stroke="${INK}" stroke-width="3"/>`;
  g+=`<path d="M-440 -170H440L400 -200H-400Z" ${st('#e6e0d0',8)}/><rect x="-170" y="-250" width="340" height="52" ${st('#f1ece0',8)}/><rect x="-150" y="-380" width="300" height="130" ${st('#f1ece0',8)}/>`;
  for(let i=0;i<10;i++) g+=`<rect x="${-136+i*29}" y="-366" width="12" height="104" fill="#d8d2c2" stroke="${INK}" stroke-width="3"/>`;
  g+=`<path d="M-170 -380H170L150 -410H-150Z" ${st('#e6e0d0',7)}/><path d="M-130 -410Q-130 -560 0 -580Q130 -560 130 -410Z" ${st('#f4f0e6',8)}/><path d="M-100 -430Q-100 -540 0 -556M0 -580V-430M-60 -420Q-70 -520 -30 -566M60 -420Q70 -520 30 -566" fill="none" stroke="#c8c2b2" stroke-width="5"/><rect x="-26" y="-640" width="52" height="64" rx="12" ${st('#f4f0e6',7)}/><path d="M0 -640V-700" stroke="${INK}" stroke-width="7"/><path d="M0 -700L46 -684L0 -668Z" fill="${CRIM}" stroke="${INK}" stroke-width="4"/>`;
  return g+`</g>`; }
/* printing press: flywheel with a hand crank, bed with sheets */
function press(x,y,s,u,{spin=1}={}){ const a=u*spin*220; let g=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-210" y="-60" width="420" height="40" rx="8" ${st('#4a4a54',8)}/><rect x="-190" y="-380" width="60" height="330" ${st('#3a3a44',8)}/><rect x="130" y="-380" width="60" height="330" ${st('#3a3a44',8)}/><rect x="-200" y="-430" width="400" height="70" rx="10" ${st('#5a5a66',8)}/><rect x="-120" y="-250" width="240" height="40" ${st('#6a6a76',6)}/>`;
  g+=`<g transform="translate(300 -170) rotate(${N(a)})"><circle r="150" ${st('#2f2f38',9)}/><circle r="118" fill="none" stroke="#6a6a76" stroke-width="8"/>`+[0,1,2,3,4,5].map(i=>`<path d="M0 0L${N(Math.cos(i*1.0472)*140)} ${N(Math.sin(i*1.0472)*140)}" stroke="#6a6a76" stroke-width="14" stroke-linecap="round"/>`).join('')+`<circle cx="104" cy="0" r="22" ${st('#c9a03a',6)}/></g>`;
  g+=`<path d="M-210 -20V0H210V-20" fill="#1e1e24"/><rect x="-170" y="-86" width="300" height="30" rx="4" ${st('#f6f0dc',5)}/></g>`; return g; }
/* a newspaper page: masthead + columns; k = how much of the quote highlight is drawn (0..1) */
function newsPage(x,y,w,h,hl,{rot=0,reveal=1}={}){ const FF='Fell, '+BAL; let g=`<g transform="translate(${N(x)} ${N(y)}) rotate(${rot})"><rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" ${st('#ecdfb8',9)}/><rect x="${-w/2+16}" y="${-h/2+16}" width="${w-32}" height="${h-32}" fill="none" stroke="#8a7a4a" stroke-width="3"/>`;
  g+=`<text y="${-h/2+104}" text-anchor="middle" font-family="${FF}" font-size="104" fill="#2a2418" font-weight="400" letter-spacing="3">SENTINEL</text><path d="M${-w/2+30} ${-h/2+132}H${w/2-30}M${-w/2+30} ${-h/2+142}H${w/2-30}" stroke="#2a2418" stroke-width="4"/>`;
  for(let c=0;c<3;c++) for(let r=0;r<12;r++){ if(r>=6&&r<=9&&c===1) continue; g+=`<path d="M${N(-w/2+40+c*(w-80)/3)} ${N(-h/2+188+r*40)}h${N((w-120)/3*(.6+.4*rnd(c*9+r)))}" stroke="#8a7a5a" stroke-width="9" stroke-linecap="round" opacity=".55"/>`; }
  const qy=-h/2+388, lines=['“The Sun is no longer','to boss the job.”']; const bw=w-120;
  g+=`<rect x="${-bw/2}" y="${qy-52}" width="${N(bw*hl)}" height="190" fill="#ffd23a" opacity=".75"/>`;
  lines.forEach((l,i)=>{ const k=sat((reveal*3-i)); g+=`<clipPath id="nq${i}"><rect x="${-bw/2}" y="${qy-48+i*88}" width="${N(bw*k)}" height="90"/></clipPath><text clip-path="url(#nq${i})" x="${-bw/2+10}" y="${qy+i*88+22}" font-family="${FF}" font-size="76" fill="#2a2418">${l}</text>`; });
  return g+`</g>`; }
function wallCalendar(x,y,s,yr,flip,rot=-3){ const A=Math.floor(yr), curr=flip<.5?'1883':'1918'; let g=`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 -150L0 -170L10 -150" fill="none" stroke="${INK}" stroke-width="5"/><rect x="-120" y="-150" width="240" height="300" rx="8" ${st('#fbf6ea',8)}/><rect x="-120" y="-150" width="240" height="72" rx="8" ${st(CRIM,8)}/>`;
  g+=`<text y="-98" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="52" fill="#fff">${curr}</text>`;
  for(let r=0;r<4;r++) for(let c=0;c<6;c++) g+=`<rect x="${-96+c*34}" y="${-50+r*32}" width="22" height="16" fill="#c9bfa8"/>`;
  if(flip>0&&flip<1){ const k=flip; g+=`<path d="M-120 -78L120 -78L${N(120-k*40)} ${N(150-k*380)}L${N(-120+k*30)} ${N(150-k*400)}Z" fill="#f2ead8" stroke="${INK}" stroke-width="5" opacity="${op(1.3-k)}"/>`; }
  return g+`</g>`; }

/* Trinity Church (the second noon, per W. F. Allen's eyewitness account): brownstone Gothic tower, tall spire, pinnacles. Same option names as steeple(). */
function trinity(x,top,base,o={}){ const w=o.w||300, cy=o.cy||top+520, r=o.r||92, swing=o.swing||0, dong=o.dong||0, BS='#9a6a56', BD='#7a4e3e';
  let g=`<path d="M${x-w*.26} ${top+300}L${x} ${top-40}L${x+w*.26} ${top+300}Z" ${st(BS,7)}/><path d="M${x} ${top-40}V${top-86}M${x-14} ${top-66}H${x+14}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
  for(let i=1;i<5;i++) g+=`<path d="M${N(x-w*.26*i/5)} ${N(top-40+340*i/5)}h${N(w*.52*i/5)}" stroke="${BD}" stroke-width="4"/>`;
  [-1,1].forEach(sd=>{ const px=x+sd*w*.42; g+=`<path d="M${N(px-18)} ${top+300}L${N(px)} ${top+200}L${N(px+18)} ${top+300}Z" ${st(BS,6)}/>`; });
  g+=`<rect x="${x-w*.42}" y="${top+296}" width="${w*.84}" height="${base-top-296}" ${st(BS,7)}/>`;
  g+=`<path d="M${x-w*.2} ${top+440}V${top+360}Q${x-w*.2} ${top+322} ${x} ${top+318}Q${x+w*.2} ${top+322} ${x+w*.2} ${top+360}V${top+440}Z" ${st('#3a2a24',6)}/>`;
  g+=bellProp(x,top+336,.75,swing,dong);
  for(let i=0;i<6;i++) g+=`<path d="M${x-w*.42} ${N(top+470+i*70)}h${w*.84}" stroke="${BD}" stroke-width="3" opacity=".7"/>`;
  g+=clockFace(x,cy,r,o.mins||0,{rim:'#2a2a32',glow:o.glow||0});
  g+=`<path d="M${x-w*.1} ${base}V${base-120}Q${x} ${base-170} ${x+w*.1} ${base-120}V${base}Z" ${st('#4a2e22',6)}/>`; return g; }
