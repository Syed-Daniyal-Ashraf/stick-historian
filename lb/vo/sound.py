"""Soundtrack for the Lal Bihari episode: original score + foley, mixed offline.
Samples: VSCO 2 Community Edition (CC0) and Kenney audio packs (CC0). Synthesised: tanpura drone, harmonium, ambiences.
Writes vo/music_raw.wav (score) and out/sfx.wav (effects); bed.py then ducks the score under the narration."""
import json, re, glob, os, numpy as np, soundfile as sf
SR=48000; rng=np.random.default_rng(5)
D=os.environ.get('ASSETS_DIR',os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','assets'))+'/'
V=D+'VSCO-2-CE/'; K=D+'kenney-audio-assets/Audio (295 files)/'
T=json.load(open('vo/timing.json')); TOTAL=T['total']; S=[0]+[s['start'] for s in T['shots']]
SE=lambda n: S[n+1] if n<13 else TOTAL
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
# ================================================================== the score, shot by shot
e=60/116/2
# 1 hook: drone + light groove; the DEAD stamp cuts it
k1=W(1,'dead')-.02
drone(0,SE(1),.09); groove(0,k1-.02,116,.38); melody([(D4-12,2),(A4-24,2)]*3,0,e*2,'cpizz',.3)
mus(TIMP[0],k1,1.0); mus(CRASH,k1,.4); mus(BSNS.note(SA-24,1.0),k1+.05,.5)
# 2 the land office: the theme
drone(S[2],SE(2),.09); groove(S[2],SE(2)-.05,116,.42); melody(THEME,S[2]+.15,e,'harm',.42)
melody([(D4-12,2),(A4-24,2)]*5,S[2],e*2,'cpizz',.3)
# 3 the records: tension to 'died', then the hit
kd3=W(3,'died'); drone(S[3],SE(3),.07)
mus(ROLL[:int((kd3-S[3])*SR)]*np.linspace(.15,1,int((kd3-S[3])*SR)).astype(np.float32),S[3],.35)
mus(TIMP[0],kd3-.02,1.0); mus(CRASH,kd3-.02,.35); mus(BSNS.note(SA-24,1.4),kd3+.05,.55); mus(BSNS.note(SA-25,1.0),kd3+.6,.5)
# 4 flashback: sneaky pizzicato villain line
melody(SNEAK,S[4]+.05,e*1.15,'cpizz',.55); melody([(d,1) if d else None for d in [None,D4,None,None,None,E4,None,None]*2],S[4]+.05,e*1.15,'pizz',.25)
groove(S[4]+.05,SE(4)-.05,100,.25,['dha',None,'na',None,'ge',None,'na',None])
mus(TUBA.note(SA-24),W(4,'and')-.05,.6); mus(BSN.note(SA-17),W(4,'land'),.6)
# 5 again and again: faster, stamp
t5=S[5]; groove(t5,SE(5)-.05,140,.38,['dha','na','na','na','dha','na','na','na'])
for i in range(7): mus(CLAVE,t5+i*.2,.25,.4)
mus(TIMP[2],W(5,'file')+.08,.7); mus(BSN.note(SA-12),W(5,'file')+.35,.4)
# 6 the name: playful theme
groove(S[6],SE(6)-.05,116,.38); melody(THEME2,S[6]+.1,e,'harm',.42); mus(BSNS.note(SA-24,.9),W(6,'the')-.02,.45)
# 7 arrest / kidnap / cinema / didn't work
melody(SNEAK,S[7]+.05,e,'cpizz',.5); melody([(D4,1),None,(65,1),None,(G4,1),None,(A4,2)]*2,W(7,'kidnapped')-.1,e*.9,'pizz',.3)
km7=W(7,'and')
for i in range(int((W(7,'it')-km7)/.25)): mus(PIZZ.note([D5,A4,Fs4,A4][i%4]),km7+i*.25,.18,.3)
kw7=W(7,'work'); mus(TBF.note(52),kw7-.15,.75); mus(TBF.note(47),kw7+.35,.6)
# 8 the bribe: pizz on every push
k8=[W(8,'bribed'),W(8,'gave')-.05,W(8,'back')+.15,W(8,'back')+.5]
for i,h in enumerate(k8): mus(PIZZ.note([A4,D4,A4,D4][i]),h+.1,.5); mus(CPIZZ.note([50,45,50,45][i]),h+.1,.45)
groove(S[8],SE(8)-.05,116,.25,['dha',None,'na',None,'dha','dha','na',None])
# 9 widow's pension
melody(THEME[:5],S[9]+.1,e,'harm',.35); kd9=W(9,'denied'); mus(TIMP[0],kd9,.7); mus(TBF.note(50),kd9+.1,.55)
# 10 election: festive, then the count
ka10=W(10,'about'); kv=W(10,'votes')
groove(S[10],ka10-.1,132,.55); melody(THEME+THEME2[:6],S[10]+.05,60/132/2,'harm',.45); mus(TAMB,S[10]+.1,.4); mus(TAMB,S[10]+1.0,.35)
mus(ROLL[:int((kv-ka10+.1)*SR)],ka10,.4); mus(GLOCK.note(A4+12),kv+.08,.5); mus(PIZZ.note(D4),kv+.45,.5); mus(PIZZ.note(A4-12),kv+.62,.5)
# 11 1994: calendar races, signature, ALIVE: full celebration
t11=S[11]; kn11=W(11,'ninety'); ko=W(11,'one'); ka=W(11,'alive')
tt=t11; d=.2
while tt<kn11: mus(CLAVE,tt,.28,.4); tt+=d; d=max(.07,d*.85)
mus(GONG,kn11,.4); drone(kn11,W(11,'he'),.08)
groove(W(11,'he')-.1,SE(11)+.05,140,.62); melody(THEME2,ka+.05,60/140/2,'harm',.5)
mus(TIMP[0],ka-.02,.9); mus(CRASH,ka-.02,.55); mus(SLEIGH,ka,.55); [mus(GLOCK.note(m),ka+i*.07,.4) for i,m in enumerate([D5,Fs4+12,A4+12,D5+12])]
# 12 the land: sincere
drone(S[12],TOTAL,.1)
melody([(Fs4,2),(E4,1),(D4,1),(A4,3),(G4,1)],S[12]+.1,60/96/2,'harm',.42); melody([(SA-12,4),(SA-17,4)],S[12]+.1,60/96/2*2,'harp',.35)
# 13 the march: groove back, theme, final cadence
groove(S[13],TOTAL-1.2,120,.5); melody(THEME+THEME2,S[13]+.1,60/120/2,'harm',.46)
mus(harmonium(mid(D4),2.2,1.0)+harmonium(mid(A4),2.2,.7),TOTAL-2.4,.5); mus(TIMP[1],TOTAL-2.4,.55); mus(TAMB,TOTAL-2.4,.4)
# ================================================================== foley
def stamp(t0,g=1): fx(k('RPG sounds (50 sounds)/bookPlace1.ogg'),t0,1.0*g); fx(shift(TIMP[2],-5)[:int(.5*SR)],t0,.35*g); fx(k('Casino sounds (50 sounds)/cardPlace2.ogg'),t0+.01,.7*g)
cs=lambda i: k(f'Casino sounds (50 sounds)/cardSlide{i}.ogg')
flip=lambda i: k(f'RPG sounds (50 sounds)/bookFlip{i}.ogg')
step=lambda i: k(f'RPG sounds (50 sounds)/footstep0{i%10}.ogg')
coins=k('RPG sounds (50 sounds)/handleCoins.ogg'); coins2=k('RPG sounds (50 sounds)/handleCoins2.ogg')
cloth=lambda i: k(f'RPG sounds (50 sounds)/cloth{i}.ogg'); creak=k('RPG sounds (50 sounds)/creak1.ogg')
pop=lambda i=1: k(f'UI sounds (50 sounds)/rollover{i}.ogg'); click=lambda i=1: k(f'UI sounds (50 sounds)/click{i}.ogg')
def ambience(t0,t1,kind,g=.25):
    d=t1-t0
    if kind=='fan': x=noise(d,60,600,1)*.6+np.sin(2*np.pi*50*np.arange(int(d*SR))/SR).astype(np.float32)*.15
    elif kind=='village': x=noise(d,300,3000,1)*.3; [fx(chirp(2600+rng.uniform(-400,600),3600,.12),t0+rng.uniform(0,d),.12,.5) for _ in range(int(d*1.5))]
    elif kind=='office': x=noise(d,100,1500,1)*.45
    elif kind=='night': x=noise(d,1500,6000,0)*.12; [fx(chirp(4200,4400,.05),t0+j*.31,.05,.6) for j in range(int(d/.31))]
    elif kind=='crowd':
        x=noise(d,250,2500,1); env=np.convolve(np.abs(rng.normal(0,1,int(d*40)+2)),np.ones(6)/6,'same'); ev=np.repeat(env,SR//40); ev=np.pad(ev,(0,max(0,len(x)-len(ev))),mode='edge')[:len(x)]; x*=(ev/env.max()).astype(np.float32)
    elif kind=='cinema': x=noise(d,200,1200,1)*.3; [fx(click(3)*.25,t0+j/12,.18) for j in range(int(d*12))]
    fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.15)).astype(np.float32); fx(x*fade,t0,g*.45)
