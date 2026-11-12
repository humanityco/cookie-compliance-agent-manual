---
title: Add a cookie consent banner to a Docusaurus site
description: Add the Cookie Compliance snippet through headTags in docusaurus.config as two synchronous script entries, and add analytics through the scripts option where the banner holds recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Docusaurus site

**In short:** add the **live** snippet to `headTags` in `docusaurus.config.js` as two `script` entries (the options inline, then the library). Keep both tags synchronous.

Confirmed on a Docusaurus site: with `headTags`, the banner tags are among the first scripts in the built page's `<head>`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-docusaurus) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `docusaurus.config.js` (`docusaurus.config.ts` in a TypeScript project).

## Where it goes

1. Copy the live snippet (see above).
2. In `docusaurus.config.js`, add both tags to `headTags`, keeping the order:

   ```js
   const config = {
     // ...
     headTags: [
       {
         tagName: 'script',
         attributes: {},
         innerHTML: 'var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };',
       },
       {
         tagName: 'script',
         attributes: { src: 'https://cdn.hu-manity.co/v2/hu-banner.min.js', type: 'text/javascript', charset: 'utf-8' },
       },
     ],
     // analytics goes in `scripts`, which renders after the entries above
     scripts: ['https://www.googletagmanager.com/gtag/js?id=G-XXXX'],
   }
   ```

3. Build with `npm run build`, serve the build, and check the page source.

Docusaurus adds one tiny inline script of its own first. The banner tags follow it, ahead of the stylesheet and the site bundle. Docusaurus minifies the inline options (`appID:"YOUR_APP_ID"` with unquoted keys), so check by the AppID, not by matching your pasted text.

A plain string entry in the `scripts` option (`scripts: ['https://cdn.hu-manity.co/v2/hu-banner.min.js']`) renders as a plain synchronous tag and also works, as long as the options go in `headTags` and the entry has no `async: true`. `headTags` for both is the simplest to read.

Keep the library tag synchronous: use `headTags` with no `async: true`. A plugin that returns the tags as `preBodyTags` renders them inside `<body>`, so use `headTags` there as well.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): after Docusaurus's own small inline script, the `huOptions` script and `hu-banner.min.js` are the next two `<script>` tags in `<head>`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Add analytics through `scripts`.** Docusaurus's built-in `gtag` option writes its tag ahead of `headTags`, wherever the plugins are listed, so it runs before the banner. Add Google Analytics through the `scripts` option instead: it renders after the banner, which holds recognised trackers such as Google Analytics until the visitor chooses, in regions whose rule requires consent first.
- **Check the built site.** View the page source of what `npm run build` produces and serves, because that is what visitors get.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
