# tn/ - The Day of Two Noons (18 Nov 1883) (brief)

Stage A done 2026-11-13 (Opus 5.5). Episode 1 of the format test; **built first** (then `ic/`).
Read `CLAUDE.md` and `ENGINE.md` first; this brief adds what is specific to this episode, plus the two engine changes
both test episodes need (section 8, Stage B part 1).

## 0. Format test (agreed with Farrukh, 2026-11-13)
- **Mechanism hook:** "how/why did this work?", not a biography. The viewer gets the trick in steps they could retell.
- **New shot every 2-3 s** (cuts inside the narrated shots; engine change B2).
- **Big centred 1-2 word captions** (engine change B1).
- **Pacing reference only:** youtube.com/@RicksClips3000. Not watched in Stage A (the page could not be opened from here). Copy nothing: no characters, no scripts.
- **Look:** the current engine look (toon kit as in `yo`/`mo`). Episode 2 (`ic/`) tests the rich painted look.
- Goes to **Reels and Shorts**. Farrukh posts; never publish.
- How to read the result (Stage D, then the 72 h / 7-day review in `CLAUDE.md`): compare skip rate, average watch time, completion and shares
  with the old reels and `yo`. Two episodes are two data points: a story effect and a format effect can't be separated yet. Record it that way.

## 1. The story in one line
On Sunday 18 November 1883 the railroads, not the government, put North America on standard time. Time already reached cities by telegraph,
so they changed it at the source: in New York one man stopped the master clock for 3 minutes 58 seconds. Clocks east of each zone's
centre went back, so some places got noon twice. Congress made it law in 1918, 35 years late.

Why it works as a mechanism story: everyone uses time zones; nobody knows a private industry switched them on with a pendulum.

## 2. Hook audit
| Option | Line | Verdict |
|---|---|---|
| **A (chosen)** | "On November 18th, 1883, a New York church rang noon. Four minutes later... it rang noon *again.*" | A sound-based paradox the picture can show in frame 1 (bell + hands going back). The "how?" is automatic. "Blame the railroads. And one man with a clock." answers it at 7 s and leads straight into the pendulum. |
| B | "In 1883, the railroads changed the time in every American city. Without a law." | True and big, but abstract: no image, no paradox. "No law told them to" is kept at ~29 s. |
| C | "One man stopped New York's master clock for 3 minutes and 58 seconds." | The best visual gag, but it means nothing without the paradox first. It comes second, at ~10 s: the share moment lands well before the ~20 s average watch time. |

**First frame (reads without sound, everything in y 290-1040):** a church steeple clock at exactly 12:00, the bell mid-swing with "DONG" motion
lines, and a workman on a ladder cranking the minute hand **backwards** (curved arrow). Below, three people in 1880s coats hold up pocket watches,
baffled. One small tag in the safe area: **NOON?** (then "NOON. AGAIN." on the second ring). No date on the first frame.

## 3. Narration (paste into `tn/vo/gen.py` SCRIPT; copy `yo/vo/` as the template)
~134 words, counting every spoken number word. Estimated 51-54 s at the `yo` pace (~0.4 s per word). Inside the 45-60 s target; cuts in section 10 if the voice runs long.
**Order:** paradox (0-6 s) → the man and the pendulum (7-17 s, the share moment) → why one clock could do it (17-21 s) → why bother (21-30 s) → why noon twice (30-35 s) → the reaction (35-42 s) → the law, 35 years late (42-52 s).
```python
SCRIPT=[
 (1,'N',"On November eighteenth, eighteen eighty-three, New York's church bells rang *noon.*",1.0,.0),
 (1,'N',"Four minutes later… noon rang *again.*",.98,.1),
 (2,'N',"Blame the *railroads.* And one man with a clock.",1.0,.05),
 (3,'N',"That morning, he *stopped* New York's master clock…",1.0,.0),
 (3,'N',"for three minutes and *fifty-eight* seconds.",.98,.05),
 (3,'N',"When it restarted, New York was on *railroad* time.",1.0,.05),
 (4,'N',"One clock could do that: time already came down *telegraph* wires… into jewelers' windows.",1.02,.0),
 (5,'N',"Why bother? Towns set their clocks by the *sun.* Wisconsin alone had *thirty-eight* different times.",1.02,.0),
 (5,'N',"So the railroads drew *time zones,* one hour apart. No law told them to.",1.02,.05),
 (6,'N',"Clocks in the east of each zone went *back*… so some places got noon *twice.*",1.0,.0),
 (7,'N',"One Indiana paper grumbled: the sun was no longer *to boss the job.*",1.0,.0),
 (8,'N',"And the law? Congress made it official in *nineteen eighteen.*",1.0,.0),
 (8,'N',"Thirty-five years *late.*",.94,.25),
]
```
- `MERGE_EP`: "eighteen eighty-three" → 1883, "nineteen eighteen" → 1918, "thirty-eight" → 38, "fifty-eight" → 58, "thirty-five" → 35.
- Pronunciation to check in `vo/raw*.wav`: "jewelers'", "Wisconsin", "eighteenth". Don't speed lines up to hit timing.
- "to boss the job" is a quote: the caption must show it in quotation marks ("TO BOSS / THE JOB"). See section 6 for the exact source text.
- "Thirty-five years late" is the narrator's dry verdict (opinion, clearly framed), not a claim about anyone's intent.
- "That morning": Hamblet stopped the clock at 9 a.m. on Sunday 18 Nov (section 6). The church clock was not on his wire, so its bells still rang the old noon first; the narration never claims the bells were his doing.
- "Blame the railroads. And one man with a clock." Hamblet ran Western Union's time service, not a railroad; the line keeps them as two things.

