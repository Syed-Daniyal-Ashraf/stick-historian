# ENGINE.md: one-page reference

Update this file in the same change as any engine change. Rules and history are in `CLAUDE.md`.

## Commands (run from the project root; EP = episode folder, e.g. `mo`)
| Step | Command | Output |
|---|---|---|
| Voice | `cd EP && python3 vo/gen.py && python3 vo/timeline.py` | `vo/lines.json`, `vo/timing.json`, `vo/voice.wav` |
| Word times | `python3 engine/tools/align.py EP` (`--check` = report only) | measured word times in `vo/timing.json`; the estimate is kept in `vo/timing_est.json` |
| Build | `engine/make.sh EP` | `<out>.html` (preview with voice + music) |
| Contact sheet | `SAFE=1 SCALE=.3 COLS=8 node engine/tools/shots.js EP sheet.png t1 t2 ...` | tiled frames; `SAFE=1` shades the area the Reels interface covers |
| Gates | `node engine/tools/verify.js EP` | `VERIFY: PASS` or `FAIL` plus a JSON report |
| Sound | `cd EP && python3 vo/sound.py && python3 vo/bed.py` | `vo/music_raw.wav`, `out/fx_real.wav`, `vo/bed.wav`, `vo/bed.mp3` |
| Draft | `DRAFT=1 node engine/tools/export.js EP` | `EP/out/draft.mp4` (540 px, 15 fps), `EP/out/render_time_draft.json` |
| Motion gate | `node engine/tools/motion.js EP [video]` | `MOTION: PASS` or `FAIL`: still stretches, pops, hard cuts missing from `film.CUTS` |
| Final | `node engine/tools/export.js EP && bash engine/tools/mix.sh EP` | `<file>.mp4` in the root, 1080x1920, 30 fps, -14 LUFS; `EP/out/render_time.json` |
| Cover | `node engine/tools/cover.js EP` | `<file>-Cover-4K.png` (frame at `COVER_T`) |
| Regression | `node engine/compare.js old.html new.html` | pixel-compares 24 frames of two builds |

Environment: `TTS_DIR`, `ASSETS_DIR` (default `assets/`), `CHROMIUM_PATH`, `WORKERS` (export browsers, default 2), `FPS`, `W`.

