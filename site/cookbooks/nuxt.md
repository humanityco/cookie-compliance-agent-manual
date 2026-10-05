---
title: Add Cookie Compliance to a Nuxt site
kind: platform
last_verified: 2026-09-29
---

# Add Cookie Compliance to a Nuxt site

**In short:** paste the **live** snippet into `app.head.script` in `nuxt.config.ts` — not a `useHead()` call inside a page or component, and not inside a client-only plugin — and never mark any script in that array `async`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-nuxt) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `nuxt.config.ts`.

## The wrong way

```ts
// plugins/analytics.client.ts — BAD
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      { innerHTML: 'var huOptions = { "appID": "YOUR_APP_ID", "blocking": true };' },
      { src: 'https://cdn.hu-manity.co/hu-banner.min.js' }
    ]
  })
})
```

Problems: a `.client.ts` plugin only runs in the browser, after hydration — by then any tracker declared statically in `nuxt.config.ts` has already had its chance to run. Client-side injection is always too late for pre-consent blocking, in Nuxt as in any framework.

## The right way

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

Prefer pasting the exact HTML string's two pieces (the `huOptions` object and the CDN `src`) from MCP/dashboard rather than retyping `huOptions` keys by hand — the live snippet may carry Consent Mode defaults, `blockingEngine`, or custom providers you'd otherwise drop.

## Gotchas

- **Array order is not render order — `async` silently reorders scripts.** Nuxt's head manager (`unhead`) does not always emit `app.head.script` entries in the order you wrote them. A script marked `async: true` can be hoisted **ahead of** scripts that appear earlier in the array, even a synchronous Cookie Compliance snippet. **Verified 2026-09-29:** with a tracker script listed after Cookie Compliance but marked `async: true`, the rendered response had the tracker's `<script>` tag **first** — ahead of `huOptions` and `hu-banner.min.js`. Removing `async` restored array order in the response. **Never mark any script in this array `async` or `defer`** if you need Cookie Compliance to stay first; verify with View Source, not by trusting the config file.
- **`useHead()` inside a page or component is not equivalent to `app.head` in `nuxt.config.ts`.** It runs as part of that component's setup, on a schedule Nuxt controls, not necessarily before every other script on the page. Use the static config, not a composable, for the banner.
- **A `.client.ts` plugin is always too late.** See "The wrong way" above.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard; `nuxt.config.ts` does not auto-update.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Nuxt-specific extra:

| # | Check | Pass |
|---|---|---|
| N1 | View source (not devtools' rendered DOM) on `/` and an inner route | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first two `<script>` tags, in that order, with no `async`/`defer`. |
| N2 | Grep `app.head.script` in `nuxt.config.ts` | No entry — Cookie Compliance's or a tracker's — has `async` or `defer`, per the gotcha above. |

**Verified 2026-09-29** against a local Nuxt 4 dev server, a real (non-production) test AppID, and a real `googletagmanager.com/gtag/js` tag as the tracker, in a fresh isolated browser context: the tracker script rendered with `type="javascript/blocked"` and no tracking cookie (`_ga`) appeared before consent, matching the shared `verify-install` checklist's check 3.
