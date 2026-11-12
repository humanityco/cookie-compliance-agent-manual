---
title: Add a cookie consent banner to a Squarespace site
description: Paste the Cookie Compliance snippet into Squarespace's Code Injection Header field, so one entry covers every page and the banner can hold recognised trackers until the visitor chooses.
kind: platform
---

# Add a cookie consent banner to a Squarespace site

**In short:** paste the **live** snippet in **Code Injection → Header**, on a plan that includes code injection. The Header field is written into the `<head>` of every page. Put your analytics tags in the same field, below the snippet.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-squarespace) (free plan, no card); with MCP, call `help.startSignup`.
- A Squarespace plan that includes code injection (Core, Plus, Advanced, and some legacy plans) and access to the site's settings.

## Where it goes

Steps follow [Squarespace: code injection](https://support.squarespace.com/hc/en-us/articles/205815908-Using-code-injection).

1. Copy the live snippet (see above).
2. Open the **Code Injection** panel in your site settings.
3. Paste the snippet in the **Header** field, with your analytics tags below it if you have any:

   ```html
   <script>
       var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
   </script>
   <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
   ```

4. Click **Save**.

Squarespace writes the Header field into the `<head>` of every page, so one entry covers the whole site.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the **page source** of the published site, not the editor or its preview (use the browser's View Source, not the Elements panel): the `huOptions` script and `hu-banner.min.js` are in `<head>` as plain synchronous tags (no `async` or `defer`), and your analytics tags come after them. Squarespace's own scripts may also appear in `<head>`; what matters is that your analytics and pixels come after the banner snippet.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Use the site-wide Header field.** A page's own Header Code Injection (in that page's Advanced settings) reaches only that page.
- **Code injection comes with Core, Plus, Advanced and some legacy plans.** Keep a plan that includes it so the banner keeps loading.
- **Put analytics and pixels you add yourself in the Header field**, below the snippet, so they sit with the banner.
- **Squarespace's built-in integrations** (for example its Google Analytics field) are loaded by Squarespace. Run [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md) to see how they behave before the visitor chooses, and keep Squarespace's own cookie banner on while you do.
- **Checkout pages are outside code injection on Squarespace**, so the banner shows on your site's other pages.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
