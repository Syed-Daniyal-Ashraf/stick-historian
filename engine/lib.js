/* ============================== shared episode helpers (engine library) */
const idle=(t,seed)=>({hy:Math.sin(t*2.1+seed)*1.4});
const add=(a,b)=>{ const o={...a}; for(const k in b){ o[k]=typeof b[k]==='number'&&typeof a[k]==='number'?a[k]+b[k]:b[k]; } return o; };
const G=1560;
/* world position of a figure's head centre (same maths as the rig) */
function headPos(x,y,s,face,p){ const lean=p.lean||0, hip=[p.hx||0,-150+(p.hy||0)], U=[Math.sin(rad(lean)),-Math.cos(rad(lean))], neck=[hip[0]+U[0]*112,hip[1]+U[1]*112], ht=lean+(p.tilt||0), HU=[Math.sin(rad(ht)),-Math.cos(rad(ht))];
  const hc=[neck[0]+HU[0]*38, neck[1]+HU[1]*38-(p.shrug||0)*.4]; return [x+hc[0]*s*face, y+hc[1]*s]; }
const toLocal=(ox,oy,s,face,wx,wy)=>[(wx-ox)/s*face,(wy-oy)/s];
function sweat(x,y,k,u){ if(k<=0) return ''; const b=Math.sin(u*5)*3;
  return `<g transform="translate(${N(x)} ${N(y+b)}) scale(${N(k*100)/100})"><path d="M0 -18Q10 -2 0 8Q-10 -2 0 -18Z" fill="#bfe6ff" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/><path d="M-3 -2Q-4 3 0 5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`; }
/* running: the planted-foot walk with a forward lean and pumping arms */
function runner(u,x0,x1,u0,u1,step=120,s=1.5){ const w=walker(u,x0,x1,u0,u1,step,s); const sw=clamp((w.p.hF[0]-8)/24,-1,1);
  const p=w.moving?{...w.p,lean:11,hB:[-24-26*sw,-196],hF:[24+26*sw,-196]}:{...w.p}; return {x:w.x,moving:w.moving,p}; }
const wave=(u,ph=0,amp=16)=>[18+Math.sin(u*11+ph)*amp,-340];
function pill(txt,x,y,fs,bg,fg='#fffaf0',rot=-2,op=1){ const w=textW(txt,fs)+52; return `<g transform="translate(${x} ${y}) rotate(${rot})" opacity="${N(op*100)/100}"><rect x="${N(-w/2)}" y="${N(-fs*.78)}" width="${N(w)}" height="${N(fs*1.5)}" rx="12" fill="${bg}" stroke="${OUT}" stroke-width="6"/><text y="${N(fs*.36)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs}" letter-spacing="4" fill="${fg}">${esc(txt)}</text></g>`; }
function bigTitle(txt,x,y,size,fill,extra=''){ const at=`x="${x}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${size}" letter-spacing="4" stroke-linejoin="round" text-rendering="geometricPrecision"`;
  return `<g ${extra}><text ${at} y="${N(y+size*.075)}" fill="${OUT}" stroke="${OUT}" stroke-width="${N(size*.2)}">${txt}</text><text ${at} y="${y}" fill="${fill}" stroke="${OUT}" stroke-width="${N(size*.16)}" paint-order="stroke fill">${txt}</text></g>`; }
/* bat wings (rig feature c.wings): two membranes hinged at the shoulder, flap angle in degrees */
function wingSvg(c,sh,lean,flap){
  const P=[[0,0],[-26,-62],[-84,-126],[-158,-140],[-214,-100],[-188,-62],[-150,-80],[-132,-30],[-96,-52],[-72,2],[-40,-12],[-6,26]];
  const one=(ang,col)=>{ const d='M'+P.map(p=>N(p[0])+' '+N(p[1])).join('L')+'Z', bones=`M0 0L-84 -126M0 0L-158 -140M0 0L-214 -100M0 0L-132 -30M0 0L-72 2`;
    return `<g transform="translate(${N(sh[0])} ${N(sh[1])}) rotate(${N(ang+lean*.5)})"><path d="${d}" fill="${col}" stroke="${OUT}" stroke-width="4" stroke-linejoin="round"/><path d="${bones}" stroke="${shade(col,.7)}" stroke-width="3" fill="none"/></g>`; };
  return one(flap*1.15+10,shade(c.wings,.78))+one(flap,c.wings); }

