"""Soundtrack for the Monopoly / Lizzie Magie episode (ragtime-flavoured): original score + foley, mixed offline.
Samples: VSCO 2 Community Edition (CC0) and Kenney audio packs (CC0). Synthesised: tanpura drone, harmonium, ambiences.
Writes vo/music_raw.wav (score) and out/sfx.wav (effects); bed.py then ducks the score under the narration."""
import json, re, glob, os, numpy as np, soundfile as sf
SR=48000; rng=np.random.default_rng(5)
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
            n=int(dur*SR); x=x[:n+int(rel*SR)].copy(); r=int(rel*SR)
            if len(x)>n: x[n:]*=np.linspace(1,0,len(x)-n)
        return x
PIZZ=Inst(V+'Strings/Violin Section/Pizz/*.wav',12)
CPIZZ=Inst(V+'Strings/Cello Section/pizzT/*.wav',12,pick='v2_RR1')
BSN=Inst(V+'Woodwinds/Bassoon/stac/*.wav',12,pick='v2_rr1')
BSNS=Inst(V+'Woodwinds/Bassoon/sus/*.wav',12,pick='v2_1')
HARP=Inst(V+'Strings/Harp/*.wav',0)
GLOCK=Inst(V+'Percussion/Glock/*.wav',-12)
TBF=Inst(V+'Brass/OldTrombone/Fall/*.wav',12,pick='_1')
TUBA=Inst(V+'Brass/Tuba/stac/*.wav',12,pick='v2_rr4')

class Piano:
    def __init__(s,dyn=2):
        s.m={}
        for f in sorted(glob.glob(V+f'Keys/Upright Piano/Player_dyn{dyn}_rr1_*.wav')):
            n=int(re.search(r'_(\d+)\.wav',f).group(1)); s.m[21+2*n]=f
    def note(s,midi,dur=None,rel=.15):
        k=min(s.m,key=lambda q:abs(q-midi)); x=shift(load(s.m[k]),midi-k)
        if dur is not None:
            n=int(dur*SR); x=x[:n+int(rel*SR)].copy()
            if len(x)>n: x[n:]*=np.linspace(1,0,len(x)-n)
        return x
PNO=Piano(2); PNOs=Piano(1)
SNT=[load(f) for f in sorted(glob.glob(V+'Percussion/Snare2-taps_v*_rr1_Sum.wav'))[:3]]
P=lambda f: load(V+'Percussion/'+f)
TUMBA=P('Tumba-HitN_v2_rr1_Sum.wav'); QUINTO=P('Quinto-HitN_v2_rr1_Sum.wav'); CONGA=P('Conga-HitN_v2_rr1_Sum.wav'); TAP=P('Quinto-Tap1_v1_rr1_Sum.wav')
TIMP=[P(f'Timpani/Timpani{i}_Hit_v3_rr1_Sum.wav') for i in (1,2,3)]; CRASH=load(glob.glob(V+'Percussion/cymbal-crashshort*')[0])
SLEIGH=load(glob.glob(V+'Percussion/Sleighbells_Hit*')[0]); TAMB=P('Tamb1-Shake_v1_rr1_Sum.wav'); CLAVE=P('Claves1_Hit_v2_rr1_Sum.wav'); BD=P('BDrumNewhit_v5_rr1_Sum.wav')
ROLL=load(sorted(glob.glob(V+'Percussion/Timpani/Rolls/*'))[0]); GONG=P('gongHit_f.wav')
k=lambda f: load(K+f)
# ------------------------------------------------------------------ synths
def pluckKS(f,dur,damp=.9995,bright=.6):
    n=int(dur*SR); Pn=max(2,int(SR/f)); buf=rng.uniform(-1,1,Pn).astype(np.float64); out=np.zeros(n)
    for i in range(n):
        j=i%Pn; out[i]=buf[j]; buf[j]=damp*(bright*buf[j]+(1-bright)*buf[(j+1)%Pn])
    return out/np.abs(out).max()
