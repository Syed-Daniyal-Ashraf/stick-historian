"""Soundtrack for the Pedro Flores / yo-yo episode (adapted from mo/vo/sound.py): one continuous ragtime score + foley, mixed offline.
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
SLEIGH=load(glob.glob(V+'Percussion/Sleighbells_Hit*')[0]); TAMB=P('Tamb1-Shake_v1_rr1_Sum.wav'); CLAVE=P('Claves1_Hit_v2_rr1_Sum.wav'); BD=P('BDrumNewhit_v5_rr1_Sum.wav')
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
BPM=T.get('bpm',108); Q=60/BPM; NB=int(round(TOTAL/Q))
beat=lambda t: int(round(t/Q))                      # nearest beat index for a time
def chord_notes(root,kind='maj'): return [root,root+(4 if kind=='maj' else 3),root+7]
PROG_MAJ=[(48,'maj'),(48,'maj'),(53,'maj'),(48,'maj'),(43,'maj'),(43,'maj'),(48,'maj'),(43,'maj')]   # C C F C G G C G, two beats each
PROG_MIN=[(48,'min'),(48,'min'),(44,'maj'),(44,'maj'),(41,'min'),(41,'min'),(43,'maj'),(43,'maj')]   # Cm Ab Fm G
BED=np.zeros((n,2),np.float32); bed=lambda x,t0,g=1,pan=0: put(BED,x,t0,g,pan)
C5=72; G5=79
kt2=W(2,'trick'); KF3=W(3,'own')+.1; kj=W(4,'rejected'); ksash=W(5,'pedro'); kn5=W(5,'name'); kb9=W(9,'before')
# (start time, mode, level in dB relative to the loudest section). Modes: rag (oom-pah + melody), soft (rag without tuba/snare),
# pizz (plucked strings), sad (minor, half-time, soft piano), roll (drum roll over the bass), tense (tuba pedal), hush (bass only), out (silence)
SECT=[(0,'rag',0),(S[2],'soft',-3),(kt2-.1,'pizz',-5),(S[3],'rag',-1),(S[4],'pizz',-5),(S[5],'roll',-3),(ksash+.25,'sad',-6),
      (S[6],'tense',-4),(S[8],'roll',-3),(S[9],'hush',-9),(kb9+1.1,'out',-99)]
SECT=[(beat(t)*Q,m,l) for t,m,l in SECT]
def mode_at(t):
    cur=SECT[0]
    for s in SECT:
        if t>=s[0]-1e-6: cur=s
    return cur
for i in range(NB):
    t=i*Q; _,mode,_lv=mode_at(t); bar=(i//2)%8; down=i%2==0
    root,kind=(PROG_MIN if mode in('sad','tense') else PROG_MAJ)[bar]
    if mode=='out': continue
    if mode in('rag','soft'):
        if down:
            bed(PNO.note(root-12,Q*.9),t,.42,-.2)
            if mode=='rag': bed(TUBA.note(root-12),t,.3,-.3)
        else:
            for m in chord_notes(root+12,kind): bed(PNO.note(m,Q*.6),t,.22,.05)
            if mode=='rag': bed(SNT[i%len(SNT)],t,.13,.2)
        # right hand: broken chords in eighths, always chord tones, with a tied syncopation every other bar
        c3,c5,c8=chord_notes(root+24,kind)[1],chord_notes(root+24,kind)[2],root+36
        fig=[c3,c5,c8,c5] if (i//2)%2==0 else [c8,None,c5,c3]
        for j in (0,1):
            m=fig[(0 if down else 2)+j]
            if m: bed(PNO.note(m,Q*.5),t+j*Q/2,.26 if mode=='rag' else .2,.2)
    elif mode=='pizz':
        if down: bed(CPIZZ.note(root),t,.5,-.2)
        else:
            for m in chord_notes(root+24,kind)[:2]: bed(PIZZ.note(m),t,.3,.2)
    elif mode=='sad':
        if i%4==0:
            bed(PNOs.note(root-12,Q*3.6),t,1.1)
            for j,m in enumerate(chord_notes(root+12,kind)): bed(PNOs.note(m,Q*3.2),t+j*.05,.6)
        elif i%4==2: bed(PNOs.note(chord_notes(root+24,kind)[1],Q*1.8),t,.55,.15)
        elif i%4==3: bed(PNOs.note(chord_notes(root+24,kind)[0],Q*.9),t,.45,.15)
    elif mode=='roll':
        if down: bed(PNO.note(root-12,Q*.9),t,.36,-.2); bed(TUBA.note(root-12),t,.26,-.3)
    elif mode=='tense':
        if down: bed(TUBA.note(36 if (i//4)%2==0 else 39),t,.7,-.15)
        else: bed(CPIZZ.note(48),t,.4,.1)
    elif mode=='hush':
        if down: bed(PNOs.note(root-12,Q*1.6),t,.9,-.1)
# rolls live in the bed so they are levelled with their section
r0=S[5]; ln=min(len(ROLL),int((kn5-r0+.05)*SR)); bed(ROLL[:ln],r0,.4)
r8=S[8]; ln=min(len(ROLL),int((W(8,'own')-r8+.2)*SR)); bed(ROLL[:ln]*np.linspace(.2,1,ln).astype(np.float32),r8,.3)
# level every section to its target so the music never jumps in loudness at a cut
def rms_db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
edges=[s[0] for s in SECT]+[TOTAL]; gain=np.ones(n,np.float32); ref=None; report=[]
for si,(t0,m,lv) in enumerate(SECT):
    a,b=int(t0*SR),int(edges[si+1]*SR)
    if m=='out' or b-a<SR*.3: continue
    r=float(rms_db(BED[a:b]))
    if ref is None: ref=r-lv
    g=float(np.clip(ref+lv-r,-12,12)); gain[a:b]=10**(g/20); report.append((round(t0,2),m,lv,round(r-ref,1),round(g,1)))
fl=int(SR*.06); ker=np.ones(fl,np.float32)/fl; gain=np.convolve(gain,ker,'same')
BED*=gain[:,None]; MUS+=BED
print('sections (start, mode, target dB, measured before, gain applied):'); [print(' ',r) for r in report]
# stingers on word cues (free of the grid on purpose: they hit with the picture)
[mus(GLOCK.note(m),W(1,'hooked')+i*.06,.26) for i,m in enumerate([C5,C5+4,G5])]
kw1=W(1,'word'); mus(TIMP[2],kw1-.05,.45); mus(CRASH,kw1,.2); mus(TUBA.note(43),kw1,.35)
[mus(GLOCK.note(m),W(2,'sleep')+i*.07,.22) for i,m in enumerate([G5,C5+12,G5+12])]
mus(TIMP[1],KF3-.05,.4); [mus(GLOCK.note(m),KF3+i*.2,.28) for i,m in enumerate([C5,C5+4,G5])]
mus(TIMP[0],kj,.6); mus(TUBA.note(36),kj,.5); mus(CRASH,kj,.25)
mus(TBF.note(55),W(5,'bought')+.05,.34); mus(TBF.note(48),kn5+.1,.34)
mus(TBF.note(52),W(6,'lost')+.05,.42); mus(TIMP[2],W(6,'lost')-.05,.45)
[mus(GLOCK.note(m),W(7,'philippine')+i*.07,.3) for i,m in enumerate([C5,C5+4,G5,C5+12])]
mus(TIMP[1],W(8,'own')-.1,.5); mus(PIZZ.note(60),W(8,'own')+.12,.36); mus(PIZZ.note(55),W(8,'own')+.3,.36)
[mus(PNOs.note(m,3.0),kb9+.9+i*.05,.3) for i,m in enumerate([36,48,55,60,64])]

# ================================================================== foley
def stamp(t0,g=1): fx(k('RPG sounds (50 sounds)/bookPlace1.ogg'),t0,1.0*g); fx(shift(TIMP[2],-5)[:int(.5*SR)],t0,.35*g); fx(k('Casino sounds (50 sounds)/cardPlace2.ogg'),t0+.01,.7*g)
cs=lambda i: k(f'Casino sounds (50 sounds)/cardSlide{i}.ogg')
flip=lambda i: k(f'RPG sounds (50 sounds)/bookFlip{i}.ogg')
step=lambda i: k(f'RPG sounds (50 sounds)/footstep0{i%10}.ogg')
coins=k('RPG sounds (50 sounds)/handleCoins.ogg'); coins2=k('RPG sounds (50 sounds)/handleCoins2.ogg')
pop=lambda i=1: k(f'UI sounds (50 sounds)/rollover{i}.ogg'); click=lambda i=1: k(f'UI sounds (50 sounds)/click{i}.ogg')
shuffle=k('Casino sounds (50 sounds)/cardShuffle.ogg'); fan_=k('Casino sounds (50 sounds)/cardFan1.ogg')
def room(t0,t1,g=.1,lo=100,hi=1500): d=t1-t0; x=noise(d,lo,hi,1); fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.15)).astype(np.float32); fx(x*fade,t0,g)
def zip_(t0,dur=.3,up=True,g=.3,lo=500,hi=1500): x=chirp(lo if up else hi,hi if up else lo,dur); fx(x*.6+noise(dur,2000,6000,0)*.15*np.hanning(len(x)).astype(np.float32),t0,g)
def whirr(t0,t1,g=.12): d=t1-t0; x=noise(d,250,1800,1)*(.6+.4*np.sin(np.arange(int(d*SR))/SR*2*np.pi*26)).astype(np.float32); fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.1)).astype(np.float32); fx(x*fade,t0,g)
bell=lambda t0,g=.5: (fx(GLOCK.note(88)*1.0,t0,g), fx(GLOCK.note(95)*.6,t0+.02,g*.7))
# 1 hook: kids pop in, yo-yo zips back, the registered mark lands
whirr(0,W(1,'company'),.08)
for i in range(2): fx(pop(1+i),W(1,'hooked')+i*.12,.45)
zip_(W(1,'company')+.05,.3,True,.35); stamp(kw1-.02,.85); bell(kw1+.05,.35)
# 2 lobby: suitcases creak, desk bell, the loop, the yo-yo falls asleep
fx(k('RPG sounds (50 sounds)/creak2.ogg'),S[2]+.3,.45); room(S[2],W(2,'philippines'),.08,200,1800)
bell(W(2,'hotel'),.4); fx(pop(2),W(2,'philippines')-.1,.5)
zip_(W(2,'looped')-.05,.4,False,.35,300,1100); whirr(W(2,'looped')+.45,SE(2),.1); fx(pop(3),W(2,'sleep')+.05,.5)
# 3 workshop whirr, then the factories pop up (on "own"; the 'three factories' line was cut in Stage D)
whirr(S[3],KF3-.05,.14)
for i in range(3): fx(pop(1+i),KF3+i*.2,.5); fx(shift(TIMP[2],-5)[:int(.45*SR)],KF3+i*.2,.3)
for i in range(4): fx(noise(.12,300,1500,1),KF3+.2+i*.3,.12)
# 4 patent office: slide, REGISTERED, form slides, REJECTED
fx(cs(2),S[4]+.25,.6); stamp(W(4,'flores'),.8); fx(cs(3),W(4,'donald')+.35,.6); stamp(kj,1.25); fx(pop(1),kj+.3,.4)
# 5 bag thump, paint roller, street
fx(k('RPG sounds (50 sounds)/handleCoins2.ogg'),W(5,'bought')-.1,.4); fx(shift(TIMP[2],-7)[:int(.35*SR)],W(5,'bought')+.12,.4)
fx(noise(.85,1200,5000,0.5)*np.hanning(int(.85*SR)).astype(np.float32),W(5,'company')-.05,.22)  # roller swish (Stage D: repaint starts on 'company')
for i in range(3): fx(pop(1+i),ksash+.65+i*.1,.3)  # Stage D: street cut moved to 'Pedro'+.3
whirr(ksash+.8,W(5,'with'),.09); fx(pop(2),W(5,'with')+.2,.4)
# 6 the years flip, then the gavel
for i in range(7): fx(flip(1+i%3),S[6]+.05+i*.15,.3)
stamp(W(6,'lost')-.05,1.3)
# 7 letters lift off the word and float out of the window
fx(chirp(500,1500,.5)*.5,W(7,'philippine'),.25); [fx(pop(1+i%3),W(7,'own')+.1+i*.1,.38) for i in range(4)]
# 8 the document slides out, typed, and Duncan's jaw drops
fx(cs(4),W(8,'evidence')-.3,.6)
tt=W(8,'evidence')+.3
while tt<W(8,'evidence')+1.3: fx(click(1+int(tt*7)%5)*1.0,tt,.5); tt+=.07+.04*abs(np.sin(tt*13))
fx(chirp(700,200,.35)*.5,W(8,'own')+.02,.3)
# 9 quiet hotel, one bell, the yo-yo rolls back up
room(S[9],SE(9),.1,250,2500); bell(S[9]+.35,.3); zip_(kb9,.8,True,.28,300,1100)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('ok total',TOTAL)

