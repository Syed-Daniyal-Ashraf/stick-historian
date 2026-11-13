/* ============================== yo/ episode: costumes, the yoyo() string prop, sets
   (courtroom() + TC.judge now live in the shared kit, engine/toon/30_world.js) */
/* ---- costumes. Duncan is built to look nothing like Darrow (fedora + thin moustache): light fedora, glasses, heavy, no moustache, green suit */
Object.assign(TC,{
  pedroBell:{skin:'#c58a5a',hair:'#150f0b',suit:true,top:'#7a1f2a',topDk:'#5a1620',shirt:'#f4efe2',tie:'#e8c34a',pants:'#2a1a1a',shoe:'#120c08',cap:'pillbox',capC:'#7a1f2a',band:'#e8c34a',headS:1.17,build:.1,young:true},
  pedroSuit:{skin:'#c58a5a',hair:'#150f0b',suit:true,top:'#b89a6a',topDk:'#9a7e52',shirt:'#f4efe2',tie:'#8a2a2a',pants:'#a58a5e',shoe:'#2a1a10',headS:1.17,build:.1,young:true},
  pedroSash:{skin:'#c58a5a',hair:'#150f0b',suit:true,top:'#b89a6a',topDk:'#9a7e52',shirt:'#f4efe2',tie:'#8a2a2a',pants:'#a58a5e',shoe:'#2a1a10',headS:1.17,build:.1,young:true,sash:true},
  duncan:{skin:'#efc4a0',hair:'#8a8378',grey:.1,suit:true,top:'#3f6a4a',topDk:'#2f5238',shirt:'#f4efe2',tie:'#e8c34a',pants:'#3f6a4a',shoe:'#1e1610',cap:'fedora',capC:'#a89060',glasses:true,headS:1.2,build:.95},
  examiner:{skin:'#e2b48c',hair:'#2a2420',top:'#efe8d4',topDk:'#cfc6ad',vest:'#3a5a4a',pants:'#4a4640',shoe:'#2a1e16',glasses:true,bald:true,pen:true,headS:1.1,build:.4},
  rival:{skin:'#d9a37a',hair:'#2a1e16',suit:true,top:'#8a4a2a',topDk:'#6a3a20',shirt:'#e8e0cc',tie:'#2a2a2a',pants:'#4a3a2a',shoe:'#1e1610',cap:'flat',capC:'#4a4a52',mus:'thick',headS:1.14,build:.5},
  kidA:{skin:'#c98e5e',hair:'#1a120c',top:'#e8a33a',topDk:'#c08228',pants:'#5a5550',shoe:'#4a2e1a',young:true,headS:1.32,build:0},
  kidB:{skin:'#d3a070',hair:'#2a1e16',top:'#7fa7c9',topDk:'#5f87a9',pants:'#6a5a46',shoe:'#4a2e1a',young:true,headS:1.32,build:0},
  kidC:{skin:'#c58a5a',hair:'#150f0b',top:'#9fbf6a',topDk:'#7f9f4a',pants:'#efe9da',shoe:'#4a2e1a',young:true,headS:1.32,build:0},
  kidD:{skin:'#e0b088',hair:'#6a4428',top:'#c8572e',topDk:'#a8401f',pants:'#4a4e5a',shoe:'#2a1e16',young:true,headS:1.32,build:0},
});
/* ---- yoyo(hx,hy,u,mode,o): the toy and its string. (hx,hy) = hand point in WORLD space: handPt() gives it from a pose.
   modes: 'drop' (o.k 0..1 falls), 'sleep' (hangs and spins), 'return' (o.k 0..1 climbs back), 'bob' (endless up-down, o.per seconds),
   'walk' (rolls on the floor o.gy, centre at o.wx). Options: len, s (size), col, cap (nightcap 0..1), zzz (0..1), ph (phase). */
