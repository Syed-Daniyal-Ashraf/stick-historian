# yo/ - Pedro Flores and the word "yo-yo" (brief)

Stage A done 2026-11-13 (Opus 5.5). Stage C done. Stage D done 2026-11-13 (Opus 5.5): final MP4, cover, caption and sources comment ready (section 11). Waiting on Farrukh's listening check.
Read `CLAUDE.md` and `ENGINE.md` first; this brief only adds what is specific to this episode.

## 1. The story in one line
A Filipino immigrant made America love the yo-yo, an American company ended up owning the word,
and in 1965 a court took it back. Part of the court's evidence was the company owner's own words from 1931.
Pedro Flores had died the year before.

Same shape as Monopoly (`mo/`): an everyday object, an unknown creator, someone else owns it, an ironic ending.

## 2. Hook audit
| Option | Line | Verdict |
|---|---|---|
| **A (chosen)** | "A Filipino immigrant got America hooked on the yo-yo. An American company ended up owning the *word*." | Two people in contrast in the first 5 s, like Monopoly's opener. "Owning a word" makes people want to know how. Keeps the court twist for the end. |
| B | "In 1965, a court ruled a toy company never owned its most famous word." | Accurate but cold: no person, no feeling. |
| C | "This toy's name came from the Philippines. An American company spent 30 years claiming it." | Spoils the payoff in second 3. |

**First frame (must read with no sound, all inside y 290-1110):** a split screen. On the left, Pedro in his bellboy
uniform, a yo-yo "asleep" (spinning) at the end of its string, with motion lines. On the right, Duncan in his suit
hugging a giant 3D word **YO-YO** with a big **®** on it. No other text. The premise is a man with the toy against
a man holding the *word*.

## 3. Narration (paste into `yo/vo/gen.py` SCRIPT)
132 words. Estimated 50-54 s at Monopoly's pace (140 words came to 55 s). Inside the 45-60 s target.
```python
SCRIPT=[
 (1,'N',"A Filipino immigrant got America hooked on the *yo-yo.*",1.0,.0),
 (1,'N',"An American company ended up owning the *word.*",1.0,.15),
 (2,'N',"Pedro Flores worked in a California *hotel.*",1.03,.0),
 (2,'N',"From the *Philippines,* he knew a trick: a looped string that let it *sleep.*",1.02,.05),
 (3,'N',"In *nineteen twenty-eight,* he opened his own yo-yo company.",1.04,.0),
 (3,'N',"The next year: *three factories.*",1.0,.05),   # CUT in Stage D (section 11)
 (4,'N',"He'd trademarked the name: *Flores Yo-Yo.*",1.02,.0),
 (4,'N',"When businessman *Donald Duncan* tried to trademark *Yo-Yo*… he was *rejected.*",1.04,.05),
 (5,'N',"So Duncan *bought him out.* The company… and the *name.*",1.0,.0),
 (5,'N',"Pedro stayed on, showing kids tricks… with *Duncan* yo-yos.",1.0,.1),
 (6,'N',"Decades later, Duncan sued a rival over the word… and *lost.*",1.03,.0),
 (7,'N',"The court ruled *yo-yo* was a *Philippine* word. Nobody could own it.",1.02,.0),
 (8,'N',"Part of the evidence? Duncan's *own* words, from *nineteen thirty-one.*",1.0,.0),
 (9,'N',"Pedro Flores never heard the ruling.",.96,.0),
 (9,'N',"He had died the year *before.*",.92,.3),
]
```
- `MERGE_EP`: "nineteen twenty-eight" → 1928, "nineteen thirty-one" → 1931.
- Pronunciation to check in `vo/raw*.wav`: "Flores" (FLOR-es), "Yo-Yo" in the middle of a sentence, and "Philippine".
- Don't speed lines up to hit timing (channel rule). If it runs long, use the cuts in section 9.

## 4. Storyboard (times are estimates; real times come from `vo/timing.json`)
Every shot needs a gag, a reveal or a camera move. Poses change only with `tween(full(A),full(B))`.

