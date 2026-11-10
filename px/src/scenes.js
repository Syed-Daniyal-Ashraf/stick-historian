/* ============================== History Has Receipts #3: Pliny and Vesuvius, AD 79
   Events follow Pliny the Younger, Letters 6.16 and 6.20 (to Tacitus). Faces, poses, rooms and the red cloak are illustration. */
const CAM0={x:540,y:960,z:1};
const NAVY='#16223A', CRIM='#EF4C5A', GOLD='#F3B544', TEAL='#22B8AC', IVORY='#F7EBD4', INK='#1d1712';
const fitSize=(txt,size,maxW)=>Math.min(size,size*maxW/textW(txt,size));
const fctx=document.createElement('canvas').getContext('2d');
const fellW=(txt,size)=>{ fctx.font=`italic ${size}px Fell, Georgia, serif`; return fctx.measureText(txt).width; };
const handDot=(h,col)=>`<circle cx="${N(h[0])}" cy="${N(h[1])}" r="9.5" fill="${col}" stroke="${OUT}" stroke-width="4"/>`;
const inCam=(cam,svg)=>`<g transform="translate(540 960) scale(${N(cam.z*1000)/1000}) translate(${N(-cam.x)} ${N(-cam.y)})">${svg}</g>`;
function talkAt(n,spk,t){ for(const l of SHOTS[n-1].lines){ if(l.spk===spk&&t>=l.v0&&t<l.v0+l.vd){ const i=Math.floor((t-l.v0)*33); return l.env[Math.min(i,l.env.length-1)]||0; } } return 0; }
const jolts=(u,times,amp=14)=>{ let v=[0,0]; for(const t0 of times){ const k=seg(u,t0,t0+.45); if(k>0&&k<1){ const s=KIT.shake(u,amp*(1-k),31,t0); v=[v[0]+s[0],v[1]+s[1]]; } } return v; };

/* ---------- props */
function eruption(cx,base,h,s,{dark=false,grow=1}={}){ const H=h*grow; let g=`<g transform="translate(${cx} ${base}) scale(${s})">`;
  g+=`<path d="M-320 0L-70 -160Q0 -178 70 -160L320 0Z" fill="${dark?'#1a1414':'#241a30'}" stroke="${OUT}" stroke-width="6"/>`;
  if(grow>0){ g+=`<path d="M-44 -160Q-74 ${-H*.5} -34 ${-H*.86}H34Q74 ${-H*.5} 44 -160Z" fill="url(#gColumn)" stroke="${OUT}" stroke-width="6"/>`;
    const sp=Math.max(0,(grow-.55)/.45);
    if(sp>0){ for(let i=0;i<11;i++){ const a=-Math.PI+i/10*Math.PI, rx=(150+rnd(i)*90)*sp, x=Math.cos(a)*240*sp, y=-H+Math.sin(a)*72*sp-rnd(i+3)*40*sp; g+=`<ellipse cx="${N(x)}" cy="${N(y)}" rx="${N(rx*.7)}" ry="${N(rx*.45)}" fill="${dark?(i%2?'#2a2222':'#332a28'):(i%2?'#5a4a5e':'#6e5a6a')}" stroke="${OUT}" stroke-width="5"/>`; }
      g+=`<ellipse cx="0" cy="${N(-H-30*sp)}" rx="${N(270*sp)}" ry="${N(92*sp)}" fill="${dark?'#3a302c':'#7a6672'}" stroke="${OUT}" stroke-width="5"/>`; }
    if(!dark) g+=`<ellipse cx="0" cy="${N(-H+20)}" rx="120" ry="60" fill="${GOLD}" opacity=".45"/>`; }
  return g+`</g>`; }
const bolt=(x,y,s=1,col=CRIM)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 0l-40 90l34 -8l-30 110l70 -130l-36 8l30 -70Z" fill="${col}" stroke="#fff3d6" stroke-width="5" stroke-linejoin="round"/>`;
function scrollProp(h,w=150,turn=0){ const fl=turn>0&&turn<1?`<path d="M${N(w*.5)} 0Q${N(w*.5+Math.cos(turn*Math.PI)*60)} -30 ${N(w*.5+Math.cos(turn*Math.PI)*70)} 36Q${N(w*.5+Math.cos(turn*Math.PI)*60)} 80 ${N(w*.5)} 72Z" fill="#fff8e6" stroke="${OUT}" stroke-width="3"/>`:'';
  return `<g transform="translate(${N(h[0]-w/2)} ${N(h[1]-36)})"><rect x="0" y="0" width="${w}" height="72" fill="#fbf2dc" stroke="${OUT}" stroke-width="4"/><path d="M14 18h${w-40}M14 34h${w-60}M14 50h${w-48}" stroke="#8a7a5a" stroke-width="4"/>${fl}<rect x="-12" y="-8" width="16" height="88" rx="8" fill="#a8743a" stroke="${OUT}" stroke-width="4"/><rect x="${w-4}" y="-8" width="16" height="88" rx="8" fill="#a8743a" stroke="${OUT}" stroke-width="4"/></g>`; }
