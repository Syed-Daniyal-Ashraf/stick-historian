"""Soundtrack for The Day of Two Noons (adapted from yo/vo/sound.py): the clock is the metronome: one tick grid for the whole film, ragtime score on top, a dropout while the pendulum is stopped, foley.
Samples: VSCO 2 Community Edition (CC0) and Kenney audio packs (CC0).
The score runs on ONE beat grid for the whole film (BPM from vo/timing.json; timeline.py starts every shot on a beat),
so the pulse and the chord progression carry across cuts. Shots change the arrangement (who plays, major/minor, how loud),
never the tempo. Writes vo/music_raw.wav (score) and out/fx_real.wav (foley); bed.py then ducks the score under the voice."""
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
CLAVE=P('Claves1_Hit_v2_rr1_Sum.wav'); SLEIGH=load(glob.glob(V+'Percussion/Sleighbells_Hit*')[0]); TAMB=P('Tamb1-Shake_v1_rr1_Sum.wav'); CLAVE=P('Claves1_Hit_v2_rr1_Sum.wav'); BD=P('BDrumNewhit_v5_rr1_Sum.wav')
ROLL=load(sorted(glob.glob(V+'Percussion/Timpani/Rolls/*'))[0]); GONG=P('gongHit_f.wav')
k=lambda f: load(K+f)
# ------------------------------------------------------------------ synths
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

# ================================================================== the score: one grid, sections change the arrangement
BPM=T.get('bpm',104); Q=60/BPM; NB=int(round(TOTAL/Q))
beat=lambda t: int(round(t/Q))
def chord_notes(root,kind='maj'): return [root,root+(4 if kind=='maj' else 3),root+7]
PROG_MAJ=[(48,'maj'),(48,'maj'),(53,'maj'),(48,'maj'),(43,'maj'),(43,'maj'),(48,'maj'),(43,'maj')]
PROG_MIN=[(48,'min'),(48,'min'),(44,'maj'),(44,'maj'),(41,'min'),(41,'min'),(43,'maj'),(43,'maj')]
BED=np.zeros((n,2),np.float32); bed=lambda x,t0,g=1,pan=0: put(BED,x,t0,g,pan)
# ---- cut times (must match CUT_EP in src/shots.js)
cut=lambda sh,w,off: W(sh,w)+off
C1=[cut(1,'church',-.3),cut(1,'four',0),cut(1,'again',-.25)]; C2=[cut(2,'man',-.3)]; C3=[cut(3,'three',-.25),cut(3,'restarted',-.2)]
C4=[cut(4,'telegraph',-.1),cut(4,'jewelers',-.15)]; C5=[cut(5,'wisconsin',-.15),cut(5,'so',-.1),cut(5,'zones',-.35),cut(5,'no',-.1)]
C6=[cut(6,'went',-.1),cut(6,'noon',-.25)]; C7=[cut(7,'sun',-.15),cut(7,'job',-.2)]; C8=[cut(8,'official',-.2),cut(8,'thirty',-.1)]
kstop=W(3,'stopped'); kgo=W(3,'restarted'); klate=W(8,'late')
# (start, mode, level dB). tick = the hook (ticks + low strings), stop = EVERY instrument out (the grid keeps counting), out = silence
SECT=[(0,'tick',0),(S[2],'rag',-2),(kstop,'stop',-99),(kgo,'rag',-2),(S[4],'pizz',-5),(S[5],'soft',-4),(S[6],'pizz',-5),(S[7],'tense',-4),(S[8],'roll',-3),(klate+.1,'out',-99)]
SECT=[(beat(t)*Q,m,l) for t,m,l in SECT]
def mode_at(t):
    cur=SECT[0]
    for s_ in SECT:
        if t>=s_[0]-1e-6: cur=s_
    return cur