| Shot | ~Time | Picture | Cues (`cu`) |
|---|---|---|---|
| 1 Hook | 0-5.5 | Opens on the first frame above (`panelBox` split, like `mo` sh4). On "hooked", the left panel fills with small kids, each with a yo-yo bobbing in time. On "company", a quick push to the right panel: Duncan hugs the word, and the ® stamps on at "word". In the left panel, Pedro's yo-yo zips back to his hand and his smile drops. | hooked, company, word |
| 2 Hotel | 5.5-12.5 | Santa Barbara hotel lobby (palm, bell desk, revolving door). Pedro carries a wobbling tower of suitcases. At "Philippines", a thought-bubble wipe to a sunny Philippine yard (house on stilts, palm) with kids playing with yo-yos. At "looped", an extreme close-up of the axle: the knot slides into a loop. At "sleep", the yo-yo spins at the bottom wearing a tiny nightcap with "z z z". Back in the lobby, guests lean in. | hotel, philippines, looped, sleep |
| 3 Company | 12.5-17.5 | A painted sign: YO-YO MANUFACTURING CO. · SANTA BARBARA · 1928. Pedro turns one yo-yo by hand at a bench. At "three", the camera pulls back fast and three factories pop up (`burst`) with yo-yo-shaped smoke rings and a conveyor of yo-yos. | twenty, three |
| 4 Rejected | 17.5-24 | Patent Office counter. Pedro's certificate **FLORES YO-YO** gets a REGISTERED · 1930 `stampMark` and is pinned to the wall. Duncan slides his form **YO-YO** across the counter. The examiner looks at the wall and stamps REJECTED in red at "rejected", and Duncan's hat pops up. | trademarked, duncan, rejected |
| 5 Bought out | 24-31.5 | Duncan pushes a money bag across the desk (**no figure shown**: the price is disputed). At "name", a roller paints FLORES out letter by letter and DUNCAN in. Then a street corner: Pedro wears a DUNCAN sash and shows kids a trick. A kid holds up the label, DUNCAN, and Pedro's grin tightens (smile → tight, tweened). | bought, name, duncan |
| 6 Lawsuit | 31.5-36 | Calendar pages flip from 1932 to 1965 while Duncan greys (`grey` only goes up). Courtroom (reuse `courtroom()` from `mo`). Duncan points at a rival holding a box marked ROYAL. At "lost", the gavel lands and the ® cracks off the giant word. | rival, lost |
| 7 Ruling | 36-40.5 | The judge (`TC.judge`) holds up a yo-yo. At "Philippine", the letters Y-O-Y-O lift off the word. At "own", the letters float out of the courtroom window and get caught by kids outside. | philippine, own |
| 8 Evidence | 40.5-45 | A lawyer slides an old yellow document out of a file (adapt `censusForm`). Push in on a typed excerpt (exact wording: see section 6), signed by Duncan. At "own", Duncan's jaw drops. | evidence, own, thirty |
| 9 Ending | 45-51 | Quiet; the music drops to `hush`. The empty hotel bell desk, with a framed toon portrait marked **PEDRO FLORES** (**no years**: see section 6). A yo-yo hangs from the frame corner, spinning asleep and slowing. At "before", it rolls back up the string. Hold for 1 s. No follow plug. | ruling, before |

Cover: `COVER_T` ≈ 1.5 s (the split first frame).

## 5. Sound
- One tempo for the whole film (staging rule); 108 bpm like `mo` is fine.
- Jazz-age upright piano (VSCO), with pizzicato strings for yo-yo bounces, timed to the string moving up and down.
- Sections: 1 `rag` → 2 `soft`, then `pizz` at "trick" → 3 `rag` → 4 `pizz` with a stinger on REJECTED → 5 `roll`, then `sad` on the
  Duncan-sash beat → 6-7 `tense` → 8 `roll` (reveal) → 9 `hush` → `out`.
