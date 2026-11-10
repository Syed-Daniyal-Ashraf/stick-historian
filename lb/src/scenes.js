/* ============================== The Man Who Was Dead for 18 Years — Lal Bihari 'Mritak', Uttar Pradesh, 1976-1994
   Events follow published accounts (Open magazine "The Living Dead"; Wikipedia; Improbable Research). Faces, rooms,
   clothes, staging and the exact look of every place are illustration. */
const CAM0={x:540,y:960,z:1};
const MARI='#ffb627', SAFF='#f08a24', TEAL='#1f8f7a', CRIM='#c8372d', IVORY='#f7ebd4', NAVY='#16223A', LEAF='#5f9a3a';
const BAL='Baloo, sans-serif';
window.__fontsReady=Promise.all(['800 40px Baloo','700 40px Baloo','700 40px Kalam','400 40px Rozha'].map(f=>document.fonts.load(f))).then(()=>document.fonts.ready);
const cv=document.createElement('canvas').getContext('2d');
const tW=(txt,size,fam=BAL,wt=800)=>{ cv.font=`${wt} ${size}px ${fam}`; return cv.measureText(txt).width; };
const op=k=>N(sat(k)*100)/100;
/* hand-drawn feel: subtle line boil (10 fps) applied to the drawn world, plus paper grain */
function finish(svg,t,{boil=2.6,paper=.28,grade=null,vig=.9}={}){ const sd=1+Math.floor(t*10)%5; UID=0;
  let g=boil>0?`<filter id="boil${sd}" x="-2%" y="-2%" width="104%" height="104%" filterUnits="objectBoundingBox"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="2" seed="${sd*13}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${boil}" xChannelSelector="R" yChannelSelector="G"/></filter><g filter="url(#boil${sd})">${svg}</g>`:svg;
  if(grade) g+=`<rect width="1080" height="1920" fill="${grade[0]}" opacity="${grade[1]}" style="mix-blend-mode:${grade[2]||'multiply'}"/>`;
  if(paper>0) g+=`<rect width="1080" height="1920" fill="url(#paper)" opacity="${paper}" style="mix-blend-mode:multiply"/>`;
  if(vig>0) g+=`<rect width="1080" height="1920" fill="url(#gVig2)" opacity="${vig}"/>`;
  return g; }
const cam=(c,svg)=>`<g transform="translate(540 960) scale(${N(c.z*1000)/1000}) translate(${N(-c.x)} ${N(-c.y)})">${svg}</g>`;
/* damped spring: 0 -> settles, used for wobble after an impact */
const wob=(u,t0,amp=1,f=18,d=6)=>u<t0?0:amp*Math.exp(-(u-t0)*d)*Math.sin((u-t0)*f);
const shakeV=(u,t0,amp=18,dur=.4)=>{ const k=(u-t0)/dur; if(k<0||k>1) return [0,0]; const a=amp*(1-k)*(1-k); return [Math.sin(u*91)*a,Math.cos(u*73)*a*.7]; };
const addV=(...v)=>v.reduce((a,b)=>[a[0]+b[0],a[1]+b[1]],[0,0]);
const jolt=(v,svg)=>`<g transform="translate(${N(v[0])} ${N(v[1])})">${svg}</g>`;
/* type: chunky Baloo with ink outline and a hard offset shadow */
function ttl(txt,x,y,size,fill='#fffaf0',{rot=0,k=1,stroke=INK,sw=.16,shadow=true,anchor='middle',wt=800,fam=BAL,ls=1}={}){ if(k<=0) return '';
  const sc=k<1?lerp(.5,1,E.back(sat(k))):1, at=`text-anchor="${anchor}" font-family="${fam}" font-weight="${wt}" font-size="${size}" letter-spacing="${ls}" stroke-linejoin="round"`;
  return `<g transform="translate(${N(x)} ${N(y)}) rotate(${N(rot+(1-sat(k))*-6)}) scale(${N(sc*100)/100})" opacity="${op(k*2)}">${shadow?`<text ${at} x="5" y="${N(size*.09)}" fill="${INK}" stroke="${INK}" stroke-width="${N(size*sw*1.1)}">${txt}</text>`:''}<text ${at} x="0" y="0" fill="${fill}" stroke="${stroke}" stroke-width="${N(size*sw)}" paint-order="stroke fill">${txt}</text></g>`; }
function tag(txt,x,y,size,bg,fg='#fffaf0',{rot=-2,k=1,fam=BAL,wt=800}={}){ if(k<=0) return ''; const w=tW(txt,size,fam,wt)+size*.9, h=size*1.45, sc=k<1?lerp(.4,1,E.back(sat(k))):1;
  return `<g transform="translate(${N(x)} ${N(y)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*2)}"><rect x="${N(-w/2+6)}" y="${N(-h/2+8)}" width="${N(w)}" height="${N(h)}" rx="${N(size*.3)}" fill="${INK}"/><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="${N(size*.3)}" fill="${bg}" stroke="${INK}" stroke-width="6"/><text y="${N(size*.34)}" text-anchor="middle" font-family="${fam}" font-weight="${wt}" font-size="${size}" fill="${fg}">${txt}</text></g>`; }
/* rubber stamp impression */
function stampMark(x,y,lines,col,k,rot=-12,size=70){ if(k<=0) return ''; const sc=lerp(1.8,1,E.o(sat(k))), w=Math.max(...lines.map(l=>tW(l,size)))+60, h=lines.length*size*1.05+34;
  let g=`<rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="10" fill="none" stroke="${col}" stroke-width="9"/><rect x="${N(-w/2+10)}" y="${N(-h/2+10)}" width="${N(w-20)}" height="${N(h-20)}" rx="6" fill="none" stroke="${col}" stroke-width="3"/>`;
  lines.forEach((l,i)=>g+=`<text y="${N(-h/2+34+size*.78+i*size*1.02-8)}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${size}" fill="${col}" letter-spacing="2">${l}</text>`);
  return `<g transform="translate(${N(x)} ${N(y)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)*.92}" filter="url(#inky)">${g}</g>`; }
/* ============================== subtitles (episode style): Baloo, word pop, numbers shown as figures */
const MERGE=[[['nineteen','seventysix'],'1976'],[['nineteen','ninetyfour'],'1994'],[['three','hundred','rupees'],'₹300'],[['sixteen','hundred'],'1,600'],[['eighteen'],'18']];
const SUBW=SHOTS.map(s=>s.lines.map(l=>{ const out=[]; const w=l.words; for(let i=0;i<w.length;i++){ let hit=null;
  for(const [seq,rep] of MERGE){ if(seq.every((x,j)=>w[i+j]&&normW(w[i+j].w)===x)){ hit=[seq.length,rep]; break; } }
  if(hit){ const last=w[i+hit[0]-1].w, punc=(last.match(/[,.…?!]+$/)||[''])[0]; out.push({w:hit[1]+punc,t:w[i].t,hl:true}); i+=hit[0]-1; } else out.push({w:w[i].w,t:w[i].t,hl:w[i].hl}); } return out; }));
