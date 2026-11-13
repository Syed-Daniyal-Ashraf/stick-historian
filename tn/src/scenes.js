/* ============================== toon kit: base (palette, finish, camera, type, stamps, subtitles) - shared by every toon episode */
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
/* camera: world point (c.x,c.y) lands at screen (540, oy). oy defaults to c.oy, then to the frame centre (960). */
const cam=(c,svg,oy)=>`<g transform="translate(540 ${N(oy!=null?oy:(c.oy!=null?c.oy:960))}) scale(${N(c.z*1000)/1000}) translate(${N(-c.x)} ${N(-c.y)})">${svg}</g>`;
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
/* MERGE: spoken number words shown as figures. Each episode sets MERGE_EP in its src/meta.js. */
const MERGE=typeof MERGE_EP!=='undefined'?MERGE_EP:[];
const SUBW=SHOTS.map(s=>s.lines.map(l=>{ const out=[]; const w=l.words; for(let i=0;i<w.length;i++){ let hit=null;
  for(const [seq,rep] of MERGE){ if(seq.every((x,j)=>w[i+j]&&normW(w[i+j].w)===x)){ hit=[seq.length,rep]; break; } }
  if(hit){ const last=w[i+hit[0]-1].w, punc=(last.match(/[,.…?!]+$/)||[''])[0]; out.push({w:hit[1]+punc,t:w[i].t,hl:true}); i+=hit[0]-1; } else out.push({w:w[i].w,t:w[i].t,hl:w[i].hl}); } return out; }));
const MYSUBS=[]; SHOTS.forEach((s,si)=>s.lines.forEach((l,li)=>{ const ws=SUBW[si][li]; const ch=[]; let c=[];
  ws.forEach(w=>{ c.push(w); const len=c.map(x=>x.w).join(' ').length; if(/[,.?!…]$/.test(w.w)||len>15){ ch.push(c); c=[]; } }); if(c.length) ch.push(c);
  const nl=s.lines[li+1], end=Math.min(l.v0+l.vd+.4, nl?nl.v0-.04:SE(s.n)-.03);
  ch.forEach((c,ci)=>MYSUBS.push({shot:s.n,t0:c[0].t-.06,t1:ch[ci+1]?ch[ci+1][0].t-.06:end,words:c})); }));
const MYSUB_MAXW=typeof SUB_MAXW_EP!=='undefined'?SUB_MAXW_EP:900;   // widest subtitle line (px); episodes may narrow it in src/meta.js
function mySubs(t){ if(CAP_MODE==='big') return bigSubs(t); const c=MYSUBS.find(c=>t>=c.t0&&t<c.t1); if(!c) return ''; const sy=SHOT_META[c.shot-1].subY, pos=typeof sy==='function'?sy(t-S(c.shot)):(sy||1440);
  let size=88; const words=c.words.map(w=>({s:w.w.toUpperCase().replace(/[“”]/g,'"'),hl:w.hl,t:w.t}));
  const sp=size*.28; let tot=words.reduce((a,w)=>a+tW(w.s,size)+sp,-sp); if(tot>MYSUB_MAXW){ size*=MYSUB_MAXW/tot; tot=MYSUB_MAXW; }
  let x=540-tot/2, g='';
  for(const w of words){ const ww=tW(w.s,size), k=sat((t-Math.max(c.t0,w.t-.07))/.15), cx=x+ww/2;
    if(k>0){ const sc=k<1?lerp(.6,1,E.back(k)):1;
      g+=`<g transform="translate(${N(cx)} ${pos}) scale(${N(sc*100)/100}) rotate(${N((1-k)*-4)})" opacity="${op(k*2)}"><text x="4" y="7" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(size)}" fill="${INK}" stroke="${INK}" stroke-width="${N(size*.2)}" stroke-linejoin="round">${esc(w.s)}</text><text class="cap" text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(size)}" fill="${w.hl?MARI:'#fffaf0'}" stroke="${INK}" stroke-width="${N(size*.16)}" stroke-linejoin="round" paint-order="stroke fill">${esc(w.s)}</text></g>`; }
    x+=ww+sp; }
  return g; }
/* ============================== big chunk captions (B1, opt-in: CAP_MODE_EP='big' in src/meta.js)
   One or two words at a time, 150 px, centred at x 540, baseline SHOT_META[n].capY (default 1166: the text box,
   which runs ~79 px below the baseline at 150 px, then ends at ~1245, inside verify's y 1250 limit; the letters themselves sit in ~y 1050-1175). Same SUBW words as mySubs,
   so MERGE_EP numbers and *highlights* still work. Rules, in order:
   1. A highlighted word stands alone (short words in front of it may join it: "THE RAILROADS").
   2. Otherwise words pair up; a chunk ends at punctuation.
   3. A short word (CAP_SHORT) doesn't stand alone: it takes the next word, so a chunk is 3 words only when its first two are short ("WITH A CLOCK").
   4. Length limits so chunks stay big: a pair <= 12 characters, a chunk led by short words <= 14. If short words can't take the next word
      within that, they stand as their own chunk ("FROM THE" | "PHILIPPINES,").
   5. A chunk under 0.25 s merges forward (if the previous chunk ends a phrase) or backward, when the result still follows 3 and 4;
      otherwise it stays and verify.js warns. */
const CAP_MODE=typeof CAP_MODE_EP!=='undefined'?CAP_MODE_EP:'line';
const CAP_SHORT=new Set(['a','an','the','of','to','in','on','at','and','but','so','by','for','it','is','was','from','with','as','or','if','he','she','we','they','his','her','its']);
const BIGCAP={size:150,min:104,maxw:900,y:1166,minDur:.25,pairChars:12,maxChars:14};
const capEnds=w=>/[,.?!…:;]$/.test(w.w), capShort=w=>CAP_SHORT.has(normW(w.w))&&!capEnds(w);
const capOk=c=>c.length<=2||(c.length===3&&capShort(c[0])&&capShort(c[1]));
const capChars=c=>c.map(w=>w.w).join(' ').length, capFits=c=>capOk(c)&&(c.length<2||capChars(c)<=(c.length===2&&!capShort(c[0])?BIGCAP.pairChars:BIGCAP.maxChars));
function capSplit(ws){ const out=[]; let i=0;
  while(i<ws.length){ const c=[ws[i++]];
    while(capShort(c[c.length-1])&&c.every(capShort)&&i<ws.length&&c.length<3&&capFits([...c,ws[i]])) c.push(ws[i++]);    // leading short words take the next word (if it fits)
    const last=c[c.length-1];
    if(c.length<2&&!capEnds(last)&&!last.hl&&i<ws.length&&!ws[i].hl&&(!capShort(ws[i])||i+1>=ws.length)
       &&capFits([last,ws[i]])) c.push(ws[i++]);   // pair only if it fits big (character count, so it doesn't depend on font loading)
    out.push(c); }
  return out; }
const BIGCAPS=[]; if(CAP_MODE==='big') SHOTS.forEach((s,si)=>s.lines.forEach((l,li)=>{ const ch=capSplit(SUBW[si][li]);
  const nl=s.lines[li+1], end=Math.min(l.v0+l.vd+.4, nl?nl.v0-.04:SE(s.n)-.03), rows=[];
  ch.forEach((c,ci)=>rows.push({shot:s.n,t0:c[0].t-.05,t1:ch[ci+1]?ch[ci+1][0].t-.05:end,words:c}));
  const fits=capFits;
  for(let k=0;k<rows.length;k++){ const r=rows[k]; if(r.t1-r.t0>=BIGCAP.minDur||rows.length<2) continue;   // merge chunks too short to read:
    const pv=rows[k-1], nx=rows[k+1], back=pv&&[...pv.words,...r.words], fwd=nx&&[...r.words,...nx.words];   // forward if the previous chunk
    const pvEnds=pv&&capEnds(pv.words[pv.words.length-1]);                                                 // ends a phrase, else backward
    if(nx&&(pvEnds||!pv||!fits(back))&&!capEnds(r.words[r.words.length-1])&&fits(fwd)){ nx.words=fwd; nx.t0=r.t0; rows.splice(k--,1); }
    else if(pv&&!pvEnds&&fits(back)){ pv.words=back; pv.t1=r.t1; rows.splice(k--,1); } }
  BIGCAPS.push(...rows); }));
