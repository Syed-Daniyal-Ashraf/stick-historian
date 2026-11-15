/* ============================== Ice to Calcutta: shots. STAGE B PAINT TEST ONLY: one shot (storyboard cut 5b, the doldrums day cycle),
   slowed to 3 days in 9 s so the look can be judged. Stage C replaces this file; paintDoldrums()/dayLight()/lit()/tally() in props.js stay. */
const COVER_T=0.8;
const under=col=>`<rect x="-900" y="-900" width="2900" height="4600" fill="${col}"/>`;
const CUT_EP={1:[3,6]}; const CUT_HOLD_EP=[];
function sh1(t){ const u=t-S(1), ph=.06+u/3, L=dayLight(ph), day=Math.floor(ph+.94);   // one day every 3 s; a tally mark lands at each sunrise
  const P=part(1,u), c=[{x:540,y:960,z:lerp(1,1.05,seg(u,0,3,E.lin))},{x:620,y:860,z:1.4},{x:500,y:930,z:1.1}][P.i];
  const X=650, Y=DECK+24, s=1.3, crate=[X-120,Y-97*s,196,97*s];
  paint(ctx=>paintDoldrums(ctx,t,L,c,{crate,fig:[X,Y]}));
  const fan=Math.sin(u*9), hot=full({...TP.sit,lean:-6,tilt:10+fan*2,hF:[58+fan*16,-214+Math.abs(fan)*8],hB:[40,-96],handF:'flat',expr:'tired',look:[3,-2]}),
        sleep=full({...TP.sit,lean:-16,tilt:-22,hF:[62,-104],hB:[40,-96],handF:'open',expr:'bored',look:[0,4]});
  const pose=tween(u%3,1.38,hot,sleep,.5,E.io), pose2=u%3>2.6?tween(u%3,2.72,sleep,hot,.26):pose;
  const kT=sat(((ph+.94)%1)/.08);
  const figs=`<rect x="${N(crate[0])}" y="${N(crate[1])}" width="${crate[2]}" height="${N(crate[3])}" fill="none" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M${N(crate[0])} ${N(crate[1]+30)}h${crate[2]}M${N(crate[0])} ${N(crate[1]+62)}h${crate[2]}" stroke="${INK}" stroke-width="3.5" opacity=".7"/>`
    +toon('sailor',X,Y,s,1,pose2,t,3);
  const ship=`<path d="M150 -400V${DECK+52}M234 -400V${DECK+52}" stroke="${INK}" stroke-width="6"/><path d="M-600 ${RAIL}H1700M-600 ${RAIL+24}H1700" stroke="${INK}" stroke-width="5"/><path d="M-600 ${DECK}H1700" stroke="${INK}" stroke-width="5" opacity=".8"/>`
    +`<path d="M234 250L900 ${RAIL}M150 330L-200 ${RAIL}" stroke="${INK}" stroke-width="4" opacity=".75" fill="none"/>`+tally(192,560,Math.min(day,10),kT);
  return finish(cam(c,lit(ship,L.c.fig,.55)+lit(figs,L.c.fig,.8)),t,{paper:.2,vig:.5});
}
const SEQ=[1].map(n=>({from:n,r:[sh1][n-1],out:'cut'}));
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });
function overlays(t){ return mySubs(t); }