const MYSUBS=[]; SHOTS.forEach((s,si)=>s.lines.forEach((l,li)=>{ const ws=SUBW[si][li]; const ch=[]; let c=[];
  ws.forEach(w=>{ c.push(w); const len=c.map(x=>x.w).join(' ').length; if(/[,.?!…]$/.test(w.w)||len>15){ ch.push(c); c=[]; } }); if(c.length) ch.push(c);
  const nl=s.lines[li+1], end=Math.min(l.v0+l.vd+.4, nl?nl.v0-.04:SE(s.n)-.03);
  ch.forEach((c,ci)=>MYSUBS.push({shot:s.n,t0:c[0].t-.06,t1:ch[ci+1]?ch[ci+1][0].t-.06:end,words:c})); }));
function mySubs(t){ const c=MYSUBS.find(c=>t>=c.t0&&t<c.t1); if(!c) return ''; const sy=SHOT_META[c.shot-1].subY, pos=typeof sy==='function'?sy(t-S(c.shot)):(sy||1440);
  let size=88; const words=c.words.map(w=>({s:w.w.toUpperCase().replace(/[“”]/g,'"'),hl:w.hl,t:w.t}));
  const sp=size*.28; let tot=words.reduce((a,w)=>a+tW(w.s,size)+sp,-sp); if(tot>900){ size*=900/tot; tot=900; }
  let x=540-tot/2, g='';
  for(const w of words){ const ww=tW(w.s,size), k=sat((t-Math.max(c.t0,w.t-.07))/.15), cx=x+ww/2;
    if(k>0){ const sc=k<1?lerp(.6,1,E.back(k)):1;
      g+=`<g transform="translate(${N(cx)} ${pos}) scale(${N(sc*100)/100}) rotate(${N((1-k)*-4)})" opacity="${op(k*2)}"><text x="4" y="7" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(size)}" fill="${INK}" stroke="${INK}" stroke-width="${N(size*.2)}" stroke-linejoin="round">${esc(w.s)}</text><text class="cap" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(size)}" fill="${w.hl?MARI:'#fffaf0'}" stroke="${INK}" stroke-width="${N(size*.16)}" stroke-linejoin="round" paint-order="stroke fill">${esc(w.s)}</text></g>`; }
    x+=ww+sp; }
  return g; }
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
  if(c.bald) g+=`<path d="M-44 4Q-48 -14 -38 -24Q-34 -6 -30 8Z" fill="${hc}" stroke="${INK}" stroke-width="3.5"/><path d="M-12 -40Q-2 -46 6 -40" fill="none" stroke="${shade(c.skin,.8)}" stroke-width="3"/>`;
  else if(c.young) g+=`<path d="M-44 6Q-52 -40 -10 -48Q30 -52 44 -22Q30 -30 18 -26Q24 -36 10 -36Q2 -26 -16 -30Q-28 -22 -34 6Z" fill="${hc}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
  else g+=`<path d="M-44 6Q-50 -38 -8 -47Q30 -52 44 -20Q24 -32 2 -30Q-22 -28 -30 -10Q-34 0 -34 8Z" fill="${hc}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if(c.grey>0&&!c.bald) g+=`<path d="M-38 -12Q-32 -30 -14 -36" fill="none" stroke="#e8e3da" stroke-width="4" opacity="${N(Math.min(1,c.grey*1.4)*100)/100}" stroke-linecap="round"/>`;
  g+=`<g transform="translate(-14 6)"><ellipse rx="10" ry="13" fill="${c.skin}" stroke="${INK}" stroke-width="4.5"/><path d="M-2 -6Q4 0 -2 6" fill="none" stroke="${INK}" stroke-width="3"/></g>`;   // ear
  g+=face(c,p,t,seed);
  g+=`<path d="M41 2Q56 10 44 20" fill="${c.skin}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>`;   // nose
  if(c.mus==='thick') g+=`<path d="M18 22Q30 12 50 20Q54 30 44 28Q34 24 22 30Q14 30 18 22Z" fill="${c.grey>.6?'#cfc9bf':c.hair}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(c.mus==='thin') g+=`<path d="M20 22Q32 16 48 22" fill="none" stroke="${c.hair}" stroke-width="6" stroke-linecap="round"/>`;
  if(c.mus==='curl') g+=`<path d="M10 24Q-4 18 0 6Q6 16 18 20Q32 12 50 20Q64 12 66 0Q72 18 54 28Q38 26 28 28Q18 30 10 24Z" fill="${c.grey>.6?'#cfc9bf':c.hair}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(c.glasses||p.glasses) g+=`<g fill="#ffffff" fill-opacity=".14" stroke="${INK}" stroke-width="4"><rect x="2" y="-18" width="24" height="22" rx="7"/><rect x="28" y="-18" width="16" height="22" rx="6"/><path d="M26 -9H28M2 -10L-12 -6" fill="none"/></g>`;
  if(c.bindi) g+=`<circle cx="24" cy="-24" r="3.6" fill="#c8372d"/>`;
  if(c.pen) g+=`<path d="M-24 -18L-2 -30" stroke="#2c5e8a" stroke-width="6" stroke-linecap="round"/>`;
  if(c.cap==='topi') g+=`<path d="M-40 -22Q-38 -48 0 -50Q30 -50 40 -26Q2 -16 -40 -22Z" fill="#fbf8ef" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-30 -38Q0 -44 30 -34" fill="none" stroke="#d8d0bc" stroke-width="3"/>`;
  if(c.cap==='police') g+=`<path d="M-40 -24Q-40 -58 4 -60Q40 -58 44 -28Z" fill="#c2a46a" stroke="${INK}" stroke-width="4.5"/><path d="M-42 -26H46" stroke="#7a2a2a" stroke-width="8"/><path d="M14 -26Q44 -26 60 -16Q34 -14 14 -20Z" fill="#2a1a10" stroke="${INK}" stroke-width="3.5"/><circle cx="18" cy="-40" r="6" fill="#e8c34a" stroke="${INK}" stroke-width="2.5"/>`;
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
    if(!c.sari&&!c.khaki){ const m=[lerp(A.j[0],A.e[0],.55),lerp(A.j[1],A.e[1],.55)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+hose(A.a,A.j,m,21,col); }
    if(c.khaki){ const m=[lerp(A.a[0],A.j[0],.8),lerp(A.a[1],A.j[1],.8)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+`<path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${INK}" stroke-width="31" stroke-linecap="round"/><path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${col}" stroke-width="21" stroke-linecap="round"/>`; }
    return sl+mitt(A.e,d,kind||'open',sk,back); };
  const leg=(L,back)=>{ const col=back?shade(c.pants||'#eee',.84):(c.pants||'#eee'), f=L.e;
    let s2=c.sari?'':hose(L.a,L.j,L.e,c.dhoti?28:20,col);
    s2+=`<path d="M${N(f[0]-14)} ${N(f[1]-12)}Q${N(f[0]+8)} ${N(f[1]-20)} ${N(f[0]+30)} ${N(f[1]-6)}Q${N(f[0]+34)} ${N(f[1]+2)} ${N(f[0]+24)} ${N(f[1]+3)}L${N(f[0]-14)} ${N(f[1]+3)}Q${N(f[0]-20)} ${N(f[1]-4)} ${N(f[0]-14)} ${N(f[1]-12)}Z" fill="${back?shade(c.skin,.86):c.skin}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M${N(f[0]-16)} ${N(f[1]+3)}H${N(f[0]+30)}" stroke="${c.shoe}" stroke-width="7" stroke-linecap="round"/>`;
    return s2; };
  if(!p.behind) g+=arm(aB,true,p.handB);
  g+=leg(lB,true)+leg(lF,false);
  // torso
  const P=(f,n)=>{ const q=at(f,n); return N(q[0])+' '+N(q[1]); };
  if(c.sari){ const hem=-hipY-6;
    g+=`<path d="M${P(108,-18)}Q${P(112,0)} ${P(108,18)}Q${P(88,34)} ${P(60,30)}L${P(-hem*.2,40)}Q${P(-hem*.6,48)} ${P(-hem,58)}L${P(-hem,-54)}Q${P(-hem*.6,-44)} ${P(-hem*.2,-34)}L${P(60,-30)}Q${P(88,-30)} ${P(108,-18)}Z" fill="${c.sari}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(-hem+12,-52)}L${P(-hem+12,56)}" stroke="${c.border}" stroke-width="12"/><path d="M${P(104,-20)}Q${P(70,0)} ${P(20,36)}L${P(-hem*.9,52)}" fill="none" stroke="${c.border}" stroke-width="10"/>`;
    g+=`<path d="M${P(100,-14)}Q${P(90,-2)} ${P(64,12)}L${P(54,-24)}Q${P(80,-30)} ${P(100,-14)}Z" fill="${c.blouse}" stroke="${INK}" stroke-width="4"/>`;
  } else {
    const w0=26+belly*6, w1=34+belly*26, wh=38+belly*16, hemF=c.khaki?-6:-58;
    g+=`<path d="M${P(110,-w0+8)}Q${P(116,0)} ${P(110,w0-6)}Q${P(102,w0+6)} ${P(92,w0+4)}Q${P(52,w1+4)} ${P(10,w1)}L${P(hemF,wh)}Q${P(hemF-4,0)} ${P(hemF,-wh+2)}L${P(20,-w1+6)}Q${P(70,-w0-8)} ${P(110,-w0+8)}Z" fill="${c.top}" stroke="${INK}" stroke-width="5.5" stroke-linejoin="round"/>`;
    g+=`<path d="M${P(96,-w0)}Q${P(60,-w0-6)} ${P(20,-w1+8)}L${P(hemF+4,-wh+4)}L${P(hemF+4,-wh+20)}L${P(24,-w1+22)}Q${P(66,-w0+10)} ${P(98,-w0+12)}Z" fill="${c.topDk}"/>`;
    if(c.vest) g+=`<path d="M${P(104,-w0+6)}L${P(104,w0-8)}Q${P(70,w1)} ${P(18,w1-2)}L${P(18,-w1+8)}Q${P(70,-w0)} ${P(104,-w0+6)}Z" fill="${c.vest}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M${P(106,8)}L${P(70,18)}L${P(104,22)}" fill="${c.top}" stroke="${INK}" stroke-width="3"/>`;
    if(c.khaki){ g+=`<path d="M${P(-2,-wh)}L${P(-2,wh)}" stroke="${c.belt}" stroke-width="12"/><rect x="${N(at(-2,wh-14)[0]-7)}" y="${N(at(-2,wh-14)[1]-8)}" width="14" height="16" fill="#e8c34a" stroke="${INK}" stroke-width="2.5"/><path d="M${P(100,12)}L${P(40,14)}" stroke="${shade(c.top,.8)}" stroke-width="3"/>`; }
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
/* ============================== shots */
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];      // world point -> figure-local
const COVER_T=3.0;
const LAL1={x:250,y:1730,s:2.45}, CLK={x:830,y:1660,s:2.35};
const formSvg=(title='ऋण आवेदन',sub='LOAN PAPERS',col=CRIM)=>`${paper(300,380,0)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${col}">${title}</text><text y="-88" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="24" fill="${INK}">${sub}</text><text x="-120" y="-30" font-family="${BAL}" font-weight="700" font-size="22" fill="#6a5e48">NAME</text><text x="-120" y="4" font-family="Kalam, ${BAL}" font-weight="700" font-size="34" fill="#2a3a6a">Lal Bihari</text>${[0,1,2,3].map(i=>`<path d="M-120 ${44+i*30}h${230-i*30}" stroke="#9a8e78" stroke-width="5" stroke-linecap="round"/>`).join('')}`;
/* 1 HOOK: a man with a sign that says he is alive; the state stamps him DEAD */
function sh1(t){ const u=t-S(1), kd=cu(1,'dead');
  const hit=kd-.02, droop=seg(u,hit+.1,hit+.5,E.io);
  const c=keys(u,[[0,{x:540,y:1080,z:1.18}],[hit,{x:540,y:1060,z:1.25},E.io],[hit+.08,{x:540,y:1080,z:1.34},E.o],[3.7,{x:540,y:1080,z:1.36}]]);
  let g=villageSet(u,t)+hut(930,1180,.8)+neem(120,1260,.9,u);
  const sign=`<g transform="rotate(${N(-4+droop*24)})">${placard('मैं जीवित हूँ','I AM ALIVE',CRIM,360)}</g>`;
  g+=toon('lal',430,1730,2.45,1,{lean:-2,tilt:-6+droop*10,expr:u>hit?'confused':'hopeful',look:u>hit?[3,-5]:[5,-1],hF:[150,-210+droop*50],hB:[110,-170+droop*40],handF:'hold',handB:'hold',holdF:{svg:`<g transform="scale(.55) translate(0 -160)">${sign}</g>`,over:true}},t,1);
  g+=stampMark(540,1180,['मृत','DEAD'],CRIM,seg(u,hit,hit+.08),-14,150)+impact(540,1180,seg(u,hit,hit+.3),3.2);
  return finish(jolt(shakeV(u,hit,34,.4),cam(c,g)),t); }
/* 2 THE LAND OFFICE: loan papers, a clerk, a register */
function sh2(t){ const u=t-S(2), kl=cu(2,'loan');
  const c=keys(u,[[0,{x:560,y:1010,z:1.04}],[4.9,{x:590,y:1000,z:1.18},E.io]]);
  const place=seg(u,1.0,1.7,E.io), pull=seg(u,1.9,2.4,E.io);
  const formW=[lerp(lerp(330,600,place),720,pull), lerp(lerp(1060,1150,place),1150,pull)];
  const handW=[lerp(330,600,place)-(u>1.9?60*seg(u,1.9,2.3):0), lerp(1060,1150,place)];
  const lalP=u<.9?{...TP.namaste,tilt:-6+Math.sin(u*5)*2,look:[5,-1]}:{...TP.hopeful,hF:W2L(LAL1.x,LAL1.y,LAL1.s,1,handW),handF:'flat',hB:[30,-150],lean:6*place,tilt:-4,look:[5,0]};
  const flip1=seg(u,2.5,2.9), flip2=seg(u,2.95,3.35), slide=seg(u,3.4,4.0,E.io), lookUp=seg(u,kl-.1,kl+.4,E.o);
  const fingerW=[lerp(900,880,slide),lerp(1090,1112,slide)];
  const clkP={lean:-6+lookUp*-4,tilt:10-lookUp*18,expr:lookUp>.5?'stern':'bored',look:lookUp>.5?[5,-4]:[4,5],lidAdd:lookUp>.5?-.2:0,
    hF:u<1.9?W2L(CLK.x,CLK.y,CLK.s,-1,[880,1120]):u<2.4?W2L(CLK.x,CLK.y,CLK.s,-1,[lerp(700,720,pull),1150]):W2L(CLK.x,CLK.y,CLK.s,-1,u>3.4?fingerW:[900,1100]),
    handF:u>3.4?'point':'flat', hB:W2L(CLK.x,CLK.y,CLK.s,-1,[960,1130]),handB:'flat'};
  const ctr=counter();
  let g=bankSet(u,t)+fan(560,40,t,6,1.1)+ctr.back+toon('clerk',CLK.x,CLK.y,CLK.s,-1,clkP,t,4)+grille();
  g+=ledger(880,1170,.95,{entry:'लाल बिहारी — मृत',page:flip1>0&&flip1<1?flip1:flip2,hl:seg(u,3.9,4.1)});
  g+=`<g transform="translate(${N(formW[0])} ${N(formW[1])}) rotate(${N(-8+pull*10)}) scale(.31)">${formSvg()}</g>`;
  g+=ctr.front+toon('lal',LAL1.x,LAL1.y,LAL1.s,1,lalP,t,1)+bankBeam(u);
  return finish(cam(c,g),t); }
/* 3 THE RECORDS: the register says he died in 1976 */
function sh3(t){ const u=t-S(3), kd=cu(3,'died'), kr=cu(3,'records');
  if(u<kd-.05){ const c=keys(u,[[0,{x:540,y:1000,z:1.0}],[kd,{x:560,y:1010,z:1.16},E.io]]);
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#6a2a26"/>`;
    g+=`<g transform="translate(540 1000) rotate(-3)"><rect x="-520" y="-640" width="1040" height="1260" rx="20" ${st('#7a2e2a',8)}/><rect x="-490" y="-610" width="480" height="1200" ${st('#fbf3df',5)}/><rect x="10" y="-610" width="480" height="1200" ${st('#f7eed8',5)}/>`;
    for(let i=0;i<15;i++){ g+=`<path d="M-460 ${-540+i*76}H-40M40 ${-540+i*76}H460" stroke="#c9bb98" stroke-width="3"/>`; if(i!==9&&i!==10) g+=`<path d="M-440 ${-556+i*76}l${150+((i*61)%160)} 0M60 ${-556+i*76}l${120+((i*83)%180)} 0" stroke="#5a6a8a" stroke-width="7" stroke-linecap="round" opacity=".8"/>`; }
    g+=`<rect x="44" y="${-540+8*76}" width="420" height="72" fill="${MARI}" opacity="${N(seg(u,kr,kr+.3)*55)/100}"/><text x="64" y="${-540+9*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="52" fill="#2a3a6a">लाल बिहारी</text><text x="340" y="${-540+9*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="56" fill="${CRIM}">मृत</text><text x="64" y="${-540+10*76-22}" font-family="Kalam, ${BAL}" font-weight="700" font-size="40" fill="#2a3a6a">30 · 7 · 1976</text>`;
    const ring=seg(u,kd-.7,kd-.25); if(ring>0) g+=`<ellipse cx="392" cy="${-540+9*76-38}" rx="96" ry="58" fill="none" stroke="${CRIM}" stroke-width="10" stroke-dasharray="${N(ring*480)} 600" transform="rotate(-6 392 ${-540+9*76-38})"/>`;
    g+=`<text x="392" y="${-540+9*76+102}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${CRIM}" opacity="${op(seg(u,kd-.45,kd-.25))}">(DEAD)</text></g>`;
    const tap=Math.abs(Math.sin(Math.max(0,u-kr)*10))*seg(u,kr,kr+.1)*(1-seg(u,kr+.6,kr+.7));
    g+=bigArm([1500,1500],[lerp(1000,820,seg(u,0,.6,E.io)),lerp(1400,1130,seg(u,0,.6,E.io))-tap*40],TC.clerk.skin,TC.clerk.top,'point','',.8);
    return finish(cam(c,g),t,{vig:1.1}); }
  const k=u-kd, c=keys(k,[[0,{x:250,y:1110,z:2.6}],[.18,{x:250,y:1110,z:2.15},E.o],[3,{x:250,y:1120,z:2.2}]]);
  const pulse=seg(k,.6,.85,E.io);
  const p={...TP.shock,lean:-10,tilt:-10-wob(u,kd,8,16,5),hF:pulse>0?mix([70,-250],[34,-176],pulse):[70,-250],hB:pulse>0?mix([40,-240],[40,-172],pulse):[40,-240],handF:pulse>.5?'point':'open',handB:'open',expr:k>1?'confused':'shock',mouth:1,look:pulse>.5?[2,6]:[4,-1]};
  let g=`<rect x="-400" y="-400" width="1880" height="2800" fill="url(#gRed)"/>`+speedLines(250,1050,0,500,28,seg(k,0,.35))+speedLines(250,1050,180,500,28,seg(k,0,.35));
  g+=toon('lal',LAL1.x,LAL1.y,LAL1.s,1,p,t,1)+sweat(380,860,seg(k,.9,1.1),u,1.4)+qmark(430,820,seg(k,1.0,1.2),.8);
  return finish(cam(c,g),t,{vig:1.2}); }
/* 4 FLASHBACK: three notes of a hundred; a word in a register; a sign on a field */
const UNC={x:250,y:1600,s:2.3}, LEK={x:800,y:1600,s:2.2};
function sh4(t){ const u=t-S(4), kn=[cu(4,'three'),cu(4,'hundred'),cu(4,'rupees')], kd=cu(4,'make'), kl=cu(4,'and');
  const sepia=['#c48a4a',.42,'multiply'];
  if(u<kl-.1){ const c=keys(u,[[0,{x:540,y:1080,z:1.12}],[kl,{x:540,y:1060,z:1.25},E.io]]);
    let g=villageSet(u,t)+hut(900,1180,.9)+neem(170,1240,1.1,u)+charpai(250,1640,1.25);
    const given=kn.map(k0=>seg(u,k0-.05,k0+.32,E.io));
    const unP={hy:56,fF:[86,0],fB:[60,0],lean:6,expr:u>kd?'smug':'sneaky',look:[5,0],hF:[110,-180],handF:'hold',hB:[70,-150],handB:'hold'};
    const lekP={lean:-4,expr:given[2]>=1?'smug':'neutral',look:[-4,2],hF:u>kd?[60,-150]:[90,-170],handF:u>kd?'hold':'open',hB:[40,-160],handB:'hold',
      holdB:{svg:`<g transform="rotate(-20)"><rect x="-10" y="-90" width="120" height="90" rx="4" ${st('#7a2e2a',4)}/><rect x="-2" y="-82" width="104" height="74" fill="#fbf3df"/>${u>kd?`<text x="50" y="-34" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="${N(34*seg(u,kd,kd+.4))}" fill="${CRIM}">मृत</text>`:''}</g>`}};
    if(u>kd) lekP.holdF={svg:`<path d="M0 0L-34 -40" stroke="#2c5e8a" stroke-width="8" stroke-linecap="round"/>`,rot:Math.sin(u*30)*10};
    g+=toon('uncle',UNC.x,UNC.y,UNC.s,1,unP,t,2)+toon('lekh',LEK.x,LEK.y,LEK.s,-1,lekP,t,6);
    const from=[UNC.x+110*UNC.s,UNC.y-180*UNC.s], to=[LEK.x-90*LEK.s,LEK.y-170*LEK.s];
    given.forEach((k,i)=>{ if(u<kn[i]-.05) return; const x=lerp(from[0],to[0]-i*8,k), y=lerp(from[1],to[1]-i*10,k)-Math.sin(k*Math.PI)*140; g+=note(x,y,lerp(-20,10,k)+i*6,1.35); });
    g+=given.map((k,i)=>u>kn[i]-.05?ttl(`₹${(i+1)*100}`,560,640,96,MARI,{k:seg(u,kn[i]-.05,kn[i]+.15)*(i<2?1-seg(u,kn[i+1]-.1,kn[i+1]-.05):1),rot:-4}):'').join('');
    return finish(cam(c,g),t,{grade:sepia,paper:.4}); }
  const k=u-kl, flip=seg(k,.25,.55,E.io), c=keys(k,[[0,{x:560,y:1180,z:1.3}],[1.3,{x:560,y:1160,z:1.42},E.io]]);
  let g=villageSet(u,t)+hut(150,1180,.7)+plough(980,1560,1.1);
  const sx=lerp(1,-1,flip);
  g+=`<g transform="translate(760 1560)"><path d="M0 0V-330" stroke="${INK}" stroke-width="22"/><path d="M0 0V-330" stroke="#7a4a24" stroke-width="12"/><g transform="translate(0 -330) scale(${N(sx*100)/100} 1) rotate(${N(wob(k,.55,6,20,6))})"><rect x="-170" y="-90" width="340" height="150" rx="8" ${st(flip<.5?'#f7ebd4':'#f3c84a',6)}/><text y="-36" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="38" fill="${INK}" transform="scale(${sx<0?-1:1} 1)">ज़मीन · LAND</text><text y="30" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="52" fill="${flip<.5?TEAL:CRIM}" transform="scale(${sx<0?-1:1} 1)">${flip<.5?'LAL BIHARI':'HIS UNCLE'}</text></g></g>`;
  g+=toon('uncle',440,1600,2.3,1,{lean:-4,expr:'smug',look:[5,-2],hF:[70,-130],hB:[-60,-130],handF:'fist',handB:'fist',tilt:-6},t,2);
  return finish(cam(c,g),t,{grade:sepia,paper:.4}); }
/* 5 AGAIN AND AGAIN: the waiting years; two offices, one answer; the file */
function sh5(t){ const u=t-S(5), ke=cu(5,'every'), kf=cu(5,'file');
  if(u<ke-.12){ const k=seg(u,0,ke-.12), yr=1977+Math.floor(k*5.99);
    const c=keys(u,[[0,{x:540,y:1060,z:1.1}],[ke,{x:540,y:1040,z:1.2},E.io]]);
    let g=officeSet(u,t)+calendar(760,560,String(yr),1.6,(u*4)%1,-3)+bench(420,1700,1.3);
    g+=fileStack(830,1700,Math.floor(3+k*12),1.3,3)+fileStack(110,1700,Math.floor(2+k*8),1.2,8,2);
    g+=toon('lal',360,1700,2.3,1,{...TP.sit,expr:'tired',look:[4,-3],tilt:4,cos:{grey:k*.15}},t,1)+web(170,760,k,1.6);
    return finish(cam(c,g),t); }
  if(u<kf-.08){ const panel=(i,k0,who,rot,yy,yr)=>{ const k=seg(u,k0-.08,k0+.1,E.back); if(k<=0) return '';
      const inner=officeSet(u,t)+desk(560,1500,700)+toon(who,720,1500,2.2,-1,{lean:-10,tilt:6,expr:'stern',look:[-5,3],hF:[110,-140],handF:'point',hB:[40,-140],handB:'hold'},t,i+3)+fileCard(400,1330,.95,-6,{});
      return `<g transform="translate(540 ${yy}) rotate(${rot}) scale(${N(lerp(.6,1,k)*100)/100})"><clipPath id="pc${i}"><rect x="-500" y="-250" width="1000" height="500" rx="18"/></clipPath><g clip-path="url(#pc${i})"><g transform="scale(.62) translate(-560 -1150)">${inner}</g></g><rect x="-500" y="-250" width="1000" height="500" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>${tag(yr,-380,-180,40,MARI,INK,{rot:-4})}</g>`; };
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a1e16"/>`+panel(0,ke,'clerk',-2,500,'1979')+panel(1,cu(5,'office'),'lekh',1.5,1060,'1984');
    return finish(g,t,{boil:2}); }
  const k=u-kf, c=keys(k,[[0,{x:540,y:960,z:1.0}],[1,{x:540,y:980,z:1.08},E.io]]);
  const hit=kf+.08, hy=u<hit?lerp(600,1000,seg(u,kf-.08,hit,E.i)):lerp(1000,640,seg(u,hit+.12,hit+.45,E.o));
  let g=deskTop()+fileCard(540,1000,2.1,-3,{})+stampMark(540,1180,['मृत','DEAD'],CRIM,seg(u,hit,hit+.08),-10,90);
  g+=bigArm([1500,-200],[600,hy],TC.clerk2.skin,TC.clerk2.top,'hold',`<g transform="translate(0 -8)">${stampProp()}</g>`,.9);
  return finish(jolt(shakeV(u,hit,26,.3),cam(c,g)),t); }
/* 6 THE NAME: he paints it on his own wall */
function sh6(t){ const u=t-S(6), km=cu(6,'mritak'), kdm=cu(6,'the'), kl=cu(6,'lal');
  const wr=seg(u,kl-.35,km+.25,E.lin);
  const c=keys(u,[[0,{x:560,y:1000,z:1.18}],[km+.3,{x:600,y:980,z:1.25},E.io],[4.3,{x:600,y:990,z:1.3}]]);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#d9a066"/>`;
  for(let i=0;i<10;i++) g+=`<ellipse cx="${N(rnd(i)*1080)}" cy="${N(300+rnd(i+4)*1200)}" rx="${N(60+rnd(i+2)*80)}" ry="${N(20+rnd(i+6)*20)}" fill="#c98a52" opacity=".6"/>`;
  g+=`<rect x="-300" y="1560" width="1680" height="800" fill="#a8743a"/><path d="M-300 1560H1380" stroke="${INK}" stroke-width="6"/>`;
  g+=`<rect x="820" y="760" width="260" height="800" ${st('#5a3a22',7)}/><circle cx="1030" cy="1180" r="12" fill="#d8b45a" stroke="${INK}" stroke-width="3"/>`;
  const tx=560, ty=720;
  g+=`<clipPath id="wrc"><rect x="${N(tx-380)}" y="${ty-170}" width="${N(760*wr)}" height="330"/></clipPath><g clip-path="url(#wrc)"><text x="${tx}" y="${ty-30}" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="120" fill="${NAVY}">लाल बिहारी</text><text x="${tx}" y="${ty+110}" text-anchor="middle" font-family="Kalam, ${BAL}" font-weight="700" font-size="140" fill="${CRIM}">'मृतक'</text></g>`;
  const turned=u>km+.35;
  const brushW=[tx-380+760*wr, wr<.55?ty-60:ty+80];
  const brush=`<g transform="rotate(-30)"><rect x="-6" y="-70" width="12" height="70" ${st('#8a5a2a',3.5)}/><path d="M-10 -70L10 -70L6 -100L-6 -100Z" ${st('#3a2a1e',3)}/></g>`;
  const p=turned?{...TP.proud,hF:[110,-170],handF:'hold',holdF:{svg:`<g transform="rotate(60)">${brush}</g>`},expr:u>kdm?'proud':'happy',look:[-3,-1]}:{lean:4,tilt:-10,expr:'determined',look:[4,-4],hF:W2L(330,1700,2.3,1,brushW),handF:'hold',holdF:{svg:brush},hB:[20,-120]};
  g+=toon('lal',330,1700,2.3,1,{...p,cos:{grey:.18}},t,1);
  const tr=seg(u,km,km+.2)*(1-seg(u,kdm-.15,kdm));
  g+=`<text x="${tx}" y="${ty+190}" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="46" fill="${INK}" opacity="${op(tr)}">LAL BIHARI 'MRITAK'</text>`;
  return finish(cam(c,g),t); }
/* 7 ARREST ME: the young cousin, the cinema, every day */
function sh7(t){ const u=t-S(7), km=cu(7,'and'), kw=cu(7,'it'), kid=cu(7,'kidnapped');
  if(u<kid-.25){ const c=keys(u,[[0,{x:540,y:1080,z:1.08}],[1.4,{x:560,y:1070,z:1.14},E.io]]);
    let g=copSet(u,t)+toon('cop',820,1680,2.35,-1,{lean:-4,expr:'bored',look:[-2,4],hF:[54,-262],hB:[44,-256],handF:'hold',handB:'hold',holdF:{svg:`<g transform="scale(.62)"><rect x="-90" y="-120" width="180" height="140" rx="4" ${st('#f4ecd8',5)}/><path d="M-70 -90h140M-70 -60h120M-70 -30h130" stroke="#9a8e78" stroke-width="7"/></g>`}},t,7);
    g+=toon('lal',250,1700,2.35,1,{lean:10,tilt:-6,expr:'hopeful',look:[5,-2],hF:[110,-180],hB:[104,-172],handF:'fist',handB:'fist',cos:{grey:.22}},t,1);
    g+=tag('ARREST ME!',330,820,54,CRIM,'#fff',{k:seg(u,.5,.7),rot:-5});
    return finish(cam(c,g),t); }
  if(u<km-.08){ const w=strut(u,60,640,kid-.25,km,2.2,120,.4), w2=strut(u,-90,490,kid-.25,km,1.55,90,.5);
    const c={x:420,y:1100,z:1.02};
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="url(#gNight)"/><circle cx="820" cy="320" r="90" fill="#fff6d8"/>`;
    for(let i=0;i<30;i++) g+=`<circle cx="${N(rnd(i)*1080)}" cy="${N(rnd(i+3)*800)}" r="${N(2+rnd(i+5)*3)}" fill="#fff" opacity="${N((.4+.5*Math.abs(Math.sin(u*2+i)))*100)/100}"/>`;
    g+=`<path d="M-300 1500Q540 1460 1380 1500V2300H-300Z" fill="#1e2a2a"/>`+hut(900,1500,.9).replace(/#c98a5a/g,'#4a4a6a').replace(/#a8743a/g,'#3a3a5a');
    const lx=w.x, cxk=w2.x;
    g+=toon('cousin',cxk,1700,1.55,1,{...w2.p,expr:'confused',look:[5,-4],hF:W2L(cxk,1700,1.55,1,[lx-60,1430]),handF:'hold',cos:{headS:1.35,young:true}},t,9);
    g+=toon('lal',lx,1700,2.2,1,{...w.p,lean:10,expr:'sneaky',look:[-5,1],hB:W2L(lx,1700,2.2,1,[lx-60,1430]),handB:'hold',tilt:-2,cos:{grey:.22}},t,1);
    g+=tag('HIS YOUNG COUSIN',540,560,50,TEAL,'#fff',{k:seg(u,cu(7,'cousin')-.2,cu(7,'cousin')),rot:3});
    return finish(cam(c,g),t,{grade:['#3a3a8a',.15,'multiply']}); }
  const k=u-km, days=Math.min(3,1+Math.floor(k/.45)), sad=u>kw;
  const c=keys(k,[[0,{x:540,y:1180,z:1.06}],[2.9,{x:540,y:1200,z:1.14},E.io]]);
  const fl=.8+.2*Math.sin(t*23)*Math.sin(t*7.3);
  let g=cinemaSet(u,t);
  g+=toon('cousin',660,1700,1.6,1,{hy:52,fF:[86,0],fB:[66,0],hF:[60,-170],hB:[50,-150],handF:'hold',handB:'hold',expr:'happy',look:[2,-5],holdF:{svg:`<path d="M-26 -10L26 -10L0 70Z" ${st('#f3e6c0',4)}/>${[0,1,2].map(i=>`<circle cx="${-14+i*14}" cy="-16" r="9" fill="#d8a85a" stroke="${INK}" stroke-width="2.5"/>`).join('')}`},noShadow:true,cos:{headS:1.35,young:true}},t,9);
  g+=toon('lal',330,1640,2.25,1,{hy:52,fF:[86,0],fB:[66,0],hF:[70,-112],hB:[56,-110],expr:sad?'sad':'sneaky',look:sad?[2,4]:[-6,0],tilt:sad?14:-4,lean:sad?8:0,noShadow:true,cos:{grey:.24}},t,1);
  g+=`<rect x="-300" y="-300" width="1680" height="2600" fill="#9fb8ff" opacity="${N((fl-.8)*.4*100)/100}" style="mix-blend-mode:screen"/>`+seatRow(1880,1.35);
  if(!sad) g+=tag(`DAY ${days}`,820,980,60,MARI,INK,{k:seg(k,(days-1)*.45,(days-1)*.45+.12),rot:4});
  return finish(cam(c,g),t); }
/* 8 THE BRIBE THAT CAME BACK */
function sh8(t){ const u=t-S(8), kb=cu(8,'bribed'), kc=cu(8,'charge'), kg=cu(8,'gave'), kk=cu(8,'back');
  const nx=keys(u,[[0,{v:450}],[kb,{v:450}],[kb+.45,{v:640},E.io],[kg-.05,{v:640}],[kg+.25,{v:470},E.o],[kk+.15,{v:470}],[kk+.35,{v:640},E.io],[kk+.5,{v:640}],[kk+.65,{v:470},E.o]]).v;
  const copPush=(u>kg-.1&&u<kg+.35)||(u>kk+.45&&u<kk+.75);
  const c=keys(u,[[0,{x:540,y:1140,z:1.05}],[kg,{x:540,y:1150,z:1.14},E.io],[4.3,{x:540,y:1150,z:1.16}]]);
  let g=copSet(u,t)+desk(560,1500,760,'#7a4a2a');
  g+=toon('cop',800,1660,2.3,-1,{lean:copPush?-14:-4,expr:u>kg-.1?'stern':u>kb+.4?'confused':'neutral',look:u>kb+.2&&u<kg?[-2,6]:[-5,-1],hF:copPush?W2L(800,1660,2.3,-1,[nx+50,1462]):[40,-160],handF:copPush?'flat':'fist',hB:[60,-150],handB:'fist'},t,7);
  g+=note(nx,1472,-4,1.7,'500');
  const lalPush=u>kb&&u<kb+.5||(u>kk+.1&&u<kk+.4);
  const lp=u>kc-.1&&u<kg-.1?{...TP.pointSelf,expr:'hopeful',hB:[100,-180],handB:'fist'}:{lean:lalPush?14:2,expr:u>kg+.2?'sad':'hopeful',look:[5,1],hF:lalPush?W2L(300,1700,2.35,1,[nx-60,1470]):[40,-130],handF:'flat',hB:[-10,-112]};
  g+=toon('lal',300,1700,2.35,1,{...lp,cos:{grey:.28}},t,1);
  return finish(cam(c,g),t); }
/* 9 WIDOW'S PENSION (he is standing right behind her) */
function sh9(t){ const u=t-S(9), kd=cu(9,'denied'), kp=cu(9,'pension');
  const c=keys(u,[[0,{x:560,y:1100,z:1.02}],[kd,{x:570,y:1100,z:1.1},E.io],[3.5,{x:570,y:1110,z:1.14}]]);
  const down=seg(u,kd-.12,kd,E.i), hit=kd;
  let g=officeSet(u,t)+desk(720,1500,560);
  g+=toon('clerk2',880,1660,2.2,-1,{lean:-8+down*-8,expr:u>hit?'stern':'bored',look:[-4,u>kp?-3:3],hF:W2L(880,1660,2.2,-1,[640,lerp(1300,1440,down)]),handF:'hold',holdF:{svg:`<g transform="rotate(90) translate(0 -20)">${stampProp()}</g>`},hB:[40,-150],handB:'flat'},t,5);
  g+=`<g transform="translate(640 1478) scale(.42) skewX(-10)">${formSvg('विधवा पेंशन','WIDOW PENSION','#2c5e8a')}</g>`+stampMark(640,1470,['REJECTED'],CRIM,seg(u,hit,hit+.08),-10,34)+impact(640,1460,seg(u,hit,hit+.3),1.2);
  g+=toon('wife',470,1700,2.2,1,{lean:6,expr:u>hit?'sad':'neutral',look:[5,1],hF:[90,-150],handF:'flat',hB:[30,-140]},t,3);
  const wv=Math.sin(u*14)*30;
  g+=toon('lal',230,1720,2.25,1,{lean:-4,tilt:-8,expr:u>hit+.1?'confused':'happy',look:[5,-2],hF:u>hit+.1?[90,-200]:[60+wv*.3,-330+wv],hB:u>hit+.1?[-70,-196]:[-20-wv*.3,-320-wv],handF:'open',handB:'open',cos:{grey:.32}},t,1);
  if(u<hit) g+=tag("I'M RIGHT HERE!",360,780,44,TEAL,'#fff',{k:seg(u,.4,.6),rot:-5});
  return finish(cam(c,g),t); }
/* 10 PARLIAMENT */
function sh10(t){ const u=t-S(10), ka=cu(10,'about'), kv=cu(10,'votes');
  if(u<ka-.12){ const c=keys(u,[[0,{x:500,y:1060,z:1.08}],[ka,{x:600,y:1040,z:1.15},E.io]]);
    let g=villageSet(u,t)+hut(1040,1180,.7)+rickshaw(760,1640,.95,u*.2);
    const shout=Math.abs(Math.sin(u*6));
    g+=toon('lal',330,1700,2.3,1,{lean:-6,tilt:-10,expr:'joy',hF:[78,-276],handF:'hold',holdF:{svg:horn(-10,0,.8,-28)},hB:[-60,-320],handB:'fist',garland:true,cos:{grey:.38}},t,1);
    g+=`<g transform="translate(530 1000)">${[0,1,2].map(i=>`<path d="M${40+i*40} ${-20-i*10}q30 ${30+i*10} 0 ${60+i*20}" fill="none" stroke="#fffaf0" stroke-width="10" stroke-linecap="round" opacity="${op(shout-i*.2)}"/>`).join('')}</g>`;
    g+=toon('v1',1080,1780,1.9,-1,{expr:'confused',look:[-4,-2],hF:[30,-200],handF:'open',tilt:8},t,11);
    g+=petals(30,u,0,3);
    return finish(cam(c,g),t); }
  const k=u-ka, roll=seg(u,ka,kv+.05,E.o), val=Math.round(roll*1600);
  const c=keys(k,[[0,{x:540,y:980,z:1.08}],[1.9,{x:540,y:990,z:1.14},E.io]]);
  let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a3a2e"/>`;
  g+=`<g transform="translate(540 760)"><rect x="-460" y="-330" width="920" height="660" rx="16" ${st('#1e3a2a',10)}/><rect x="-460" y="-330" width="920" height="660" rx="16" fill="none" stroke="#8a5a2a" stroke-width="22"/><text y="-230" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="54" fill="${MARI}">RESULT · ALLAHABAD 1988</text><path d="M-400 -190H400" stroke="#fffaf0" stroke-width="4" opacity=".6"/><text x="-400" y="-80" font-family="${BAL}" font-weight="800" font-size="56" fill="#fffaf0">LAL BIHARI 'MRITAK'</text><text x="400" y="120" text-anchor="end" font-family="${BAL}" font-weight="800" font-size="170" fill="#fffaf0">~${val.toLocaleString('en-US')}</text><text x="400" y="220" text-anchor="end" font-family="${BAL}" font-weight="700" font-size="44" fill="#cfd8cf">VOTES</text></g>`;
  g+=toon('lal',220,1820,2.4,1,{...TP.shrug,expr:u>kv?'proud':'confused',cos:{grey:.38}},t,1);
  return finish(cam(c,g),t); }
/* 11 1994: the calendar races, one signature, and he holds it up */
function sh11(t){ const u=t-S(11), ko=cu(11,'one'), kh=cu(11,'he'), ka=cu(11,'alive'), kn=cu(11,'ninety');
  if(u<ko-.12){ const yr=1985+Math.floor(seg(u,0,kn+.05,E.i)*9.99);
    const c=keys(u,[[0,{x:540,y:960,z:1.0}],[ko,{x:540,y:950,z:1.1},E.io]]);
    let g=`<rect x="-300" y="-300" width="1680" height="2600" fill="#2a1e16"/>`+calendar(540,900,String(yr),3.4,(u*7)%1*(u<kn?1:0),-3);
    g+=ttl('18 YEARS LATER',540,430,80,MARI,{k:seg(u,kn,kn+.2),rot:-3});
    return finish(cam(c,g),t); }
  if(u<kh-.1){ const k=u-ko, sig=seg(k,.1,1.1,E.lin), c=keys(k,[[0,{x:540,y:1000,z:1.0}],[1.4,{x:540,y:1010,z:1.08},E.io]]);
    let g=deskTop()+`<g transform="translate(540 1060) rotate(-2) scale(2.3)">${paper(300,380,5)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${NAVY}">आदेश · ORDER</text><text y="-88" text-anchor="middle" font-family="${BAL}" font-weight="700" font-size="20" fill="${INK}">AZAMGARH · 1994</text><path d="M-100 140${[...Array(8)].map((_,i)=>`q12 ${i%2?24:-24} 24 0`).join('')}" fill="none" stroke="#1d3a8a" stroke-width="5" stroke-dasharray="${N(sig*420)} 600" stroke-linecap="round"/></g>`;
    const px=lerp(310,870,sig), py=1400+Math.sin(sig*40)*26;
    g+=bigArm([1500,1700],[px,py-60],TC.lekh.skin,'#efe7d2','hold',`<g transform="rotate(-150)"><rect x="-8" y="-10" width="16" height="110" rx="6" ${st('#1d3a8a',4)}/></g>`,.85);
    return finish(cam(c,g),t); }
  const k=u-(kh-.1), raise=seg(k,0,.35,E.back), jump=k>.9?Math.max(0,Math.sin(Math.min(1,(k-.9)/.6)*Math.PI))*200:0, land=k>1.5?wob(k,1.5,.16,22,8):0;
  const c=keys(k,[[0,{x:540,y:1000,z:1.22}],[2.4,{x:540,y:1020,z:1.12},E.io]]);
  const order=`<g transform="translate(30 -80) rotate(6) scale(.5)">${paper(300,380,4)}<text y="-128" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="40" fill="${NAVY}">आदेश · ORDER</text>${stampMark(0,40,['जीवित','ALIVE'],'#1f8a3a',seg(u,ka-.05,ka+.05),-8,64)}</g>`;
  let g=burst(540,900,u,'#ffd25a','#f6a23a',18)+toon('lal',440,1760-jump,2.45,1,{lean:-4,tilt:-10,expr:u>ka?'joy':'awe',hF:mix([70,-150],[140,-320],raise),hB:mix([40,-140],[-40,-320],raise),handF:'hold',handB:'fist',holdF:{svg:order,over:true},sq:-land,fF:jump>0?[30,-30]:[20,0],fB:jump>0?[-30,-40]:[-16,0],cos:{grey:.45}},t,1);
  g+=petals(60,u,ka,7);
  return finish(cam(c,g),t,{vig:.7}); }
/* 12 THE LAND: he lets his uncle keep it */
function sh12(t){ const u=t-S(12), kl=cu(12,'land');
  const give=seg(u,.2,1.2,E.io);
  const c=keys(u,[[0,{x:560,y:1160,z:1.12}],[2.8,{x:560,y:1150,z:1.22},E.io]]);
  let g=villageSet(u,t)+hut(140,1180,.7)+plough(1000,1600,1.0);
  const deedX=lerp(540,650,give);
  g+=toon('uncle',790,1700,2.3,-1,{lean:give>.8?-6:0,expr:u>kl?'awe':'sad',look:[-5,u>kl?1:3],hF:give>.85?W2L(790,1700,2.3,-1,[deedX+40,1260]):[60,-120],handF:give>.85?'hold':'open',hB:[30,-130],cos:{grey:.55}},t,2);
  g+=`<g transform="translate(${N(deedX)} 1250) rotate(${N(-6+give*10)}) scale(.5)">${formSvg('ज़मीन','LAND','#2f7a3a')}</g>`;
  const ns=u>kl+.1;
  g+=toon('lal',330,1720,2.35,1,{lean:give<1?6:0,expr:'hopeful',look:[5,-1],hF:ns?[58,-196]:give<.9?W2L(330,1720,2.35,1,[deedX-40,1270]):[50,-120],handF:'flat',hB:ns?[52,-192]:[-10,-112],handB:'flat',cos:{grey:.48}},t,1);
  return finish(cam(c,g),t,{grade:['#f6b25a',.12,'multiply']}); }
/* 13 THE ASSOCIATION OF DEAD PEOPLE */
function sh13(t){ const u=t-S(13);
  const c=keys(u,[[0,{x:540,y:1060,z:1.22}],[5.9,{x:540,y:1000,z:1.02},E.io]]);
  let g=villageSet(u,t)+neem(1000,1260,.9,u);
  const crowd=[['v2',540,1580,1.7],['v3',730,1590,1.65],['v4',910,1600,1.65],['v1',560,1740,1.9],['wife',760,1760,1.9],['cousin',950,1770,1.9]];
  const signs=[['मैं जीवित हूँ','I AM ALIVE',CRIM],['मृतक संघ','DEAD PEOPLE',NAVY],['ज़िंदा हूँ','STILL ALIVE',TEAL]];
  const sp=[[430,1000],[690,940],[930,1010]];
  crowd.forEach(([w,x,y,s],i)=>{ const bob=Math.abs(Math.sin(u*5+i))*10; g+=toon(w,x,y-bob,s,1,{expr:i%2?'determined':'happy',look:[5,-2],hF:[40,-150],handF:'fist',hB:[-20,-120]},t,20+i); });
  signs.forEach((sg,i)=>{ g+=`<g transform="translate(${sp[i][0]} ${N(sp[i][1]-Math.abs(Math.sin(u*5+i))*10)}) rotate(${N(Math.sin(u*4+i)*4)}) scale(.82)">${placard(...sg,300)}</g>`; });
  const w=strut(u,260,300,0,5.4,2.4,60);
  g+=toon('lal',300,1820,2.45,1,{lean:-4,expr:'joy',hF:[46,-150],handF:'fist',hB:[-36,-336],handB:'fist',fF:w.p.fF,fB:w.p.fB,cos:{grey:.5}},t,1);
  g+=`<g transform="translate(540 560)"><path d="M-520 -90Q0 -40 520 -90V60Q0 110 -520 60Z" ${st(MARI,7)}/><text y="0" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="62" fill="${CRIM}">मृतक संघ</text><text y="50" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="34" fill="${INK}">ASSOCIATION OF DEAD PEOPLE · 1980</text></g>`;
  g+=petals(28,u,0,11);
  return finish(cam(c,g),t,{grade:['#f6b25a',.1,'multiply']}); }
const SEQ=[1,2,3,4,5,6,7,8,9,10,11,12,13].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8,sh9,sh10,sh11,sh12,sh13][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ let g='';
  if(t<S(2)){ const u=t; let h=`<rect width="1080" height="640" fill="url(#gTopShade)"/>`;
    h+=ttl('LEGALLY DEAD',540,330,118,MARI,{k:seg(u,0,.18),rot:-2})+ttl('FOR 18 YEARS.',540,440,84,'#fffaf0',{k:seg(u,.12,.3),rot:-2});
    h+=tag('(HE WAS FINE)',790,550,40,TEAL,'#fff',{k:seg(u,1.0,1.2),rot:4});
    g+=h; }
  if(t>=S(4)&&t<SE(4)) g+=tag('FLASHBACK',540,250,42,'#5a3a1a','#ffe9b0',{k:seg(t-S(4),.05,.25),rot:-2});
  if(t>=S(6)&&t<SE(6)){ const u=t-S(6); g+=tag("मृतक = 'THE DEAD'",560,915,52,CRIM,'#fff',{k:seg(u,cu(6,'the')-.05,cu(6,'the')+.15),rot:3}); }
  if(t>=S(13)){ const u=t-S(13); g+=`<g opacity="${op(seg(u,4.95,5.15))}"><rect y="1230" width="1080" height="330" fill="${INK}" opacity=".72"/></g>`+ttl("LAL BIHARI 'MRITAK'",540,1350,84,MARI,{k:seg(u,5.0,5.2),rot:-2})+ttl('DEAD ON PAPER · 1976–1994',540,1450,52,'#fffaf0',{k:seg(u,5.15,5.35),rot:-2}); }
  return g+mySubs(t); }
