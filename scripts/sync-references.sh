#!/usr/bin/env bash
# Copies cookbooks into each skill's references/ folder, so an installed skill
# works offline. Cookbooks are the only source: never edit skills/*/references/.
# Each skill lists the cookbooks it needs in references.txt, one filename per line.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"

for list in "$root"/skills/*/references.txt; do
  skill="$(dirname "$list")"
  rm -rf "$skill/references"
  mkdir -p "$skill/references"
  while IFS= read -r name || [ -n "$name" ]; do
    [ -z "$name" ] && continue
    cp "$root/cookbooks/$name" "$skill/references/$name"
  done < "$list"
  echo "synced $(basename "$skill")"
done
