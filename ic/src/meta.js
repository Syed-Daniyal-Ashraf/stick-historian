const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const CAP_MODE_EP='big';
const SHOT_META=Array(8).fill(1166).map(y=>({sub:'top',capY:y,sfx:[]}));
const MERGE_EP=[[['eighteen','thirtythree'],'1833'],[['one','hundred','eighty'],'180'],[['fiftyfive'],'55']];
const LIFE_EP=1;
const WALK_RAMP_EP=.14;
