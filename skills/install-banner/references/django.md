---
title: Add a cookie consent banner to a Django site
description: Put the Cookie Compliance snippet first in the head of the base template every page extends, above the analytics tags.
kind: platform
last_verified: 2026-11-12
---

# Add a cookie consent banner to a Django site

**In short:** paste the **live** snippet as the first thing inside `<head>` of the base template every page extends (`templates/base.html`). If you use a child-template block for it, that block must sit above your other scripts in the base.

Confirmed on a Django site: the snippet is the first script in the rendered page's `<head>`.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-django) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the base template (the one other templates `{% extends %}`).

## Where it goes

1. Copy the live snippet (see above).
2. Open the base template and paste the snippet as the **first thing inside `<head>`**:

   ```django
   <head>
     <meta charset="utf-8">
     {# Cookie Compliance: first script on the page (paste live snippet here) #}
     <script>
         var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
     </script>
     <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     {# your existing tags stay below it #}
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
     {% block extra_head %}{% endblock %}
   </head>
   ```

   Preferred: put the snippet in the base template itself. A `{% block %}` also works, provided the block is placed in the base above every other script.
3. Reload a page (a production site needs a reload or redeploy to pick up template changes). Your trackers stay as they are.

If the snippet is currently in a block that renders after your analytics, or in a footer scripts block, move it to the top of the base template's `<head>`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Build or render the site, then **view the page source** of the output (not the browser's Elements panel): the `huOptions` script and `hu-banner.min.js` are the first two `<script>` tags in `<head>` of the rendered page, with no `async` or `defer`, and your analytics tag comes after them.

Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

## Gotchas

- **Pages that do not extend the base.** Any standalone template has its own `<head>`; add the snippet there if that page should show the banner.
- **Keep a single consent banner.** Remove any other one, so visitors see one clear choice.
- **Use your own AppID**, and copy the snippet again after switching banner engine in the dashboard: changing the setting alone does not update a pasted snippet.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
