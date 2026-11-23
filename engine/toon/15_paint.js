/* ============================== toon kit: painted layer (textures + painters) for paint() in engine/template.html
   Everything here is drawn by code: no image files, no assets, no randomness that isn't seeded. A painter's output depends
   only on its arguments (t, camera, options), so any frame renders the same in any order and in any export worker.
   Textures are baked on first use (episodes that never paint pay nothing) and are a pure function of their seed.
   The painter namespace is PNT, not P: shots use P=part(n,u) as a local name, which would hide a global P. */

/* ---- seeded noise ---- */
function hash2(x,y,s){ let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(s|0,1442695041))|0;
  h=Math.imul(h^(h>>>13),1274126177); h^=h>>>16; return (h>>>0)/4294967296; }
function rng(seed){ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
/* value noise; px/py > 0 make it tile with that many lattice cells */
function vnoise(x,y,s=0,px=0,py=0){ const xi=Math.floor(x), yi=Math.floor(y), fx=x-xi, fy=y-yi, u=fx*fx*(3-2*fx), v=fy*fy*(3-2*fy);
  const wx=a=>px?((a%px)+px)%px:a, wy=a=>py?((a%py)+py)%py:a, X0=wx(xi),X1=wx(xi+1),Y0=wy(yi),Y1=wy(yi+1);
  const a=hash2(X0,Y0,s),b=hash2(X1,Y0,s),c=hash2(X0,Y1,s),d=hash2(X1,Y1,s); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,{oct=4,s=0,px=0,py=0,gain=.5}={}){ let f=1,a=1,sum=0,n=0;
  for(let o=0;o<oct;o++){ sum+=a*vnoise(x*f,y*f,s+o*31,px*f,py*f); n+=a; a*=gain; f*=2; } return sum/n; }
const smoothstep=(a,b,x)=>{ const k=sat((x-a)/(b-a)); return k*k*(3-2*k); };

/* ---- textures: tileable 512 px greyscale (or white + alpha), tinted when drawn ---- */
function bakeTex(w,h,fn){ const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d'), im=x.createImageData(w,h), d=im.data;
  for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const v=fn(i,j), k=(j*w+i)*4;
    if(typeof v==='number'){ const g=Math.round(sat(v)*255); d[k]=d[k+1]=d[k+2]=g; d[k+3]=255; } else { d[k]=v[0]; d[k+1]=v[1]; d[k+2]=v[2]; d[k+3]=v[3]; } }
  x.putImageData(im,0,0); return c; }