`verify.js` checks: (1) determinism, any frame renders the same whatever was drawn before; (2) reach, no hand or foot
target more than 6 units beyond the limb; (3) subtitles inside x 65-1015 / y 270-1250 and every narrated word covered;
(4) `captions` (big mode only): FAIL on a chunk that breaks the rules (`ruleBreaks`) or can't fit at 104 px (`tooWide`), WARN `under025`;
(5) `cadence`: the gaps between `film.CUTS`. Enforced only when the episode declares `CUT_EP`: FAIL on a gap over 3.4 s (4.5 s in
`CUT_HOLD_EP` shots), WARN `gapsOver3` / `gapsUnder1`. Without `CUT_EP` it is printed for information. Also prints `renderMs` (building the frame's SVG; the paint pass is `paint.paintMs`).
(6) **paint**: 60 frames hashed (canvas pixels + SVG markup, FNV-1a) must match in a scrambled order on the same page and on a
second, freshly started browser (the export uses parallel browsers); hashes go to `EP/out/paint_hashes.json` and the next run
reports `changedSinceLastRun` (not a failure). Episodes that paint also get `paintMs {median,p95}` (paint pass alone, 120 frames)
and `bakeMs` (texture baking). Episodes that don't paint skip the canvas part at no cost.
It does not check labels, faces or props against the safe area: look at a `SAFE=1` sheet for those.

`motion.js` reads the rendered draft (or final) video at 15 fps, 180x320 grey, ignores the caption band (y 970-1270) and
measures motion as the change in the 10 most-changed 10x10 blocks, so paper grain and line boil don't count as movement.
(1) **still**: 1 s or more with motion under 6 is a WARN; 2 s (`STILL_MAX`) is a FAIL unless it is the last 1.5 s or inside
`HOLD_OK_EP` (`const HOLD_OK_EP=[[t0,t1,'why']];` in `shots.js`, absolute seconds). (2) **pop**: one frame where part of the
picture jumps far more than its neighbours, away from a cut (WARN: a snapped pose or an inset with no entrance; shakes and
stamp slams also show up, so look). (3) **uncut**: a whole-frame change that is not in `film.CUTS`; add it to `CUT_EP` so
`verify.js` cadence sees it. It prints a `shots.js` command for every flagged time. Tuned on the yo/tn/mo drafts:
mo and tn pass, yo fails on two holds of 2.1 and 2.5 s.

`align.py` aligns each narrated line on its own (pocketsphinx, offline) and replaces the estimated word times; line starts
(`v0`) are kept, so shot lengths and the score don't move. Words it can't place keep the estimate shifted by their nearest
measured neighbour, and each word gets `src` `m` (measured) or `e`. Re-running it re-measures from `timing_est.json`,
so it's repeatable; running `timeline.py` again starts a fresh estimate. On yo the estimate was off by a median 82 ms,
up to 334 ms; against silence-gap onsets the measured times were within a median 3 ms (estimate 4 ms) and a mean 14 ms
(estimate 35 ms). English only.
It also does not judge whether a cut changes the picture: put frames 0.1 s before and after every cut on a contact sheet.

## Frame and timing (engine/template.html)
- Frame is 1080x1920. `renderAt(t)` draws any time from scratch. `S(n)` / `SE(n)` = start / end of shot n.
- `cu(n,'word')` = seconds after shot n starts at which that narrated word begins.
- `keys(u,[[t,value,ease],...])`, `seg(u,a,b,ease)`, `lerp`, `mix(a,b,k)` (numbers, arrays, objects), easings `E.io E.o E.i E.lin E.back`.
- `SEQ` lists the shots; each shot function `shN(t)` returns SVG for the whole frame. `overlays(t)` draws titles + subtitles.

## Painted layer (engine/template.html + engine/toon/15_paint.js; first used by ic/)
A `<canvas id="paint">` sits under the SVG, same 1080x1920 frame. The SVG still draws the rig, props, labels and captions; the canvas
draws soft skies, water, wood, light and haze. A shot paints by calling `paint(ctx=>{...})` while it builds its SVG (it only queues);
`renderAt` runs the queue after the shot functions. Painters work in 1080x1920 units at any pixel density (backing = 1080x1920 x
`min(devicePixelRatio,2)`, so the 4K cover is sharp). A shot that never calls `paint()` leaves the canvas empty and unallocated:
mo, lb, yo and tn render pixel-identical (compare.js, 24 frames each, 2026-11-23).
- **Camera:** `camCtx(ctx,c,oy)` applies the same matrix as `cam(c,svg,oy)` (`camM(c,oy)` returns it, same rounding). Pass both the
  same camera object. Screen-space painters (sky, sea, haze) take the camera only for parallax. Shakes applied with `jolt()` are SVG-only:
  apply the same offset in the painter if the background must shake too.
- **Transitions:** whip/push move queued painters with the SVG; dissolves fade them; whips blur them (5 offset copies). A dissolve
  between a painted shot and an unpainted shot with an opaque SVG background hides the painted one until the cut: use a hard cut or whip there.
- **Blending:** `finish()`'s paper and grade rects (`mix-blend-mode:multiply`) DO blend with the canvas underneath in headless Chromium
  (measured: red canvas under a grey multiply rect reads (128,0,0)), so painted shots use `finish()` as usual. Inside a whip the world
  is wrapped in a filter group, which isolates the blend for those 0.2 s.
- **Determinism:** painters may use only `t`, the camera, their options and fixed seeds (no `Math.random`, `Date`, `performance.now`).
  Caches are keyed by the full input (`cached(key,make)` in 15_paint.js), never by "last frame". `verify.js` checks it across two browsers.
- **15_paint.js** (global name `PNT`, not `P`: shots use `P=part(n,u)` locally): seeded `rng(seed)`, `hash2`, `vnoise` (tileable),
  `fbm`, `smoothstep`. Textures are baked on first use (~300 ms total; episodes that never paint pay nothing): `tex('wood')` planks,
  `tex('water')` ripples, `tex('glint')` sun sparkle, `tex('cloud')` cumulus band, `tex('grain')`.
  Painters: `PNT.sky(ctx,{top,mid,bot,midAt,y1,sun:[x,y,r,col],halo})` (fills only to y1+100), `PNT.stars(ctx,{n,alpha,y1,t,seed})`,
  `PNT.clouds(ctx,cam,t,{alt,h,drift,alpha,scale,par,seed,tint:[col,a]})`, `PNT.sea(ctx,cam,t,{horizon,bottom,deep,shallow,haze,glint:[x,a],swell,speed,strips})`
  (set `bottom` to where the set covers it: water strips are the costliest thing here), `PNT.wood(ctx,[x,y,w,h],{tone,light,scale,rot})`
  (rot 90 = a mast), `PNT.deck(ctx,y0,y1,{tone,rows,grow,light,shade,x0,x1})` (planks receding; the plank layer is cached),
  `PNT.shafts(ctx,{x,y,angle,spread,n,len,width,alpha,col,motes,t,seed})`, `PNT.glow(ctx,x,y,r,col,a)`, `PNT.haze(ctx,y0,y1,col,a)`,
  `PNT.shimmer(ctx,y0,y1,t,amp)` (screen space only), `PNT.vignette(ctx,a)` (finish() already vignettes both layers), `PNT.grain(ctx,a,t)`.
- **Cost (ic test shot 5b, 2026-11-23, 2 CPUs):** paint pass median 25-28 ms, p95 35-39 ms (budget 30/60). Per painter: sea ~9,
  deck ~7, sky ~4.5, wood ~4.5 (3 rects), clouds ~2, glow ~1 ms. Export of a 20 s run of the shot: 0.73 s/frame/worker against yo's
  0.491 (1.49x, budget 1.5x). Frame capture is about the same as yo (median 388 vs 377 ms); the extra time is x264 encoding the
  textured picture at `-preset slow -crf 14`. If a full painted episode goes over budget, try `-preset medium` for it before cutting painters.

## Toon kit (engine/toon)
**15_paint.js**: see "Painted layer" above.

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
`strut(u,x0,x1,u0,u1,s,step,swing)` walk (speed ramps up and down when the episode sets `WALK_RAMP_EP=.14` in `meta.js`; without it, constant speed as before. Feet stay planted either way. Best for walks that start and stop on screen; a walk that enters from off screen spends its slow start out of view), `burst`, `dust`, `web`, and the Indian village / office / police sets from Lal Bihari.
`courtroom(u,t,slam)` and `TC.judge` (shared by mo/ and yo/).

**yo/src/props.js** (copy, don't import, if another episode needs them): `yoyo(hx,hy,u,mode,o)` string prop, modes `drop sleep return bob walk`;
`handPt(x,y,s,dir,pose)` converts a world point to an `hF` local; `bigWord(x,y,size,{reg,crack,...})` 3D word with a crackable (R).

`engine/tools/shots.js` also takes `CLIP=x,y,w,h` to crop dense strips (e.g. `CLIP=200,300,600,600`).

## Episode files
- `episode.json`: `title sub aria foot out file`.
- `src/meta.js`: `SKIP_SUBS`, `SPEAKERS`, `SHOT_META` (subtitle y per shot), `MERGE_EP`, optional `LIFE_EP`, `SUB_MAXW_EP`, `WALK_RAMP_EP` (new episodes: `.14`).
- `src/props.js`: episode sets, props, costumes. `src/shots.js`: `COVER_T`, shots, `SEQ`, `overlays`.
- `mo/src/shots.js` helpers worth copying: `stage(x,z,g)` (ground line fixed at screen y 1115), `under(colour)`, `panelBox(...)`.

## Audio (EP/vo)
- `gen.py`: Kokoro `af_heart`. `SCRIPT` rows `(shot,'N',text,speed,gap)`. `PH` replaces phonemes, `REPL` replaces spellings.
- `timeline.py`: `BPM`, `MIN`, `LEAD`, `TAIL`; every shot length is rounded up to whole beats. Writes `bpm` into `timing.json`.
- `sound.py`: one beat grid from `timing.json`; `SECT` = (start, mode, level dB). Modes in `mo`: `rag soft pizz sad roll tense hush out`.
  Sections are levelled to their targets (printed). Stingers and foley are placed on word times with `W(shot,'word')`.
- `bed.py`: music 6 LU under the voice, ducked 7 dB more under speech. `mix.sh`: adds foley, two-pass loudnorm to -14 LUFS, then a limiter (ceiling -2 dBFS).
