# ic/ - Ice to Calcutta (Tuscany, 1833) (brief)

Stage A done 2026-11-13 (Opus 5.5). Episode 2 of the format test; built **after** `tn/` (build order agreed with Farrukh).
Read `CLAUDE.md` and `ENGINE.md` first, then `tn/brief.md` section 8 (big captions and cut cadence, shared by both episodes).
This brief adds what is specific to this episode, including the painted-layer engine upgrade (section 9).

## 0. Format test (agreed with Farrukh, 2026-11-13; same as `tn/`)
- **Mechanism hook:** "how did this work?", not a biography. The answer comes as three or four concrete steps the viewer can repeat to a friend.
- **New shot every 2-3 s** (cuts inside the narrated shots; engine change B2 in `tn/brief.md`).
- **Big centred 1-2 word captions** (engine change B1 in `tn/brief.md`).
- **Pacing reference only:** youtube.com/@RicksClips3000. Not watched in Stage A (the page could not be opened from here). Copy nothing: no characters, no scripts.
- **Look: rich.** The stick rig over backgrounds **painted in code** (canvas layer under the SVG). No AI images, no image files, nothing paid. Section 9.
- Goes to **Reels and Shorts**. Farrukh posts; never publish.
- What the test compares (Stage D and the 72 h / 7-day review): `tn` (current look) against `ic` (rich look), both in the new format, against the
  results log in `CLAUDE.md`. Two videos are two data points, not a verdict: different stories also differ in pull. Record it that way.

## 1. The story in one line
In 1833 a Boston ship carried 180 tons of pond ice to Calcutta, four months under sail and across the equator twice, and more than half arrived as ice.
The trick was cheap and clever: machine-cut blocks packed into one solid mass, wrapped in a foot of tannery waste bark and hay.
Then the twist: the ice lost more per day in a week on the river and the docks than in four months at sea. So Calcutta built it a house.

Why it fits the channel: it is a "how is that even possible" story with a satisfying physical answer, a reversal at the end, and a direct
Boston-to-India link for the India audience.

## 2. Hook audit
| Option | Line | Verdict |
|---|---|---|
| **A (chosen)** | "In 1833, a Boston ship carried 180 tons of ice to India. Four months at sea. Across the equator. Twice." | Picture + numbers state the impossibility; the "how?" is obvious without asking it. First frame: ice on a deck under a tropical sun. |
| B | "How do you ship ice to India with no refrigerator?" | A question opener is weaker than a fact, and "no refrigerator" is the second line anyway. |
| C | "Calcutta's first ice came from a pond near Boston." | Charming, but it gives away the place twist and states no problem to solve. |

**First frame (reads without sound, everything in y 290-1040):** a ship's deck at noon in the tropics, white-hot painted sky, glittering sea.
A big translucent block of ice sits on the deck with cold mist rolling off it; a sweating sailor hugs it. Small tag top-left in the safe area: **1833**.
No other text. The premise: ice + equator.

## 3. Narration (paste into `ic/vo/gen.py` SCRIPT; copy `yo/vo/` as the template)
143 words, counting every spoken number word. Estimated 54-57 s at the `yo` pace (~0.4 s per word). Inside the 45-60 s target; cuts in section 10 if the voice runs long.
```python
SCRIPT=[
 (1,'N',"In eighteen thirty-three, a Boston ship carried *one hundred eighty tons* of ice to *India.*",1.0,.0),
 (1,'N',"Four months at sea. Across the *equator.* Twice.",1.0,.1),
 (2,'N',"No refrigeration. So how did it *survive?*",1.0,.05),
 (2,'N',"Step one: a machine cut the ice into identical, *two-foot* blocks.",1.02,.05),
 (3,'N',"Packed with *no gaps,* they acted like one *giant* block.",1.02,.0),
 (3,'N',"Less surface… *slower* melting.",.98,.05),
 (4,'N',"Step two: they *buried* it.",1.0,.0),
 (4,'N',"A foot of leftover *tannery bark* on every side. A foot of *hay* on top.",1.0,.05),
 (5,'N',"Even in the tropics, the hold took more than *ten days* just to warm up.",1.02,.0),
 (6,'N',"In *September,* the ship reached Calcutta… with more than *half* still ice.",1.0,.0),
 (7,'N',"Then the *real* melting started.",1.0,.0),
 (7,'N',"Four months at sea had cost about *fifty-five* tons.",1.0,.05),
 (7,'N',"Days on the river and the docks: almost *thirty* more.",1.0,.05),
 (8,'N',"So its new customers paid for something obvious.",.98,.0),
 (8,'N',"The ice got its own *house.*",.94,.25),
]
```
- `MERGE_EP`: "eighteen thirty-three" → 1833, "one hundred eighty" → 180, "fifty-five" → 55. Captions show figures.
- Pronunciation to check in `vo/raw*.wav`: "Calcutta", "equator", "two-foot" (not "two foot" run together). Don't speed lines up to hit timing.
- The ship is not named in the narration (one fewer name before the viewer cares); it is named in the caption and on the hull (TUSCANY) in shots 1 and 7.
- "almost thirty": 6-8 tons lost on the river + "probably about twenty" in landing = 26-28 (section 6). "Days", not "a few days": from Diamond Harbour (early September) to the last unloading (16 Sept) was up to ~10 days.

## 4. Timed storyboard (estimates; real times come from `vo/timing.json`)
~22 cuts in ~56 s. **P** = painted layer (canvas), **S** = SVG (rig, props, labels). Every cut changes set, subject or framing (rule in `tn/brief.md` B2).
Poses change only with `tween(full(A),full(B))`. Faces and labels above y ~1040 (big-caption letters sit in y ~1050-1175, as built in Stage B; see `tn/brief.md` section 11).

