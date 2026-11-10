"""Original score, synthesized here (no samples, no licences).
Shots 1-3: light plucked theme in D minor. Shots 4-6: a low pulse takes over and builds.
Hard silence from "He didn't." through the darkness (shot 7). Shots 8-11: sincere soft piano,
a pause under the mascot, and a resolving chord on "Plinian." """
import json, numpy as np, soundfile as sf
SR=48000
T=json.load(open('vo/timing.json')); TOTAL=T['total']; S=[s['start'] for s in T['shots']]
def W(shot,word):
    for l in T['shots'][shot-1]['lines']:
        for w in l['words']:
            if w['w'].lower().strip('.,…?!:').startswith(word): return w['t']
    raise KeyError(word)
rng=np.random.default_rng(7); _c={}
def pluck(f,dur=.6):
    key=(round(f,2),dur)
    if key in _c: return _c[key]
    n=int(SR*dur); P=max(2,int(SR/f)); buf=rng.uniform(-1,1,P); out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%P]; buf[i%P]=.995*.5*(buf[i%P]+buf[(i+1)%P])
    out*=np.exp(-np.arange(n)/SR*3.5); out/=np.abs(out).max()+1e-9; _c[key]=out; return out
def piano(f,dur=2.4):
    t=np.arange(int(SR*dur))/SR; x=np.zeros_like(t)
    for k in range(1,7): x+=np.sin(2*np.pi*f*k*t*(1+.0004*k*k))/k**1.6*np.exp(-t*(1.1+.7*k))
    x*=np.minimum(1,t/.006); return x/np.abs(x).max()
def thump(f=55,dur=.5):
    t=np.arange(int(SR*dur))/SR; return np.sin(2*np.pi*f*t*(1+.6*np.exp(-t*30)))*np.exp(-t*7)
def block(f=900):
    t=np.arange(int(SR*.06))/SR; return np.sin(2*np.pi*f*t)*np.exp(-t*90)
n=int(SR*(TOTAL+1.5)); L=np.zeros((n,2))
def place(x,t0,g,pan=0):
    i=int(t0*SR)
    if i<0 or i>=n: return
    m=min(len(x),n-i); L[i:i+m,0]+=x[:m]*g*(1-pan*.6); L[i:i+m,1]+=x[:m]*g*(1+pan*.6)
midi=lambda m:440*2**((m-69)/12)
BPM=96; e=60/BPM/2
BASS=[38,45,50,45,38,45,50,45]
MEL=[[62,None,65,None,69,None,67,65],[64,None,None,62,None,None,None,None],[62,None,65,None,69,None,72,70],[69,None,67,None,65,None,None,None]]
def theme(t0,t1,g=1.0,bar0=0):
    t=t0; b=bar0
    while t<t1-.02:
        for q in range(8):
            tt=t+q*e
            if tt>=t1: break
            place(pluck(midi(BASS[q]),.4),tt,.36*g,-.25)
            if q in (2,6): place(block(1000),tt,.1*g,.3)
            m=MEL[b%4][q]
            if m is not None: place(pluck(midi(m),.6),tt,.24*g,.3)
        t+=8*e; b+=1
    return b
def pulse(t0,t1,g0=.5,g1=1.0):
    t=t0; beat=2*e
    while t<t1-.02:
        k=(t-t0)/max(.01,t1-t0); g=g0+(g1-g0)*k
        place(thump(),t,.55*g); place(thump(),t+beat*.32,.3*g)          # heartbeat: lub-dub
        if int((t-t0)/beat)%4==0: place(pluck(midi(50),.8),t,.16*g,.2)  # sparse low D
        t+=beat
    return t
k_didnt=W(6,'didn')
theme(0,S[3]-.02,.9)
pulse(S[3],k_didnt-.12,.45,1.0)
for m in [50,57,62]: place(pluck(midi(m),1.4),S[3],.2)                 # sting as the fleet launches
# sincere piano: Dm - Bb - F - C, one chord per 2 beats... slow
CH=[[50,57,62,65],[46,53,58,62],[41,53,57,60],[48,55,60,64]]
def keys(t0,t1,g=1.0,dur=4*e,c0=0):
    t=t0; c=c0
    while t<t1-.05:
        ch=CH[c%4]
        place(piano(midi(ch[0]-12),3.0),t,.32*g,-.2)
        for j,m in enumerate(ch[1:]): place(piano(midi(m),2.6),t+j*.11,.2*g,.15*j)
        t+=dur; c+=1
    return c
c=keys(S[7]+.05,S[8]-.1,.9,dur=8*e)
c=keys(S[9]+.1,W(11,'plinian')-.1,.9,dur=8*e,c0=c)
kp=W(11,'plinian')
for j,m in enumerate([41,53,57,60,65,69]): place(piano(midi(m),4.0),kp+j*.07,.3 if j==0 else .22)   # F major: resolves
ir_t=np.arange(int(SR*.6))/SR; ir=rng.normal(0,1,len(ir_t))*np.exp(-ir_t*8); ir[0]=0; ir/=np.abs(ir).sum()/3
from numpy.fft import rfft, irfft
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for ch in range(2): L[:,ch]=L[:,ch]*.85+conv(L[:,ch],ir)*.3
g=np.ones(n)
def gate(a,b,fade=.04):
    i0=int(a*SR); i1=int(b*SR); f=int(fade*SR); g[i0-f:i0]=np.minimum(g[i0-f:i0],np.linspace(1,0,f)); g[i0:i1]=0
gate(k_didnt-.1,S[7]); gate(S[8]-.05,S[9]+.05)
L*=g[:,None]; L=L[:int(SR*TOTAL)]; L/=np.abs(L).max()*1.05
sf.write('vo/music_raw.wav',L.astype(np.float32),SR)
print('didnt',round(k_didnt,2),'piano',round(S[7],2),'plinian',round(kp,2),'total',TOTAL)
