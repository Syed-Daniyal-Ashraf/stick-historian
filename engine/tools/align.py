#!/usr/bin/env python3
"""Measure when each narrated word is actually spoken, and write those times into EP/vo/timing.json.

usage (from the project root, after vo/timeline.py):
    python3 engine/tools/align.py EP            # measure, report drift, update timing.json
    python3 engine/tools/align.py EP --check    # measure and report only, change nothing

timeline.py estimates word times from phoneme counts; long phrases drift. This aligns each narrated line
separately against the real voice (pocketsphinx forced alignment, free, offline, model bundled in the pip
package), so one bad line can never shift the rest of the film. Line starts (v0) are not touched: they are
exact already, and shot timing and the score are built on them.

Words the recogniser can't place (not in its dictionary, or a line it can't follow) keep the estimate,
shifted to sit between their measured neighbours. Every word gets 'src': 'm' (measured) or 'e' (estimate).
The first run keeps the original estimate in vo/timing_est.json; later runs re-measure from that copy,
so running the tool twice gives the same result.
Needs: pip install pocketsphinx (in requirements.txt). English only.
"""
import json, re, subprocess, sys, shutil
from pathlib import Path
import numpy as np

SR = 16000
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()

def say_num(n):
    """Spoken form of a whole number as Kokoro reads it (years as 'nineteen twenty-eight')."""
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if 1100 <= n <= 2099 and n % 100 != 0 and not (2000 <= n <= 2009):
        return say_num(n // 100) + " " + say_num(n % 100)
    if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + say_num(n % 100))
    if n < 1000000: return say_num(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + say_num(n % 1000))
    return str(n)

def tokens(word):
    """Recogniser tokens for one on-screen word: 'yo-yo.' -> ['yo','yo'], '1928' -> ['nineteen','twenty','eight']."""
    w = word.lower().replace("’", "'").replace("*", "")
    out = []
    for part in re.split(r"[-–—/\s]+", w):
        part = re.sub(r"[^a-z0-9']", "", part).strip("'")
        if not part: continue
        if part.isdigit(): out += say_num(int(part)).split()
        elif re.fullmatch(r"\d+(st|nd|rd|th|s)", part): out += say_num(int(re.match(r"\d+", part).group())).split()
        else: out.append(part)
    return out

def load_audio(vo):
    src = vo / "voice.wav" if (vo / "voice.wav").exists() else vo / "voice.mp3"
    if not src.exists(): sys.exit(f"no {vo}/voice.wav or voice.mp3: run vo/gen.py and vo/timeline.py first")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-ar", str(SR), "-ac", "1", "-f", "s16le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16), src.name

QUIET = 10 ** (-40 / 20) * 32768      # -40 dBFS, the same level as `silencedetect=noise=-40dB`

def frame_rms(audio):
    """RMS level of every 10 ms frame."""
    n = len(audio) // 160
    a = audio[:n * 160].astype(np.float64).reshape(n, 160)
    return np.sqrt((a ** 2).mean(1))

def onset(rms, t, look=.25):
    """If t falls in silence, return the first frame within `look` s where sound starts; otherwise t."""
    i = int(t * 100)
    if i >= len(rms) or rms[i] >= QUIET: return t
    for j in range(i, min(len(rms), i + int(look * 100))):
        if rms[j] >= QUIET: return j / 100
    return t

def align_line(Decoder, audio, t0, t1, toks):
    """Align a list of tokens inside audio[t0:t1]. Returns [(token, start_s)] in absolute seconds, or []."""
    seg = audio[max(0, int(t0 * SR)):int(t1 * SR)]
    if len(seg) < SR // 10 or not toks: return []
    d = Decoder(samprate=SR, loglevel="FATAL", bestpath=False)
    try:
        d.set_align_text(" ".join(toks))
        d.start_utt(); d.process_raw(seg.tobytes(), full_utt=True); d.end_utt()
        res = [(s.word, max(0, t0) + s.start_frame / 100) for s in (d.seg() or [])]
    except RuntimeError:
        return []
    return [(re.sub(r"\(\d+\)$", "", w), t) for w, t in res if w not in ("<s>", "</s>", "<sil>", "[NOISE]")]

