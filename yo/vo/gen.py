import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
import os as _os
T=_os.environ.get('TTS_DIR',_os.path.join(_os.path.dirname(_os.path.abspath(__file__)),'..','..','assets','tts'))+'/'
k=Kokoro(T+'kokoro-v1.0.onnx',T+'voices-v1.0.bin')
VO={'N':('af_heart','en-us',1.0)}
SAY={}
REPL=[]
PH=[('flˈɔːɹɪz','flˈɔːɹɛs')]   # Flores -> FLOR-es (brief: check this one by ear)
PHL={}
SCRIPT=[
 (1,'N',"A Filipino immigrant got America hooked on the *yo-yo.*",1.0,.0),
 (1,'N',"An American company ended up owning the *word.*",1.0,.15),
 (2,'N',"Pedro Flores worked in a California *hotel.*",1.03,.0),
 (2,'N',"From the *Philippines,* he knew a trick: a looped string that let it *sleep.*",1.02,.05),
 (3,'N',"In *nineteen twenty-eight,* he opened his own yo-yo company.",1.04,.0),
 (3,'N',"The next year: *three factories.*",1.0,.05),
 (4,'N',"He'd trademarked the name: *Flores Yo-Yo.*",1.02,.0),
 (4,'N',"When businessman *Donald Duncan* tried to trademark *Yo-Yo*… he was *rejected.*",1.04,.05),
 (5,'N',"So Duncan *bought him out.* The company… and the *name.*",1.0,.0),
 (5,'N',"Pedro stayed on, showing kids tricks… with *Duncan* yo-yos.",1.0,.1),
 (6,'N',"Decades later, Duncan sued a rival over the word… and *lost.*",1.03,.0),
 (7,'N',"The court ruled *yo-yo* was a *Philippine* word. Nobody could own it.",1.02,.0),
 (8,'N',"Part of the evidence? Duncan's *own* words, from *nineteen thirty-one.*",1.0,.0),
 (9,'N',"Pedro Flores never heard the ruling.",.96,.0),
 (9,'N',"He had died the year *before.*",.92,.3),
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
