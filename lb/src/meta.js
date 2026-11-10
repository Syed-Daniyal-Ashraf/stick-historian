const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));   // the episode draws its own subtitles (Baloo, figures for numbers)
const SPEAKERS={};
const SHOT_META=[1560,1440,1500,1500,1500,1500,1500,640,1500,1500,1500,1500,1500].map(y=>({sub:'top',subY:y,sfx:[]}));
