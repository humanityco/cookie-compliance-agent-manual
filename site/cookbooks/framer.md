---
title: Add a cookie consent banner to a Framer site
description: Add the Cookie Compliance snippet in Framer's Custom Code at the start of the head tag, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
---

# Add a cookie consent banner to a Framer site

**In short:** add the **live** snippet in **Site Settings → Custom Code**, placed at the **start of the `<head>` tag**, then publish. Put your analytics tags below it, at the end of `<head>`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-framer) (free plan, no card); with MCP, call `help.startSignup`.
- A Framer site you can publish, and access to **Site Settings**.

## Where it goes

Steps follow [Framer: custom code](https://www.framer.com/academy/lessons/custom-code).

1. Copy the live snippet (see above).
2. Open **Site Settings** and find **Custom Code**.
3. Add the snippet in **Custom Code** (it applies to the whole site) at the **start of the `<head>` tag**:

   ```html
   <script>
       var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
   </script>
   <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
   ```

4. Add your analytics and pixel tags at the **end of the `<head>` tag**, so they come after the snippet.
5. **Publish** the site.

Framer offers four placements: start or end of `<head>`, and start or end of `<body>`. The start of `<head>` is the one for the banner.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the **page source** of the published site, not the editor or its preview (use the browser's View Source, not the Elements panel): the `huOptions` script and `hu-banner.min.js` are in `<head>` as plain synchronous tags (no `async` or `defer`), and your analytics tags come after them. Framer's custom code runs on the published site only, not in the canvas preview.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Test on the published site.** Custom Code does not run in the canvas preview, so publish and check the live page.
- **Start of `<head>` for the banner, end of `<head>` for tags.** The placement is what orders them, so give each its own placement.
- **Keep the banner script synchronous.** Paste the tags as shown, without `async` or `defer`, so it runs before the tags it holds.
- **One banner on the pages where Cookie Compliance runs.** Once verify-install is clean, retire any second cookie banner there, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
