#!/usr/bin/env bash
# regenerate-hero.sh — makes the hero light + smooth + 1080p
# Run in WSL:  bash regenerate-hero.sh
# It regenerates ~120 optimized WebP frames + a 1080p looping fallback video + poster.

set -e
ROOT="/mnt/c/Users/HP/.gemini/antigravity/scratch/NAA"
cd "$ROOT"

# --- 1. Find the source merged video (edit SRC if it's elsewhere) ---
SRC=""
for c in assets/fvid.mp4 assets/fvid assets/references/fvid.mp4 references/fvid.mp4 assets/fvid.webm assets/hero.mp4; do
  [ -f "$c" ] && SRC="$c" && break
done
if [ -z "$SRC" ]; then
  echo "!! Source video not found. Edit this script and set SRC to your merged clip, e.g. SRC=\"assets/fvid.mp4\""
  exit 1
fi
echo "Source video: $SRC"

# --- 2. Ensure ffmpeg is installed ---
if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg not installed. Install it first:"
  echo "   sudo apt update && sudo apt install -y ffmpeg"
  exit 1
fi

FRAMES="assets/hero-frames"
mkdir -p "$FRAMES/_old_jpg_backup"
# move the old 300 JPGs out of the way (kept as backup)
mv "$FRAMES"/*.jpg "$FRAMES/_old_jpg_backup"/ 2>/dev/null || true
rm -f "$FRAMES"/frame-*.webp 2>/dev/null || true

# --- 3. Compute fps so we get ~120 frames across the clip ---
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
FPS=$(awk "BEGIN{f=120/$DUR; if(f<=0){f=15}; print f}")
echo "Clip duration: ${DUR}s  ->  extracting at ${FPS} fps (~120 frames)"

# --- 4. Extract ~120 WebP frames at 1920px wide (true 1080p), quality 78 ---
ffmpeg -y -i "$SRC" -vf "fps=${FPS},scale=1920:-2" -c:v libwebp -q:v 78 -compression_level 6 "$FRAMES/frame-%03d.webp"

# --- 5. Poster (first frame) for instant paint / fallback ---
ffmpeg -y -i "$SRC" -vframes 1 -vf "scale=1920:-2" -q:v 3 assets/hero-poster.jpg

# --- 6. Looping fallback video, 1080p, muted, web-optimized (mp4 + webm) ---
ffmpeg -y -i "$SRC" -vf "scale=1920:-2" -c:v libx264 -profile:v high -crf 24 -pix_fmt yuv420p -an -movflags +faststart assets/hero-1080.mp4
ffmpeg -y -i "$SRC" -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -an assets/hero-1080.webm

# --- 7. Report ---
echo "--------------------------------------------"
echo "WebP frames created: $(ls "$FRAMES"/frame-*.webp 2>/dev/null | wc -l)"
echo "Frames total size:   $(du -ch "$FRAMES"/frame-*.webp 2>/dev/null | tail -1 | cut -f1)"
du -h assets/hero-1080.mp4 assets/hero-1080.webm assets/hero-poster.jpg 2>/dev/null
echo "Old JPGs backed up in: $FRAMES/_old_jpg_backup  (delete once the WebP hero is confirmed working)"
echo "Done. Now hand the optimization prompt to Claude Code to wire these in."
