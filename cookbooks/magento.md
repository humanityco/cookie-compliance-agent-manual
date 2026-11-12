---
title: Add a cookie consent banner to a Magento store
description: Put the Cookie Compliance snippet first in your theme's root.phtml, above RequireJS and your analytics tags, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Magento store

**In short:** paste the **live** snippet as the first thing inside `<head>` in your theme's `Magento_Theme/templates/root.phtml`. That one template renders the head of every storefront page, ahead of RequireJS and your analytics tags.

Confirmed on a Magento Open Source store: the snippet is the first script in the rendered page's `<head>`, on the home page and on a CMS page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-magento) (free plan, no card); with MCP, call `help.startSignup`.
- File access to the store's theme (`app/design/frontend/<Vendor>/<theme>/`) and the command line, to flush the cache.
- A theme of your own, even a small one. If the store runs plain Luma, add a child theme (a `theme.xml` with `<parent>Magento/luma</parent>` and a `registration.php`), then register and apply it as Adobe's [theme documentation](https://developer.adobe.com/commerce/frontend-core/guide/themes/) describes (applying is under **Content → Design → Configuration**), so the edit lives in your code and not in `vendor/`.

## Where it goes

1. Copy the live snippet (see above).
2. Copy Magento's `vendor/magento/module-theme/view/base/templates/root.phtml` to `app/design/frontend/<Vendor>/<theme>/Magento_Theme/templates/root.phtml` (skip this if your theme already has that file).
3. Paste the snippet as the **first thing inside `<head>`**, above the `$requireJs` line:

   ```php
   <!doctype html>
   <html <?= /* @noEscape */ $htmlAttributes ?>>
       <head <?= /* @noEscape */ $headAttributes ?>>
           <!-- Cookie Compliance: first script on the page (paste live snippet here) -->
           <script>
               var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
           </script>
           <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

           <?= /* @noEscape */ $requireJs ?>
           <?= /* @noEscape */ $headContent ?>
           <?= /* @noEscape */ $headCritical ?>
           <?= /* @noEscape */ $headAssets ?>
           <?= /* @noEscape */ $headAdditional ?>
       </head>
   ```

4. Flush the cache: `bin/magento cache:flush`. Your analytics and other tags stay as they are; the banner holds the recognised ones until the visitor chooses, in regions whose rule requires consent first.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Open the home page and one inner page (for example **Privacy and Cookie Policy**), then **view the page source** (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>`, with no `async` or `defer`, followed by Magento's RequireJS scripts and your analytics tag.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Use `root.phtml`: it prints first on every page.** If you prefer the admin field (**Content → Design → Configuration → HTML Head → Scripts and Style Sheets**), put your analytics tags below the snippet in the same field. Keep the snippet out of the footer field, which prints in the page body.
- **After a Magento upgrade**, compare your `root.phtml` with the new core file and view the page source again, so the snippet is still first and the template still matches.
- **Flush the cache after every edit.** Until then visitors keep getting the cached page.
- **Keep a single consent banner.** Remove any other one, including Magento's own cookie notice (turn off **Cookie Restriction Mode** under **Stores → Configuration → General → Web → Default Cookie Settings**), so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
