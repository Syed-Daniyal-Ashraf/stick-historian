import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
import os as _os
T=_os.environ.get('TTS_DIR',_os.path.join(_os.path.dirname(_os.path.abspath(__file__)),'..','..','assets','tts'))+'/'
k=Kokoro(T+'kokoro-v1.0.onnx',T+'voices-v1.0.bin')
VO={'N':('af_heart','en-us',1.0)}
SAY={}
REPL=[]
PH=[]
PHL={}
SCRIPT=[
 (1,'N',"A Boston ship carried *one hundred eighty tons* of ice to *India.*",1.0,.0),
 (1,'N',"In *eighteen thirty-three.*",1.0,.05),
 (1,'N',"Four months at sea. Across the *equator.* Twice.",1.0,.1),
 (2,'N',"No refrigeration. So how did it *survive?*",1.0,.05),
 (2,'N',"Step one: a machine cut the ice into identical, *two-foot* blocks.",1.02,.05),
 (3,'N',"Packed with *no gaps,* they acted like one *giant* block.",1.02,.0),
 (3,'N',"Less surface… *slower* melting.",.98,.05),
 (4,'N',"Step two: they *buried* it.",1.0,.0),
 (4,'N',"A foot of leftover *tannery bark* on every side. A foot of *hay* on top.",1.0,.05),
 (5,'N',"Even in the tropics, the hold took more than *ten days* to heat up.",1.02,.0),
 (6,'N',"In *September,* the ship reached Calcutta… with more than *half* still ice.",1.0,.0),
 (7,'N',"Then the *real* melting started.",1.0,.0),
 (7,'N',"Four months at sea had cost about *fifty-five* tons.",1.0,.05),
 (7,'N',"Days on the river and the docks: almost *thirty* more.",1.0,.05),
 (8,'N',"Its new customers reportedly raised the money in *three days.*",.98,.0),
 (8,'N',"The ice got its own *house.*",.94,.25),
]
def words(line):
  out=[]; hl=False
  for tok in line.split(' '):
    if tok.startswith('*') or tok.startswith('“*'): hl=True
    h=hl; clean=tok.replace('*','')
    if re.search(r'\*[.,?!”:]*$',tok): hl=False
    out.append({'w':clean,'hl':h})
  return out
def phon(text,lang):
  if text in PHL: return PHL[text]
  p=k.tokenizer.phonemize(text,lang)
  for a,b in PH: p=p.replace(a,b)
  return p
def say_of(line):
  s=line
  for a_,b_ in REPL: s=s.replace(a_,b_)
  s=s.replace('*','').replace('“','').replace('”','').replace('…',',')
  for a,b in SAY.items(): s=re.sub(r'\b'+a+r'\b',b,s)
  return s
def weight(w,lang):
  base=re.sub(r"[^\w'\-]",'',w); base=SAY.get(base,base)
  return len(re.sub(r'\s','',phon(base,lang) if base else ''))+1.5
res=[]
for i,(shot,spk,line,spd,gap) in enumerate(SCRIPT):
  voice,lang,_=VO[spk]
  ph=PHL.get(line.replace('*',''),None) or phon(say_of(line),lang)
  a,sr=k.create(ph,voice=voice,speed=spd,lang=lang,is_phonemes=True); a=np.asarray(a,dtype=np.float32)
  hop=int(sr*.01); rms=np.array([np.sqrt(np.mean(a[j:j+hop]**2)) for j in range(0,len(a)-hop,hop)])
  thr=max(rms.max()*.03,1e-4); on=np.where(rms>thr)[0]; a=a[on[0]*hop:min(len(a),(on[-1]+2)*hop)]; rms=rms[on[0]:on[-1]+2]; dur=len(a)/sr
  sf.write(f'vo/raw{i:02d}.wav',a,sr)
  sil=rms<thr*1.6; gaps=[]; j=0
  while j<len(sil):
    if sil[j]:
      s0=j
      while j<len(sil) and sil[j]: j+=1
      if j-s0>=8 and s0>0 and j<len(sil): gaps.append((s0*.01,j*.01))
    else: j+=1
  ws=words(line); W=[weight(w['w'],lang) for w in ws]; cum=np.cumsum(W); tot=cum[-1]
  bnd=[n for n,w in enumerate(ws[:-1]) if re.search(r'[,.?!;:”]$',w['w'])]
  anchors=[(0,0.0,0.0)]; used=set()
  for n in bnd:
    exp=cum[n]/tot*dur; best=None
    for gi,g in enumerate(gaps):
      d=abs((g[0]+g[1])/2-exp)
      if gi not in used and d<.45 and (best is None or d<best[0]): best=(d,gi)
    if best: used.add(best[1]); g=gaps[best[1]]; anchors.append((n+1,g[1],g[0]))
  anchors.append((len(ws),dur,dur))
  st=[0.0]*len(ws)
  for q in range(len(anchors)-1):
    n0,t0=anchors[q][0],anchors[q][1]; n1,t1=anchors[q+1][0],anchors[q+1][2]
    ww=W[n0:n1]; sw=sum(ww); t=t0
    for m,wv in enumerate(ww): st[n0+m]=t; t+=(t1-t0)*wv/sw
  for n,w in enumerate(ws): w['t']=round(st[n],3)
  env=[round(float(min(1,x/(rms.max()*.6))),2) for x in rms[::3]] if spk!='N' else []
  res.append({'gap':gap,'shot':shot,'spk':spk,'line':line,'dur':round(dur,3),'words':ws,'env':env})
  print(i,shot,spk,round(dur,2),len(gaps),'gaps |',ph[:70])
json.dump(res,open('vo/lines.json','w'))