for i in range(NB):
    t=i*Q; _,mode,_lv=mode_at(t); bar=(i//2)%8; down=i%2==0
    root,kind=(PROG_MIN if mode in('sad','tense') else PROG_MAJ)[bar]
    if mode in('out','stop'): continue
    if mode!='tick': bed(shift(CLAVE,2 if down else 0),t,.16,.15)                 # the clock tick under every section
    if mode=='tick':
        bed(shift(CLAVE,3 if down else 0),t,.55 if down else .38,.1)
        if i%4==0: bed(CPIZZ.note(root),t,.6,-.2)
        if i%4==2: [bed(PIZZ.note(m),t,.28,.2) for m in chord_notes(root+24,kind)[:2]]
    elif mode in('rag','soft'):
        if down:
            bed(PNO.note(root-12,Q*.9),t,.42,-.2)
            if mode=='rag': bed(TUBA.note(root-12),t,.3,-.3)
        else:
            for m in chord_notes(root+12,kind): bed(PNO.note(m,Q*.6),t,.22,.05)
            if mode=='rag': bed(SNT[i%len(SNT)],t,.13,.2)
        c3,c5,c8=chord_notes(root+24,kind)[1],chord_notes(root+24,kind)[2],root+36
        fig=[c3,c5,c8,c5] if (i//2)%2==0 else [c8,None,c5,c3]
        for j in (0,1):
            m=fig[(0 if down else 2)+j]
            if m: bed(PNO.note(m,Q*.5),t+j*Q/2,.26 if mode=='rag' else .2,.2)
    elif mode=='pizz':
        if down: bed(CPIZZ.note(root),t,.5,-.2)
        else:
            for m in chord_notes(root+24,kind)[:2]: bed(PIZZ.note(m),t,.3,.2)
    elif mode=='roll':
        if down: bed(PNO.note(root-12,Q*.9),t,.36,-.2); bed(TUBA.note(root-12),t,.26,-.3)
    elif mode=='tense':
        if down: bed(TUBA.note(36 if (i//4)%2==0 else 39),t,.7,-.15)
        else: bed(CPIZZ.note(48),t,.4,.1)
r8=S[8]; ln=min(len(ROLL),int((W(8,'nineteen')-r8+.2)*SR)); bed(ROLL[:ln]*np.linspace(.2,1,ln).astype(np.float32),r8,.3)
def rms_db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
edges=[s_[0] for s_ in SECT]+[TOTAL]; gain=np.ones(n,np.float32); ref=None; report=[]
for si,(t0,m,lv) in enumerate(SECT):
    a,b=int(t0*SR),int(edges[si+1]*SR)
    if m in('out','stop') or b-a<SR*.3: continue
    r=float(rms_db(BED[a:b]))
    if ref is None: ref=r-lv
    g=float(np.clip(ref+lv-r,-12,12)); gain[a:b]=10**(g/20); report.append((round(t0,2),m,lv,round(r-ref,1),round(g,1)))
fl=int(SR*.06); ker=np.ones(fl,np.float32)/fl; gain=np.convolve(gain,ker,'same')
BED*=gain[:,None]; MUS+=BED
print('sections (start, mode, target dB, measured before, gain applied):'); [print(' ',r_) for r_ in report]
# the dropout is total: nothing in the music bus between 'stopped' and 'restarted' (checked below)
a_,b_=int(kstop*SR),int(beat(kgo)*Q*SR); MUS[a_:b_]=0
# stingers on word cues
bellD=lambda t0,g=.6: (fx(shift(GONG,-3)[:int(2.2*SR)]*np.linspace(1,.0,int(2.2*SR)).astype(np.float32),t0,g*.7), fx(GLOCK.note(76),t0,g*.5), fx(GLOCK.note(83),t0+.015,g*.35))
mus(TIMP[1],kgo-.02,.5); [mus(GLOCK.note(m),kgo+i*.06,.26) for i,m in enumerate([72,76,79])]
mus(TBF.note(50),W(5,'law')+.05,.3); mus(TIMP[0],C7[1]+.1,.4)
mus(TIMP[2],W(8,'official')-.05,.45); [mus(GLOCK.note(m),W(8,'nineteen')+i*.07,.28) for i,m in enumerate([72,76,79,84])]
mus(PIZZ.note(60),klate-.02,.4); mus(PIZZ.note(55),klate+.15,.36); mus(TIMP[0],klate-.05,.5)

# ================================================================== foley
def stamp(t0,g=1): fx(k('RPG sounds (50 sounds)/bookPlace1.ogg'),t0,1.0*g); fx(shift(TIMP[2],-5)[:int(.5*SR)],t0,.35*g); fx(k('Casino sounds (50 sounds)/cardPlace2.ogg'),t0+.01,.7*g)
flip=lambda i: k(f'RPG sounds (50 sounds)/bookFlip{i}.ogg'); cs=lambda i: k(f'Casino sounds (50 sounds)/cardSlide{i}.ogg')
step=lambda i: k(f'RPG sounds (50 sounds)/footstep0{i%10}.ogg')
pop=lambda i=1: k(f'UI sounds (50 sounds)/rollover{i}.ogg'); click=lambda i=1: k(f'UI sounds (50 sounds)/click{i}.ogg')
def room(t0,t1,g=.1,lo=100,hi=1500): d=t1-t0; x=noise(d,lo,hi,1); fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.15)).astype(np.float32); fx(x*fade,t0,g)
def zip_(t0,dur=.3,up=True,g=.3,lo=500,hi=1500): x=chirp(lo if up else hi,hi if up else lo,dur); fx(x*.6+noise(dur,2000,6000,0)*.15*np.hanning(len(x)).astype(np.float32),t0,g)
def whistle(t0,dur=1.1,g=.3):
    t_=np.arange(int(dur*SR))/SR; vib=1+.012*np.sin(2*np.pi*6*t_); env=np.minimum(1,t_/.06)*np.minimum(1,(dur-t_)/.25)
    x=(np.sin(2*np.pi*np.cumsum(610*vib)/SR)+.8*np.sin(2*np.pi*np.cumsum(780*vib)/SR)+.2*np.sin(2*np.pi*np.cumsum(1220*vib)/SR))*env
    fx((x/np.abs(x).max()*.8+noise(dur,2500,6500,0)*.1*env).astype(np.float32),t0,g)
def ratchet(t0,n_,dt,g=.35,pitch=0):
    for i in range(n_): fx(shift(CLAVE,pitch+(i%2)*2),t0+i*dt,g)
def buzz(t0,t1,g=.1):
    d=t1-t0; x=noise(d,180,520,0)*(.5+.5*np.sin(np.arange(int(d*SR))/SR*2*np.pi*13)).astype(np.float32); fx(x*np.hanning(len(x)).astype(np.float32),t0,g)
# 1 hook: bell on the first frame, the noon strike, the crank ratchets back four minutes, the second noon
bellD(.05,.55); bellD(W(1,'noon')+.02,.8); ratchet(C1[1]+.18,14,.052,.3,-4); fx(chirp(900,300,.3)*.4,C1[1]+.95,.25); bellD(W(1,'again')+.03,.85)
fx(pop(1),.2,.4)
# 2 the locomotive: whistle + chuffs, then the room
whistle(S[2]+.08,1.15,.3)
for i in range(4): fx(noise(.14,150,900,1)*np.hanning(int(.14*SR)).astype(np.float32),S[2]+.1+i*Q/2,.35)
room(C2[0],S[3],.07,200,1600); fx(pop(2),C2[0]+.55,.4)
# 3 the grab: thunk at 'stopped', stopwatch ticks, fly, restart
fx(shift(TIMP[2],-6)[:int(.45*SR)],kstop,.55); fx(click(2),kstop+.01,.7); fx(cs(2),kstop+.02,.2)
tt=kstop+Q
while tt<kgo-.1: fx(shift(CLAVE,6),tt,.12); tt+=Q                                    # the beat keeps counting, very softly, inside the silence
st_=C3[0]; ratchet(st_+.1,38,.045,.16,5); buzz(st_+.1,C3[1]-.1,.07)                    # stopwatch racing + a fly
fx(click(3),kgo,.8); fx(shift(TIMP[2],-3)[:int(.4*SR)],kgo-.02,.4)
for i in range(6): fx(pop(1+i%3),C3[1]+.35+i*.17,.3)                                   # clocks flick in a wave
# 4 telegraph: sounder clicks on every beat (clack on the offbeat), the zip along the wire
for i in range(NB):
    t=i*Q
    if S[4]-.01<=t<S[5]-.01: fx(click(1),t,.5 if t>=C4[1] else .32); fx(click(4),t+Q*.18,.34 if t>=C4[1] else .2)
zip_(C4[0],.9,True,.3,400,2200)
# 5 the sun, 38 clicks, the zones, the blank law book
room(S[5],C5[0],.06,300,2200); fx(pop(2),W(5,'sun')+.05,.3)
for i in range(38): fx(shift(click(1+i%5),0),C5[0]+.3+i*(1.06/38),.22)
for i in range(4): fx(pop(1+i%3),C5[2]-.2+.35+i*.17-.15+.0,.35)
for i in range(3): fx(pop(1+i),C5[2]+.25+i*.2,.28)
fx(flip(1),C5[3]+.3,.4); fx(chirp(800,300,.3)*.4,C5[3]+.9,.2)
# 6 two clocks reversing, the crank at the church, the second noon, resetting watches
ratchet(S[6]+.25,9,.06,.28,-3); ratchet(S[6]+.45,9,.06,.28,-5); ratchet(C6[0]+.1,16,.07,.28,-4); bellD(C6[1]+.1,.8); fx(pop(1),C6[1]+.6,.3)
# 7 press, slam, typing, the sun packs and leaves
for i in range(NB):
    t=i*Q
    if S[7]-.01<=t<C7[0]-.01: fx(shift(TIMP[2],-8)[:int(.2*SR)],t,.28); fx(click(5),t+Q*.5,.3)
stamp(S[7]+1.55,1.3)
tt=C7[0]+.25
while tt<C7[0]+.85: fx(click(1+int(tt*7)%5),tt,.4); tt+=.07+.04*abs(np.sin(tt*13))
fx(chirp(500,1500,.4)*.4,C7[0]+.9,.22)
for i,d in enumerate([.05,.25,.45]): fx(pop(1+i),C7[1]+d,.4)
for i in range(5): fx(step(i),C7[1]+.75+i*.12,.25)
# 8 capitol, the stamp, the calendar, the watch snap
room(S[8],C8[0],.05,250,2000)
stamp(C8[0]+.22,1.2)
for i in range(6): fx(flip(1+i%3),C8[0]+.9+i*.09,.3)
for i in range(4): fx(step(i+2),C8[0]+.4+i*.3,.18)
fx(click(2),klate-.02,.9); fx(shift(CLAVE,4),klate-.02,.6); fx(click(5),klate+.01,.4)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS[a_-int(.05*SR):a_]*=np.linspace(1,0,int(.05*SR))[:,None]; MUS[a_:b_]=0                                  # reverb tails of the section before must not leak into the dropout
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
print('dropout',round(a_/SR,2),'-',round(b_/SR,2),'music peak inside =',float(np.abs(MUS[a_:b_]).max()))
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('ok total',TOTAL)
