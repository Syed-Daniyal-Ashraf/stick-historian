#!/usr/bin/env bash
# One-time setup: Python + Node deps, Chromium for Playwright, the Kokoro voice model, and the CC0 sample libraries.
# Needs: python3 (3.10+), node (18+), git, ffmpeg on PATH.
set -e
cd "$(dirname "$0")/.."
for c in python3 node npm git ffmpeg; do command -v $c >/dev/null || { echo "missing: $c"; exit 1; }; done
python3 -m pip install -r requirements.txt
npm install
npx playwright install chromium
mkdir -p assets/tts
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s assets/tts/$f ] || curl -L -o assets/tts/$f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f
done
# VSCO 2 Community Edition (CC0 orchestral samples) - only the folders the score uses (~1 GB)
if [ ! -d assets/VSCO-2-CE ]; then
  git clone --filter=blob:none --no-checkout https://github.com/sgossner/VSCO-2-CE assets/VSCO-2-CE
  ( cd assets/VSCO-2-CE && git sparse-checkout init --no-cone && cat > .git/info/sparse-checkout <<'SP'
/Strings/Violin Section/Pizz/*_v1_rr1.wav
/Strings/Cello Section/*
/Strings/Harp/*
/Woodwinds/Bassoon/*
/Woodwinds/Clarinet/*
/Woodwinds/Flute/*
/Brass/OldTrombone/Fall/*
/Brass/Tuba/stac/*
/Keys/Upright Piano/*
/Percussion/Snare2-taps*
/Percussion/Conga-*_rr1_Sum.wav
/Percussion/Quinto-*_rr1_Sum.wav
/Percussion/Tumba-*_rr1_Sum.wav
/Percussion/Timpani/Timpani*_Hit_v*_rr1_Sum.wav
/Percussion/Timpani/Rolls/*
/Percussion/gongHit_*.wav
/Percussion/Tamb1-Shake_v1_rr1_Sum.wav
/Percussion/cymbal-crashshort*
/Percussion/Glock/*
/Percussion/Claves1_Hit_v2_rr1_Sum.wav
/Percussion/Sleighbells_Hit*
/Percussion/BDrumNewhit_v5_rr1_Sum.wav
/LICENSE
SP
  git checkout HEAD )
fi
# Kenney audio packs (CC0): foley - paper, books, coins, footsteps, cloth, UI clicks
if [ ! -d assets/kenney-audio-assets ]; then
  git clone --filter=blob:none --no-checkout https://github.com/ismetcabbar9-oss/kenney-audio-assets assets/kenney-audio-assets
  ( cd assets/kenney-audio-assets && git sparse-checkout init --no-cone && printf '/Audio (295 files)/*\n/LICENSE.md\n' > .git/info/sparse-checkout && git checkout HEAD )
fi
echo "setup done. Try: engine/make.sh mo && node engine/tools/shots.js mo test.png 1 10 20"
