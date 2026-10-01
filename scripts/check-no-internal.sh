#!/usr/bin/env bash
# Fails if a tracked file carries something internal to Hu-manity that must not be
# public: decision/finding IDs, ticket links, internal hosts and repos, database
# names, cloud account details, tokens, or staff/test email addresses.
# Companion to check-no-real-data.sh (that one covers AppIDs and customer domains).
#
#   scripts/check-no-internal.sh   run locally or in CI; exits 1 and lists
#                                  every offending file:line on failure.
#
# A line that genuinely needs a match (rare) may end with the marker
# `public-ok` plus a short reason, e.g. `<!-- public-ok: generic SQL example -->`.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

# label|extended regex (case-sensitive unless noted)
CHECKS=(
  "internal decision/finding ID|\b(DEC|HRN|MISS|CONF|OBS|L)-[0-9]{3}\b"
  "Azure DevOps link or work item|dev\.azure\.com|_workitems|\bAB#[0-9]+|\bADO ?#[0-9]+"
  "HelpScout ticket|secure\.helpscout\.net|\b(HS|ticket|conversation) ?#[0-9]{4,}"
  "internal host|stage-app\.hu-manity\.co|stage-mcp\.|dev-app\.hu-manity\.co|wpengine\.com|amazonaws\.com|\bec2-|elasticbeanstalk"
  "IP address|\b([0-9]{1,3}\.){3}[0-9]{1,3}\b"
  "AWS account or instance id|\b[0-9]{12}\b|\bi-[0-9a-f]{8,17}\b"
  "internal method|production database|prod DB|read-only production|this session\b"
  "internal repo or path|control-room|task-deck|Designer API|Account API|Transactional API|Web Channel_v2|cookie-notice-trunk|cookiecomplive|/home/[a-z]|repos/"
  "database or table name|ClientMeta|UserDesignJSON|BannerConfigJSON|\bRedshift\b|wp_mailster|phpMyAdmin|\"Application\"|\"Subscription\"|\"Account\"\."
  "token or secret|\bhu_[A-Za-z0-9]{16,}|\bAKIA[0-9A-Z]{16}\b|-----BEGIN [A-Z ]*PRIVATE KEY"
  "staff or test address|noble-wave\.com|@hu-manity\.co"
)

fail=0
files=$(git ls-files | grep -vE '^(scripts/check-no-internal\.sh|LICENSE)$')
for entry in "${CHECKS[@]}"; do
  label="${entry%%|*}"; regex="${entry#*|}"
  # shellcheck disable=SC2086
  hits=$(grep -nHE "$regex" $files 2>/dev/null | grep -v 'public-ok' || true)
  if [ -n "$hits" ]; then
    echo "✗ $label:"; echo "$hits" | sed 's/^/    /'; fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo
  echo "This repo is public. Remove the internal detail, or (only if it is genuinely"
  echo "public) end the line with a 'public-ok: <reason>' marker."
  exit 1
fi
echo "✓ no internal identifiers found"
