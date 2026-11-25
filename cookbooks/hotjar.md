---
title: Hotjar with Cookie Compliance
description: Place the Hotjar snippet below the Cookie Compliance snippet so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# Hotjar with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste the snippet from Hotjar below the banner snippet. The banner holds the recognised Hotjar loaders until the visitor allows Site Optimisation, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- The Hotjar tracking code from your Hotjar site settings.
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Paste the snippet from Hotjar below the banner snippet. Keep the Cookie Compliance snippet as the first script in `<head>`; the Hotjar code stays under it. Shape (paste Hotjar's own snippet; it names the addresses below):

```html
<!-- Cookie Compliance snippet first, then Hotjar's snippet: -->
<script>
  /* Hotjar's tracking code — loads static.hotjar.com / script.hotjar.com */
</script>
```

## What the order controls

The banner recognises `static.hotjar.com` and `script.hotjar.com` and holds them under category **3 Site Optimisation** by default. The whole inline block is held when it names that address. In regions whose rule requires consent first, the snippet waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the Hotjar snippet after it. Before choosing, in a region whose rule requires consent first, the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, the script runs. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Confirm by the Elements panel.** `type="javascript/blocked"` on the held script shows that the banner has it.
- **A script above the banner snippet** runs straight away. Keep Hotjar below the Cookie Compliance snippet.

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
