---
title: Add a cookie consent banner to a Drupal site
description: Put the Cookie Compliance snippet first in the head through your theme's html.html.twig, or attach it from a small module, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Drupal site

**In short:** paste the **live** snippet as the first thing in the `<head>` of your theme's `html.html.twig`. Or attach it from a small module with `hook_page_attachments()` and give the banner library a low weight.

Confirmed on a Drupal site with a custom theme based on Olivero: the snippet is the first script in the built page's `<head>`, on the front page and on an inner page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-drupal) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to your custom theme (`themes/custom/<your_theme>`) or to a custom module (`modules/custom/`), and permission to clear caches.

## Where it goes

### Option A: the theme template

1. Copy the live snippet (see above).
2. In your custom theme, use `templates/html.html.twig` (copy the one from the theme you extend, for example `core/themes/olivero/templates/layout/html.html.twig`, if your theme does not have it yet).
3. Paste the snippet as the **first thing in `<head>`**, above `<head-placeholder>`:

   ```twig
   <head>
     {# Cookie Compliance: first script on the page (paste live snippet here) #}
     <script>
         var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
     </script>
     <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     <head-placeholder token="{{ placeholder_token }}">
     <title>{{ head_title|safe_join(' | ') }}</title>
     <css-placeholder token="{{ placeholder_token }}">
     <js-placeholder token="{{ placeholder_token }}">
   </head>
   ```

4. Clear caches (**Configuration → Development → Performance → Clear all caches**) so Drupal rebuilds the Twig template. Your analytics libraries and tags stay as they are, below the snippet.

### Option B: a module

Use this when you would rather not carry a template override. In a custom module (`modules/custom/my_banner/`, with its usual `my_banner.info.yml`), put the options script in `html_head` and the library in the header scope with a low `weight`:

`my_banner.libraries.yml`

```yaml
banner:
  header: true
  js:
    'https://cdn.hu-manity.co/v2/hu-banner.min.js': { type: external, weight: -100, attributes: { type: 'text/javascript', charset: 'utf-8' } }
```

`my_banner.module`

```php
function my_banner_page_attachments(array &$attachments) {
  $attachments['#attached']['html_head'][] = [
    ['#tag' => 'script', '#value' => 'var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };'],
    'my_banner_options',
  ];
  $attachments['#attached']['library'][] = 'my_banner/banner';
}
```

Enable the module and clear caches. Drupal writes `html_head` items before the stylesheets and the header libraries after them, so the options script comes first and the library follows ahead of your analytics libraries.

Header libraries are written in `weight` order. If an analytics module declares a low weight for its own library, give the banner library a lower one (the `-100` above) so it stays first.

Custom blocks and other content regions write into the page body. For the banner, use the theme template or the module above.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Clear caches, then **view the page source** of your front page and of one inner page (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` (with Option B the options script is right after the charset tag and the library follows the stylesheets), with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Edit the active theme.** Drupal uses the template of the theme that is set as default, so put the override in that theme. A new default theme needs the snippet too.
- **Clear caches after each change.** Clearing caches makes Drupal pick up a new or edited template, module file or library.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
