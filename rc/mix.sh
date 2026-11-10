set -e
cd "$(dirname "$0")/out"
V=../vo/bed.wav
# 1) loudness of each stem (sanity: effects must sit well under the voice)
for f in $V sfx.wav; do echo "== $f"; ffmpeg -hide_banner -nostats -i $f -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | head -2; done
# 2) mix and measure (pass 1)
FC="[0:a]aresample=48000[v];[1:a]volume=1.0[s];[v][s]amix=inputs=2:normalize=0:duration=longest"
ffmpeg -hide_banner -y -v error -i $V -i sfx.wav -filter_complex "$FC" -c:a pcm_s16le mix_raw.wav
M=$(ffmpeg -hide_banner -nostats -i mix_raw.wav -af loudnorm=I=-14:TP=-3:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
# 3) pass 2: linear loudness normalisation to -14 LUFS, true peak <= -1.5 dBTP
ffmpeg -hide_banner -y -v error -i mix_raw.wav -af "loudnorm=I=-14:TP=-3:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" -c:a pcm_s16le mix.wav
# 4) mux
ffmpeg -hide_banner -y -v error -i video.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest ../../Receipts-01-Sick-Log.mp4
echo "== final"; ffmpeg -hide_banner -nostats -i ../../Receipts-01-Sick-Log.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | head -2
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels:format=duration,size,bit_rate -of compact ../../Receipts-01-Sick-Log.mp4
