/* ============================== TOON RIG (episode-local; the engine's fig() is untouched)
   Rubber-hose limbs through a two-bone IK elbow, mitten hands, big cel-shaded heads.
   Local units: ground y=0, figure faces +x, ~340 units tall. */
const INK='#22160f';
let UID=0;
const TC={
  lal:    {skin:'#c98e5e',hair:'#1c1410',grey:0,top:'#f6f1e4',topDk:'#d8d0bc',pants:'#efe9da',shoe:'#5a3a22',mus:'thick',gamchha:['#c8372d','#f6efe0'],headS:1.18,build:0},
  clerk:  {skin:'#d6a274',hair:'#2a2420',top:'#f2ead6',topDk:'#cfc6ad',vest:'#7a2e3a',pants:'#5a5550',shoe:'#3a2a1e',glasses:true,bald:true,pen:true,headS:1.12,build:.2},
  clerk2: {skin:'#b7804f',hair:'#151010',top:'#e9e2cf',topDk:'#c9c0a8',vest:'#3c5a6e',pants:'#4a4640',shoe:'#2a1e16',glasses:false,mus:'thin',headS:1.1,build:.35},
  uncle:  {skin:'#b9804e',hair:'#2a221c',grey:.35,top:'#f3ecdc',topDk:'#d0c7b0',shawl:'#8a5a2a',pants:'#f3ecdc',shoe:'#4a2e1a',mus:'curl',headS:1.2,build:1,dhoti:true,cap:'pagri',capC:'#8a2a3a'},
  lekh:   {skin:'#c79262',hair:'#2a2420',top:'#efe7d2',topDk:'#cfc5ab',pants:'#efe7d2',shoe:'#3a2a1e',cap:'topi',glasses:true,headS:1.12,build:.1},
  cousin: {skin:'#cf9866',hair:'#18110c',top:'#e8a33a',topDk:'#c08228',pants:'#efe9da',shoe:'#5a3a22',headS:1.16,build:0,young:true},
  cop:    {skin:'#b47a4a',hair:'#14100c',top:'#c2a46a',topDk:'#9c8250',pants:'#b39760',shoe:'#2a1a10',mus:'thick',cap:'police',belt:'#5a3a1e',headS:1.14,build:.55,khaki:true},
  wife:   {skin:'#c58a5a',hair:'#120c08',sari:'#1f8f7a',sariDk:'#166b5b',border:'#f3b544',blouse:'#c8372d',shoe:'#5a3a22',bindi:true,bun:true,headS:1.14,build:.1},
  v1:     {skin:'#c08654',hair:'#1a120c',top:'#7fa7c9',topDk:'#5f87a9',pants:'#efe9da',shoe:'#4a2e1a',mus:'thin',headS:1.14,build:.15},
  v2:     {skin:'#a8723f',hair:'#d8d4cc',top:'#f0e6cc',topDk:'#cfc3a5',pants:'#efe9da',shoe:'#4a2e1a',mus:'thick',cap:'pagri',capC:'#e6a23a',headS:1.14,build:.3},
  v3:     {skin:'#cf9a6a',hair:'#14100c',sari:'#d8572e',sariDk:'#a8401f',border:'#2c5e8a',blouse:'#2c5e8a',shoe:'#5a3a22',bindi:true,bun:true,headS:1.12,build:0},
  v4:     {skin:'#b98050',hair:'#1a120c',top:'#9fbf6a',topDk:'#7f9f4a',pants:'#efe9da',shoe:'#4a2e1a',headS:1.14,build:.2},
};
Object.assign(TC,{
  lizzie: {skin:'#f0c9a4',hair:'#6a4428',dress:true,top:'#fbf6ea',topDk:'#ddd4c0',skirt:'#2c3e6a',belt:'#1d2a4a',shoe:'#2a1e16',updo:true,fem:true,headS:1.18,build:0},
  lizzieOld:{skin:'#ecc4a0',hair:'#6a4428',grey:.85,dress:true,top:'#e8e0cc',topDk:'#ccc3ae',skirt:'#4a3a5a',belt:'#2a2030',shoe:'#2a1e16',updo:true,fem:true,glasses:true,headS:1.18,build:.1},
  darrow: {skin:'#ecbc94',hair:'#3a2a1e',suit:true,top:'#5c6170',topDk:'#474b58',shirt:'#f4efe2',tie:'#8a2a2a',pants:'#4a4e5a',shoe:'#1e1610',cap:'fedora',capC:'#4a3e34',mus:'thin',headS:1.14,build:.1},
  exec:   {skin:'#f0c4a0',hair:'#cfc9bf',suit:true,top:'#1f2a44',topDk:'#162036',shirt:'#f4efe2',tie:'#2c5e8a',pants:'#1f2a44',shoe:'#120c08',bald:true,glasses:true,headS:1.14,build:.7},
  pal:    {skin:'#e2ad84',hair:'#2a1e16',suit:true,top:'#7a5a3a',topDk:'#634830',shirt:'#e8e0cc',tie:'#3a5a3a',pants:'#5a4a3a',shoe:'#2a1e16',cap:'flat',capC:'#6a5a48',headS:1.14,build:.2},
  prof:   {skin:'#eab890',hair:'#6a4a2e',suit:true,top:'#a8743a',topDk:'#8a5e2e',shirt:'#e9dfc6',tie:'#c8572e',pants:'#6a4a2e',shoe:'#3a2a1e',beard:true,glasses:true,headS:1.16,build:.2},
  lawyer: {skin:'#e8bc98',hair:'#2a221c',suit:true,top:'#2e2e34',topDk:'#222228',shirt:'#f4efe2',tie:'#6a1f2a',pants:'#2e2e34',shoe:'#120c08',mus:'thin',headS:1.12,build:.4},
  p1:     {skin:'#efc6a0',hair:'#8a5a2e',suit:true,top:'#6a7a5a',topDk:'#56644a',shirt:'#f4efe2',tie:'#c8a23a',pants:'#5a5048',shoe:'#2a1e16',headS:1.16,build:0,young:true},
  p2:     {skin:'#d9a37a',hair:'#1e1610',dress:true,top:'#f3d9c8',topDk:'#d9bfae',skirt:'#7a2e3a',belt:'#4a1a22',shoe:'#2a1e16',updo:true,fem:true,headS:1.16,build:0},
  p3:     {skin:'#f2cfae',hair:'#c9a46a',suit:true,top:'#3c5a6e',topDk:'#30495a',shirt:'#f4efe2',tie:'#8a2a2a',pants:'#3a3a40',shoe:'#1e1610',cap:'flat',capC:'#5a5a62',headS:1.14,build:.3},
});
const tw=(x,y,s,face,l)=>[x+l[0]*s*face,y+l[1]*s];          // local -> world
const ang=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
function hose(a,j,e,w,col){ const c=[2*j[0]-(a[0]+e[0])/2,2*j[1]-(a[1]+e[1])/2];
  const d=`M${N(a[0])} ${N(a[1])}Q${N(c[0])} ${N(c[1])} ${N(e[0])} ${N(e[1])}`;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w+10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`; }
/* mitten hands. dir = forearm angle (deg). kinds: open, fist, point, flat (palm out), hold */
function mitt(e,dir,kind,skin,back){ const col=back?shade(skin,.86):skin;
  let g=''; const st=`fill="${col}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"`;
  switch(kind){
    case 'point': g=`<path d="M0 -10Q14 -12 34 -8Q42 -4 34 0Q22 2 14 6Q6 14 -4 10Q-14 2 -8 -8Z" ${st}/><path d="M6 8Q2 0 8 -4" fill="none" stroke="${INK}" stroke-width="3"/>`; break;
    case 'fist': g=`<path d="M-8 -12Q8 -18 16 -6Q20 8 8 14Q-8 16 -12 4Q-14 -6 -8 -12Z" ${st}/><path d="M6 -10Q12 -4 8 2M2 -12Q8 -4 2 4" fill="none" stroke="${INK}" stroke-width="2.6"/>`; break;
    case 'flat': g=`<path d="M-6 -16Q10 -22 22 -14Q28 -2 22 12Q8 20 -6 14Q-12 0 -6 -16Z" ${st}/><path d="M-4 -14Q-16 -22 -20 -12Q-16 -4 -6 -4" ${st}/>`; break;
    case 'hold': g=`<path d="M-6 -12Q10 -16 16 -4Q18 10 4 14Q-10 14 -12 2Q-12 -8 -6 -12Z" ${st}/><path d="M-2 -10Q-12 -18 -16 -8Q-12 0 -4 -2" ${st}/>`; break;
    default: g=`<path d="M-8 -12Q8 -18 20 -10Q28 0 20 10Q6 18 -8 12Q-14 0 -8 -12Z" ${st}/><path d="M4 -14Q2 -26 -8 -24Q-14 -18 -6 -10" ${st}/><path d="M10 -6Q16 -2 12 4" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
  }
  return `<g transform="translate(${N(e[0])} ${N(e[1])}) rotate(${N(dir)})">${g}</g>`; }