const tablet=(h)=>`<g transform="translate(${N(h[0]-34)} ${N(h[1]-50)}) rotate(-6)"><rect width="68" height="90" rx="6" fill="#a8743a" stroke="${OUT}" stroke-width="4"/><rect x="8" y="8" width="52" height="74" fill="#4a3a2a"/><path d="M14 22h36M14 36h30M14 50h34" stroke="#d9c08a" stroke-width="3"/></g>`;
const shakeMarks=(x,y,s=1,op=1)=>op>0?`<g stroke="#fff3d6" stroke-width="${5*s}" stroke-linecap="round" opacity="${N(op*100)/100}"><path d="M${x} ${y}l-14 ${-10*s}M${x+6} ${y+18}l-20 0M${x} ${y+36}l-14 ${10*s}"/></g>`:'';
function fish(x,y,r,u,i){ const fl=Math.sin(u*14+i)*16; return `<g transform="translate(${x} ${y}) rotate(${N(r+fl)})"><path d="M-30 0Q0 -20 30 0Q0 20 -30 0ZM30 0L48 -14V14Z" fill="${TEAL}" stroke="${OUT}" stroke-width="4"/><circle cx="-14" cy="-3" r="3" fill="${OUT}"/></g>`; }
function pumice(u,t0,seed,n=14){ let g=''; for(let i=0;i<n;i++){ const st=t0+rnd(seed+i)*3, k=u-st; if(k<0) continue; const x=80+rnd(seed+i*3)*920, fall=Math.min(1,k/.45), y=lerp(-80,1290-rnd(i+seed)*60,fall)-(k>.45?Math.abs(Math.sin((k-.45)*10))*40*Math.exp(-(k-.45)*4):0);
  g+=`<circle cx="${N(x+k*30)}" cy="${N(y)}" r="${N(8+rnd(i+seed+5)*8)}" fill="#8a8580" stroke="${OUT}" stroke-width="3"/>`; } return g; }

/* ---------- sets (static parts memoised) */
const courtyardBack=()=>memo('court',()=>{ let g=`<rect x="-400" y="-400" width="1880" height="2720" fill="url(#gNight)"/>`;
  for(let i=0;i<50;i++) g+=`<circle cx="${N(rnd(i)*1080)}" cy="${N(rnd(i+70)*700)}" r="${N(1.2+rnd(i+3)*2)}" fill="${IVORY}" opacity=".6"/>`;
  g+=eruption(790,1080,600,.8)+bolt(560,520,.7,GOLD);
  g+=`<rect x="-400" y="1080" width="1880" height="200" fill="#0f2a3a"/><path d="M-400 1110H1480M-400 1160H1480M-400 1220H1480" stroke="${GOLD}" stroke-width="6" stroke-dasharray="60 40" opacity=".55"/>`;
  g+=KIT.screen(`<ellipse cx="790" cy="760" rx="520" ry="640" fill="url(#gTorch)" opacity=".55"/>`);
  g+=`<rect x="-400" y="1250" width="1880" height="90" fill="#2a3550" stroke="${OUT}" stroke-width="6"/><rect x="-400" y="1340" width="1880" height="980" fill="#22304a"/><path d="M-400 1340H1480" stroke="${OUT}" stroke-width="6"/>`;
  let d=''; for(let x=-400;x<1500;x+=140) d+=`M${x} 1340l-90 580`; g+=`<path d="${d}" stroke="#2c3b58" stroke-width="5"/>`;
  g+=KIT.screen(`<circle cx="420" cy="1420" r="560" fill="url(#gLamp)" opacity=".95"/>`);
  g+=`<rect x="170" y="1470" width="520" height="34" rx="8" fill="#6a3a2a" stroke="${OUT}" stroke-width="6"/><rect x="200" y="1504" width="30" height="120" fill="#4a2618" stroke="${OUT}" stroke-width="5"/><rect x="630" y="1504" width="30" height="120" fill="#4a2618" stroke="${OUT}" stroke-width="5"/>`;
  g+=`<g transform="translate(230 1470)"><path d="M-36 0Q-32 -24 0 -24Q36 -24 42 0Z" fill="${GOLD}" stroke="${OUT}" stroke-width="5"/><path d="M36 -12Q50 -38 42 -58Q30 -36 36 -12Z" fill="#ffe08a" stroke="#ff9a2b" stroke-width="4"/></g>`;
  return g; });
