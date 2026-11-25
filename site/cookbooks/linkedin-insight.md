---
title: LinkedIn Insight Tag with Cookie Compliance
description: Place the LinkedIn Insight Tag below the Cookie Compliance snippet so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# LinkedIn Insight Tag with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste the Insight Tag below it — in `<head>` or where LinkedIn places it. The banner holds the recognised Insight loader until the visitor allows Site Optimisation, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your LinkedIn Insight Tag partner ID and the tag code from Campaign Manager.
- Edit access to the template, theme or footer where the tag is added.

## Where it goes

LinkedIn prefers the tag right before the end of `<body>` in the global footer. That is fine: it is still below the banner snippet. You can also place it in `<head>` under the Cookie Compliance snippet. Paste the Insight Tag exactly as Campaign Manager gives it: it names the `insight.min.js` loader, and the banner holds the whole inline block because of that.

## What the order controls

The banner recognises the `insight.min.js` loader (`lms-analytics/insight.min.js`) and holds it under category **3 Site Optimisation** by default. The whole inline block is held when it names that address. In regions whose rule requires consent first, the tag waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, and the Insight Tag is below it (in `<head>` or before `</body>`). Before choosing, in a region whose rule requires consent first, the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, the script runs. The tag's cookies are mostly on LinkedIn's own domain, so confirm by the Elements-panel type, not the cookie jar. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Confirm by the Elements panel**, not first-party cookies — the Insight Tag's cookies mostly live on LinkedIn's domain.
- **A script above the banner snippet** runs straight away. Keep the Insight Tag below the Cookie Compliance snippet, even when it sits in the footer.

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
