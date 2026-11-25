---
title: Microsoft Clarity with Cookie Compliance
description: Place the Clarity snippet below the Cookie Compliance snippet so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# Microsoft Clarity with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste the Clarity snippet below it. The banner holds the recognised Clarity loader until the visitor allows Ad Personalisation, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your Clarity project ID and the tracking code from the Clarity portal.
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Microsoft's docs say to paste Clarity into the `<head>`. With Cookie Compliance installed, keep the banner snippet first, then paste Clarity below it.

Paste the tracking code exactly as the Clarity portal gives it. It is an inline block that loads Clarity's tag from `clarity.ms/tag/`, which is the address the banner recognises.

## What the order controls

The banner recognises `clarity.ms/tag/` and `/clarity.js` and holds them under category **4 Ad Personalisation** by default. The whole inline block is held when it names that address. In regions whose rule requires consent first, Clarity waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the Clarity snippet after it. Before choosing, in a region whose rule requires consent first, `_clck` and `_clsk` are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, those cookies appear. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Microsoft Consent Mode on (Professional plan).** The Clarity loader then loads straight away with a denied signal until the visitor chooses. Judge by the cookies (`_clck`, `_clsk`), not by whether the loader request appears. See [Microsoft UET / Clarity Consent Mode](https://cookie-compliance.co/guides/microsoft-uet-clarity-consent-mode/).
- **A script above the banner snippet** runs straight away. Keep Clarity below the Cookie Compliance snippet.

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
