---
title: Add a cookie consent banner to a PrestaShop store
description: Paste the Cookie Compliance snippet first in the theme's head template, above the Google Analytics module and any other header scripts, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a PrestaShop store

**In short:** paste the **live** snippet as the first thing in your theme's head template, `themes/hummingbird/templates/_partials/head.tpl` for the default Hummingbird theme. That file is rendered on every storefront page, ahead of the scripts your modules add.

Confirmed on a PrestaShop store: the snippet is the first script in the rendered page's `<head>`, on the home page and on an inner page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-prestashop) (free plan, no card); with MCP, call `help.startSignup`.
- File access to the store's theme folder (`themes/<your-theme>/templates/`), by SFTP, SSH or your host's file manager.

## Where it goes

1. Copy the live snippet (see above).
2. Open `themes/hummingbird/templates/_partials/head.tpl` (the head template of your active theme).
3. Paste the snippet at the very top of the file, above the first block. Wrapping it in `{literal}` keeps Smarty, PrestaShop's template engine, from reading the braces in the options:

   ```smarty
   {literal}
   <script>
       var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
   </script>
   <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
   {/literal}
   {block name='head_charset'}
     <meta charset="utf-8">
   {/block}
   ```

4. Clear the cache (**Advanced Parameters → Performance → Clear cache**) and reload the store. Your modules, including the Google Analytics module, keep working as they are; the banner holds the recognised ones until the visitor chooses, in regions whose rule requires consent first.

The snippet also works directly after the `<head>` tag in `layouts/layout-both-columns.tpl` (keep the `{literal}` wrapper there too), the layout the full-width, left-column, right-column and content-only layouts all build on. It lands first in the page head.

**Prefer a module?** A module that prints the snippet on the `displayHeader` hook works when it is the first module on that hook: in **Design → Positions**, drag it to the top of the `displayHeader` list. A module installed later joins the end of the list, after the Google Analytics module.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Open the store's home page and one inner page (for example **About us**), then **view the page source** (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two executable `<script>` tags in `<head>`, with no `async` or `defer`, and the Google Analytics tag comes after them. Hummingbird writes its structured data (`application/ld+json`, which the browser does not run) in the head too; with the snippet in `head.tpl` it comes first, and with the `displayHeader` route it follows the structured data and PrestaShop's own settings object.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Use the head, not a footer spot.** A module on the `displayFooter` hook prints in the page body, after the tags in the head. Put the snippet in `head.tpl`, or on `displayHeader` at the top of Design → Positions, so it comes first.
- **Use the theme template for the snippet.** PrestaShop's admin text blocks are for content and do not take `<script>` tags.
- **After a theme update**, open the page source again and confirm the snippet is still first; a theme update can replace `head.tpl`.
- **Keep a single consent banner.** Remove any other one, including a cookie notice from another module, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