const courtyardFront=()=>`<path d="M1080 1920V1600Q1020 1560 1000 1420Q1040 1500 1080 1500Z" fill="#0b1220"/><rect x="0" y="380" width="70" height="1540" fill="#0b1220"/>`;
const terraceBack=(u,grow)=>`<rect x="-400" y="-400" width="1880" height="2720" fill="#bfe6ec"/>`+eruption(780,1080,600,.75,{grow})+memo('terr',()=>`<rect x="-400" y="1080" width="1880" height="260" fill="${TEAL}"/><path d="M-400 1130H1480M-400 1190H1480" stroke="#e9fbf9" stroke-width="6" stroke-dasharray="50 40" opacity=".7"/><rect x="-400" y="1300" width="1880" height="1020" fill="${IVORY}"/><path d="M-400 1300H1480" stroke="${OUT}" stroke-width="6"/>`+[0,1,2,3,4].map(i=>`<rect x="${-300+i*360}" y="1250" width="60" height="60" fill="#e9dcc0" stroke="${OUT}" stroke-width="5"/>`).join('')+`<rect x="-400" y="1240" width="1880" height="24" fill="#e9dcc0" stroke="${OUT}" stroke-width="5"/>`);
const deckBack=(u)=>memo('deck',()=>`<rect x="-400" y="-400" width="1880" height="2720" fill="url(#gDusk)"/><circle cx="260" cy="980" r="150" fill="#ffd36a" opacity=".85"/>`)+eruption(820,1120,640,.75)+memo('deck2',()=>{ let g=`<rect x="-400" y="1120" width="1880" height="1300" fill="#5a2a6a"/>`; let d=''; for(let r=0;r<9;r++) for(let c=0;c<14;c++) d+=`M${-360+c*150+(r%2)*70} ${1160+r*70}h70`; return g+`<path d="${d}" stroke="#ff9a5a" stroke-width="7" stroke-linecap="round" opacity=".6"/>`; });
const deckFloor=()=>memo('deckF',()=>`<path d="M-400 1500H1480V2300H-400Z" fill="#7a3e2a" stroke="${OUT}" stroke-width="8"/><path d="M-400 1560H1480M-400 1640H1480" stroke="#5a2e1a" stroke-width="6"/><path d="M-400 1500H1480" stroke="#e0a040" stroke-width="10"/>`);
const dawnBack=(u)=>memo('dawn',()=>{ let g=`<rect x="-400" y="-400" width="1880" height="2720" fill="url(#gAshSky)"/>`+eruption(820,1000,700,.9,{dark:true});
  g+=`<path d="M-400 380Q300 260 700 360T1480 330V760Q700 700 300 780T-400 760Z" fill="#1a1414" opacity=".9"/>`;
  g+=`<rect x="-400" y="1000" width="1880" height="140" fill="#1f3a42"/><rect x="-400" y="1120" width="1880" height="260" fill="#6b5a46"/><path d="M-400 1150Q300 1130 600 1160T1480 1140" stroke="#8a7a62" stroke-width="8" fill="none"/>`;
  for(let i=0;i<8;i++){ const x=40+i*150, y=1380; g+=`<path d="M${x-28} ${y}L${x-18} ${y-120}H${x+18}L${x+28} ${y}Z" fill="#241c1a"/><circle cx="${x}" cy="${y-140}" r="24" fill="#241c1a"/><path d="M${x+10} ${y-100}l50 -40" stroke="#241c1a" stroke-width="14" stroke-linecap="round"/>`; }
  g+=`<rect x="-400" y="1380" width="1880" height="940" fill="#3a302a"/><path d="M-400 1380H1480" stroke="${OUT}" stroke-width="6"/>`; return g; });
const harbourBack=()=>memo('harb',()=>`<rect x="-400" y="-400" width="1880" height="2720" fill="#cfcac4"/><rect x="-400" y="1050" width="1880" height="300" fill="#8a9aa0"/><path d="M-400 1090H1480M-400 1150H1480" stroke="#dfe5e6" stroke-width="5" stroke-dasharray="70 50"/><rect x="-400" y="1340" width="1880" height="980" fill="#e9e4dc"/><path d="M-400 1340H1480" stroke="${OUT}" stroke-width="6"/><rect x="760" y="1180" width="34" height="200" fill="#6a5a50" stroke="${OUT}" stroke-width="5"/>`);
const deskBack=()=>memo('desk',()=>`<rect x="-400" y="-400" width="1880" height="2720" fill="#2a2036"/>`+KIT.screen(`<circle cx="700" cy="1200" r="700" fill="url(#gLamp)" opacity=".9"/>`)+`<rect x="-400" y="1500" width="1880" height="820" fill="#3a2a2a"/><rect x="200" y="1360" width="780" height="40" fill="#8a4a2a" stroke="${OUT}" stroke-width="6"/><g transform="translate(900 1360)"><path d="M-36 0Q-32 -24 0 -24Q36 -24 42 0Z" fill="${GOLD}" stroke="${OUT}" stroke-width="5"/><path d="M36 -12Q50 -38 42 -58Q30 -36 36 -12Z" fill="#ffe08a" stroke="#ff9a2b" stroke-width="4"/></g>`);

