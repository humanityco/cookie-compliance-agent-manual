---
title: Add a cookie consent banner to a Wix site
description: Add the Cookie Compliance snippet through Wix's Custom Code, on all pages and placed in Head, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
---

# Add a cookie consent banner to a Wix site

**In short:** add the **live** snippet in **Settings → Custom Code**, applied to **All pages** and placed in **Head**.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-wix) (free plan, no card); with MCP, call `help.startSignup`.
- A published Wix site with a connected domain (Wix offers Custom Code on sites that have one) and access to the site dashboard **Settings**.

## Where it goes

Steps follow [Wix: embedding custom code](https://support.wix.com/en/article/embedding-custom-code-to-your-site) and [Wix: categorizing custom code](https://support.wix.com/en/article/categorizing-your-custom-code).

1. Copy the live snippet (see above).
2. In the site dashboard open **Settings → Custom Code** (listed under Development & integrations) and click **+ Add Custom Code**.
3. Paste the snippet:

   ```html
   <script>
       var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
   </script>
   <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
   ```

4. Name the entry (for example "Cookie Compliance"). Under **Add Code to Pages** choose **All pages**, and under **Place Code in** choose **Head**.
5. Click **Apply**. If Wix asks how often to load the code, choose the option that loads it on each page the visitor opens.

Wix files custom code under **Essential** by default, which loads it straight away. That is the right setting for the banner snippet.

Wix connects Google Analytics, Google Tag Manager and the Facebook and TikTok pixels through its marketing integrations rather than Custom Code. Keep using those integrations, and run [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md) to see how each one behaves before the visitor chooses.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet. Tags connected through Wix's own integrations are loaded by Wix, outside this ordering.

## Confirm the result

View the **page source** of the published site, not the editor or its preview (use the browser's View Source, not the Elements panel): the `huOptions` script and `hu-banner.min.js` are in `<head>` as plain synchronous tags (no `async` or `defer`).

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Use Settings → Custom Code**, the site-wide route, so one entry covers every page.
- **If you change the site's primary domain**, Wix removes its custom code snippets, so add the banner snippet again.
- **If the banner does not appear** on the published site, check that the entry is applied to All pages and placed in Head, also read the note on code snippets in the Wix help page linked above, then see Banner not displayed below.
- **Keep Wix's own cookie banner on while you use Wix's marketing integrations**, until verify-install shows how they behave before the visitor chooses.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