def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    ep = Path(sys.argv[1]).resolve(); check = "--check" in sys.argv; vo = ep / "vo"
    try:
        from pocketsphinx import Decoder
    except ImportError:
        sys.exit("pocketsphinx is missing: python3 -m pip install pocketsphinx")
    tj, est = vo / "timing.json", vo / "timing_est.json"
    # timeline.py rewrites timing.json from scratch, so a fresh run (no 'src' marks) becomes the new estimate.
    cur = json.load(open(tj))
    fresh = not any("src" in w for sh in cur["shots"] for ln in sh["lines"] for w in ln["words"])
    if fresh and not check: shutil.copy(tj, est)
    T = cur if fresh else json.load(open(est))
    audio, src = load_audio(vo); rms = frame_rms(audio)
    probe = Decoder(samprate=SR, loglevel="FATAL")
    known = lambda t: probe.lookup_word(t) is not None

    drifts, n_meas, n_all, report = [], 0, 0, []
    for si, sh in enumerate(T["shots"]):
        for ln in sh["lines"]:
            W = ln["words"]; toks, owner = [], []
            for wi, w in enumerate(W):
                for tk in tokens(w["w"]):
                    if not known(tk) and tk.endswith("'s") and known(tk[:-2]): tk = tk[:-2]   # Duncan's -> duncan
                    if known(tk): toks.append(tk); owner.append(wi)
            res = align_line(Decoder, audio, ln["v0"] - .08, ln["v0"] + ln["vd"] + .15, toks)
            got = {}
            if [r[0] for r in res] == toks:                     # only trust a complete, in-order alignment
                for (tk, t), wi in zip(res, owner): got.setdefault(wi, t)
            meas = [None] * len(W)
            for wi, t in got.items(): meas[wi] = round(t, 3)
            # the recogniser often starts a word that follows a pause inside the pause: move it to where sound starts
            for wi in range(len(W)):
                if meas[wi] is not None: meas[wi] = round(onset(rms, meas[wi]), 3)
            # words without a measurement: keep the estimate, moved by the drift of the nearest measured word
            new = []
            for wi, w in enumerate(W):
                if meas[wi] is not None: new.append((meas[wi], "m")); continue
                near = sorted((k for k in range(len(W)) if meas[k] is not None), key=lambda k: abs(k - wi))
                shift = (meas[near[0]] - W[near[0]]["t"]) if near else 0
                new.append((round(onset(rms, w["t"] + shift), 3), "e"))
            # keep times in order and inside the line
            lo, hi = ln["v0"], ln["v0"] + ln["vd"]
            fixed = []
            for t, s in new:
                t = min(max(t, lo, fixed[-1][0] + .04 if fixed else lo), hi)
                fixed.append((round(t, 3), s))
            for w, (t, s) in zip(W, fixed):
                d = t - w["t"]
                if s == "m": drifts.append(abs(d)); n_meas += 1
                n_all += 1
                report.append((si + 1, w["w"], w["t"], t, s, d))
                w["est"], w["t"], w["src"] = w["t"], t, s
            if not res: print(f"  shot {si+1}: could not align \"{' '.join(x['w'] for x in W)}\" (kept estimates)")
            elif not got: print(f"  shot {si+1}: partial alignment rejected for \"{' '.join(x['w'] for x in W)}\" (kept estimates)")

    print(f"align: {src}, {n_meas}/{n_all} words measured")
    if drifts:
        a = np.array(drifts)
        print(f"estimate error: median {np.median(a)*1000:.0f} ms, 90% {np.percentile(a,90)*1000:.0f} ms, max {a.max()*1000:.0f} ms")
    big = [r for r in report if r[4] == "m" and abs(r[5]) >= .12]
    if big:
        print("words the estimate had off by >= 120 ms (shot, word, estimate -> measured):")
        for s, w, e, m, _, d in big: print(f"  {s}  {w:<14} {e:7.2f} -> {m:7.2f}  ({d*1000:+.0f} ms)")
    unm = [r for r in report if r[4] == "e"]
    if unm: print("not measured (estimate kept):", ", ".join(f"{s}:{w}" for s, w, *_ in unm))
    if check:
        print("--check: timing.json not changed"); return
    T["aligned"] = True
    json.dump(T, open(tj, "w"))
    print(f"wrote {tj.relative_to(ep.parent)} (estimate kept in {est.name}). Rebuild: engine/make.sh {ep.name}")

if __name__ == "__main__":
    main()
