# Stick Historian: project for Claude Code

## First time
1. Install Python 3.10+, Node 18+, git and ffmpeg.
   - Windows: use WSL, or run the setup steps manually in Git Bash.
   - Mac: `brew install python node git ffmpeg`.
2. In this folder, run `bash scripts/setup.sh`. It installs everything and downloads about 1.3 GB: the voice model plus the free CC0 sound libraries.
3. Start Claude Code in this folder (`claude`). It reads `CLAUDE.md` automatically.

## Good first prompts
- "Read CLAUDE.md and ENGINE.md, then run engine/make.sh mo and render a contact sheet so I can see it works."
- "Make the Philippines story (mock Battle of Manila, 1898) as a new episode using mo/ as the template. Script first, then style frames, then a draft export at low resolution."

Watch every draft yourself with sound on before asking for the final.
