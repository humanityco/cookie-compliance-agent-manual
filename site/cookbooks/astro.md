---
title: Add a cookie consent banner to an Astro site
description: Put the Cookie Compliance snippet first in the Astro layout's <head>, with is:inline on every script tag so Astro keeps the tags exactly as written.
kind: platform
last_verified: 2026-09-29
---

# Add a cookie consent banner to an Astro site

**In short:** paste the **live** snippet as the first scripts in the shared layout's `<head>`, and add `is:inline` to **every** Cookie Compliance `<script>` tag so Astro keeps them as written.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-astro) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the shared layout (`src/layouts/Layout.astro`, or whatever every page renders through).

## Where it goes

Astro processes a `<script>` tag by default: it bundles the tag and loads it as a deferred module. `is:inline` tells Astro to leave a tag exactly as written, which is what the banner needs, because `huOptions` is a synchronous inline script that `hu-banner.min.js` reads when it runs. Add `is:inline` to each Cookie Compliance tag in the shared layout:

```astro
---
// src/layouts/Layout.astro
---
<html lang="en">
  <head>
    <!-- Cookie Compliance: FIRST scripts on the page (paste live snippet here) -->
    <script is:inline>
      var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
    </script>
    <script is:inline src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
    <!-- A new app. If the live snippet has no /v2/, the app is on v1 — keep that URL. -->

    <slot name="head" />
  </head>
  <body><slot /></body>
</html>
```

Add `is:inline` to your existing trackers too, wherever they are declared (this layout, a page, a component), so each tag renders exactly as you wrote it and the placement you check is the placement visitors get.

If the snippet is currently in the `<body>`, in a component, or has no `is:inline`, move it to the top of the shared layout's `<head>` and add `is:inline` to each tag.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site: banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow. Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. Astro-specific extra:

| # | Check | Result |
|---|---|---|
| A1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are literal `<script>` elements, as the first two scripts, in order. A tag Astro had bundled would show as `<script type="module" src="...?astro&type=script...">`. |
| A2 | Grep the layout for every Cookie Compliance `<script>` tag | Each one has `is:inline`. |

## Gotchas

- **`is:inline` on every tag.** Without `is:inline`, Astro bundles a script as a deferred module, so it no longer runs in page order. With `is:inline` on each Cookie Compliance tag they stay literal `<script>` elements, which View Source confirms.
- **Add `is:inline` explicitly.** Astro leaves some tags unprocessed depending on their attributes (for example an explicit `type="text/javascript"`), so setting `is:inline` on each tag gives the same result whichever attributes the snippet carries.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard; the layout does not auto-update.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
