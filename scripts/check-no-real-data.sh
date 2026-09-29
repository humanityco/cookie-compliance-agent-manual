#!/usr/bin/env bash
# Fails if a tracked file contains a real-looking Cookie Compliance AppID, or a
# URL whose domain isn't on the allowlist below. Mechanizes the repo rule
# (README.md "Contributing"): no real AppIDs, customer domains, or personal
# data — use placeholders such as YOUR_APP_ID and example.com.
#
#   scripts/check-no-real-data.sh   run locally or in CI; exits 1 and lists
#                                   every offending file:line on failure.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

# Cookie Compliance AppIDs look like <slugified-domain>-<7 lowercase hex chars>
# (e.g. localhost-7619d3a). This one string is the illustrative example the
# cookbooks show on purpose to demonstrate the shape — everything else that
# matches the shape is either a real AppID or something that looks enough like
# one to be worth a human's eyes.
APPID_ALLOWLIST=(
  "examplecom-1a2b3c4"
)

# Domains allowed to appear inside a URL: our own product surfaces, the
# WordPress plugin listing, the one third-party vendor the GTM cookbook
# names, and the standard non-customer placeholders.
DOMAIN_ALLOWLIST=(
  "cookie-compliance.co"
  "mcp.cookie-compliance.co"
  "cdn.hu-manity.co"
  "hu-manity.co"
  "wordpress.org"
  "www.googletagmanager.com"
  "github.com"
  "example.com"
  "example.org"
  "example.net"
  "localhost"
)

fail=0

is_allowed() {
  local needle="$1"; shift
  local item
  for item in "$@"; do
    [ "$needle" = "$item" ] && return 0
  done
  return 1
}

files=()
while IFS= read -r -d '' f; do files+=("$f"); done < <(git ls-files -z -- ':!:scripts/check-no-real-data.sh')

while IFS=: read -r file line match; do
  [ -z "${match:-}" ] && continue
  if ! is_allowed "$match" "${APPID_ALLOWLIST[@]}"; then
    echo "real-looking AppID: $file:$line: $match"
    fail=1
  fi
done < <(grep -onE '\b[a-z][a-z0-9]{1,30}-[0-9a-f]{7}\b' "${files[@]}" 2>/dev/null || true)

while IFS=: read -r file line url; do
  [ -z "${url:-}" ] && continue
  domain="$(printf '%s' "$url" | sed -E 's#^https?://##; s#[/:].*$##' | tr 'A-Z' 'a-z')"
  if ! is_allowed "$domain" "${DOMAIN_ALLOWLIST[@]}"; then
    echo "domain not on the allowlist: $file:$line: $domain (add it to DOMAIN_ALLOWLIST in $(basename "$0") if it's legitimate)"
    fail=1
  fi
done < <(grep -onE 'https?://[a-zA-Z0-9.-]+' "${files[@]}" 2>/dev/null || true)

if [ "$fail" -eq 1 ]; then
  echo
  echo "See README.md 'Contributing': no real AppIDs, customer domains, or personal data."
  exit 1
fi

echo "check-no-real-data: clean"
