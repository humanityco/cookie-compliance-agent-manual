---
name: configure-regions
description: Turn on region detection for a Cookie Compliance banner and explain how visitors are treated by region (GDPR in the EU, CCPA in California, and so on). Use when asked to set up region rules, turn on geolocation-based consent, configure GDPR/CCPA/other regulations, or "make the banner behave differently by country." On the New banner the laws are built in; per-country settings are made by the owner in the dashboard.
---

# Configure region rules

MCP tool names below are written `account.previewComplianceChange`; some clients list them as `account_previewComplianceChange`.

## GDPR starter

A new app leaves region detection, Consent Mode and Global Privacy Control off (GDPR is its declared law on Classic; on the New banner, once region detection is on, every law applies by place). Ask the site owner once whether to turn the starter on. Apply it only after they accept. An earlier request to "make the site compliant" is not that answer.

Read `subscriptionType` from `account.createApp` or from `account.getDesign` (`meta.subscriptionType`).

On **Pro**, preview then commit exactly:

```json
{"geolocation": true, "googleConsentMode": true, "facebookConsentMode": true, "microsoftConsentMode": true, "gpcSupportMode": true}
```

Leave `geolocationMethod` unset. It is already `automatic`. On the New banner that is the **Managed** method: once region detection is on, the banner's own law table decides each place (GDPR for the EU, the EEA and Switzerland, UK PECR for the UK, CCPA in California, the other US states, and Brazil, Canada and South Africa), and it also asks first in further places from our country research. Do not send `geolocationRules` or `regulations`: the New banner does not read them.

On **Free** (`Basic`, or any value other than `Pro`), the live banner keeps region detection off and keeps Meta and Microsoft Consent Mode off. Apply only:

```json
{"googleConsentMode": true}
```

Global Privacy Control is a Professional setting, so it is part of the Pro starter above and not this one.

Say, in the same question, that region detection and the Meta and Microsoft signals stay off on the Free plan, and that Global Privacy Control is a Professional feature. Do not change `regulations` or any consent-mode map. This does not make the site legally compliant.

The preview is the write. If it reports a deletion or a warning the owner did not accept, stop and show it.

## 1. Check the engine first

Find the engine from the status check in [`verify-install`](../verify-install/SKILL.md) step 0 (`data.WidgetVersion`: `"v2"` is the New banner; anything else is Classic), or from the `engine` field of `account.explainRegion`. `account.getDesign` does not return it. A new app normally starts on the New banner.

| | New banner | Classic banner |
|---|---|---|
| Which laws apply | Built in: every law is on, by place. `regulations` is ignored. | `config.regulations.<key>` declares them |
| What a region gets | The banner's law table. Places no law covers get **Default for other places**. | `config.geolocationRules[]` (see step 3) |
| Region detection | `config.geolocation` (boolean) | `config.geolocation` (boolean) |
| Method | `geolocationMethod` `automatic` = Managed: the law table plus the places from our country research. Manual also applies the owner's own per-country settings. | `automatic` serves the built-in rules; `manual` uses the stored rules |

Read the app's current values with `account.getDesign` before changing anything: they live under `config.*`. To see what one visitor gets, call `account.explainRegion` (step 6).

## 2. Declaring applicable regulations (Classic banner only)

**Classic banner only.** The New banner keeps every law on and never reads `regulations`; writing it there changes nothing a visitor sees.

On Classic, `account.previewComplianceChange` then `account.updateComplianceConfig` with, for example, `{"regulations": {"gdpr": true, "ccpa": true}}`. This **merges** against whatever the app already has stored: setting `lgpd` in a later call does not erase `gdpr`/`ccpa`. See Verified below.

## 3. Per-region behavior

### New banner

On the New banner an EU visitor and a California visitor are already treated differently by the built-in law table once `geolocation` is on, and `geolocationRules` is not read. Do not set `geolocationMethod` to `manual` on a New app: these tools refuse it, because Manual drops the extra places Managed asks first in. Switching to Manual is done by the owner in the dashboard (Configuration → Laws), which carries those places into their Opt-in list.

**On the New banner, the law table shapes the banner whether or not the script blocking engine is on.** The Do Not Sell link follows the visitor's place (it shows for US visitors and not elsewhere); the privacy policy link and the Update consent icon follow the app's own switches. With region detection on, the banner shows in every place unless the owner chose No banner for it (step 6). The engine is off on a WordPress site with the plugin's **Script blocking engine** setting off and on every page a logged-in WordPress administrator views, so an administrator sees the visitors' banner but not its blocking: with the engine off nothing is held. The WordPress plugin's **Autoblocking** setting does not switch region rules off. A Free plan site past its visit limit is also engine-off, and the live banner keeps region detection off on the Free plan on both engines (see the GDPR starter above).

### Classic banner: `geolocationRules`, and its one real hazard

