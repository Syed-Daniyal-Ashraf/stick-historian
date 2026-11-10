const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const SHOT_META=[915,1520,1520,1580,1580,1540,1520,1520,1520,1520].map(y=>({sub:'top',subY:y,sfx:[]}));