| Shot / cut | ~Time | Picture | Cue |
|---|---|---|---|
| **1a** hook | 0-2.6 | First frame above. **P:** tropical noon sky (white-hot near the sun, deep blue at top), glittering sea, deck planks in hard sunlight with sharp shadows. **S:** ice block (translucent: two gradients + highlight edge), sailor hugging it, mist curls. On "ice" frost crackles across the block edge. | ice |
| 1b | 2.6-4.4 | **P:** a painted globe (shaded sphere, ocean texture, soft terminator), turning. **S:** a gold dotted route draws from BOSTON down the Atlantic, round Africa, up to CALCUTTA (the only two labels). | india |
| 1c | 4.4-6.4 | **P:** open ocean, low angle. **S:** the ship crosses a painted dashed line on the water labelled EQUATOR; a sailor jumps it. On "twice" a hard cut to the same line from the other side, the sailor jumps back, a "×2" tally scratched on the mast. | equator, twice |
| **2a** | 6.4-8.6 | **P:** deck, sun high, heat shimmer band above the planks (cheap: shifted strips). **S:** close on the block; the sailor fans it with his hat, one drop falls. He looks at camera: worried. | survive |
| 2b | 8.6-10.6 | **P:** New England winter pond at dusk: pale sky, snow banks, ice sheet with reflections. **S:** a horse-drawn ice cutter (simple SVG horse, new prop) plows straight grooves; two workers in winter coats. | machine |
| 2c | 10.6-12.4 | **S:** top-down on the pond: the grid snaps, identical blocks pop up one after another; a worker holds a ruler to one: **2 FT**. **P:** ice texture under them. | two |
| **3a** | 12.4-14.6 | **P:** cutaway of the hold, wood grain, lantern glow. **S:** blocks slide in and lock together with no gaps (satisfying, a soft thunk each). | gaps |
| 3b | 14.6-16.4 | **S:** the stack's outline merges into ONE giant block (outline pulse). **P:** the hold's light warms around it. | giant |
| 3c | 16.4-18.6 | **S:** demonstration with people, not a diagram: two sailors in the sun. One holds a single small cube: it melts in his hand to a puddle. The other sits on a big block, arms crossed, smug; it barely shrinks. | less, slower |
| **4a** | 18.6-20.2 | **S:** cutaway again; a worker drops into the gap between the inner planking and the hull with a shovel. Hard cut, wide. | buried |
| 4b | 20.2-22.2 | **P:** a tannery yard (vats, hides as shapes, warm grey light). **S:** a tanner shrugs and hands over a sack of spent bark for nothing; the ship's worker can't believe his luck. | tannery |
| 4c | 22.2-24.0 | **S:** back in the hold: bark shovelled into the walls; tag **1 FT BARK** (one label). **P:** dusty light through the open hatch (`P.shafts` with motes). | side |
| 4d | 24.0-25.8 | **S:** hay forked on top; a worker stomps it flat; planks hammered over; close on the hammer on the last nail. | hay |
| **5a** | 25.8-28.0 | **S:** split vertically: above deck a sailor melting in the sun; below, in the hold, a sailor in a scarf shivering, breath visible. **P:** two lights, hot white vs blue-cold lantern. | tropics |
| 5b | 28.0-30.2 | **P:** doldrums: glassy sea, the sun crossing the sky fast; ten day/night cycles (sky gradient cycles, stars at night). **S:** tally marks appear on the mast, one per day. | ten |
| 5c | 30.2-32.4 | **S:** the hold: the shivering sailor at tally 10 finally pulls off his scarf. Small gag: he puts it back on, briefly. | warm |
| **6a** | 32.4-34.8 | **P:** the Hooghly at morning: golden haze, layered riverbank silhouettes fading with depth (`P.haze`), small boats. **S:** the ship (TUSCANY on the bow) glides in; people line the bank. | september |
| 6b | 34.8-37.2 | **P:** the hatch opens: light shafts fall into the hold, dust motes. **S:** the ice gleams; the stack is visibly smaller than in 3b (about half). People peer over the hatch rim. | half |
| **7a** | 37.2-39.2 | **P:** the docks at midday, heat haze. **S:** blocks swung out on a rope, dripping hard. Hard cut. | real |
| 7b | 39.2-41.8 | **S:** the ship's mate chalks on a slate: **4 MONTHS −55 T**. | four |
| 7c | 41.8-45.2 | **S:** a buyer in a white suit carries his block home in the sun; it shrinks every few steps; he arrives holding an ice cube. A second slate on the dock wall: **DAYS ≈ −30 T**. | thirty |
| **8a** | 45.2-48.2 | **S:** buyers in a huddle; a hat goes round and fills with coins (they paid; no figure). | customers |
| 8b | 48.2-51.0 | **P:** a stately ice house (thick walls, small dome, cool shade around it), wide. **S:** the last block is wheeled in through the door. | obvious |
| 8c | 51.0-55.4 | Close on the heavy door: it shuts; a frosty puff out of the keyhole. Hold 1.5 s. No follow plug. (Final hold allowed in `CUT_HOLD_EP=[8]`.) | house |

Cover: `COVER_T` ≈ 1.2 s (the first frame).

**Accuracy notes for the art:** the ship type is uncertain in sources ("ship" in Tudor's diary; one retelling says brig). Draw a generic square-rigger and
don't make the number of masts a feature. The ice house is an illustration, not a reconstruction (its exact design and date aren't researched here);
don't label it with a year. The Calcutta crowd is mixed (boatmen, porters, British buyers); the ice's buyers were mostly Europeans, so the shrinking-block gag is on the white-suited buyer.

## 5. Sound
- One tempo for the whole film (staging rule); 100-108 bpm. Harp and pizzicato for the ice (glassy), cello and bassoon for the sea and the hold.
- Sections: 1 `bright` (hook) → 2 `soft` (question) → `pizz` steps (2b-4d, a pluck per block landing) → 5 `tense` (days ticking) →
  6 `roll` (arrival) → 7 `pizz` with a falling trombone (`TBF`) on "thirty" → 8 `hush` → `out`. Names are suggestions; reuse `yo/vo/sound.py` modes where they fit.
- Foley (CC0 only, listed in `episode.json` → `foot`): ice block thunk, ice crackle, saw/plow scrape, hay rustle, hammer, coins in a hat, heavy door. Sea and wood creak only if CC0 versions exist in Kenney/VSCO or another CC0 library; otherwise none. **No vocal foley.**

