const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const CAP_MODE_EP='big';
const PAINT_EP=1;   // this episode paints: bake the canvas textures before the film is published
const SHOT_META=Array(VO.shots.length).fill(1166).map(y=>({sub:'top',capY:y,sfx:[]}));
const MERGE_EP=[[['eighteen','thirtythree'],'1833'],[['one','hundred','eighty'],'180'],[['fiftyfive'],'55']];
const LIFE_EP=1;
