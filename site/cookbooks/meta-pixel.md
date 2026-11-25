---
title: Meta Pixel with Cookie Compliance
description: Place the Meta Pixel below the Cookie Compliance snippet so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# Meta Pixel with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste the Meta Pixel below it. The banner holds the recognised Facebook loader until the visitor allows Ad Personalisation, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your Meta Pixel ID and the Pixel code from Meta Events Manager.
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Meta's docs place the Pixel between the `<head>` tags. With Cookie Compliance installed, keep the banner snippet first, then paste the Pixel below it.

Paste the Pixel base code exactly as Events Manager gives it. It is an inline block that loads `fbevents.js` from `connect.facebook.net`, followed by a `<noscript>` image fallback.

## What the order controls

The banner recognises `connect.facebook.net` (`fbevents.js`) and holds it under category **4 Ad Personalisation** by default. The whole inline block is held when it names that address. In regions whose rule requires consent first, the Pixel waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the Pixel after it. Before choosing, in a region whose rule requires consent first, `_fbp` (and `_fbc` once available) are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, those cookies appear. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Meta Consent Mode on (Professional plan).** The `connect.facebook.net` loader then loads straight away with a denied signal until the visitor chooses. Judge by the cookies (`_fbp`, `_fbc`), not by whether the loader request appears. See [Meta Pixel cookie consent](https://cookie-compliance.co/guides/meta-pixel-cookie-consent/).
- **A script above the banner snippet** runs straight away. Keep the Pixel below the Cookie Compliance snippet.

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
