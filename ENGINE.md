# ENGINE.md: one-page reference

Update this file in the same change as any engine change. Rules and history are in `CLAUDE.md`.

## Commands (run from the project root; EP = episode folder, e.g. `mo`)
| Step | Command | Output |
|---|---|---|
| Voice | `cd EP && python3 vo/gen.py && python3 vo/timeline.py` | `vo/lines.json`, `vo/timing.json`, `vo/voice.wav` |
| Build | `engine/make.sh EP` | `<out>.html` (preview with voice + music) |
| Contact sheet | `SAFE=1 SCALE=.3 COLS=8 node engine/tools/shots.js EP sheet.png t1 t2 ...` | tiled frames; `SAFE=1` shades the area the Reels interface covers |
| Gates | `node engine/tools/verify.js EP` | `VERIFY: PASS` or `FAIL` plus a JSON report |
| Sound | `cd EP && python3 vo/sound.py && python3 vo/bed.py` | `vo/music_raw.wav`, `out/fx_real.wav`, `vo/bed.wav`, `vo/bed.mp3` |
| Draft | `DRAFT=1 node engine/tools/export.js EP` | `EP/out/draft.mp4` (540 px, 15 fps) |
| Final | `node engine/tools/export.js EP && bash engine/tools/mix.sh EP` | `<file>.mp4` in the root, 1080x1920, 30 fps, -14 LUFS |
| Cover | `node engine/tools/cover.js EP` | `<file>-Cover-4K.png` (frame at `COVER_T`) |
| Regression | `node engine/compare.js old.html new.html` | pixel-compares 24 frames of two builds |

Environment: `TTS_DIR`, `ASSETS_DIR` (default `assets/`), `CHROMIUM_PATH`, `WORKERS` (export browsers, default 2), `FPS`, `W`.

`verify.js` checks: (1) determinism, any frame renders the same whatever was drawn before; (2) reach, no hand or foot
target more than 6 units beyond the limb; (3) subtitles inside x 65-1015 / y 270-1250 and every narrated word covered;
(4) `captions` (big mode only): FAIL on a chunk that breaks the rules (`ruleBreaks`) or can't fit at 104 px (`tooWide`), WARN `under025`;
(5) `cadence`: the gaps between `film.CUTS`. Enforced only when the episode declares `CUT_EP`: FAIL on a gap over 3.4 s (4.5 s in
`CUT_HOLD_EP` shots), WARN `gapsOver3` / `gapsUnder1`. Without `CUT_EP` it is printed for information. Also prints `renderMs`.
It does not check labels, faces or props against the safe area: look at a `SAFE=1` sheet for those.
It also does not judge whether a cut changes the picture: put frames 0.1 s before and after every cut on a contact sheet.

## Frame and timing (engine/template.html)
- Frame is 1080x1920. `renderAt(t)` draws any time from scratch. `S(n)` / `SE(n)` = start / end of shot n.
- `cu(n,'word')` = seconds after shot n starts at which that narrated word begins.
- `keys(u,[[t,value,ease],...])`, `seg(u,a,b,ease)`, `lerp`, `mix(a,b,k)` (numbers, arrays, objects), easings `E.io E.o E.i E.lin E.back`.
- `SEQ` lists the shots; each shot function `shN(t)` returns SVG for the whole frame. `overlays(t)` draws titles + subtitles.

## Toon kit (engine/toon)
**10_base.js**
- `finish(svg,t,{boil,paper,grade,vig})` wraps a shot: line boil (10 fps), paper grain, colour grade, vignette.
- `cam({x,y,z,oy},svg,oy)` world point (x,y) lands at screen (540, oy); oy defaults to 960.
- `ttl(text,x,y,size,fill,{k,rot})` title type; `tag(text,x,y,size,bg,fg,{k,rot})` label; `stampMark(x,y,[lines],col,k,rot,size)`.
- `wob(u,t0,amp,f,d)` damped wobble; `shakeV(u,t0,amp,dur)` + `jolt(v,svg)` impact shake.
- Subtitles `mySubs(t)`: one line, word pop, y from `SHOT_META[n].subY`, width limit `SUB_MAXW_EP`, number words merged by `MERGE_EP`.
- **Big captions** (`CAP_MODE_EP='big'` in `meta.js`; `mySubs` then draws `bigSubs`): 1-2 words, Baloo 800 at 150 px (shrinks to fit 900 px,
  never below 104), centred at x 540, baseline `SHOT_META[n].capY` (default **1166**; the old `subY` is ignored in this mode). The text box is
  y ~1004-1245 at full size; the letters sit in ~1050-1175, so faces and labels stay above ~1040. Highlights (`*word*`) in gold.
  Chunk rules (see the comment in `10_base.js`): a highlighted word stands alone (short words may lead it); words pair up; punctuation ends a chunk;
  short words (`CAP_SHORT`) never stand alone, they take the next word (3 words max, first two short); a pair is <= 12 characters and a
  short-led chunk <= 14; a chunk under 0.25 s merges forward (if the previous ends a phrase) or backward when the result still fits.
  Pop: scale .7 -> 1 over 0.12 s, no overshoot. Chunks are on `film.CAPS.chunks`.
