/* ============================== costumes (illustrative Roman-Egyptian and Victorian dress; looks are invented) */
const SANDAL='#7a5232';
const COS={
  theon:   {skin:'#b57a50',hair:'#24160e',shirt:'#e9dcc0',tunic:true,belt:'#8a5a2a',btn:'#c9a24a',pants:'#b57a50',boot:SANDAL,hat:null},
  dad:     {skin:'#a8714a',hair:'#24160e',shirt:'#e2d3b0',coat:'#7a4e78',frock:true,pants:'#a8714a',boot:SANDAL,hat:null,beard:true},
  mom:     {skin:'#b27650',hair:'#1c120c',shirt:'#b65a50',coat:'#b65a50',frock:true,pants:'#b65a50',boot:SANDAL,hat:null},
  grenfell:{skin:'#f0c9a4',hair:'#6a4a2a',shirt:'#f4efe2',coat:'#2f3442',frock:true,vest:'#5a4a3a',pants:'#2a2a2c',boot:'#141414',hat:null,mus:'#6a4a2a'},
  hunt:    {skin:'#eec29c',hair:'#3a2a1c',shirt:'#f4efe2',coat:'#4a3a2a',frock:true,vest:'#7a6a4a',pants:'#2a2a2c',boot:'#141414',hat:null,glasses:true,side:true},
  mascot:  {skin:'#f1c7a3',hair:'#7a7268',shirt:'#f4efe2',coat:'#8a6a46',vest:'#5f4a32',pants:'#3f3a33',boot:'#2a1c12',hat:null,glasses:true,bowtie:'#c8302a'},
};
const PO={
  stand:{lean:0,tilt:0,hB:[-6,-132],hF:[8,-132],expr:'neutral'},
  cross:{lean:-3,tilt:-8,hB:[30,-198],hF:[24,-208],expr:'defiant'},
};
const STANCE={fB:[-20,0],fF:[18,0]};
const P=(name,over)=>Object.assign({},PO[name],over||{});
