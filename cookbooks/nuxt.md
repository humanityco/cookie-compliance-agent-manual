---
title: Add a cookie consent banner to a Nuxt site
description: Put the Cookie Compliance snippet first in app.head.script in nuxt.config.ts, as plain synchronous entries, so it renders at the top of the page's head.
kind: platform
last_verified: 2026-09-29
---

# Add a cookie consent banner to a Nuxt site

**In short:** paste the **live** snippet as the first entries of `app.head.script` in `nuxt.config.ts`, as plain synchronous scripts (no `async` or `defer` on any entry in that array).

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-nuxt) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `nuxt.config.ts`.

## Where it goes

Put the live snippet in `app.head.script` in `nuxt.config.ts`. This is resolved at server-render time and lands in the initial HTML response, the same way a root layout's `<head>` does in other frameworks.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          innerHTML: 'var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };',
          type: 'text/javascript'
        },
        {
          src: 'https://cdn.hu-manity.co/v2/hu-banner.min.js',
          // A new app. If the live snippet has no /v2/, the app is on v1 — keep that URL.
          type: 'text/javascript'
        },

        // Existing trackers stay below, unchanged:
        { src: 'https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID' }
      ]
    }
  }
})
```

Prefer pasting the exact HTML string's two pieces (the `huOptions` object and the CDN `src`) from MCP/dashboard rather than retyping `huOptions` keys by hand: the live snippet may carry Consent Mode defaults, `blockingEngine`, or custom providers you would otherwise miss.

If the snippet is currently in a `useHead()` call or a `.client.ts` plugin, move it to `app.head.script` in `nuxt.config.ts`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site: banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow. Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. Nuxt-specific extra:

| # | Check | Result |
|---|---|---|
| N1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first two `<script>` tags, in that order, with no `async`/`defer`. |
| N2 | Grep `app.head.script` in `nuxt.config.ts` | Every entry, Cookie Compliance's and your trackers', is a plain synchronous script without `async` or `defer`. |

## Gotchas

- **Leave out `async` and `defer` in `app.head.script`.** Nuxt's head manager (`unhead`) moves an entry marked `async: true` ahead of entries listed earlier, including a synchronous Cookie Compliance snippet. Plain entries (no `async` or `defer`) render in the order you wrote them. Check the order with View Source of the response.
- **Use the static config for the banner.** `app.head` in `nuxt.config.ts` renders into the initial HTML. `useHead()` inside a page or component runs as part of that component's setup, after the config entries, so it suits page-specific tags; the banner belongs in the static config.
- **Keep the banner out of `.client.ts` plugins.** A `.client.ts` plugin runs in the browser after hydration, while `app.head.script` is in the server-rendered HTML.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard; `nuxt.config.ts` does not auto-update.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
