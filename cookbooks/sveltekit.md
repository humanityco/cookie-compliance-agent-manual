---
title: Add a cookie consent banner to a SvelteKit app
description: Put the Cookie Compliance snippet first in the head of src/app.html, above %sveltekit.head% and your analytics tags, as classic script tags, so the banner can hold them until the visitor chooses.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to a SvelteKit app

**In short:** paste the **live** snippet into `<head>` of `src/app.html`, above `%sveltekit.head%`, as classic `<script>` tags. That shell is the first HTML for every route, including when server rendering is off. Use `app.html` rather than `onMount` or `<svelte:head>`, which load later.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-sveltekit) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `src/app.html`.

## Where it goes

Put the live snippet in `src/app.html`, above `%sveltekit.head%`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- Paste LIVE snippet from install.getSnippet / Integrations — first scripts -->
    <script>
      var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
    </script>
    <script
      src="https://cdn.hu-manity.co/v2/hu-banner.min.js"
      type="text/javascript"
      charset="utf-8"
    ></script>
    <!-- A new app. If the live snippet has no /v2/, the app is on v1 — keep that URL. -->
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

Prefer pasting the exact HTML from MCP/dashboard rather than retyping `huOptions` keys — the live snippet may carry Consent Mode defaults, `blockingEngine`, or custom providers.

Confirmed on a SvelteKit app, on `/` and on an inner route, in the dev server and in the production build: those tags are the first `<script>` elements, with no `async`, `defer` or `type="module"` added. The same holds with `ssr` set to `false`.

If the snippet is currently in `<svelte:head>` or created from `onMount`, move it to `src/app.html`, above `%sveltekit.head%`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Run the browser checks in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) with `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. SvelteKit-specific extra:

| # | Check | Pass |
|---|---|---|
| S1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. `modulepreload` links may follow them. |
| S2 | `src/app.html` | The two tags sit above `%sveltekit.head%`. |

## Gotchas

- **`%sveltekit.head%` stays below the snippet.** Production inserts `<link rel="modulepreload">` tags at that placeholder. They do not run code, so leave them there and keep the snippet above them.
- **The app boots from an inline script in `<body>`** (`%sveltekit.body%`). It is a classic inline script that then imports the client entry, so it runs after the head tags.
- **`<svelte:head>` is inserted at `%sveltekit.head%`**, after every script written above that placeholder, and `onMount` runs in the browser after the page has loaded. With `export const ssr = false`, `<svelte:head>` content is added in the browser. Keep the banner in `src/app.html`, which is in the first response either way.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard (`widgetVersion`): changing the setting alone does not update a pasted snippet in `app.html`.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