/* ============================== shots */
// 1 COLD OPEN: tremors; his mother faces the eruption; Pliny, back to it, reads and catches the walking cup without looking
const S1J=[.25,1.45,2.55];
function sh1(t){ const u=t-S(1), j=jolts(u,S1J);
  const tile=seg(u,.3,.85,E.i), cupX=lerp(600,660,seg(u,.4,2.6)), catchK=seg(u,2.55,2.75,E.o);
  const flinch=S1J.reduce((a,t0)=>a+Math.max(0,1-Math.abs(u-t0-.08)/.25),0);
  const mp={...KIT.P.fearHands,lean:-10-flinch*8,tilt:-18-flinch*6};
  const turn=seg(u,1.0,1.45);
  const pp={...KIT.P.sitRead,hF:mix([96,-172],[-30,-120],catchK),expr:catchK>.5?'calm':'absorbed'};
  const cam=keys(u,[[0,{x:540,y:1180,z:1.05}],[2.35,{x:540,y:1180,z:1.05}],[2.75,{x:470,y:1290,z:1.7},E.io],[9,{x:470,y:1290,z:1.75}]]);
  let g=inCam(cam,courtyardBack()+`<g transform="translate(${N(150+tile*40)} ${N(860+tile*560)}) rotate(${N(-24+tile*200)})"><path d="M-46 -16H46L38 16H-38Z" fill="${CRIM}" stroke="${OUT}" stroke-width="5"/></g>`+(tile>=1?`<path d="M170 1440l-30 -20M190 1430l10 -34M210 1440l30 -16" stroke="${CRIM}" stroke-width="6" stroke-linecap="round"/>`:'')
    +fig('pliny',420,1640,1.85,-1,pp,t,3,scrollProp([84,-170],150,turn)+(catchK>.5?`<g transform="translate(-30 -120)"><path d="M-18 0L-14 -40H14L18 0Z" fill="${IVORY}" stroke="${OUT}" stroke-width="4"/></g>`:''))
    +fig('mother',700,1640,1.7,1,mp,t,6)
    +(catchK<.5?`<g transform="translate(${N(cupX)} 1470) rotate(${N(Math.sin(u*30)*8)})"><path d="M-18 0L-14 -40H14L18 0Z" fill="${IVORY}" stroke="${OUT}" stroke-width="4"/></g>`:'')
    +shakeMarks(690,1400,.8,Math.max(0,flinch))+courtyardFront());
  return KIT.jolt(g,j)+KIT.vig(); }
// 2 FREEZE: character card, then rewind
function sh2(t){ const u=t-S(2), D=SE(2)-S(2), k=seg(u,0,.18,E.o);
  let g=`<rect width="1080" height="1920" fill="url(#gBurst)"/>`;
  for(let i=0;i<24;i++){ const a=i/24*Math.PI*2+u*.15; g+=`<path d="M540 900L${N(540+Math.cos(a)*1600)} ${N(900+Math.sin(a)*1600)}L${N(540+Math.cos(a+.13)*1600)} ${N(900+Math.sin(a+.13)*1600)}Z" fill="#ffb12e" opacity=".55"/>`; }
  const p={...KIT.P.sitRead,hB:[66,-200],hF:[96,-204],expr:u>1.9?'meh':'absorbed',look:u>1.9?[-4,0]:[3,4],tilt:u>1.9?-4:16};
  g+=`<g transform="translate(540 1500) scale(${N(lerp(.8,1,k)*100)/100}) translate(-540 -1500)">${fig('pliny',560,1990,3.0,-1,p,t,3,scrollProp([84,-202],150))}</g>`;
  g+=`<rect x="40" y="40" width="1000" height="1840" fill="none" stroke="#fffaf0" stroke-width="22" transform="rotate(-1.5 540 960)"/>`;
  return g+KIT.freeze(k)+KIT.vig(.5); }
// 3 AFTERNOON: the cloud; the uncle's curiosity; Pliny prefers to study
function sh3(t){ const u=t-S(3), kc=cu(3,'cloud'), ku=cu(3,'uncle'), kp=kc+1.0, cut=kc+.55;
  const grow=seg(u,0,kc+.6,E.o)*.9+.1;
  const up=seg(u,ku-.2,ku+.4,E.o), stand=seg(u,1.9,2.4,E.back);
  const up_={...KIT.P.sitRead,expr:up>.5?'awe':'absorbed',look:up>.5?[4,-4]:[3,4],tilt:16-up*30};
  const pine=(u>kc-.1&&u<cut)?`<g opacity="${N(seg(u,kc-.1,kc+.15)*100)/100}" transform="translate(780 520) scale(.8)" fill="none" stroke="${IVORY}" stroke-width="12" stroke-linecap="round"><path d="M0 520V-40M0 -40Q-260 -60 -300 20M0 -40Q260 -60 300 20M0 0Q-200 10 -240 70M0 0Q200 10 240 70"/></g>`:'';
  if(u<cut){ // angle A: the discovery. The uncle drops his reading; the cloud fills the frame
    const cam=keys(u,[[0,{x:470,y:1260,z:1.55}],[ku,{x:480,y:1240,z:1.55}],[cut,{x:560,y:1120,z:1.32},E.io]]);
    const unP=stand<.5?up_:{...KIT.P.point,hF:[150,-300],expr:'awe',look:[4,-4],lean:8};
    const scrollDrop=up>.5?`<g transform="translate(-60 -20) rotate(70)">${scrollProp([0,0],110)}</g>`:'';
    return inCam(cam,terraceBack(u,grow)+fig('mother',150,1500,1.55,1,{...KIT.P.point,expr:'awe'},t,6)+fig('uncle',430,1500,1.6,1,unP,t,5,stand<.5?scrollProp([84,-170],140):scrollDrop)+pine)+KIT.vig(.6); }
  // angle B: the invitation and the refusal
  const v=u-cut, cam=keys(v,[[0,{x:640,y:1250,z:1.42}],[3,{x:660,y:1240,z:1.48}]]);
  const wave=Math.sin(v*9)*24;
  const unP={...KIT.P.point,hF:[110+wave*.6,-340],expr:'happy',look:[3,-1],lean:-4};
  const ans=u>kp-.25;
  const pP=ans?{...KIT.P.shrug,hy:44,fF:[74,-4],fB:[52,0],hF:[96,-250],expr:'calm',look:[-3,-1],talk:talkAt(3,'P',t)}:{...KIT.P.write,expr:'absorbed'};
  return inCam(cam,terraceBack(u,1)+fig('uncle',430,1500,1.6,1,unP,t,5)+fig('pliny',820,1500,1.6,-1,pP,t,3,ans?tablet(pP.hF):scrollProp([110,-150],120)))+KIT.vig(.6); }