/* ============================== cinematic kit (namespaced so episode code can never collide with it) */
const KIT={
  /* motion */
  shake:(u,amp=8,f=23,seed=0)=>[Math.sin(u*f+seed)*amp*Math.sin(u*f*.37+1), Math.cos(u*f*1.13+seed)*amp*.6],
  pop:(u,t0,d=.3)=>E.back(seg(u,t0,t0+d)),
  // wind-up then go: dips to -back before rising to 1 with overshoot
  antic:(u,t0,t1,back=.18)=>{ const k=seg(u,t0,t1); if(k<=0) return 0; if(k<.3) return -back*Math.sin(k/.3*Math.PI/2); return -back+(1+back)*E.back((k-.3)/.7); },
  hold:(u,keysArr)=>keys(u,keysArr),
  /* camera: Dutch tilt + slight scale so corners never show */
  dutch:(svg,deg)=>deg?`<g transform="rotate(${N(deg)} 540 960) translate(540 960) scale(${N((1+Math.abs(deg)*.025)*1000)/1000}) translate(-540 -960)">${svg}</g>`:svg,
  jolt:(svg,v)=>`<g transform="translate(${N(v[0])} ${N(v[1])})">${svg}</g>`,
  freeze:(k)=>k>0?`<rect width="1080" height="1920" fill="#fff" opacity="${N((1-k)*.8*100)/100}"/>`:'',
  /* light */
  screen:(svg,op=1)=>`<g style="mix-blend-mode:screen" opacity="${op}">${svg}</g>`,
  multiply:(svg,op=1)=>`<g style="mix-blend-mode:multiply" opacity="${op}">${svg}</g>`,
  grade:(col,op)=>`<rect width="1080" height="1920" fill="${col}" opacity="${op}" style="mix-blend-mode:multiply"/>`,
  vig:(o=1)=>`<rect width="1080" height="1920" fill="url(#gVig)" opacity="${o}"/>`,
  ash:(n,u,col,seed,box,slant=.3,sz=1)=>{ let g=''; for(let i=0;i<n;i++){ const x=box[0]+((rnd(i*3+seed)*box[2]+u*40*slant*(1+rnd(i)))%box[2]), y=box[1]+((rnd(i*7+seed)*box[3]+u*90*(.5+rnd(i+9)))%box[3]), r=(1.4+rnd(i+5)*3.2)*sz;
    g+=`<circle cx="${N(x)}" cy="${N(y)}" r="${N(r)}" fill="${col}" opacity="${N((.3+rnd(i+2)*.6)*100)/100}"/>`; } return g; },
  /* poses: base pose objects, spread and override per shot */
  P:{
    stand:{lean:0,tilt:0,hB:[-6,-132],hF:[8,-132],expr:'neutral'},
    sitRead:{lean:-4,tilt:16,hy:44,fF:[74,-4],fB:[52,0],hB:[66,-168],hF:[96,-172],expr:'absorbed',look:[3,4]},
    point:{lean:8,tilt:-6,hB:[-10,-140],hF:[150,-280],expr:'awe',look:[4,-3]},
    recoil:{lean:-14,tilt:-14,hB:[40,-250],hF:[70,-260],expr:'shock',mouth:.8,look:[3,-1]},
    shrug:{lean:-2,tilt:8,hB:[-60,-210],hF:[70,-214],expr:'calm',look:[2,0],shrug:8},
    plead:{lean:12,tilt:14,hB:[-40,-150],hF:[140,-196],expr:'plead',look:[3,-2]},
    pull:{lean:20,tilt:-8,hB:[-140,-196],hF:[70,-250],expr:'determined',look:[-4,0]},
    fearHands:{lean:-10,tilt:-18,hB:[30,-250],hF:[44,-240],expr:'fear',look:[4,-4]},
    scold:{lean:14,tilt:6,hB:[-20,-160],hF:[150,-250],expr:'scold',look:[3,0]},
    write:{lean:18,tilt:16,hy:44,fF:[74,-4],fB:[52,0],hB:[70,-140],hF:[110,-150],expr:'calm',look:[3,4]},
  },
};
