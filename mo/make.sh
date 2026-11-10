#!/bin/bash
set -e; cd "$(dirname "$0")"
cat src/p0_base.js src/p1_rig.js src/p2_world.js src/p3_*.js src/p4_shots.js 2>/dev/null > src/scenes.js || cat src/p0_base.js src/p1_rig.js src/p2_world.js src/p4_shots.js > src/scenes.js
cd .. && python3 engine/build_episode.py mo | tail -1