// 4 AT SEA: the plea; the turn toward shore; "Fortune favours the brave"
function sh4(t){ const u=t-S(4), kh=cu(4,'help'), kr=cu(4,'rescuer');
  const tilt=lerp(-3,-8,seg(u,kr-.3,kr+.4,E.io));
  const cam=keys(u,[[0,{x:520,y:1180,z:1.25}],[kr-.2,{x:540,y:1160,z:1.35}],[kr+.3,{x:600,y:1140,z:1.5},E.o],[9,{x:600,y:1140,z:1.52}]]);
  const read=seg(u,kh-.2,kh+.3), turn=seg(u,kr-.15,kr+.25,E.back);
  const unP=turn<.05?{...KIT.P.stand,hB:[40,-220],hF:[60,-226],expr:read>.5?'stern':'calm',look:[3,2],lean:4}:{...KIT.P.point,hF:[170,-300],expr:'determined',look:[4,-2],lean:10+turn*4,capeSw:-26};
  const hp={...KIT.P.plead,expr:'fear',hF:[120,-210],look:[3,-2]};
  const note=turn<.05?`<g transform="translate(40 -250) rotate(-6)"><rect width="70" height="50" fill="${IVORY}" stroke="${OUT}" stroke-width="4"/><path d="M10 14h46M10 26h40M10 38h30" stroke="#8a7a5a" stroke-width="3"/></g>`:'';
  let w=deckBack(u)+deckFloor()+`<g transform="translate(900 1500) scale(.72)"><path d="M0 0V-700" stroke="${OUT}" stroke-width="22"/><path d="M0 0V-700" stroke="#5a2e1a" stroke-width="12"/><path d="M-260 -660H220L190 -260H-230Z" fill="${CRIM}" stroke="${OUT}" stroke-width="8" stroke-linejoin="round"/></g>`
    +fig('sailor',180,1520,1.45,1,u>kh+.6?hp:{...KIT.P.stand,expr:'worried',look:[3,-2]},t,9)
    +fig('uncle',520,1520,1.7,1,{...unP,talk:talkAt(4,'U',t)},t,5,note)+pumice(u,kr-.6,30);
  return KIT.dutch(inCam(cam,w),tilt)+KIT.vig(); }
// 5 NIGHT: worse quakes; the friend from Spain scolds; Pliny turns a page
function sh5(t){ const u=t-S(5), kb=cu(5,'book'), j=jolts(u,[.2,1.6,3.0],18);
  const kq=kb+.5;
  const cam=keys(u,[[0,{x:470,y:1300,z:1.3}],[kb-.3,{x:440,y:1320,z:1.4},E.io],[kb+.1,{x:420,y:1300,z:2.0},E.o],[kq+.2,{x:420,y:1260,z:2.0}],[kq+.8,{x:470,y:1280,z:1.5},E.io],[9,{x:470,y:1280,z:1.52}]]);
  const fw=walker(u,-300,90,1.5,2.0,90,1.7);
  const gest=Math.sin(u*9)*30;
  const fP=u<2.0?{...fw.p,expr:'scold',hF:[80,-200]}:{...fw.p,...KIT.P.scold,hF:[110,-250+gest],hB:[-30,-170-gest*.6]};
  const turn=seg(u,kb-.1,kb+.35);
  const mlook=u>2.2?(Math.sin(u*3)>0?[4,0]:[-4,0]):[4,-4];
  let g=inCam(cam,courtyardBack()+fig('pliny',420,1640,1.85,-1,{...KIT.P.sitRead,expr:u>kb+.4?'calm':'absorbed',talk:talkAt(5,'P',t)},t,3,scrollProp([84,-170],150,turn))+fig('mother',700,1640,1.7,1,{...KIT.P.fearHands,look:mlook,expr:'worried'},t,6)+fig('friend',fw.x,1640,1.7,1,fP,t,7)+courtyardFront());
  return KIT.jolt(g,j)+KIT.vig(); }
