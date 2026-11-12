---
title: Tags and pixels with Cookie Compliance
description: How Cookie Compliance holds GA4, Google Ads, Meta Pixel, Hotjar, Microsoft Clarity, LinkedIn Insight Tag, TikTok Pixel and Matomo until the visitor chooses, and how to add each tag below the banner snippet.
kind: guide
last_verified: 2026-11-12
---

# Tags and pixels with Cookie Compliance

**In short:** add each tag below the Cookie Compliance snippet in the same `<head>`, exactly as its vendor gives it to you. Tags the banner recognises wait for the visitor's choice, in regions whose rule requires consent first. For a tag it does not recognise, add your own pattern in Autoblocking, or mark the script.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-trackers) (free plan, no card); with MCP, call `help.startSignup`.
- The Cookie Compliance snippet already installed as the first script in the page `<head>` (see [plain-html](plain-html.md) or the guide for your platform).
- Edit access to the place your tags are added: the same template, theme or head field as the snippet.

## How each tag is held

Both banner engines hold the tags below by the address of the script file. Each is held under a category, and it is released when the visitor allows that category: 1 Basic Operations, 2 Content Personalization, 3 Site Optimization, 4 Ad Personalization.

| Tracker | Held automatically? | Category | How to add it |
|---|---|---|---|
| GA4 (gtag) | Yes: the `googletagmanager.com/gtag/js` loader | 2 | Paste Google's snippet below the banner snippet, unchanged. |
| Google Ads | Yes: the same `gtag/js` loader, and the `googleadservices.com/pagead/conversion` files | 2 for `gtag/js`, 4 for the conversion files | Paste the Ads tag below the banner snippet, unchanged. |
| Meta Pixel | Yes: `connect.facebook.net` (`fbevents.js`) | 4 | Paste the Pixel code below the banner snippet. The whole inline block is held, because it names that address. |
| Hotjar | Yes: `static.hotjar.com` and `script.hotjar.com` | 3 | Paste the Hotjar snippet below the banner snippet. The whole inline block is held, because it names that address. |
| Microsoft Clarity | Yes: `clarity.ms/tag/` and `clarity.js` | 4 | Paste the Clarity snippet below the banner snippet. The whole inline block is held, because it names that address. |
| LinkedIn Insight Tag | Yes: the `insight.min.js` loader (`lms-analytics/insight.min.js`) | 3 | Paste the Insight Tag below the banner snippet. The whole inline block is held, because it names that address. |
| TikTok Pixel | Yes: `analytics.tiktok.com` | 4 | Paste the Pixel code below the banner snippet. The whole inline block is held, because it names that address. |
| Matomo | Yes, for a script file named `matomo.js` (self-hosted or Matomo Cloud) | 3 | Load `matomo.js` with a normal `<script src>` below the banner snippet. Matomo's standard inline snippet builds the file name in pieces, so mark it: `class="hu-block" data-hu-category="3"`. |

A tracker file with a different name (for example `piwik.js`, or a Matomo Tag Manager container) is yours to name: add its address as your own pattern in Autoblocking, or mark the script, as in the next section.

### Marking a script yourself

To choose the category of any script, inline or external, add `class="hu-block"` and `data-hu-category` with the category number:

```html
<script class="hu-block" data-hu-category="3">
  /* the tag's own inline code */
</script>
```

`data-hu-category` on its own is enough to mark a script; `hu-block` on its own marks it as category 2. A script marked `data-hu-category="1"` is essential and runs straight away.

## Where it goes

1. Keep the Cookie Compliance snippet as the first script in `<head>`.
2. Put each tag **below** it, in the same `<head>`, as the vendor gives it to you:

   ```html
   <head>
     <!-- Cookie Compliance: first script on the page -->
     <script>var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };</script>
     <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     <!-- your tags stay below it -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
   </head>
   ```

3. Or fire the tags through Google Tag Manager and gate them with consent triggers (both engines). On the New engine, recognised tags that GTM fires are also held automatically. See [gtm](gtm.md) for placing the banner above the container.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Use a private window. In the page source the banner snippet comes first in `<head>` and your tags come after it. Then open the browser's Application → Cookies panel before choosing anything: no tracking cookies (for example `_ga`, `_gcl_au`, `_fbp`) appear in a region whose rule requires consent first. After Allow, the tags start and their cookies appear. A held tag shows `type="javascript/blocked"` in the Elements panel until the visitor chooses.

Test from a region your strictest rule covers (for example the EU), or confirm region rules are off. The browser checks are in [plain-html](plain-html.md#confirm-the-result), and the full procedure is [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **A tracker that is not on the list.** Add your own pattern in Autoblocking, or mark the script with `data-hu-category` as above. Either way the banner then holds it like the tags in the table.
- **Tags added by a tag manager.** Gate them with consent triggers in the tag manager (both engines). On the New engine, recognised tags that Google Tag Manager fires are also held automatically.
- **Google or Meta Consent Mode on.** Their loaders (`gtag/js`, `connect.facebook.net`) then load straight away and receive a "denied" consent signal until the visitor chooses. Judge the result by the cookies, as in [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).
- **Essential is your choice.** Marking a tag `data-hu-category="1"` lets it run before consent. Mark only tags your site needs to work, and decide each one on purpose.
- **Held scripts may still download.** The file can download while it is held; it does not run until the visitor chooses.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/): the placement rule, for the site owner.
- [Google Consent Mode](https://cookie-compliance.co/documentation/google-consent-mode/): how the banner signals consent to Google tags.