- Foley (CC0 only, listed in `episode.json` → `foot`): yo-yo string zip and whirr, hotel desk bell, stamp thud ×2, money-bag
  thump, paint-roller swish, gavel (from `mo`), paper slide. **No vocal foley** (crowd "ooh" and so on), because of the voices rule.
- If VSCO 2 CE has a CC0 plucked-string sample that could suggest a Filipino rondalla for Pedro's theme, try it.
  If it doesn't, use pizzicato.

## 6. Facts and source tiers
**Established (primary or several independent sources):**
- Flores came to the US in 1915. (encyclopedia.com/IDCH; SFSU APIA; Wikipedia)
- He opened his yo-yo company in Santa Barbara in 1928. (encyclopedia.com: June 9, 1928; Wikipedia via Hirahara 2003; Smithsonian: "by early 1929")
- His slip-string loop instead of a knot let the yo-yo "sleep". (Lienhard, UH *Engines of Our Ingenuity* #2796; Wikipedia; SFSU)
- Flores Yo-Yo Corporation registered "Flores Yo-Yo" on **July 22, 1930**. (*Duncan v. Royal Tops*, 343 F.2d 655, 7th Cir. 1965)
- Duncan Sr.'s first application was **rejected because of "Flores Yo-Yo"**. (same opinion)
- On **Dec 19, 1931**, Duncan Sr. told the Patent Office the term is "used in the Philippine Islands". (same opinion, quoting his filing)
- Duncan acquired the Flores registration by assignment (same opinion) and Flores's remaining assets, including the trademark,
  by Oct 1932. (Smithsonian)
- Decided March 3, 1965 (rehearing denied May 4, 1965): "Yo-Yo" is "a descriptive term and not entitled to trademark protection", and the toy was "in use in
  the Philippines" long before the US. (same opinion)
- Flores died in **1964** (Wikipedia, SFSU, Positively Filipino all give 1964). The month is disputed (January or June), so the narration gives no month.

**Reported or dramatised (fine as worded):**
- "Got America hooked" = popularised (UH). Duncan's advertising turned it into the national craze (UH), which the script shows from shot 5.
- "Worked in a California hotel": encyclopedia.com says bellboy in Santa Barbara; UH says porter at a Santa Monica hotel.
  The narration stays general and the uniform is illustration.
- "Three factories" by the end of 1929 (encyclopedia.com; Wikipedia lists Santa Barbara, Los Angeles and Hollywood).
- After the sale, Flores promoted and demonstrated for Duncan (UH; encyclopedia.com; Wikipedia via Hirahara).
  "Showing kids tricks" dramatises this.
- "From the Philippines, he knew a trick" is an inference: the court says the toy was used there first, and sources call the
  loop a Filipino technique.

**Deliberately left out:**
- Sale price: sources say $5,000 for first rights (Smithsonian), "more than $250,000" (encyclopedia.com, Positively Filipino)
  and $750,000 (ThoughtCo). They conflict, so no number appears on screen.
- Both companies going bankrupt from legal costs (single source: encyclopedia.com).
- "Yo-yo means *come back*". That gloss came from Duncan's own 1931 filing, and linguists disagree (Merriam-Webster: probably Ilocano;
  another view: Chinese). The narration attributes "Philippine word" to **the court**, which is exactly what it ruled.
- Flores as *inventor* of the yo-yo (false: the toy is ancient), the weapon myth, and the Rizal anecdote.
- Flores's birth year (1896 appears only in uncited sources), so the portrait in shot 9 shows his name only.

**On-screen quote in shot 8 must be verbatim.** Copy it from the opinion text, not from this brief:
https://law.justia.com/cases/federal/appellate-courts/F2/343/655/109434/ (the Dec 19, 1931 response; start of the sentence:
"the applicant understands the term 'Yo-Yo' is used in the Philippine Islands"). Check the exact punctuation there.

## 7. Production plan
**Reuse:** `stage()`, `under()`, `panelBox()` (copy from `mo/src/shots.js`); `courtroom()`, `TC.judge`, `censusForm()` and `check()`
pattern from `mo/src/props.js`; `stampMark`, `tag`, `ttl`, `burst`, `wob`, `shakeV` from the toon kit; costumes `darrow`,
`exec`, `pal` and `clerk` as starting points to recolour.

