# The Stick Historian: code-animated history reels

Faceless Instagram Reels / YouTube Shorts (@thestickhistorian). Every video is drawn and animated in code (SVG in a browser), narrated with a local TTS voice, scored and mixed offline, and exported to 1080×1920 MP4 with Playwright + ffmpeg.

The owner is Farrukh. Be direct and concise. Do the work instead of asking questions when the request is clear. Do not reverse a decision just because he pushes back. Say plainly what you could not check.

## Channel rules (non-negotiable)
- **History only.** No "History Has Receipts" segment and no mascot "prove it" beat. Sources go in the caption or a pinned comment, never in the video.
- **Accuracy:** every narrated claim and every piece of on-screen text must be verifiable. Search before writing. When sources disagree, use the safe wording ("reportedly", "about", "his relatives") and note the disagreement in the pinned comment. Don't invent quotes or motivations. Short, clearly comic tags ("ARREST ME!") are fine as dramatisation.
- **One narrator voice** (Kokoro `af_heart`). Character voices were tried and rejected: Farrukh called them "AI slop". Don't bring them back.
- **No spending:** vidIQ voiceover credits, paid stock, paid APIs. Only free, licence-clean assets: CC0 or OFL, recorded in `episode.json` → `foot`.
- **Never publish or post** to his accounts. Deliver the MP4, the 4K cover and a caption with a sources comment.
- **Hook:** the first frame must show the premise (e.g. "I AM ALIVE" sign + DEAD stamp). Get to the best material before ~20 s; his average watch time is ~19–21 s. Target 45–60 s.
- **Look and motion matter most:** "bland" animation was his biggest complaint. Every shot needs a gag, a reveal or a camera move. Avoid repeated walking, static talking heads and PowerPoint-style text slides.

## Layout
```
ENGINE.md                 one-page reference: rig, camera, subtitles, audio and every command. Read it first.
engine/template.html      player + renderer (camera, SEQ cuts, WebAudio preview)
engine/build_episode.py   fills the template from <ep>/episode.json + <ep>/src/*
engine/make.sh <ep>       joins engine/toon/*.js + <ep>/src/props.js + <ep>/src/shots.js, then builds ../<out>.html
engine/toon/              THE SHARED TOON KIT, used by every toon episode. Fix the rig here, never in an episode copy.
  10_base.js              palette, finish() (line boil, paper, grade, vignette), cam(), type, stamps, subtitles
  20_rig.js               toon() rig, costumes TC, expressions EX, poses TP, full()/tween() pose blending, shoes, idle life
  30_world.js             shared props and sets (desk, paper, bigArm, strut, burst, dust, web, Indian village/office sets)
engine/tools/             export.js, shots.js, verify.js, cover.js, mix.sh. All take the episode folder as first argument.
build/fonts.css           embedded fonts (Anton, Fell, Fraktur, Baloo 2, Kalam, Rozha One)
assets/                   fonts (OFL), tts model, CC0 sample libraries (created by scripts/setup.sh)
mo/   Monopoly / Lizzie Magie (2026-11) - CURRENT STANDARD: safe-area staging, pose tweens, one-tempo score
lb/   Lal Bihari "dead for 18 years" (2026-11) - same kit; its subtitles still sit below the safe area (verify.js reports it)
yo/   Pedro Flores and the word "yo-yo" (2026-11) - IN PRODUCTION: Stage C done (draft built, `verify.js` PASS), Stage D next (see yo/brief.md section 10)
px/ r2/ rc/               older stick-rig episodes with their own tool copies. Leave as they are.
```
An episode folder holds only what is its own: `episode.json` (title, `out` html name, `file` mp4 name), `src/meta.js`
(subtitle y per shot, `MERGE_EP` number words, `LIFE_EP`, `SUB_MAXW_EP`), `src/props.js` (sets, props, costumes),
`src/shots.js` (`sh1..shN`, `SEQ`, `overlays()`, `COVER_T`), `src/defs.html`, and `vo/` (script, timing, score).
Do not redeclare `world`, `capsEl` or `SUB_MAXW` in episode code; the template owns them.

## Staging rules (learned on Monopoly)
- **Safe area.** The Reels interface covers the top 270 px and everything below 1250 px. Picture that matters sits in
  y 290-1110; the subtitle is one line with its baseline at 1190; below that only floor or paper. `verify.js` fails
  the build if a subtitle leaves x 65-1015 / y 270-1250. Check labels and faces with `SAFE=1` contact sheets.
- **Wide shots use `stage(x,z,g)`** (in `mo/src/shots.js`): the ground line stays at screen y 1115 whatever the zoom.
  With a hat, keep z <= .93 or the hat enters the top band. Labels go in screen space after the camera.
- **Poses never snap.** Change a pose with `tween(u,t0,full(A),full(B),d)` or a continuous `mix()`. A one-frame pose
  switch (`cond?poseA:poseB`) is the "bland code animation" look and is not allowed.