const YO_RED='#d8352a', YO_STR='#f5efe0';
const handPt=(x,y,s,dir,p)=>[x+(p.hF||[16,-110])[0]*s*dir, y+(p.hF||[16,-110])[1]*s];
function yoyoBody(spin,col,fast){ const R=42, pw=22, gap=10; let g='';
  const plate=(x0,sg)=>{ const xm=x0+pw/2, bl=sg<0?x0-7:x0+pw+7, d=`M${xm} ${-R}Q${bl} 0 ${xm} ${R}Q${sg<0?x0+pw-1:x0+1} 0 ${xm} ${-R}Z`, id=`yp${UID}${sg<0?'a':'b'}`;
    let q=`<path d="${d}" fill="${col}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">`;
    for(let i=0;i<3;i++){ const a=spin*6.2832+i*2.0944, c=Math.cos(a); if(c>0) q+=`<rect x="${x0-8}" y="${N(R*Math.sin(a)-5*c-2)}" width="${pw+16}" height="${N(10*c+3)}" fill="${fast?'#ffe9a8':'#fff3cf'}" opacity=".9"/>`; }
    q+=`<path d="M${xm} ${-R+8}Q${sg<0?x0-1:x0+pw-1} 0 ${xm} ${R-8}" fill="none" stroke="#fff" stroke-width="4" opacity=".3"/></g>`; return q; };
  UID++;
  g+=`<rect x="${-gap/2-2}" y="-8" width="${gap+4}" height="16" fill="#6a2a1a" stroke="${INK}" stroke-width="3.5"/>`;
  g+=plate(-gap/2-pw,-1)+plate(gap/2,1);
  return g; }
function yoyo(hx,hy,u,mode,o={}){ const L=o.len||200, s=o.s||1, col=o.col||YO_RED, ph=o.ph||0, k=sat(o.k||0);
  let cx=hx, cy=hy+L, spin=u*2.2+ph, fast=false, sway=0, roll=0;
  switch(mode){
    case 'drop':   cy=hy+L*k*k; spin=u*(.4+k*2.2)+ph; fast=k>.8; break;
    case 'sleep':  cy=hy+L+Math.sin(u*3.1+ph)*3; cx=hx+Math.sin(u*2.1+ph)*4; fast=true; spin=u*2.6+ph; sway=Math.sin(u*2.1+ph)*4; break;
    case 'return': cy=hy+L*(1-k*k*(3-2*k)); spin=u*(2.6-k*2)+ph; fast=k<.4; break;
    case 'bob':    { const per=o.per||.9, p=(((u/per+ph)%1)+1)%1, tri=p<.5?E.io(p*2):E.io(2-p*2); cy=hy+L*tri; spin=u*1.6+ph; break; }
    case 'walk':   { const R=40*s; cx=o.wx; cy=o.gy-R; spin=-o.wx/(2*Math.PI*R)+ph; roll=1; break; }
  }
  if(o.spin!=null) spin=o.spin; if(o.fast!=null) fast=o.fast;
  const ang=(mode==='walk')?0:(Math.sin(u*2.4+ph)*(mode==='sleep'?3:1));
  let g=`<g transform="translate(${N(cx)} ${N(cy)}) rotate(${N(ang)}) scale(${N(s*100)/100})">`;
  if(fast) g+=[0,1,2].map(i=>{ const a=(u*5+i/3+ph)%1; return `<path d="M${N(-44-a*8)} ${N(-26+i*26)}Q${N(-58-a*8)} ${N(-26+i*26+14)} ${N(-44-a*8)} ${N(-26+i*26+30)}" fill="none" stroke="#6a5a48" stroke-width="3.5" stroke-linecap="round" opacity="${N((1-a)*.8*100)/100}"/><path d="M${N(44+a*8)} ${N(-26+i*26)}Q${N(58+a*8)} ${N(-26+i*26+14)} ${N(44+a*8)} ${N(-26+i*26+30)}" fill="none" stroke="#6a5a48" stroke-width="3.5" stroke-linecap="round" opacity="${N((1-a)*.8*100)/100}"/>`; }).join('');
  g+=yoyoBody(spin,col,fast);
  if(o.cap>0){ const ck=E.back(sat(o.cap)); g+=`<g transform="translate(14 -${N(36)}) rotate(${N(18+wob(u,0,3,5,2))}) scale(${N(ck*100)/100})"><path d="M-22 4Q-14 -34 14 -40Q24 -26 22 4Z" fill="#3a5aa8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M-24 6H24" stroke="#f4efe2" stroke-width="9" stroke-linecap="round"/><circle cx="14" cy="-42" r="7" fill="#f4efe2" stroke="${INK}" stroke-width="3"/></g>`; }
  g+=`</g>`;
  if(o.zzz>0) for(let i=0;i<3;i++){ const a=((u*.55+i/3)%1), zk=sat(o.zzz); g+=`<text x="${N(cx+34+a*50+i*6)}" y="${N(cy-60*s-a*110)}" font-family="${BAL}" font-weight="800" font-size="${N((30+i*10)*s)}" fill="#3a5aa8" stroke="${INK}" stroke-width="2.5" paint-order="stroke fill" opacity="${N(Math.min(1,a*5)*(1-a)*zk*100)/100}" transform="rotate(${N(-12+i*8)} ${N(cx+34+a*50)} ${N(cy-60*s-a*110)})">z</text>`; }
  /* string: hand -> centre of the axle gap (drawn last so it lies over the plates) */
  const mx=(hx+cx)/2+sway, my=(hy+cy)/2, d=`M${N(hx)} ${N(hy)}Q${N(mx)} ${N(my)} ${N(cx)} ${N(cy)}`;
  const str=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${YO_STR}" stroke-width="3" stroke-linecap="round"/>`;
  return str+g; }

