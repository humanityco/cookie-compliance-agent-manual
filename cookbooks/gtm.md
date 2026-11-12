---
title: Cookie consent banner with Google Tag Manager
description: Put the Cookie Compliance snippet first in the page <head>, above the Google Tag Manager container, so blocking and Consent Mode defaults are in place before gtm.js runs.
kind: scenario
last_verified: 2026-09-28
---

# Cookie consent banner with Google Tag Manager

**In short:** put Cookie Compliance as the first script in the page `<head>`, **above** the GTM container snippet, and keep your tags inside GTM.

## Why the snippet goes first

Blocking and Consent Mode defaults are set up when the snippet runs, so placing it above the GTM container puts them in place before `gtm.js` / `{gtm.start}` starts. The container's tags then load with the visitor's consent state already known.

## Where it goes

1. Get the **live** Cookie Compliance snippet (MCP `install.getSnippet` or dashboard Integrations → Manual Integration). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-gtm) (free plan, no card); with MCP, call `help.startSignup`.
2. Paste it as the **first script** in the site's real `<head>` (layout / theme / HTML), on every page.
3. Leave the existing GTM snippet where it is, **below** Cookie Compliance.
4. Keep the tags inside GTM, including GA4 and Ads. Gate them with consent triggers in GTM so they wait for the visitor's choice where the region requires consent first (on the Classic engine, always do this). On the New engine, recognised tags GTM fires are also held automatically. Consent Mode signals apply when configured in the dashboard.

```html
<head>
  <!-- 1. Cookie Compliance FIRST (live snippet; a new app is on v2, an app on v1 keeps the URL without /v2/) -->
  <script>var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };</script>
  <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

  <!-- 2. GTM container BELOW — unchanged -->
  <script>(function(w,d,s,l,i){/* standard GTM snippet */})</script>
</head>
```

If the snippet is currently inside GTM (a Custom HTML tag, or a tag-manager consent template), move it into the page `<head>` above the container snippet. That needs edit access to the site's layout, theme or HTML, so ask the site owner for it if you do not have it.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

Same verification as install-banner / plain-html. Extra:

| # | Check | Pass |
|---|---|---|
| G1 | View source | Cookie Compliance script tags appear **above** the GTM bootstrap in `<head>`. |
| G2 | Before the visitor chooses, in a region whose rule requires consent first | No Ads/Analytics cookies from GTM-fired tags; with Google Consent Mode on, denied cookieless pings may appear — judge by cookies, not by loader requests. |

## Gotchas

- **WordPress + GTM4WP (or similar):** install the Cookie Compliance **plugin** for placement, and let it be the only place the banner is added (no manual snippet, nothing inside GTM).
- **Banner engine:** a new app uses `/v2/hu-banner.min.js`. Take the URL from the live snippet; an app already on v1 keeps the URL without `/v2/`. After an engine switch, copy the snippet again.

## More help

- [GTM / tag trigger timing troubleshooting](https://cookie-compliance.co/documentation/gtm-tag-trigger-timing-troubleshooting/) — when tags fire too early or not at all.
- [Google Consent Mode](https://cookie-compliance.co/documentation/google-consent-mode/) — how the banner signals consent to Google tags.