/* fitted size of a chunk: shrink to BIGCAP.maxw, never below BIGCAP.min (fit:false means the words don't fit: change the script) */
function bigCapFit(c){ const words=c.words.map(w=>({s:w.w.toUpperCase().replace(/[“”]/g,'"'),hl:w.hl}));
  let size=BIGCAP.size; const sp=()=>size*.34, tot=()=>words.reduce((a,w)=>a+tW(w.s,size)+sp(),-sp());
  let w=tot(); if(w>BIGCAP.maxw){ size=Math.max(BIGCAP.min,size*BIGCAP.maxw/w); w=tot(); }
  return {words,size,w,fit:w<=BIGCAP.maxw+.5}; }
function bigSubs(t){ const c=BIGCAPS.find(c=>t>=c.t0&&t<c.t1); if(!c) return '';
  const m=SHOT_META[c.shot-1]||{}, y=m.capY!=null?(typeof m.capY==='function'?m.capY(t-S(c.shot)):m.capY):BIGCAP.y;
  const {words,size,w}=bigCapFit(c), k=sat((t-c.t0)/.12), sc=lerp(.7,1,E.o(k)), sp=size*.34;   // pop without overshoot: the box never exceeds its fitted width
  const at=`text-anchor="middle" font-family="${BAL}" font-weight="800" font-size="${N(size)}" stroke-linejoin="round"`; let x=-w/2, g='';
  for(const wd of words){ const ww=tW(wd.s,size), cx=x+ww/2;
    g+=`<text ${at} x="${N(cx+6)}" y="9" fill="${INK}" stroke="${INK}" stroke-width="${N(size*.2)}">${esc(wd.s)}</text><text class="cap" ${at} x="${N(cx)}" y="0" fill="${wd.hl?MARI:'#fffaf0'}" stroke="${INK}" stroke-width="${N(size*.16)}" paint-order="stroke fill">${esc(wd.s)}</text>`;
    x+=ww+sp; }
  return `<g transform="translate(540 ${N(y)}) scale(${N(sc*1000)/1000})">${g}</g>`; }
/* ============================== in-shot cuts (B2, opt-in: CUT_EP in src/shots.js)
   CUT_EP={3:['nineteen',['own',-.1],2.4]}: per narrated shot, cut points as a word prefix (cu), [word, offset] or seconds into the shot.
   part(n,u) -> {i, pu, p0, p1}: which sub-shot of shot n the time u falls in, time into it, and its bounds (seconds into the shot).
   The template collects SEQ starts + these points into film.CUTS, which verify.js checks for cadence. */
const CUT_PTS={};
function cutPts(n){ if(CUT_PTS[n]) return CUT_PTS[n]; const L=(typeof CUT_EP!=='undefined'&&CUT_EP[n])||[];
  return CUT_PTS[n]=L.map(c=>typeof c==='number'?c:Array.isArray(c)?cu(n,c[0])+c[1]:cu(n,c)).sort((a,b)=>a-b); }
function part(n,u){ const p=cutPts(n), len=SE(n)-S(n); let i=0; while(i<p.length&&u>=p[i]) i++;
  const p0=i?p[i-1]:0, p1=i<p.length?p[i]:len; return {i,pu:u-p0,p0,p1}; }
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
  if(c.cap==='pillbox') g+=`<path d="M-32 -38L-28 -70Q4 -78 36 -68L40 -36Q4 -26 -32 -38Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="4" cy="-71" rx="32" ry="8" fill="${shade(c.capC,1.25)}" stroke="${INK}" stroke-width="4"/><path d="M-31 -42Q4 -32 39 -40" fill="none" stroke="${c.band||'#e8c34a'}" stroke-width="8" stroke-linecap="round"/><circle cx="4" cy="-74" r="4.5" fill="${c.band||'#e8c34a'}" stroke="${INK}" stroke-width="2.5"/>`;
  if(c.cap==='flat') g+=`<path d="M-42 -22Q-44 -58 4 -60Q40 -58 46 -30Q66 -26 70 -18Q40 -14 -42 -22Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/><path d="M-30 -44Q6 -52 36 -38" fill="none" stroke="${shade(c.capC,.75)}" stroke-width="3"/>`;
  if(c.cap==='pagri') g+=`<path d="M-44 -14Q-50 -58 0 -62Q44 -60 46 -22Q20 -30 -10 -24Q-30 -20 -44 -14Z" fill="${c.capC}" stroke="${INK}" stroke-width="4.5"/><path d="M-36 -30Q0 -48 40 -32M-38 -44Q0 -58 34 -46" fill="none" stroke="${shade(c.capC,.75)}" stroke-width="4"/>`;
  if(p.headExtra) g+=p.headExtra;
  return g; }
/* the figure. p: lean,tilt,hx,hy,look,expr,hF,hB,handF,handB,fF,fB,sq,sit,holdF,holdB,shoulder */
/* LIFE: idle sway (head and spine drift a little while a pose is held). Episodes switch it on with LIFE_EP=1 in src/meta.js. */
const LIFE=typeof LIFE_EP!=='undefined'?LIFE_EP:0;
/* pose-to-pose: full() gives every animated field a value so two poses can be blended; tween() moves from pose A to pose B
   starting at t0 over d seconds, with a small move the opposite way first (anticipation) and an overshoot at the end. */
const full=p=>({lean:0,tilt:0,hy:0,hx:0,shrug:0,hF:[16,-110],hB:[-10,-112],fF:[20,0],fB:[-16,0],...p});
function tween(u,t0,A,B,d=.32,e=E.back){ const an=.12; if(u<=t0-an) return A; if(u>=t0+d) return B;
  if(u<t0) return mix(A,B,-.07*Math.sin(Math.PI*(u-(t0-an))/an));
  return mix(A,B,e(sat((u-t0)/d))); }
