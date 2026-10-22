---
title: Add a cookie consent banner to an Angular app
description: Put the Cookie Compliance snippet in src/index.html as the first classic scripts. Entries in the angular.json scripts array are emitted deferred at the end of body.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to an Angular app

**In short:** paste the **live** snippet into `<head>` of `src/index.html`, as the first classic `<script>` tags on every page. Leave the `scripts` array in `angular.json` for other files.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-angular) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `src/index.html`. That file is the document shell for `ng build` and for the prerendered page.

## The wrong way

```json
// angular.json — BAD
"scripts": [
  "src/cookie-compliance.js"
]
```

The application builder bundles that entry and injects it at the **end of `<body>`** with `defer`. **Verified 2026-10-22** on Angular 21.2 (`@angular/core` 21.2.25, `@angular/build` 21.2.27), in both the development and production builds: a file listed in `scripts` became `<script src="scripts-….js" defer></script>`, immediately before `<script src="main-….js" type="module">`. `defer` runs after the document has been parsed, so a classic tracker tag already in `index.html` has run first.

A tag created from a component, `Renderer2`, or an `APP_INITIALIZER` runs with `main.js`. It is in the same late slot.

## The right way

Put the live snippet at the top of `<head>` in `src/index.html`. Plain `<script>` tags. The builder leaves tags that are already in this file where you wrote them.

```html
<!doctype html>
<html lang="en">
<head>
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
  <app-root></app-root>
</body>
</html>
```

Prefer pasting the exact HTML from MCP/dashboard rather than retyping `huOptions` keys — the live snippet may carry Consent Mode defaults, `blockingEngine`, or custom providers.

**Verified 2026-10-22:** those head tags, with a tracker tag written after them in the same `<head>`, were still the first scripts in the production `index.html`. The build added no `async`, `defer`, or `type="module"` to them. The prerendered production page kept that same order.

## Gotchas

- **`angular.json` `scripts` is a deferred body bundle.** See "The wrong way". Global polyfills belong there. The banner belongs in `src/index.html`.
- **Application code runs with `main.js`.** That bundle is `type="module"` at the end of `<body>`.
- **Server rendering uses this `index.html`.** The prerendered page is the same document with `<app-root>` filled in. After `ng build`, open the file the server will send and confirm the two tags are still the first scripts.
- **Engine switch:** re-paste the live snippet when `widgetVersion` changes in the dashboard. `index.html` does not auto-update.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Angular-specific extra:

| # | Check | Pass |
|---|---|---|
| A1 | View source (not devtools' rendered DOM) on `/` | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. |
| A2 | `src/index.html` and `angular.json` | The two tags are in `src/index.html`. The `scripts` array does not list the banner. |

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