const TEX={}; const TEXMS={};
const TEXDEF={
  /* horizontal planks, 8 per tile (64 px), grain along x, dark seams, a few knots */
  wood:()=>bakeTex(512,512,(x,y)=>{ const pl=Math.floor(y/64), yy=y%64, sd=pl*7+3;
    const base=.56+(hash2(pl,0,91)-.5)*.16, warp=fbm(x/128,y/16,{oct:3,s:sd,px:4,py:32})*26;
    const grain=.5+.5*Math.sin((y+warp)*1.15+hash2(pl,1,92)*6), fine=fbm(x/8,y/2,{oct:2,s:sd+5,px:64,py:256});
    let v=base+.10*(grain-.5)+.08*(fine-.5);
    for(let k=0;k<2;k++){ const kx=hash2(pl,k+2,93)*512, ky=pl*64+14+hash2(pl,k+4,94)*36, dx=Math.min(Math.abs(x-kx),512-Math.abs(x-kx))/1.8, dy=y-ky, r=Math.hypot(dx,dy);
      if(r<26) v-= .14*(1-r/26)*(.6+.4*Math.sin(r*1.3)); }
    if(yy<2) v-=.28; else if(yy<4) v-=.1; else if(yy>61) v+=.06;
    if(x%256<2&&((pl%2)?x>=256:x<256)) v-=.22;                            // staggered butt joints
    return v; }),
  /* water ripples: stretched along x, two scales */
  water:()=>bakeTex(512,512,(x,y)=>{ const a=fbm(x/64,y/16,{oct:4,s:11,px:8,py:32}), b=fbm(x*24/512,y*85/512,{oct:2,s:12,px:24,py:85});
    return .5+.9*(a-.5)+.35*(b-.5); }),
  /* sharp highlights for sun glint, white with alpha */
  glint:()=>bakeTex(512,512,(x,y)=>{ const a=fbm(x*13/512,y*57/512,{oct:3,s:21,px:13,py:57}); const v=Math.pow(sat((a-.52)/.3),2.2); return [255,250,235,Math.round(v*255)]; }),
  /* soft cumulus band, white with alpha (tiles in x) */
  cloud:()=>bakeTex(512,256,(x,y)=>{ const n=fbm(x/128,y/64,{oct:5,s:31,px:4,py:4}), fall=Math.sin(Math.PI*y/256);
    const a=smoothstep(.48,.72,n*(.55+.6*fall)); const sh=1-.18*smoothstep(.4,1,y/256); return [Math.round(255*sh),Math.round(252*sh),Math.round(248*sh),Math.round(a*255)]; }),
  /* film grain, mid grey */
  grain:()=>bakeTex(256,256,(x,y)=>.5+(hash2(x,y,41)-.5)*.5)
};
function tex(name){ if(!TEX[name]){ const t0=performance.now(); TEX[name]=TEXDEF[name](); TEXMS[name]=Math.round(performance.now()-t0); } return TEX[name]; }
/* bake every texture now (verify.js calls this to report bake time; painters bake lazily otherwise) */
function bakeAll(){ for(const k of Object.keys(TEXDEF)) tex(k); return {...TEXMS}; }
const patCache=new Map();
function pat(ctx,name){ const k=name; let p=patCache.get(k); if(!p||p.ctx!==ctx){ p={ctx,p:ctx.createPattern(tex(name),'repeat')}; patCache.set(k,p); } return p.p; }
/* keyed caches for static planes: the key is the full input, never "the last frame", so the result can't depend on render order */
const PCACHE=new Map();
function cached(key,make){ let v=PCACHE.get(key); if(!v){ if(PCACHE.size>24) PCACHE.delete(PCACHE.keys().next().value); v=make(); PCACHE.set(key,v); } return v; }
/* the deck's plank layer (greyscale, multiplied over the deck colour), rows growing towards the viewer; baked at the frame's pixel density */
function deckPlanks(y0,y1,rows,grow,ox,x0,x1){ const d=Math.min(window.devicePixelRatio||1,2);
  return cached(['deck',y0,y1,rows,grow,ox,x0,x1,d].join(','),()=>{ const W=tex('wood'), c=document.createElement('canvas'), w=x1-x0, hh=y1-y0;
    c.width=Math.round(w*d); c.height=Math.round(hh*d); const x=c.getContext('2d'); x.scale(d,d); x.fillStyle='#fff'; x.fillRect(0,0,w,hh);
    const tot=(grow+1)/2*rows; let y=0;
    for(let i=0;i<rows;i++){ const h=hh*lerp(1,grow,i/(rows-1))/tot, sc=h/64, tw=512*sc*1.6, row=((i*5+3)%8)*64; let xx=-(((ox*sc)%tw)+tw)%tw;
      while(xx<w){ x.drawImage(W,0,row,512,64,xx,y,tw,h+.5); xx+=tw; } y+=h; }
    return c; }); }
const rgba=(hex,a)=>{ const n=parseInt(hex.slice(1),16); return `rgba(${n>>16},${n>>8&255},${n&255},${a})`; };

