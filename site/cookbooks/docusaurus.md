---
title: Add a cookie consent banner to a Docusaurus site
description: Add the Cookie Compliance snippet through headTags in docusaurus.config as two script entries. The scripts option works only without async: true, and a plugin preBodyTags entry lands in the body.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Docusaurus site

**In short:** add the **live** snippet to `headTags` in `docusaurus.config.js` as two `script` entries (the options inline, then the library). Not `async: true`, and not a plugin's `preBodyTags`, which renders in the body.

Tested with Docusaurus 3.10.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-docusaurus) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `docusaurus.config.js`.

## The wrong way

```js
// docusaurus.config.js — BAD
scripts: [{ src: 'https://cdn.hu-manity.co/v2/hu-banner.min.js', async: true }],
```

`async: true` lets the browser run the library whenever it likes. Another wrong way is a plugin that returns the tags as `preBodyTags` from `injectHtmlTags`: those render inside `<body>`, after everything in `<head>`.

## The right way

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
     // add analytics through `scripts` (below), which renders after these
   }
   ```

3. Build with `npm run build`, serve the build, and check the page source.

Docusaurus also writes one small inline script of its own into `<head>`: it only registers a handler that checks the site's base URL and loads nothing. The banner tags come directly after it, ahead of the stylesheet and the site bundle. Docusaurus minifies the inline options (`appID:"YOUR_APP_ID"` with unquoted keys), so check by the AppID, not by matching your pasted text.

A plain string entry in the `scripts` option (`scripts: ['https://cdn.hu-manity.co/v2/hu-banner.min.js']`) renders as a plain synchronous tag and also works, as long as the options go in `headTags` and the entry has no `async: true`. `headTags` for both is the simplest to read.

## Check it works

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): after Docusaurus's own small inline script, the `huOptions` script and `hu-banner.min.js` are the next two `<script>` tags in `<head>`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#check-it-works) in a private window (banner shows, no tracking cookies or data hits before the visitor chooses, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Do not use the built-in `gtag` (or `googleAnalytics`) option of the classic preset for your analytics.** That plugin writes its tag into `<head>` **before** your `headTags`, so analytics runs before the banner, and listing your own plugin first does not change that. Add the analytics tag through the `scripts` option instead (it renders after `headTags`), and put any `gtag('config', …)` call in a `headTags` entry after the banner entries.
- **Check the built site.** View the page source of what `npm run build` produces and serves, because that is what visitors get.
- **Remove any other consent banner.** Two banners give visitors two conflicting choices.
- **Only install your own AppID**, and re-copy the snippet after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
