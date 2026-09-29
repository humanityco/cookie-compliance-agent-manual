---
name: configure-regions
description: Set which privacy regulations apply to a Cookie Compliance banner and how it treats visitors differently by region (GDPR in the EU, CCPA in California, and so on). Use when asked to set up region rules, turn on geolocation-based consent, configure GDPR/CCPA/other regulations, or "make the banner behave differently by country."
---

# Configure region and regulation rules

MCP tool names below are written `account.previewComplianceChange`; some clients list them as `account_previewComplianceChange`.

## 1. Two separate decisions — don't conflate them

| Decision | Setting | What it does |
|---|---|---|
| Which laws apply to this site at all | `config.regulations.<key>` — `gdpr`, `ccpa`, `otherus`, `ukpecr`, `lgpd`, `pipeda`, `popia` (all boolean) | A site-wide declaration. Not visitor-specific by itself. |
| Whether visitors get different treatment depending on where they are | `config.geolocation` (boolean) + `config.geolocationMethod` (`automatic`\|`manual`) + `config.geolocationRules[]` | Turns on visitor-location-based branching and defines what each region gets. |

Read the app's current values first with `account.getDesign` before changing either — both live under `config.*`, and step 3 below depends on it.

## 2. Declaring applicable regulations — safe to merge

`account.previewComplianceChange` then `account.updateComplianceConfig` with, for example, `{"regulations": {"gdpr": true, "ccpa": true}}`. This **merges** against whatever the app already has stored: setting `lgpd` in a later call does not erase `gdpr`/`ccpa`. See Verified below — this was a real bug until 2026-09-29.

## 3. Per-region behavior — `geolocationRules`, and its one real hazard

To actually treat an EU visitor differently from a California visitor, turn on `geolocation: true`, set `geolocationMethod: "manual"` (see step 4 for why), and send the **full** `geolocationRules` array — one entry per regulation name, each with its own `display` / `revoke` / `blocking` / `privacy` / `doNotSell` booleans:

```json
{
  "geolocation": true,
  "geolocationMethod": "manual",
  "geolocationRules": [
    {"name": "gdpr", "display": true, "revoke": true, "blocking": true, "privacy": true, "doNotSell": false},
    {"name": "ccpa", "display": true, "revoke": true, "blocking": false, "privacy": false, "doNotSell": true}
  ]
}
```

**This array replaces wholesale — it is never merged.** Sending only the `gdpr` entry silently deletes every other region's rules. `account.previewComplianceChange` warns about this at preview time, but nothing warns you at commit time, so read the preview. Always fetch the app's current `geolocationRules` with `account.getDesign` first, edit only the one entry you mean to change, and send the **whole list** back.

Valid `name`s are the same seven keys as `regulations.*` above.

## 4. `geolocationMethod: "automatic"` silently discards your custom rules

`automatic` is the default. In automatic mode, Designer API overwrites whatever `geolocationRules` you last stored with its own built-in default matrix on every live read — your custom per-region rules never reach a visitor. **Set `geolocationMethod: "manual"` in the same change** if you want the array in step 3 to actually take effect.

## 5. The legacy fallback, and why it matters even if you never touch it

The widget only uses `geolocationRules` when it's non-empty **and** `regulations` is also non-empty. If either is empty, it falls back to three flat buckets instead — `geolocationEUblocking` / `geolocationUSblocking` / `geolocationORblocking` (plus matching `*display` / `*dontsell` / `*privacy` / `*revoke` keys) — and in that fallback, **CCPA and "other US" visitors get the exact same treatment**. If a site owner wants California treated differently from the rest of the US, `geolocationRules` (step 3) is the only way; the legacy booleans can't express it.

## Verified

Live-tested against a real (non-production, no-visitor) test app on 2026-09-29, `publish:false` throughout, with results confirmed by reading the actual stored row rather than trusting a response body:

- `regulations.gdpr`/`ccpa` written, then `regulations.lgpd` written alone — confirmed via a direct read-only production database read (not just `account.previewComplianceChange`, which compares against the *live* config and can't see draft state) that the stored draft ends up with all three (`gdpr`, `ccpa`, `lgpd`) set. Proves the merge; this was a real bug that erased siblings until it was fixed on 2026-09-29.
- `geolocationRules` written with 2 entries, then overwritten with a 1-entry list — the same direct database read confirmed the dropped entry (`ccpa`) is gone from the stored draft, not merely masked. Proves the replace-wholesale behavior.

Not independently browser-verified this session — grounded in reading the current Designer API and Web Channel source, not a live behavioral test: the `automatic`-mode override in step 4, and the widget's region-matching fallback in step 5. Re-check both against source if either surface changes.
