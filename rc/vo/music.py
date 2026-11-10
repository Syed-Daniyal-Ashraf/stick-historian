"""Original score, synthesized here: a light plucked-string groove (Karplus-Strong) with a woodblock.
Starts on the cold open, drops out for 'PROVE IT.', runs under the log, stops dead on '...for the scribe.',
returns softly for the receipt, resolves on 'Two of the forty' with a small button."""
import json, numpy as np, soundfile as sf
SR=48000
T=json.load(open('vo/timing.json')); TOTAL=T['total']; S=[s['start'] for s in T['shots']]
def W(shot,word):
    for l in T['shots'][shot-1]['lines']:
        for w in l['words']:
            if w['w'].lower().strip('.,…?!:').startswith(word): return w['t']
    raise KeyError(word)
rng=np.random.default_rng(11); _c={}
def pluck(f,dur=.6,bright=.5):
    key=(round(f,2),dur,bright)
    if key in _c: return _c[key]
    n=int(SR*dur); P=max(2,int(SR/f)); buf=rng.uniform(-1,1,P); out=np.zeros(n)
    for i in range(n):
        out[i]=buf[i%P]; nxt=buf[(i+1)%P]; buf[i%P]=.996*(bright*buf[i%P]+(1-bright)*nxt) if False else .995*.5*(buf[i%P]+nxt)
    out*=np.exp(-np.arange(n)/SR*3.5); out/=np.abs(out).max()+1e-9; _c[key]=out; return out
def block(f=900):
    n=int(SR*.06); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*np.exp(-t*90)
n=int(SR*(TOTAL+1.5)); L=np.zeros((n,2))
def place(x,t0,g,pan=0):
    i=int(t0*SR)
    if i<0 or i>=n: return
    m=min(len(x),n-i); L[i:i+m,0]+=x[:m]*g*(1-pan*.6); L[i:i+m,1]+=x[:m]*g*(1+pan*.6)
midi=lambda m:440*2**((m-69)/12)
BPM=116; e=60/BPM/2
BASS=[38,38,45,38,41,38,45,43]            # D dorian walking figure (eighths)
MEL=[[62,None,65,67,None,69,67,None],[65,None,62,None,60,62,None,None],[62,None,65,67,None,72,69,None],[67,65,None,62,None,None,None,None]]
def groove(t0,t1,g=1.0,mel=True,bar0=0):
    t=t0; b=bar0
    while t<t1-.02:
        for q in range(8):
            tt=t+q*e
            if tt>=t1: break
            place(pluck(midi(BASS[q]),.35),tt,.42*g,-.25)
            if q%2==1: place(block(1100 if q%4==1 else 800),tt,.16*g,.3)
            m=MEL[b%4][q]
            if mel and m is not None: place(pluck(midi(m),.5),tt,.26*g,.3)
        t+=8*e; b+=1
    return b
prove=S[1]+.8                                  # silence for the "PROVE IT." bubble
b=groove(0,prove,.9)
k_scribe=W(4,'scribe')
b=groove(S[2]+.1,k_scribe-.08,1.0,bar0=b)
# receipt: soft bass only, then a sting on the stamp
k_real=W(5,'real')
groove(S[4]+.2,S[5]-.05,.55,mel=False)
for m in [50,57,62]: place(pluck(midi(m),1.2),k_real-.04,.3)
# ending: warm resolve on "Two", then a two-note button
k_two=W(6,'two')
for m in [38,50,57,62,66]: place(pluck(midi(m),2.4),k_two-.03,.26)
place(pluck(midi(69),.6),k_two+2.15,.3); place(pluck(midi(74),1.6),k_two+2.15+e,.34)
ir_t=np.arange(int(SR*.5))/SR; ir=rng.normal(0,1,len(ir_t))*np.exp(-ir_t*10); ir[0]=0; ir/=np.abs(ir).sum()/3
from numpy.fft import rfft, irfft
def conv(x,h): m=len(x)+len(h)-1; nf=1<<(m-1).bit_length(); return irfft(rfft(x,nf)*rfft(h,nf),nf)[:len(x)]
for c in range(2): L[:,c]=L[:,c]*.85+conv(L[:,c],ir)*.25
g=np.ones(n)
def gate(a,b,fade=.03):
    i0=int(a*SR); i1=int(b*SR); f=int(fade*SR); g[i0-f:i0]=np.minimum(g[i0-f:i0],np.linspace(1,0,f)); g[i0:i1]=0
gate(prove,S[2]+.08); gate(k_scribe-.05,S[4]+.18)
L*=g[:,None]; L=L[:int(SR*TOTAL)]; L/=np.abs(L).max()*1.05
sf.write('vo/music_raw.wav',L.astype(np.float32),SR)
print('prove',round(prove,2),'scribe stop',round(k_scribe,2),'real',round(k_real,2),'two',round(k_two,2))
