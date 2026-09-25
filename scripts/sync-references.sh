#!/usr/bin/env bash
# Copies cookbooks into each skill's references/ folder, so an installed skill
# works offline. Cookbooks are the only source: never edit skills/*/references/.
# Each skill lists the cookbooks it needs in references.txt, one filename per line.
#
#   scripts/sync-references.sh          rebuild every skill's references/
#   scripts/sync-references.sh --check  exit 1 if any references/ is out of date (for CI)
set -euo pipefail
shopt -s nullglob
root="$(cd "$(dirname "$0")/.." && pwd)"
check=false
[ "${1:-}" = "--check" ] && check=true
stale=0

for list in "$root"/skills/*/references.txt; do
  skill="$(dirname "$list")"
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  chmod 755 "$tmp"
  while IFS= read -r name || [ -n "$name" ]; do
    name="${name%$'\r'}"
    [ -z "$name" ] && continue
    cp "$root/cookbooks/$name" "$tmp/$name"   # fails (set -e) before anything is replaced
  done < "$list"

  if $check; then
    if ! diff -r "$tmp" "$skill/references" >/dev/null 2>&1; then
      echo "stale: $(basename "$skill")/references"
      stale=1
    fi
    rm -rf "$tmp"
  else
    rm -rf "$skill/references"
    mv "$tmp" "$skill/references"
    echo "synced $(basename "$skill")"
  fi
done

exit $stale
