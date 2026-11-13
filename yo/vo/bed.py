# voice + music bed with sidechain ducking (music dips under speech), 48 kHz stereo
import numpy as np, soundfile as sf, subprocess, re
SR=48000
subprocess.run(['ffmpeg','-y','-v','error','-i','vo/voice.wav','-ar','48000','vo/voice48.wav'],check=True)
v,_=sf.read('vo/voice48.wav'); m,_=sf.read('vo/music_raw.wav')
n=min(len(v),len(m)); v=v[:n]; m=m[:n]
def lufs(f):
  o=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',f,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
  return float(re.findall(r'I:\s+(-?[\d.]+) LUFS',o)[-1])
lv=lufs('vo/voice48.wav'); lm=lufs('vo/music_raw.wav')
m=m*10**((lv-6-lm)/20)                      # music sits 6 LU under the voice...
hop=int(SR*.01); env=np.array([np.sqrt(np.mean(v[i:i+hop]**2)) for i in range(0,n,hop)])
env=(env>np.max(env)*.04).astype(float)
sm=np.zeros_like(env); a,r=.35,.06            # fast attack, slow release
for i in range(len(env)): sm[i]=sm[i-1]+(env[i]-sm[i-1])*(a if env[i]>sm[i-1] else r) if i else env[0]
g=10**(-7*sm/20)                              # ...and ducks a further 7 dB while someone speaks
g=np.repeat(g,hop)[:n]
out=np.stack([v,v],1)+m*g[:,None]
sf.write('vo/bed.wav',out.astype(np.float32),SR)
subprocess.run(['ffmpeg','-y','-v','error','-i','vo/bed.wav','-b:a','160k','vo/bed.mp3'],check=True)
print('voice',lv,'music raw',lm,'-> music set to',round(lv-6,1),'LUFS before ducking')
