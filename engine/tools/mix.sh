#!/bin/bash
# usage: bash engine/tools/mix.sh <episode>   -> <Name>.mp4 in the project root
# Mixes voice+music (vo/bed.wav) with the foley (out/fx_real.wav), normalises to -14 LUFS, then a limiter holds stray peaks under -2 dBFS, muxes with out/video.mp4.
set -e; ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; EP="$(cd "${1:?episode folder}" && pwd)"
NAME=$(python3 -c "import json,sys;c=json.load(open(sys.argv[1]));print(c.get('file',c['out']))" "$EP/episode.json"); FINAL="$ROOT/$NAME.mp4"
cd "$EP/out"; V=../vo/bed.wav
for f in $V fx_real.wav; do echo "== $f"; ffmpeg -hide_banner -nostats -i $f -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | head -2; done
ffmpeg -hide_banner -y -v error -i $V -i fx_real.wav -filter_complex "[0:a]aresample=48000[v];[1:a]volume=1.3[s];[v][s]amix=inputs=2:normalize=0:duration=longest" -c:a pcm_s16le mix_raw.wav
M=$(ffmpeg -hide_banner -nostats -i mix_raw.wav -af loudnorm=I=-14:TP=-3:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -y -v error -i mix_raw.wav -af "loudnorm=I=-14:TP=-3:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.8:attack=2:release=40:level=false,aresample=48000" -c:a pcm_s16le mix.wav
ffmpeg -hide_banner -y -v error -i video.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$FINAL"
echo "== final $FINAL"; ffmpeg -hide_banner -nostats -i "$FINAL" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | head -2
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size -of compact "$FINAL"
