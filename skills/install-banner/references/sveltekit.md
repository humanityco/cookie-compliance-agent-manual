---
title: Add a cookie consent banner to a SvelteKit app
description: Put the Cookie Compliance snippet in src/app.html above %sveltekit.head%. A script in svelte:head is missing from the first response when SSR is off, and onMount runs after load.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to a SvelteKit app

**In short:** paste the **live** snippet into `<head>` of `src/app.html`, above `%sveltekit.head%`, as classic `<script>` tags. That shell is the first HTML for every route, including when server rendering is off.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-sveltekit) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `src/app.html`.

## The wrong way

```svelte
<!-- src/routes/+layout.svelte — BAD -->
<script>
  import { onMount } from 'svelte';
  onMount(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.hu-manity.co/v2/hu-banner.min.js';
    document.head.appendChild(s);
  });
</script>

<svelte:head>
  <script>
    var huOptions = { "appID": "YOUR_APP_ID", "blocking": true };
  </script>
  <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js"></script>
</svelte:head>
```

`onMount` runs in the browser after the document has loaded. **Verified 2026-10-22:** a script added there was absent from the HTML of every response.

`<svelte:head>` is inserted at `%sveltekit.head%`. On a server-rendered page it does appear in the first HTML, but after every script written above that placeholder — so a tracker already in `app.html` comes first. **Verified 2026-10-22** on SvelteKit 3.1.0: with `export const ssr = false` in `src/routes/+layout.ts`, the `<svelte:head>` script was absent from the first response, and so was the page body. The tags written in `app.html` were still there.

## The right way

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

**Verified 2026-10-22** on SvelteKit 3.1.0 (Vite 8.3.5), on `/` and on an inner route, in the dev server and in `vite preview` of the production build: those tags were the first `<script>` elements, and the build added no `async`, `defer`, or `type="module"`. The same held with `ssr` set to `false`.

## Gotchas

- **`%sveltekit.head%` stays below the snippet.** Production inserts `<link rel="modulepreload">` tags at that placeholder. They do not run code. Leave them there; moving the snippet below them puts it after anything else the placeholder emits.
- **The app boots from an inline script in `<body>`** (`%sveltekit.body%`). It stays under the head tags. It is a classic inline script that then imports the client entry.
- **`<svelte:head>` and `onMount` are the wrong slot.** See "The wrong way".
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard. `app.html` does not auto-update.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site. SvelteKit-specific extra:

| # | Check | Pass |
|---|---|---|
| S1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. `modulepreload` links may follow them. |
| S2 | `src/app.html` | The two tags sit above `%sveltekit.head%`. |

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