/* ---- painters: screen space unless they take a camera; options are plain numbers and colours ---- */
const PNT={
  /* sky: vertical gradient over the whole frame, optional sun [x,y,r,col] with a soft halo */
  sky(ctx,{top='#2f6fb3',mid='#8fc4e8',bot='#f4efe0',midAt=.55,y0=0,y1=1920,sun=null,halo=.55}={}){
    const g=ctx.createLinearGradient(0,y0,0,y1); g.addColorStop(0,top); g.addColorStop(midAt,mid); g.addColorStop(1,bot);
    ctx.fillStyle=g; ctx.fillRect(-20,-20,1120,Math.min(1960,y1+100));   // only down to just below y1: what's under it is usually sea or set
    if(sun){ const [x,y,r,col]=sun; ctx.save(); ctx.globalCompositeOperation='screen';
      const h=ctx.createRadialGradient(x,y,r*.6,x,y,r*7); h.addColorStop(0,rgba(col,halo)); h.addColorStop(.35,rgba(col,halo*.32)); h.addColorStop(1,rgba(col,0));
      ctx.fillStyle=h; ctx.fillRect(x-r*7,y-r*7,r*14,r*14); ctx.restore();
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); } },
  /* night stars, twinkling; alpha 0 skips the work */
  stars(ctx,{n=160,alpha=1,y1=900,t=0,seed=7}={}){ if(alpha<=.01) return; const r=rng(seed); ctx.save(); ctx.fillStyle='#fffbe8';
    for(let i=0;i<n;i++){ const x=r()*1080, y=r()*y1, s=.8+r()*2.2, ph=r()*6.28, tw=.55+.45*Math.sin(t*(2+r()*3)+ph);
      ctx.globalAlpha=alpha*tw*(1-y/y1*.6); ctx.fillRect(x,y,s,s); } ctx.restore(); },
  /* clouds: a band of the cloud texture at height alt, drifting; par = how much it follows the camera's x */
  clouds(ctx,c,t,{alt=520,h=300,drift=14,alpha=.7,scale=1.7,par=.12,seed=0,tint=null}={}){
    const p=pat(ctx,'cloud'), off=-(c?c.x*par:0)+drift*t+seed*197;
    ctx.save(); ctx.globalAlpha=alpha; p.setTransform(new DOMMatrix([scale,0,0,scale*h/256*.9,off%(512*scale),alt-h/2]));
    ctx.fillStyle=p; ctx.fillRect(-20,alt-h/2,1120,h);
    if(tint){ ctx.globalCompositeOperation='source-atop'; ctx.globalAlpha=tint[1]; ctx.fillStyle=tint[0]; ctx.fillRect(-20,alt-h/2,1120,h); }
    ctx.restore(); },
  /* sea from the horizon line down: base gradient, ~120 perspective strips of two scrolling water copies, sun glint column.
     swell: wave size (0 = glassy). glint: [x, strength]. */
  sea(ctx,c,t,{horizon=1000,bottom=1940,deep='#0c3f63',shallow='#5f9fc0',haze='#dfe9ea',glint=null,swell=1,speed=1,strips=72,par=.25}={}){
    const H=bottom-horizon; if(H<=0) return; const g=ctx.createLinearGradient(0,horizon,0,horizon+Math.max(H,600));
    g.addColorStop(0,haze); g.addColorStop(.06,shallow); g.addColorStop(1,deep); ctx.fillStyle=g; ctx.fillRect(-20,horizon,1120,H+20);
    const PW=pat(ctx,'water'), PG=glint?pat(ctx,'glint'):null, camx=c?c.x*par:0, M=new DOMMatrix(), span=Math.max(H,600);
    ctx.save(); let yPrev=horizon;
    for(let i=1;i<=strips;i++){ const y=Math.min(bottom,horizon+span*Math.pow(i/strips,1.7)), sh=y-yPrev; if(sh<.5) continue;
      const near=(y-horizon)/span, sc=.18+2.6*near, depth=1/(near+.03);                 // texture scale and depth for this strip
      const v=depth*22+t*12*speed+Math.sin(t*.9+depth*.4)*6*swell, amp=(.10+.5*swell)*(.35+.65*near);
      ctx.globalCompositeOperation='overlay'; ctx.globalAlpha=Math.min(1,amp*1.4);
      for(const [dir,ph] of near>.12?[[1,0],[-1,173]]:[[1,0]]){                          // two copies drifting in opposite directions (one near the horizon, where they'd blur together)
        M.a=sc; M.b=0; M.c=0; M.d=sc; M.e=-(camx+dir*t*9*speed+ph); M.f=yPrev-(v+ph)*sc; PW.setTransform(M); ctx.fillStyle=PW; ctx.fillRect(-20,yPrev,1120,sh+.6); }
      if(PG){ const [gx,gs]=glint, half=60+520*near, a=gs*(.25+.75*near);
        if(a>.01){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,a); M.e=-(camx+t*14); M.f=yPrev-v*1.3*sc; PG.setTransform(M); ctx.fillStyle=PG; ctx.fillRect(gx-half,yPrev,half*2,sh+.6); } }
      yPrev=y; if(y>=bottom) break; }
    ctx.restore();
    const hz=ctx.createLinearGradient(0,horizon,0,horizon+span*.18); hz.addColorStop(0,rgba(haze,.85)); hz.addColorStop(1,rgba(haze,0));
    ctx.fillStyle=hz; ctx.fillRect(-20,horizon-1,1120,Math.min(H,span*.18)+1); },
  /* wood: fill rect [x,y,w,h] (in the current transform, e.g. after camCtx) with planks of colour tone.
     light: -1..1 top-to-bottom light ramp; scale: plank size; rot: degrees (90 = vertical planks, e.g. a mast) */
  wood(ctx,[x,y,w,h],{tone='#8a5a32',light=.25,scale=1,rot=0,ox=0,oy=0,grain=.95}={}){
    ctx.save(); ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip(); ctx.fillStyle=tone; ctx.fillRect(x,y,w,h);
    const p=pat(ctx,'wood'), m=new DOMMatrix().translate(x+ox,y+oy).rotate(rot).scale(scale);
    p.setTransform(m); ctx.globalCompositeOperation='multiply'; ctx.globalAlpha=grain; ctx.fillStyle=p; ctx.fillRect(x,y,w,h);
    ctx.globalCompositeOperation='overlay'; ctx.globalAlpha=.35; ctx.fillRect(x,y,w,h);
    if(light){ const g=ctx.createLinearGradient(0,y,0,y+h), a=Math.abs(light);
      g.addColorStop(0,light>0?`rgba(255,240,210,${a})`:`rgba(0,0,0,${a})`); g.addColorStop(1,light>0?`rgba(0,0,0,${a*.6})`:`rgba(255,240,210,${a*.4})`);
      ctx.globalCompositeOperation='soft-light'; ctx.globalAlpha=1; ctx.fillStyle=g; ctx.fillRect(x,y,w,h); }
    ctx.restore(); },
  /* floor seen at an angle: planks from TEX.wood, one plank per row, rows getting taller towards the viewer (y0 -> y1).
     rows: number of planks; grow: how much taller the nearest plank is than the farthest; ox: scroll along the planks */
  deck(ctx,y0,y1,{tone='#a8743f',rows=12,grow=3,ox=0,light=.25,shade=.35,x0=-200,x1=1280}={}){
    ctx.save(); ctx.fillStyle=tone; ctx.fillRect(x0,y0,x1-x0,y1-y0);
    ctx.globalCompositeOperation='multiply'; ctx.drawImage(deckPlanks(y0,y1,rows,grow,ox,x0,x1),x0,y0,x1-x0,y1-y0);
    ctx.globalCompositeOperation='source-over';                                      // shade under the bulwark, then warm light towards the viewer
    const g=ctx.createLinearGradient(0,y0,0,y0+(y1-y0)*.3); g.addColorStop(0,`rgba(0,0,0,${shade})`); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(x0,y0,x1-x0,(y1-y0)*.3);
    if(light>0){ const l=ctx.createLinearGradient(0,y0+(y1-y0)*.3,0,y1); l.addColorStop(0,'rgba(255,236,200,0)'); l.addColorStop(1,`rgba(255,236,200,${light*.5})`);
      ctx.globalCompositeOperation='screen'; ctx.fillStyle=l; ctx.fillRect(x0,y0+(y1-y0)*.3,x1-x0,(y1-y0)*.7); }
    ctx.restore(); },
  /* light shafts from (x,y) at angle (degrees from straight down), additive, with seeded dust motes */
  shafts(ctx,{x=540,y=0,angle=12,spread=10,n=4,len=1500,width=90,alpha=.22,col='#fff2c8',motes=60,t=0,seed=3}={}){
    const r=rng(seed); ctx.save(); ctx.globalCompositeOperation='lighter';
    for(let i=0;i<n;i++){ const a=(angle+(i-(n-1)/2)*spread/Math.max(1,n-1)+(r()-.5)*3)*Math.PI/180, wd=width*(.6+r()*.8), fl=.75+.25*Math.sin(t*.7+i*2.1);
      const dx=Math.sin(a), dy=Math.cos(a), ex=x+dx*len, ey=y+dy*len, nx=dy, ny=-dx;
      const g=ctx.createLinearGradient(x,y,ex,ey); g.addColorStop(0,rgba(col,alpha*fl)); g.addColorStop(.6,rgba(col,alpha*fl*.45)); g.addColorStop(1,rgba(col,0));
      ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(x-nx*wd*.3,y-ny*wd*.3); ctx.lineTo(x+nx*wd*.3,y+ny*wd*.3); ctx.lineTo(ex+nx*wd,ey+ny*wd); ctx.lineTo(ex-nx*wd,ey-ny*wd); ctx.closePath(); ctx.fill(); }
    for(let i=0;i<motes;i++){ const bi=Math.floor(r()*n), a=(angle+(bi-(n-1)/2)*spread/Math.max(1,n-1))*Math.PI/180, d=r()*len*.8, side=(r()-.5)*width*.8,
        ph=r()*6.28, sp=6+r()*10, mx=x+Math.sin(a)*d+Math.cos(a)*side+Math.sin(t*.6+ph)*14, my=y+Math.cos(a)*d+((t*sp+ph*40)%120)-60, s=1.2+r()*2.4;
      ctx.globalAlpha=(.35+.4*Math.sin(t*1.7+ph))*(1-d/len); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(mx,my,s,0,6.283); ctx.fill(); }
    ctx.restore(); },
  glow(ctx,x,y,r,col='#ffd98a',a=.5,mode='screen'){ ctx.save(); ctx.globalCompositeOperation=mode;
    const g=ctx.createRadialGradient(x,y,0,x,y,r); g.addColorStop(0,rgba(col,a)); g.addColorStop(.4,rgba(col,a*.4)); g.addColorStop(1,rgba(col,0));
    ctx.fillStyle=g; ctx.fillRect(x-r,y-r,r*2,r*2); ctx.restore(); },
  /* depth haze: colour col fading in from y0 (alpha 0) to y1 (alpha a); swap y0/y1 to fade the other way */
  haze(ctx,y0,y1,col='#e8e2d0',a=.4){ const g=ctx.createLinearGradient(0,y0,0,y1); g.addColorStop(0,rgba(col,0)); g.addColorStop(1,rgba(col,a));
    ctx.fillStyle=g; ctx.fillRect(-20,Math.min(y0,y1),1120,Math.abs(y1-y0)); },
  /* heat shimmer band: re-draws a strip of the canvas shifted sideways in thin rows (cheap, deterministic) */
  shimmer(ctx,y0,y1,t,amp=3){ const cv=ctx.canvas, d=ctx.getTransform().a;
    for(let y=y0;y<y1;y+=6){ const dx=Math.sin(y*.09+t*7)*amp*(1-(y-y0)/(y1-y0)); ctx.drawImage(cv,0,y*d,cv.width,6*d,dx,y,1080,6); } },
  /* (the SVG finish() already draws a vignette over both layers; use this only for a painted-only darkening) */
  vignette(ctx,a=.5,col='#000'){ const g=ctx.createRadialGradient(540,900,420,540,900,1250); g.addColorStop(0,rgba(col,0)); g.addColorStop(1,rgba(col,a));
    ctx.fillStyle=g; ctx.fillRect(-20,-20,1120,1960); },
  /* film grain over the painted layer (the SVG paper grain covers the figures) */
  grain(ctx,a=.06,t=0){ const p=pat(ctx,'grain'); p.setTransform(new DOMMatrix([2,0,0,2,(Math.floor(t*10)*137)%256,(Math.floor(t*10)*71)%256]));
    ctx.save(); ctx.globalCompositeOperation='overlay'; ctx.globalAlpha=a; ctx.fillStyle=p; ctx.fillRect(-20,-20,1120,1960); ctx.restore(); }
};
