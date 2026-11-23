/* ============================== shots: Ice to Calcutta (ic/) - STAGE B TEST BUILD
   One shot only: storyboard cut 5b (the doldrums), used to test the painted layer: sky + stars + clouds + sea + wood + haze
   painted on the canvas, the stick rig and the tally marks in SVG on top. Stage C replaces this file with the full film.
   Days pass at DAY_S seconds each. The brief's ten days in ~2.2 s (4.5 a second) measured as a full-screen strobe: at .46 s a day
   every 15 fps frame changed the whole picture (motion.js flagged each one as a hard cut), and anything over 3 light/dark swings
   a second breaks WCAG 2.3.1. One smooth day a second is the test speed; Stage C decides how to show ten days (brief section 9 results). */
const COVER_T=1.0;   // noon
const DAY_S=1.0, DAY0=0;             // seconds per day (see the note above); the film opens at noon (k=.5)
function sh1(t){ const u=t-S(1);
  const days=(u-DAY0)/DAY_S+.5, k=days%1, done=Math.max(0,Math.floor(days+.25)), Sk=skyAt(k);   // one tally per sunset (k=.75)
  const c={x:540+8*u,y:960,z:1+.035*u};                 // slow push-in, a little drift: both layers use this camera
  paint(ctx=>paintSeaDeck(ctx,c,t,Sk));
  // the sailor: slumps further every day, eyes follow the sun, sweats in daylight
  const slump=sat(done/7), sunL=clamp((Sk.sun[0]-610)/90,-6,6)*Sk.vis;
  const pose=full({lean:-4-6*slump,hy:8*slump,tilt:-6-4*slump,hF:[34,-150+10*slump],hB:[-30,-118],handF:'open',
    expr:slump>.55?'tired':'neutral',look:[sunL,lerp(2,-4,Sk.vis)],shrug:2*slump});
  const lightM=`${N(.55+.45*Sk.light)} 0 0 0 ${N(-.02*Sk.night)} 0 ${N(.55+.45*Sk.light)} 0 0 ${N(.01*Sk.night)} 0 0 ${N(.62+.38*Sk.light)} 0 ${N(.05*Sk.night)} 0 0 0 1 0`;
  let g=`<filter id="icLight"><feColorMatrix type="matrix" values="${lightM}"/></filter>`;
  g+=`<ellipse cx="610" cy="1136" rx="120" ry="16" fill="#000" opacity="${op(.25*Sk.light+.08)}"/>`;
  g+=`<g filter="url(#icLight)">${toon('sailor',610,1130,1.75,1,pose,t,3)}`;
  if(Sk.light>.8){ const dp=(u*1.7)%1; g+=`<path d="M${N(570)} ${N(500+dp*60)}q-6 12 0 16q6 -4 0 -16z" fill="#bfe3f2" stroke="${INK}" stroke-width="2" opacity="${op(1-dp)}"/>`; }
  g+=`</g>`;
  // tally marks on the mast, one per finished day (the newest one is scratched in over .15 s)
  g+=tallies(done,768,430,{k:sat((((days-.75)%1)+1)%1/.3)});         // the newest one is scratched in just after sunset
  return finish(cam(c,g),t,{boil:2.2,paper:.22,vig:.6});
}
const SEQ=[{from:1,r:sh1,out:'cut'}];
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
