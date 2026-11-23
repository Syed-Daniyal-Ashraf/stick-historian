/* ============================== props: Ice to Calcutta (ic/) - costumes, props and painted sets
   STAGE B TEST BUILD: only what the painted-layer test shot (storyboard cut 5b, the doldrums) needs. Stage C adds the rest
   (iceBlock, ship, holdCutaway, cutter, horse, slate, iceHouse, and the other painters in brief section 7). */
Object.assign(TC,{
  sailor:{skin:'#e3b088',hair:'#4a3020',top:'#f1ece0',topDk:'#d4cdbd',pants:'#3c4a66',shoe:'#2a1e16',cap:'flat',capC:'#2a3550',mus:'thin',headS:1.16,build:.1},
});

/* ---- the sky's day: k = 0..1 through one day, midnight at 0 and 1, noon at .5.
   Light follows one smooth sine per day, so the time-lapse never jumps from day to night between two frames: at ~2 days a
   second that would be a full-screen flash (WCAG 2.3.1 allows at most 3 a second, and smooth is safer than sharp).
   The sun sets into the sea (it is painted under the sea), so no separate sunrise/sunset switch is needed. ---- */
const SKY_DAY  ={top:'#2f74b8',mid:'#93c7e6',bot:'#f1ecd8'};
const SKY_DUSK ={top:'#3a4a86',mid:'#de8c62',bot:'#f4c47e'};
const SKY_NIGHT={top:'#1a2b5a',mid:'#33508a',bot:'#5674a6'};     // deep blue, never black: keeps the swing gentle
function skyAt(k){
  const mixC=(A,B,f)=>({top:mixHex(A.top,B.top,f),mid:mixHex(A.mid,B.mid,f),bot:mixHex(A.bot,B.bot,f)});
  const L=.5-.5*Math.cos(2*Math.PI*k);                                         // 0 at midnight, 1 at noon
  const col=L<.5?mixC(SKY_NIGHT,SKY_DUSK,smoothstep(0,.5,L)):mixC(SKY_DUSK,SKY_DAY,smoothstep(.5,1,L));
  const a=(k-.08)/.84, el=Math.sin(Math.PI*a), sun=[lerp(-90,1170,a),800-600*el];   // at night it sits below the horizon, hidden by the sea
  return {...col,sun,vis:smoothstep(0,.25,el),light:lerp(.45,1,L),night:1-smoothstep(.1,.42,L)};   // vis: everything the sun casts fades with it
}

/* ---- painted set: open sea from the deck. h = horizon (screen y). ---- */
function paintSeaDeck(ctx,c,t,S,{h=700,deckY=1050,mastX=800}={}){
  PNT.sky(ctx,{top:S.top,mid:S.mid,bot:S.bot,midAt:.6,y1:h+40,sun:[S.sun[0],S.sun[1],46,'#fff6dc'],halo:(.5+.3*S.light)*S.vis});
  PNT.stars(ctx,{alpha:S.night,y1:h-60,t,seed:11});
  PNT.clouds(ctx,c,t,{alt:h-150,h:150,alpha:.55*S.light+.12,drift:22,scale:1.5,tint:['#2a3560',S.night*.6]});
  PNT.clouds(ctx,c,t,{alt:h-60,h:90,alpha:.4*S.light+.1,drift:40,scale:1.1,seed:3,tint:['#2a3560',S.night*.6]});
  const sea=mixHex('#0c3f63','#06152e',S.night), sh=mixHex('#5f9fc0','#1b3358',S.night), hz=mixHex(S.bot,'#ffffff',.25);
  PNT.sea(ctx,c,t,{horizon:h,bottom:deckY-60,deep:sea,shallow:sh,haze:hz,swell:.12,speed:.35,glint:[S.sun[0],.9*S.light*S.vis]});
  PNT.haze(ctx,h+120,h-40,hz,.0);
  // the ship, in world space (follows the camera): bulwark, deck, mast
  ctx.save(); camCtx(ctx,c);
  const dl=lerp(.35,-.1,S.night);
  const night=S.night*.7;
  PNT.deck(ctx,deckY,deckY+880,{x0:-120,x1:1200,tone:mixHex('#c08a50','#4a4868',night),rows:13,grow:3.2,light:.3*S.light,shade:.45});
  // bulwark (the ship's side wall) with a rail on top
  PNT.wood(ctx,[-120,deckY-64,1320,64],{tone:mixHex('#7a4a28','#2e2c46',night),light:dl*.6,scale:.5});
  PNT.wood(ctx,[-120,deckY-82,1320,22],{tone:mixHex('#5a361e','#22203a',night),light:.3,scale:.35});
  PNT.wood(ctx,[mastX-42,-400,84,deckY-60+400],{tone:mixHex('#8a5a32','#34304c',night),light:0,scale:.55,rot:90});
  // mast shading: lit side follows the sun
  const side=clamp((S.sun[0]-mastX)/200,-1,1)*S.vis, g=ctx.createLinearGradient(mastX-36,0,mastX+36,0);
  g.addColorStop(0,`rgba(0,0,0,${N(.06+.34*sat(side))})`); g.addColorStop(.5,'rgba(0,0,0,0)'); g.addColorStop(1,`rgba(0,0,0,${N(.06+.34*sat(-side))})`);
  ctx.fillStyle=g; ctx.fillRect(mastX-42,-400,84,deckY-60+400);
  // the mast's shadow across the deck, swinging with the sun
  if(S.vis>.01){ const sx=(mastX-S.sun[0])*.9; ctx.fillStyle=`rgba(20,10,30,${.22*S.light*S.vis})`; ctx.beginPath(); ctx.moveTo(mastX-40,deckY+4); ctx.lineTo(mastX+40,deckY+4); ctx.lineTo(mastX+40+sx,deckY+900); ctx.lineTo(mastX-40+sx,deckY+900); ctx.fill(); }
  ctx.restore();
  if(S.vis>.01) PNT.glow(ctx,S.sun[0],S.sun[1],260,'#fff1c4',.22*S.light*S.vis);
}
/* tally marks scratched on the mast: n marks in groups of five (fifth one across) */
function tallies(n,x,y,{col='#f6eed8',gap=15,len=64,k=1}={}){ let g='';
  for(let i=0;i<n;i++){ const grp=Math.floor(i/5), j=i%5, gx=x+grp*0, gy=y+grp*88, a=i===n-1?k:1; if(a<=0) continue;
    if(j<4) g+=`<path d="M${N(gx+j*gap)} ${N(gy)}l${N(2)} ${N(len*a)}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`;
    else g+=`<path d="M${N(gx-6)} ${N(gy+len*.75)}L${N(gx-6+(gap*3+12)*a)} ${N(gy+len*.75-30*a)}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`; }
  return g; }