- **In-shot cuts** (`CUT_EP` in `shots.js`): `const CUT_EP={3:['nineteen',['own',-.1],2.4]}` per narrated shot: word prefix (`cu`), `[word, offset]`
  or seconds into the shot. In the shot: `const P=part(3,u)` gives `{i, pu, p0, p1}` (sub-shot index, time into it, its bounds in shot seconds);
  switch the set/framing on `P.i`. `film.CUTS` = every `SEQ` start + every cut point (absolute s). `CUT_HOLD_EP=[n]` allows the final hold up to 4.5 s.
  A cut must change the set, the subject, or the framing (>= 1.4x zoom or a reversed angle); a slow push is not a cut.

**20_rig.js**
- `toon(who,x,y,scale,dir,pose,t,seed)`; feet at (x,y), figure ~340 units tall, `dir` 1 faces right, -1 left.
- Pose fields: `lean tilt hy hx shrug` (numbers), `hF hB` hand targets and `fF fB` foot targets (local `[x,y]`, y up is negative),
  `handF handB` (`open fist point flat hold`), `expr` (keys of `EX`), `look [x,y]`, `holdF holdB {svg,rot,over}`, `sq` squash, `cos {...}` costume override.
- `full(pose)` fills every animated field; `tween(u,t0,A,B,d,ease)` goes A to B from t0 over d seconds with anticipation and overshoot.
- Costumes `TC.<name>`: `skin hair top topDk pants shoe headS build` plus flags `suit dress sari khaki dhoti vest updo bun bald young beard glasses fem grey cap capC mus`.
  `cap` is `flat`, `topi` or `pillbox` (bellboy hat: `capC` colour, `band` gold by default).
  `suit`, `dress` or `shoes` gives closed shoes; otherwise sandals. Episode costumes are added in the episode's `props.js`.
- `LIFE_EP=1` (in `meta.js`) adds a slow idle sway of spine and head.
- Limits: arm reach ~114 units from the shoulder, leg ~128 from the hip. One fixed three-quarter view; no front or back view.

**30_world.js**: `st(fill,w)`, `desk`, `deskTop`, `paper`, `bigArm(shoulder,hand,skin,sleeve,hand,propSvg,w)` for top-down inserts,
`strut(u,x0,x1,u0,u1,s,step,swing)` walk, `burst`, `dust`, `web`, and the Indian village / office / police sets from Lal Bihari.
`courtroom(u,t,slam)` and `TC.judge` (shared by mo/ and yo/).

**yo/src/props.js** (copy, don't import, if another episode needs them): `yoyo(hx,hy,u,mode,o)` string prop, modes `drop sleep return bob walk`;
`handPt(x,y,s,dir,pose)` converts a world point to an `hF` local; `bigWord(x,y,size,{reg,crack,...})` 3D word with a crackable (R).

`engine/tools/shots.js` also takes `CLIP=x,y,w,h` to crop dense strips (e.g. `CLIP=200,300,600,600`).

## Episode files
- `episode.json`: `title sub aria foot out file`.
- `src/meta.js`: `SKIP_SUBS`, `SPEAKERS`, `SHOT_META` (subtitle y per shot), `MERGE_EP`, optional `LIFE_EP`, `SUB_MAXW_EP`.
- `src/props.js`: episode sets, props, costumes. `src/shots.js`: `COVER_T`, shots, `SEQ`, `overlays`.
- `mo/src/shots.js` helpers worth copying: `stage(x,z,g)` (ground line fixed at screen y 1115), `under(colour)`, `panelBox(...)`.

## Audio (EP/vo)
- `gen.py`: Kokoro `af_heart`. `SCRIPT` rows `(shot,'N',text,speed,gap)`. `PH` replaces phonemes, `REPL` replaces spellings.
- `timeline.py`: `BPM`, `MIN`, `LEAD`, `TAIL`; every shot length is rounded up to whole beats. Writes `bpm` into `timing.json`.
- `sound.py`: one beat grid from `timing.json`; `SECT` = (start, mode, level dB). Modes in `mo`: `rag soft pizz sad roll tense hush out`.
  Sections are levelled to their targets (printed). Stingers and foley are placed on word times with `W(shot,'word')`.
- `bed.py`: music 6 LU under the voice, ducked 7 dB more under speech. `mix.sh`: adds foley, two-pass loudnorm to -14 LUFS, then a limiter (ceiling -2 dBFS).