**New, episode-level (`yo/src/props.js`):**
- `yoyo(hx,hy,u,mode)`: string from the hand point to the yo-yo, with modes `drop`, `sleep` (spin with motion lines), `return` and `walk`.
  Work out the hand point from the pose target in world space: `[x + hF[0]*s*dir, y + hF[1]*s]`. Keep targets within reach
  (~114 units); `verify.js` lists misses.
- Sets: `hotelLobby`, `philYard`, `factoryRow`, `patentCounter`, `duncanOffice` (recolour `parkerOffice`), `streetCorner`.
- Costumes: `pedroBell` (maroon jacket, gold belt, black hair, `young:true`), `pedroSuit` (same face, tan suit),
  `duncan`, `examiner`, `rival` (flat cap), and kids (`young:true`).
  **Make Duncan clearly different from Monopoly's Darrow** (Darrow = fedora + thin moustache). Use a lighter fedora, round glasses,
  a bow tie, no moustache and a heavier build.

**Engine changes: none required.** Two optional, small and additive changes, fine to do inside Stage C (no Stage B chat needed):
1. A bellboy pillbox hat. Try `cap:'topi'` recoloured maroon with a gold band first. Only if that doesn't read as a bellboy hat,
   add `cap:'pillbox'` in `engine/toon/20_rig.js`.
2. `courtroom()` + `TC.judge` are now used twice. Move them into `engine/toon/30_world.js` and remove the copy from `mo`.
For either change, rebuild `mo` and `lb`, run `node engine/compare.js old.html new.html`, and update `ENGINE.md` in the same commit.

**Files Stage C creates:** `yo/episode.json`, `yo/src/{meta,props,shots,defs}`, `yo/vo/*` (copy `mo/vo/` as the template).
Suggested `episode.json`: title "He Gave America the Yo-Yo. Duncan Owned the Word.", out `yoyo-flores`,
file `YoYo-Pedro-Flores`.

## 8. Caption and pinned comment (final, Stage D)
Caption:
> He got America hooked on the yo-yo. Then an American company owned the word. 🪀
> Would you let a company own a word?
>
> #history #yoyo #filipinohistory #philippines #animation

Pinned comment (sources):
> Sources:
> - The 1965 court ruling: Donald F. Duncan, Inc. v. Royal Tops Mfg. Co., 343 F.2d 655 (7th Cir. 1965). The 1931 quote in the video is from Duncan Sr.'s Dec. 19, 1931 reply to the Patent Office, as quoted in this opinion: law.justia.com/cases/federal/appellate-courts/F2/343/655/109434/
> - Smithsonian, "Yo-Yo History in America": si.edu/spotlight/yo-yo
> - J. Lienhard, "The Yo-Yo", Engines of Our Ingenuity #2796, Univ. of Houston: engines.egr.uh.edu/episode/2796
> - "Duncan Toys Company", International Directory of Company Histories (encyclopedia.com)
> - SFSU Asian Pacific Islander American biography of Pedro Flores (dates: 1896-Jan 3, 1964)
>
> Notes: Flores didn't invent the yo-yo (the toy is ancient); he popularised it in the US with his slip-string design. Where the word comes from is debated (Ilocano and Tagalog are both suggested); the 1965 court called it a Philippine word. Sources give very different prices for the sale to Duncan, so the video shows none. Most sources date Flores's death to January 1964; one gives December 1963.

## 9. Risks and fallbacks
- **Duncan appears late (~17-20 s) apart from the hook.** The hook already shows him in second 3. If the rough cut feels slow in
  shots 2-3, cut "The next year: three factories." first (-2 s), then shorten the Philippines thought bubble.
