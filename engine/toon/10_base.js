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
