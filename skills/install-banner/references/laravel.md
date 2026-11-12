---
title: Add a cookie consent banner to a Laravel app
description: Put the Cookie Compliance snippet directly after the opening head tag of the Blade layout every page uses, above the fonts and Vite lines. Before the closing head tag or body is too late.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Laravel app

**In short:** paste the **live** snippet directly after the opening `<head>` of the Blade layout every page uses (in a fresh app that is `resources/views/welcome.blade.php`; in yours, the shared layout file), above the other lines in `<head>` (`@fonts`, `@vite`). Not before `</head>`, and not before `</body>`.

Placement checked by building a Laravel 13 app, on the starter page (`welcome.blade.php`) and reading the page it produces (not a live banner or blocking test).

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-laravel) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the Blade layout that renders `<head>` (the file with `@yield`/`{{ $slot }}`, shared by your pages).

## The wrong way

```blade
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    {{-- BAD: pasted last in <head>, after the analytics and app scripts above --}}
    <script> var huOptions = { ... }; </script>
    <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js"></script>
</head>
```

Pasting it before `</body>` is also wrong: everything in `<head>` has already run.

## The right way

1. Copy the live snippet (see above).
2. Open the Blade file that renders `<head>` for your pages (your shared layout; in a fresh app the starter page `resources/views/welcome.blade.php`).
3. Paste the snippet **directly after `<head>`**, before the `<meta>` tags, `@fonts`, `@vite` and your analytics:

   ```blade
   <head>
       <!-- Cookie Compliance: first script on the page (paste live snippet here) -->
       <script>
           var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
       </script>
       <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

       <meta charset="utf-8">
       @vite(['resources/css/app.css', 'resources/js/app.js'])
       <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
   </head>
   ```

4. Leave your trackers where they are. Do not add the banner through `@vite` or your app's JavaScript bundle.

## Check it works

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of the rendered page, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#check-it-works) in a private window (banner shows, no tracking cookies or data hits before the visitor chooses, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **More than one layout.** If some pages extend a different layout, add the snippet to each layout's `<head>` the same way.
- **Remove any other consent banner.** Two banners give visitors two conflicting choices.
- **Only install your own AppID**, and re-copy the snippet after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