_tp={}
def tanpura_string(f):
    if f in _tp: return _tp[f]
    x=pluckKS(f,3.2,.99985,.55); x=.7*x+.3*np.tanh(3.5*x)       # jawari buzz
    x*=np.minimum(1,np.arange(len(x))/(SR*.01)); _tp[f]=x.astype(np.float32); return _tp[f]
def harmonium(f,dur,vel=1.0):
    n=int((dur+.12)*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for h in range(1,13): x+=np.sin(2*np.pi*f*h*t)/(h**.85)*(1 if h%2 else .7)
    x+=.6*np.sin(2*np.pi*f*1.0018*t)+.25*np.sin(2*np.pi*f*2*1.002*t)             # second reed, slightly sharp
    env=np.minimum(1,t/.035)*np.where(t<dur,1,np.exp(-(t-dur)/.05))*(1+.06*np.sin(2*np.pi*4.6*t))
    return (x*env/8*vel).astype(np.float32)
def noise(dur,lo=200,hi=4000,col=0):
    n=int(dur*SR); x=rng.normal(0,1,n); X=np.fft.rfft(x); fr=np.fft.rfftfreq(n,1/SR)
    X*=((fr>lo)&(fr<hi))/(np.maximum(fr,1)**(col/2)); y=np.fft.irfft(X,n); return (y/np.abs(y).max()).astype(np.float32)
def chirp(f0,f1,dur):
    t=np.arange(int(dur*SR))/SR; ph=2*np.pi*np.cumsum(np.linspace(f0,f1,len(t)))/SR; return (np.sin(ph)*np.sin(np.pi*t/dur)).astype(np.float32)
mid=lambda m:440*2**((m-69)/12)
# ------------------------------------------------------------------ busses
n=int(SR*(TOTAL+3)); MUS=np.zeros((n,2),np.float32); FX=np.zeros((n,2),np.float32)
def put(bus,x,t0,g=1.0,pan=0.0):
    i=int(t0*SR)
    if i<0: x=x[-i:]; i=0
    if i>=n or len(x)==0: return
    m=min(len(x),n-i); bus[i:i+m,0]+=x[:m]*g*(1-pan)*.9; bus[i:i+m,1]+=x[:m]*g*(1+pan)*.9
mus=lambda x,t0,g=1,pan=0: put(MUS,x,t0,g,pan)
def gate(a,b,f=.03):
    i0,i1,fl=int(a*SR),int(b*SR),int(f*SR); MUS[i0-fl:i0]*=np.linspace(1,0,fl)[:,None]; MUS[i0:i1]=0; MUS[i1:i1+fl]*=np.linspace(0,1,fl)[:,None]
fx=lambda x,t0,g=1,pan=0: put(FX,x,t0,g,pan)
# ------------------------------------------------------------------ score helpers (key: D, Sa = D)
SA=62
def drone(t0,t1,g=.11):
    t=t0; pat=[SA-17,SA-12,SA-12,SA-24]
    i=0
    while t<t1-.3: mus(tanpura_string(mid(pat[i%4]))[:int(min(3.2,t1-t+.6)*SR)],t,g*(1.2 if i%4==3 else 1),-.3+.15*(i%4)); t+=.62; i+=1
BOLS={'dha':lambda:TUMBA*.9+np.pad(QUINTO,(0,max(0,len(TUMBA)-len(QUINTO))))[:len(TUMBA)]*.5,'ge':lambda:shift(TUMBA,-5),'na':lambda:shift(QUINTO,2),'ti':lambda:shift(TAP,3),'ka':lambda:TAP*.7,'dhi':lambda:shift(TUMBA,-2)*.9}
_b={}
def bol(name):
    if name not in _b: _b[name]=BOLS[name]().astype(np.float32)
    return _b[name]
KEHERWA=['dha','ge','na','ti','na','ka','dhi','na']
def groove(t0,t1,bpm=116,g=.5,pat=KEHERWA,swing=.06):
    e=60/bpm/2; t=t0; i=0
    while t<t1-.02:
        q=i%8; b=pat[q]
        if b: mus(bol(b),t+(swing*e if q%2 else 0),g*(1.0 if q in (0,6) else .7),.15 if b in ('na','ti','ka') else -.1)
        t+=e; i+=1
    return e
def melody(seq,t0,e,inst='harm',g=.5,oct=0):
    t=t0
    for it in seq:
        if it is None: t+=e; continue
        m,l=(it if isinstance(it,tuple) else (it,1)); m+=oct
        if inst=='harm': mus(harmonium(mid(m),l*e*.95),t,g*.9,.1)
        elif inst=='pizz': mus(PIZZ.note(m),t,g,.2)
        elif inst=='cpizz': mus(CPIZZ.note(m),t,g,-.2)
        elif inst=='bsn': mus(BSN.note(m),t,g,-.1)
        elif inst=='harp': mus(HARP.note(m),t,g,.25)
        elif inst=='glock': mus(GLOCK.note(m),t,g,.3)
        elif inst=='tuba': mus(TUBA.note(m),t,g,-.15)
        t+=l*e
    return t
D4,E4,Fs4,G4,A4,B4,D5,E5=62,64,66,67,69,71,74,76
THEME=[(A4,1),(B4,1),(A4,1),(Fs4,1),(E4,1),(Fs4,1),(D4,2),(E4,1),(Fs4,1),(A4,1),(B4,1),(A4,2),(Fs4,2)]
THEME2=[(D5,1),(B4,1),(A4,1),(B4,1),(A4,1),(Fs4,1),(E4,2),(Fs4,1),(E4,1),(D4,1),(E4,1),(D4,4)]
SNEAK=[(50,1),None,(53,1),None,(55,1),None,(53,1),(52,1),(50,1),None,(48,1),None,(50,2),None,None]
# ================================================================== the score (key of C; ragtime oom-pah)
def chord_notes(root,kind='maj'): return [root,root+(4 if kind=='maj' else 3),root+7]
PROG=[(48,'maj'),(48,'maj'),(53,'maj'),(48,'maj'),(43,'maj'),(43,'maj'),(48,'maj'),(43,'maj')]   # C C F C G G C G
def rag(t0,t1,bpm=104,g=.5,prog=PROG,tuba=True,snare=True):
    q=60/bpm; t=t0; i=0
    while t<t1-.05:
        root,kind=prog[(i//2)%len(prog)]
        if i%2==0:
            mus(PNO.note(root-12,q*.9),t,g*.8,-.2)
            if tuba: mus(TUBA.note(root-12),t,g*.55,-.3)
        else:
            for m in chord_notes(root+12,kind): mus(PNO.note(m,q*.6),t,g*.42,.05)
            if snare: mus(SNT[i%len(SNT)],t,g*.25,.2)
        t+=q; i+=1
def mel(seq,t0,q,g=.5,inst=None):
    t=t0; inst=inst or PNO
    for it in seq:
        if it is None: t+=q; continue
        m,l=it; mus(inst.note(m,l*q*.95) if inst in (PNO,PNOs) else inst.note(m),t,g,.2); t+=l*q
    return t
C5,D5,E5,F5,G5,A5,B4,A4,G4=72,74,76,77,79,81,71,69,67
RAG=[(E5,.5),(G5,.5),(None,0) if False else (E5,.5),(C5,.5),(D5,.75),(E5,.25),(C5,1),(A4,.5),(C5,.5),(D5,.5),(E5,.5),(G5,1.5),(None,0)][:12]
RAG=[x for x in RAG if x[0] is not None]
RAG2=[(G5,.5),(A5,.5),(G5,.5),(E5,.5),(F5,.75),(E5,.25),(D5,1),(B4,.5),(D5,.5),(G5,.5),(F5,.5),(E5,2)]
SADP=[(60,1.5),(63,.5),(67,2),(65,1),(63,1),(62,2)]
def sad_chords(t0,t1,g=.4,q=1.2):
    t=t0; P_=[(48,'min'),(44,'maj'),(43,'maj'),(48,'min')]; i=0
    while t<t1-.1:
        r,k=P_[i%4]; mus(PNOs.note(r-12,q*1.6),t,g*.8)
        for j,m in enumerate(chord_notes(r+12,k)): mus(PNOs.note(m,q*1.4),t+j*.04,g*.45)
        t+=q; i+=1
q104=60/104
# 1 hook: rich ragtime, then deflate for her
kw=W(1,'woman'); kd1=W(1,'dollars')
rag(0,kw-.05,112,.55); mel(RAG,.05,60/112/2,.5)
mus(PNOs.note(60,1.2),kw+.05,.5); mus(PNOs.note(55,1.2),kw+.7,.45); mus(TBF.note(55),kd1-.05,.7); mus(TBF.note(50),kd1+.45,.6)
# 2 1904: gentle rag + typewriter; stamp
rag(S[2],SE(2)-.05,100,.38,snare=False); mel(RAG2,S[2]+.2,60/100/2,.38)
mus(TIMP[2],W(2,'game')-.05,.6); [mus(GLOCK.note(m),W(2,'game')+i*.06,.35) for i,m in enumerate([C5,E5,G5])]
# 3 the point: cheeky pizz walk; coins; broke
melody([(48,1),(52,1),(55,1),(57,1),(55,1),(52,1),(48,2)],S[3]+.05,q104/1.5,'cpizz',.55)
mus(TUBA.note(43),W(3,'rich')+.2,.6); mus(BSN.note(40),W(3,'broke')-.05,.6); mus(TBF.note(48),W(3,'broke')+.25,.55)
# 4 two sets of rules
rag(S[4],SE(4)-.05,104,.32,tuba=False,snare=False)
[mus(GLOCK.note(m),W(4,'shares')+i*.07,.4) for i,m in enumerate([C5,E5,G5,C5+12])]
kc4=W(4,'crushes'); mus(TIMP[0],kc4,.9); mus(TUBA.note(36),kc4,.8); mus(CRASH,kc4,.35)
# 5 guess: drum roll, ta-da
kc5=W(5,'caught'); mus(ROLL[:int((kc5-S[5]+.05)*SR)],S[5],.45); mus(CRASH,kc5,.55); [mus(PNO.note(m,.9),kc5+i*.03,.5) for i,m in enumerate([48,60,64,67,72])]
# 6 by hand: soft rag
rag(S[6],SE(6)-.05,96,.3,tuba=False); mel(RAG[:8],S[6]+.1,60/96/2,.3)
# 7 Depression: minor and slow; idea; Parker Brothers rag; stamp
kl7=W(7,'learned'); ka7=W(7,'and'); ko7=W(7,'own')
sad_chords(S[7],kl7,.42,1.25); mel([(63,1),(62,.5),(60,1.5),(58,1),(60,2)],S[7]+.4,.42,.32)
[mus(GLOCK.note(m),W(7,'friend')+i*.05,.45) for i,m in enumerate([G5,C5+12])]
rag(ka7-.05,SE(7)-.05,108,.42); mel(RAG2,ka7,60/108/2,.4)
mus(TIMP[1],ko7-.2,.7); mus(PIZZ.note(60),ko7+.1,.5); mus(PIZZ.note(55),ko7+.3,.5)
# 8 rich, then $500
kp8=W(8,'parker'); kf8=W(8,'five')
rag(S[8],kp8-.12,120,.6); mel(RAG,S[8]+.02,60/120/2,.55); mus(SLEIGH,S[8]+.1,.45)
sad_chords(kp8-.05,SE(8)-.05,.38,1.1); mus(TBF.note(52),W(8,'dollars')-.05,.6)
# 9 1970s: tension, reveal
ka9=W(9,'anti'); mus(ROLL[:int((ka9+.5-S[9])*SR)]*np.linspace(.2,1,int((ka9+.5-S[9])*SR)).astype(np.float32),S[9],.32)
melody([(36,2),(36,2),(39,2),(36,2)],S[9]+.1,.38,'tuba',.4)
mus(CRASH,ka9+.5,.5); mus(TIMP[0],ka9+.5,.8); [mus(GLOCK.note(m),ka9+.55+i*.07,.4) for i,m in enumerate([C5,E5,G5,C5+12])]
# 10 the census: solo piano, silence after zero, last chord
kz=W(10,'zero')
mel(SADP,S[10]+.1,.5,.42,PNOs); [mus(PNOs.note(m,2.5),S[10]+.1,.28) for m in (36,43)]
[mus(PNOs.note(m,3.0),kz+1.1+i*.05,.38) for i,m in enumerate([36,48,55,60,64])]
# ================================================================== foley
def stamp(t0,g=1): fx(k('RPG sounds (50 sounds)/bookPlace1.ogg'),t0,1.0*g); fx(shift(TIMP[2],-5)[:int(.5*SR)],t0,.35*g); fx(k('Casino sounds (50 sounds)/cardPlace2.ogg'),t0+.01,.7*g)
cs=lambda i: k(f'Casino sounds (50 sounds)/cardSlide{i}.ogg')
flip=lambda i: k(f'RPG sounds (50 sounds)/bookFlip{i}.ogg')
step=lambda i: k(f'RPG sounds (50 sounds)/footstep0{i%10}.ogg')
coins=k('RPG sounds (50 sounds)/handleCoins.ogg'); coins2=k('RPG sounds (50 sounds)/handleCoins2.ogg')
pop=lambda i=1: k(f'UI sounds (50 sounds)/rollover{i}.ogg'); click=lambda i=1: k(f'UI sounds (50 sounds)/click{i}.ogg')
shuffle=k('Casino sounds (50 sounds)/cardShuffle.ogg'); fan_=k('Casino sounds (50 sounds)/cardFan1.ogg')
def room(t0,t1,g=.1,lo=100,hi=1500): d=t1-t0; x=noise(d,lo,hi,1); fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.15)).astype(np.float32); fx(x*fade,t0,g)
# 1
for j in range(6): fx(shuffle if j%2 else fan_,W(1,'rich')-.1+j*.35,.35)
room(kw,S[2],.05)
# 2 typewriter
kt=W(2,'typist')+.6
tt=S[2]+.1
while tt<kt: fx(click(1+int(tt*7)%5)*1.0,tt,.55); tt+=.09+.05*abs(np.sin(tt*13))
fx(GLOCK.note(96)*.6,kt-.05,.3); stamp(W(2,'game')-.05,1.1)
# 3
for i in range(3): fx(coins if i%2 else coins2,W(3,'rich')-.25+i*.12+.25,.4)
fx(k('RPG sounds (50 sounds)/cloth1.ogg'),W(3,'everyone')+.25,.5)
# 4
for i in range(6): fx(noise(.08,2500,7000,0),S[4]+.25+i*.11,.12)
fx(pop(2),W(4,'one')-.1,.5); fx(pop(3),W(4,'other')-.1,.5); fx(coins,W(4,'shares'),.45); stamp(kc4,.7)
# 5
fx(k('RPG sounds (50 sounds)/creak2.ogg'),kc5,.5)
# 6 pencils
tt=S[6]+.1
while tt<SE(6)-.3: fx(noise(.12,1800,6000,0)*np.hanning(int(.12*SR)).astype(np.float32),tt,.18); tt+=.15
stamp(W(6,'hand')-.05,.8)
# 7
w7=W(7,'charles')-.2
for j in range(6): fx(step(j),S[7]+.2+j*(w7-S[7]-.2)/6,.5)
room(S[7],kl7-.1,.12,300,3000)
fx(cs(2),ka7+.1,.6); fx(k('RPG sounds (50 sounds)/doorClose_1.ogg'),ka7-.05,.35); stamp(ko7-.25,.9)
# 8
for j in range(7): fx(shuffle if j%2 else fan_,S[8]+j*.18,.35)
fx(cs(4),W(8,'bought')-.2,.6)
# 9
room(S[9],SE(9),.14,250,2500); fx(k('RPG sounds (50 sounds)/bookPlace3.ogg'),S[9]+.3,.6); fx(k('RPG sounds (50 sounds)/bookOpen.ogg'),ka9+.45,.7)
# 10
for i in range(int((W(10,'games')+.4-W(10,'maker'))/.09)): fx(noise(.07,2200,7000,0),W(10,'maker')+i*.09,.16)
for i in range(3): fx(noise(.07,2200,7000,0),kz+i*.09,.2)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('ok total',TOTAL)