/* ============================== sets and props (world space; ground line y=1700; floors start near y 1380-1450) */
const FLOOR=(y,c,line=true)=>`<rect x="-300" y="${y}" width="1680" height="${2500-y}" fill="${c}"/>`+(line?`<path d="M-300 ${y}H1380" stroke="${INK}" stroke-width="7"/>`:'');
const WALLBG=c=>`<rect x="-300" y="-300" width="1680" height="2800" fill="${c}"/>`;
function palm(x,y,s=1,u=0){ const sw=Math.sin(u*1.1+x)*5, tx=10+sw*2; let g=`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0Q${N(22+sw)} -150 ${N(tx)} -330" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/><path d="M0 0Q${N(22+sw)} -150 ${N(tx)} -330" fill="none" stroke="#8a6238" stroke-width="22" stroke-linecap="round"/>`;
  for(let i=0;i<7;i++){ const r=rad(-170+i*48+sw*.6), L=165, ex=tx+Math.cos(r)*L, ey=-330+Math.sin(r)*L*.55+46, qx=tx+Math.cos(r)*L*.5, qy=-330+Math.sin(r)*L*.8-44, d=`M${N(tx)} -330Q${N(qx)} ${N(qy)} ${N(ex)} ${N(ey)}`;
    g+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="25" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#4f9a3a" stroke-width="15" stroke-linecap="round"/>`; }
  return g+`</g>`; }
function hotelLobby(u,t,{dusk=0}={}){ let g=WALLBG('#e9d6a8');
  for(let i=0;i<14;i++) g+=`<rect x="${-200+i*130}" y="-300" width="62" height="1750" fill="#d9c08a" opacity=".6"/>`;
  g+=`<rect x="-300" y="1160" width="1680" height="260" fill="#7a1f2a"/><path d="M-300 1160H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=FLOOR(1400,'#e8dcc0');
  for(let r=0;r<7;r++) for(let c=-2;c<12;c++) if((r+c)%2===0) g+=`<path d="M${-300+c*150-r*14} ${1400+r*r*10+r*40}h150l${-14-r*2} ${40+r*10}h-150Z" fill="#7a4a3a" opacity=".55"/>`;
  /* revolving door, left */
  const a=u*1.1; g+=`<rect x="40" y="560" width="300" height="840" rx="14" ${st('#c8a23a',8)}/><rect x="70" y="590" width="240" height="780" rx="10" fill="#bfe0e8" stroke="${INK}" stroke-width="5"/><circle cx="190" cy="980" r="118" fill="#eaf6f8" stroke="${INK}" stroke-width="5" opacity=".7"/>`;
  for(let i=0;i<4;i++){ const th=a+i*Math.PI/2; g+=`<path d="M190 980L${N(190+Math.cos(th)*118)} ${N(980+Math.sin(th)*118)}" stroke="#8a6a2a" stroke-width="9"/>`; }
  /* key rack + reception desk, right */
  g+=`<rect x="640" y="640" width="440" height="460" rx="8" ${st('#5a3a22',7)}/>`; for(let r=0;r<4;r++) for(let c=0;c<5;c++) g+=`<rect x="${668+c*80}" y="${668+r*104}" width="64" height="90" rx="4" fill="#3a2418" stroke="${INK}" stroke-width="3"/><circle cx="${700+c*80}" cy="${724+r*104}" r="6" fill="#e8c34a"/>`;
  g+=`<rect x="600" y="1230" width="540" height="40" rx="8" ${st('#8a5630',6)}/><rect x="620" y="1270" width="500" height="320" ${st('#6a3e1e',6)}/><rect x="660" y="1310" width="180" height="230" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/><rect x="900" y="1310" width="180" height="230" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/>`;
  g+=`<g transform="translate(700 1228)"><ellipse cy="-6" rx="34" ry="8" ${st('#c8a23a',4)}/><path d="M-26 -8Q-24 -44 0 -48Q24 -44 26 -8Z" ${st('#e8c34a',4)}/><circle cy="-52" r="6" fill="#e8c34a" stroke="${INK}" stroke-width="3"/></g>`;
  g+=palm(1220,1560,.8,u)+`<ellipse cx="1220" cy="1566" rx="64" ry="14" fill="#7a3a2a" stroke="${INK}" stroke-width="5"/>`;
  if(dusk) g+=`<rect x="-300" y="-300" width="1680" height="2800" fill="#1d2a4a" opacity="${dusk}"/>`;
  return g; }
function suitcase(x,y,w,h,col,rot=0){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)})"><rect x="${-w/2}" y="${-h}" width="${w}" height="${h}" rx="10" ${st(col,5)}/><path d="M${-w*.15} ${-h}V${-h-14}H${w*.15}V${-h}" fill="none" stroke="${INK}" stroke-width="6"/><path d="M${-w/2+10} ${-h*.5}H${w/2-10}" stroke="${shade(col,.7)}" stroke-width="4"/><rect x="${-8}" y="${-h*.55}" width="16" height="14" fill="#e8c34a" stroke="${INK}" stroke-width="2.5"/></g>`; }
function philYard(u,t){ let g=`<rect x="-300" y="-300" width="1680" height="1800" fill="url(#gVillSky)"/><circle cx="800" cy="520" r="110" fill="#fff3c4" opacity=".95"/><circle cx="800" cy="520" r="190" fill="#fff3c4" opacity=".2"/>`;
  g+=`<path d="M-300 1100Q200 1040 540 1090T1380 1070V1500H-300Z" fill="#7fb060" opacity=".7"/>`+FLOOR(1380,'#8cbf5a')+`<path d="M-300 1440Q540 1400 1380 1450" fill="none" stroke="#6a9a3a" stroke-width="10" opacity=".6"/>`;
  g+=palm(110,1560,1.1,u)+palm(1010,1520,1,u);
  /* nipa hut on stilts */
  g+=`<g transform="translate(700 1520)"><path d="M-130 0V-110M-60 0V-110M60 0V-110M130 0V-110" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M-130 0V-110M-60 0V-110M60 0V-110M130 0V-110" stroke="#8a6238" stroke-width="9" stroke-linecap="round"/><rect x="-170" y="-130" width="340" height="26" ${st('#a8743a',5)}/><rect x="-140" y="-290" width="280" height="160" ${st('#d9b878',6)}/><path d="M-140 -250H140M-140 -210H140M-140 -170H140" stroke="#b8985a" stroke-width="4"/><rect x="-34" y="-250" width="68" height="120" rx="6" ${st('#5a3a22',5)}/><path d="M-200 -276L0 -420L200 -276Z" ${st('#c9a24a',6)}/><path d="M-170 -286L0 -402L170 -286" fill="none" stroke="#9a7a2a" stroke-width="5" stroke-dasharray="14 10"/><path d="M-120 -104L-170 40M-100 -104L-150 40" stroke="${INK}" stroke-width="7"/></g>`;
  return g; }
function factory(x,y,s,k,u,seed=0){ if(k<=0) return ''; const sc=E.back(sat(k))*s, W=300, H=230; let g=`<g transform="translate(${x} ${y}) scale(${N(sc*100)/100})"><rect x="${-W/2}" y="${-H}" width="${W}" height="${H}" ${st('#b5603a',7)}/>`;
  for(let r=0;r<2;r++) for(let c=0;c<4;c++) g+=`<rect x="${-W/2+22+c*64}" y="${-H+30+r*80}" width="44" height="52" fill="#ffe7a0" stroke="${INK}" stroke-width="4"/>`;
  for(let i=0;i<3;i++) g+=`<path d="M${-W/2+i*100} ${-H}L${-W/2+i*100} ${-H-70}L${-W/2+i*100+100} ${-H}Z" ${st('#8a4a2a',6)}/>`;
  g+=`<rect x="${W/2-70}" y="${-H-150}" width="46" height="150" ${st('#7a3a22',6)}/><rect x="${-60}" y="-86" width="120" height="86" ${st('#5a3a22',5)}/>`;
  for(let i=0;i<3;i++){ const a=((u*.45+i/3+seed*.13)%1); g+=`<g transform="translate(${N(W/2-47+a*70)} ${N(-H-170-a*210)}) scale(${N(.5+a*.9)})" opacity="${N((1-a)*100)/100}"><circle r="30" fill="none" stroke="#e8e8e8" stroke-width="12"/><circle r="30" fill="none" stroke="${INK}" stroke-width="3"/><circle r="9" fill="#e8e8e8" stroke="${INK}" stroke-width="3"/></g>`; }
  return g+`</g>`; }
function conveyor(y,u,s=1){ let g=`<rect x="-300" y="${y}" width="1680" height="46" rx="10" ${st('#4a4a52',6)}/>`; for(let i=0;i<24;i++){ const x=((i*130-u*210)%3100+3100)%3100-400; g+=`<path d="M${x} ${y+46}v14" stroke="${INK}" stroke-width="5"/>`; }
  for(let i=0;i<12;i++){ const x=((i*150+u*190)%1800)-300; g+=`<g transform="translate(${N(x)} ${y-34}) scale(${.52*s})">${yoyoBody(i*.13+u*.5,i%3?YO_RED:'#2c5e8a',false)}</g>`; } return g; }
/* the giant 3D word. lift[i] 0..1 floats letter i away; reg = size of the (R) mark (0 hides it); crack 0..1 splits the mark in two and drops it */
function bigWord(x,y,size,{reg=1,lift=[0,0,0,0,0],crack=0,bump=0,fill='#ffd23a'}={}){ const chs=['Y','O','-','Y','O'], ls=4, ws=chs.map(c=>tW(c,size)+ls), tot=ws.reduce((a,b)=>a+b,0); let cx=-tot/2, g='';
  chs.forEach((c,i)=>{ const k=lift[i]||0, mx=cx+ws[i]/2, dy=-k*520, dx=k*(i-2)*90, r=k*(i*26-52), o=op(1.6-k*1.2);
    let l=''; for(let d=16;d>=1;d-=2) l+=`<text x="${N(d*.7)}" y="${N(d*.9)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${size}" fill="#8a3a14" stroke="${INK}" stroke-width="${N(size*.07)}" stroke-linejoin="round">${c}</text>`;
    l+=`<text text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${size}" fill="${fill}" stroke="${INK}" stroke-width="${N(size*.07)}" stroke-linejoin="round" paint-order="stroke fill">${c}</text>`;
    g+=`<g transform="translate(${N(mx+dx)} ${N(dy)}) rotate(${N(r)})" opacity="${o}">${l}</g>`; cx+=ws[i]; });
  if(reg>0){ const R=size*.2, rx=tot/2-R*.2, ry=-size*.72, sc=reg*(1+bump*.4), half=(d,sg)=>`<g transform="translate(${N(sg*crack*40)} ${N(crack*crack*900)}) rotate(${N(sg*crack*70)})"><clipPath id="rg${UID}${sg>0?'r':'l'}"><rect x="${sg>0?0:-R*2}" y="${-R*2}" width="${R*2}" height="${R*4}"/></clipPath><g clip-path="url(#rg${UID}${sg>0?'r':'l'})"><circle r="${R}" fill="#fffaf0" stroke="${INK}" stroke-width="${N(size*.05)}"/><text y="${N(R*.36)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(R*1.15)}" fill="${INK}">R</text></g></g>`;
    UID++; g+=`<g transform="translate(${N(rx)} ${N(ry)}) scale(${N(sc*100)/100})">${crack>0?half(0,-1)+half(0,1):half(0,-1)+half(0,1)}</g>`; }
  return `<g transform="translate(${N(x)} ${N(y)})">${g}</g>`; }
function patentCounter(u,t){ let g=WALLBG('#5e7a5a'); for(let i=0;i<12;i++) g+=`<rect x="${-200+i*150}" y="-300" width="70" height="1500" fill="#566f52" opacity=".7"/>`;
  g+=`<rect x="-300" y="1000" width="1680" height="300" fill="#7a5a3a"/><path d="M-300 1000H1380" stroke="${INK}" stroke-width="6"/>`+FLOOR(1300,'#5a4a3a');
  g+=`<rect x="520" y="300" width="520" height="640" rx="10" ${st('#c9985a',9)}/><rect x="540" y="320" width="480" height="600" fill="#d9a86a" opacity=".9"/>`;
  g+=`<g transform="translate(160 640)"><rect x="-90" y="-210" width="180" height="420" ${st('#e8dcc0',6)}/><circle cy="-60" r="62" fill="#e8c34a" stroke="${INK}" stroke-width="5"/><path d="M0 -60V-100M0 -60L28 -48" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>`;
  return g; }
function counterFront(){ return `<rect x="-300" y="1380" width="1680" height="54" ${st('#8a5630',7)}/><rect x="-300" y="1434" width="1680" height="300" fill="#6a3e1e"/><path d="M-300 1434H1380" stroke="${INK}" stroke-width="6"/>`+[0,1,2,3,4,5,6].map(i=>`<rect x="${-240+i*240}" y="1470" width="200" height="230" rx="8" fill="none" stroke="#4a2a14" stroke-width="5"/>`).join(''); }
function certificate(x,y,s,rot,{stamp=0,txt='FLORES YO-YO',u=0}={}){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-190" y="-130" width="380" height="260" rx="4" ${st('#f4ecd4',5)}/><rect x="-170" y="-110" width="340" height="220" fill="none" stroke="#a89a6a" stroke-width="3"/><text y="-46" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="30" fill="#5a5040">TRADE-MARK</text><text y="34" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="${INK}">${txt}</text>${stamp>0?stampMark(0,70,['REGISTERED','1930'],CRIM,stamp,-8,40):''}</g>`; }
function formYoYo(x,y,s,rot,{rej=0}={}){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-170" y="-120" width="340" height="240" rx="4" ${st('#f1ead6',5)}/><text y="-50" text-anchor="middle" font-family="Rozha, ${BAL}" font-size="26" fill="#5a5040">TRADE-MARK APPLICATION</text><text y="30" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="76" fill="${INK}">YO-YO</text>${rej>0?stampMark(0,6,['REJECTED'],CRIM,rej,-14,46):''}</g>`; }
function duncanOffice(u,t){ let g=WALLBG('#6a4a2e'); for(let i=0;i<9;i++) g+=`<rect x="${-120+i*160}" y="160" width="140" height="1080" rx="6" fill="#74523a" stroke="#4a3220" stroke-width="5"/>`;
  g+=`<rect x="-300" y="1300" width="1680" height="1800" fill="#3a2a1e"/><path d="M-300 1300H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=`<rect x="120" y="260" width="260" height="360" rx="8" ${st('#2c3e5a',8)}/><rect x="120" y="260" width="260" height="360" fill="url(#gOutside)" opacity=".5"/><path d="M250 260V620M120 440H380" stroke="#5a3a26" stroke-width="10"/>`;
  return g; }
function moneyBag(x,y,s=1,rot=0){ return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><path d="M-46 0Q-70 -50 -30 -86L-22 -104Q0 -96 22 -104L30 -86Q70 -50 46 0Z" ${st('#b89a62',5)}/><path d="M-24 -100Q0 -84 24 -100" fill="none" stroke="${INK}" stroke-width="6"/><text y="-30" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="52" fill="#5a4a22">$</text></g>`; }
function streetCorner(u,t){ let g=WALLBG('#8a8e96'); for(let r=0;r<22;r++) for(let c=0;c<9;c++){ const x=-150+c*150+(r%2)*75, y=-160+r*70; g+=`<rect x="${x}" y="${y}" width="140" height="62" rx="4" fill="${['#7a5a52','#6e5048','#835e54'][(r+c)%3]}" stroke="#4a3632" stroke-width="3"/>`; }
  g+=`<rect x="-300" y="1450" width="1680" height="1800" fill="#9a9aa0"/><path d="M-300 1450H1380" stroke="${INK}" stroke-width="7"/>`+[0,1,2,3,4,5].map(i=>`<path d="M${-300+i*300} 1450L${-420+i*320} 2300" stroke="#7a7a80" stroke-width="5"/>`).join('');
  g+=`<path d="M1000 1450V420" stroke="${INK}" stroke-width="22"/><path d="M1000 1450V420" stroke="#3a3a40" stroke-width="12"/><path d="M950 420H1050L1030 360H970Z" ${st('#3a3a40',5)}/><circle cx="1000" cy="440" r="24" fill="#ffe7a0" opacity=".9"/>`;
  return g; }
function courtBg(){ let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#c97a3a"/>`; for(let i=0;i<14;i++) g+=`<rect x="${-200+i*100}" y="-200" width="60" height="1600" fill="#b86a30" opacity=".6"/>`;
  return g+`<rect x="-300" y="1380" width="1680" height="1800" fill="#5a3a22"/><path d="M-300 1380H1380" stroke="${INK}" stroke-width="7"/>`; }
function courtBench(){ return `<rect x="375" y="1040" width="420" height="36" rx="6" ${st('#8a5630',6)}/><rect x="395" y="1076" width="380" height="330" ${st('#6a3e1e',6)}/><rect x="435" y="1116" width="300" height="200" rx="6" fill="none" stroke="#4a2a14" stroke-width="5"/>`; }
const royalBox=(x,y,rot,s)=>`<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot)}) scale(${s})"><rect x="-150" y="-100" width="300" height="200" rx="8" ${st('#2c5e8a',6)}/><rect x="-130" y="-80" width="260" height="160" rx="4" fill="none" stroke="#fff" stroke-width="4"/><text y="22" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="#fff">ROYAL</text></g>`;
