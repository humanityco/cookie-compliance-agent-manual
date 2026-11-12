---
title: Add a cookie consent banner to a Rails app
description: Put the Cookie Compliance snippet directly after the opening head tag in app/views/layouts/application.html.erb, above the stylesheet and importmap tags.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Rails app

**In short:** paste the **live** snippet directly after `<head>` in `app/views/layouts/application.html.erb`, above `csrf_meta_tags`, `stylesheet_link_tag` and `javascript_importmap_tags`.

Confirmed on a Rails app: the snippet is the first script in the rendered page's `<head>`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-rails) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `app/views/layouts/application.html.erb` (and any other layout your pages use).

## Where it goes

1. Copy the live snippet (see above).
2. Open `app/views/layouts/application.html.erb` and paste the snippet **directly after `<head>`**:

   ```erb
   <head>
     <%# Cookie Compliance: first script on the page (paste live snippet here) %>
     <script>
         var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
     </script>
     <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     <title><%= content_for(:title) || "My App" %></title>
     <%= csrf_meta_tags %>
     <%= stylesheet_link_tag :app %>
     <%= javascript_importmap_tags %>
   </head>
   ```

3. Reload a page. Your trackers stay as they are.

In the stock Rails 8.1 layout, `<%= yield :head %>` sits before the stylesheet and importmap tags, so a `content_for :head` block also lands ahead of every script. Check the rendered page to confirm the order in your own layout.

If the snippet is currently at the end of `<head>`, move it up to directly after `<head>`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of the rendered page, with no `async` or `defer`, and the `importmap` and your analytics tags come after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **More than one layout.** If some pages use a different layout, put the snippet in a shared partial (`<%= render "shared/cookie_banner" %>`) and render it directly after `<head>` in each layout.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
