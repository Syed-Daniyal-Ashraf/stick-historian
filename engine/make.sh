#!/bin/bash
# usage: engine/make.sh <episode>   e.g. engine/make.sh mo
# Joins the shared toon kit (engine/toon/*.js) with the episode's own props and shots, then builds ../<out>.html
set -e; cd "$(dirname "$0")/.."; EP="${1:?episode folder}"; EP="${EP%/}"
cat engine/toon/*.js $( [ -f "$EP/src/props.js" ] && echo "$EP/src/props.js" ) "$EP/src/shots.js" > "$EP/src/scenes.js"
python3 engine/build_episode.py "$EP" | tail -1
