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

1. `account.previewDesignChange` with `AppID` and the `design` object from step 2. Requires a signed-in connection on the account address `https://mcp.cookie-compliance.co/mcp/account`. Sign in: see [`connect.md`](../../connect.md). Read the returned before/after: a field with `fromState: "not_set"` means the banner is currently on its built-in default, not that it was blank by choice — say so if you show this to the owner.
2. Show the before/after to the site owner and get their agreement — this changes what every visitor sees. (Exception: `install-banner` in Autopilot applies it without asking on an app it created in that same install, which has no visitors yet.)
3. `account.updateDesign` with the same `AppID`, the same `design` object, and the `previewToken` from step 1. Pass `publish: false` first to confirm the call succeeds without touching the live banner (`published: false`, `consentReIssued: false` in the result), then re-run with `publish: true` (the default) once the owner has agreed.

Do **not** add a `design` block to the snippet from `install.getSnippet`. It would style the banner for a fraction of a second and then revert, which looks like an intermittent bug rather than a setting.

`account.updateDesign` refuses any compliance-determinative field (blocking, consent categories, geolocation rules, consent mode, GPC, expiry) — those go through the `configure-regions` skill instead.

## 4. When the design keys are not enough: CSS in the site's own stylesheet (v2 banner)

Anything a design key covers — the banner's colours, text sizes, button corner roundness — goes through step 3. Use CSS only for what no key covers (a different font for the banner, text alignment, hiding the site name, lifting the banner above a sticky footer or chat bar), or to style one element differently from the rest (for example, square corners on the level buttons only). For those, add CSS to the **site's own stylesheet** (WordPress: Appearance → Customize → **Additional CSS**, or the theme's `style.css`). The banner is part of the page (no iframe, no shadow root), so the site's CSS reaches it. Never put CSS or a `design` block in the install snippet.

**Check the engine first.** This section is for the v2 banner. With the banner open (from its round reopen icon, or in a new private window), the v2 banner has `#hu .hu-panel` in the page and the v1 banner has `#hu-cookies-content`. The script address (`/v2/hu-banner.min.js` for v2) is a second check — a script-combining optimizer can remove that tag from the page source. The v1 banner uses different class names; these selectors do nothing there.

**Write every rule as `body #hu .hu-…`.** The banner's own rules sit under the `#hu` root id and its stylesheet loads late, so a class alone (`.hu-heading`), `#hu .hu-heading` placed in `<head>`, or a tag selector (`#hu h2`) can lose, depending on the v2 version the site runs. `body #hu .hu-…` beats the banner's general rules from `<head>` or `<body>` on every v2 version. A few layout rules carry more weight (for example the compact bar's text alignment), so if a rule still does not take, add `!important`. A site theme rule that uses `!important` beats the banner; only your own, more specific `!important` fixes that.

| Want | CSS |
|---|---|
| A different font in the banner only (it uses the site's body font by default) | `#hu.hu-wrapper { font-family: Georgia, serif; }` |
| Left-aligned heading and message (standard style) | `body #hu .hu-heading, body #hu .hu-body { text-align: left; }` |
| Centred message on the compact bar | `#hu .hu-body { text-align: center !important; }` |
| Square corners on the level buttons only | `body #hu .hu-levels .hu-level { border-radius: 4px; }` |
| Hide the site name in the top row | `body #hu .hu-site-url { visibility: hidden; }` |
| Lift the banner above a sticky footer or chat bar (bottom banners; on phones every banner is a bottom band) | `body #hu.hu-position-bottom { bottom: 80px; } @media (max-width: 600px) { body #hu.hu-wrapper { bottom: 80px; } }` — never plain `body #hu { bottom: … }`: on a top or centre banner it stretches an invisible box over the page that blocks clicks |
| Recolour the keyboard focus ring (already on by default) on all four parts | `body #hu :focus-visible, body #hu .hu-level:focus-within, body #hu-revoke :focus-visible, body #hu-passive :focus-visible, body .hu-iframe-overlay :focus-visible { outline-color: #005fcc; }` |

Three more parts sit **outside** `#hu`, so a rule under `#hu` does not reach them: the round icon that reopens the banner (`#hu-revoke`), the Global Privacy Control notice (`#hu-passive`), and the notice over a blocked video or map (`.hu-iframe-overlay`). Use the same pattern with their root, e.g. `body #hu-revoke .hu-revoke-button { … }`.

Do not use CSS to hide, cover or shrink the level buttons, Customize, the close button, the category switches or the privacy-policy link — a visitor who cannot reach a choice cannot refuse. Do not remove the focus ring (`outline: none`). If you change a colour with CSS, the contrast check from step 2 no longer covers it — prefer the design keys.

## Verified

`demo.suggestDesign`, `account.previewDesignChange` and `account.updateDesign` (with `publish: false`) were called live against a real (non-production, no-visitor) test app on 2026-09-29, confirming: the derived key set and contrast report shape above, that an unset field previews as `fromState: "not_set"` rather than a false before-value, and that `publish: false` saves a draft with `consentReIssued: false` and does not touch the live banner.

Every selector in step 4 was checked in a real browser on 2026-10-13 against the v2 banner, with the CSS placed in `<head>` where WordPress prints Additional CSS — the harder spot, because a rule there loses any tie that the same rule at the end of `<body>` would win.
