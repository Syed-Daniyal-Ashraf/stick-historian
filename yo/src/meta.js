const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const SHOT_META=Array(9).fill(1178).map(y=>({sub:'top',subY:y,sfx:[]}));
const MERGE_EP=[[['nineteen','twentyeight'],'1928'],[['nineteen','thirtyone'],'1931']];
const LIFE_EP=1;
const SUB_MAXW_EP=850;
