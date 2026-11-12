---
title: Add a cookie consent banner to a Gatsby site
description: Put the Cookie Compliance snippet first in the head through gatsby-ssr.js (setHeadComponents, snippet first in the list) or a custom src/html.js.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Gatsby site

**In short:** paste the **live** snippet as the **first two entries** of `setHeadComponents([...])` in `gatsby-ssr.js`, or as the first thing in `<head>` of a custom `src/html.js`. Place it above your analytics entry.

Confirmed on a Gatsby site: with `setHeadComponents` (snippet first), the banner tags are the first scripts in the built page's `<head>`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-gatsby) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `gatsby-ssr.js` (create it in the project root if it does not exist) or `src/html.js`.

## Where it goes

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

   Gatsby writes its own meta tags first and then your array, so the snippet is the first script in `<head>`. Keep the banner tags synchronous (no `async` or `defer`).
3. Alternative: eject the HTML shell (copy `node_modules/gatsby/cache-dir/default-html.js` to `src/html.js`) and put the two script tags as the first thing inside `<head>`.
4. Run `gatsby build`.

Use `setHeadComponents` (not `setPostBodyComponents`) and keep the banner entries first in the array; Gatsby keeps array order.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of `public/index.html`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Other tags added through `setHeadComponents`** (by you or a plugin) come after the banner when the banner is written in `src/html.js`, which renders before them. If you keep the banner in `gatsby-ssr.js` and another source adds head tags, check the built page: the banner tags should still be the first scripts. When plugins add head tags, `src/html.js` is the more robust route, because it renders the banner before them.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