function toon(who,x,y,s,dir,p,t,seed=0){ const c={...TC[who],...(p.cos||{})}, uid=++UID;
  const lean=(p.lean||0)+Math.sin(t*.9+seed*2.1)*.8*LIFE, U=[Math.sin(rad(lean)),-Math.cos(rad(lean))], Nn=[-U[1],U[0]];
  const hipY=-122+(p.hy||0)+(p.breath===false?0:Math.sin(t*2.2+seed)*1.2), hip=[p.hx||0,hipY];
  const at=(f,n)=>[hip[0]+U[0]*f+Nn[0]*n, hip[1]+U[1]*f+Nn[1]*n];
  const neck=at(112,0), sh=at(100-(p.shrug||0),2);
  const ht=lean+(p.tilt||0)+Math.sin(t*1.3+seed)*1.6*LIFE, HU=[Math.sin(rad(ht)),-Math.cos(rad(ht))], hs=(c.headS||1.15)*(p.headK||1);
  const hc=[neck[0]+HU[0]*(48*hs), neck[1]+HU[1]*(48*hs)-(p.shrug||0)*.3];
  const hF=p.hF||[16,-110], hB=p.hB||[-10,-112];
  const aF=ik(sh,hF,58,56,1), aB=ik(sh,hB,58,56,1);
  const lF=ik(hip,p.fF||[20,0],66,62,-1), lB=ik(hip,p.fB||[-16,0],66,62,-1);
  /* reach check for verify.js: a hand or foot target beyond the limb's length stops short of it */
  { DBG.figs=(DBG.figs||0)+1; const er=Math.max(aF.err,aB.err,lF.err,lB.err); if(er>2){ if(er>DBG.maxGrip){ DBG.maxGrip=er; DBG.gripAt=DBG.now; DBG.who=who; } if(DBG.log&&DBG.log.length<5000) DBG.log.push([+(DBG.now||0).toFixed(2),who+(er===aF.err?':front arm':er===aB.err?':back arm':er===lF.err?':front leg':':back leg'),+er.toFixed(1)]); } }
  const sleeve=c.sari?c.blouse:(c.top);
  const belly=c.build||0;
  let g=p.noShadow?'':`<ellipse cx="${N(hip[0]*.5)}" cy="4" rx="${N(80+belly*20)}" ry="13" fill="#000" opacity=".22"/>`;
  const arm=(A,back,kind)=>{ const col=back?shade(sleeve,.82):sleeve, sk=c.skin; const d=ang(A.j,A.e);
    let sl=hose(A.a,A.j,A.e,c.sari?15:19,col);
    if(c.suit||c.dress){ sl=hose(A.a,A.j,A.e,c.dress?17:21,col); if(c.suit){ const q=[lerp(A.j[0],A.e[0],.9),lerp(A.j[1],A.e[1],.9)]; sl+=`<circle cx="${N(q[0])}" cy="${N(q[1])}" r="9" fill="${c.shirt}" stroke="${INK}" stroke-width="3"/>`; } }
    else if(!c.sari&&!c.khaki){ const m=[lerp(A.j[0],A.e[0],.55),lerp(A.j[1],A.e[1],.55)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+hose(A.a,A.j,m,21,col); }
    if(c.khaki){ const m=[lerp(A.a[0],A.j[0],.8),lerp(A.a[1],A.j[1],.8)]; sl=hose(A.a,A.j,A.e,15,shade(sk,back?.86:1))+`<path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${INK}" stroke-width="31" stroke-linecap="round"/><path d="M${N(A.a[0])} ${N(A.a[1])}L${N(m[0])} ${N(m[1])}" stroke="${col}" stroke-width="21" stroke-linecap="round"/>`; }
    return sl+mitt(A.e,d,kind||'open',sk,back); };
  const shod=c.suit||c.dress||c.shoes;   // closed shoes (suits, dresses); otherwise sandals over bare feet
  const leg=(L,back)=>{ const col=back?shade(c.pants||'#eee',.84):(c.pants||'#eee'), f=L.e;
    let s2=(c.sari||c.dress)?'':hose(L.a,L.j,L.e,c.dhoti?28:20,col);
    s2+=`<path d="M${N(f[0]-14)} ${N(f[1]-12)}Q${N(f[0]+8)} ${N(f[1]-20)} ${N(f[0]+30)} ${N(f[1]-6)}Q${N(f[0]+34)} ${N(f[1]+2)} ${N(f[0]+24)} ${N(f[1]+3)}L${N(f[0]-14)} ${N(f[1]+3)}Q${N(f[0]-20)} ${N(f[1]-4)} ${N(f[0]-14)} ${N(f[1]-12)}Z" fill="${shod?(back?shade(c.shoe,.8):c.shoe):(back?shade(c.skin,.86):c.skin)}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>${shod?`<path d="M${N(f[0]+4)} ${N(f[1]-13)}Q${N(f[0]+16)} ${N(f[1]-13)} ${N(f[0]+24)} ${N(f[1]-7)}" fill="none" stroke="${shade(c.shoe,2.4)}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`:`<path d="M${N(f[0]-16)} ${N(f[1]+3)}H${N(f[0]+30)}" stroke="${c.shoe}" stroke-width="7" stroke-linecap="round"/>`}`;
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
const WISC=[[12,20],[28,14],[44,16],[52,10],[66,18],[78,22],[88,26],[86,34],[96,36],[84,44],[82,58],[86,72],[84,90],[24,92],[14,84],[10,70],[18,60],[8,50],[10,36]];
const NAMER=[[6,16],[18,8],[34,10],[48,6],[64,12],[78,10],[92,18],[88,30],[96,40],[84,48],[90,60],[80,70],[72,84],[60,78],[50,92],[40,80],[30,66],[18,52],[10,38]];
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
/* ============================== shots: The Day America Got Noon Twice (tn/)
   LAYOUT (screen px 1080x1920): picture in y 290-1040, ground line at y GY, big captions sit below (letters y 1050-1175, baseline 1166).
   Every narrated shot is split by CUT_EP (end of file) into sub-shots: part(n,u) gives {i, pu}. A cut changes set, subject or framing.
   Poses never snap: every change goes through tween() or a continuous mix(). */
const COVER_T=1.0;
const W2L=(x,y,s,dir,w)=>[(w[0]-x)/(s*dir),(w[1]-y)/s];
const GY=1005;
const under=col=>`<rect x="-900" y="-900" width="2900" height="4600" fill="${col}"/>`;
function panelBox(x,y,w,h,inner,c,{rot=0,k=1,border=INK,id='pb'}={}){ if(k<=0) return ''; const sc=lerp(.7,1,E.back(sat(k)));
  return `<g transform="translate(${N(x+w/2)} ${N(y+h/2)}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${op(k*3)}"><clipPath id="${id}"><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${N(-w/2)} ${N(-h/2)})">${inner}</g></g><rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="none" stroke="${border}" stroke-width="9"/></g>`; }
const watchSvg=(open=1)=>({svg:`<g><path d="M0 -4Q-10 -26 -4 -44" fill="none" stroke="${INK}" stroke-width="3"/><circle r="15" ${st('#e8d28a',3.5)}/><circle r="10" fill="#fbf6ea"/><path d="M0 0V-6M0 0L5 3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>`});
/* shared poses */
const PS={stand:full({}),
  look:full({hF:[46,-178],hB:[-12,-114],handF:'hold',expr:'confused',look:[4,-2],tilt:6,lean:2}),
  ear:full({hF:[16,-228],hB:[-12,-114],handF:'hold',expr:'confused',look:[2,0],tilt:-8,lean:-2}),
  shrug:full({hF:[88,-196],hB:[-70,-192],handF:'open',handB:'open',expr:'confused',shrug:10,tilt:5}),
  gawk:full({hF:[40,-120],hB:[-8,-116],expr:'shock',look:[3,-6],tilt:-8,lean:-3}),
  reset:full({hF:[40,-172],hB:[26,-178],handF:'hold',handB:'open',expr:'determined',look:[3,3],tilt:5,lean:3})};
const bellSwing=(u,k,A=26)=>u<k?0:A*Math.exp(-(u-k)*1.6)*Math.sin((u-k)*10);

/* ---------- 1 HOOK: a church rings noon, then rings noon again ---------- */
function church(u,t,o){ // wide street. o: zoom-ish layout options
  const mins=o.mins||0, wk=o.workman;
  let g=`<rect x="-300" y="-300" width="1680" height="1400" fill="url(#gSky)"/>`+skyline(GY-6,3,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:160,h1:300,clocks:false});
  g+=steeple(540,300,GY-6,{cy:650,r:105,mins,swing:o.swing,dong:o.dong,glow:o.glow||0});
  g+=street(GY,'#8b8678');
  return g; }
function sh1_a(u,t){ // first frame: the premise, readable without sound
  let g=church(u,t,{mins:0,swing:bellSwing(u+.2,0,22)+Math.sin(u*9)*6*Math.exp(-u*.8),dong:seg(u,0,.5,E.lin)<1?seg(u,0,.5,E.lin):1});
  g+=ladder(318,GY,410,610,50);
  const crank=Math.sin(u*7)*.5+.5, WP=full({lean:-4,tilt:-4,hF:[84+crank*10,-250-crank*14],hB:[20,-190],handF:'fist',handB:'hold',expr:'determined',look:[6,-4],fF:[26,0],fB:[-12,0]});
  g+=toon('workman',398,700,.5,1,WP,t,5);
  const s0=.8, yy=GY;
  [['coatA',250,'look'],['coatB',840,'ear'],['coatC',710,'shrug']].forEach(([w,x,pk],i)=>{ const tw=tween(u,.6+i*.35,PS.stand,PS[pk],.4); g+=toon(w,x,yy,s0,i===1?-1:1,{...tw,holdF:pk==='look'||pk==='ear'?watchSvg():undefined},t,10+i); });
  // curved arrow: the minute hand is being cranked BACKWARDS
  g+=`<g opacity="${N((.55+.4*Math.sin(u*6))*100)/100}"><path d="M600 548Q650 560 662 614" fill="none" stroke="${CRIM}" stroke-width="12" stroke-linecap="round"/><path d="M640 618L664 650L688 614Z" fill="${CRIM}" stroke="${INK}" stroke-width="4" transform="rotate(-8 664 640)"/></g>`;
  g+=tag('NOON?',540,330+0,64,'#fff3c4',INK,{k:seg(u,.15,.45,E.back),rot:-3});
  return g; }
function sh1_b(pu,u,t){ // tight on the bell: the first noon
  const k=cu(1,'noon')-p1b0(); let g=`<rect width="1080" height="1920" fill="#c9b38a"/><rect x="-100" y="260" width="1280" height="900" fill="#3a2e28"/>`;
  g+=`<path d="M170 1010V520Q170 300 540 300Q910 300 910 520V1010Z" ${st('#2c221c',8)}/>`+beam([[300,300],[780,300],[1000,1100],[80,1100]],.12);
  g+=bellProp(540,360,3.2,bellSwing(pu,Math.max(0,k),30),seg(pu,Math.max(0,k),Math.max(0,k)+.4,E.lin));
  g+=ttl('DONG',540,930,170,'#fff3c4',{k:seg(pu,Math.max(0,k),Math.max(0,k)+.12,E.back),rot:-5});
  g+=`<rect y="1000" width="1080" height="1000" fill="#5a4636"/><path d="M0 1000H1080" stroke="${INK}" stroke-width="7"/>`;
  return g; }
const p1b0=()=>cutPts(1)[0];
function sh1_c(pu,u,t){ // the clock face: four minutes back
  const k0=.18, back=seg(pu,k0,k0+.75,E.back), mins=lerp(4,0,back), cx=540, cy=640, r=320;
  let g=`<rect width="1080" height="1920" fill="#b99a74"/><rect x="60" y="270" width="960" height="800" rx="40" ${st('#f4f0e6',8)}/>`;
  g+=clockFace(cx,cy,r,mins,{rim:'#2a2a32',sw:9});
  const ma=(mins%60)*6, tip=[cx+Math.sin(rad(ma))*r*.74, cy-Math.cos(rad(ma))*r*.74];
  g+=bigArm([-100,1300],[tip[0]+30,tip[1]+40],'#d9a37a','#6a7f9a','fist','',.9);
  g+=ttl('+4 MIN',860,380,70,'#ffe9a8',{k:seg(pu,0,.15,E.back)*(1-seg(pu,k0+.5,k0+.9)),rot:5});
  g+=`<g opacity="${N((back>0&&back<1?1:0)*100)/100}"><path d="M300 1010Q540 1100 780 1010" fill="none" stroke="${CRIM}" stroke-width="14" stroke-linecap="round"/></g>`;
  g+=`<rect y="1070" width="1080" height="1000" fill="#7a6246"/><path d="M0 1070H1080" stroke="${INK}" stroke-width="7"/>`;
  return g; }
function sh1_d(pu,u,t){ // wide again, low and close: the second noon
  const k=cu(1,'again')-cutPts(1)[2]; let g=church(u,t,{mins:0,swing:bellSwing(pu,Math.max(0,k),28),dong:seg(pu,k,k+.45,E.lin)});
  g=`<g transform="translate(540 1005) scale(1.12) translate(-540 -1005)">${g}</g>`;
  [['coatA',130,'look','ear'],['coatB',900,'shrug','shrug'],['coatC',280,'ear','look']].forEach(([w,x,a,b],i)=>{ const tw=tween(pu,.9+i*.2,PS[a],PS[b],.35); g+=toon(w,x,GY+4,1.1,i===1?-1:1,{...tw,holdF:(a==='look'||a==='ear')?watchSvg():undefined},t,20+i); });
  g+=tag('NOON. AGAIN.',540,330,60,'#fff3c4',INK,{k:seg(pu,k,k+.2,E.back),rot:2});
  return g; }
function sh1(t){ const u=t-S(1), P=part(1,u); let g=P.i===0?sh1_a(u,t):P.i===1?sh1_b(P.pu,u,t):P.i===2?sh1_c(P.pu,u,t):sh1_d(P.pu,u,t);
  return finish(g,t,{boil:2.2}); }

/* the master clock's pendulum: PEND(t) is its angle in degrees; the bob is stopped from 'stopped' to 'restarted' (shot 3) and resumes from the same phase */
const PT=1.154, PA_DEG=15;
function pendEff(t){ const a=S(3)+cu(3,'stopped'), b=S(3)+cu(3,'restarted'); return t-Math.min(Math.max(t-a,0),b-a); }
const PEND=t=>PA_DEG*Math.sin(2*Math.PI*pendEff(t)/PT);
const bobPos=(px,py,L,ang)=>[px+Math.sin(rad(ang))*L, py+Math.cos(rad(ang))*L];

/* ---------- 2 RAILROADS + THE MAN WITH A CLOCK ---------- */
function sh2_a(pu,u,t){ const k=seg(pu,0,1.47,E.i), s=lerp(.35,1.55,k);
  let g=`<rect width="1080" height="1920" fill="#d8b48a"/><rect y="560" width="1080" height="1400" fill="#7a6a5a"/><path d="M-100 560H1200" stroke="${INK}" stroke-width="7"/>`;
  g+=`<path d="M0 560H1080L1080 0H0Z" fill="url(#gDusk)"/>`;
  for(let i=-5;i<=5;i++) g+=`<path d="M${540+i*14} 600L${540+i*330} 1920" stroke="#4a3e34" stroke-width="${N(5+Math.abs(i))}" opacity=".6"/>`;
  for(let j=0;j<9;j++){ const y=640+Math.pow(j/8,2.2)*1300; g+=`<path d="M${N(540-(y-560)*.8)} ${N(y)}H${N(540+(y-560)*.8)}" stroke="#4a3e34" stroke-width="${N(5+j*2)}" opacity=".5"/>`; }
  for(let i=0;i<14;i++){ const a=rad(i*25.7), r0=480+rnd(i)*80; g+=`<path d="M${N(540+Math.cos(a)*r0*1.1)} ${N(700+Math.sin(a)*r0*.8)}L${N(540+Math.cos(a)*(r0+260*k))} ${N(700+Math.sin(a)*(r0+260*k)*.8)}" stroke="#fffaf0" stroke-width="9" stroke-linecap="round" opacity="${N(k*.8*100)/100}"/>`; }
  g+=[0,1,2,3].map(i=>steamPuff(380+i*95,330-(i%2)*30,50,((pu*1.4+i*.27)%1))).join('');
  g+=locomotive(540,700,s,u,{mins:0});
  g+=tag('RAILROADS',540,330,54,'#f4f0e6',INK,{k:seg(pu,.5,.8,E.back),rot:-3});
  return jolt(shakeV(pu,.2,10*k,1.2),g); }
function wuRoom(u,t,o={}){ let g=`<rect width="1080" height="1920" fill="#7d6648"/><rect y="0" width="1080" height="1005" fill="#8a7050"/>`;
  for(let i=0;i<9;i++) g+=`<path d="M${i*135} 0V1005" stroke="#6a5438" stroke-width="5"/>`;
  g+=`<rect x="70" y="360" width="230" height="400" rx="10" ${st('#3a2a22',9)}/><rect x="88" y="378" width="194" height="364" fill="#cfe9f4" stroke="${INK}" stroke-width="6"/><path d="M185 378V742M88 560H282" stroke="${INK}" stroke-width="7"/>`+beam([[88,378],[282,378],[640,1000],[200,1000]],.22,'#fff3c4');
  for(let i=0;i<4;i++) g+=`<path d="M0 ${300+i*18}Q540 ${340+i*18} 1080 ${290+i*18}" fill="none" stroke="#2a2a32" stroke-width="4"/>`;   // telegraph wires along the ceiling
  g+=FLOOR(1005,'#5a3e28'); for(let i=0;i<8;i++) g+=`<path d="M${-100+i*170} 1005L${-300+i*220} 1920" stroke="#47301e" stroke-width="5"/>`;
  return g; }
function sh2_b(pu,u,t){ let g=wuRoom(u,t);
  const ang=PEND(t); g+=regulator(760,410,190,595,ang,{mins:540});
  const kn=Math.sin(pu*15)*.5+.5, crack=seg(pu,.6,.9,E.lin)*(1-seg(pu,1.2,1.5,E.lin));
  const A=full({lean:3,tilt:-3,hF:[60,-168],hB:[52,-172],handF:'fist',handB:'fist',expr:'smug',look:[6,-1]}), B=full({...A,hF:[66+kn*4,-176-kn*6],hB:[56,-170],expr:'determined'});
  g+=toon('hamblet',330,GY,1.3,1,tween(pu,.5,A,B,.3),t,31);
  g+=impact(405,560,seg(pu,.62,.95,E.lin),.5);
  return g; }
function sh2(t){ const u=t-S(2), P=part(2,u); return finish(P.i===0?sh2_a(P.pu,u,t):sh2_b(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 3 THE PENDULUM STOPS: three minutes fifty-eight ---------- */
function sh3_a(pu,u,t){ const stopU=cu(3,'stopped'), px=540, py=300, L=650, ang=PEND(t), bp=bobPos(px,py,L,ang);
  let g=`<rect width="1080" height="1920" fill="#3b2a1f"/><rect y="270" width="1080" height="760" fill="#6a5238"/>`+beam([[300,270],[800,270],[1100,1040],[-60,1040]],.18,'#fff3c4');
  g+=dust(16,Math.min(u,stopU),[40,300,1000,700],6,'#fff3d0',1.2);
  g+=`<rect x="140" y="270" width="800" height="46" ${st('#7a4a2a',8)}/>`+pendulum(px,py+10,L,ang,100,{});
  const hs=seg(u,stopU-.75,stopU,E.io), hand=[lerp(1250,bp[0]+78,hs),lerp(900,bp[1]+10,hs)], jig=wob(u,stopU,10,24,7);
  g+=bigArm([1350,1300],[hand[0]-jig*2,hand[1]+jig],'#efc6a0','#f1ead8',u<stopU?'open':'fist','',1.1);
  g+=impact(bp[0],bp[1],seg(u,stopU,stopU+.35,E.o),1.1);
  g+=FLOOR(1030,'#4a3624');
  return g; }
function sh3_b(pu,u,t){ const secs=lerp(0,238,seg(pu,.1,1.7,E.io));
  let g=`<rect width="1080" height="1920" fill="#b9a27c"/>`+jewelerWindow(40,300,1000,430,u,{run:0,frost:1});
  g+=FLOOR(1005,'#8b8678'); for(let i=0;i<30;i++) g+=`<path d="M${N(-40+rnd(i*3+9)*1160)} ${N(1030+rnd(i*7)*800)}h40" stroke="#6f6a5e" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  const C=[full({hF:[84,-232],handF:'point',hB:[-12,-114],expr:'shock',lean:-6,look:[6,-8]}),full({hF:[70,-250],hB:[40,-240],handF:'open',handB:'open',expr:'shock',lean:-10,tilt:-8}),full({hF:[62,-150],hB:[-8,-120],handF:'fist',expr:'angry',lean:4,look:[4,-4]})];
  [['coatA',190,0,1],['coatC',540,1,-1],['coatB',880,2,-1]].forEach(([w,x,i,d])=>g+=frozen(w,x,GY+6,.95,d,C[i],40+i));
  const fx=540+Math.cos(pu*5.5)*70, fy=610+Math.sin(pu*8.3)*26; g+=`<path d="M${N(fx-Math.cos(pu*5.5-.5)*70+Math.cos(pu*5.5)*70)} ${N(fy)}" stroke="none"/><g transform="translate(${N(fx)} ${N(fy)})"><ellipse rx="9" ry="6" fill="${INK}"/><ellipse cx="-7" cy="-9" rx="9" ry="4" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(${N(Math.sin(pu*90)*20-20)})"/></g>`;
  g+=`<circle cx="905" cy="445" r="162" fill="#fff" opacity=".35"/>`+stopwatch(905,452,118,secs);
  return g; }
function sh3_c(pu,u,t){ const kw=.35; let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`+skyline(GY-6,9,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:300,h1:560,w0:130,w1:210});
  g+=street(GY);
  for(let i=0;i<6;i++){ const cx=100+i*176, cy=i%2?760:700, m0=(i*211+90)%720, f=seg(pu,kw+i*.17,kw+i*.17+.3,E.back), mins=lerp(m0,540+720*Math.sign(0),f);
    g+=`<path d="M${cx} ${cy+66}V${GY}" stroke="${INK}" stroke-width="14"/><path d="M${cx} ${cy+66}V${GY}" stroke="#3a3a44" stroke-width="7"/>`+clockFace(cx,cy,62,mins,{rim:'#2a2a32',sw:4,glow:f>0&&f<1?1:0})+impact(cx,cy,seg(pu,kw+i*.17,kw+i*.17+.35,E.lin),.55); }
  const A=full({hF:[46,-190],hB:[-12,-114],handF:'open',expr:'awe',look:[4,-8],tilt:-6}), B=full({...A,hF:[30,-150],expr:'happy',tilt:0,look:[5,-3]});
  [['coatB',290,0],['coatC',620,1],['coatD',950,0]].forEach(([w,x,i],q)=>g+=toon(w,x,GY+6,.95,q===2?-1:1,tween(pu,kw+.9+q*.15,A,B,.35),t,50+q));
  const pk=panelBox(30,290,300,430,`<rect width="300" height="430" fill="#3b2a1f"/><rect x="70" y="14" width="160" height="26" ${st('#7a4a2a',5)}/>`+pendulum(150,34,300,PEND(t),44,{}),{},{k:seg(pu,0,.2,E.back),rot:-2,border:TEAL,id:'p3c'});
  return g+pk; }
function sh3(t){ const u=t-S(3), P=part(3,u); return finish(P.i===0?sh3_a(P.pu,u,t):P.i===1?sh3_b(P.pu,u,t):sh3_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 4 ONE CLOCK COULD DO THAT: telegraph wires ---------- */
const beatClick=t=>{ const ph=((t/(60/104))%1+1)%1; return Math.max(0,1-Math.abs(ph-.1)/.12); };
function sh4_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`+skyline(GY-6,21,['#a9856a','#b08f72','#9b7a60'],{h0:160,h1:380,x0:380,w0:120,w1:190});
  g+=`<rect x="30" y="470" width="350" height="${GY-470}" ${st('#a85a46',8)}/><path d="M10 470H400L380 436H30Z" ${st('#8a4636',8)}/>`;
  for(let r=0;r<5;r++) for(let c=0;c<4;c++) g+=`<rect x="${64+c*80}" y="${560+r*82}" width="44" height="54" rx="4" fill="#ffe9a8" stroke="${INK}" stroke-width="5"/>`;
  g+=clockFace(205,500,0,0)+pole(120,260,436,160)+pole(300,300,436,150);
  const W=[[[60,282],[1100,720],70],[[180,330],[1100,800],50],[[240,282],[1100,650],80],[[360,330],[1100,770],60]];
  W.forEach(([p0,p1,sg],i)=>{ let d=''; for(let k=0;k<=20;k++){ const q=wirePt(p0,p1,sg,k/20); d+=(k?'L':'M')+N(q[0])+' '+N(q[1]); } g+=`<path d="${d}" fill="none" stroke="${INK}" stroke-width="6"/>`; });
  W.forEach(([p0,p1,sg],i)=>{ for(let j=0;j<2;j++){ const k=((pu*.5+i*.27+j*.5)%1), q=wirePt(p0,p1,sg,k); g+=`<circle cx="${N(q[0])}" cy="${N(q[1])}" r="20" fill="#fff3c4" opacity=".55"/><circle cx="${N(q[0])}" cy="${N(q[1])}" r="9" fill="#ffd23a" stroke="${INK}" stroke-width="4"/>`; } });
  g+=street(GY,'#8b8678'); return g; }
function sh4_b(pu,u,t){ const off=pu*720; let g=`<rect width="1080" height="1920" fill="url(#gSky)"/><g transform="translate(${N(-off)} 0)">`+skyline(GY-6,33,['#a9856a','#b08f72','#9b7a60','#bd9a7c'],{h0:200,h1:520,x0:-100,x1:2400,w0:130,w1:230,clocks:true})+`</g>`;
  for(let i=0;i<4;i++){ const px=((i*430-pu*1700)%1720+1720)%1720-300; g+=pole(px,470,GY,170,22); }
  g+=`<path d="M-60 640Q540 700 1140 660" fill="none" stroke="${INK}" stroke-width="12"/>`+`<path d="M-60 640Q540 700 1140 660" fill="none" stroke="#fff3c4" stroke-width="3" opacity=".6"/>`;
  g+=street(GY,'#8b8678');
  for(let i=0;i<6;i++) g+=`<path d="M${N(560-i*90-20)} ${N(676+i*1.5)}h${N(-60-i*6)}" stroke="#ffd23a" stroke-width="${N(11-i)}" stroke-linecap="round" opacity="${N((.7-i*.11)*100)/100}"/>`;
  g+=`<circle cx="560" cy="676" r="50" fill="#fff3c4" opacity=".55"/><circle cx="560" cy="676" r="22" fill="#ffd23a" stroke="${INK}" stroke-width="6"/>`;
  return `<g transform="rotate(${N(Math.sin(pu*3.4)*1.6)} 540 700)">${g}</g>`; }
function sh4_c(pu,u,t){ const clk=beatClick(t); let g=`<rect width="1080" height="1920" fill="#b9a27c"/>`+jewelerWindow(40,300,1000,430,u,{run:2.6,frost:0});
  g+=FLOOR(1005,'#8b8678'); for(let i=0;i<30;i++) g+=`<path d="M${N(-40+rnd(i*3+9)*1160)} ${N(1030+rnd(i*7)*800)}h40" stroke="#6f6a5e" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  const A=full({lean:3,hF:[40,-150],hB:[-4,-120],expr:'awe',look:[-4,-8],tilt:-6}), B=full({lean:7,hF:[66,-232],hB:[40,-228],handF:'open',handB:'open',expr:'joy',look:[0,-8],tilt:-8});
  [['coatB',140,1],['coatA',400,1],['coatD',660,1]].forEach(([w,x,d],i)=>g+=toon(w,x,GY+6,.95,d,tween(pu,.25+i*.18,A,B,.4),t,60+i));
  g+=sounder(895,990,.95,clk)+ttl('tk',895,640,60,'#fff3c4',{k:clk,rot:-6});
  return g; }
function sh4(t){ const u=t-S(4), P=part(4,u); return finish(P.i===0?sh4_a(P.pu,u,t):P.i===1?sh4_b(P.pu,u,t):sh4_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 5 WHY BOTHER: the sun, 38 times, four zones, no law ---------- */
function sh5_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="url(#gDusk)"/>`;
  const sx=880, sy=420; for(let i=0;i<16;i++){ const a=rad(i*22.5+pu*10), r0=96, r1=150+10*Math.sin(pu*6+i); g+=`<path d="M${N(sx+Math.cos(a-.1)*r0)} ${N(sy+Math.sin(a-.1)*r0)}L${N(sx+Math.cos(a)*r1)} ${N(sy+Math.sin(a)*r1)}L${N(sx+Math.cos(a+.1)*r0)} ${N(sy+Math.sin(a+.1)*r0)}Z" ${st('#ffb627',5)}/>`; }
  g+=`<circle cx="${sx}" cy="${sy}" r="96" ${st('#ffd25a',8)}/>`;
  const cols=['#b8704a','#c9a86a','#7a8f6a','#a85a46','#d8c08a','#8a6a8a'];
  for(let i=0;i<6;i++){ const x=i<3?-20+i*150:630+(i-3)*150, h=300+rnd(i*5)*90; if(i===2||i===3) continue; g+=`<rect x="${x}" y="${GY-h}" width="140" height="${h+6}" ${st(cols[i],7)}/><path d="M${x-8} ${GY-h}h156" stroke="${INK}" stroke-width="7"/>`+clockFace(x+70,GY-h+60,36,(i*213+90)%720,{num:false,sw:3}); for(let r=0;r<2;r++) g+=`<rect x="${x+20+r*58}" y="${GY-h+130}" width="44" height="64" fill="#2b3a52" opacity=".55"/>`; }
  g+=FLOOR(GY,'#cdb37a'); for(let i=0;i<5;i++) g+=`<path d="M${60+i*210} ${GY+30+i*14}q40 -14 90 0" stroke="#b99a62" stroke-width="5" fill="none"/>`;
  for(let i=0;i<6;i++){ const hx=380+i*60; g+=`<path d="M${hx} ${GY-20}q-16 -40 0 -70t0 -70" fill="none" stroke="#fff3c4" stroke-width="5" opacity="${N((.3+.3*Math.sin(pu*5+i))*100)/100}" stroke-linecap="round"/>`; }
  const shade=Math.sin(rad(60+pu*8)); g+=sundial(580,GY-6,1.25,70-pu*6);
  const A=full({lean:6,tilt:6,hF:[46,-150],hB:[22,-146],handF:'hold',handB:'point',expr:'determined',look:[8,6]}), B=full({...A,hF:[50,-158],hB:[30,-152],expr:'smug'});
  g+=toon('farmer',360,GY+4,1.05,1,{...tween(pu,1.0,A,B,.4),holdF:watchSvg()},t,70);
  g+=tag('SUN TIME',540,330,50,'#ffe9a8',INK,{k:seg(pu,.2,.45,E.back),rot:-3}); return g; }
function sh5_b(pu,u,t){ const z=lerp(2.0,1,seg(pu,0,.8,E.io)), n=Math.floor(38*seg(pu,.3,1.36,E.lin)+.001);
  let g=`<rect width="1080" height="1920" fill="#9fc3d8"/>`; const mx=100,my=300,ms=8.2;
  let m=`<path d="${polyPath(WISC,mx,my,ms)}" ${st('#dfe8b4',9)}/>`, pts=[];
  for(let gx=12;gx<=92;gx+=11) for(let gy=14;gy<=90;gy+=11){ if(inPoly(gx,gy,WISC)&&inPoly(gx-3,gy,WISC)&&inPoly(gx+3,gy,WISC)&&inPoly(gx,gy-3,WISC)&&inPoly(gx,gy+3,WISC)) pts.push([gx,gy]); }
  pts.sort((a,b)=>((a[0]-50)**2+(a[1]-52)**2)-((b[0]-50)**2+(b[1]-52)**2)); pts.slice(0,38).forEach(([gx,gy],i)=>{ const k=seg(pu,-.2+i*.03,-.2+i*.03+.18,E.back); if(k>0) m+=`<g transform="translate(${N(mx+gx*ms)} ${N(my+gy*ms)}) scale(${N(k*100)/100})">`+clockFace(0,0,27,(i*137+60)%720,{num:false,sw:3})+`</g>`; });
  g+=`<g transform="translate(540 690) scale(${N(z*1000)/1000}) translate(-540 -690)">${m}</g>`;
  g+=tag('WISCONSIN',300,330,52,'#fffaf0',INK,{k:seg(pu,.5,.8,E.back),rot:-3})+ttl(String(n),840,470,170,'#ffd23a',{k:seg(pu,.25,.4,E.back),rot:4});
  return g; }
function sh5_c(pu,u,t){ let g=WALLBG('#a8855a')+FLOOR(GY,'#5a3e28');
  const fx=90, fy=320, fw=900, fh=440; g+=`<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="10" ${st('#f4ecd0',9)}/>`;
  const P=NAMER.map(p=>[fx+30+p[0]*(fw-60)/100,fy+16+(p[1]-4)*(fh-32)/90]);
  g+=`<clipPath id="nam"><path d="M${P.map(p=>p.map(N).join(' ')).join('L')}Z"/></clipPath><path d="M${P.map(p=>p.map(N).join(' ')).join('L')}Z" ${st('#d9e0b0',7)}/><g clip-path="url(#nam)">`;
  [TEAL,MARI,CRIM,'#2c5e8a'].forEach((c,i)=>{ const k=seg(pu,.3+i*.17,.3+i*.17+.22,E.o); g+=`<rect x="${N(fx+30+i*(fw-60)/4)}" y="${fy}" width="${N((fw-60)/4*k)}" height="${fh}" fill="${c}" opacity=".78"/>`; });
  g+=`</g>`;
  const A=full({lean:4,hF:[70,-300],hB:[-6,-114],handF:'point',expr:'determined',look:[8,-6],tilt:-4}), B=full({...A,hF:[84,-312],lean:6});
  const gx=Math.min(1,pu/1.1);
  g+=toon('railman',200,GY+4,.9,1,{...A,hF:[60+gx*40,-300],lean:2+gx*4},t,80)+toon('coatB',500,GY+4,.9,1,full({hF:[40,-170],hB:[30,-176],handF:'fist',handB:'fist',expr:'stern',look:[6,-8]}),t,81)+toon('coatD',860,GY+4,.9,-1,full({hF:[56,-176],hB:[44,-170],handF:'fist',handB:'fist',expr:'smug',look:[4,-6]}),t,82);
  return g; }
function sh5_d(pu,u,t){ let g=WALLBG('#9a5a44')+FLOOR(GY,'#6a5a46'); for(let r=0;r<6;r++) for(let c=0;c<9;c++) g+=`<rect x="${-30+c*130+(r%2)*60}" y="${280+r*108}" width="124" height="100" fill="none" stroke="#7a4636" stroke-width="3" opacity=".5"/>`;
  for(let i=0;i<4;i++){ const cx=140+i*267, sec=((t*6)%360); g+=`<g>`+clockFace(cx,560,106,540+i*60,{rim:'#2a2a32',sw:6})+`<circle cx="${N(cx+Math.sin(rad(sec))*88)}" cy="${N(560-Math.cos(rad(sec))*88)}" r="8" fill="${CRIM}" stroke="${INK}" stroke-width="3"/></g>`;
    if(i<3) g+=tag('+1h',cx+133,560,38,'#ffe9a8',INK,{k:seg(pu,.25+i*.2,.45+i*.2,E.back),rot:i%2?3:-3}); }
  const A=full({hF:[84,-250],hB:[-10,-114],handF:'point',expr:'smug',look:[-8,-8],lean:-3}), B=full({...A,hF:[96,-262],lean:3,look:[8,-8]});
  g+=toon('railyoung',540,GY+4,.95,1,tween(pu,.5,A,B,.8,E.io),t,83); return g; }
function sh5_e(pu,u,t){ let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="640" y="340" width="300" height="400" ${st('#6a3e1e',8)}/>`+[0,1,2].map(r=>`<path d="M650 ${420+r*100}H930" stroke="${INK}" stroke-width="6"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${662+i*42}" y="${352+r*100}" width="30" height="${60+((i*7+r*5)%3)*8}" fill="${['#5a2a1e','#2a3a5a','#3a5a3a'][(i+r)%3]}" stroke="${INK}" stroke-width="3"/>`).join('')).join('');
  const low=seg(pu,.75,1.15,E.io), A=full({hF:[70,-200],hB:[70,-196],handF:'hold',handB:'hold',expr:'smug',look:[0,-2]}), B=full({hF:[88,-196],hB:[-74,-192],handF:'open',handB:'open',expr:'confused',shrug:10,tilt:6,look:[0,-3]});
  const pose=tween(pu,.7,A,B,.45); g+=toon('tophat',420,GY+4,1.1,1,pose,t,84)+topHat(420+10,GY-338*1.1,1.05,pose.tilt*.8);
  g+=lawBook(lerp(520,470,low),lerp(880,940,low),420,240,lerp(1,.9,low))+qmark(700,560,seg(pu,.9,1.2),1.1);
  return g; }
function sh5(t){ const u=t-S(5), P=part(5,u); return finish([sh5_a,sh5_b,sh5_c,sh5_d,sh5_e][P.i](P.pu,u,t),t,{boil:2.2}); }

/* ---------- 6 CLOCKS IN THE EAST WENT BACK ---------- */
function backPanel(pu,k0,from,wall,kind){ const mins=lerp(from,from-6,seg(pu,k0,k0+.8,E.back)); let g=WALLBG(wall);
  g+=kind?`<rect x="40" y="120" width="400" height="640" ${st('#f4f0e6',8)}/><path d="M150 120L240 20L330 120" ${st('#f4f0e6',8)}/>`:`<rect x="0" y="760" width="480" height="300" fill="#6a5a46"/>`;
  g+=clockFace(240,kind?330:300,170,mins,{rim:'#2a2a32',sw:8});
  g+=`<g opacity="${N(seg(pu,k0,k0+.15,E.lin)*(1-seg(pu,k0+.7,k0+.95,E.lin))*100)/100}"><path d="M110 560Q240 640 370 560" fill="none" stroke="${CRIM}" stroke-width="14" stroke-linecap="round"/><path d="M118 590L96 548L148 556Z" fill="${CRIM}" stroke="${INK}" stroke-width="4"/></g>`; return g; }
function sh6_a(pu,u,t){ let g=`<rect width="1080" height="1920" fill="#2a2018"/>`;
  g+=panelBox(40,290,480,720,backPanel(pu,.25,62,'#9a5a44',0),{},{rot:-1.5,border:TEAL,id:'pa6',k:seg(pu,0,.12,E.back)})+panelBox(560,290,480,720,backPanel(pu,.45,205,'#9fc3d8',1),{},{rot:1.5,border:MARI,id:'pb6',k:seg(pu,.08,.2,E.back)});
  return g; }
function sh6_b(pu,u,t){ const crankA=-pu*620, mins=lerp(4,0,seg(pu,.1,1.4,E.io)), cx=540, cy=650;
  let g=`<rect width="1080" height="1920" fill="url(#gSky)"/><g transform="translate(540 650) scale(1.55) translate(-540 -650)">`+steeple(540,300,GY+40,{cy:650,r:105,mins}) +`</g>`;
  g+=`<path d="M420 700L335 780" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M420 700L335 780" stroke="#8a8a96" stroke-width="9" stroke-linecap="round"/><circle cx="335" cy="780" r="56" ${st('#6a6a76',8)}/>`;
  const hp=[335+Math.cos(rad(crankA))*40, 780+Math.sin(rad(crankA))*40], fp=[300,960], s=.8;
  g+=`<path d="M335 780L${N(hp[0])} ${N(hp[1])}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><circle cx="${N(hp[0])}" cy="${N(hp[1])}" r="12" ${st('#c9a03a',4)}/>`;
  g+=ladder(180,GY+20,300,820,52);
  g+=toon('workman',fp[0],fp[1],s,1,full({lean:4,tilt:4,hF:W2L(fp[0],fp[1],s,1,hp),hB:[-12,-130],handF:'fist',handB:'open',expr:'determined',look:[6,-2]}),t,5);
  g+=`<g opacity=".75"><path d="M690 430Q760 470 770 540" fill="none" stroke="${CRIM}" stroke-width="14" stroke-linecap="round" transform="scale(-1 1) translate(-1500 0)"/></g>`;
  g+=street(GY+30); return g; }
function sh6_c(pu,u,t){ const k=.1; let g=`<rect width="1080" height="1920" fill="#d8c8a8"/><rect y="0" width="1080" height="1005" fill="#e9e1cd"/>`;
  for(let i=0;i<7;i++) g+=`<path d="M${i*180} 0V1005" stroke="#cfc6ae" stroke-width="5"/>`;
  g+=bellProp(540,380,1.6,bellSwing(pu,k,30),seg(pu,k,k+.45,E.lin))+FLOOR(GY+10,'#8b8678');
  const A=PS.shrug, B=PS.reset;
  g+=toon('coatB',300,GY+14,1.5,1,{...tween(pu,.1,A,B,.5),holdF:watchSvg()},t,90)+toon('coatC',790,GY+14,1.5,-1,{...tween(pu,.25,A,B,.5),holdF:watchSvg()},t,91);
  return g; }
function sh6(t){ const u=t-S(6), P=part(6,u); return finish(P.i===0?sh6_a(P.pu,u,t):P.i===1?sh6_b(P.pu,u,t):sh6_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 7 THE INDIANA PAPER ---------- */
function sh7_a(pu,u,t){ const slam=1.55, sh=shakeV(pu,slam,16,.4); let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="520" y="330" width="460" height="300" fill="#b8c9d3" stroke="${INK}" stroke-width="8"/><path d="M750 330V630M520 480H980" stroke="${INK}" stroke-width="7"/>`;
  g+=press(780,GY-6,1.05,pu,{spin:1})+`<g>`+[0,1,2].map(i=>{ const k=((pu*1.5+i*.33)%1); return `<rect x="${N(560+k*30)}" y="${N(930-k*260)}" width="90" height="60" transform="rotate(${N(-10+k*40)} ${N(600+k*30)} ${N(960-k*260)})" ${st('#f6f0dc',4)} opacity="${N((1-k)*100)/100}"/>`; }).join('')+`</g>`;
  const A=full({lean:-2,hF:[56,-150],hB:[44,-154],handF:'hold',handB:'hold',expr:'neutral',look:[4,2]}), B=full({lean:10,tilt:-4,hF:[62,-120],hB:[40,-118],handF:'fist',handB:'fist',expr:'angry',look:[4,2]});
  g+=toon('editor',230,GY-10,1.1,1,tween(pu,slam-.35,A,B,.3,E.o),t,95);
  g+=`<g transform="translate(${N(sh[0])} ${N(sh[1])})"><rect x="40" y="880" width="420" height="${GY-880}" ${st('#7a4a2a',9)}/><rect x="20" y="860" width="460" height="34" rx="6" ${st('#9a6a3c',8)}/><rect x="190" y="832" width="150" height="30" fill="#f6f0dc" stroke="${INK}" stroke-width="5"/></g>`+impact(300,850,seg(pu,slam,slam+.35,E.lin),.9);
  return g; }
function sh7_b(pu,u,t){ const py=lerp(1250,665,seg(pu,0,.3,E.o)), rv=seg(pu,.25,.85,E.lin), hl=seg(pu,.85,1.3,E.io);
  let g=`<rect width="1080" height="1920" fill="#4a3624"/>`+press(180,GY+20,1.1,pu,{spin:1})+`<rect x="0" y="0" width="1080" height="1920" fill="#000" opacity=".3"/>`;
  g+=newsPage(540,py,880,740,hl,{rot:lerp(4,-1,seg(pu,0,.3)),reveal:rv}); return g; }
function sh7_c(pu,u,t){ const sx=lerp(540,1250,seg(pu,.75,1.25,E.i)); let g=`<rect width="1080" height="1920" fill="url(#gDusk)"/>`;
  [[200,420,1.0],[880,360,1.2],[560,330,.8]].forEach(([x,y,s],i)=>g+=`<g transform="translate(${x+Math.sin(pu*1.3+i)*14} ${y}) scale(${s})" opacity=".9"><circle r="50" ${st('#fffaf0',6)}/><circle cx="56" cy="14" r="40" ${st('#fffaf0',6)}/><circle cx="-54" cy="16" r="36" ${st('#fffaf0',6)}/></g>`);
  g+=FLOOR(GY,'#c9a86a');
  const bob=Math.abs(Math.sin(pu*9))*10*seg(pu,.75,1.25,E.lin), bx=sx, by=860-bob;
  g+=sunFace(sx,590-bob,120,pu,'sad',1);
  g+=`<g transform="translate(${N(bx)} ${N(by)})"><rect x="-150" y="0" width="300" height="190" ${st('#c9a46a',9)}/><path d="M-150 0L-110 -34H110L150 0" ${st('#b08f58',8)}/>`;
  const k1=seg(pu,.05,.25,E.back), k2=seg(pu,.25,.45,E.back), k3=seg(pu,.45,.65,E.back);
  g+=`<g transform="translate(-80 0) scale(${N(k1*100)/100})"><path d="M0 -10Q-20 -60 -50 -80M0 -10Q20 -70 50 -70M0 -10V-90" stroke="#3a8a3a" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="-36" y="-14" width="72" height="26" rx="6" ${st('#a85a46',6)}/></g>`;
  g+=`<g transform="translate(10 0) scale(${N(k2*100)/100})"><path d="M0 -10L40 -110L100 -130" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><ellipse cx="108" cy="-128" rx="34" ry="18" ${st('#ffd25a',6)}/><rect x="-24" y="-14" width="56" height="20" rx="6" ${st('#4a4a54',6)}/></g>`;
  g+=`<g transform="translate(98 0) scale(${N(k3*100)/100})"><rect x="-24" y="-52" width="48" height="52" rx="8" ${st('#f4f0e6',6)}/><path d="M24 -38q26 0 26 22q0 20 -26 20" fill="none" stroke="${INK}" stroke-width="7"/></g></g>`;
  g+=`<path d="M${N(bx-190)} ${N(by+30)}L${N(bx-120)} ${N(by+30)}" stroke="${INK}" stroke-width="0"/>`;
  g+=sweat(sx+130,520-bob,seg(pu,.1,.3),pu,1.2); return g; }
function sh7(t){ const u=t-S(7), P=part(7,u); return finish(P.i===0?sh7_a(P.pu,u,t):P.i===1?sh7_b(P.pu,u,t):sh7_c(P.pu,u,t),t,{boil:2.2}); }

/* ---------- 8 THE LAW: THIRTY-FIVE YEARS LATE ---------- */
function bigWatch(open){ return {svg:`<g transform="scale(2.6)"><path d="M0 -4Q-12 -26 -4 -44" fill="none" stroke="${INK}" stroke-width="3"/><circle r="15" ${st('#e8d28a',3.5)}/><circle r="10.5" fill="#fbf6ea"/><path d="M0 0V-7M0 0L5 3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>${open?'':`<circle r="15" ${st('#e8d28a',3.5)}/><path d="M-9 -6Q0 -12 9 -6" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>`}</g>`}; }
function sh8_a(pu,u,t){ const z=lerp(1,1.14,seg(pu,0,1.7,E.io)); let g=`<rect width="1080" height="1920" fill="url(#gSky)"/>`;
  [[180,430,1.1],[860,520,1.4]].forEach(([x,y,s],i)=>g+=`<g transform="translate(${N(x+pu*18)} ${y}) scale(${s})" opacity=".9"><circle r="46" ${st('#fffaf0',6)}/><circle cx="50" cy="12" r="36" ${st('#fffaf0',6)}/><circle cx="-48" cy="14" r="32" ${st('#fffaf0',6)}/></g>`);
  g+=`<g transform="translate(540 ${GY}) scale(${N(z*1000)/1000}) translate(-540 ${-GY})">`+capitol(540,GY,1.05)+`</g>`+FLOOR(GY,'#9aa87a');
  for(let i=0;i<3;i++){ const k=((pu*.5+i*.3)%1); g+=`<path d="M${N(120+k*820)} ${N(380+i*40+Math.sin(k*9)*14)}l14 -8l14 8" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
  return g; }
function sh8_b(pu,u,t){ let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  const st1=.22, down=seg(pu,st1-.22,st1,E.i)*(1-seg(pu,st1+.05,st1+.4,E.o)), A=full({lean:3,hF:[60,-300],hB:[-8,-150],handF:'hold',expr:'smug',look:[4,3]}), B=full({lean:10,tilt:-4,hF:[84,-140],hB:[-8,-150],handF:'hold',expr:'smug',look:[4,6]});
  const pose=mix(A,B,down), stamp={svg:`<g transform="translate(0 -12)"><rect x="-24" y="-70" width="48" height="26" rx="8" ${st('#5a2a1e',5)}/><rect x="-6" y="-46" width="12" height="42" fill="#8a5a32" stroke="${INK}" stroke-width="4"/><rect x="-34" y="-8" width="68" height="14" rx="3" ${st('#3a3a44',5)}/></g>`,over:true};
  g+=`<rect x="20" y="800" width="520" height="${GY-800}" ${st('#7a4a2a',9)}/><rect x="0" y="780" width="560" height="34" rx="6" ${st('#9a6a3c',8)}/>`;
  g=g.replace(/$/,'');
  g+=toon('senator',210,GY-30,1.1,1,{...pose,holdF:stamp},t,96);
  g+=`<g transform="rotate(-4 380 780)"><rect x="250" y="752" width="320" height="52" ${st('#f6f0dc',5)}/></g>`+stampMark(400,760,['OFFICIAL'],CRIM,seg(pu,st1,st1+.15,E.lin),-8,32);
  const tap=Math.abs(Math.sin(pu*7))*14;
  g+=toon('railman',850,GY+4,1.1,-1,full({lean:-2,tilt:3,hF:[40,-176],hB:[24,-120],handF:'hold',handB:'fist',fF:[22,-tap],fB:[-16,0],expr:'tired',look:[-6,2]}),t,97).replace(/$/,'');
  g+=panelBox(690,290,320,320,`<rect width="320" height="320" fill="#d8c8a8"/>`+wallCalendar(160,170,.85,1883,seg(pu,.9,1.45,E.io)),{},{rot:2,k:seg(pu,.55,.75,E.back),border:CRIM,id:'cal8'});
  return g; }
function sh8_c(pu,u,t){ const kl=cu(8,'late')-cutPts(8)[1], snap=seg(pu,kl-.15,kl,E.i), look=seg(pu,kl+.1,kl+.5,E.io);
  let g=WALLBG('#8a7050')+FLOOR(GY,'#5a3e28');
  g+=`<rect x="90" y="330" width="260" height="360" ${st('#6a3e1e',8)}/><rect x="110" y="350" width="220" height="320" fill="#b8c9d3" stroke="${INK}" stroke-width="6"/>`+`<rect x="730" y="340" width="260" height="330" ${st('#6a3e1e',8)}/>`;
  const A=full({lean:-2,hF:[58,-236],hB:[-8,-120],handF:'hold',expr:'tired',look:[0,3]}), B=full({lean:2,tilt:-3,hF:[44,-206],hB:[-8,-120],handF:'fist',expr:'stern',look:[-4,0]});
  const pose=mix(A,B,snap), wob2=wob(pu,kl,1,22,8);
  g+=toon('railman',540,GY+16,1.55,1,{...pose,tilt:pose.tilt+look*5,lean:pose.lean+wob2*2,holdF:bigWatch(snap<.5)},t,98);
  g+=impact(640,560,seg(pu,kl,kl+.3,E.lin),.8); return g; }
function sh8(t){ const u=t-S(8), P=part(8,u); return finish(P.i===0?sh8_a(P.pu,u,t):P.i===1?sh8_b(P.pu,u,t):sh8_c(P.pu,u,t),t,{boil:2.2}); }
const CUT_EP={1:[['church',-.3],'four',['again',-.25]], 2:[['man',-.3]], 3:[['three',-.25],['restarted',-.2]], 4:[['telegraph',-.1],['jewelers',-.15]],
  5:[['wisconsin',-.15],['so',-.1],['zones',-.35],['no',-.1]], 6:[['went',-.1],['noon',-.25]], 7:[['sun',-.15],['job',-.2]], 8:[['official',-.2],['thirty',-.1]]};
const CUT_HOLD_EP=[8];
const SEQ=[1,2,3,4,5,6,7,8].map(n=>({from:n,r:[sh1,sh2,sh3,sh4,sh5,sh6,sh7,sh8][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