- **The yo-yo string is the hardest new thing to animate.** Build `yoyo()` first, check it on a 0.1 s strip, then build the shots.
- **Too much text:** shots 4-5 and 8 carry signs, stamps and a document. Keep one text layer at a time, and check with `SAFE=1`.
- **Comment pushback is likely on "inventor".** The script never says he invented it, and the pinned comment says so.
- **The ending must stay quiet, not sentimental:** no tears or sad faces, just the empty desk and the yo-yo coming back.

## 10. Stage C report (built on a3bc3b8)
**Built:** 9 shots, 53.3 s, Kokoro `af_heart`, one-tempo score (108 BPM), foley from Kenney/VSCO only. `verify.js` PASS. Draft `DRAFT=1 export.js yo` ran (540 px, 15 fps).
**Engine (additive, `compare.js` shows 0 frames different on mo and lb):** `cap:'pillbox'`; `courtroom()` + `TC.judge` moved to `30_world.js`; `CLIP` env in `shots.js`. ENGINE.md updated.
**Narration/locked content unchanged.** Subtitles on one line at baseline 1178.
**Quote (shot 8):** copied from the 1965 opinion via WebFetch only; the shell cannot reach justia. The excerpt stops before "to mean 'come back' or 'springy'" on purpose. NOT independently re-checked: Stage D must compare it word for word with the opinion.
**Not checked:** audio by ear (music balance, foley), pronunciation of Flores and Philippine, phone speakers, final 1080x1920 export, cover, independent facts/visual review pass. Loudness: bed.mp3 -19.6 LUFS integrated (before the -14 LUFS final mix); the per-section levels are in the sound.py output (rag 0, soft -3, pizz -5, rag -1, pizz -5, roll -3, sad -6, tense -4, roll -3, hush -9 dB targets).
**Fix list for Stage D:** (1) verify quote; (2) fresh-agent review with SAFE=1 sheets: labels and faces in y 290-1110, text collisions in shots 4, 5, 8; (3) check the first 3 s hook (premise visible in frame 1) and that the best material lands before ~20 s; (4) check the sad section at the Duncan-sash beat (shot 5) is not too sad; (5) final export, `mix.sh`, `cover.js`.
**Gotcha:** `yo/src/scenes.js` is generated; it is now gitignored.

## 11. Stage D report (Opus 5.5, built on 370ae73)
**Quote (shot 8): verified word for word** against two copies of the opinion (law.justia.com and law.resource.org): "* * * the applicant
understands the term 'Yo-Yo' is used in the Philippine Islands to mean 'come back' or 'springy', ..." Introduced by the court as "In response to
this rejection, on December 19, 1931, Duncan, Sr. argued as follows". On screen it is cut after "Islands" with an ellipsis.
The header was "PATENT OFFICE · RESPONSE OF DEC. 19, 1931" (it read as if the Office had written it); it is now "DUNCAN'S REPLY TO THE PATENT OFFICE · DEC. 19, 1931".
**Cut:** "The next year: three factories." (section 9 fallback). Shot 3 was ~4 s of one pose. `MIN[3]` 4.8 -> 3.6, so the film is 51.7 s (was 53.3).
The factories now pop on "own" ("his own yo-yo company"); `vo/sound.py` `KF3` follows. The other lines regenerated with identical timing (max drift 0.000 s).
The rejection lands at ~23 s (was ~24.8), and Duncan enters by name at ~20.3 s (he is already in the hook at 0 s).
**Visual fixes (SAFE=1 sheets + an independent reviewer agent):**
- Shot 1: the YO-YO® was ~55 px with the Y hidden by Duncan's hand. Duncan now stands behind a giant word (size 150) and clutches its top edge, so the premise reads in frame 1.
- Shot 3: the shop sign sat entirely under the Reels top bar (screen y 135-290). Moved down.
- Shot 4: the pinned FLORES YO-YO certificate sat at screen y ~80 (under the top bar). The shot is now wider (z .8) and the certificate is pinned up-left, clear of the hats; the examiner looks at it.
  REJECTED was unreadable on the small form, so a large stamp on a paper slip now lands in screen space below the faces. Duncan was moved off the right edge.