## 4. Timed storyboard (estimates; real times come from `vo/timing.json`)
~22 cuts in ~51 s (B2: no gap over 3.4 s except the final hold). Current toon look. Poses change only with `tween(full(A),full(B))`.
Faces and labels above y ~1040 (big-caption letters sit in y ~1050-1175, as built in Stage B). Every cut changes set, subject or framing (B2 rule).

| Shot / cut | ~Time | Picture | Cue |
|---|---|---|---|
| **1a** hook | 0-2.6 | First frame above. Lower Manhattan street, a white church steeple (no label), clock at 12:00. Bell swings on "noon"; tag **NOON?** pops. | noon |
| 1b | 2.6-4.4 | Tight on the clock face: the minute hand jerks **back** about four minutes under the workman's crank. Ticking stops for a beat. | four |
| 1c | 4.4-6.4 | Wide again: the bell swings a second time; the three watchers look at their watches, then at each other; one holds his watch to his ear. Tag **NOON. AGAIN.** | again |
| **2a** | 6.4-8.2 | Hard cut: a steam locomotive bursts into frame head-on (low angle), its headlamp a clock face. | railroads |
| 2b | 8.2-9.8 | Western Union, Room 48 (no label needed): a man in a waistcoat (Hamblet; not named on screen) beside a tall regulator clock, long pendulum swinging, lit from a high window. He cracks his knuckles. | man |
| **3a** | 9.8-11.8 | Extreme close-up: his hand stops the pendulum. The music drops out (the beat grid continues silently). | stopped |
| 3b | 11.8-14.0 | Cut to a jeweler's window across town: every clock in it frozen, the crowd outside frozen mid-gesture; one fly keeps moving (small gag). A stopwatch hand races round in a corner insert. | fifty |
| 3c | 14.0-16.6 | The pendulum swings again; the music drops back in on the downbeat; a city wide shot: clock faces flick to the same time in a wave down the street. | restarted, railroad |
| **4a** | 16.6-18.8 | The camera rides a telegraph wire from the Western Union roof down the street (`cam` move), ticks travelling along it as little sparks. | telegraph |
| 4b | 18.8-21.0 | The jeweler's window, alive now: a ticking telegraph sounder, rows of clocks, the crowd pressed to the glass (documented: crowds at jewelers' windows that day). | jewelers |
| **5a** | 21.0-23.2 | A Midwestern main street: every building has its own clock, all different; a man sets his watch by the sundial in the square while the sun beats down. | sun |
| 5b | 23.2-25.6 | Pull back fast and up: an outline map of Wisconsin covered in clock faces, each a different time; a counter clicks up to **38**. | thirty |
| 5c | 25.6-28.0 | A railroad conference: men in frock coats around a big table-map of North America; one draws four bold vertical bands (colours, no labels). | zones |
| 5d | 28.0-30.4 | Four station clocks in a row, exactly one hour apart, ticking in unison. A man in a top hat holds up a law book: blank pages. He shrugs. (Illustration.) | law |
| **6a** | 30.4-33.0 | Back at the church: the workman cranks the hand back; a split-panel insert shows the same move on a station clock in another city. | back |
| 6b | 33.0-35.4 | The bell rings a second time; this time the three watchers shrug and reset their watches. | twice |
| **7a** | 35.4-37.6 | An Indiana newspaper office: a hand-cranked press; an editor slams his fist. | indiana |
| 7b | 37.6-40.0 | The printed line on the page (verbatim, short): "The sun is no longer to boss the job." (in quotes, under a SENTINEL masthead). | boss |
| 7c | 40.0-42.0 | Gag: the sun (a drawn sun with a simple face) packs a little desk into a box, fired. Dramatisation, clearly comic. | job |
| **8a** | 42.0-44.4 | The Capitol dome; a wall calendar tears from 1883 to 1918 in a blur. | law |
| 8b | 44.4-46.8 | A congressman stamps OFFICIAL on a document; next to him a railroad man has been waiting the whole time, grey-haired, holding a pocket watch. | nineteen |
| 8c | 46.8-51.2 | Final: the railroad man snaps the watch shut, looks at camera. Hold 1.2 s on "late". No follow plug. (`CUT_HOLD_EP=[8]` allows the final hold.) | late |

