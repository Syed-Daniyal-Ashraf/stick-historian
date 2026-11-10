import json, re, subprocess, numpy as np, soundfile as sf
L=json.load(open('vo/lines.json'))
CHAIN="highpass=f=75,equalizer=f=220:t=q:w=1:g=1.5,equalizer=f=3300:t=q:w=1.3:g=2,equalizer=f=7500:t=q:w=1:g=-1.5,acompressor=threshold=-24dB:ratio=2.5:attack=6:release=110:makeup=1,aecho=0.9:0.55:19|31:0.09|0.05,apad=pad_dur=0.25"
def lufs(f):
  o=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
  return float(re.findall(r'I:\s+(-?[\d.]+) LUFS',o)[-1])
for i,l in enumerate(L):
  subprocess.run(['ffmpeg','-y','-v','error','-i',f'vo/raw{i:02d}.wav','-af',CHAIN,'-ar','24000',f'vo/p{i:02d}.wav'],check=True)
  g=-22.0-lufs(f'vo/p{i:02d}.wav')
  subprocess.run(['ffmpeg','-y','-v','error','-i',f'vo/p{i:02d}.wav','-af',f'volume={g:.2f}dB','-ar','24000',f'vo/l{i:02d}.wav'],check=True)
# shots 1-2 have no narration (cold open + mascot); fixed minimum durations, narration offset per shot
NSHOTS=6; MIN={1:3.6,2:2.5,3:9.6,4:5.8,5:5.4,6:4.6}; LEAD={3:.25,4:.35,5:.3,6:.3}; TAIL={6:2.2}; GAP=.2
t=0; out={'shots':[]}; sr=24000
for s in range(1,NSHOTS+1):
  lines=[(i,l) for i,l in enumerate(L) if l['shot']==s]; cur=LEAD.get(s,.2); sl=[]
  for n,(i,l) in enumerate(lines):
    if n>0: cur+=l['gap']-GAP
    v0=cur; sl.append({'i':i,'spk':l['spk'],'v0':round(t+v0,3),'vd':l['dur'],'words':[{'w':w['w'],'hl':w['hl'],'t':round(t+v0+w['t'],3)} for w in l['words']],'env':l['env']})
    cur=v0+l['dur']+GAP
  dur=max(MIN[s],(cur-GAP+TAIL.get(s,.35)) if lines else 0)
  out['shots'].append({'start':round(t,3),'lines':sl}); t+=dur
out['total']=round(t,3)
voice=np.zeros(int((t+1)*sr),dtype=np.float32)
for sh in out['shots']:
  for ln in sh['lines']:
    a,_=sf.read(f"vo/l{ln['i']:02d}.wav",dtype='float32'); j=int(ln['v0']*sr); voice[j:j+len(a)]+=a
voice=voice[:int(t*sr)]; sf.write('vo/voice.wav',voice,sr)
subprocess.run(['ffmpeg','-y','-v','error','-i','vo/voice.wav','-ac','1','-b:a','128k','vo/voice.mp3'],check=True)
json.dump(out,open('vo/timing.json','w'))
print('TOTAL',round(t,2)); print([s['start'] for s in out['shots']])
for k,sh in enumerate(out['shots']): print(k+1,' | '.join(' '.join(w['w']+'@'+format(w['t']-sh['start'],'.2f') for w in ln['words']) for ln in sh['lines']))
