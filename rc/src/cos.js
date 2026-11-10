/* ============================== costumes (illustrative New Kingdom workmen; names from the register, looks invented) */
const KILT='#f1ead8', SANDAL='#7a5232';
const COS={
  scribe:  {skin:'#b77a4e',hair:'#1c1410',shirt:KILT,coat:KILT,frock:true,pants:'#b77a4e',boot:SANDAL,hat:null},
  seba:    {skin:'#a86c43',hair:'#1c1410',shirt:'#a86c43',bare:true,shorts:KILT,pants:'#a86c43',boot:SANDAL,hat:null},
  pennub:  {skin:'#9b6440',hair:'#2a1a12',shirt:'#9b6440',bare:true,shorts:KILT,pants:'#9b6440',boot:SANDAL,hat:null,beard:false},
  healer:  {skin:'#b07448',hair:'#3a2a1c',shirt:KILT,coat:KILT,tunic:true,pants:'#b07448',boot:SANDAL,hat:null},
  kons:    {skin:'#a0683f',hair:'#1c1410',shirt:'#a0683f',bare:true,shorts:'#e6d9b8',pants:'#a0683f',boot:SANDAL,hat:null},
  worker:  {skin:'#a96f46',hair:'#1c1410',shirt:'#a96f46',bare:true,shorts:KILT,pants:'#a96f46',boot:SANDAL,hat:null},
  worker2: {skin:'#8f5b38',hair:'#241812',shirt:'#8f5b38',bare:true,shorts:'#e9dfc6',pants:'#8f5b38',boot:SANDAL,hat:null},
  mascot:  {skin:'#f1c7a3',hair:'#7a7268',shirt:'#f4efe2',coat:'#8a6a46',vest:'#5f4a32',pants:'#3f3a33',boot:'#2a1c12',hat:null,glasses:true,bowtie:'#c8302a'},
};
const PO={
  stand:{lean:0,tilt:0,hB:[-6,-132],hF:[8,-132],expr:'neutral'},
  cross:{lean:-3,tilt:-8,hB:[30,-198],hF:[24,-208],expr:'defiant'},
};
const STANCE={fB:[-20,0],fF:[18,0]};
const P=(name,over)=>Object.assign({},PO[name],over||{});