## 6. Facts and source tiers
**Established (contemporary or primary):**
- Loaded 6-7 May 1833; discharged in Calcutta 13-16 September 1833; voyage "four months and seven days". About 180 tons stowed.
  (*Journal of the Asiatic Society of Bengal*, Sept 1834, details from J. J. Dixwell, agent for the proprietors; reprinted *Mechanics' Magazine* 9 Apr 1836, vol. 25 no. 661 pp. 10-12, transcribed at todayinsci.com)
- Tudor's diary, 12 May 1833: "Sailed this day the ship Tuscany Capt. Littlefield for Calcutta with 180 tons of ice". (Baker Library, Harvard; quoted in Susan S. Bean, "Cold Mine", *American Heritage*, Jul/Aug 1991)
- The hold: a floor of one-inch deal planks, then **a foot of tan** ("the refuse bark from the tanners' pits"); the four sides built the same way; pump, well and mainmast boxed the same way; **a foot of hay** pressed down on top, then planks with the gap stuffed with tan. (Asiatic Society 1834)
- The blocks: cut by "a peculiar machine" in blocks two feet square, one foot to eighteen inches thick, and packed "so close as to leave no space between them", making one solid mass. (Asiatic Society 1834)
- The route crossed "the line" twice. The hold took "more than ten days in the tropics" to heat to the tropical standard. (Asiatic Society 1834)
- Losses (Dixwell's estimate): 55 tons by arrival at Diamond Harbour; 6-8 more on the way up the river; "probably about twenty" in landing. (Asiatic Society 1834)
- Lord William Bentinck, Governor-General, presented Rogers with a silver cup inscribed for "the first attempt to import a cargo of American ice into Calcutta", dated 22 Nov 1833. (Bean 1991, which describes the cup; Tudor's diary) Not used in the narration.

**Reported / one good secondary source:**
- Calcutta's British residents raised money ("within three days") to commission an icehouse (Bean 1991; also varnam.org: a subscription, land given by the Governor-General, weak). In the meantime the ice was stored in a lower room at Brightman's Ghaut (Asiatic Society 1834). The narration says only "its new customers paid for... its own house"; no date, no amount.
- Sale was slow at first: "four annas per seer", about 10 maunds a day; the 1834 writer says the public must be taught to value ice (Asiatic Society 1834). Not used; it would need a line of its own.
- "Everybody invited everybody to dinner" to taste drinks cooled by the ice (a resident's recollection quoted by Bean; original not identified). Not used.
- Arrival date: 6 September (several retellings), 10 September (Captain Littlefield's 1834 list, quoted by Bean); discharge 13-16 September (Asiatic Society). **Say "September" only** (Farrukh's flag).
- Quantity arriving: "one hundred tons" (Littlefield), "two-thirds of its cargo intact" (Tudor's later diary, per Bean = ~120 t). The Asiatic Society losses add up to ~100 t landed. **"More than half"** is true for every figure.
- "Machine" = Nathaniel Wyeth's "simple and highly effective two-bladed horse-drawn ice cutter" (Bean 1991, Tudor's supplier; Wyeth's cutter dates from the late 1820s). The 1834 text says only "a peculiar machine": the narration says "a machine"; the horse in 2b follows Bean.
- Tudor's own fitting-out note (Bean 1991) specifies boards one inch from the hull and "six inches straw" on the bottom, with space for cordwood-scale insulation. It differs in detail from the 1834 account (a foot of tan); the 1834 account was written after the voyage from the shippers' agent, so the narration follows it and says only "bark" and "hay". The 1834 account also notes the ice melted between the blocks, not only from outside, and that the hold had a float gauge to track the melt.
- "Less surface, slower melting" is general physics (a big mass has less surface per ton), not a historical claim. No source discusses it for this voyage; the narration states it as the reason, which is safe physics.

**Deliberately left out:**
- **Sawdust.** Most retellings say the ice was packed in sawdust. The only contemporary description of this voyage says tan bark and hay; sawdust became standard later.
  The narration says bark and hay. The pinned comment explains the difference (people will ask).
- Who organised it (Tudor, Samuel Austin, William Rogers): three names for one voyage costs time and adds nothing to the mechanism. In the caption.
- The servant anecdote ("burruf", "all make melt"): an unnamed British recollection that turns on mocking an Indian servant's English. Wrong tone for this channel and its India audience.
- Profit figures ($220,000 over 20 years appears in Indian press without a primary source).
- "First ice ever to cross the equator" (the captain's own claim; unverifiable).
- Local Indian ice ("Hooghly slush", made in shallow pits on winter nights) is a good story for a later episode; not here.

**Open (not blocking):** the icehouse's completion date and design (illustrate, don't label); the ship's rig ("ship" in Tudor's diary, "brig" in two weak sources).

## 7. Production plan
**Reuse:** toon kit rig and costumes (sailors from `px`/`mo` palettes recoloured; `TC.judge`-style coat for the white-suited buyer), `stage()`, `under()`,
`panelBox()` (split in 5a), `tag`, `ttl`, `stampMark` (slates can be `tag` on a dark board), `burst`, `dust`, `wob`, `shakeV`.

**New, episode-level (`ic/src/props.js`):** `iceBlock(x,y,w,h,{melt,frost,mist})` (SVG: two gradients, a bright top edge, drips; `melt` 0-1 shrinks it and grows
a puddle), `ship(x,y,s,{hatch})`, `holdCutaway(...)`, `cutter()` + simple `horse()` (side view only), `slate(text)`, `iceHouse()`.
Painters (with the section 9 API): `skyNoon`, `skyDusk`, `skyMorningHaze`, `sea(t)`, `pond`, `holdWood`, `tanneryYard`, `riverbank`, `docks`, `globe`.

**Engine:** B1 + B2 (`tn/brief.md` section 8) and the painted layer (section 9 here). No other engine change.

**Files Stage C creates:** `ic/episode.json`, `ic/src/{meta,props,shots,defs,cos,cover,sfx}`, `ic/vo/*`.
Suggested `episode.json`: title "Boston Shipped Ice to India in 1833. Here's How It Survived.", out `ice-calcutta`, file `Ice-To-Calcutta-1833`.
Sub "THE STICK HISTORIAN". `foot` must say the backgrounds are drawn in code and list every CC0 sample.

## 8. Caption and pinned comment (draft; Stage D finalises)
Caption:
> 180 tons of ice. Boston to Calcutta. 1833. No refrigeration. 🧊🚢
> The ship was the Tuscany; the ice was Frederic Tudor's.
> Would you have trusted bark and hay?
>
> #history #india #kolkata #boston #animation

Pinned comment (sources):
> Sources:
> - "The Ice Trade between America and India", Journal of the Asiatic Society of Bengal (Sept 1834), from J. J. Dixwell, agent for the shippers; reprinted in Mechanics' Magazine, 9 Apr 1836 (transcript: todayinsci.com/T/Tudor_Frederic/IceTradeAmericaToIndia.htm)
> - Susan S. Bean, "Cold Mine", American Heritage (1991), from Frederic Tudor's diaries (Baker Library, Harvard) and Capt. Littlefield's notes: americanheritage.com/cold-mine
> - Gavin Weightman, The Frozen Water Trade (2003)
>
> Notes: Most retellings say sawdust; the 1834 account of this voyage says a foot of tanners' bark on the floor and sides and a foot of hay on top. Arrival dates differ (6, 10 or 13 September), so the video says September. "Almost thirty more" = 6-8 tons lost on the river + about 20 in unloading (the agent's estimate). The voyage was organised with Samuel Austin and William C. Rogers; Rogers sold the ice in Calcutta.

## 9. Engine change for Stage B, part 2: the painted layer
Farrukh chose backgrounds painted in code over generated stills (2026-11-13). Rules that are not up for debate in Stage B:
no AI images, no image files, no external assets, nothing paid, no new npm dependency. Everything is drawn by code at render time
or baked by code at page start.

### What it is
A `<canvas id="paint">` **under** the SVG, the same 1080x1920 frame. The SVG keeps drawing the stick rig, props, labels and captions on top;
the canvas draws what SVG does badly: soft sky gradients, textured water, wood grain, light shafts, glow, depth haze.
Shots that don't paint leave it transparent, so `mo`, `lb`, `yo` and `tn` are unchanged (prove it with `compare.js`, 0 frames different).

### Design (in `engine/template.html` + a new kit file `engine/toon/15_paint.js`)
1. **Element.** `<canvas id="paint">` as the first child of `.stage`, absolutely positioned, CSS 100% x 100%; `#sv` above it, transparent.
   Backing size = 1080x1920 x `min(devicePixelRatio,2)`, so the 4K cover (`cover.js`, scale 2) is sharp and contact sheets (scale .5) are cheap.
   Painters always work in 1080x1920 units (`ctx.setTransform(dpr,...)` once per frame).
2. **One camera for both layers.** Add `camM(c,oy)` that returns the 2D matrix `cam()` already uses; `cam()` builds its SVG transform from it
   and `camCtx(ctx,c,oy)` applies the same matrix to the canvas. A shot that paints must call both with the **same** camera object.
3. **Painting from inside the shot function.** Shot functions keep returning SVG. To paint, a shot calls `paint((ctx)=>{...})`, which only queues
   the painter. `renderAt(t)` clears the queue, runs `composeAt(t)` (which runs the shot functions), then clears the canvas and runs the queue.
   This keeps one function per shot and needs no change to existing episodes.
4. **Transitions.** `whipPair`, `pushPair` and the dissolve wrap each shot they call in a paint state `{dx, alpha, blur}` that queued painters inherit:
   push/whip = horizontal translate; dissolve = `globalAlpha`; whip blur = 5 copies offset horizontally at falling alpha (canvas has no
   one-axis blur), measured for cost. Hard cuts need nothing.
5. **Texture library (`15_paint.js`), all seeded.** `rng(seed)` (mulberry32), `vnoise(x,y)` value noise with fbm. Baked once at page start into
   offscreen canvases, tileable, 512x512: `TEX.wood` (planks + grain + knots, two tones), `TEX.water` (ripple field, 2 octaves), `TEX.cloud`, `TEX.grain`.
   Painters: `P.sky(ctx,{top,mid,bot,sun:[x,y,r,col]})`, `P.clouds(ctx,cam,t,{alt,drift,alpha})`, `P.sea(ctx,cam,t,{horizon,deep,shallow,glint,swell})`
   (water drawn as ~120 horizontal strips with perspective scale and two scrolling copies of `TEX.water`), `P.wood(ctx,rect,{tone,light})`,
   `P.shafts(ctx,{x,y,angle,spread,n,alpha,motes,t})` (additive light through a hatch or window, with seeded dust motes),
   `P.glow(ctx,x,y,r,col,a)`, `P.haze(ctx,y0,y1,col,a)` (depth haze per plane), `P.vignette(ctx,a)`.
   Boot finishes baking **before** `window.film` is published, so no screenshot can catch a half-baked texture.
6. **Determinism rules.** No `Math.random`, no `Date`, no `performance.now` in painters; everything is a function of `t` and fixed seeds.
   A cache is allowed only if its key is the full input (e.g. a static plane keyed by shot + quantised camera), never "last frame".
7. **Grade, paper and vignette.** `finish()` draws them as SVG rects with `mix-blend-mode: multiply`. First test in Stage B: does that blend with
   the canvas underneath in headless Chromium (screenshot a flat red canvas under a grey multiply rect and read the pixel)? If yes, nothing to do.
   If not, painted shots pass `{paper:0,grade:null}` to `finish()` and `P.post(ctx,...)` applies them in the canvas, and the paper grain on figures
   comes from a second canvas above the SVG with CSS `mix-blend-mode:multiply`. Decide from the measured pixel, not from documentation.
8. **Not in scope:** WebGL. Canvas 2D is software-rendered and identical across export workers. Only if the measured paint time misses the
   budget below after the optimisations listed there, prototype one WebGL painter (with `preserveDrawingBuffer:true`) and measure again before adopting it.

### Measurement (render time), new and permanent
- `verify.js` adds `paintMs` next to `renderMs`: 120 frames spread over the film, timing the paint pass alone, with a 1x1 `getImageData`
  read to force the canvas to finish. Report median and p95.
- `export.js` writes `EP/out/render_time.json`: frames, workers, wall seconds, seconds per frame per worker (renderAt + screenshot + encode), and
  the slowest 10 frames with their times. Print one summary line.
- **Baseline first:** before changing anything, run a final export of `yo` and keep its `render_time.json` numbers in this brief.
- **Budget for `ic` (to revise only with measurements):** paint pass median <= 30 ms and p95 <= 60 ms at 1080x1920; full export of `ic` <= 1.5x
  `yo`'s seconds per frame. Boot-time texture baking <= 3 s.
- **If over budget, in this order:** bake static planes (sky, far shore, hull wood) once per shot into a keyed cache; paint soft layers (sky,
  haze, clouds) at half resolution and scale up; fewer water strips; only then consider WebGL.

### Determinism check in verify.js, new and permanent
1. **Same page, any order** (extends the current check): for the 60 sample times, hash the canvas pixels (FNV-1a over `getImageData`) together
   with the SVG markup; render in a scrambled order; every hash must match.
2. **Two pages** (this is the one that protects the export, which renders with 2 parallel browsers): open a second page, render the same 60 times,
   compare hashes with page 1. Any difference = FAIL (it means boot or texture baking isn't seeded).
3. **Across runs:** write the hashes to `EP/out/paint_hashes.json`; on the next run, report (not fail) how many changed, so an unintended
   visual change to the painted layer is visible.
4. Episodes with no painters skip 1-3 for the canvas (empty canvas hash) at no cost.
Report: `paint: {pages:2, checked:60, mismatchesSamePage:[], mismatchesAcrossPages:[], changedSinceLastRun:n, paintMs:{median,p95}, bakeMs}`.

### Acceptance for Stage B part 2
- `compare.js` 0 frames different on `mo`, `lb`, `yo`, `tn`.
- A test shot in `ic/` (the doldrums day-cycle, section 4 cut 5b) painted with sky + sea + wood + haze, the stick rig on top, `verify.js` PASS
  including the two-page check, numbers above recorded here, and a contact sheet sent to Farrukh for a yes/no on the look before Stage C builds the rest.
- `ENGINE.md` updated in the same commit (the painter API, the measurements and the new verify fields).

## 10. Risks and fallbacks
- **Too long (est. 54-57 s).** Cut in this order: "Less surface… slower melting." (-2 s, keep the 3c gag silent); then "No refrigeration." from line 3 (-1 s); then shorten the tropics shot to two cuts (drop 5c).
- **The best material arrives at ~37-45 s** (the melting reversal). The hook and the step-by-step mechanism carry the first 20 s; that is the bet of the mechanism format.
  If Stage D finds 18-30 s slow, the cut is the tropics day-count (5b/5c → one 2.5 s cut).
- **The painted layer is new engine work.** If it misses the render-time budget or the look test, the fallback is this storyboard in the current look
  (the `tn` look). Then the test no longer separates look from story; say so in the results log.
- **Painted vs flat mismatch:** stick figures over rich paintings can look pasted on. Mitigations, in Stage C: SVG contact shadows under feet, a light
  colour grade per shot so figures pick up the scene's light (the `finish()` grade), and haze on far planes only.
- **Comments will say "sawdust".** The pinned comment answers it with the 1834 source.
- **Colonial framing:** it is a luxury for British Calcutta. Keep it dry and factual: no celebration of the Raj, no servant jokes; the gag is on the buyer.

## 11. Stage B part 2 results: the painted layer (2026-11-15)
Built in one chat on Fable 5.2 at Farrukh's request (the stage table says Opus). Branch `painted-layer`.

**What exists now**
- `engine/template.html`: `<canvas id="paint">` under the SVG, the painter queue (`paint`, `paintState`, `paintFlush`, `paintHash`), transitions carry a paint state.
- `engine/toon/15_paint.js`: seeded textures and the `PNT.*` painters. `engine/toon/10_base.js`: `camM`, `camCtx`, `camPar`; `finish()` hands grade and paper to the canvas inside a dissolve or whip.
- `engine/tools/verify.js`: gate 6 (`paint`), `paintMs`, `bakeMs`, `EP/out/paint_hashes.json`. `engine/tools/export.js`: `render_time.json`.
- `ic/`: scaffold with ONE test shot (`sh1` = storyboard cut 5b slowed to 3 days in 9 s, three framings). `ic/src/props.js` holds the reusable parts:
  `dayLight(ph)`, `paintDoldrums()`, `lit()`, `tally()`, `TC.sailor`. `ic/src/shots.js` is a test and is replaced in Stage C.
- **Placeholders, to be overwritten in Stage C step 1-2:** `ic/vo/timing.json` (invented word times for line 5 only, marked `placeholder`) and `ic/vo/voice.mp3` (9 s of silence).
  There is no `ic/vo/gen.py` yet: copy `tn/vo/*.py` and paste the SCRIPT from section 3.

**Differences from the design in section 9 (and why)**
- The namespace is `PNT`, not `P`: shots already use `const P=part(n,u)`, and `tn` declares `PT`.
- Painters take `(ctx,t,opts)` and draw in whatever transform is current; the caller applies `camCtx(ctx,camPar(c,k))` per plane. No `cam` argument.
- Item 7, measured (grey multiply rect over a red canvas, headless Chrome 153): plain rect -> (128,0,0), inside a transformed group -> (128,0,0): it blends.
  Inside a group with opacity or a filter -> (128,128,128): it does not. So `finish()`'s grade/paper/vignette work on painted shots on hard cuts and pushes;
  in a dissolve or whip they are handed to the canvas for those frames. No second canvas was needed. `ic` uses hard cuts only.
- `grain` and `wood` are stored as black-with-alpha, and glow/shadow use normal blending: multiply/screen/soft-light fills were the slowest operations.
- Textures bake only when the episode sets `PAINT_EP=1` (so old episodes pay nothing); 512 px tiles plus smaller copies of the water for far strips.
- Extra painters: `PNT.sun`, `PNT.stars`, `PNT.band`, `PNT.shadow`, `PNT.tint`. `PNT.shafts` was checked on one still, not in a shot.

**Acceptance**
- `compare.js`, baseline build vs new build: `mo`, `lb`, `yo`, `tn` all `framesDifferent: 0`, `dataIdentical: true`.
- `verify.js ic`: PASS. Determinism 60/60 same page, 60/60 across two pages. `verify.js` on `mo`, `yo`, `tn`: PASS (`painted:false`). `lb`: FAIL as before
  (512 subtitle frames outside the safe area, the known issue in CLAUDE.md), nothing else.
- Paint time on `ic` (1080x1920, 2-core cloud machine, 5 runs): median 28.6 / 29.7 / 29.8 / 30.7 / 32.8 ms, p95 40.9-48.7 ms, max ~52 ms, bake 270-330 ms.
  Budget: median <= 30, p95 <= 60, bake <= 3000. **The median sits on the budget line, not under it.** Per painter (ms, one frame): sea ~9, wood ~10 (4 calls), clouds ~7 (2 bands), sky ~4, glow/sun ~3.
  Cheapest next savings if a heavier shot needs them: bake the deck/bulwark wood once per camera (keyed cache), one cloud band instead of two.
- Export (final, 2 workers): `yo` 1567 frames, 405 s, **0.506 s per frame per worker**, median frame 465 ms (clean run; an earlier run with other jobs: 0.508).
  `ic` test, 270 frames: 0.766 then 0.678 s per frame per worker (**1.51x and 1.34x** of `yo`; budget 1.5x), median frame 454 and 394 ms.
  The median is no slower than `yo`; the mean is higher because of 1.5-2.9 s stalls that both films show (x264 `slow` and two browsers sharing 2 cores) and that weigh more on a 9 s film.
  Not measured: a full-length painted film. Re-read `render_time.json` after the first full `ic` export.
- Transitions: push, whip and dissolve rendered on a temporary two-shot sequence; both layers move together. The whip smear on the canvas is visibly coarser (5 copies).
- 4K cover (`cover.js`, scale 2): the canvas is sharp at 2160x3840.
- Contact sheet + 9 s silent MP4 sent to Farrukh for the yes/no on the look. **Stage C must not start until he answers.**

**For Stage C (staging notes from the test)**
- `renderMs` in `verify.js` does not include paint raster. Use `paintMs`.
- Storyboard cut 5b asks for **ten day/night cycles in 2.2 s** (0.22 s per day = ~7 frames each). At that speed the sky strobes. Recommended: 3 cycles shown, tally marks
  jump in groups ("III", then five, then ten), or hold the shot for the 4.5 s `CUT_HOLD_EP` limit. Decide in Stage C with a dense strip, not from this test.
- Keep the sun and moon arc inside x 110-970 and below y 330 (done in `dayLight`). With the big caption at y 1050-1175 a seated figure needs scale >= 1.3, or the caption covers the torso.
- `lit(svg,col,k)` is what stops the figure looking pasted on: k .8 for figures, .55 for line work over painted wood. Painted `PNT.shadow` under feet, not an SVG ellipse.
- The deck is flat-on planks (no perspective). If a shot looks down the deck, paint it with strips like `PNT.sea` or accept the flat look; not built.
- Painted shots: hard cuts or pushes. Not verified in a full film: whip and dissolve.

## 12. Stage C results: voice and picture (2026-11-16, Sonnet 5.5, medium)
Branch `painted-layer`. Farrukh approved the painted look before this stage.

**Built**
- `ic/vo/gen.py` (SCRIPT from section 3, unchanged), `timeline.py`, `lines.json`, `timing.json`, `voice.mp3`: real voice. Total **51.92 s**; shot starts 0 / 8.08 / 15.00 / 21.35 / 27.69 / 34.04 / 38.08 / 46.15. `sound.py` and `bed.py` are still the `tn` copies: not adapted, no music or foley yet.
- `ic/src/props.js`: costumes (`sailor2 mate worker worker2 tanner buyer buyer2 porter`), SVG props (`iceBlock shipSide horse cutterSled slate` and hand props), painters (`paintHold paintGlobe paintOpenSea paintPond paintTannery paintRiver paintDocks paintIceHouse paintStone`). `ic/src/shots.js`: all 26 sub-shots of section 4, cut points in `CUT_EP` by word.
- Every shot paints; hard cuts only (no push, whip or dissolve used).

**Gates**: `verify.js ic` PASS (determinism 60/60 on two pages, reach 0 misses, captions no rule breaks, cadence no fails). `paintMs` median 29.5 / p95 39.2 / max 46.4 ms, bake 274 ms: **still on the 30 ms line**. Warn only: caption chunks under 0.25 s ("did", "cut", "it."); longest gap 3.33 s (3c).
Draft export (`DRAFT=1`, 779 frames, 2 workers): 116 s wall, 0.290 s per frame per worker (draft size, not comparable to the `yo` final figure). Full-length painted film renders without errors. A final-size export was not run.

**Decisions on the open items**
- Cut 5b: not ten cycles in 2.2 s. The sky runs 2.3 cycles at 1.0 s per day (checked with a 0.2 s strip, no strobe); the tally marks count to 10 on their own clock; 5c carries a "DAY 10" tag. 5b runs 2.39-4.70 s because the voice leaves silence after "warm up".
- Deck perspective: not built. No shot looks down the deck; the flat planks are only used side-on.
- 2c: the ruler slides in as a plain SVG (no top-down arm). 8c: door leaves are SVG over a painted stone wall.
- Removed a "FREE" tag from 4b (the tannery handing over bark): not supported by the sources. The gag stays unlabelled.

**Environment note for the next chat**: Playwright's Chromium download is blocked here. Use `export CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`. Kokoro model files came from the GitHub release (`scripts/setup.sh` step), not committed.

**Fix list for Stage D (not yet looked at in motion; only still frames were checked)**
1. 2b: the horse reads as a brown blob; the ice cutter sled is barely visible. Bigger or simpler silhouette.
2. 5a (split screen) and 6a (crowd) have small figures; judge them in the rough cut.
3. 8b: the ice house is a pale box with a dome; 8c: the puff from the keyhole appears only in the last second.
4. Ship hull in 1c/1d sits low and the sailor overlaps the sails.
5. Sound: adapt `sound.py` to section 5 (sections, foley CC0 list in `episode.json` → `foot`), then `bed.py`.
6. Independent facts pass and the SAFE=1 text-collision pass (CLAUDE.md gates); frames 0.1 s before and after every cut on a sheet.
7. Pronunciation to listen for: "Calcutta", "equator", "two-foot", "tannery". Cannot be heard here.

## 13. Stage D results: review and finish (2026-11-16, Opus 5.5, medium)
Branch `painted-layer`. Narration, timing (51.92 s), shot list and sources unchanged.

**Delivered (project root):** `Ice-To-Calcutta-1833.mp4` (1080x1920, 30 fps, 51.92 s, -14.0 LUFS integrated, true peak -2.9 dBFS), `Ice-To-Calcutta-1833-Cover-4K.png` (frame at `COVER_T`), caption + pinned comment below. Draft with sound: `ic/out/draft_sound.mp4`. Not published.

**Fix list (section 12)**
1. 2b: horse and cutter stay in frame for the whole cut (horse 330 -> 600); new `cutterSled`: wooden frame, two toothed steel blades in the ice, handles, ice chips; traces to a red collar; the odd ring on the horse's body removed.
2. 5a / 6a: 5a reads at full size (checked); 6a crowd figures .5 -> .66. 6b's onlookers stay small (accepted).
3. 8b: the ice house is now a large windowless masonry block with one deep door (the "+" finial read as a church cross and is gone). Its real look is undocumented; it stays an unlabelled illustration. 8c: the door slams at 0.75 s into the cut with a camera jolt, the cold puff and frost sparkles come out at the slam (no longer only in the last second).
4. 1c/1d: ship scale .8 -> .95, enters from x 170 (less cropping), sailor .58 standing on the bow deck clear of the sails, no jib behind him.
- Cuts that only pushed: 3b now opens tight on the stack (z 1.55); 4d opens tight on the hay (z 1.45). Every cut now changes set, subject or framing (sheet 0.1 s around each cut checked).
- 2c: blocks already landing on the cut frame (no empty frame); sea painted to the top (a black band above y 200 is gone). 1b: BOSTON label on the cut. 4d: end framing lowered so the hammerer's head clears the top band. 8b: porter enters on screen (no stray block at the left edge).

**Independent facts pass** (fresh agent, frames + script only). All narrated claims supported by the 1834 Asiatic Society account (Mechanics' Magazine reprint) and Bean 1991. Caveats it raised, and what was done:
- "they acted like one giant block": the 1834 account also says the ice melted between the blocks, not only from outside. Narration locked; added to the pinned comment.
- "180 tons ... to India" = tons loaded, not landed; "more than half still ice" covers that. Comment already says so implicitly; no change.
- Slate "DAYS ≈ -30 T": the sources give 26-28 t. Kept: matches "almost thirty" in the narration; the comment gives 6-8 + about 20.
- Customers (8a) all read as Indian men in white caps; the buyers and subscribers were mostly British/European residents. Fixed: `buyer`/`buyer2` lost the `topi` cap (it reads as a skullcap); they now read as bareheaded European men in white suits; the porter (pagri, dhoti) is the only Indian figure in 8a.
- Ice house: domed round ice houses are Bombay/Madras, not Calcutta (reviewer). Fixed (see 3 above).
- Not acted on: "weak hook" (the hook is the agreed format; Farrukh's call), the mirrored equator cut at 7.0 s (by design: "the same line from the other side"), the same dock wall across 7a-8a (subject and framing change; a different set per cut would be a rebuild), feet overlapping caption letters (no faces involved).
- The reviewer could not verify: the ship's owner/home port, which pond, whether this cargo used Wyeth's cutter specifically (Bean says horse-drawn; the narration says "a machine"), the ice house's look.

**Gates**: `verify.js ic` PASS (determinism 60/60 on two pages, reach 0, subtitles 0 outside, cadence no fails; longest gap 3.33 s in 3c). `paintMs` median 26.0 / p95 36.3 / max 43 ms, bake 267 ms (under budget now). Warn only: caption chunks under 0.25 s ("did", "cut", "it.").
SAFE=1 text pass (1 s strip + every cut): no text over faces, no text collisions, no captions cropped.
**Render time (first full-length painted film):** final export 1558 frames, 292 s wall, **0.37 s per frame per worker** (median 327 ms, p95 640 ms) = 0.73x `yo` (budget 1.5x). Draft 0.26 s.

**Sound** (`ic/vo/sound.py`, rewritten from the `tn` copy; `bed.py` now reads `voice.mp3` when there is no `voice.wav`). One 104 bpm grid; sections bright (harp eighths + glock + cello pizz) -> soft (bassoon + harp) -> pizz (from "step one") -> tense (bassoon ostinato + a tap per beat) -> roll (harp rolls + cello) -> pizz (trombone fall on "thirty") -> hush -> out at the door slam (final harp chord rings out). Foley on the `CUT_EP` times: frost crackle, sea wash, creaks, jump landings, cutter scrape and horse steps, 20 block thunks in 2c and in the hold, shovels, sack drop, hay rustle and stomps, the last nail, tally ticks, hatch open, drips, chalk, footsteps, coins, door slam + cold hiss. No vocal foley. CC0 list in `episode.json` -> `foot`.
Loudness per section in the final MP4 (LUFS): bright -14.0, soft -13.5, pizz -14.3, tense -15.0, roll -13.4, pizz -13.1, hush -14.2, slam/out -18.4.
**Not heard (cannot be heard here). Farrukh to listen for:** "Calcutta", "equator", "two-foot", "tannery"; whether the harp and pizz score suits the ice; the 20-thunk block sequences in 2c and 3a (could be busy); the door slam level.

**Caption**
> 180 tons of ice. Boston to Calcutta. 1833. No refrigeration. 🧊🚢
> The ship was the Tuscany; the ice was Frederic Tudor's.
> Would you have trusted bark and hay?
>
> #history #india #kolkata #boston #animation

**Pinned comment**
> Sources:
> - "The Ice Trade between America and India", Journal of the Asiatic Society of Bengal (Sept 1834), from J. J. Dixwell, agent for the shippers; reprinted in Mechanics' Magazine, 9 Apr 1836 (transcript: todayinsci.com/T/Tudor_Frederic/IceTradeAmericaToIndia.htm)
> - Susan S. Bean, "Cold Mine", American Heritage (1991), from Frederic Tudor's diaries (Baker Library, Harvard) and Capt. Littlefield's notes: americanheritage.com/cold-mine
> - Gavin Weightman, The Frozen Water Trade (2003)
>
> Notes: Most retellings say sawdust; the 1834 account of this voyage says a foot of tanners' bark under and around the ice and a foot of hay on top. Packing the blocks tight was meant to make one solid mass, but the same account says the ice still melted between the blocks, not only from the outside. 180 tons were loaded; about 100 reached the ice store. Arrival dates differ (6, 10 or 13 September), so the video says September. "Almost thirty more" = 6-8 tons lost on the river + about 20 in unloading (the agent's estimate). Calcutta's residents raised money for an ice house; the first cargo was kept in a lower room of a house at Brightman's Ghaut, and the building in the video is an illustration. The voyage was organised with Samuel Austin and William C. Rogers; Rogers sold the ice in Calcutta.

**For the 72 h / 7-day review:** `tn` vs `ic` is look + story at once (two data points, not a verdict); record both against the results log in `CLAUDE.md`.

## 14. Second review of the final MP4 and rework list (2026-11-17, Fable 5.2; Stage D calls for Opus)
Reviewed `Ice-To-Calcutta-1833.mp4` (the section 13 export) at 2 fps for the whole film, every caption at 6 fps, suspect moments at full size.
Audio measured only (-14.1 LUFS, TP -2.9, no dropouts), not heard. Facts re-checked against the 1834 account: all narrated numbers hold.
**Farrukh approved all four decisions below on 2026-11-17. The film is NOT finished: it goes back to Stage C with this list.**
Times are in the section 13 cut. Section 13's "not acted on: same dock wall across 7a-8a" is overruled by decision 4.

### Narration changes (LOCKED; everything else in section 3 stays word for word)
```python
 (1,'N',"A Boston ship carried *one hundred eighty tons* of ice to *India.*",1.0,.0),      # was "In eighteen thirty-three, a Boston ship carried ..."
 (1,'N',"In *eighteen thirty-three.*",1.0,.05),                                             # new second line; "Four months at sea. ..." follows unchanged
 (5,'N',"Even in the tropics, the hold took more than *ten days* to heat up.",1.02,.0),   # was "...just to warm up." + 2 s of silence
 (8,'N',"Its new customers reportedly raised the money in *three days.*",.98,.0),          # was "So its new customers paid for something obvious."
 (8,'N',"The ice got its own *house.*",.94,.25),                                            # unchanged
```
- Shot 5 becomes ONE cut of about 3.3 s (5a, the split screen) with the `DAY 10` tag moved into it. Delete 5b and 5c and the silence after the line.
  Expected total about 49 s; "Then the real melting started" moves from 38.1 s to about 35 s. Re-run `gen.py`, `timeline.py`, then re-time `sound.py` (the `tense` section shrinks to one bar or two; keep the one beat grid).
- "three days" source: Bean 1991 ("within three days" British residents raised the money for an icehouse). One secondary source, hence "reportedly".
  The approved wording said "Calcutta reportedly raised"; the subject is kept as "its new customers" because the subscribers were British residents, not the city. Add to the pinned comment: "The three-day subscription is from Susan Bean's 1991 article."
- Hook order (approved by Farrukh 2026-11-17, was part C item 7): the number comes first, the year second. `MERGE_EP` still turns "eighteen thirty-three" into 1833; the `1833` tag stays in the first frame.
  Shot 1 cuts must be re-picked: "carried" now falls under 1 s in, too early to leave the hook frame. Hold 1a (deck, ice, sailor) until about "tons" (2 s or more), run the globe over "of ice to India. In 1833.", cut to the sea on "four". Check the first 3 s on a 0.1 s strip.
- No other line changes.

### A. Approved rework
1. **Sailor costumes (1a, 1c, 1d, 2a, 3c, 5a; 0-10.6, 18-21.3, 27.7-30 s).** The white knee-length coat + peaked baseball cap reads as a modern lab coat. New episode costume in `ic/src/props.js` (do not touch shared `TC`):
   short dark-blue jacket or striped shirt, white trousers, black neckerchief, low-crowned brimmed tarpaulin hat (round brim all the way round, never a front peak). The second sailor in 3c differs by shirt, not by cap colour.
   The mate (7a, 7b) keeps the long navy coat but loses the baseball-cap silhouette too. Same silhouette for the same man in every shot (continuity gate).
   In 2a he fans the block with his own hat, so his head is bare while fanning (today he wears a cap and holds a second black disc that reads as a plate).
2. **Shot 5 cut** as above (27.7-34.0 s today).
3. **Ending (8a-8c; 46.15-51.9 s today).**
   - 8a: three figures a body-width apart, almost still, against the wall. Rebuild as a huddle of the two buyers plus one or two more, a hat passed hand to hand, coins piling in (use `hatProp(coins)`), three quick day ticks. The porter does not hold the hat.
   - 8b/8c must be the same building: today the wide is a cream block with one blue arched door, the close-up is brown double doors in a grey stone wall. One wall colour, one door.
   - 8b: the porter fades to transparent through a closed door at ~49.8 s. The door opens, he walks in, it shuts. No opacity fade on a character.
   - Reference: an 1851 photograph "Ice House, Calcutta" by Frederick Fiebig is in the British Library (reproduced at puronokolkata.com/2014/06/14/ice-house-calcutta-c1833/). Section 13 called the look undocumented; that is no longer true. Look at the photo first and draw its silhouette; it was not viewed in this review. If it cannot be opened, keep the masonry block and say so here. Still no label, no year.
   - Ground in 8b is green with floor-plank lines. Plain grass or packed earth.
4. **Calcutta dock set (7a-7d, 8a; 38.1-48.9 s today).** 10.8 s, including the twist and the best gag, play against one blank tan wall. Rebuild `paintDocks`: the Hooghly behind (reuse the `paintRiver` water and haze), the moored TUSCANY hull and masts, ghat steps down to the water, two or three country boats, a low godown wall on one side only, flat far bank with palms.
   Each cut gets its own framing of that set: 7a crane and dripping block with the ship behind; 7b the mate and slate against the hull; 7c the buyer's walk staged larger (figure at least 1.5x today's height) along the ghat; 7d slate on the godown wall; 8a the huddle.
   - 7d: "ALMOST / THIRTY / MORE." sits over the buyer's legs and shoes (44.3-46 s). Not a gate failure (the gate is faces), but raise him or reframe so the feet clear y 1050-1175.

### B. Defects included on Fable's judgement (Farrukh has seen them in the review, did not rule on them separately)
5. **6a (34.0-36.3 s):** green hills behind Calcutta. It is a flat delta: flat bank, palms, low buildings. The crowd is drawn as thin coloured stick figures, a different style from the toon rig: small dark toon silhouettes or none.
6. **3c (18.0-21.3 s):** the smug sailor hovers above the big block (gap and shadow visible under him). Seat him on the block.

### C. Open: do NOT build unless Farrukh says yes
7. (Approved and moved to the locked narration changes above.)
8. 2b (10.8-13.8 s): horse stiff, the two workers overlap (no-clumps rule), pale rectangles on the ice read as render errors.
9. Hold shots 3a, 4a, 4c, 4d, 6b: figures about 120 px tall, faces unreadable on a phone; in 4d the hay on the fork covers the worker's face (~26 s).
10. 4b tannery: flat grey silhouettes, the weakest painted set.
11. 1c/1d: the sailor is half the ship's height and hangs over open water during the jump.
12. 1b: BOSTON label and the route start sit on empty ocean; rotate the globe so the American coast shows at the start.
13. Narration runs about 185 words a minute with two real pauses. No change proposed until Farrukh has listened.
14. Export bitrate 3.9 Mbps; painted gradients may band after Instagram recompresses. Try 8-12 Mbps in `mix.sh` and compare a sky frame.

### Gates for the rebuilt film
`verify.js ic` PASS, `SAFE=1` sheets one per second plus 0.1 s either side of every cut, contact sheet per rebuilt shot, loudness per section, and a fresh independent facts pass on the two changed lines. Then Stage D again (Opus 5.5, medium).


## 15. Stage C rework build (2026-11-17, Sonnet 5.5, medium)

**Built (section 14 parts A and B).** New hook order ("A Boston ship carried 180 tons of ice to India. In 1833."), shot 5 as one cut with a DAY 1-10 counter, new ending line ("Its new customers reportedly raised the money in three days."), sailor costume (tarp hat, neckerchief, stripes, hem), mate and buyer3 costumes, hat prop (fan/bowl), rebuilt Calcutta dock set (palms, far bank, boats, river bed), rebuilt 7a-7d, huddle 8a-8d with the hat going round, ice house with the porter walking in, door slam. Score and foley re-timed in `vo/sound.py` (cut block, tense section, tally ticks, coins, steps, slam). Kit changes (opt-in only): `cap:'tarp'` with `crown`/`band`, `neck`, `hem`, `stripe` in `engine/toon/20_rig.js`.

**Gates.** `verify.js ic`: PASS. Paint median 24 ms, p95 31-41 ms, none over budget. Reach worst 5.3 units, no misses. Determinism 60/60. Subtitles 0 outside the safe area. Cadence: longest gap 4.04 s (shot 5, 27.69-31.73) allowed by `CUT_HOLD_EP=[5,8]`; the cap is 3.4 s otherwise. Caption warns on chunks under 0.25 s ("cut", "it.", "days"). Draft export 540 px / 15 fps: 762 frames, 50.8 s, video only (sound comes from `mix.sh`). Sound re-timed; section levels from bed.py: bright -1, soft -5, pizz -3, tense -4, roll -2, pizz -4, hush -7 dB targets (measured gains applied).

**Not done / not checked.**
- Fiebig 1851 ice house photo could not be opened (caption only). The ice house stays an unlabelled masonry illustration: no label, no year.
- Part C items 8-14 not built (Farrukh has not asked for them in this chat).
- Total length 50.77 s, not ~49 s: shot 1 length is unchanged.
- Audio not heard. Listen to: "Calcutta", "equator", "two-foot", "tannery", "reportedly", the score re-time at 27.7 s and 35.8 s, the slam at 49.6 s.
- Contact sheets at 38.5 s ("4 MONTHS / -55") and 41.5 s ("DAY ... ≈ -3") show chalkboard text clipped at the board edge. Not investigated; check on a full-size frame in Stage D. Stage D fix list otherwise: none (no shot hit the two-strike rule).
- 2a hat-fan motion is small (hat at belly height). 5a counter reads DAY 2 at 29.0 s (linear from "tropics" to "ten").

**Pinned comment gains:** "The three-day subscription is from Susan Bean's 1991 article." Caption otherwise unchanged.

### Stage D handoff (Opus 5.5, medium)
1. Fresh independent facts pass (new agent, frames + script, no conclusions) on the two changed lines: "180 tons ... In 1833" and "reportedly raised the money in three days".
2. SAFE=1 text-collision pass, including the two chalkboards above and the 8d door close-up.
3. `node engine/tools/export.js ic && bash engine/tools/mix.sh ic`, then `node engine/tools/cover.js ic`; ebur128 per section.
4. Tell Farrukh the listening checks above. Judgment calls to confirm: the 4.04 s shot 5 hold, the 2a hat fan.
5. Do not publish or post.