- **Reach.** A hand target further than ~114 local units from the shoulder stops short. `verify.js` lists every miss.
- **One tempo.** `vo/timeline.py` starts every shot on a beat; `vo/sound.py` runs one beat grid for the whole film and
  changes only the arrangement per section, then levels each section. Do not restart the music at a cut.

## Pipeline (from the project root; EP = episode folder, e.g. mo)
1. **Script:** edit `SCRIPT` in `EP/vo/gen.py`. `(shot, 'N', text, speed, gap)`; `*word*` highlights. Fix names with `PH` or `REPL`.
2. **Voice:** `cd EP && python3 vo/gen.py && python3 vo/timeline.py` (writes `vo/timing.json`, `vo/voice.wav`).
3. **Picture:** write shots, then `engine/make.sh EP`. Open `<out>.html` to preview (voice + music; foley is only in the MP4).
4. **Stills:** `SAFE=1 node engine/tools/shots.js EP sheet.png 0.5 1.5 ...` Check every second, and dense strips (0.1 s) at every pose change.
5. **Gates:** `node engine/tools/verify.js EP` must print `VERIFY: PASS` (determinism, reach, subtitles in the safe area, every word covered).
6. **Sound:** `cd EP && python3 vo/sound.py && python3 vo/bed.py` (prints the level of each music section).
7. **Draft:** `DRAFT=1 node engine/tools/export.js EP` (540 px, 15 fps).
8. **Final:** `node engine/tools/export.js EP && bash engine/tools/mix.sh EP` writes `<file>.mp4` in the project root, -14 LUFS.
   JPEG capture with 2 parallel browsers: see ENGINE.md for the measured time.
9. **Cover:** `node engine/tools/cover.js EP`.

## Quality gates before delivering
- **Facts:** an independent review pass (spawn a fresh agent with the frames + script, no conclusions) checks facts against sources and gives timestamps for text collisions, cropped characters and swipe risks. Fix what it finds.
- **Text:** no text over faces, no two text layers colliding, nothing cut off at the frame edge, subtitles kept clear of the Reels UI (y < ~1650).
- **Continuity:** costume and ageing stay consistent across shots (`cos:{grey:…}` only ever increases), and the same character always has the same silhouette.
- **Ears:** you cannot hear audio. Measure loudness per section with ffmpeg `ebur128` and tell Farrukh to listen, especially to pronunciation and the music.

## Known gotchas
- Fonts load lazily: `engine/tools/common.js` waits for `window.__fontsReady` before any screenshot. Use it for new tools.
- `UID` is reset each frame in `finish()`; otherwise clip ids change and `verify.js` reports mismatches.
- `cu()` matches the first word whose normalised form starts with the prefix. For a repeated word, use an offset from a unique word.
- Word times in `timing.json` are estimates (phoneme counts between detected pauses), not measurements. Long phrases can drift.
- `tween()` blends numbers and arrays; text fields (expr, hand shape) switch halfway. Always wrap poses in `full()`.
- Chromium: set `CHROMIUM_PATH` only if you need a specific browser.

## Results so far (for strategy)
This is the single results log. Don't keep a second copy anywhere else (including in Claude's own skills) — update it here so it can't drift out of sync with itself.

- Old reels averaged ~21 s watch time and 0 shares. Receipts #2 (`r2`, Theon) got 1,900 views, 3 shares, a 1.6% like rate and 30% skip.
- An earlier per-video count, from before the current folder set, for three videos not identifiable against today's folders (Pig War, Ea-nasir, and an "Olympic Marathon"):

  | Metric | Pig War | Ea-nasir | Olympic Marathon |
  |---|---|---|---|
  | Views | 1,428 | 1,453 | ~2,100 |
  | Duration | 67 s | 54 s | 40 s |
  | Average watch time | 21 s | 21 s | 21 s |
  | Completion rate | 15% | 8% | 29% |
  | Skip rate | 34.2% | 22.8% | 20.4% |
  | Likes | 21 | 17 | 22 |
  | Shares | 0 | 0 | 0 |
  | Saves | 0 | 0 | 0 |

  Confirmed (Farrukh, 2026-11-10): the 1904 Olympic Marathon was already made and already has these metrics. It is not a planned story.
- `lb` (Lal Bihari) was the first video to generate shares, after the rig was rebuilt with expressive faces/poses and real CC0 audio replaced synthesized sound. Full metrics not yet recorded — add at the next 72h/7-day review instead of estimating.
- Account-wide profile visits: 23 (not necessarily attributable to any one Reel).
- Biggest audiences are the USA, India and the Philippines. Philippines: Pedro Flores and the yo-yo is in production (`yo/`). Backlog: the staged "mock" Battle of Manila (1898). USA: Kellogg brothers' fight over their own name was pitched and is the front-runner (the Olympic Marathon above is already done, not a candidate). India: Sake Dean Mahomed, "Shampooing Surgeon" to George IV, was pitched; note the word "shampoo" was in English from 1762, before him.
