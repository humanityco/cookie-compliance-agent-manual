---
title: Add a cookie consent banner to a Webflow site
description: Paste the Cookie Compliance snippet into Webflow's Site settings Head code, so one entry covers every page and the banner can hold recognised trackers until the visitor chooses.
kind: platform
---

# Add a cookie consent banner to a Webflow site

**In short:** paste the **live** snippet in **Site settings → Custom code → Head code**, then publish. It applies to the whole site. Put your analytics tags in the same Head code, below the snippet.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-webflow) (free plan, no card); with MCP, call `help.startSignup`.
- A Webflow site on a paid Site plan, or in a Workspace that includes custom code, and Site settings access (Site manager or Designer).

## Where it goes

Steps follow [Webflow: custom code in head and body tags](https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags).

1. Copy the live snippet (see above).
2. Open **Site settings → Custom code**.
3. Paste the snippet in the **Head code** section, with your analytics tags below it if you have any:

   ```html
   <script>
       var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
   </script>
   <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

   <!-- your analytics and pixel tags stay below the banner snippet -->
   ```

4. Click **Save changes**, then **publish** the site. Custom code shows in preview but goes live when you publish.

Head code is written before the closing `</head>` tag and applies to every page.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the **page source** of the published site, not the editor or its preview (use the browser's View Source, not the Elements panel): the `huOptions` script and `hu-banner.min.js` are in `<head>` as plain synchronous tags (no `async` or `defer`), and your analytics tags come after them. Webflow writes Head code before the closing `</head>` tag and page-level custom code after the site-wide Head code, so confirm in the page source that your analytics tags sit after the banner snippet.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Keep the banner script synchronous.** Webflow's [script guidance](https://help.webflow.com/hc/en-us/articles/57073523993107-Optimize-custom-scripts) suggests `async` or `defer` for external scripts in the head. For the banner, paste the tags exactly as they appear above, without `async` or `defer`, so it runs before the tags it holds.
- **Publish after saving.** Custom code does not reach the live site until you publish.
- **Site-wide first.** Put the banner in the site-wide Head code. Page-level code is for tags that belong to one page.
- **Built-in integrations.** Analytics and pixels connected through the builder's own settings are loaded by the builder. Run [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md) to see how they behave before the visitor chooses.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
