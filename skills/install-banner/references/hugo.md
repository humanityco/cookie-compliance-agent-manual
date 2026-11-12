---
title: Add a cookie consent banner to a Hugo site
description: Put the Cookie Compliance snippet first in the head partial your layouts render on every page, above the analytics tags. A footer partial or a partial rendered after existing tags is too late.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Hugo site

**In short:** paste the **live** snippet as the first thing in the `<head>` your layouts render on every page: `layouts/_default/baseof.html`, or the head partial it includes. A footer partial, or a partial rendered after your analytics tag, is too late.

Tested with Hugo 0.154, on a site with its own `baseof.html` and head partial.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-hugo) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the site's `layouts/` folder (the template that renders `<head>`).

## The wrong way

```go-html-template
{{/* BAD: a footer partial. The snippet runs after the page's analytics. */}}
</main>
{{ partial "footer.html" . }}   {{/* snippet pasted inside footer.html */}}
</body>
```

Also wrong: a partial that renders **after** your analytics tag in `<head>`. The banner shows, but the tag above it has already run.

## The right way

1. Copy the live snippet (see above).
2. Open the template that renders `<head>` for every page: `layouts/_default/baseof.html`, or the head partial it calls.
3. Paste the snippet as the **first script**, before your analytics and any theme scripts:

   ```go-html-template
   <head>
     <meta charset="utf-8">
     <title>{{ .Title }}</title>
     <!-- Cookie Compliance: first script on the page (paste live snippet here) -->
     <script>
         var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
     </script>
     <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     <!-- your existing tags stay below it -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
   </head>
   ```

4. Rebuild with `hugo`. Leave your trackers where they are; don't wrap them in your own consent code.

## Check it works

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of `public/index.html`, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#check-it-works) in a private window (banner shows, no tracking cookies or data hits before the visitor chooses, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Pages that use a different base template.** If any page type has its own base template, it needs the snippet too. Put it in one shared head partial that every base template calls.
- **Remove any other consent banner.** Two banners give visitors two conflicting choices.
- **Only install your own AppID**, and re-copy the snippet after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