# 1
ambience(0,SE(1),'village',.2); stamp(k1,1.4); fx(noise(.3,300,3000,0)*np.linspace(0,1,int(.3*SR)).astype(np.float32),k1-.3,.25)
# 2
ambience(S[2],SE(2),'fan',.18); t2=S[2]; fx(cs(1),t2+1.0,.7); fx(cs(2),t2+1.9,.6); fx(flip(1),t2+2.5,.6); fx(flip(2),t2+2.95,.6); fx(cs(5)*.6,t2+3.4,.5)
# 3
ambience(S[3],SE(3),'fan',.12); fx(k('RPG sounds (50 sounds)/bookPlace2.ogg'),S[3]+.02,.8); [fx(click(2),W(3,'records')+i*.31,.5) for i in range(2)]
fx(noise(.45,2000,6000,0)*.5,kd3-.7,.25)
# 4
ambience(S[4],SE(4),'village',.2)
for i,kn in enumerate([W(4,'three'),W(4,'hundred'),W(4,'rupees')]): fx(cs(3+i),kn,.7); fx(coins2 if i==2 else coins,kn+.25,.35)
for j in range(6): fx(noise(.09,2500,7000,0),W(4,'make')+j*.1,.12)
fx(creak,W(4,'and')+.25,.7); fx(k('RPG sounds (50 sounds)/metalClick.ogg'),W(4,'and')+.55,.4)
# 5
ambience(S[5],SE(5),'office',.16)
for i in range(6): fx(flip(1+i%3),S[5]+.1+i*.22,.32)
for kp in [W(5,'every'),W(5,'office')]: fx(pop(2),kp-.05,.5); fx(cs(7),kp,.4)
stamp(W(5,'file')+.08,1.0)
# 6 brush
ambience(S[6],SE(6),'village',.12)
tb=W(6,'lal')-.35
while tb<W(6,'mritak')+.25: fx(noise(.16,800,5000,1)*np.hanning(int(.16*SR)).astype(np.float32),tb,.22); tb+=.19
fx(pop(3),W(6,'the')-.05,.5)
# 7
ambience(S[7],W(7,'kidnapped')-.25,'office',.12); fx(pop(1),S[7]+.5,.5); fx(flip(3),S[7]+.2,.35)
ambience(W(7,'kidnapped')-.25,W(7,'and')-.08,'night',.25)
for j in range(5): fx(step(j)*.6,W(7,'kidnapped')-.2+j*.24,.35)
ambience(W(7,'and')-.08,SE(7),'cinema',.2)
for j in range(3): fx(pop(4),W(7,'and')+j*.45,.35)
# 8
ambience(S[8],SE(8),'office',.12)
for h in [W(8,'bribed'),W(8,'back')+.15]: fx(cs(4),h,.7)
for h in [W(8,'gave')-.05,W(8,'back')+.5]: fx(cs(6),h,.8); fx(k('RPG sounds (50 sounds)/bookPlace3.ogg'),h+.22,.6)
# 9
ambience(S[9],SE(9),'office',.12); fx(cs(8),S[9]+.4,.5); stamp(W(9,'denied'),1.0)
# 10
ambience(S[10],ka10-.1,'crowd',.25)
for j in range(int((kv-ka10)/.06)): fx(click(1),ka10+j*.06,.18)
# 11
for i in range(9): fx(flip(1+i%3),S[11]+.05+i*(kn11-S[11])/9,.3)
tsg=ko+.1
while tsg<W(11,'he')-.15: fx(noise(.07,2200,7000,0),tsg,.2); tsg+=.085
fx(cs(3),W(11,'he')-.05,.5); ambience(W(11,'he'),SE(11),'crowd',.32)
# 12
ambience(S[12],SE(12),'village',.18); fx(cs(2),S[12]+.2,.5)
# 13
ambience(S[13],TOTAL,'crowd',.22)
for j in range(int((TOTAL-S[13])/.5)): fx(step(j)*.5,S[13]+j*.5,.25)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
pass
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('ok total',TOTAL)
