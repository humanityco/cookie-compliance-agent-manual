---
title: Add a cookie consent banner to a Ghost site
description: Put the Cookie Compliance snippet first in the head of your Ghost theme's default.hbs, above the tags Ghost adds, so the banner can hold recognised trackers until the visitor chooses.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Ghost site

**In short:** paste the **live** snippet as the first thing in the `<head>` of your theme's `default.hbs`, above `{{ghost_head}}`. Keep your analytics in **Code injection → Site header**, where it renders below the banner.

Confirmed on a Ghost site: the snippet is the first script in the rendered page's `<head>`, on the home page and on a post.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-ghost) (free plan, no card); with MCP, call `help.startSignup`.
- Access to your theme's files, specifically `default.hbs`, the template every page uses.

## Where it goes

1. Copy the live snippet (see above).
2. Open `default.hbs` in your theme. Paste the snippet as the **first script** in `<head>`, above `{{ghost_head}}`:

   ```handlebars
   <head>
       <!-- Cookie Compliance: first script on the page (paste live snippet here) -->
       <script>
           var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
       </script>
       <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

       <title>{{meta_title}}</title>
       <meta charset="utf-8">
       ...
       {{ghost_head}}
   </head>
   ```

   Placing it directly above `{{ghost_head}}` works as well. In that spot it follows any small inline script your theme has of its own (the Source theme has one for its colours) and comes before everything Ghost adds.

3. Zip the theme and upload it under **Settings → Design → Change theme** (or, if you edit the theme files on your own server, restart Ghost), then reload your site. Your analytics tags stay where they are; the banner holds the recognised ones until the visitor chooses, in regions whose rule requires consent first.

Ghost's **Code injection → Site header** is written at the end of `{{ghost_head}}`, below the scripts the theme and Ghost add, and **Site footer** is written in the page body. They are a good home for analytics tags and other scripts you want held until the visitor chooses, in regions whose rule requires consent first. For the banner itself, use the theme file above.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the **page source** of your home page and of one post (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>`, with no `async` or `defer`, and any analytics tag from Code injection comes after them. If the snippet sits directly above `{{ghost_head}}`, a small theme script can come before them; nothing from Ghost does.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **The snippet lives in the theme.** If you switch to another theme, add the snippet to its `default.hbs` too.
- **Keep `{{ghost_head}}` in place.** Ghost uses it for its own meta tags and features; the snippet goes above it, not instead of it.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