// 6 DAWN: the sea pulls back; the black cloud; she tells him to go; he doesn't
function sh6(t){ const u=t-S(6), kw=cu(6,'without'), kd=cu(6,'didn');
  const flash=Math.max(0,1-Math.abs(u-.8)/.12)+Math.max(0,1-Math.abs(u-2.05)/.12);
  const grab=seg(u,kd-.1,kd+.2,E.back);
  const cam=keys(u,[[0,{x:560,y:1300,z:1.0}],[kd-.15,{x:560,y:1300,z:1.05}],[kd+.25,{x:560,y:1150,z:1.45},E.io],[9,{x:560,y:1150,z:1.5}]]);
  const stop=seg(u,kw-.3,kw+.1);
  const mp=stop<.5?{...KIT.P.plead,hF:[150,-200],expr:'fear'}:{...KIT.P.plead,hF:mix([60,-120],[140,-196],grab),hB:[-60,-120],expr:grab>.5?'sad':'plead',lean:16};
  const pp=grab<.05?(stop<.5?{...KIT.P.pull}:{...KIT.P.recoil,expr:'shock',hB:[-120,-200],lean:-6}):{...KIT.P.pull,hB:mix([-120,-200],[-150,-190],grab)};
  let w=dawnBack(u)+fish(160,1220,-12,u,1)+fish(420,1260,8,u,2)+fish(880,1210,-20,u,3)+fish(980,1300,14,u,4)
    +`<g transform="translate(${N(860+seg(u,0,3)*60)} 1420) rotate(${N(-8-seg(u,0,3)*6)})"><rect x="-90" y="-60" width="180" height="70" fill="#4a3426" stroke="${OUT}" stroke-width="5"/><circle cx="-60" cy="20" r="34" fill="#3a2a20" stroke="${OUT}" stroke-width="5"/><circle cx="60" cy="20" r="34" fill="#3a2a20" stroke="${OUT}" stroke-width="5"/></g>`
    +bolt(260,420,.9)+bolt(700,560,.6)
    +fig('mother',380,1740,2.0,1,mp,t,6)+fig('pliny',740,1740,2.05,1,pp,t,3)
    +(grab>.5?`<circle cx="${N(380+140*2)}" cy="${N(1740-196*2)}" r="22" fill="none" stroke="${GOLD}" stroke-width="6" opacity="${N(grab*.9*100)/100}"/>`:'');
  let g=inCam(cam,w)+KIT.ash(240,u,'#b8aca4',11,[0,0,1080,1920],.6,1.1);
  if(flash>0) g+=`<rect width="1080" height="1920" fill="#fff0e0" opacity="${N(flash*.45*100)/100}"/>`;
  return KIT.jolt(g,KIT.shake(u,4*(1-grab),17))+KIT.vig(1.1); }
// 7 THE DARK: almost nothing visible; they stop, shake off the ash, go on
function sh7(t){ const u=t-S(7), sh=Math.abs(Math.sin(u*14))*seg(u,.5,.7)*(1-seg(u,1.3,1.5));
  let g=`<rect width="1080" height="1920" fill="#080606"/>`;
  const lit=(svg)=>`<g opacity=".55">${svg}</g>`;
  g+=lit(fig('mother',440,1600,1.9,1,{...KIT.P.pull,hF:[140,-200],hB:[-40,-130],expr:'fear',lean:10,shrug:sh*10},t,6)+fig('pliny',740,1600,1.95,1,{...KIT.P.pull,expr:'determined',shrug:sh*10,talk:talkAt(7,'P',t)},t,3));
  g+=KIT.multiply(`<rect width="1080" height="1920" fill="#3a3030"/>`,.6);
  g+=KIT.ash(320,u,'#9a8f88',21,[0,0,1080,1920],.5,1.2);
  return g; }
// 8 AFTER: ash like snow; the empty mooring; one red cloth (a symbol, not in the letters)
function sh8(t){ const u=t-S(8);
  const cam=keys(u,[[0,{x:430,y:1150,z:1.75}],[9,{x:470,y:1140,z:1.85}]]);
  let w=harbourBack().replace('<rect x="760" y="1180" width="34" height="200" fill="#6a5a50" stroke="${OUT}" stroke-width="5"/>','')
    +fig('mother',300,1560,1.6,1,{...KIT.P.stand,expr:'sad',look:[4,0],hF:[40,-150]},t,6)+fig('pliny',470,1560,1.65,1,{...KIT.P.stand,expr:'sad',look:[4,0],hB:[-40,-140]},t,3)
    +`<g opacity=".8">${KIT.ash(90,u*.3,'#ffffff',41,[-200,0,1500,1600],.2,.9)}</g>`
    +`<rect x="640" y="900" width="60" height="900" fill="#5a4a42" stroke="${OUT}" stroke-width="6"/><path d="M640 960q70 20 84 120q-40 70 -90 150q-20 -140 6 -270Z" fill="${CRIM}" stroke="${OUT}" stroke-width="6"/>`;
  return inCam(cam,w)+KIT.vig(.7); }
// 9 THE HISTORIAN: calm this time
function sh9(t){ const u=t-S(9);
  const x=lerp(1350,640,seg(u,0,.35,E.back));
  const p={lean:-6,tilt:4,hB:[-6,-132],hF:[46,-262],expr:'calm',look:[-3,1]};
  const glass=`<g transform="translate(${N(p.hF[0])} ${N(p.hF[1])})"><path d="M0 0L-24 46" stroke="#5a3a1e" stroke-width="10" stroke-linecap="round"/><circle cx="14" cy="-28" r="30" fill="#cfe8f2" fill-opacity=".5" stroke="${OUT}" stroke-width="7"/></g>`;
  return `<rect width="1080" height="1920" fill="${NAVY}"/>`+fig('mascot',x,2060,3.3,-1,add(p,idle(t,7)),t,12,glass)+KIT.vig(.7); }
