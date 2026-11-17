"""Soundtrack for Ice to Calcutta (adapted from tn/vo/sound.py). Brief section 5.
Samples: VSCO 2 Community Edition (CC0) and Kenney audio packs (CC0); a few effects are synthesized here from noise (sea, scrape, hiss, crackle).
The score runs on ONE beat grid for the whole film (BPM from vo/timing.json; timeline.py starts every shot on a beat).
Sections change the arrangement only: bright (harp + glock, the ice) -> soft (the question) -> pizz (the steps, a pluck per block)
-> tense (ten days in the tropics) -> roll (arrival) -> pizz (the real melting, falling trombone on 'thirty') -> hush -> out at the door slam.
Writes vo/music_raw.wav (score) and out/fx_real.wav (foley); bed.py then ducks the score under the voice."""
import json, re, glob, os, numpy as np, soundfile as sf
SR=48000; rng=np.random.default_rng(7)
D=os.environ.get('ASSETS_DIR',os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets'))+'/'
V=D+'VSCO-2-CE/'; K=D+'kenney-audio-assets/Audio (295 files)/'
T=json.load(open('vo/timing.json')); TOTAL=T['total']; S=[0]+[s['start'] for s in T['shots']]
NS=len(T['shots']); SE=lambda n: S[n+1] if n<NS else TOTAL
normW=lambda w: re.sub(r"[^a-z0-9']",'',w.lower())
def W(n,p,nth=0):
    ws=[w for l in T['shots'][n-1]['lines'] for w in l['words'] if normW(w['w']).startswith(normW(p))]
    return ws[nth]['t']
# ------------------------------------------------------------------ loading / resampling
_c={}
def load(path):
    if path in _c: return _c[path]
    x,sr=sf.read(path,dtype='float32'); x=x.mean(1) if x.ndim>1 else x
    if sr!=SR: x=np.interp(np.arange(0,len(x)*SR/sr)*sr/SR,np.arange(len(x)),x).astype(np.float32)
    _c[path]=x; return x
def shift(x,semi):
    if abs(semi)<1e-3: return x
    r=2**(semi/12); idx=np.arange(0,len(x)-1,r); return np.interp(idx,np.arange(len(x)),x).astype(np.float32)
NOTE={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
class Inst:
    def __init__(s,pattern,off=0,pick=None):
        s.m={}
        for f in sorted(glob.glob(pattern)):
            m=re.search(r'_([A-G]#?)(-?\d)[_.]',os.path.basename(f))
            if not m: continue
            if pick and not re.search(pick,os.path.basename(f)): continue
            midi=(int(m.group(2))+1)*12+NOTE[m.group(1)]+off; s.m.setdefault(midi,f)
        assert s.m, pattern
    def note(s,midi,dur=None,rel=.08):
        k=min(s.m,key=lambda q:abs(q-midi)); x=shift(load(s.m[k]),midi-k)
        if dur is not None:
            n=int(dur*SR); x=x[:n+int(rel*SR)].copy()
            if len(x)>n: x[n:]*=np.linspace(1,0,len(x)-n)
        return x
PIZZ=Inst(V+'Strings/Violin Section/Pizz/*.wav',12)
CPIZZ=Inst(V+'Strings/Cello Section/pizzT/*.wav',12,pick='v2_RR1')
CSUS=Inst(V+'Strings/Cello Section/susvib/*.wav',12)
BSN=Inst(V+'Woodwinds/Bassoon/stac/*.wav',12,pick='v2_rr1')
BSNS=Inst(V+'Woodwinds/Bassoon/sus/*.wav',12,pick='v2_1')
HARP=Inst(V+'Strings/Harp/*.wav',0)
GLOCK=Inst(V+'Percussion/Glock/*.wav',-12)
TBF=Inst(V+'Brass/OldTrombone/Fall/*.wav',12,pick='_1')
TUBA=Inst(V+'Brass/Tuba/stac/*.wav',12,pick='v2_rr4')
P=lambda f: load(V+'Percussion/'+f)
TIMP=[P(f'Timpani/Timpani{i}_Hit_v3_rr1_Sum.wav') for i in (1,2,3)]
CLAVE=P('Claves1_Hit_v2_rr1_Sum.wav'); TAP=P('Quinto-Tap1_v1_rr1_Sum.wav'); BD=P('BDrumNewhit_v5_rr1_Sum.wav')
ROLL=load(sorted(glob.glob(V+'Percussion/Timpani/Rolls/*'))[0])
k=lambda f: load(K+f)
# ------------------------------------------------------------------ synths
def noise(dur,lo=200,hi=4000,col=0):
    n=int(dur*SR); x=rng.normal(0,1,n); X=np.fft.rfft(x); fr=np.fft.rfftfreq(n,1/SR)
    X*=((fr>lo)&(fr<hi))/(np.maximum(fr,1)**(col/2)); y=np.fft.irfft(X,n); return (y/np.abs(y).max()).astype(np.float32)
def env(n,a=.02,r=.2):
    i=np.arange(n)/SR; d=n/SR; return np.minimum(1,np.minimum(i/max(a,1e-3),(d-i)/max(r,1e-3))).clip(0,1).astype(np.float32)
mid=lambda m:440*2**((m-69)/12)
# ------------------------------------------------------------------ busses
n=int(SR*(TOTAL+3)); MUS=np.zeros((n,2),np.float32); FX=np.zeros((n,2),np.float32)
def put(bus,x,t0,g=1.0,pan=0.0):
    i=int(t0*SR)
    if i<0: x=x[-i:]; i=0
    if i>=n or len(x)==0: return
    m=min(len(x),n-i); bus[i:i+m,0]+=x[:m]*g*(1-pan)*.9; bus[i:i+m,1]+=x[:m]*g*(1+pan)*.9
mus=lambda x,t0,g=1,pan=0: put(MUS,x,t0,g,pan)
fx=lambda x,t0,g=1,pan=0: put(FX,x,t0,g,pan)

# ================================================================== the score: one grid, sections change the arrangement
BPM=T.get('bpm',104); Q=60/BPM; NB=int(round(TOTAL/Q))
beat=lambda t: int(round(t/Q))
def chord_notes(root,kind='maj'): return [root,root+(4 if kind=='maj' else 3),root+7]
PROG_MAJ=[(48,'maj'),(48,'maj'),(53,'maj'),(53,'maj'),(45,'min'),(45,'min'),(43,'maj'),(43,'maj')]
PROG_MIN=[(45,'min'),(45,'min'),(41,'maj'),(41,'maj'),(48,'maj'),(48,'maj'),(40,'maj'),(40,'maj')]
BED=np.zeros((n,2),np.float32); bed=lambda x,t0,g=1,pan=0: put(BED,x,t0,g,pan)
# ---- cut times (must match CUT_EP in src/shots.js)
cut=lambda sh,w,off: W(sh,w)+off
C1=[cut(1,'tons',-.1),cut(1,'four',-.1),cut(1,'twice',-.15)]; C2=[cut(2,'step',-.1),cut(2,'two',-.1)]; C3=[cut(3,'one',-.3),cut(3,'less',-.1)]
C4=[cut(4,'foot',-.3),cut(4,'on',-.05),cut(4,'hay',-.6)]; C6=[cut(6,'with',-.07)]
C7=[cut(7,'four',-.1),cut(7,'days',-.1),cut(7,'almost',-.07)]; C8=[cut(8,'raised',-.1),cut(8,'ice',-.25),cut(8,'house',0)]
SLAM=C8[2]+.75                                     # the ice-house door shuts (sh8_d: slam=.75)
# (start, mode, level dB)
SECT=[(0,'bright',-1),(S[2],'soft',-5),(C2[0],'pizz',-3),(S[5],'tense',-4),(S[6],'roll',-2),(S[7],'pizz',-4),(S[8],'hush',-7),(SLAM,'out',-99)]
SECT=[(beat(t)*Q if m!='out' else t,m,l) for t,m,l in SECT]
def mode_at(t):
    cur=SECT[0]
    for s_ in SECT:
        if t>=s_[0]-1e-6: cur=s_
    return cur
for i in range(NB):
    t=i*Q; _,mode,_lv=mode_at(t); bar=(i//2)%8; down=i%2==0
    root,kind=(PROG_MIN if mode=='tense' else PROG_MAJ)[bar]
    if mode=='out': continue
    if mode=='bright':                                                               # glassy: harp arpeggio in eighths, glock on the bar, cello pizz root
        ch=chord_notes(root+24,kind)+[root+36]
        for j in (0,1): bed(HARP.note(ch[(i*2+j)%4]),t+j*Q/2,.34,.25)
        if down: bed(CPIZZ.note(root),t,.55,-.2)
        if i%4==0: bed(GLOCK.note(root+48),t,.16,.3)
    elif mode=='soft':                                                               # the question: low bassoon held, harp only on the downbeat
        if i%4==0: bed(BSNS.note(root-12,Q*3.6,.3),t,.32,-.2)
        if down: bed(HARP.note(chord_notes(root+24,kind)[(i//2)%3]),t,.28,.25)
    elif mode=='pizz':                                                               # the steps: cello pizz root, violin pizz chord on the off-beat
        if down: bed(CPIZZ.note(root),t,.55,-.2)
        else:
            for m in chord_notes(root+24,kind)[:2]: bed(PIZZ.note(m),t,.3,.2)
        if i%8==4: bed(HARP.note(root+36),t,.2,.3)
    elif mode=='tense':                                                              # ten days: low ostinato, a tap every beat counting the days
        if down: bed(BSN.note(root-12),t,.55,-.15); bed(CPIZZ.note(root),t,.35,-.2)
        else: bed(BSN.note(root-5),t,.4,-.1)
        bed(TAP,t,.22,.2)
    elif mode=='roll':                                                               # arrival: warm, full harp rolls and held cello
        if i%4==0: bed(CSUS.note(root,Q*3.7,.3),t,.3,-.2)
        if down:
            for j,m in enumerate(chord_notes(root+24,kind)+[root+36]): bed(HARP.note(m),t+j*.045,.3,.25)
    elif mode=='hush':                                                               # the end: sparse high harp, bassoon breath
        if i%4==0: bed(BSNS.note(root-12,Q*3.6,.4),t,.22,-.2)
        if down: bed(HARP.note(chord_notes(root+36,kind)[(i//2)%3]),t,.22,.25)
def rms_db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
edges=[s_[0] for s_ in SECT]+[TOTAL]; gain=np.ones(n,np.float32); ref=None; report=[]
for si,(t0,m,lv) in enumerate(SECT):
    a,b=int(t0*SR),int(edges[si+1]*SR)
    if m=='out' or b-a<SR*.3: continue
    r=float(rms_db(BED[a:b]))
    if ref is None: ref=r-lv
    g=float(np.clip(ref+lv-r,-12,12)); gain[a:b]=10**(g/20); report.append((round(t0,2),m,lv,round(r-ref,1),round(g,1)))
fl=int(SR*.06); ker=np.ones(fl,np.float32)/fl; gain=np.convolve(gain,ker,'same')
BED*=gain[:,None]; MUS+=BED
print('sections (start, mode, target dB, measured before, gain applied):'); [print(' ',r_) for r_ in report]
# stingers on word cues
[mus(GLOCK.note(m),W(1,'ice')+i*.06,.24) for i,m in enumerate([84,88,91])]           # 'ice' on the globe
mus(TIMP[1],W(1,'twice')-.03,.45)
mus(TIMP[0],C3[0]+.05,.35); [mus(GLOCK.note(m),C3[0]+.3+i*.07,.22) for i,m in enumerate([79,84,88])]   # one giant block
mus(TBF.note(50),W(7,'thirty')+.05,.36)                                               # the falling trombone
mus(TIMP[2],W(7,'real')-.03,.4)
ln=min(len(ROLL),int((W(6,'september')-S[6]+.3)*SR)); mus(ROLL[:ln]*np.linspace(.15,1,ln).astype(np.float32),S[6],.22)
# the final chord rings out after the slam (music section is 'out', so it is the only music there)
for j,m in enumerate([60,64,67,72,76]): mus(HARP.note(m),SLAM+.18+j*.06,.3,.2)
mus(GLOCK.note(84),SLAM+.5,.18)

# ================================================================== foley (Kenney CC0, VSCO CC0, synthesized)
step=lambda i: k(f'RPG sounds (50 sounds)/footstep0{i%10}.ogg'); creak=lambda i: k(f'RPG sounds (50 sounds)/creak{1+i%3}.ogg')
clink=lambda i: k(f'Casino sounds (50 sounds)/chipLay{1+i%3}.ogg'); coins=lambda i: k(f'RPG sounds (50 sounds)/handleCoins{"" if i%2==0 else "2"}.ogg')
cloth=lambda i: k(f'RPG sounds (50 sounds)/cloth{1+i%4}.ogg'); chop=k('RPG sounds (50 sounds)/chop.ogg'); slide=lambda i: k(f'Casino sounds (50 sounds)/cardSlide{1+i%8}.ogg')
def sea(t0,t1,g=.08): d=t1-t0; x=noise(d,80,900,1)*(.7+.3*np.sin(np.arange(int(d*SR))/SR*2*np.pi*.35)).astype(np.float32); fx(x*env(len(x),.2,.2),t0,g)
def room(t0,t1,g=.05,lo=100,hi=1500): d=t1-t0; x=noise(d,lo,hi,1); fx(x*env(len(x),.15,.15),t0,g)
def thunk(t0,g=.5,p=-6): fx(shift(TIMP[2],p)[:int(.35*SR)]*env(int(.35*SR),.002,.2),t0,g*.6); fx(clink(int(t0*10)),t0+.005,g*.5)
def drip(t0,g=.2,p=0): x=np.sin(2*np.pi*np.cumsum(np.linspace(1500+p,2600+p,int(.06*SR)))/SR).astype(np.float32)*env(int(.06*SR),.002,.05); fx(x,t0,g)
def crackle(t0,dur,g=.25,dens=60):
    for i in range(int(dur*dens)):
        q=rng.random(); x=noise(.012,2500,9000,0)*env(int(.012*SR),.001,.01); fx(x,t0+q*dur,g*(.4+.6*rng.random()))
def scrape(t0,dur,g=.18): x=noise(dur,1800,7000,0)*(.6+.4*np.sin(np.arange(int(dur*SR))/SR*2*np.pi*7)).astype(np.float32); fx(x*env(len(x),.05,.15),t0,g)
def hiss(t0,dur,g=.2): x=noise(dur,3000,11000,0); fx(x*np.exp(-np.arange(len(x))/SR*3.5).astype(np.float32)*env(len(x),.01,.1),t0,g)
def rustle(t0,dur,g=.2): x=noise(dur,600,5000,0)*np.abs(np.sin(np.arange(int(dur*SR))/SR*2*np.pi*5)).astype(np.float32); fx(x*env(len(x),.04,.1),t0,g)
def whoosh(t0,dur=.25,g=.18): x=noise(dur,300,3000,0)*np.hanning(int(dur*SR)).astype(np.float32); fx(x,t0,g)
# 1 hook: frost crackles across the block, ship creaks; sea under the open-ocean cuts; two jumps over the line
sea(0,C1[0],.05); fx(creak(0),.3,.25); crackle(.2,1.1,.22); drip(1.6,.18); fx(creak(1),1.9,.2)
room(C1[0],C1[1],.03,200,2000)
sea(C1[1],S[2],.09); fx(creak(2),C1[1]+.6,.2)
fx(cloth(0),C1[1]+1.25,.35); thunk(C1[1]+1.72,.45,-8)
fx(cloth(1),C1[2]+.28,.35); thunk(C1[2]+.78,.45,-8); fx(slide(2),C1[2]+.5,.25)               # x2 scratched on the mast
# 2 deck: hat fanning, a drip; the pond: cutter scrape, horse steps, chips; the grid of blocks
sea(S[2],C2[0],.05)
for i in range(5): whoosh(S[2]+.15+i*.57,.22,.12)
drip(S[2]+1.2,.2); drip(S[2]+2.0,.17,200)
scrape(C2[0],C2[1]-C2[0],.16)
for i in range(int((C2[1]-C2[0])/.31)): fx(step(i),C2[0]+.05+i*.31,.22)
for i in range(20): thunk(C2[1]+.1+i*.045,.18,-2)
fx(slide(4),C2[1]+.7,.4); fx(clink(2),C2[1]+1.0,.4)
# 3 the hold: blocks land and lock (a thunk each), the outline merges; the melting cube on deck
room(S[3],C3[1],.04,80,700)
for i in range(20): thunk(S[3]+.36+i*.085,.3 if i%4==0 else .2,-7+(i%3))
[drip(C3[1]+.9+i*.5,.16,i*120) for i in range(4)]; sea(C3[1],S[4],.04)
# 4 buried: landing, shovels of bark, the tannery hand-over, hay, stomps, the last nail
room(S[4],C4[0],.04,80,700); thunk(S[4]+.5,.45,-10); fx(cloth(2),S[4]+.48,.3)
for i in range(3): fx(chop,S[4]+.7+i*.35,.25)
fx(k('RPG sounds (50 sounds)/dropLeather.ogg'),C4[0]+.95,.6); fx(cloth(3),C4[0]+1.2,.3)
room(C4[1],S[5],.04,80,700)
for i in range(int((C4[2]-C4[1])/.35)): fx(chop,C4[1]+.1+i*.35,.28); rustle(C4[1]+.15+i*.35,.15,.06)
rustle(C4[2],.8,.16)
for i in range(4): fx(step(i+3),C4[2]+.85+i*.13,.35)
fx(k('RPG sounds (50 sounds)/metalClick.ogg'),C4[2]+1.64,.6); fx(shift(TIMP[2],-2)[:int(.3*SR)],C4[2]+1.64,.35)
# 5 tropics (one cut): hot deck creaks, cold hold; a tick for each DAY n between 'tropics' and 'ten' (src/shots.js sh5_a)
sea(S[5],S[6],.04); fx(creak(1),S[5]+.3,.22)
for i in range(3): whoosh(S[5]+.2+i*.63,.2,.1)
d0,d1=W(5,'tropics'),W(5,'ten')
for j in range(1,11): fx(shift(CLAVE,4),d0+j*(d1-d0)/10,.16)
# 6 the Hooghly: water and creaks; the hatch opens
sea(S[6],C6[0],.07); fx(creak(0),S[6]+.5,.22); fx(creak(2),C6[0],.45); fx(k('RPG sounds (50 sounds)/doorOpen_1.ogg'),C6[0]+.02,.35)
# 7 the docks: rope creak and heavy drips; chalk on the slate; the buyer's steps and drips
room(S[7],S[8],.03,150,2000)
fx(creak(1),S[7]+.2,.3); [drip(S[7]+.25+i*.28,.22,i*80) for i in range(6)]
for i in range(6): scrape(C7[0]+.25+i*.22,.12,.12)
for i in range(7): fx(step(i),C7[1]+.1+i*.25,.3); drip(C7[1]+.2+i*.25,.12,i*60)
fx(slide(6),C7[2]+.1,.3)
# 8 the huddle (8a wide, 8b the hat goes round, DAY 1-3), the ice house (8c: door opens, porter walks in), the slam and the cold puff
fx(coins(1),S[8]+.9,.4)
for kk in (.9,1.05,1.2,1.35): fx(clink(int(kk*10)),C8[0]+kk+.35,.4)
for kk in (.35,.62,1.05): fx(coins(int(kk*10)),C8[0]+kk+.3,.3)
fx(cloth(2),C8[0]+.55,.3); fx(cloth(3),C8[0]+1.5,.3)
for kk in (.05,.7,1.35): fx(shift(CLAVE,4),C8[0]+kk,.16)
fx(k('RPG sounds (50 sounds)/doorOpen_1.ogg'),C8[1]+.1,.3)
for i in range(4): fx(step(i+1),C8[1]+.25+i*.28,.25)
fx(k('RPG sounds (50 sounds)/creak3.ogg'),C8[2]+.15,.3)
fx(k('RPG sounds (50 sounds)/doorClose_4.ogg'),SLAM-.02,1.0); fx(shift(TIMP[0],-4)[:int(.6*SR)],SLAM,.55); hiss(SLAM+.04,1.0,.18); crackle(SLAM+.15,.7,.12,30)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('cuts',[round(x,2) for x in C1+C2+C3+C4+C6+C7+C8],'slam',round(SLAM,2)); print('ok total',TOTAL)
