---
title: Add a cookie consent banner to a Gatsby site
description: Put the Cookie Compliance snippet first in the head through gatsby-ssr.js (setHeadComponents, snippet first in the list) or a custom src/html.js, never setPostBodyComponents.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Gatsby site

**In short:** paste the **live** snippet as the **first two entries** of `setHeadComponents([...])` in `gatsby-ssr.js`, or as the first thing in `<head>` of a custom `src/html.js`. Not `setPostBodyComponents`, and not after your analytics entry.

Placement checked by building a stock Gatsby 5.16 project and reading the page it produces (not a live banner or blocking test).

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-gatsby) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `gatsby-ssr.js` (create it in the project root if it does not exist) or `src/html.js`.

## The wrong way

```js
// gatsby-ssr.js — BAD. setPostBodyComponents renders at the end of <body>:
// the page's other scripts run before the banner can hold them.
exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([ /* the banner snippet */ ])
}
```

Also wrong: `setHeadComponents([analyticsTag, ...bannerSnippet])`. Gatsby keeps the order of the array, so the analytics tag runs first.

## The right way

1. Copy the live snippet (see above).
2. In `gatsby-ssr.js`, put the two banner tags **first** in the array you pass to `setHeadComponents`:

   ```js
   const React = require("react")

   exports.onRenderBody = ({ setHeadComponents }) => {
     setHeadComponents([
       // Cookie Compliance: first entries (use the live snippet's values)
       <script key="hu-options" dangerouslySetInnerHTML={{ __html:
         'var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };' }} />,
       <script key="hu-banner" src="https://cdn.hu-manity.co/v2/hu-banner.min.js"
         type="text/javascript" charSet="utf-8" />,
       // your existing tags stay after them
       <script key="ga" async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" />,
     ])
   }
   ```

   Gatsby writes its own meta tags first and then your array, so the snippet is the first script in `<head>`. Do not use `async` or `defer` on the banner tags.
3. Alternative: eject the HTML shell (copy `node_modules/gatsby/cache-dir/default-html.js` to `src/html.js`) and put the two script tags as the first thing inside `<head>`.
4. Run `gatsby build`.

## Check it works

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of `public/index.html`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#check-it-works) in a private window (banner shows, no tracking cookies or data hits before the visitor chooses, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Other tags added through `setHeadComponents`** (by you or a plugin) come after the banner when the banner is written in `src/html.js`, which renders before them. If you keep the banner in `gatsby-ssr.js` and another source adds head tags, check the built page: the banner tags must still be the first scripts.
- **Remove any other consent banner.** Two banners give visitors two conflicting choices.
- **Only install your own AppID**, and re-copy the snippet after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
