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
engine/template.html      player + renderer (camera, SEQ cuts/whips, subtitles, WebAudio sfx, offline sfx render)
engine/build_episode.py   fills the template from <ep>/episode.json + <ep>/src/* -> <ep>/app.html and ../<out>.html
engine/lib.js             shared helpers (KIT: shake, pop, grade, vig, poses) + legacy stick rig helpers
build/fonts.css           embedded fonts (Anton, Fell, Fraktur, Baloo 2, Kalam, Rozha One)
assets/                   fonts (OFL), tts model, CC0 sample libraries (created by scripts/setup.sh)
mo/   Monopoly / Lizzie Magie (2026-11) - newest: toon rig + Edwardian dress, 1930s suits, hats; ragtime score with VSCO upright piano
lb/   Lal Bihari "dead for 18 years" (2026-11) - CURRENT STANDARD: toon rig, line boil, paper grain, real CC0 score+foley
px/   Pliny & Vesuvius (Receipts #3)   r2/  Theon (Receipts #2)   rc/  Sick log (Receipts #1)   - older stick rig
```
Use `mo/` (newest) or `lb/` as the template for new episodes. Its source is split into parts that `make.sh` concatenates into `src/scenes.js`:
- `p0_base.js`: palette, `finish()` (line boil + paper texture + grade + vignette), `cam`, `wob`/`shakeV`, `ttl`/`tag` type, `stampMark`, and its own subtitles (`mySubs`, Baloo, word pop, MERGE for numbers such as 1976 / ₹300 / 1,600).
- `p1_rig.js`: **toon rig** `toon(who,x,y,s,dir,p,t,seed)`. Rubber-hose limbs on a two-bone IK, mitten hands (`open|fist|point|flat|hold`), cel-shaded head, expressions `EX`, costumes `TC` (kurta, sari, khaki, gamchha, caps, `grey` ageing), `holdF/holdB` props, `sq` squash, `garland`. Pose presets live in `TP`.
- `p2_world.js` and `p3_more.js`: props and sets (fan, ledger, stamps, notes, calendar, counters, village, office, cinema, police station, rickshaw, `bigArm` for top-down inserts, `strut` walk, petals, burst).
- `p4_shots.js`: `sh1..shN` (one function per narration shot, time `u` from the shot start, word cues via `cu(shot,'word')`), `SEQ`, `overlays()`.
- `meta.js`: `SKIP_SUBS` (all lines, because the episode draws its own subtitles) and `SHOT_META` (subtitle y per shot).

Do not redeclare `world` or `capsEl` in episode code; the template owns them.

## Pipeline (run inside the episode folder, e.g. `cd lb`)
1. **Script:** edit `SCRIPT` in `vo/gen.py`. Each entry is `(shot, 'N', text, speed, gap)`; `*word*` highlights a word. Fix names with `PH` (phoneme replace) or `REPL`.
2. **Voice:** `python3 vo/gen.py` writes per-line wavs and `vo/lines.json` with word times. Then `python3 vo/timeline.py` (`MIN`/`LEAD`/`TAIL` per shot) writes `vo/timing.json` + `vo/voice.wav`.
3. **Picture:** write the shots, then `./make.sh` writes `../lal-bihari.html`. Open it in a browser to preview with audio.
4. **Check stills:** `node shots.js fr/sheet.png 0.5 1.5 ...` tiles frames at given times. Check every second of the film, and use dense strips (0.1 s apart) for walks, impacts and hand-offs.
5. **Check logic:** `node verify.js` (determinism must report `mismatches: []`) and `node lines.js` (subtitle coverage).
6. **Sound:** `python3 vo/sound.py` (score + foley cued to word times, writes `vo/music_raw.wav` + `out/fx_real.wav`), then `python3 vo/bed.py` (ducks the music under the voice, writes `vo/bed.wav`/`bed.mp3`).
7. **Draft export:** `FPS=15 W=540 OUT=animatic.mp4 node export.js`.
8. **Final export:** `node export.js && bash mix.sh` writes `../../Lal-Bihari-Dead-Man.mp4`, loudnorm −14 LUFS. On the cloud box a 60 s film took ~35 min, so expect much faster locally.
9. **Cover:** `node cover.js` (frame at `COVER_T`) writes a 4K PNG.

## Quality gates before delivering
- **Facts:** an independent review pass (spawn a fresh agent with the frames + script, no conclusions) checks facts against sources and gives timestamps for text collisions, cropped characters and swipe risks. Fix what it finds.
- **Text:** no text over faces, no two text layers colliding, nothing cut off at the frame edge, subtitles kept clear of the Reels UI (y < ~1650).
- **Continuity:** costume and ageing stay consistent across shots (`cos:{grey:…}` only ever increases), and the same character always has the same silhouette.
- **Ears:** you cannot hear audio. Measure loudness per section with ffmpeg `ebur128` and tell Farrukh to listen, especially to pronunciation and the music.

## Known gotchas
- Fonts load lazily: tools must `await window.__fontsReady` before the first screenshot. `export.js`, `shots.js` and `snap.js` already do.
- Reset `UID` each frame (done in `finish()`), otherwise clip ids change and `verify.js` reports mismatches.
- IK reach is limited (~114 local units × scale), so a hand target out of reach stops short. Move the figure or the prop instead.
- `cu()` matches the first word whose normalised form starts with the prefix. For a repeated word, use an offset from a unique word.
- Chromium: set `CHROMIUM_PATH` only if you need a specific browser; otherwise Playwright's own browser is used.

## Results so far (for strategy)
- Old reels averaged ~21 s watch time and 0 shares. Receipts #2 got 1,900 views, 3 shares, a 1.6% like rate and 30% skip.
- Biggest audiences are the USA, India and the Philippines. Planned next stories: Philippines, the staged "mock" Battle of Manila (1898); USA, the 1904 Olympic marathon.