Cover: `COVER_T` ≈ 1.0 s (the first frame).

**Art notes:** St. Paul's Chapel had a spire with a clock; draw a generic white Georgian steeple and don't label it. Hamblet's regulator was in
"Room No. 48" of the Western Union building (NYT); no likeness exists in our sources, so he is a generic figure. Costumes: 1880s frock coats,
bowler and top hats; the conference men must not reuse the Monopoly/yo silhouettes (`CLAUDE.md` continuity rule is per episode, but avoid confusion).
The sun with a face is a one-off comic prop, not a recurring character (no mascots).

## 5. Sound
- **The clock is the metronome.** One tempo for the whole film (staging rule), 100-108 bpm, with a woodblock/clock tick on every beat as the base layer.
- Sections: 1 `tick` (hook: ticks + one deep bell) → 2 `rag` (locomotive) → 3 **`stop`**: every instrument out from the pendulum stop until it
  restarts (the beat grid keeps running; it is a dropout, not a restart), then `rag` back in on the downbeat → 4 `pizz` (telegraph) →
  5 `soft` → 6 `pizz` → 7 `tense` (newspaper) → 8 `roll` → `out` on "late".
- Foley (CC0 only, listed in `episode.json` → `foot`): church bell (two strikes), clock ticks, telegraph sounder clicks, locomotive whistle (if a CC0 one exists),
  printing press thunk, rubber stamp, watch snap. **No vocal foley.**
- `vo/sound.py`: the `stop` dropout runs from `W(3,'stopped')` to `W(3,'restarted')`. Level the sections around it as usual; the dropout itself is silence plus foley (the stopwatch tick).

