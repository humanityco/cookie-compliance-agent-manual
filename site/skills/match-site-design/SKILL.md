---
name: match-site-design
description: Make a Cookie Compliance consent banner look like the site it sits on — derive colours, corner style and text size from the site's own CSS and check WCAG AA contrast. Use when asked to style, restyle, theme or "match the brand" of a cookie/consent banner, or when a banner looks generic against the site.
---

# Match the banner to the site

MCP tool names below are written `demo.suggestDesign`; some clients list them as `demo_suggestDesign`.

## 1. Read the site's own colours — don't guess

Look at the site's actual CSS (not the page as rendered): the brand/accent colour used on primary buttons or links, and the page or header background colour. If the site is visibly dark-themed, note that too. Guessed hex values produce a banner that clashes; measured ones don't.

## 2. Derive a design — don't hand-write hex values

Call `demo.suggestDesign` with what you found:

```json
{"brand": {"brandColor": "#20c19e", "pageBackground": "#16202c", "cornerStyle": "rounded", "textScale": "medium"}}
```

It returns a `design.*` key set you can apply to a live app (`primaryColor`, `btnTextColor`, `bannerColor`, `textColor`, `headingColor`, `btnBorderRadius`, `textSize`, `headingSize` — it leaves out `spacingSize`, because a live app can't store it), the reasoning for each value, and a WCAG AA contrast check for banner body text, headings, and button labels — picking text colour by measured contrast against the two backgrounds, not by habit. If `contrastPassesAA` is false, do not override the colours it picked; that defeats the check that made it call `demo.suggestDesign` in the first place.

You can also pass `design` values you already have instead of `brand`, to validate them rather than derive new ones.

**`bannerOpacity`:** the widget default is `0.95`, so the contrast figures against the page background are approximate. If contrast has to be guaranteed, set `bannerOpacity: 1` in the same design object.

## 3. Apply it in the one place it works

**A design set on the page does nothing to a real banner.** `demo.suggestDesign`'s result says exactly where it applies:

| Where | What happens |
|---|---|
| A **preview** (`demo.generateSnippet`) | Applies exactly as given — a preview never fetches a configuration, so the page is the only source. |
| A **real installed banner** | Does **not** apply from the page. The widget fetches the app's published configuration and merges it over the page's own `huOptions`, key by key — anything set locally is overwritten a moment after the banner first renders. |

To restyle a **real** banner:

1. `account.previewDesignChange` with `AppID` and the `design` object from step 2. Requires an authenticated connection (`help.explainTokenSetup` if you don't have one). Read the returned before/after: a field with `fromState: "not_set"` means the banner is currently on its built-in default, not that it was blank by choice — say so if you show this to the owner.
2. Show the before/after to the site owner and get their agreement — this changes what every visitor sees.
3. `account.updateDesign` with the same `AppID`, the same `design` object, and the `previewToken` from step 1. Pass `publish: false` first to confirm the call succeeds without touching the live banner (`published: false`, `consentReIssued: false` in the result), then re-run with `publish: true` (the default) once the owner has agreed.

Do **not** add a `design` block to the snippet from `install.getSnippet`. It would style the banner for a fraction of a second and then revert, which looks like an intermittent bug rather than a setting.

`account.updateDesign` refuses any compliance-determinative field (blocking, consent categories, geolocation rules, consent mode, GPC, expiry) — those go through the `configure-regions` skill instead.

## Verified

`demo.suggestDesign`, `account.previewDesignChange` and `account.updateDesign` (with `publish: false`) were called live against a real (non-production, no-visitor) test app on 2026-09-29, confirming: the derived key set and contrast report shape above, that an unset field previews as `fromState: "not_set"` rather than a false before-value, and that `publish: false` saves a draft with `consentReIssued: false` and does not touch the live banner.