- Shot 5: the FLORES -> DUNCAN repaint never finished before the cut. It now starts on "company", ends on "name", and the cut to the street moved to "Pedro" +0.3 s (J-cut).
  The sign was half under the top bar and behind Duncan's hat; it is now lower, smaller and to the left. The kid's DUNCAN card no longer covers her face (it is held above her head).
- Shot 6: the cracked ® halves landed in the subtitle lane as stray marks; they now fall off-screen.
- Shot 7: the kids' heads were cut by the window frame; the judge's head covered the board. The board is lower and left, and the letters lift less and arc over the judge's face, staying out of the top bar.
- Shot 8: the arm no longer crosses the caption lane.
- Shot 9: there is a slow push-in from the lobby onto the portrait (6 s static before). The yo-yo hangs just outside the frame corner, clear of the PEDRO FLORES plate.
**Gates:** `verify.js` PASS (determinism 60/60, reach worst 3.7, subtitles 0 frames outside). Final export 1080x1920, 30 fps, 51.67 s, -14.1 LUFS, true peak -0.7 dBTP
(one transient in the court section; every other section is -2.9 to -3.0).
**Reviewer findings not acted on (and why):** "From the Philippines, he knew a trick" and "a Philippine word" are kept as locked narration (tiers in section 6).
"He had died the year before" is kept: SFSU APIA, Wikipedia and Positively Filipino give Jan 3, 1964; one blog (toytales) says Dec 1963 (noted in the comment).
Duncan suing in person in shot 6 (the plaintiff was his company) is accepted as illustration.
**Not checked:** listening (music balance, the sad section at the sash beat, foley, pronunciation of Flores = flˈɔːɹɛs and Philippine = fˈɪlᵻpˌiːn), phone speakers.
**Loudness per section (final mix, LUFS):** hook -13.9, hotel -13.7, loop -14.1, company -14.1, rejected -13.7, buyout -13.5, sash -14.9, court -14.1, evidence -14.3, ending -14.3.

## 12. Animation review pass (Fable 5.2, 2026-11-13, built on e7df880)
Frame-by-frame review of the Stage D MP4 (2 fps sheets of the encoded file + 0.1 s strips at every transition). Narration is unchanged.
**Bugs fixed**
- Black strip at the bottom of the frame in shots 2, 3 and 4: `FLOOR()` ended at world y 2500, short of the frame at z <= .9. Floors and walls now overscan.
- Shot 7: the judge's yo-yo and string were drawn down the middle of his face (it read as a red streak). He now holds it out to the side.
- Shot 6: the cracked (R) halves fell through the frame and stopped as stray marks under the subtitle. They now spin off and fade.
- Shot 6: nothing happened on "and lost". Duncan now slumps in shock and the rival punches the air.
- Shot 2: the nightcap gag appeared 0.3 s before the cut. `TAIL[2]` adds one beat, so it holds ~0.9 s (film is 52.2 s, was 51.7).
- Shots 1, 2, 5: the kids were three overlapping copies in one clump. Shot 1 has two kids with room, shot 2 spreads three, shot 5 has two in front and one peeking.
- Final mix peaked at -0.7 dBFS; `engine/tools/mix.sh` now ends with a limiter.
**Staging and motion**
- Hook: panels run from y 130 to 1530 (was 300-1110, leaving 40% of the frame black). Pedro throws and catches the yo-yo in a loop instead of holding one pose for 6 s; the toy is larger; the kids bounce.
- Shot 3: he really cranks the lathe; the factories are ~45% larger and fill the width.
- Shot 4: Duncan walks in when he is named (he stood in frame for 3 s before). Small push-in on REJECTED.
- Shot 6: the YO-YO(R) word is larger and clear of Duncan's hat. Shot 7: the floating letters are larger. Shot 8: the quoted page is larger.
- Interior floors have floorboards in perspective, so the lower third is no longer one flat colour.
**Not changed / still open:** word timings are estimates; shot 4 is still 6.7 s on one set; shot 7 is width-limited (board + judge + window), so its figures stay small.
**Not checked:** listening (music, foley, pronunciation), motion at full speed.

