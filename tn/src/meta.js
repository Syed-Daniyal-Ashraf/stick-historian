const SKIP_SUBS=VO.shots.flatMap((s,si)=>s.lines.map((l,li)=>[si,li]));
const SPEAKERS={};
const CAP_MODE_EP='big';
const SHOT_META=Array(8).fill(1166).map(y=>({sub:'top',capY:y,sfx:[]}));
const MERGE_EP=[[['eighteenth'],'18th'],[['eighteen','eightythree'],'1883'],[['thirtyeight'],'38'],[['fiftyeight'],'58'],[['nineteen','eighteen'],'1918'],[['thirtyfive'],'35']];
const LIFE_EP=1;
