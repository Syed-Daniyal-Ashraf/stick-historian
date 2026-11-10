"""Usage: python3 engine/build_episode.py <episode_dir>
Fills engine/template.html with the episode's episode.json + src/*.{html,js}, embeds fonts, timing and audio,
and writes <episode_dir>/app.html (source) and ../<out>.html (playable, self-contained)."""
import pathlib,json,base64,sys
E=pathlib.Path(__file__).parent; ep=pathlib.Path(sys.argv[1]).resolve()
cfg=json.loads((ep/'episode.json').read_text())
src=lambda f:(ep/'src'/f).read_text().rstrip('\n')
s=(E/'template.html').read_text()
fill={'TITLE':cfg['title'],'SUB':cfg['sub'],'ARIA':cfg['aria'],'FOOT':cfg['foot'],'DEFS':src('defs.html'),'META':src('meta.js'),'COS':src('cos.js'),
      'LIB':(E/'lib.js').read_text().rstrip('\n'),'SCENES':src('scenes.js'),'SFX':src('sfx.js'),'COVER':src('cover.js')}
for k,v in fill.items(): s=s.replace('{{'+k+'}}',v)
assert '{{' not in s.split('<script>')[0] and '{{LIB}}' not in s, 'unfilled placeholder'
(ep/'app.html').write_text(s)
fonts=(E.parent/'build'/'fonts.css').read_text(); vo=(ep/cfg.get('timing','vo/timing.json')).read_text()
audio=ep/cfg.get('audio','vo/bed.mp3')
if not audio.exists(): audio=ep/'vo'/'voice.mp3'
out=s.replace('/*FONTS*/',fonts,1).replace('/*VO*/null',vo,1).replace("'/*VOICE*/'","'data:audio/mpeg;base64,"+base64.b64encode(audio.read_bytes()).decode()+"'",1)
assert '/*VO*/' not in out and '/*VOICE*/' not in out
(E.parent/(cfg['out']+'.html')).write_text(out); print('built',cfg['out']+'.html',len(out),'audio',audio.name)
