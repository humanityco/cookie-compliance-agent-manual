---
title: Add a cookie consent banner to a Joomla site
description: Put the Cookie Compliance snippet first in the head of your Joomla template's index.php, above the scripts include, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Joomla site

**In short:** paste the **live** snippet in your template's `index.php`, inside `<head>`, above the `<jdoc:include type="scripts" />` line (or directly after `<head>`).

Confirmed on a Joomla site: the snippet is the first script in the rendered page's `<head>`, on the home page and on an article page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-joomla) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the `index.php` of the template your site uses (**System → Site Templates**, or the file in `templates/<your_template>/`).

## Where it goes

1. Copy the live snippet (see above).
2. Open `templates/<your_template>/index.php`. Cassiopeia writes the page head through three includes (`metas`, `styles`, `scripts`); the `scripts` include carries Joomla's own scripts, `core.min.js` among them. Paste the snippet as the **first script**, directly after `<head>` or directly above the `scripts` include:

   ```php
   <head>
       <!-- Cookie Compliance: first script on the page (paste live snippet here) -->
       <script>
           var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
       </script>
       <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

       <jdoc:include type="metas" />
       <jdoc:include type="styles" />
       <jdoc:include type="scripts" />
   </head>
   ```

3. Save and reload. Your analytics tags stay as they are, below the snippet.

### Without editing template files: a system plugin

If you manage the site with a plugin, let a system plugin insert the snippet right after `<head>` in the finished page, in `onAfterRender` (subscribe to that event in the plugin's usual `getSubscribedEvents()`):

```php
public function onAfterRender(): void
{
    $app = $this->getApplication();
    if (!$app->isClient('site')) {
        return;
    }
    $html = '<script>var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };</script>'
          . '<script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>';
    $app->setBody(preg_replace('#<head>#', '<head>' . $html, $app->getBody(), 1));
}
```

`addCustomTag()` and the asset manager (`registerAndUseScript()`) place the banner after Joomla's own scripts; inserting in `onAfterRender` puts it first. A **Custom HTML module** is written in the page body (for example in the `footer` position); for the banner, use the template or the plugin.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the **page source** of your home page and of one article (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>`, ahead of Joomla's `joomla-script-options` block and `core.min.js`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Edit the template that is in use.** Joomla uses the template style assigned to the page, so make the change in that template's `index.php`. A new template needs the snippet too.
- **After a Joomla update**, open the page source again and confirm the snippet is still first; an update can replace a stock template's `index.php`. A child template or the system plugin keeps the snippet in place.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
