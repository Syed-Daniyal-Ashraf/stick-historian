const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const SHOT_META=Array(10).fill(1190).map(y=>({sub:'top',subY:y,sfx:[]}));
const MERGE_EP=[[['nineteen','oh','four'],'1904'],[['nineteen','seventies'],'1970s'],[['nineteen','forty'],'1940'],[['five','hundred','dollars'],'$500']];
const LIFE_EP=1;
const SUB_MAXW_EP=850;
