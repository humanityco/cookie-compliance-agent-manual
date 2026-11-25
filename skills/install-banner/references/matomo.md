---
title: Matomo with Cookie Compliance
description: Place Matomo below the Cookie Compliance snippet — mark the standard inline snippet, or load matomo.js with a normal script src — so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# Matomo with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then add Matomo below it. A normal `<script src=".../matomo.js">` is recognised on its own; Matomo's standard inline snippet builds the file name in pieces, so mark that block yourself.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your Matomo site ID and the tracking code from Matomo (self-hosted or Matomo Cloud).
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Matomo's docs place the code just after the opening `<body>` tag or within `<head>`. Either spot is fine as long as it stays below the banner snippet.

**Normal external file** (recognised on its own):

```html
<!-- Cookie Compliance snippet first, then: -->
<script src="https://example.com/matomo.js" async defer></script>
```

**Standard inline snippet** (builds the file name in pieces — mark it):

```html
<script class="hu-block" data-hu-category="3">
  var _paq = window._paq = window._paq || [];
  /* … Matomo's inline tracker that assembles matomo.js … */
</script>
```

## What the order controls

A script file named `matomo.js` is recognised under category **3 Site Optimisation** by default. The standard inline snippet builds the file name in pieces, so mark it `class="hu-block" data-hu-category="3"` (see [trackers](trackers.md#marking-a-script-yourself)). In regions whose rule requires consent first, Matomo waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, Matomo after it (or just after `<body>`). Before choosing, in a region whose rule requires consent first, `_pk_id` and `_pk_ses` are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, those cookies appear. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Matomo Tag Manager or another file name** (for example `piwik.js`) is not on the built-in list. Add its address as your own Autoblocking pattern, or mark the script with `data-hu-category`.
- **A script above the banner snippet** runs straight away. Keep Matomo below the Cookie Compliance snippet.

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
