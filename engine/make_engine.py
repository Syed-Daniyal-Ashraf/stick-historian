"""Builds engine/template.html once from the proven Pig War engine plus the rig additions made since.
Episodes then fill the {{PLACEHOLDERS}} (see build_episode.py). Run only when the engine itself changes."""
import pathlib
d=pathlib.Path(__file__).parent
L=(d.parent/'pig'/'app.html').read_text().split('\n')
def R(a,b): return L[a-1:b]
out=[]
out+=R(1,5)+['<title>{{TITLE}}</title>']+R(7,53)
out+=['  <header><h1>{{TITLE}}</h1><span class="sub">{{SUB}}</span></header>']+R(55,55)
out+=['    <svg id="sv" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid meet" role="img" aria-label="{{ARIA}}">']
out+=R(57,57)+['{{DEFS}}']+R(97,103)
out+=['      <span class="t">{{TITLE}}</span>','      <span class="s">{{SUB}}</span>']+R(106,122)
out+=['  <p class="foot">{{FOOT}}</p>']
out+=R(124,138)+['{{META}}']+R(163,221)+['{{COS}}']+R(255,389)+['{{LIB}}','{{SCENES}}']+R(794,856)
out+=['function flashAt(t){ return 0; }']+R(858,863)+['  capsEl.innerHTML=overlays(t)+subSvg(t);']+R(865,879)+['{{SFX}}']+R(903,967)+['{{COVER}}']
out+=['window.film={renderCover,renderAt,TOTAL,SHOTS,SEQ,SUBS,CUES,DBG,seek,play,pause,state:PL,renderSfxOffline};']+R(1008,len(L))
s='\n'.join(out)
rep=[
 ("const C=c.hatC, B=shade(C,.6);","if(!c.hatC) return ''; const C=c.hatC, B=shade(C,.6);"),
 ("    case 'forage':","""    case 'boater': return `<path d="M-26 -27L-24 -52H28L30 -27Z" fill="${C}" stroke="${OUT}" stroke-width="4"/><rect x="-25" y="-38" width="54" height="9" fill="#b3262b"/><path d="M-30 -52H34" stroke="${OUT}" stroke-width="4"/><ellipse cx="2" cy="-26" rx="50" ry="7" fill="${C}" stroke="${OUT}" stroke-width="4"/>`;
    case 'bowler': return `<path d="M-26 -26Q-28 -66 2 -66Q32 -66 30 -26Z" fill="${C}" stroke="${OUT}" stroke-width="4"/><rect x="-26" y="-34" width="56" height="6" fill="#3a3a3a"/><path d="M-36 -24Q2 -32 40 -24" fill="none" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>`;
    case 'driver': return `<path d="M-30 -22Q-30 -50 4 -50Q36 -48 38 -26Q10 -18 -30 -22Z" fill="${C}" stroke="${OUT}" stroke-width="4"/><path d="M22 -26Q44 -28 54 -20" stroke="${OUT}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-26 -30Q4 -36 30 -32" stroke="#6b4a2a" stroke-width="7"/><circle cx="6" cy="-38" r="10" fill="#bfe0e8" stroke="${OUT}" stroke-width="4"/><circle cx="26" cy="-37" r="10" fill="#bfe0e8" stroke="${OUT}" stroke-width="4"/>`;
    case 'forage':"""),
 ("function fig(who,x,y,s,face,p,t,seed=0,extra=''){\n  const c=COS[who];","function fig(who,x,y,s,face,p,t,seed=0,extra=''){\n  let c=COS[who]; if(p.sick>0) c={...c,skin:mixHex(c.skin,'#a9bd82',p.sick)};"),
 ("  const sleeve=c.coat||c.shirt, dk=k=>shade(k,.72);","  const sleeve=c.bare?c.skin:(c.coat||c.shirt), dk=k=>shade(k,.72);"),
 ("    return limb([L.a,L.j,L.e],15,col)+","    return (c.shorts?limb([L.a,L.j],16,back?dk(c.shorts):c.shorts)+limb([L.j,L.e],13,back?dk(c.skin):c.skin):limb([L.a,L.j,L.e],15,col))+"),
 ("function shade(hex,k){","function mixHex(a,b,k){ const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=s=>Math.round(lerp((A>>s)&255,(B>>s)&255,k)); return '#'+((1<<24)+(f(16)<<16)+(f(8)<<8)+f(0)).toString(16).slice(1); }\nfunction shade(hex,k){"),
 # episodes may hide the subtitle of a specific line (e.g. when a giant title says the same words): const SKIP_SUBS=[[shotIndex,lineIndex]]
 ("  chunks.forEach((c,ci)=>{ const nx=chunks[ci+1]; SUBS.push(","  if(!(typeof SKIP_SUBS!=='undefined'&&SKIP_SUBS.some(([a,b])=>a===si&&b===li))) chunks.forEach((c,ci)=>{ const nx=chunks[ci+1]; SUBS.push("),
 ("const SUB_SIZE=94, SUB_MAXW=820, SUB_Y={top:372,bottom:1330};","const SUB_SIZE=94, SUB_MAXW=820, SUB_Y={top:372,top2:530,bottom:1330};"),
 ("for(const q of pieces){ const k=Math.ceil(q.length/4),","for(const q of pieces){ const fits=n=>{ const b=Math.floor(q.length/n), ex=q.length%n; let i=0; for(let j=0;j<n;j++){ const m=b+(j<ex?1:0), txt=q.slice(i,i+m).map(w=>w.w.toUpperCase()).join(' '); if(textW(txt,94)>1.55*820) return false; i+=m; } return true; }; let k=Math.ceil(q.length/4); while(k<q.length&&!fits(k)) k++; const kk=k,"),
 # --- additive rig features (no effect unless a costume sets them): bat wings, glasses, bow tie
 ("  let g=`<ellipse cx=\"${N((hip[0])*.6)}\" cy=\"3\" rx=\"74\" ry=\"11\" fill=\"#000\" opacity=\".2\"/>`;","  let g=`<ellipse cx=\"${N((hip[0])*.6)}\" cy=\"3\" rx=\"74\" ry=\"11\" fill=\"#000\" opacity=\".2\"/>`;\n  if(c.wings) g+=wingSvg(c,sh,lean,p.wing||0);"),
 ("  g+=faceSvg(p.expr||'neutral',p.look,blink,p.mouth);","  g+=faceSvg(p.expr||'neutral',p.look,blink,p.mouth);\n  if(c.glasses) g+=`<g fill=\"#ffffff\" fill-opacity=\".18\" stroke=\"${OUT}\" stroke-width=\"3.4\"><circle cx=\"9\" cy=\"-5\" r=\"9.5\"/><circle cx=\"23.5\" cy=\"-4\" r=\"9.5\"/><path d=\"M18.6 -5.2H14.2M-0.4 -6L-16 -9\" fill=\"none\"/></g>`;"),
 ("  if(c.epaulet){","  if(c.bowtie){ const b=at(neck,-9,9); g+=`<path d=\"M${N(b[0]-13)} ${N(b[1]-8)}L${N(b[0])} ${N(b[1])}L${N(b[0]-13)} ${N(b[1]+8)}ZM${N(b[0]+13)} ${N(b[1]-8)}L${N(b[0])} ${N(b[1])}L${N(b[0]+13)} ${N(b[1]+8)}Z\" fill=\"${c.bowtie}\" stroke=\"${OUT}\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><circle cx=\"${N(b[0])}\" cy=\"${N(b[1])}\" r=\"3.4\" fill=\"${c.bowtie}\" stroke=\"${OUT}\" stroke-width=\"2\"/>`; }\n  if(c.epaulet){"),
]
for a,b in rep:
  assert a in s, a[:70]; s=s.replace(a,b,1)
(d/'template.html').write_text(s); print('template',len(s))
