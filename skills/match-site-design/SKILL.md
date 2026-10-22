---
name: match-site-design
description: Make a Cookie Compliance consent banner look like the site it sits on — derive colours, corner style and text size from the site's own CSS and check WCAG AA contrast, choose the banner font, and customise further with the supported CSS hooks. Use when asked to style, restyle, theme or "match the brand" of a cookie/consent banner, change its font, write custom CSS for it, or when a banner looks generic against the site.
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

It returns a `design.*` key set you can apply to a live app (`primaryColor`, `btnTextColor`, `bannerColor`, `textColor`, `headingColor`, `btnBorderRadius`, `textSize`, `headingSize` — it leaves out `spacingSize`, because a live app can't store it), the reasoning for each value, and a WCAG AA contrast check for banner body text, headings, and button labels — picking text colour by measured contrast against the two backgrounds, not by habit, and white button labels whenever white reaches 4.5:1 on the brand colour. Colours come back as 6-digit hex (`#RRGGBB`). If `contrastPassesAA` is false, do not override the colours it picked; that defeats the check that made it call `demo.suggestDesign` in the first place.

You can also pass `design` values you already have instead of `brand`, to validate them rather than derive new ones.

**`bannerOpacity`:** the widget default is `0.95`, so the contrast figures against the page background are approximate. If contrast has to be guaranteed, set `bannerOpacity: 1` in the same design object.

## 3. Apply it in the one place it works

**A design set on the page does nothing to a real banner.** `demo.suggestDesign`'s result says exactly where it applies:

| Where | What happens |
|---|---|
| A **preview** (`demo.generateSnippet`) | Applies exactly as given — a preview never fetches a configuration, so the page is the only source. |
| A **real installed banner** | Does **not** apply from the page. The widget fetches the app's published configuration and merges it over the page's own `huOptions`, key by key — anything set locally is overwritten a moment after the banner first renders. |

To restyle a **real** banner:

1. `account.previewDesignChange` with `AppID` and the `design` object from step 2. Requires a signed-in connection on the account address `https://mcp.cookie-compliance.co/mcp/account`. Sign in: see [`connect.md`](../../connect.md). Read the returned before/after: a field with `fromState: "not_set"` means the banner is currently on its built-in default, not that it was blank by choice — say so if you show this to the owner. The preview also reports `contrast` for body text and headings on the banner and button labels on the button, as the banner would look after the change, with a warning for any pair below WCAG AA (4.5:1; 3:1 for headings 24px or larger). It never refuses on contrast.
2. Show the before/after to the site owner, with any contrast warning, and get their agreement — this changes what every visitor sees, and the owner decides whether a low-contrast pair is acceptable. (Exception: `install-banner` in Autopilot applies it without asking on an app it created in that same install, which has no visitors yet.)
3. `account.updateDesign` with the same `AppID`, the same `design` object, and the `previewToken` from step 1, within 10 minutes of the preview (`previewTokenExpiresAt` in its result; after that, preview again). It publishes by default — that is the normal path once the owner has agreed. A design change never asks visitors for their consent again (`consentReIssued: false`).

**`publish: false`** saves the change as a draft and leaves the live banner alone. Re-running the same call with `publish: true` publishes it (the same `previewToken`, so still within the 10 minutes; after that, preview again) — but publishing puts the app's **whole** draft live, including any edits saved in the dashboard since the last publish, not just this change. The result lists those other values in a warning; pass it on to the owner.

**Colours must be 6-digit hex (`#RRGGBB`).** The banner ignores `#RGB`, `rgb()` and colour names and shows its default instead, so `account.previewDesignChange` refuses them for any colour you change. One exception: `bannerColor` accepts `rgb()`/`rgba()` with a warning, because the v2 banner shows white instead — prefer a hex `bannerColor` with `bannerOpacity`.

Do **not** add a `design` block to the snippet from `install.getSnippet`. It would style the banner for a fraction of a second and then revert, which looks like an intermittent bug rather than a setting.

**Free plan:** the live banner keeps the defaults for `btnBorderRadius`, `revokeMarginX`, `revokeMarginY`, `delayDisplay`, `delayTime` and `levelsOrder`, whatever the app stores. Button corners, the reopen icon's position, a delay before the banner appears and the order of the level buttons change on paid plans only, so do not promise them to a Free-plan owner.

`account.updateDesign` refuses any compliance-determinative field (blocking, consent categories, geolocation rules, consent mode, GPC, expiry) — those go through the `configure-regions` skill instead.

## 4. Customise beyond design settings

Anything a design key covers — colours, text sizes, button corners, the font — goes through step 3. For the rest, use CSS in the **site's own stylesheet**. The banner is part of the page (no iframe, no shadow root), so the site's CSS reaches it. Never put CSS or a `design` block in the install snippet.

The banner comes in two engines, set per site: **Classic** (v1) and **New** (v2). Everything in 4.1–4.5 works on both; where an engine differs, the text says so. Only 4.6 is engine-specific.

### 4.1 The font: `design.fontFamily`

Set it like any other design key (`account.previewDesignChange`, then `account.updateDesign`). The owner sees it in the dashboard under Configuration → Design → Typography → **Font**. Available on every plan.

| Value | Font |
|---|---|
| not set | the banner default: **Arial on Classic**; **the website's own font on New**. On both engines the notice over a blocked video or map uses the website's font for its text and Arial for its button |
| `"site"` | the website's own font |
| `"sans-serif"` | Arial, or the closest plain font on the device (the Classic default look) |
| `"serif"` | Georgia, or Times New Roman |
| `"system"` | the device's own interface font (San Francisco on Apple, Segoe UI on Windows, Roboto on Android) |

`null` goes back to the banner default. A named font such as `"Open Sans"` is not a value: `account.previewDesignChange` refuses it — use 4.5 instead. None of the four downloads a font: `"site"` uses the font the page already has, the others are fonts already on the device.

### 4.2 Where the CSS goes

| Platform | Location |
|---|---|
| WordPress, classic theme | Appearance → Customize → **Additional CSS** |
| WordPress, block theme | Appearance → Editor → Styles → ⋮ → **Additional CSS** |
| WordPress, child theme | the theme's `style.css` |
| Any other site | the site's main stylesheet, or a `<style>` in `<head>` |

The banner adds its own stylesheet at the end of `<head>`, so a rule exactly as specific as the banner's loses from `<head>`. The rule in 4.3 is chosen to win from anywhere.

### 4.3 Supported hooks — and how to make a rule win

These names are the same on both engines and are kept stable on purpose. Style only these if the CSS must keep working.

| Hook | What it is |
|---|---|
| `#hu` | the banner |
| `#hu .hu-heading` | the banner heading — on Classic also the headings in the banner's other panels (preferences, categories, levels) |
| `#hu .hu-body` | the banner message — on Classic also the text in those panels |
| `#hu .hu-site-url` | the site name in the top row (shown only when the toolbar is on; not shown on the New banner's Compact style) |
| `#hu-revoke`, `#hu-revoke .hu-revoke-button` | the round icon that reopens the banner after a choice |
| `#hu-passive`, `#hu-passive .hu-passive-heading`, `#hu-passive .hu-passive-body` | the notice shown when the banner honours a Global Privacy Control signal |
| `.hu-iframe-overlay`, `.hu-iframe-overlay .hu-iframe-content`, `.hu-iframe-overlay .hu-btn` | the notice over a blocked video or map, its text, and its button |
| `#hu.hu-position-top` / `-bottom` / `-left` / `-right` / `-center`, `#hu.hu-display-floating` / `-fixed` | the banner's position and display type from its design |
| `body.hu-visible` | the banner is showing |
| `body.hu-not-set` | the visitor has not chosen yet |
| `body.hu-cookies-accepted` | a consent record exists — the visitor's choice (any choice, including the most private one), or one applied automatically from a Global Privacy Control signal |

**Start every selector with `body #hu`** — or `body` plus the part's own root: `body #hu-revoke …`, `body #hu-passive …`, `body .hu-iframe-overlay …`. The banner's rules sit under its root id, and the extra `body` outweighs them from `<head>` or `<body>`. A class alone (`.hu-heading`) or a tag selector (`#hu h2`) loses.

- **`#hu` reaches only the banner.** The reopen icon, the Global Privacy Control notice and the blocked-video notice are separate roots; write a rule for each one you mean.
- **Size, spacing and alignment of the heading and message can need `!important`.** A few of the banner's layout rules are heavier (the heading's size and spacing on Classic; alignment and spacing on New's Compact style). For sizes, prefer the design keys.
- **Message colour and size: use the design keys** (`textColor`, `textSize`), not CSS. On Classic the message text inside `.hu-body` sets its own colour and size, so a rule on `.hu-body` may not change what the visitor sees, even with `!important`.
- **A site theme rule with `!important`** (for example `h2 { color: green !important; }`) beats the banner. Only the site's own, more specific `!important` fixes it: `body #hu .hu-heading { color: #434f58 !important; }`.
- **Keep `#hu` in front of any body class.** `.hu-cookies-accepted .x` alone also matches things outside the banner.

```css
body #hu .hu-heading { font-weight: 400; }
body #hu .hu-heading { color: #222; }
body #hu-revoke .hu-revoke-button { background: #c00; }
body #hu-passive .hu-passive-heading { color: #c00; }
```

### 4.4 Colours and sizes: variables on the root

Every colour and size design key is also a CSS variable named `--hu-<key>` (`--hu-primaryColor`, `--hu-textColor`, `--hu-bannerColor`, `--hu-headingSize`, `--hu-textSize`, `--hu-btnBorderRadius`, …). Set it **on a root**:

```css
#hu { --hu-primaryColor: #c00; --hu-btnColor: #c00; }  /* the banner, buttons included */
#hu, #hu-revoke, #hu-passive, .hu-iframe-overlay { --hu-primaryColor: #c00; --hu-btnColor: #c00; }  /* every part */
```

**To recolour buttons, set both `--hu-primaryColor` and `--hu-btnColor`.** On Classic, `--hu-primaryColor` on `#hu` recolours only the link-style buttons; the filled buttons follow `--hu-btnColor`. Set both to recolour the buttons on either engine.

Not on `:root` or `html`: the banner writes its own values directly on the `<html>` element, and those beat a stylesheet rule there. A variable set on `#hu` does not reach the other three parts. Your `--hu-bannerColor` replaces the banner's background opacity with a solid colour.

Prefer the design keys (step 3) when one exists: a colour changed by CSS is not covered by the contrast check, so check it yourself (4.5:1 for text).

### 4.5 A font that is not one of the four

**To use your own font, leave `fontFamily` unset (the banner default), then add this line to the site's stylesheet:**

```css
body #hu, body #hu .hu-btn, body #hu-passive, body #hu-revoke, body .hu-iframe-overlay .hu-btn { font-family: "Your Font", sans-serif; }
```

- Replace `"Your Font"` with a font **the site already loads**. Adding a new font service only for the banner adds a third-party request on every page.
- The line covers both engines: the banner, its buttons, the Global Privacy Control notice, the reopen icon and the blocked-video notice's button. That notice's text keeps the page's own font.
- Do not combine the line with a `fontFamily` setting: on Classic the setting wins and the line has no effect; on New the result is mixed fonts. Leave `fontFamily` unset (send `null` to clear it) when you use the line.
- Check in a new private window, and clear the cache of any caching or optimisation plugin. A published design change, such as unsetting `fontFamily`, can take up to an hour to reach returning visitors.

### 4.6 Not supported: engine-specific names (may change)

Everything not listed in 4.3 — the level buttons, the Customize panel, categories, links, toolbar icons — has different names on Classic and New, and **may change without notice**. CSS on these can stop working after an update. Use them only when the owner accepts that, and check the engine first: with the banner open (from the reopen icon, or in a new private window), New has `#hu .hu-panel` in the page and Classic has `#hu-cookies-content`. A script address containing `/v2/` is a second check (a script-combining optimizer can remove that tag from the page source).

| Want (New only — may change) | CSS |
|---|---|
| Square corners on the level buttons only | `body #hu .hu-levels .hu-level { border-radius: 4px; }` |
| Centred message on the Compact style | `#hu .hu-body { text-align: center !important; }` |
| Hide the site name, icons stay in place | `body #hu .hu-site-url { visibility: hidden; }` |
| Lift the banner above a sticky footer or chat bar (on phones every banner is a bottom band) | `body #hu.hu-position-bottom { bottom: 80px; } @media (max-width: 600px) { body #hu.hu-wrapper { bottom: 80px; } }` — never plain `body #hu { bottom: … }`: on a top or centre banner it stretches an invisible box over the page that blocks clicks |
| Recolour the keyboard focus ring (on by default) on all four parts | `body #hu :focus-visible, body #hu .hu-level:focus-within, body #hu-revoke :focus-visible, body #hu-passive :focus-visible, body .hu-iframe-overlay :focus-visible { outline-color: #005fcc; }` |

On New, `#hu .hu-btn` matches only the Customize button; old Classic CSS mostly matches nothing there.

### 4.7 What CSS must never do

The banner exists so a visitor can choose. Never use CSS to **hide, shrink, cover or fade out**: any consent choice (the level buttons, the category switches), the way to refuse (the most private level, and Save on Classic), Customize, the close button, the privacy-policy and other policy links, or the Global Privacy Control notice. No `display: none`, `visibility: hidden`, `opacity: 0`, `pointer-events: none`, off-screen positions or tiny sizes on any of them. Keeping the choices equally easy to see and use is the site owner's legal duty, and a choice a visitor cannot reach is a choice they cannot make. Do not remove the keyboard focus ring (`outline: none`); recolour it.

This is technical guidance on using the banner, not legal advice.

## Verified

`demo.suggestDesign`, `account.previewDesignChange` and `account.updateDesign` (with `publish: false`) were called live against a real (non-production, no-visitor) test app on 2026-09-29, confirming: the derived key set and contrast report shape above, that an unset field previews as `fromState: "not_set"` rather than a false before-value, and that `publish: false` saves a draft with `consentReIssued: false` and does not touch the live banner. Publishing a saved draft by re-running with `publish: true`, the colour-format refusal and the preview's contrast report came later and were not part of that test.

The hooks in 4.3 are pinned by an automated test on each engine, so renaming one fails a test instead of breaking a site's CSS. On both engines a real-browser test places the CSS in `<head>`, where WordPress prints Additional CSS — the harder spot, because a rule there loses any tie that the same rule at the end of `<body>` would win — and confirms that `body #hu .hu-heading { color }`, a colour variable on the root, and the font line in 4.5 apply; on Classic it also confirms that filled buttons follow `--hu-btnColor`. The recipes in 4.6 were checked in a real browser against the New engine on 2026-10-13.
