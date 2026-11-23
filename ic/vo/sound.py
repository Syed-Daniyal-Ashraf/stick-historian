"""Soundtrack for Ice to Calcutta (adapted from tn/vo/sound.py). Original docstring: Soundtrack for The Day of Two Noons (adapted from yo/vo/sound.py): the clock is the metronome: one tick grid for the whole film, ragtime score on top, a dropout while the pendulum is stopped, foley.
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
# cut times: must match CUT_EP in src/shots.js
cut=lambda sh,w,off: W(sh,w)+off
kend=W(8,'house')+1.3
# (start, mode, level dB). bright = harp + pizzicato (glassy ice), soft = piano, pizz = the steps, tense = days ticking, roll = arrival, hush = the ice house, out = silence
SECT=[(0,'bright',0),(S[2],'soft',-2),(cut(2,'step',-.1),'pizz',-4),(S[6],'roll',-3),(S[7],'pizz',-4),(S[8],'hush',-6),(kend,'out',-99)]
SECT=[(beat(t)*Q,m,l) for t,m,l in SECT]
def mode_at(t):
    cur=SECT[0]
    for s_ in SECT:
        if t>=s_[0]-1e-6: cur=s_
    return cur
for i in range(NB):
    t=i*Q; _,mode,_lv=mode_at(t); bar=(i//2)%8; down=i%2==0
    root,kind=(PROG_MIN if mode in('tense',) else PROG_MAJ)[bar]
    if mode=='out': continue
    if mode=='bright':
        if down:
            bed(CPIZZ.note(root),t,.5,-.2)
            for j,m in enumerate(chord_notes(root+24,kind)+[root+36]): bed(HARP.note(m),t+j*Q/4,.34,.15)
        else: bed(PIZZ.note(chord_notes(root+24,kind)[2]),t,.3,.2); bed(GLOCK.note(root+48),t,.14,.3)
    elif mode=='soft':
        if down:
            bed(PNO.note(root-12,Q*.9),t,.4,-.2)
        else:
            for m in chord_notes(root+12,kind): bed(PNO.note(m,Q*.6),t,.2,.05)
        c3,c5,c8=chord_notes(root+24,kind)[1],chord_notes(root+24,kind)[2],root+36
        fig=[c3,c5,c8,c5] if (i//2)%2==0 else [c8,None,c5,c3]
        for j in (0,1):
            m=fig[(0 if down else 2)+j]
            if m: bed(PNO.note(m,Q*.5),t+j*Q/2,.2,.2)
    elif mode=='pizz':
        if down: bed(CPIZZ.note(root),t,.5,-.2)
        else:
            for m in chord_notes(root+24,kind)[:2]: bed(PIZZ.note(m),t,.3,.2)
        if i%4==0: bed(GLOCK.note(root+48),t+Q/2,.12,.3)
    elif mode=='tense':
        if down: bed(TUBA.note(36 if (i//4)%2==0 else 39),t,.7,-.15)
        else: bed(CPIZZ.note(48),t,.4,.1)
        bed(shift(CLAVE,3 if down else 0),t,.22,.1)              # the days ticking
    elif mode=='roll':
        if down: bed(PNO.note(root-12,Q*.9),t,.36,-.2); bed(BSNS.note(root,Q*1.6),t,.3,-.3)
        else:
            for m in chord_notes(root+12,kind): bed(HARP.note(m),t,.2,.1)
    elif mode=='hush':
        if down: bed(HARP.note(root+12),t,.28,-.1); bed(CPIZZ.note(root),t,.3,-.2)
        elif i%4==3: bed(GLOCK.note(root+48),t,.14,.2)
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
mus(TIMP[1],S[1]+.02,.4); mus(GLOCK.note(84),W(1,'ice'),.3); mus(GLOCK.note(88),W(1,'india'),.3)
mus(TIMP[0],W(1,'twice')-.02,.5); mus(TBF.note(50),W(7,'thirty')+.05,.34); mus(TIMP[0],W(7,'thirty')+.02,.4)
mus(GLOCK.note(79),W(2,'survive'),.3); [mus(GLOCK.note(m),W(8,'house')+i*.07,.28) for i,m in enumerate([72,76,79,84])]
mus(PIZZ.note(60),W(8,'house')+.5,.4); mus(TIMP[0],W(8,'house')-.03,.5)

# ================================================================== foley (CC0 Kenney + VSCO only; nothing vocal)
chip=lambda i: k(f'Casino sounds (50 sounds)/chipsCollide{1+i%4}.ogg'); chipH=lambda i: k(f'Casino sounds (50 sounds)/chipsHandle{1+i%6}.ogg')
rpg=lambda f: k(f'RPG sounds (50 sounds)/{f}.ogg'); step=lambda i: rpg(f'footstep0{i%10}')
def room(t0,t1,g=.1,lo=100,hi=1500): d=t1-t0; x=noise(d,lo,hi,1); fade=np.minimum(1,np.minimum(np.arange(len(x)),len(x)-np.arange(len(x)))/(SR*.15)).astype(np.float32); fx(x*fade,t0,g)
def thunk(t0,g=.7): fx(shift(TIMP[2],-7)[:int(.35*SR)],t0,.45*g); fx(chip(int(t0*7)),t0,.6*g); fx(rpg('dropLeather'),t0+.01,.35*g)
def crackle(t0,dur=.8,g=.35):
    for i in range(9): fx(chipH(i)[:int(.12*SR)],t0+i*dur/9+.03*np.sin(i*5),g*(.5+.5*np.sin(i*2.3+1)**2),(i%3-1)*.3)
def splash(t0,g=.25): x=noise(.25,800,6000,0)*np.hanning(int(.25*SR)).astype(np.float32); fx(x,t0,g)
# 1: deck ambience, ice crackle, the sea
room(0,S[2],.05,150,1800); crackle(.5,.9,.3); fx(rpg('creak1'),.3,.3)
fx(chip(1),W(1,'ice'),.35); fx(rpg('cloth2'),W(1,'twice')-.1,.3); fx(rpg('cloth3'),W(1,'twice')+.18,.3)
# 2: fanning hat, a drop, the cutter on the pond, ruler tap
for i in range(5): fx(rpg('cloth1')[:int(.15*SR)],S[2]+.3+i*.28,.14)
fx(chipH(2)[:int(.1*SR)],S[2]+1.1,.4)
st2=cut(2,'step',-.1); room(st2,S[3],.05,200,1600); fx(rpg('drawKnife1'),st2+.7,.35); fx(rpg('drawKnife2'),st2+1.6,.3)
for i in range(12): fx(chip(i),cut(2,'two',-.1)+.1+i*.07,.28)
fx(rpg('metalClick'),cut(2,'two',-.1)+.9,.4)
# 3: three blocks locked in (thunk each, on the landing frame in sh3a), the merge, melt gag
for i in range(3): thunk(S[3]+.34+i*.36,.8)
fx(shift(GLOCK.note(76),0),cut(3,'giant',0),.0); crackle(cut(3,'giant',0)-.2,.4,.2)
for i in range(4): fx(chipH(i)[:int(.1*SR)],cut(3,'less',-.07)+.6+i*.5,.22)
# 4: shovel into the gap, tannery, bark, hay, stomp, hammer
fx(rpg('dropLeather'),S[4]+.95,.5)
for i in range(6): fx(rpg('drawKnife3')[:int(.25*SR)],S[4]+1.0+i*.13,.2)
fx(rpg('handleSmallLeather'),cut(4,'leftover',-.06)+.5,.5)
tb=cut(4,'on',-.05)
for i in range(6): fx(noise(.25,300,2500,1)*np.hanning(int(.25*SR)).astype(np.float32),tb+i*.17,.2)
th=cut(4,'hay',-.4)
for i in range(7): fx(noise(.3,1500,6500,0)*np.hanning(int(.3*SR)).astype(np.float32),th+.1+i*.13,.18)
for i in range(3): fx(rpg('footstep0%d'%(i+3)),th+1.1+i*.22,.5)
for i in range(3): fx(rpg('chop'),th+2.3+i*.27,.55); fx(rpg('metalClick'),th+2.3+i*.27,.3)
# 5 (Stage D): the thermometer test - set down on the planks, the two readings meet on 'same', a pleased pat
room(S[5],S[6],.04,300,2200)
fx(chip(2),S[5]+1.15,.35); fx(rpg('metalClick'),S[5]+1.16,.35)   # thermometer lands on the planks (sh5a, pu 1.15)
fx(rpg('metalClick'),cut(5,'same',0)+.02,.45); fx(chip(5),cut(5,'same',0)+.05,.3)
# 6: arrival, hatch opens, murmur
room(S[6],S[7],.05,200,1800); fx(rpg('doorOpen_1'),cut(6,'with',-.05)+.02,.6); [fx(chip(i),cut(6,'with',-.05)+.5+i*.2,.2) for i in range(4)]
# 7: dripping docks, chalk, walking buyer
for i in range(9): splash(S[7]+.1+i*.19,.12)
for i in range(7): fx(chip(i)[:int(.07*SR)],cut(7,'four',-.07)+.15+i*.1,.16)
fx(rpg('metalClick'),W(7,'fifty')+.3,.5)
for i in range(8): fx(step(i),cut(7,'days',-.1)+.1+i*.2,.28)
fx(rpg('metalClick'),W(7,'thirty')+.25,.4)
# 8: coins in the hat, ice house door
for i,c0 in enumerate([.3,.65,1.0,1.25,1.55]): fx(rpg('handleCoins2' if i%2 else 'handleCoins'),S[8]+c0+.3,.5)
for i in range(4): fx(step(i),cut(8,'obvious',.2)+.1+i*.25,.2)
fx(rpg('doorClose_2'),W(8,'house')-.05,1.0); fx(rpg('metalLatch'),W(8,'house')+.3,.7); crackle(W(8,'house')+.6,.8,.25)
# ------------------------------------------------------------------ write
from numpy.fft import rfft, irfft
ir=(rng.normal(0,1,int(SR*.7))*np.exp(-np.arange(int(SR*.7))/SR*7)).astype(np.float32); ir[0]=0; ir/=np.abs(ir).sum()/2.2
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): MUS[:,c]=MUS[:,c]*.88+conv(MUS[:,c],ir)*.22
MUS=MUS[:int(TOTAL*SR)]; FX=FX[:int(TOTAL*SR)]
MUS/=np.abs(MUS).max()*1.05; FX/=np.abs(FX).max()*1.4
sf.write('vo/music_raw.wav',MUS,SR); os.makedirs('out',exist_ok=True); sf.write("out/fx_real.wav",FX,SR)
print('ok total',TOTAL)
