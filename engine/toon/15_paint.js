/* ============================== toon kit: painted layer (textures + painters for the canvas under the SVG)
   Use: inside a shot,  paint(ctx=>{ PNT.sky(ctx,{...}); camCtx(ctx,c); PNT.sea(ctx,t,{...}); });  then return the SVG as usual.
   ctx arrives in 1080x1920 frame units. Call camCtx(ctx,c) to paint in world units with the shot's camera (camPar(c,k) for far planes).
   Rules (verify.js checks them): painters depend only on their arguments - no Math.random, Date, performance.now or kept state.
   Never call ctx.setTransform or ctx.resetTransform in a painter (use PNT.frame for frame-space work); save()/restore() around changes.
   An episode that paints sets PAINT_EP=1 in meta.js so the textures are baked before the film is published. */
const rng=a=>()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };   // mulberry32
const ph2=(x,y,s)=>{ let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul(s|0,2147483647); h=Math.imul(h^h>>>13,1274126177); return ((h^h>>>16)>>>0)/4294967296; };
const sm=k=>k*k*(3-2*k);
/* value noise, any x,y (not tiling); fbm = octaves of it. Both return 0..1 */
function vnoise(x,y,seed=1){ const xi=Math.floor(x), yi=Math.floor(y), u=sm(x-xi), v=sm(y-yi);
  const a=ph2(xi,yi,seed), b=ph2(xi+1,yi,seed), c=ph2(xi,yi+1,seed), d=ph2(xi+1,yi+1,seed); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
function fbm(x,y,oct=4,seed=1){ let s=0,a=.5,n=0; for(let o=0;o<oct;o++){ s+=a*vnoise(x,y,seed+o*17); n+=a; x*=2; y*=2; a*=.5; } return s/n; }
/* tiling field: size x size floats 0..1, octaves = [cellsX, cellsY, amplitude] (whole cells per tile, so it wraps) */
function tileField(size,octs,seed){ const f=new Float32Array(size*size); let norm=0;
  octs.forEach(([nx,ny,amp],o)=>{ norm+=amp; const r=rng(seed*7919+o*104729), L=new Float32Array(nx*ny); for(let i=0;i<L.length;i++) L[i]=r();
    for(let y=0;y<size;y++){ const gy=y/size*ny, y0=Math.floor(gy), v=sm(gy-y0), ya=(y0%ny)*nx, yb=((y0+1)%ny)*nx;
      for(let x=0;x<size;x++){ const gx=x/size*nx, x0=Math.floor(gx), u=sm(gx-x0), xa=x0%nx, xb=(x0+1)%nx;
        const a=L[ya+xa], b=L[ya+xb], c=L[yb+xa], d=L[yb+xb]; f[y*size+x]+=amp*(a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v); } } });
  for(let i=0;i<f.length;i++) f[i]/=norm; return f; }
/* colour helpers: '#rrggbb' -> [r,g,b]; mix two; css string with alpha */
const pRgb=h=>{ const n=parseInt(h.slice(1),16); return [n>>16,n>>8&255,n&255]; };
const pMix=(a,b,k)=>{ const A=pRgb(a),B=pRgb(b), f=i=>Math.round(A[i]+(B[i]-A[i])*sat(k)); return '#'+((1<<24)+(f(0)<<16)+(f(1)<<8)+f(2)).toString(16).slice(1); };
const pA=(h,a)=>{ const c=pRgb(h); return `rgba(${c[0]},${c[1]},${c[2]},${Math.round(sat(a)*1000)/1000})`; };
/* colour from keyframes around a cycle: pCycle(phase 0..1, [[phase,'#hex'],...]) wraps from the last key back to the first */
function pCycle(ph,ks){ ph=((ph%1)+1)%1; for(let i=0;i<ks.length;i++){ const a=ks[i], b=ks[(i+1)%ks.length], pa=a[0], pb=i+1<ks.length?b[0]:b[0]+1, p=ph<pa&&i+1===ks.length?ph+1:ph;
    if(p>=pa&&p<=pb) return pMix(a[1],b[1],sm((p-pa)/(pb-pa||1))); } return ks[0][1]; }

/* ---------- textures: 512x512, tiling, baked once from fixed seeds ---------- */
const TEX={}; const PBAKE={ms:0,done:false,pat:{}};
function texCanvas(size,fill){ const c=document.createElement('canvas'); c.width=c.height=size; const x=c.getContext('2d'), im=x.createImageData(size,size), d=im.data;
  for(let y=0,i=0;y<size;y++) for(let x_=0;x_<size;x_++,i+=4){ const p=fill(x_,y); d[i]=p[0]; d[i+1]=p[1]; d[i+2]=p[2]; d[i+3]=p[3]; } x.putImageData(im,0,0); return c; }
function texHalf(src,times){ let c=src; for(let k=0;k<times;k++){ const n=document.createElement('canvas'); n.width=c.width/2; n.height=c.height/2; const x=n.getContext('2d'); x.imageSmoothingQuality='high'; x.drawImage(c,0,0,n.width,n.height); c=n; } return c; }
function bakeTex(){ if(PBAKE.done) return; const t0=performance.now(), S=512;
  /* grain: paper tooth for painted areas. Stored as black with alpha = darkness, so a plain draw equals a multiply (much cheaper) */
  { const f=tileField(S,[[128,128,.3],[256,256,.7]],11); TEX.grain=texCanvas(S,(x,y)=>{ return [0,0,0,Math.round(255*.14*(1-f[y*S+x]))]; }); }
  /* cloud: white, alpha = soft-thresholded fbm; flatter underside from a second field */
  { const f=tileField(S,[[3,5,.5],[6,10,.26],[12,20,.14],[24,40,.07],[48,80,.03]],23);
    TEX.cloud=texCanvas(S,(x,y)=>{ const v=f[y*S+x], a=sm(sat((v-.50)/.22)); return [255,255,255,Math.round(255*a)]; }); }
  /* water: bright ripple crests, long across and thin up-down (ridged noise); alpha only */
  { const f=tileField(S,[[5,26,.55],[9,52,.3],[18,104,.15]],37), g=tileField(S,[[3,9,.6],[7,20,.4]],41);
    TEX.water=texCanvas(S,(x,y)=>{ const r=1-Math.abs(2*f[y*S+x]-1), a=Math.pow(sat((r-.72)/.28),1.6)*(.45+.55*g[y*S+x]); return [255,255,255,Math.round(255*a)]; });
    TEX.waterDk=texCanvas(S,(x,y)=>{ const r=1-Math.abs(2*f[((y+211)%S)*S+((x+97)%S)]-1), a=Math.pow(sat((.5-r)/.5),1.3)*.9; return [0,0,0,Math.round(255*a)]; });
    /* sparkle: sparse hard glints for the sun path */
    const h=tileField(S,[[40,90,.6],[80,180,.4]],53); TEX.spark=texCanvas(S,(x,y)=>{ const a=sat((h[y*S+x]-.66)/.08); return [255,255,255,Math.round(255*a)]; });
    TEX.water2=texHalf(TEX.water,2); TEX.waterDk2=texHalf(TEX.waterDk,2); TEX.spark2=texHalf(TEX.spark,1); }
  /* wood: 4 planks per tile running left-right; darkness map stored as black with alpha (two tones per plank, grain, rings, knots, seams, butt joints) */
  { const f=tileField(S,[[3,56,.5],[6,112,.3],[12,224,.2]],61), w=tileField(S,[[4,4,.6],[9,9,.4]],67), r=rng(71), PH=S/4;
    const pl=[...Array(4)].map(()=>({tone:.84+r()*.16,joint:Math.floor(r()*S),ph:r()*40,knot:[Math.floor(r()*S),PH*(.3+r()*.4),6+r()*5],has:0}));
    pl[1].has=1; pl[3].has=1;
    TEX.wood=texCanvas(S,(x,y)=>{ const k=Math.floor(y/PH), P_=pl[k], ly=y-k*PH; let dx=x-P_.knot[0]; if(dx>S/2) dx-=S; if(dx<-S/2) dx+=S; const dy=ly-P_.knot[1], kd=P_.has?Math.hypot(dx*.55,dy)/P_.knot[2]:99;
      const bend=kd<3.2?(1-kd/3.2)*(dy>0?1:-1)*9:0;
      let v=P_.tone*(.80+.20*f[(((y+Math.round(bend))%S+S)%S)*S+x]); v*=.95+.05*Math.sin((ly+bend+w[y*S+x]*14+P_.ph)*.5);
      if(kd<1) v*=.52+.3*kd+.08*Math.sin(kd*22); else if(kd<1.5) v*=.86;
      const e=Math.min(ly,PH-1-ly); if(e<2.5) v*=.38+.25*e; else if(e<5) v*=.92;                     // seam between planks
      let jx=Math.abs(x-P_.joint); jx=Math.min(jx,S-jx); if(jx<1.6) v*=.5; else if(jx<4) v*=.9;        // butt joint
      return [0,0,0,Math.round(255*(1-sat(v)))]; }); }
  PBAKE.ms=+(performance.now()-t0).toFixed(1); PBAKE.done=true; }
if(typeof PAINT_EP!=='undefined'&&PAINT_EP) bakeTex();
const pPat=(ctx,name)=>{ if(!PBAKE.done) bakeTex(); return PBAKE.pat[name]||(PBAKE.pat[name]=ctx.createPattern(TEX[name],'repeat')); };
/* visible world rectangle for the current transform (so fills can overscan exactly as far as needed) */
function pView(ctx,pad=4){ const m=ctx.getTransform(), W=ctx.canvas.width, H=ctx.canvas.height; return {x0:(0-m.e)/m.a-pad,x1:(W-m.e)/m.a+pad,y0:(0-m.f)/m.d-pad,y1:(H-m.f)/m.d+pad}; }
const pShape=(ctx,sh)=>{ if(Array.isArray(sh)){ ctx.beginPath(); ctx.rect(sh[0],sh[1],sh[2],sh[3]); ctx.clip(); } else ctx.clip(sh); };

const PNT={
  /* run fn in frame space (0..1080 x 0..1920) regardless of the current camera */
  frame(ctx,fn){ ctx.save(); const s=ctx.canvas.width/1080; ctx.setTransform(s,0,0,s,0,0); fn(ctx); ctx.restore(); },
  /* sky: vertical gradient over the whole view from y0 (top colour) to y1 (bot colour, normally the horizon); optional sun [x,y,r,col,halo 0..1] */
  sky(ctx,{top,mid,bot,y0=0,y1=1100,midAt=.55,sun=null,to=null}){ const v=pView(ctx), g=ctx.createLinearGradient(0,y0,0,y1);   // to = stop filling at this y (when a sea or ground covers the rest)
    g.addColorStop(0,top); if(mid) g.addColorStop(midAt,mid); g.addColorStop(1,bot); ctx.fillStyle=g; ctx.fillRect(v.x0,v.y0,v.x1-v.x0,(to==null?v.y1:Math.min(v.y1,to))-v.y0);
    if(sun) PNT.sun(ctx,sun[0],sun[1],sun[2],sun[3],sun[4]==null?1:sun[4]); },
  /* sun or moon: wide halo + tight glow + disc */
  sun(ctx,x,y,r,col='#fff6d8',halo=1,disc=1){ if(halo>0){ PNT.glow(ctx,x,y,r*10,col,.5*halo); PNT.glow(ctx,x,y,r*3.6,'#ffffff',.85*halo); }
    if(disc>0){ ctx.save(); ctx.globalAlpha=disc; ctx.fillStyle=pMix(col,'#ffffff',.8); ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); } },
  glow(ctx,x,y,r,col,a=.5,mode='source-over'){ if(a<=0||r<=0) return; ctx.save(); ctx.globalCompositeOperation=mode; const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,pA(col,a)); g.addColorStop(.35,pA(col,a*.45)); g.addColorStop(1,pA(col,0)); ctx.fillStyle=g; ctx.fillRect(x-r,y-r,2*r,2*r); ctx.restore(); },
  /* stars: n seeded points above y1, slow twinkle; a = overall alpha */
  stars(ctx,t,{n=90,a=1,seed=5,y0=0,y1=1000,x0=-200,x1=1280}={}){ if(a<=0) return; const r=rng(seed*977); ctx.save(); ctx.fillStyle='#fff';
    for(let i=0;i<n;i++){ const x=x0+r()*(x1-x0), y=y0+Math.pow(r(),1.4)*(y1-y0), s=.9+r()*1.9, tw=.55+.45*Math.sin(t*(1.3+r()*2.2)+r()*6.28), fade=1-sat((y-y0)/(y1-y0))*.75;
      ctx.globalAlpha=sat(a*tw*fade); ctx.beginPath(); ctx.arc(x,y,s,0,7); ctx.fill(); } ctx.restore(); },
  /* clouds: a band of the cloud texture centred on y=alt, h tall, soft top and bottom, drifting. col tints it; sc = texture scale */
  clouds(ctx,t,{alt=420,h=420,drift=14,alpha=.8,sc=2.6,col='#ffffff',seed=0,flat=.55}={}){ if(alpha<=0) return; const v=pView(ctx), n=Math.max(6,Math.round(h/30)), sh=h/n; ctx.save();
    const pat=pPat(ctx,col==='#ffffff'?'cloud':PNT.tint('cloud',col)); ctx.fillStyle=pat;
    for(let i=0;i<n;i++){ const k=(i+.5)/n, a=alpha*Math.pow(Math.sin(Math.PI*k),.8); ctx.globalAlpha=sat(a); const y=alt-h/2+i*sh;
      pat.setTransform(new DOMMatrix([sc,0,0,sc*flat,t*drift+seed*173,alt-h/2+seed*91])); ctx.fillRect(v.x0,y,v.x1-v.x0,sh+.6); }
    ctx.restore(); },
  /* a tinted copy of a white alpha texture, cached by name+colour (the key is the full input) */
  tint(name,col){ const key=name+col; if(!TEX[key]){ if(!PBAKE.done) bakeTex(); const c=document.createElement('canvas'); c.width=TEX[name].width; c.height=TEX[name].height; const x=c.getContext('2d');
      x.drawImage(TEX[name],0,0); x.globalCompositeOperation='source-in'; x.fillStyle=col; x.fillRect(0,0,c.width,c.height); TEX[key]=c; } return key; },
  /* sea: from the horizon down. far/near colours, ripple crests (rip) and troughs (dk) in perspective strips, optional sun path
     glint [x, halfWidth at the bottom, colour, alpha]. swell = slow heave in px, speed = ripple drift. to = stop drawing below this y (when a deck or shore covers the rest). */
  sea(ctx,t,{horizon=1000,bottom=2100,far='#9fd0e8',near='#1f6f9a',mid=null,rip=.5,dk=.3,ripCol='#ffffff',glint=null,swell=6,speed=10,n=110,seed=0,to=null}={}){ const v=pView(ctx), x0=v.x0, w=v.x1-v.x0, H=bottom-horizon;
    const g=ctx.createLinearGradient(0,horizon,0,bottom); g.addColorStop(0,far); if(mid) g.addColorStop(.3,mid); g.addColorStop(1,near); const yEnd=to==null?v.y1:Math.min(v.y1,to); ctx.fillStyle=g; ctx.fillRect(x0,horizon,w,(to==null?Math.max(v.y1,bottom):yEnd)-horizon);
    ctx.save(); const z=ctx.getTransform().a/(ctx.canvas.width/1080);   // camera zoom, to pick the texture size
    const lite=pPat(ctx,ripCol==='#ffffff'?'water':PNT.tint('water',ripCol)), lite2=pPat(ctx,ripCol==='#ffffff'?'water2':PNT.tint('water2',ripCol)), dark=pPat(ctx,'waterDk'), dark2=pPat(ctx,'waterDk2'), sp=pPat(ctx,'spark'), sp2=pPat(ctx,'spark2');
    for(let i=0;i<n;i++){ const k0=i/n, k1=(i+1)/n, y0=horizon+H*k0*k0, y1=horizon+H*k1*k1, d=(y0+y1)/2-horizon, p=d/H; if(y0>yEnd) break; if(y1<v.y0) continue;   // strips get taller towards the viewer
      const sx=.10+2.3*p, sy=sx*.42, small=sx*z<.55, heave=Math.sin(t*.7+i*.21+seed)*swell*p, ty=y0+heave+ph2(i,seed,3)*512*sy, tx=t*speed*sx*(i%2?1:-.6)+ph2(i,seed,9)*512*sx;
      const m=small?new DOMMatrix([sx*4,0,0,sy*4,tx,ty]):new DOMMatrix([sx,0,0,sy,tx,ty]), fade=sat(p*7);                // ripples fade out at the horizon
      if(dk>0){ const q=small?dark2:dark; q.setTransform(m); ctx.fillStyle=q; ctx.globalAlpha=sat(dk*fade*(.5+.5*p)); ctx.fillRect(x0,y0,w,y1-y0+.5); }
      if(rip>0){ const q=small?lite2:lite; q.setTransform(m); ctx.fillStyle=q; ctx.globalAlpha=sat(rip*fade*(.35+.65*p)); ctx.fillRect(x0,y0,w,y1-y0+.5); }
      if(glint&&glint[3]>0){ const hw=glint[1]*(.12+.88*p), two=sx*z<1.1, q=two?sp2:sp; q.setTransform(two?new DOMMatrix([sx*2,0,0,sy*2,-tx*1.7,ty*1.3]):new DOMMatrix([sx,0,0,sy,-tx*1.7,ty*1.3]));
        const sw=hw*2/7, sheen=pA(glint[2],1);
        for(let j=0;j<7;j++){ const b=Math.exp(-Math.pow((j-3)/1.6,2)), xs=glint[0]-hw+j*sw;                  // 7 slices, bell-shaped across the sun path
          ctx.fillStyle=sheen; ctx.globalAlpha=sat(glint[3]*.16*b*(1-p*.6)); ctx.fillRect(xs,y0,sw+.5,y1-y0+.5);
          ctx.fillStyle=q; ctx.globalAlpha=sat(glint[3]*b); ctx.fillRect(xs,y0,sw+.5,y1-y0+.5); }
        } }
    ctx.restore(); },
  /* wood: shape = [x,y,w,h] or a Path2D. tone colour, plank texture (sc = scale, rot = plank direction in degrees, ox/oy offset),
     light = [x0,y0,x1,y1,strength] gradient from lit to shaded */
  wood(ctx,shape,{tone='#b98a56',sc=1,rot=0,ox=0,oy=0,k=1,light=null}={}){ ctx.save(); pShape(ctx,shape); const v=pView(ctx,40);
    if(light){ const g=ctx.createLinearGradient(light[0],light[1],light[2],light[3]), q=light[4]==null?.35:light[4];           // lit side -> tone -> shaded side, in one fill
      g.addColorStop(0,pMix(tone,'#fff4d6',q*.5)); g.addColorStop(.5,tone); g.addColorStop(1,pMix(tone,'#140a1e',q*.75)); ctx.fillStyle=g; } else ctx.fillStyle=tone;
    ctx.fillRect(v.x0,v.y0,v.x1-v.x0,v.y1-v.y0);
    const pat=pPat(ctx,'wood'), a=rad(rot), c=Math.cos(a)*sc, s=Math.sin(a)*sc; pat.setTransform(new DOMMatrix([c,s,-s,c,ox,oy]));
    ctx.globalAlpha=k; ctx.fillStyle=pat; ctx.fillRect(v.x0,v.y0,v.x1-v.x0,v.y1-v.y0);
    ctx.restore(); },
  /* light shafts from (x,y): n beams fanned over `spread` degrees around `angle` (90 = straight down), with drifting dust motes */
  shafts(ctx,t,{x=540,y=0,angle=90,spread=26,n=5,len=1500,alpha=.22,col='#fff1c8',motes=40,seed=3,w0=30}={}){ if(alpha<=0) return; const r=rng(seed*613); ctx.save(); ctx.globalCompositeOperation='screen';
    for(let i=0;i<n;i++){ const a=rad(angle-spread/2+spread*(n>1?i/(n-1):.5)+(r()-.5)*spread/n*.6), wd=rad(1.2+r()*2.6), aa=alpha*(.55+.45*r())*(.85+.15*Math.sin(t*.6+i*1.7));
      const g=ctx.createLinearGradient(x,y,x+Math.cos(a)*len,y+Math.sin(a)*len); g.addColorStop(0,pA(col,aa)); g.addColorStop(.6,pA(col,aa*.45)); g.addColorStop(1,pA(col,0)); ctx.fillStyle=g;
      const px=-Math.sin(a)*w0*.5, py=Math.cos(a)*w0*.5; ctx.beginPath(); ctx.moveTo(x-px,y-py); ctx.lineTo(x+px,y+py); ctx.lineTo(x+Math.cos(a+wd)*len,y+Math.sin(a+wd)*len); ctx.lineTo(x+Math.cos(a-wd)*len,y+Math.sin(a-wd)*len); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle=col; for(let i=0;i<motes;i++){ const a=rad(angle+(r()-.5)*spread), d0=r(), sp=.02+r()*.04, d=((d0+t*sp)%1)*len*.9+40, wob=Math.sin(t*(.5+r())+r()*6.28)*18, s=1.2+r()*2.4, tw=.5+.5*Math.sin(t*(1+r()*2)+r()*6.28);
      ctx.globalAlpha=sat(alpha*2.6*tw*Math.sin(Math.PI*((d0+t*sp)%1))); ctx.beginPath(); ctx.arc(x+Math.cos(a)*d-Math.sin(a)*wob,y+Math.sin(a)*d+Math.cos(a)*wob,s,0,7); ctx.fill(); }
    ctx.restore(); },
  /* depth haze: colour fading in from y0 (clear) to y1 (alpha a); drawn only between the two. y1 above y0 hazes upward (towards a horizon) */
  haze(ctx,y0,y1,col,a=.5){ if(a<=0) return; const v=pView(ctx), g=ctx.createLinearGradient(0,y0,0,y1); g.addColorStop(0,pA(col,0)); g.addColorStop(1,pA(col,a)); ctx.fillStyle=g;
    ctx.fillRect(v.x0,Math.min(y0,y1),v.x1-v.x0,Math.abs(y1-y0)); },
  /* soft band of colour centred on y (horizon glow, mist) */
  band(ctx,y,h,col,a=.5,mode='source-over'){ if(a<=0) return; const v=pView(ctx), g=ctx.createLinearGradient(0,y-h,0,y+h); g.addColorStop(0,pA(col,0)); g.addColorStop(.5,pA(col,a)); g.addColorStop(1,pA(col,0));
    ctx.save(); ctx.globalCompositeOperation=mode; ctx.fillStyle=g; ctx.fillRect(v.x0,y-h,v.x1-v.x0,2*h); ctx.restore(); },
  /* soft shadow blob on a painted surface (contact shadow for a figure or prop standing on it) */
  shadow(ctx,x,y,rx,ry,a=.35,col='#1a1020'){ ctx.save(); ctx.translate(x,y); ctx.scale(1,ry/rx); const g=ctx.createRadialGradient(0,0,0,0,0,rx); g.addColorStop(0,pA(col,a)); g.addColorStop(.6,pA(col,a*.6)); g.addColorStop(1,pA(col,0));
    ctx.fillStyle=g; ctx.fillRect(-rx,-rx,2*rx,2*rx); ctx.restore(); },
  /* frame-space finishing for the painted layer only: vignette, colour grade [col,alpha,mode], paper tooth */
  vignette(ctx,a=.4,col='#1a0e06'){ PNT.frame(ctx,c=>{ const g=c.createRadialGradient(540,864,1056*.55,540,864,1056*1.25); g.addColorStop(0,pA(col,0)); g.addColorStop(1,pA(col,a)); c.fillStyle=g; c.fillRect(0,0,1080,1920); }); },
  post(ctx,{grade=null,paper=0}={}){ PNT.frame(ctx,c=>{ if(grade){ c.globalCompositeOperation=grade[2]||'multiply'; c.fillStyle=pA(grade[0],grade[1]); c.fillRect(0,0,1080,1920); }
      if(paper>0){ c.globalCompositeOperation='source-over'; c.globalAlpha=paper; c.fillStyle=pPat(c,'grain'); c.fillRect(0,0,1080,1920); } }); },
};