// 10 THE RECEIPT: years later, the letter to Tacitus
function sh10(t){ const u=t-S(10);
  const cam=keys(u,[[0,{x:500,y:1140,z:1.5}],[9,{x:520,y:1120,z:1.62}]]);
  const wr=Math.sin(u*16)*8;
  const p={...KIT.P.write,hF:[110+wr,-150],hy:44,talk:talkAt(10,'P',t),expr:talkAt(10,'P',t)>0?'calm':'absorbed'};
  const pen=`<path d="M${N(p.hF[0])} ${N(p.hF[1])}L${N(p.hF[0]+30)} ${N(p.hF[1]-60)}" stroke="#d9c08a" stroke-width="6" stroke-linecap="round"/>`+handDot(p.hF,'#e2b088');
  return inCam(cam,deskBack()+fig('adult',420,1560,1.7,1,p,t,4,pen)+`<rect x="560" y="1330" width="240" height="34" fill="#fbf2dc" stroke="${OUT}" stroke-width="4"/>`)+KIT.vig(.8); }
// 11 PAYOFF: the eruption type carries his name; the inset is the opening scene
function sh11(t){ const u=t-S(11), kp=cu(11,'plinian');
  let g=`<rect width="1080" height="1920" fill="${IVORY}"/>`;
  let d=''; for(let x=0;x<1080;x+=60) d+=`M${x} 0V1920`; for(let y=0;y<1920;y+=60) d+=`M0 ${y}H1080`; g+=`<path d="${d}" stroke="#e9dcc0" stroke-width="2"/>`;
  g+=eruption(500,1560,860,.88,{grow:.4+.6*seg(u,0,1.6,E.o)});
  g+=`<path d="M300 1500H140V900" fill="none" stroke="${NAVY}" stroke-width="6" stroke-dasharray="14 10"/><text x="60" y="1640" font-family="Anton, Impact, sans-serif" font-size="36" letter-spacing="2" fill="${NAVY}">COLUMN: INTO THE STRATOSPHERE (11+ KM)</text>`;
  const mv=E.io(seg(u,kp+.5,kp+1.1)), ins=1+seg(u,kp,kp+.4,E.back)*.12+mv*.5, turn=seg(u,kp+1.2,kp+1.6);
  g+=`<g transform="translate(${N(lerp(850,540,mv))} ${N(lerp(1180,1160,mv))}) scale(${N(ins*100)/100}) translate(-850 -1180)"><circle cx="850" cy="1180" r="200" fill="${NAVY}" stroke="${OUT}" stroke-width="10"/><clipPath id="ins"><circle cx="850" cy="1180" r="192"/></clipPath><g clip-path="url(#ins)">${KIT.screen(`<circle cx="830" cy="1260" r="280" fill="url(#gLamp)"/>`)}${fig('pliny',850,1580,1.5,-1,{...KIT.P.sitRead,expr:turn>0?'calm':'absorbed'},t,3,scrollProp([84,-170],150,turn))}</g></g>`;
  return g; }

const SEQ=[
  {from:1,r:sh1,out:'cut'},{from:2,r:sh2,out:'whip'},{from:3,r:sh3,out:'cut'},{from:4,r:sh4,out:'cut'},{from:5,r:sh5,out:'cut'},
  {from:6,r:sh6,out:'cut'},{from:7,r:sh7,out:'dissolve'},{from:8,r:sh8,out:'cut'},{from:9,r:sh9,out:'cut'},{from:10,r:sh10,out:'cut'},{from:11,r:sh11,out:'cut'},
];
SEQ.forEach((q,i)=>{ q.start=S(q.from); q.end=i+1<SEQ.length?S(SEQ[i+1].from):TOTAL; });

/* ============================== on-screen text (kept sparse) */
function stampMark(x,y,txt,k,col=CRIM,size=96,rot=-10){ const sc=lerp(1.9,1,k), w=textW(txt,size)+80;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${N(sc*100)/100})" opacity="${N(Math.min(1,k*1.4)*.95*100)/100}"><rect x="${N(-w/2)}" y="${N(-size*.92)}" width="${N(w)}" height="${N(size*1.42)}" rx="14" fill="#fffaf0" fill-opacity=".92" stroke="${col}" stroke-width="14"/><text y="${N(size*.34)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${size}" letter-spacing="6" fill="${col}">${txt}</text></g>`; }
function bubble(txt,x,y,k){ if(k<=0) return ''; const fs=96, w=textW(txt,fs)+90;
  return `<g transform="translate(${x} ${y}) scale(${N(lerp(.5,1,E.back(k))*100)/100})"><path d="M${N(-w/2)} -90H${N(w/2)}V60H${N(w*.18)}L${N(w*.32)} 130L${N(w*.02)} 60H${N(-w/2)}Z" fill="#fffaf0" stroke="${OUT}" stroke-width="8" stroke-linejoin="round"/><text y="18" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs}" letter-spacing="4" fill="${INK}">${txt}</text></g>`; }
