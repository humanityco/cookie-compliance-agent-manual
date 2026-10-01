---
title: Add Cookie Compliance to an Astro site
kind: platform
last_verified: 2026-09-29
---

# Add Cookie Compliance to an Astro site

**In short:** paste the **live** snippet into the shared layout's `<head>`, and add `is:inline` to **every** Cookie Compliance `<script>` tag. Without it, Astro silently rewrites the tags into deferred Vite modules — the banner may still render, but `blocking` no longer holds.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (correct v1 or `/v2/` URL already included). No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-astro) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the shared layout (`src/layouts/Layout.astro`, or whatever every page renders through).

## The wrong way

```astro
---
// src/layouts/Layout.astro — BAD
---
<html lang="en">
  <head>
    <script>
      var huOptions = { "appID": "YOUR_APP_ID", "blocking": true };
    </script>
    <script src="https://cdn.hu-manity.co/hu-banner.min.js"></script>
    <slot name="head" />
  </head>
  <body><slot /></body>
</html>
```

This looks identical to the plain-HTML version, and that's the trap. **Astro processes every `<script>` tag by default** — even one with a real `src` URL — bundling and hoisting it through its own module graph, unless the tag has `is:inline` or any attribute other than `src`. The result renders as `<script type="module" src="/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts">`: a deferred module, not the synchronous inline script `huOptions` has to be for `hu-banner.min.js` to read it before running.

**Verified 2026-09-29:** pasting the exact two-tag live snippet with no `is:inline` produced exactly this — the `huOptions` script became a deferred Vite module, and a bare third `<script src="...">` tracker tag (no `type` attribute, matching a typical GA4/gtag snippet) was *also* rewritten into a second deferred module. Only the Cookie Compliance CDN tag survived unprocessed, because it happened to carry an explicit `type="text/javascript"` attribute — which is incidental, not something to rely on.

## The right way

Add `is:inline` to **every** script tag you want Astro to leave completely alone, in the shared layout:

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
    <script is:inline src="https://cdn.hu-manity.co/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
    <!-- If the live snippet says /v2/hu-banner.min.js, use that URL instead. -->

    <slot name="head" />
  </head>
  <body><slot /></body>
</html>
```

Existing trackers, wherever they're declared (this layout, a page, a component), need `is:inline` too if you want their tag to render exactly as written — otherwise Astro may still bundle them, which doesn't defeat blocking on its own but does mean you're no longer looking at the tag you wrote when you check placement.

**Verified 2026-09-29:** with `is:inline` on all three tags, the rendered response had all three as literal `<script>` elements in source order, none converted to a module.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Astro-specific extra:

| # | Check | Pass |
|---|---|---|
| A1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are literal `<script>` elements — **not** `<script type="module" src="...?astro&type=script...">` — as the first two scripts, in order. |
| A2 | Grep the layout for every Cookie Compliance `<script>` tag | Each one has `is:inline`. |

**Verified 2026-09-29** against a live local Astro dev server, a real (non-production) test AppID, and a real `googletagmanager.com/gtag/js` tag as the tracker, in a fresh isolated browser context: with `is:inline` in place, the tracker rendered `type="javascript/blocked"` and no tracking cookie appeared before consent — matching the shared `verify-install` checklist's check 3.

## Gotchas

- **`is:inline` is not optional cleanup — it's the difference between working and silently broken.** Astro's default script processing doesn't remove the banner or make it error; the page still looks fine and the badge-free banner still shows. The only visible symptom is that blocking stops working, which is exactly the kind of failure that survives a casual glance.
- **A `<script>` with an unusual `type` may already be exempt, but don't rely on it.** In testing, a tag with `type="text/javascript"` happened to pass through unprocessed while a bare `<script src="...">` did not. Add `is:inline` explicitly rather than depending on which attributes currently happen to opt a tag out.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard; the layout does not auto-update.
