---
title: Add a cookie consent banner to a Vite app (React or Vue)
description: Put the Cookie Compliance snippet first in the head of index.html as classic script tags, ahead of the module entry and your analytics tags. React and Vue single-page apps share this file. Next.js, Nuxt and SvelteKit have their own pages.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to a Vite app (React or Vue)

**In short:** paste the **live** snippet into `<head>` of `index.html`, as classic `<script>` tags, ahead of the `<script type="module">` that boots the app. React (`src/main.tsx`) and Vue (`src/main.ts`) use this same file.

This page is for a Vite single-page app. [Next.js](nextjs.md), [Nuxt](nuxt.md) and [SvelteKit](sveltekit.md) build on Vite or their own bundler and need their own file.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-vite) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the project's `index.html` (the file next to `vite.config`).

## Where it goes

Put the live snippet in `<head>` of `index.html`, above the module entry. In the source that entry is `<script type="module" src="/src/main.tsx">` (React) or `src="/src/main.ts"` (Vue). Leave it as a module.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Example</title>
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
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Vue uses `<div id="app">` and `/src/main.ts`. The snippet is the same.

Prefer pasting the exact HTML from MCP/dashboard rather than retyping `huOptions` keys — the live snippet may carry Consent Mode defaults, `blockingEngine`, or custom providers.

Confirmed on Vite React and Vue apps: in the production build the `huOptions` tag and the banner tag keep their order and attributes, and a tracker tag written after them stays after them. Vite moves the app entry into `<head>` as `type="module"`, after those tags.

If the snippet is currently created from `main.tsx`, `main.ts`, `useEffect` or Vue's `onMounted`, move it to the top of `<head>` in `index.html`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Run the browser checks in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) with `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. Vite-specific extra:

| # | Check | Pass |
|---|---|---|
| V1 | View source (not devtools' rendered DOM), and the built `dist/index.html` | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. The app bundle may follow them as `type="module"`. |
| V2 | `index.html` versus `src/main.tsx` / `src/main.ts` | The two tags are in `index.html`, and the app entry leaves them to it. |

## Gotchas

- **The module entry in `<head>` is expected.** After `vite build` it may sit in `<head>` as `<script type="module" src="/assets/….js">`. Leave it as a module and keep the Cookie Compliance tags ahead of it, as classic scripts.
- **Keep the banner tags as plain classic scripts**, without `async` or `defer`, and keep your trackers as later classic scripts. Confirm the order in the built `index.html`, which is the file the browser parses.
- **React and Vue share this recipe.** `useEffect`, `react-helmet`, Vue's `onMounted`, and a head helper called from the app all run inside the module, so keep the banner in `index.html`.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard (`widgetVersion`): changing the setting alone does not update a pasted snippet in `index.html`.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
- [Next.js](nextjs.md), [Nuxt](nuxt.md), [SvelteKit](sveltekit.md) — those apps have a different document shell.