## 6. Facts and source tiers
**Established (primary, or several independent sources):**
- Sunday 18 November 1883: US and Canadian railroads switched to standard time; most at noon. (Law Library of Congress blog, Nov 2024; Linda Hall Library; Maine History Journal, Lasker; Heather Cox Richardson's notes citing the *Chicago Daily Tribune* 18 Nov 1883 p. 12)
- The plan was William F. Allen's, secretary of the railroads' General Time Convention; the railroads adopted it in October 1883. Zones were one hour apart, on the 75th, 90th, 105th and 120th meridians (Eastern, Central, Mountain, Pacific; Canada also had an Intercolonial zone). (LoC Law blog; Newberry Library; American Heritage, Gordon 2001)
- New York: James Hamblet, superintendent of the Time Telegraph Company / Western Union time service, stopped the pendulum of his standard clock in Room No. 48 of the Western Union building for "3 minutes and 58.38 seconds"; "Mr Hamblet had changed the time of New York City and State." The clicks on instruments across the city resumed with the pendulum. People "crowded the sidewalk in front of jewelry stores and watch repair establishments". The Western Union time-ball "fell sharply at the new 12 o'clock". (*New York Times*, Nov 1883, transcribed at historymatters.gmu.edu/d/5748)
- No federal law until the Standard Time Act, 19 March 1918. (LoC Law blog; ABA Journal; Linda Hall)
- Time signals were sold by telegraph to subscribers, "almost always a prominent jeweler". (Randel, American Heritage, "They Didn't Know What Time It Was")
- Wisconsin had 38 different local times. (American Heritage: Randel; Gordon 2001)

**Reported (one good source or an eyewitness via a secondary source):**
- St. Paul's Chapel's bells rang 12 at local noon and again about four minutes later. (TIME, Ainissa Ramirez, 18 Nov 2019; William F. Allen's eyewitness account that New York had two noons, cited from Bartky, *Technology and Culture* 1989, by the tz database maintainers.)
  The narration says "a New York church", not the name, so a dispute over which church can't break it.
- **Clock-change time in New York:** Hamblet stopped the clock at **9 a.m.** to suit the New York Central's Sunday-morning schedule (NYT text; Madison Historical Society via Fox News;
  culturenow.org). The NYT text says "yesterday morning" and History Matters dates the article 18 Nov; the other two sources put the stop on Sunday 18 Nov, so the article is
  probably the 19 Nov issue. The narration says only "that morning". **Inference (ours, not a source):** St. Paul's clock wasn't on Hamblet's wire, so it rang the old noon and
  then the new one. Don't show a clock reading 12:00 in shot 3; show the regulator at about 9:00 or keep its dial out of frame.
- "Day of Two Noons": the usual name (LoC Law blog; History Matters). The tz maintainers note that where a place switched at exactly 18:00 GMT, there would have been no double noon; Bartky says eastern parts of zones saw noon twice.
  The narration says "**some** places got noon twice", which survives that dispute.
- Indianapolis *Sentinel*, 21 Nov 1883, p. 4: "The sun is no longer to boss the job. People—all 55,000,000 of them—must eat, sleep and work... by railroad time" (quoted in Bartky, *Selling the True Time*, 2000, p. 144; Rachel Carson Center exhibition page). **Stage C: copy the on-screen line from the Rachel Carson Center page, not from this brief, and check capitalisation ("Sun"/"sun").**
- Attorney General Benjamin Brewster ruled that government clocks needed congressional approval to change; the Naval Observatory ignored him. (American Heritage, Gordon 2001) Not used (time).

**Deliberately left out:**
- Any count of times before 1883 other than Wisconsin's 38: sources give 49, 53, 56, "50 to 80", "80" for railroad times and "144" for local times. **"Over 300" was not found in any source.**
- Which observatory sent "the" signal (Naval Observatory, Allegheny and Harvard are all claimed; the NYT names comparisons with Washington, Allegheny and Cambridge). The narration never names one.
- Bangor's mayor vetoing standard time (Maine History Journal, solid) and Detroit holding out until 1905 (weak): good material for a sequel, too much for 55 s.
- The 1853 Rhode Island collision as the "reason": it was a New England trigger 30 years earlier, not the cause of the 1883 plan.

## 7. Production plan
**Reuse:** toon kit rig and costumes; `courtroom()` set pieces for the blank law book (5d); `stage()`, `under()`, `panelBox()` (copy from `mo/src/shots.js`);
`yo`'s `bigWord()` for the 38 counter if useful; `tag`, `ttl`, `stampMark`, `burst`, `wob`, `shakeV`.

**New, episode-level (`tn/src/props.js`):** `clockFace(x,y,r,h,m,{tick,stopped})` (hands from a time in minutes, so "4 minutes back" is one number);
`steeple()`, `regulator(x,y,{swing})` (pendulum from a phase, so "stop" freezes the phase, then resumes from the same phase), `sounder()` (telegraph key clicking on the beat),
`locomotive()` (head-on), `jewelerWindow()`, `wisconsinMap()` (simple outline, clock faces scattered inside), `pressRoom()`, `capitol()`, `sun()` (comic, one shot).
Costumes: 1880s frock coats, bowlers and top hats; workman in overalls; editor in sleeve garters.

**Engine:** B1 + B2 (section 8). No other engine change.

**Files Stage C creates:** `tn/episode.json`, `tn/src/{meta,props,shots,defs,cos,cover,sfx}`, `tn/vo/*` (copy `yo/vo/` as the template).
Suggested `episode.json`: title "The Day America Got Noon Twice", out `two-noons`, file `Day-Of-Two-Noons-1883`, sub "THE STICK HISTORIAN".

## 8. Engine changes for Stage B, part 1 (needed before Stage C of both episodes)
Both are opt-in per episode, so `mo`, `lb` and `yo` must render identically afterwards: rebuild them and run
`node engine/compare.js old.html new.html` (0 frames different), then update `ENGINE.md` in the same commit.
Also add the big-caption mode to `CLAUDE.md` → Staging rules (caption lane y 1090-1235, faces above ~1080 in that mode), since the current rule assumes the one-line subtitle at 1190.

### B1. Big chunk captions (`CAP_MODE_EP='big'` in `src/meta.js`)
Format agreed 2026-11-13: big, centred captions of one or two words, replacing the one-line subtitle in the episodes that ask for it.
- **Where:** `engine/toon/10_base.js`, next to `MYSUBS`/`mySubs()`. Build a second chunk list from the same `SUBW` words (so `MERGE_EP` numbers and `*highlight*` keep working).
- **Chunking rules, in order:**
  1. A highlighted word (`*word*`) is its own chunk, so the stressed word lands alone and big.
  2. Otherwise pair words left to right; a chunk ends at punctuation (`, . ? ! …`) or after 2 words.
  3. A short function word (a, an, the, of, to, in, on, at, and, but, so, by, for, it, is, was) never ends a chunk on its own: it joins the next word.
     If that makes 3 words, allow it only when all three are 4 letters or fewer (e.g. "IT WAS NOON").
  4. A chunk shorter than 0.25 s on screen merges into the previous one (same 3-short-words limit), otherwise it stays and `verify.js` warns.
  5. A merged number ("1883") counts as one word.
- **Look:** Baloo 800, 150 px, white fill, ink stroke `size*.16`, hard ink shadow offset (6, 9), highlight colour `MARI`.
  Shrink to fit 900 px wide; never below 104 px (if a single word still doesn't fit at 104, verify fails: change the word in the script).
  The whole chunk pops in together at its first word's time minus 0.05 s: scale .7 to 1 with `E.back` over 0.12 s, no rotation. No fade out: the next chunk replaces it.
- **Position** (*superseded as built: baseline 1166, `capY`, see section 11*): centred at x 540. Baseline default **y 1200** (`SHOT_META[n].subY` still overrides per shot). At 150 px the text runs from about y 1090 to 1235:
  inside the Reels safe area (y < 1250), below faces. Shots must keep faces and labels above y ~1080 in this mode (stricter than the 1110 rule).
  Assumption: "centred" means centred horizontally in the caption lane, not in the middle of the picture, because the channel rule forbids text over faces.
  If Farrukh wants them mid-frame, that is one `subY` value per shot, but staging then has to leave the centre empty.
- **verify.js:** the existing safe-area and coverage checks apply to the new `text.cap` elements unchanged. Add `captions: {chunks, maxWords, shortest:[t,dur], under025:[...]}`;
  FAIL if any chunk has more than 2 words (except the 3-short-words case) or is narrower than 104 px font; WARN (listed, not a fail) for chunks under 0.25 s.

### B2. Shot-change cadence (new shot every 2-3 s)
The narrated "shots" (`sh1..shN`, one per beat of the script) stay 4-8 s long because the music grid and `vo/timeline.py` are built on them.
A new picture every 2-3 s is made with **cuts inside a shot**. Make those cuts declarative, so the picture and the check can't disagree:
- **Episode side** (`src/shots.js`): `const CUT_EP={3:['nineteen','own'], 5:[['bought',-.1], 2.4], ...}`: per shot, the cut points as a word prefix
  (resolved with `cu()`), `[word, offset]`, or seconds into the shot.
- **Engine side** (`10_base.js`): `part(n,u)` returns `{i, pu, p0, p1}`: which sub-shot of shot n the time u is in, time into it, and its bounds.
  Shot code switches framing/set with `const P=part(3,u)`. Build `CUTS` = every `SEQ` start + every resolved `CUT_EP` point, sorted, in absolute seconds,
  and export it on `window.film.CUTS`.
- **verify.js:** add `cadence: {cuts, longestGap:[t0,t1,len], gapsOver3:[...], gapsUnder1:[...]}`.
  FAIL if any gap between cuts is over **3.4 s**, except shots listed in `CUT_HOLD_EP` (the deliberate final hold, max 4.5 s).
  WARN on gaps under 1.0 s (choppy) and over 3.0 s.
- A cut must change the picture: a new set, a new subject, or a framing change of at least 1.4x zoom or a reversed angle. A slow push is not a cut.
  `verify.js` can't judge that; the Stage C contact sheet must include a frame 0.1 s before and after every cut.
- Cut points use word times from `timing.json`, which are estimates (`CLAUDE.md` gotcha). Cut on the word, not on a syllable: Stage D checks every cut by ear.

### Measurements to record in this episode's brief after Stage B
`verify.js` renderMs before/after on `yo` (B1/B2 must not slow the frame), and `compare.js` results for `mo`, `lb`, `yo`.

## 9. Caption and pinned comment (final, Stage D 2026-11-13)
Lines 1-2 of section 3 were re-voiced in Stage D (Farrukh's choice): the eyewitness heard two churches, not one (section 13).
Caption:
> On 18 November 1883, New York heard noon twice. The railroads did it, and no law told them to. ⏰🚂
> Would you have reset your watch for a railroad?
>
> #history #timezones #railroad #nyc #animation

Pinned comment (sources):
> Sources:
> - New York Times, Nov. 1883: James Hamblet stopped Western Union's standard clock at 9 a.m. for 3 min 58.38 s: historymatters.gmu.edu/d/5748
> - W. F. Allen (who drew up the zones), eyewitness: St. Paul's bells struck the old noon; about four minutes later Trinity's chimes rang the new one. In I. Bartky, "The Adoption of Standard Time", Technology and Culture 30 (1989)
> - I. Bartky, Selling the True Time (Stanford UP, 2000), incl. the Indianapolis Sentinel, 21 Nov 1883
> - Library of Congress, Law Library blog, "Whose Time Is It Anyway?" (Nov 2024)
> - American Heritage: J. S. Gordon, "Standard Time" (2001); "They Didn't Know What Time It Was" (Wisconsin's 38 local times)
> - Standard Time Act, signed 19 March 1918
>
> Notes: the master clock was changed at 9 a.m.; the bells caught up at noon. TIME (2019) says St. Paul's rang both noons; we follow Allen's eyewitness account (two churches). Not every town got two noons: it depended on where it sat in its zone and when it switched. Counts of pre-1883 local times vary a lot; Wisconsin's 38 comes from American Heritage. Some transcriptions of the Sentinel print "Sun", others "sun".

## 10. Risks and fallbacks
- **The share moment is the pendulum (~10-17 s).** It must be the best-animated beat in the film: the freeze, the silent beat, the restart wave.
- **The "why bother" section (21-30 s) is exposition.** It is after the average watch time, so it has to keep moving (fast pull-back to the 38 clocks, the zones
  drawn on a table, the blank law book). If Stage D finds it slow, cut "No law told them to." (-1.5 s) and merge 5c/5d.
- **The second "noon twice" (line 10) repeats the hook.** It is the explanation the hook promised; keep it short.
- **"Blame the railroads" could read as "the railroads rang the bell".** Line 10 resolves it; Stage D checks with fresh eyes.
- **2-3 s cuts can turn into a slideshow.** Every cut needs motion in it (a gag, a camera move or a reaction); a cut to a static picture is a fail even if B2 passes.
- **Captions at y ~1050-1175 limit the lower picture.** Floors still overscan to the bottom of the frame (staging rule); just keep faces up.
- **If the voice runs long (> 57 s):** cut "One clock could do that:" (keep the rest of line 7), then the Wisconsin sentence (keep "Towns set their clocks by the sun").

## 11. Stage B part 1 report (Opus 5.5, 2026-11-13, built on d97bfff)
**Built:** B1 big captions and B2 in-shot cuts with the cadence check, both opt-in. Code: `engine/toon/10_base.js` (`capSplit`, `BIGCAPS`, `bigCapFit`,
`bigSubs`, `cutPts`, `part`), `engine/template.html` (`film.CUTS`, `film.CAPS`, `film.part`), `engine/tools/verify.js` (`captions`, `cadence`).
`ENGINE.md` and the `CLAUDE.md` staging rules are updated. To use them in `tn/`: `const CAP_MODE_EP='big';` in `src/meta.js`;
`const CUT_EP={...}; const CUT_HOLD_EP=[8];` in `src/shots.js` (after the shot functions); per-shot caption height is `capY` (not `subY`).

**Differences from the section 8 spec, and why (all found on a test copy of `yo` with big captions and cuts):**
- Baseline **1166**, not 1200. SVG's text box runs ~79 px below the baseline at 150 px, so 1200 put boxes at y 1281 and `verify.js` failed.
  At 1166 the box is y ~1004-1245 and the letters ~1050-1175. **Faces and labels stay above ~1040** (the storyboards above are updated).
- Pop is scale .7 → 1 with `E.o` (no overshoot). With `E.back` the overshoot pushed wide chunks out to x 30-1050.
- Words are placed one by one from measured widths (gap .34 em), so the fitted width is the drawn width (x 90-990 on the test).
- Length limits added: a pair <= 12 characters, a short-led chunk <= 14 ("HE'D TRADEMARKED" and "FROM THE PHILIPPINES," didn't fit at 104 px).
  If short words can't take the next word within the limit, they stand alone ("FROM THE" | "PHILIPPINES,"). Counted in characters so the
  split doesn't depend on whether fonts have loaded.
- Short-word list extended with from, with, as, or, if, he, she, we, they, his, her, its (a lone "FROM" / "HE" flashed for 0.2 s).
- Merge of sub-0.25 s chunks goes **forward** when the previous chunk ends a phrase (it produced "YO-YO… HE" backwards).
- `verify.js` treats `CUT_EP` as the opt-in for cadence: without it the gaps are printed but don't fail, so `mo`/`lb`/`yo` aren't failed for
  their 4-8 s shots. It also runs against builds made with the old template.

**Test results (on the throwaway `yo` copy, deleted):** 82 chunks, max 3 words, 0 rule breaks, 0 too wide, smallest 122 px, 0 frames outside the
safe area, every word covered, determinism 60/60. Two warnings (chunks under 0.25 s that can't merge without overflowing): fine as warnings.
Contact sheet checked: captions read big and centred, clear of the Reels bands. `part()` and `film.CUTS` checked against word times
(word prefix, `[word, offset]`, seconds, and a shot without cuts).

**Regression:** `compare.js` 0 of 24 frames different on `mo`, `lb`, `yo`; stronger check, the full SVG markup of every frame at 10 fps is identical
(`mo` 550, `lb` 607, `yo` 523 frames). `verify.js`: `mo` PASS, `yo` PASS; `lb` FAIL as before (512 subtitle frames below the safe area + 20 reach misses,
identical on the old build; already noted in `CLAUDE.md`).
**renderMs on `yo`** (verify.js, ms per frame, 3 runs each): before 1.23 / 1.27 / 1.40; after 1.15 / 1.01 / 1.22. No slowdown (the spread is noise).

**Not checked:** big captions with `tn`'s own narration (there is no `tn` voice track yet; Stage C sees the real chunk list in `verify.js` → `captions`);
the caption look at full speed in motion (only stills were checked).

## 12. Stage C report (Sonnet 5.5, medium, 2026-11-13, built on 7907df6)
**Built:** `tn/episode.json`, `tn/src/{meta,props,shots,defs,cos,cover,sfx}`, `tn/vo/*` (copied from `yo/vo/`, script from section 3). Engine untouched.
Environment note for the next chat: `scripts/setup.sh` stops at `playwright install` (the proxy blocks cdn.playwright.dev). Run it without that line and set
`CHROMIUM_PATH=/usr/bin/google-chrome`; the voice model and sample libraries download fine.

**Voice:** 13 lines, total **50.19 s** at 104 bpm (inside 45-60 s). Shot starts 0 / 6.92 / 10.39 / 17.89 / 23.65 / 34.04 / 38.65 / 43.85 s.
Pronunciation (eighteenth, eighty-three, fifty-eight, thirty-five, jewelers', Wisconsin, Indiana) is the Kokoro default; the phonemes look right but nobody has listened (Stage D / Farrukh).
One change to the locked narration: the idiom in line 11 is now in quotation marks (`“*to boss the job.*”`) as section 3 asks, so the caption shows `"TO BOSS` / `THE JOB."`. The spoken audio is identical.

**Picture:** 8 narrated shots, 26 cuts (`CUT_EP` in `shots.js`), longest gap 3.0 s (the final hold, `CUT_HOLD_EP=[8]`), no gap over 3.0 s anywhere.
That is 4 more cuts than the storyboard: shot 1 got a belfry close-up (bell rings on "noon", not on "again" as drawn in section 4), shot 4 splits into roof / wire ride / jeweler,
shot 5 into sun / Wisconsin / conference / four clocks / blank law book, shot 6 into two-city clocks / crank / second ring.
Section 4 differences: 3b/3c stopwatch counts 0:00 to 3:58 on screen (verifiable, 3 min 58 s); 6a shows two clocks in two cities running back instead of the church;
the calendar tear (1883 to 1918) is an inset in 8b on "nineteen"; the sun gag (7c) is the only face-on-a-sun.
**On-screen text:** NOON?, NOON. AGAIN., +4 MIN, RAILROADS (tag on the locomotive; it repeats the caption and touches the smokestack, so cut it in Stage D), SUN TIME, WISCONSIN, 38, +1h, SENTINEL, 1883, 1918, OFFICIAL, WATCHES - CLOCKS (jeweler's sign), and the Sentinel line.
The line is copied from the Rachel Carson Center page (environmentandsociety.org/exhibitions/railroad/adoption-railroad-time): **"The Sun is no longer to boss the job."** (capital S).
Source conflict, for the pinned comment: other pages (americasbesthistory.com) print it with lower-case "sun", and Wikipedia dates the Sentinel item 17 Nov, the RCC page and Bartky 21 Nov. Brief keeps 21 Nov; no date is shown on screen.

**Sound (`vo/sound.py`):** one 104 bpm grid, clock tick (claves) under every section, sections tick / rag / **stop** / rag / pizz / soft / pizz / tense / roll / out.
The dropout runs 11.45 s ('stopped') to 15.00 s (downbeat after 'restarted'): the music bus is exactly 0.0 in that window (printed by the script); only soft stopwatch ticks and foley remain.
Foley is built from VSCO 2 CE and Kenney CC0 samples plus three synths (whistle, fly buzz, chirps). **No CC0 church bell recording is in the sparse checkout**: the bell is a pitched-down gong plus glockenspiel (`bellD`). Check it by ear.

**Gates:** `verify.js` **PASS**: determinism 60/60, reach 0 misses (worst 5.8 of 6), captions 87 chunks / 0 rule breaks / 0 too wide / smallest 119 px,
subtitles 0 frames outside the safe area, every word covered, cadence 26 cuts. Warnings: 3 chunks under 0.25 s ("man" 0.21, "That" 0.19, "When" 0.19). renderMs 0.83.
SAFE=1 contact sheets were checked for every sub-shot, with frames 0.1-0.2 s either side of every cut; shots 1-8 were checked at least twice after fixes.

**Fix list for Stage D (no scene failed QC twice; these are quality notes):**
1. **No bowler or top hat in the rig.** Men use hatless, flat-cap or fedora stand-ins; the top hat in 5e is an overlay drawn at the head position (sits right at rest, floats a little when his head tilts behind the book). Engine item: add `bowler`/`tophat` caps.
2. 6b (workman cranking the church clock) and 7a (editor behind the desk) are small and read weakly: bigger figure or tighter framing.
3. 5c wall map: the North America outline is a crude polygon, and the zone bands are plain stripes. It reads as "a map with four bands" but not as North America.
4. 4b (wire ride) and 4a share a skyline; make 4b more different (night or rooftop angle) if 4c does not carry the section.
5. The belfry shot 1b is 1.2 s, the second ring 1d 1.3 s: check by ear that bell, "noon" and cut land together (word times are estimates).
6. Facts review by a fresh agent (CLAUDE.md gate) has **not** been run: Stage D. Points to check: the stopwatch "3:58" vs the source's 3 min 58.38 s; "Wisconsin 38" is shown as a counter, not as a claim about time zones; the "+1h" tags.
7. Not heard: voice, bell, tick, dropout, loudness on phone speakers. Final loudness is measured by `mix.sh` (see below), but only Farrukh can listen.

**Render:** full export done in Stage C for Stage D to inspect: `Day-Of-Two-Noons-1883.mp4` (project root, git-ignored like all MP4s; re-make with
`node engine/tools/export.js tn && bash engine/tools/mix.sh tn`, ~5 min with `WORKERS=2`), 1080x1920, 30 fps, **50.19 s**, -14.0 LUFS, peak -2.7 dBFS.
Bed (voice + music) measures -19.0 LUFS, foley -28.8 LUFS before the mix. 4K cover not made yet (`COVER_T=1.0`, the first frame).

## 13. Stage D report (Opus 5.5, medium, 2026-11-13, built on c18171a)
**Delivered:** `Day-Of-Two-Noons-1883.mp4` (1080x1920, 30 fps, 50.19 s, -14.0 LUFS, peak -2.9 dBFS) and `Day-Of-Two-Noons-1883-Cover-4K.png`
(2160x3840, frame at 1.0 s, now without the running caption: `tn/src/cover.js` clears `capsEl`). Both in the project root, git-ignored. Caption and comment: section 9.
`verify.js` PASS (determinism 60/60, reach 0 misses, 87 chunks, 26 cuts, longest gap 3.0 s); same three under-0.25 s caption warnings as Stage C.

**Facts gate** (fresh agent, frames + script only). All claims supported except one, which I checked myself in the tz database notes (Allen via Bartky 1989):
the eyewitness heard **St. Paul's strike the old noon and Trinity's chimes ring the new noon** four minutes later. TIME (2019) says St. Paul's rang twice.
Farrukh chose to re-voice: lines 1-2 are now "New York's church bells rang noon. / Four minutes later… noon rang again." Total length and every shot start
are unchanged (beat rounding), so the 104 bpm grid and the 11.45-15.0 s dropout hold. Shot 1d (second noon) now shows Trinity's brownstone Gothic spire
(`trinity()` in `props.js`). Also confirmed: 9 a.m. stop, 3 min 58.38 s (stopwatch 3:58 is an honest truncation), jewelers, Wisconsin 38 (American Heritage, secondary),
Sentinel 21 Nov 1883 wording, Standard Time Act 19 Mar 1918, "+1h" clocks 9/10/11/12 left to right (west on the left).

**Fixed (section 12 list + review):**
- Hook arrow pointed clockwise (forward). Now counter-clockwise, right of the dial.
- 1c: the finger dragging the hand from 12:04 to 12:00 implied St. Paul's clock was set back (no source). Now the minute hand sweeps 12:00 to 12:04 with a "+4 MIN" wedge (elapsed time). The descending chirp in `sound.py` is gone; clockwork ticks remain.
- 2a: RAILROADS tag removed (it repeated the caption and touched the smokestack).
- 3c: the pendulum inset covered a face and the street clocks sat behind heads. Clocks are now above the heads, the inset is smaller, and the people moved right.
- 5b: the Wisconsin outline is redrawn (Door peninsula, Mississippi edge). 5c: the North America outline is redrawn and the zone bands only cover the US/Canada part. 1883 boundaries were jagged; bands are a symbol.
- 5e: the top hat no longer floats (no tilt in the shrug); the law book is smaller and lower, so the face is clear.
- 6a: both city clocks now go back to 12:00 (from 12:04 and 12:09), not to unrelated times.
- 6b workman (x1.12 to 1.4) and 7a editor (x1.1 to 1.42) are bigger. The workman can't move further left without reach misses.
- 8b: the calendar is smaller, clear of the hat, and tears to 1918 on "nineteen eighteen". 8c: the watch is at chest height (the long chain over the mouth is now a small bow), with a slow 1 to 1.12 push-in over the final hold.

**Left as is (judgement):**
- Hook (0-2.6 s): wide, figures about 270 px tall. Readable on a phone; it is also the cover. A tighter frame would push the cross into the top band.
- Opening and 6b show a workman cranking a clock back. This illustrates the general mechanism (New York's clocks went back), not a sourced act at St. Paul's.
- Lower frame below the captions is plain floor (under the Reels UI anyway).
- 4a/4b skylines (section 12 item 4): 4b now reads as a wire ride with roof clocks; not changed.
- Engine item still open: no bowler/top-hat caps in the rig (`fedora` stand-in plus the `topHat()` overlay). For a Stage B, not here.

**Loudness of the final, per section (ebur128, integrated LUFS):** 0-6.9 s -14.0 · 6.9-11.5 -13.4 · dropout 11.5-15.0 -14.2 · 15.0-17.9 -14.2 · 17.9-23.7 -13.6 · 23.7-34.0 -13.9 · 34.0-38.7 -13.9 · 38.7-43.9 -14.5 · 43.9-50.2 -14.2. Music bus is 0.0 inside the dropout.

**Not checked (no ears here):** the new line 1-2 delivery ("New York's church bells", "noon rang again"), the bell built from gong + glockenspiel,
the clock ticks, the dropout feel, bell vs cut sync at 3.3-4.1 s and 6.2 s (word times are estimates), phone-speaker balance. Farrukh must listen before posting.
