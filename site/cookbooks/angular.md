---
title: Add a cookie consent banner to an Angular app
description: Put the Cookie Compliance snippet first in the head of src/index.html as classic script tags, above your analytics tags, so the banner can hold them until the visitor chooses.
kind: platform
last_verified: 2026-10-22
---

# Add a cookie consent banner to an Angular app

**In short:** paste the **live** snippet as the first classic `<script>` tags in the `<head>` of `src/index.html`, above your analytics tags. That file is the shell of every page, so the banner is there on every route.

Confirmed on an Angular app: tags written in `src/index.html` stay where you put them in both the development and production builds, and in the prerendered page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-angular) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `src/index.html`. That file is the document shell for `ng build` and for the prerendered page.

## Where it goes

1. Copy the live snippet (see above).
2. Open `src/index.html`.
3. Paste the snippet at the top of `<head>`, as plain `<script>` tags. The builder leaves tags that are already in this file where you wrote them. (Entries in the `scripts` array of `angular.json` are bundled and added deferred at the end of `<body>`, so use that array for other files.)

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

If the snippet is currently in the `scripts` array of `angular.json`, or added from a component, move it to the top of `<head>` in `src/index.html`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Run the browser checks in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) with `verify-install` (`skills/verify-install/SKILL.md`) against the running site. Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. Angular-specific extra:

| # | Check | Pass |
|---|---|---|
| A1 | View source (not devtools' rendered DOM) on `/` | `huOptions` and the `hu-banner.min.js` (or `/v2/…`) tag are the first `<script>` tags, in that order, with no `async`, `defer`, or `type="module"`. |
| A2 | `src/index.html` and `angular.json` | The two tags are in `src/index.html`, and the `scripts` array holds your other files. |

## Gotchas

- **`angular.json` `scripts` is a deferred body bundle.** The application builder bundles each entry and adds it with `defer` at the end of `<body>`, so use it for global polyfills and keep the banner in `src/index.html`.
- **Application code runs with `main.js`.** That bundle is `type="module"` at the end of `<body>`, so a tag created from a component, `Renderer2` or an `APP_INITIALIZER` loads at that point. Keep the banner in `src/index.html`.
- **Server rendering uses this `index.html`.** The prerendered page is the same document with `<app-root>` filled in. After `ng build`, open the file the server will send and confirm the two tags are still the first scripts.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard (`widgetVersion`): changing the setting alone does not update a pasted snippet in `index.html`.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
