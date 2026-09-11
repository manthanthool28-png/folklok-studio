#!/bin/bash
# Resize and re-encode photos in place. Uses sips (ships with macOS), so the
# project needs no image-processing dependency.
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/src/assets/photos"
MAX_PX=2000
QUALITY=72

shopt -s nullglob nocaseglob
files=("$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png "$DIR"/*.heic)

if [ ${#files[@]} -eq 0 ]; then
  echo "No photos in src/assets/photos/ yet — drop them in and run this again."
  exit 0
fi

total_before=0
total_after=0

for f in "${files[@]}"; do
  before=$(stat -f%z "$f")

  # HEIC straight off an iPhone won't render in browsers — convert to JPEG.
  case "${f##*.}" in
    heic|HEIC)
      out="${f%.*}.jpg"
      sips -s format jpeg -s formatOptions "$QUALITY" "$f" --out "$out" >/dev/null
      rm "$f"
      f="$out"
      ;;
  esac

  sips -Z "$MAX_PX" "$f" >/dev/null
  case "${f##*.}" in
    jpg|jpeg|JPG|JPEG)
      sips -s format jpeg -s formatOptions "$QUALITY" "$f" --out "$f" >/dev/null
      ;;
  esac

  after=$(stat -f%z "$f")
  total_before=$((total_before + before))
  total_after=$((total_after + after))
  printf "  %-42s %5s KB -> %5s KB\n" "$(basename "$f")" "$((before/1024))" "$((after/1024))"
done

echo
echo "Total: $((total_before/1024/1024)) MB -> $((total_after/1024/1024)) MB across ${#files[@]} files"