/* expressions: lid (0 open..1 shut) per eye, brows [inner,outer] heights, mouth, pupil radius, extras */
const EX={
  neutral:{lid:[.22,.22],br:[-30,-30],m:'flat'},
  hopeful:{lid:[0,0],br:[-38,-34],m:'smile',pr:4.6},
  happy:  {lid:[0,0],br:[-36,-34],m:'grin',cheek:1},
  joy:    {lid:[1,1],arc:1,br:[-40,-38],m:'shout',cheek:1},
  proud:  {lid:[1,1],arc:1,br:[-36,-32],m:'grin',cheek:1},
  shock:  {lid:[0,0],br:[-44,-42],m:'o',pr:2.8,big:1},
  confused:{lid:[.15,0],br:[-30,-42],m:'wavy',pr:4},
  smug:   {lid:[.5,.5],br:[-26,-36],m:'smirk'},
  sneaky: {lid:[.45,.45],br:[-24,-34],m:'smirk',look:[5,0]},
  sad:    {lid:[.35,.35],br:[-40,-26],m:'frown'},
  tired:  {lid:[.55,.55],br:[-30,-28],m:'flat'},
  stern:  {lid:[.35,.35],br:[-24,-32],m:'flat'},
  bored:  {lid:[.6,.6],br:[-30,-30],m:'flat'},
  determined:{lid:[.25,.25],br:[-22,-34],m:'tight'},
  angry:  {lid:[.2,.2],br:[-18,-36],m:'shout'},
  plead:  {lid:[0,0],br:[-42,-30],m:'wavy',pr:5},
  awe:    {lid:[0,0],br:[-42,-40],m:'o',pr:3.4},
  wince:  {lid:[.85,.85],br:[-24,-36],m:'tight'},
};
const EYEP=[[14,-6],[33,-6]];
function face(c,p,t,seed){ const ex=EX[p.expr||'neutral']||EX.neutral, look=p.look||ex.look||[0,0];
  const blinkK=((t*.29+seed*.37)%1), blink=!ex.arc && blinkK<.028 && !p.noBlink;
  let g='';
  EYEP.forEach(([x,y],i)=>{ const rx=ex.big?10:7.6, ry=ex.big?12:9.6, lid=Math.max(blink?1:0,ex.lid[i]+(p.lidAdd||0));
    if(ex.arc){ g+=`<path d="M${x-9} ${y+2}Q${x} ${y-10} ${x+9} ${y+2}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`; return; }
    const pr=(p.pr||ex.pr||4.6), px=x+look[0]*1.3, py=y+look[1]*1.3+1;
    g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fffdf6" stroke="${INK}" stroke-width="3.6"/>`;
    if(lid<.98){ g+=`<circle cx="${N(px)}" cy="${N(py)}" r="${pr}" fill="${INK}"/><circle cx="${N(px+1.6)}" cy="${N(py-1.8)}" r="1.5" fill="#fff"/>`; }
    if(lid>0){ const ly=y-ry+2*ry*Math.min(1,lid); g+=`<path d="M${x-rx-2} ${y-ry-3}H${x+rx+2}V${N(ly)}Q${x} ${N(ly+3)} ${x-rx-2} ${N(ly)}Z" fill="${c.skin}"/><path d="M${x-rx} ${N(ly)}Q${x} ${N(ly+3)} ${x+rx} ${N(ly)}" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`; }
  });
  if(c.fem&&!ex.arc) EYEP.forEach(([x,y])=>{ g+=`<path d="M${x+6} ${y-9}l6 -5M${x+8} ${y-5}l7 -2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; });
  // brows (thick, expressive)
  const br=p.br||ex.br, bw=c.young?5:6.5;
  g+=`<path d="M${EYEP[0][0]-9} ${N(br[1]+2)}Q${EYEP[0][0]} ${N((br[0]+br[1])/2-3)} ${EYEP[0][0]+8} ${N(br[0])}" fill="none" stroke="${c.grey>.5?'#bdb6ac':c.hair}" stroke-width="${bw}" stroke-linecap="round"/>`;
  g+=`<path d="M${EYEP[1][0]-7} ${N(br[0])}Q${EYEP[1][0]+1} ${N((br[0]+br[1])/2-3)} ${EYEP[1][0]+9} ${N(br[1]+2)}" fill="none" stroke="${c.grey>.5?'#bdb6ac':c.hair}" stroke-width="${bw}" stroke-linecap="round"/>`;
  // mouth
  const mk=p.mouth!=null?p.mouth:1, M=(d,f='none')=>`<path d="${d}" fill="${f}" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const mx=28, my=29;
  switch(p.m||ex.m){
    case 'smile': g+=M(`M${mx-12} ${my-4}Q${mx} ${my+7} ${mx+12} ${my-5}`); break;
    case 'grin': g+=M(`M${mx-13} ${my-5}Q${mx} ${my-4} ${mx+13} ${my-6}Q${mx+8} ${my+12} ${mx-1} ${my+12}Q${mx-10} ${my+10} ${mx-13} ${my-5}Z`,'#6a1f18')+`<path d="M${mx-6} ${my+8}Q${mx} ${my+4} ${mx+6} ${my+8}" fill="#e06a5a"/>`; break;
    case 'shout': g+=M(`M${mx-12} ${my-6}Q${mx} ${my-8} ${mx+12} ${my-6}Q${mx+10} ${my+16} ${mx} ${my+17}Q${mx-11} ${my+15} ${mx-12} ${my-6}Z`,'#6a1f18')+`<path d="M${mx-6} ${my+12}Q${mx} ${my+6} ${mx+6} ${my+12}" fill="#e06a5a"/>`; break;
    case 'o': g+=`<ellipse cx="${mx}" cy="${my+3}" rx="${N(5+3*mk)}" ry="${N(5+6*mk)}" fill="#6a1f18" stroke="${INK}" stroke-width="4"/>`; break;
    case 'frown': g+=M(`M${mx-11} ${my+4}Q${mx} ${my-6} ${mx+11} ${my+4}`); break;
    case 'smirk': g+=M(`M${mx-10} ${my}Q${mx+2} ${my+4} ${mx+12} ${my-6}`); break;
    case 'wavy': g+=M(`M${mx-12} ${my}Q${mx-6} ${my-5} ${mx} ${my}Q${mx+6} ${my+5} ${mx+12} ${my-1}`); break;
    case 'tight': g+=M(`M${mx-9} ${my+1}L${mx+9} ${my-1}`); break;
    default: g+=M(`M${mx-9} ${my}Q${mx} ${my+2} ${mx+9} ${my}`);
  }
  if(ex.cheek) g+=`<ellipse cx="6" cy="14" rx="9" ry="5" fill="#e2725b" opacity=".45"/><ellipse cx="40" cy="15" rx="5" ry="4" fill="#e2725b" opacity=".45"/>`;
  return g; }
function toonHead(c,p,t,seed,uid){ const R=44;
  let g='';
  if(c.bun) g+=`<circle cx="-36" cy="-14" r="20" fill="${c.hair}" stroke="${INK}" stroke-width="5"/>`;
  if(p.veil) g+=`<path d="M-56 46Q-64 -54 0 -58Q44 -58 50 -24L30 -36Q-24 -40 -36 14L-30 70Z" fill="${p.veil}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  g+=`<path d="M-6 30 L-2 62 L22 62 L24 30Z" fill="${c.skin}" stroke="${INK}" stroke-width="5"/>`;          // neck
  g+=`<circle r="${R}" fill="${c.skin}" stroke="${INK}" stroke-width="5.5"/>`;
  g+=`<clipPath id="hc${uid}"><circle r="${R-2.5}"/></clipPath><g clip-path="url(#hc${uid})"><circle cx="13" cy="-11" r="48" fill="none" stroke="${shade(c.skin,.83)}" stroke-width="26"/></g>`;
  // hair
  const hc=c.grey>0?mixHex(c.hair,'#cfc9bf',Math.min(1,c.grey)):c.hair;
  if(c.updo) g+=`<circle cx="-30" cy="-40" r="24" fill="${hc}" stroke="${INK}" stroke-width="4.5"/><path d="M-46 10Q-58 -44 -12 -58Q34 -64 48 -20Q30 -40 6 -40Q-20 -40 -34 -14Q-38 0 -36 12Z" fill="${hc}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-26 -40Q0 -54 28 -40" fill="none" stroke="${shade(hc,1.3)}" stroke-width="4"/>`;
  else if(c.bald) g+=`<path d="M-44 4Q-48 -14 -38 -24Q-34 -6 -30 8Z" fill="${hc}" stroke="${INK}" stroke-width="3.5"/><path d="M-12 -40Q-2 -46 6 -40" fill="none" stroke="${shade(c.skin,.8)}" stroke-width="3"/>`;
  else if(c.young) g+=`<path d="M-44 6Q-52 -40 -10 -48Q30 -52 44 -22Q30 -30 18 -26Q24 -36 10 -36Q2 -26 -16 -30Q-28 -22 -34 6Z" fill="${hc}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
  else g+=`<path d="M-44 6Q-50 -38 -8 -47Q30 -52 44 -20Q24 -32 2 -30Q-22 -28 -30 -10Q-34 0 -34 8Z" fill="${hc}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if(c.grey>0&&!c.bald) g+=`<path d="M-38 -12Q-32 -30 -14 -36" fill="none" stroke="#e8e3da" stroke-width="4" opacity="${N(Math.min(1,c.grey*1.4)*100)/100}" stroke-linecap="round"/>`;
  g+=`<g transform="translate(-14 6)"><ellipse rx="10" ry="13" fill="${c.skin}" stroke="${INK}" stroke-width="4.5"/><path d="M-2 -6Q4 0 -2 6" fill="none" stroke="${INK}" stroke-width="3"/></g>`;   // ear
  g+=face(c,p,t,seed);
  g+=`<path d="M41 2Q56 10 44 20" fill="${c.skin}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>`;   // nose
  if(c.beard) g+=`<path d="M-8 20Q-6 56 22 62Q50 62 54 30Q46 40 30 38Q14 36 6 18Z" fill="${c.hair}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M18 22Q32 14 50 22" fill="none" stroke="${c.hair}" stroke-width="7" stroke-linecap="round"/>`;
  if(c.mus==='thick') g+=`<path d="M18 22Q30 12 50 20Q54 30 44 28Q34 24 22 30Q14 30 18 22Z" fill="${c.grey>.6?'#cfc9bf':c.hair}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(c.mus==='thin') g+=`<path d="M20 22Q32 16 48 22" fill="none" stroke="${c.hair}" stroke-width="6" stroke-linecap="round"/>`;
  if(c.mus==='curl') g+=`<path d="M10 24Q-4 18 0 6Q6 16 18 20Q32 12 50 20Q64 12 66 0Q72 18 54 28Q38 26 28 28Q18 30 10 24Z" fill="${c.grey>.6?'#cfc9bf':c.hair}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(c.glasses||p.glasses) g+=`<g fill="#ffffff" fill-opacity=".14" stroke="${INK}" stroke-width="4"><rect x="2" y="-18" width="24" height="22" rx="7"/><rect x="28" y="-18" width="16" height="22" rx="6"/><path d="M26 -9H28M2 -10L-12 -6" fill="none"/></g>`;
  if(c.bindi) g+=`<circle cx="24" cy="-24" r="3.6" fill="#c8372d"/>`;
  if(c.pen) g+=`<path d="M-24 -18L-2 -30" stroke="#2c5e8a" stroke-width="6" stroke-linecap="round"/>`;
  if(c.cap==='topi') g+=`<path d="M-40 -22Q-38 -48 0 -50Q30 -50 40 -26Q2 -16 -40 -22Z" fill="#fbf8ef" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-30 -38Q0 -44 30 -34" fill="none" stroke="#d8d0bc" stroke-width="3"/>`;
  if(c.cap==='police') g+=`<path d="M-40 -24Q-40 -58 4 -60Q40 -58 44 -28Z" fill="#c2a46a" stroke="${INK}" stroke-width="4.5"/><path d="M-42 -26H46" stroke="#7a2a2a" stroke-width="8"/><path d="M14 -26Q44 -26 60 -16Q34 -14 14 -20Z" fill="#2a1a10" stroke="${INK}" stroke-width="3.5"/><circle cx="18" cy="-40" r="6" fill="#e8c34a" stroke="${INK}" stroke-width="2.5"/>`;
  if(c.cap==='fedora') g+=`<ellipse cx="4" cy="-30" rx="66" ry="14" fill="${c.capC}" stroke="${INK}" stroke-width="4.5"/><path d="M-38 -32Q-40 -78 4 -80Q46 -78 44 -32Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5"/><path d="M-38 -42Q4 -50 44 -42" stroke="#1e1610" stroke-width="9" fill="none"/><path d="M-4 -78Q4 -66 12 -78" fill="none" stroke="${shade(c.capC,.7)}" stroke-width="3"/>`;
  if(c.cap==='flat') g+=`<path d="M-42 -22Q-44 -58 4 -60Q40 -58 46 -30Q66 -26 70 -18Q40 -14 -42 -22Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-30 -44Q6 -52 36 -38" fill="none" stroke="${shade(c.capC,.75)}" stroke-width="3"/>`;
  if(c.cap==='pagri') g+=`<path d="M-44 -14Q-50 -58 0 -62Q44 -60 46 -22Q20 -30 -10 -24Q-30 -20 -44 -14Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5"/><path d="M-36 -30Q0 -48 40 -32M-38 -44Q0 -58 34 -46" fill="none" stroke="${shade(c.capC,.75)}" stroke-width="4"/>`;
  if(p.headExtra) g+=p.headExtra;
  return g; }
/* the figure. p: lean,tilt,hx,hy,look,expr,hF,hB,handF,handB,fF,fB,sq,sit,holdF,holdB,shoulder */
function toon(who,x,y,s,dir,p,t,seed=0){ const c={...TC[who],...(p.cos||{})}, uid=++UID;
  const lean=p.lean||0, U=[Math.sin(rad(lean)),-Math.cos(rad(lean))], Nn=[-U[1],U[0]];
  const hipY=-122+(p.hy||0)+(p.breath===false?0:Math.sin(t*2.2+seed)*1.2), hip=[p.hx||0,hipY];
  const at=(f,n)=>[hip[0]+U[0]*f+Nn[0]*n, hip[1]+U[1]*f+Nn[1]*n];
  const neck=at(112,0), sh=at(100-(p.shrug||0),2);
  const ht=lean+(p.tilt||0), HU=[Math.sin(rad(ht)),-Math.cos(rad(ht))], hs=(c.headS||1.15)*(p.headK||1);
  const hc=[neck[0]+HU[0]*(48*hs), neck[1]+HU[1]*(48*hs)-(p.shrug||0)*.3];
  const hF=p.hF||[16,-110], hB=p.hB||[-10,-112];
  const aF=ik(sh,hF,58,56,1), aB=ik(sh,hB,58,56,1);
  const lF=ik(hip,p.fF||[20,0],66,62,-1), lB=ik(hip,p.fB||[-16,0],66,62,-1);
  const sleeve=c.sari?c.blouse:(c.top);
  const belly=c.build||0;
  let g=p.noShadow?'':`<ellipse cx="${N(hip[0]*.5)}" cy="4" rx="${N(80+belly*20)}" ry="13" fill="#000" opacity=".22"/>`;
  const arm=(A,back,kind)=>{ const col=back?shade(sleeve,.82):sleeve, sk=c.skin; const d=ang(A.j,A.e);
    let sl=hose(A.a,A.j,A.e,c.sari?15:19,col);
    if(c.suit||c.dress){ sl=hose(A.a,A.j,A.e,c.dress?17:21,col); if(c.suit){ const q=[lerp(A.j[0],A.e[0],.9),lerp(A.j[1],A.e[1],.9)]; sl+=`<circle cx="${N(q[0])}" cy="${N(q[1])}" r="9" fill="${c.shirt}" stroke="${INK}" stroke-width="3"/>`; } }
    else if(!c.sari&&!c.khaki){ const m=[lerp(A.j[0],A.e[0],.55),lerp(A.j[1],A.e[1],.55)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+hose(A.a,A.j,m,21,col); }
    if(c.khaki){ const m=[lerp(A.a[0],A.j[0],.8),lerp(A.a[1],A.j[1],.8)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+`<path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${INK}" stroke-width="31" stroke-linecap="round"/><path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${col}" stroke-width="21" stroke-linecap="round"/>`; }
    return sl+mitt(A.e,d,kind||'open',sk,back); };
  const leg=(L,back)=>{ const col=back?shade(c.pants||'#eee',.84):(c.pants||'#eee'), f=L.e;
    let s2=(c.sari||c.dress)?'':hose(L.a,L.j,L.e,c.dhoti?28:20,col);
    s2+=`<path d="M${N(f[0]-14)} ${N(f[1]-12)}Q${N(f[0]+8)} ${N(f[1]-20)} ${N(f[0]+30)} ${N(f[1]-6)}Q${N(f[0]+34)} ${N(f[1]+2)} ${N(f[0]+24)} ${N(f[1]+3)}L${N(f[0]-14)} ${N(f[1]+3)}Q${N(f[0]-20)} ${N(f[1]-4)} ${N(f[0]-14)} ${N(f[1]-12)}Z" fill="${back?shade(c.skin,.86):c.skin}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M${N(f[0]-16)} ${N(f[1]+3)}H${N(f[0]+30)}" stroke="${c.shoe}" stroke-width="7" stroke-linecap="round"/>`;
    return s2; };
  if(!p.behind) g+=arm(aB,true,p.handB);
  g+=leg(lB,true)+leg(lF,false);
  // torso
  const P=(f,n)=>{ const q=at(f,n); return N(q[0])+' '+N(q[1]); };
  if(c.dress){ const hem=-hipY-6, sw=Math.sin(t*2+seed)*3;
    g+=`<path d="M${P(32,-26)}L${P(-hem*.4,-40)}Q${P(-hem*.8,-56+sw)} ${P(-hem,-66+sw)}Q${P(-hem-4,0)} ${P(-hem,66+sw)}Q${P(-hem*.8,56+sw)} ${P(-hem*.4,42)}L${P(32,28)}Z" fill="${c.skirt}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(20,-30)}L${P(-hem+10,-60+sw)}L${P(-hem+10,-40+sw)}L${P(20,-14)}Z" fill="${shade(c.skirt,.82)}"/>`;
    g+=`<path d="M${P(110,-22)}Q${P(118,0)} ${P(110,22)}Q${P(84,34)} ${P(60,32)}L${P(30,28)}L${P(30,-28)}L${P(60,-32)}Q${P(84,-34)} ${P(110,-22)}Z" fill="${c.top}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(100,-18)}Q${P(70,-26)} ${P(36,-24)}L${P(36,-12)}Q${P(70,-12)} ${P(100,-6)}Z" fill="${c.topDk}"/><path d="M${P(32,-30)}L${P(32,30)}" stroke="${c.belt}" stroke-width="13"/><path d="M${P(112,10)}L${P(60,14)}" stroke="${shade(c.top,.8)}" stroke-width="3"/>`;
    g+=`<path d="M${P(116,-12)}L${P(124,-12)}L${P(124,16)}L${P(116,16)}Z" fill="${c.top}" stroke="${INK}" stroke-width="3.5"/>`;
  } else if(c.sari){ const hem=-hipY-6;
    g+=`<path d="M${P(108,-18)}Q${P(112,0)} ${P(108,18)}Q${P(88,34)} ${P(60,30)}L${P(-hem*.2,40)}Q${P(-hem*.6,48)} ${P(-hem,58)}L${P(-hem,-54)}Q${P(-hem*.6,-44)} ${P(-hem*.2,-34)}L${P(60,-30)}Q${P(88,-30)} ${P(108,-18)}Z" fill="${c.sari}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(-hem+12,-52)}L${P(-hem+12,56)}" stroke="${c.border}" stroke-width="12"/><path d="M${P(104,-20)}Q${P(70,0)} ${P(20,36)}L${P(-hem*.9,52)}" fill="none" stroke="${c.border}" stroke-width="10"/>`;
    g+=`<path d="M${P(100,-14)}Q${P(90,-2)} ${P(64,12)}L${P(54,-24)}Q${P(80,-30)} ${P(100,-14)}Z" fill="${c.blouse}" stroke="${INK}" stroke-width="4"/>`;
  } else {
    const w0=26+belly*6, w1=34+belly*26, wh=38+belly*16, hemF=c.khaki?-6:c.suit?-30:-58;
    g+=`<path d="M${P(110,-w0+8)}Q${P(116,0)} ${P(110,w0-6)}Q${P(102,w0+6)} ${P(92,w0+4)}Q${P(52,w1+4)} ${P(10,w1)}L${P(hemF,wh)}Q${P(hemF-4,0)} ${P(hemF,-wh+2)}L${P(20,-w1+6)}Q${P(70,-w0-8)} ${P(110,-w0+8)}Z" fill="${c.top}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(96,-w0)}Q${P(60,-w0-6)} ${P(20,-w1+8)}L${P(hemF+4,-wh+4)}L${P(hemF+4,-wh+20)}L${P(24,-w1+22)}Q${P(66,-w0+10)} ${P(98,-w0+12)}Z" fill="${c.topDk}"/>`;
    if(c.vest) g+=`<path d="M${P(104,-w0+6)}L${P(104,w0-8)}Q${P(70,w1)} ${P(18,w1-2)}L${P(18,-w1+8)}Q${P(70,-w0)} ${P(104,-w0+6)}Z" fill="${c.vest}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M${P(106,8)}L${P(70,18)}L${P(104,22)}" fill="${c.top}" stroke="${INK}" stroke-width="3"/>`;
    if(c.khaki){ g+=`<path d="M${P(-2,-wh)}L${P(-2,wh)}" stroke="${c.belt}" stroke-width="12"/><rect x="${N(at(-2,wh-14)[0]-7)}" y="${N(at(-2,wh-14)[1]-8)}" width="14" height="16" fill="#e8c34a" stroke="${INK}" stroke-width="2.5"/><path d="M${P(100,12)}L${P(40,14)}" stroke="${shade(c.top,.8)}" stroke-width="3"/>`; }
    else if(c.suit){ g+=`<path d="M${P(112,2)}L${P(72,15)}L${P(112,28)}Z" fill="${c.shirt}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M${P(108,15)}L${P(70,15)}" stroke="${c.tie}" stroke-width="9" stroke-linecap="round"/><path d="M${P(112,0)}L${P(64,12)}M${P(112,30)}L${P(64,18)}" stroke="${shade(c.top,.7)}" stroke-width="5"/><circle cx="${N(at(40,15)[0])}" cy="${N(at(40,15)[1])}" r="4" fill="${shade(c.top,.6)}"/>`; }
    else if(!c.vest&&!c.dhoti){ g+=`<path d="M${P(108,14)}L${P(62,16)}" stroke="${shade(c.top,.72)}" stroke-width="3.5"/>`; for(let i=0;i<3;i++) g+=`<circle cx="${N(at(102-i*14,15)[0])}" cy="${N(at(102-i*14,15)[1])}" r="3.2" fill="${shade(c.top,.6)}"/>`; }
    if(c.shawl) g+=`<path d="M${P(112,-w0+2)}Q${P(96,4)} ${P(100,w0+2)}L${P(70,w1+10)}Q${P(40,-6)} ${P(-30,-wh-6)}L${P(-24,-wh-24)}Q${P(60,-w0-16)} ${P(112,-w0+2)}Z" fill="${c.shawl}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M${P(100,-w0)}Q${P(40,-w0-8)} ${P(-14,-wh-10)}" fill="none" stroke="${shade(c.shawl,1.25)}" stroke-width="5" stroke-dasharray="10 10"/>`;
  }
  // gamchha: checked cotton towel over the shoulder, ends swing
  if(c.gamchha&&!p.noGamchha){ const sw=Math.sin(t*2.4+seed)*4-lean*.5+(p.gsw||0), [a1,b1]=c.gamchha, uidg=uid;
    const p1=at(112,-6), p2=at(100,22), e1=at(40+sw*.6,30+sw), e2=at(52,-30+sw*.6);
    g+=`<pattern id="gp${uidg}" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="${b1}"/><rect width="7" height="14" fill="${a1}" opacity=".85"/><rect width="14" height="7" fill="${a1}" opacity=".55"/></pattern>`;
    g+=`<path d="M${N(p1[0])} ${N(p1[1])}Q${N(p2[0]+6)} ${N(p2[1])} ${N(e1[0]+10)} ${N(e1[1])}L${N(e1[0]-10)} ${N(e1[1]+4)}Q${N(p2[0]-14)} ${N(p2[1])} ${N(p1[0]-8)} ${N(p1[1]+6)}Z" fill="url(#gp${uidg})" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${N(p1[0])} ${N(p1[1])}Q${N(at(80,-30)[0])} ${N(at(80,-30)[1])} ${N(e2[0]-6)} ${N(e2[1])}L${N(e2[0]+12)} ${N(e2[1]+4)}Q${N(at(86,-18)[0])} ${N(at(86,-18)[1])} ${N(p1[0]+8)} ${N(p1[1]+4)}Z" fill="url(#gp${uidg})" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`; }
  if(c.sari&&!p.noPallu){ const sw=Math.sin(t*2+seed)*3, a=at(108,-16), b=at(30,-50-sw), cc=at(-40,-44+sw);
    g+=`<path d="M${N(a[0])} ${N(a[1])}Q${N(b[0])} ${N(b[1])} ${N(cc[0])} ${N(cc[1])}L${N(cc[0]+30)} ${N(cc[1]+4)}Q${N(b[0]+24)} ${N(b[1]+4)} ${N(a[0]+20)} ${N(a[1]+6)}Z" fill="${c.sariDk}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`; }
  if(p.garland){ const a=at(112,-30), b=at(54,4), cc=at(112,30); g+=`<path d="M${N(a[0])} ${N(a[1])}Q${N(b[0]-10)} ${N(b[1]+30)} ${N(cc[0])} ${N(cc[1])}" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M${N(a[0])} ${N(a[1])}Q${N(b[0]-10)} ${N(b[1]+30)} ${N(cc[0])} ${N(cc[1])}" fill="none" stroke="${SAFF}" stroke-width="22" stroke-linecap="round"/><path d="M${N(a[0])} ${N(a[1])}Q${N(b[0]-10)} ${N(b[1]+30)} ${N(cc[0])} ${N(cc[1])}" fill="none" stroke="${MARI}" stroke-width="12" stroke-dasharray="3 14" stroke-linecap="round"/>`; }
  g+=`<g transform="translate(${N(hc[0])} ${N(hc[1])}) rotate(${N(ht)}) scale(${N(hs*100)/100})">${toonHead(c,{...p,veil:c.sari&&!p.noVeil?c.sariDk:null},t,seed,uid)}</g>`;
  if(p.behind){ g=arm(aB,true,p.handB)+g; }
  if(p.holdB) g+=`<g transform="translate(${N(aB.e[0])} ${N(aB.e[1])}) rotate(${N(p.holdB.rot||0)})">${p.holdB.svg}</g>`;
  g+=arm(aF,false,p.handF);
  if(p.holdF) g+=`<g transform="translate(${N(aF.e[0])} ${N(aF.e[1])}) rotate(${N(p.holdF.rot||0)})">${p.holdF.svg}</g>`;
  if(p.holdF&&p.holdF.over) g+=mitt(aF.e,ang(aF.j,aF.e),p.handF||'hold',c.skin,false);
  const sq=p.sq||0, sx=1+sq*.45, sy=1-sq;
  return `<g transform="translate(${N(x)} ${N(y)}) scale(${N(s*dir*sx*1000)/1000} ${N(s*sy*1000)/1000})"${p.op!=null?` opacity="${N(p.op*100)/100}"`:''}>${g}</g>`;
}
/* poses (local coords). Hands: [x,y] targets; feet on ground. */
const TP={
  stand:{hF:[22,-112],hB:[-12,-114]},
  hopeful:{hF:[44,-168],hB:[30,-160],handF:'open',handB:'open',expr:'hopeful',tilt:-4},
  namaste:{hF:[58,-196],hB:[52,-192],handF:'flat',handB:'flat',expr:'hopeful',tilt:-6},
  shock:{lean:-10,tilt:-10,hF:[70,-250],hB:[40,-240],handF:'open',handB:'open',expr:'shock'},
  pointSelf:{hF:[40,-196],hB:[-10,-110],handF:'point',expr:'confused',tilt:6},
  shrug:{hF:[90,-200],hB:[-70,-196],handF:'open',handB:'open',expr:'confused',shrug:10},
  proud:{lean:-4,hF:[44,-150],hB:[-30,-150],handF:'fist',handB:'fist',expr:'proud',tilt:-8},
  cheer:{lean:-6,tilt:-10,hF:[60,-330],hB:[-40,-320],handF:'fist',handB:'fist',expr:'joy'},
  sit:{hy:52,fF:[86,0],fB:[66,0],hF:[70,-112],hB:[56,-110],expr:'tired'},
  armsCross:{hF:[54,-178],hB:[44,-172],handF:'fist',handB:'fist',expr:'stern',behind:false},
};
