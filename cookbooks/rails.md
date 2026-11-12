---
title: Add a cookie consent banner to a Rails app
description: Put the Cookie Compliance snippet directly after the opening head tag in app/views/layouts/application.html.erb, above the stylesheet and importmap tags. A snippet before the closing head tag is too late.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Rails app

**In short:** paste the **live** snippet directly after `<head>` in `app/views/layouts/application.html.erb`, above `csrf_meta_tags`, `stylesheet_link_tag` and `javascript_importmap_tags`. Not at the end of `<head>`, and not in a JavaScript pack.

Placement checked by building a stock Rails 8.1 project and reading the page it produces (not a live banner or blocking test).

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-rails) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to `app/views/layouts/application.html.erb` (and any other layout your pages use).

## The wrong way

```erb
    <%= javascript_importmap_tags %>
    <%# BAD: pasted last in <head>, after the app's scripts and your analytics %>
    <script> var huOptions = { ... }; </script>
    <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js"></script>
  </head>
```


## The right way

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

3. Reload a page. Leave your trackers where they are.

In the stock Rails 8.1 layout, `<%= yield :head %>` sits before the stylesheet and importmap tags, so a `content_for :head` block also lands ahead of every script. That depends on your layout's order, so prefer the direct paste, or check the output.

## Check it works

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of the rendered page, with no `async` or `defer`, and the `importmap` and your analytics tags come after them.

Then run the browser checks in [plain-html](plain-html.md#check-it-works) in a private window (banner shows, no tracking cookies or data hits before the visitor chooses, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **More than one layout.** If some pages use a different layout, put the snippet in a shared partial (`<%= render "shared/cookie_banner" %>`) and render it directly after `<head>` in each layout.
- **Remove any other consent banner.** Two banners give visitors two conflicting choices.
- **Only install your own AppID**, and re-copy the snippet after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