On a Classic app, to treat an EU visitor differently from a California visitor, turn on `geolocation: true`, set `geolocationMethod: "manual"` (see step 4 for why), and send the **full** `geolocationRules` array: one entry per regulation name, each with its own `display` / `revoke` / `blocking` / `privacy` / `doNotSell` booleans:

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

On Classic, `privacy` and `doNotSell` show or hide the privacy-policy link and the Do Not Sell link for that region's visitors, and a rule's flag wins over the app's **Privacy Policy Link** or **Do Not Sell Link** switch in the dashboard. Where no rule applies (for example geolocation is off, or the visitor matches no rule; see below), the switch alone decides. Make sure each link has a URL and link text. Send both flags on every entry: the two banner engines treat a missing flag differently.

**On Classic, this array replaces wholesale; it is never merged.** Sending only the `gdpr` entry silently deletes every other region's rules. `account.previewComplianceChange` warns about this at preview time, but nothing warns you at commit time, so read the preview. Always fetch the app's current `geolocationRules` with `account.getDesign` first, edit only the one entry you mean to change, and send the **whole list** back.

On Classic, valid `name`s are the same seven keys as `regulations.*` above, plus `other`: the rule for visitors who match no other enabled rule. US visitors are the exception: outside California they match `otherus` only when it is enabled, and otherwise get no rule at all, so `other` does not cover them. `other` is kept whatever `regulations` says, so keep it in the list.

## 4. Location method: Managed or Manual

**New banner.** `automatic` is **Managed** (the default): with region detection on, the law table decides each place, plus the places from our country research. Per-country settings the owner made are ignored on Managed. **Manual** applies the owner's own per-country settings on top of the law table (Professional plan, region detection on). These tools do not switch a New app to Manual; the owner does it on the Laws page, and the dashboard then adds the research places to their Opt-in list so they stay asked first.

**Classic banner.** `automatic` is the default. The Cookie Compliance server replaces whatever `geolocationRules` you last stored with its built-in default matrix on every live read, so your custom per-region rules never reach a visitor. **Set `geolocationMethod: "manual"` in the same change** if you want the array in step 3 to actually take effect.

## 5. The Classic legacy fallback

**On the Classic banner only**, if `geolocationRules` or `regulations` is empty, the widget falls back to three flat buckets instead: `geolocationEUblocking` / `geolocationUSblocking` / `geolocationORblocking` (plus matching `*display` / `*dontsell` / `*privacy` / `*revoke` keys), and in that fallback, **CCPA and "other US" visitors get the exact same treatment**. The New banner ignores these flat keys and `geolocationRules` too; it uses the built-in law table (step 4). If a site owner wants California treated differently from the rest of the US on Classic, `geolocationRules` (step 3) is the only way; the legacy booleans can't express it.

## 6. Per-country settings (New banner, owner's choice)

The Laws page (Configuration → Laws, section **Countries**) lists every country, Quebec, California, and every US state and DC, and shows what a visitor from each place gets. On the Manual method (Professional plan, region detection on) the owner can set a place to **Opt-in** (recognised scripts wait for the visitor's choice), **Opt-out** (scripts run until the visitor refuses) or **No banner**, and choose what **Default for other places** gives where no law applies (Opt-out unless the owner chooses Opt-in; for a business based in the EU, the EEA, Switzerland or the UK, that law covers every visitor, so the default does not apply). Opt-out and No banner are not available for the EU, EEA, Switzerland, the UK or the US, so a US state can only be set to Opt-in; Opt-out also has no effect where another law applies (every law is on, so in Brazil, Canada and South Africa too), or for a business based in the EU, EEA, Switzerland or the UK. The settings are read from the app's live settings, and they apply once the visitor's location is known.

Which of these a site uses is a legal choice for the owner: set them in the dashboard, and do not propose them. These tools do not write them. Until a visitor's location is known, the visitor is asked first (with region detection on). Region detection off means every visitor gets the same banner. On a Classic app the dashboard offers a **Switch to New engine** button for these settings.

To see what one place gets for one app, call `account.explainRegion` with the AppID and a place such as `DE`, `US-CA` or `CA-QC`. It also says whether the app's stored per-country settings are in force.

## Verified

Verified on a real test site on 2026-09-29 (Classic banner), with every result confirmed against the stored configuration, not just the tool's response:

- `regulations.gdpr`/`ccpa` written, then `regulations.lgpd` written alone: the stored draft ends up with all three set. Writes to `regulations.*` merge.
- `geolocationRules` written with 2 entries, then with a 1-entry list: the dropped entry is gone from the stored draft. Writes to `geolocationRules` replace the whole list.

Steps 4 and 5, and the link-flag and engine-off notes in step 3, describe the documented behaviour of the server and the banner and were not part of that test. The New-banner statements (steps 1, 3, 4 and 6) describe documented behaviour of the banner and the dashboard and have not been browser-verified here. Re-check them if either changes.
