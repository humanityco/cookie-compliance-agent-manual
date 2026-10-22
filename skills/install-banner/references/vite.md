---
title: Add a cookie consent banner to a Vite app (React or Vue)
description: Put the Cookie Compliance snippet in index.html as classic scripts ahead of the module entry. React and Vue single-page apps share this file. Next.js, Nuxt and SvelteKit have their own pages.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to a Vite app (React or Vue)

**In short:** paste the **live** snippet into `<head>` of `index.html`, as classic `<script>` tags, ahead of the `<script type="module">` that boots the app. React (`src/main.tsx`) and Vue (`src/main.ts`) use this same file.

This page is for a Vite single-page app. [Next.js](nextjs.md), [Nuxt](nuxt.md) and [SvelteKit](sveltekit.md) build on Vite or their own bundler and need their own file.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-vite) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the project's `index.html` (the file next to `vite.config`).

## The wrong way

```tsx
// src/main.tsx — BAD. The Vue equivalent is onMounted() in src/main.ts or App.vue.
import { useEffect } from 'react';

export function Banner() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.hu-manity.co/v2/hu-banner.min.js';
    document.head.appendChild(s);
  }, []);
  return null;
}
```

The browser parses `index.html` before the app module runs. A script created from `main.tsx`, `main.ts`, `useEffect`, or Vue's `onMounted` is absent from that first document, so any classic tracker tag already in `index.html` has run.

## The right way

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

**Verified 2026-10-22** on Vite 8.3.5, with the React and Vue templates from create-vite 9.3.1. In both production builds the inline `huOptions` tag, the banner tag, and an `async` tracker written after them stayed in that order, with their attributes unchanged. Vite moved the app entry from the end of `<body>` up into `<head>`, still `type="module"`, and still after those three tags. An `async` tracker was left where it was written — Vite did not hoist it ahead of the snippet.

## Gotchas

- **The module entry in `<head>` is expected.** After `vite build` it may sit in `<head>` as `<script type="module" src="/assets/….js">`. It has to stay a module, and the Cookie Compliance tags have to stay ahead of it, as classic scripts.
- **Keep `async` and `defer` off the banner tags.** A tracker that must stay behind the snippet stays a later classic script too. Confirm the order in the built `index.html`, which is the file the browser parses.
- **React and Vue share this recipe.** `useEffect`, `react-helmet`, Vue's `onMounted`, and a head helper called from the app all run inside the module.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard. `index.html` does not auto-update.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Vite-specific extra:

| # | Check | Pass |
|---|---|---|
| V1 | View source (not devtools' rendered DOM), and the built `dist/index.html` | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. The app bundle may follow them as `type="module"`. |
| V2 | `index.html` versus `src/main.tsx` / `src/main.ts` | The two tags are in `index.html`. The app entry does not create them. |

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
- [Next.js](nextjs.md), [Nuxt](nuxt.md), [SvelteKit](sveltekit.md) — those apps have a different document shell.
