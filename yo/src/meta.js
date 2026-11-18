const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const CAP_MODE_EP='big';
const PAINT_EP=1;   // section 13: painted sets
const SHOT_META=Array(VO.shots.length).fill(1166).map(y=>({sub:'top',capY:y,sfx:[]}));
const MERGE_EP=[[['nineteen','twentyeight'],'1928'],[['nineteen','thirtyone'],'1931']];
const LIFE_EP=1;