function quoteCard(lines,attr,x,y,k,{fs=70,rot=-2,col=INK,bg=IVORY}={}){ if(k<=0) return '';
  const size=Math.min(fs,...lines.map(L=>fs*860/fellW(L,fs))); const w=Math.max(...lines.map(L=>fellW(L,size)),attr?textW(attr,28):0)+90, lh=size*1.12, h=lines.length*lh+(attr?70:40);
  let g=`<rect x="${N(-w/2)}" y="${N(-h/2)}" width="${N(w)}" height="${N(h)}" rx="16" fill="${bg}" stroke="${OUT}" stroke-width="7"/>`;
  lines.forEach((L,i)=>{ g+=`<text y="${N(-h/2+30+size*.8+i*lh)}" text-anchor="middle" font-family="Fell, Georgia, serif" font-style="italic" font-size="${N(size)}" fill="${col}">${L}</text>`; });
  if(attr) g+=`<text y="${N(h/2-24)}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="28" letter-spacing="3" fill="#5a4a32">${attr}</text>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${N(lerp(.6,1,E.back(k))*100)/100})" opacity="${N(Math.min(1,k*2)*100)/100}">${g}</g>`; }
function overlays(t){ let g='';
  if(t<SE(1)){ const u=t-S(1);
    g+=pill('MISENUM · AD 79',540,250,40,NAVY,GOLD,-2,seg(u,.05,.2));
    g+=`<g opacity="${N(seg(u,.15,.3)*100)/100}">${bigTitle('THE GROUND IS SHAKING.',540,400,N(fitSize('THE GROUND IS SHAKING.',96,960)),GOLD,'transform="rotate(-2 540 360)"')}</g>`;
    if(u>1.0) g+=`<g opacity="${N(seg(u,1.0,1.15)*100)/100}">${bigTitle("HE'S READING.",540,530,104,IVORY,'transform="rotate(-2 540 490)"')}</g>`; }
  if(t>=S(2)&&t<SE(2)){ const u=t-S(2); g+=pill('PLINY',300,620,96,CRIM,IVORY,-3,KIT.pop(u,.15))+pill('AGE 17',300,760,52,'#2a2a2a',GOLD,2,KIT.pop(u,.4)); }
  if(t>=S(3)&&t<SE(3)){ const u=t-S(3), kc=cu(3,'cloud');
    if(u>kc-.1&&u<kc+.55) g+=pill("SHAPED LIKE A PINE TREE · HIS WORDS",600,1060,40,'#2a2a2a',IVORY,-2,seg(u,kc,kc+.2));
    const kp=kc+.9; if(u>kp-.15) g+=quoteCard(['“I preferred to study.”'],'PLINY, LETTER 6.16',540,400,seg(u,kp-.15,kp+.1)); }
  if(t>=S(4)&&t<SE(4)){ const u=t-S(4), kf=cu(4,'rescuer')+.55; if(u>kf-.15) g+=quoteCard(['“Fortes fortuna iuvat.”','Fortune favours the brave.'],'HIS UNCLE, AS PLINY RECORDS IT · LETTER 6.16',540,1430,seg(u,kf-.15,kf+.1),{fs:62}); }
  if(t>=S(5)&&t<SE(5)){ const u=t-S(5), kq=cu(5,'book')+.5; if(u>kq-.15) g+=quoteCard(['“Courage, or foolishness?','I was seventeen.”'],'PLINY ON HIMSELF · LETTER 6.20 (CONDENSED)',540,1430,seg(u,kq-.15,kq+.1),{fs:62}); }
  if(t>=S(7)&&t<SE(7)){ const u=t-S(7); g+=quoteCard(['“Like a shut room','with the light put out.”'],'PLINY ON THE DARKNESS · LETTER 6.20 (OUR TRANSLATION)',540,700,seg(u,.25,.5),{fs:60,bg:'#2a2424',col:IVORY}); }
  if(t>=S(9)&&t<SE(9)){ const u=t-S(9); g+=pill('HISTORY HAS RECEIPTS · #3',540,260,40,CRIM,IVORY,-2,seg(u,.05,.2))+bubble('PROVE IT.',420,640,seg(u,.6,.85)); }
  if(t>=S(10)&&t<SE(10)){ const u=t-S(10), kq=cu(10,'tacitus')+.5, kt=kq+1.5;
    if(u>kq-.15) g+=quoteCard(['“Posco librum Titi Livi.”','I ask for a book of Livy.'],'PLINY TO TACITUS · LETTER 6.20.5',540,560,seg(u,kq-.15,kq+.1),{fs:62});
    if(u>=kt) g+=stampMark(800,700,'RECEIPT',seg(u,kt,kt+.16,E.o),CRIM,84,-9); }
  if(t>=S(11)){ const u=t-S(11), kp=cu(11,'plinian'); if(u>=kp-.05){ g+=pill('PLINIAN ERUPTION',540,330,96,CRIM,IVORY,-2,KIT.pop(u,kp-.05))+pill('NAMED AFTER HIM',540,470,44,NAVY,GOLD,2,KIT.pop(u,kp+.25)); } }
  return g; }
