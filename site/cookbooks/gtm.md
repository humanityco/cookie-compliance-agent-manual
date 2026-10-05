---
title: Cookie Compliance when the site uses Google Tag Manager
kind: scenario
last_verified: 2026-09-28
---

# Cookie Compliance when the site uses Google Tag Manager

**In short:** put Cookie Compliance in the page `<head>` **above** the GTM container snippet. Do **not** add the Cookie Compliance tags as a tag inside the GTM container.

## Why

Blocking and Consent Mode defaults must exist **before** `gtm.js` / `{gtm.start}` run. A tag that fires "on All Pages" inside GTM is already too late: the container has started, and child tags can write cookies before the CMP is in force.

A measured failure mode of this class: consent defaults landed **after** the GTM container, and a Google Ads cookie was written before consent.

## The wrong way

- Creating a Custom HTML tag in GTM that pastes `huOptions` + `hu-banner.min.js`.
- Loading Cookie Compliance only via a tag-manager "consent" template that still boots after `gtm.js`.
- Moving analytics into GTM and assuming that alone solves pre-consent blocking without a page-level CMP first.

## The right way

1. Get the **live** Cookie Compliance snippet (MCP `install.getSnippet` or dashboard Integrations → Manual Integration). No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-gtm) (free plan, no card); with MCP, call `help.startSignup`.
2. Paste it as the **first script** in the site's real `<head>` (layout / theme / HTML), on every page.
3. Leave the existing GTM snippet where it is, **below** Cookie Compliance.
4. Leave tags inside GTM alone — do not delete GA4/Ads tags to "fix" consent. The widget holds them until the visitor chooses (and Consent Mode signals apply when configured in the dashboard).

```html
<head>
  <!-- 1. Cookie Compliance FIRST (live snippet; a new app is on v2, an app on v1 keeps the URL without /v2/) -->
  <script>var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };</script>
  <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

  <!-- 2. GTM container BELOW — unchanged -->
  <script>(function(w,d,s,l,i){/* standard GTM snippet */})</script>
</head>
```

If you **cannot** edit `<head>` outside GTM, stop and tell the owner. Do not invent a container-only workaround.

## Check it works

Same verification as install-banner / plain-html. Extra:

| # | Check | Pass |
|---|---|---|
| G1 | View source | Cookie Compliance script tags appear **above** the GTM bootstrap in `<head>`. |
| G2 | Before consent | No Ads/Analytics cookies from GTM-fired tags; with Google Consent Mode on, denied cookieless pings may appear — judge by cookies, not by loader requests. |

## Gotchas

- **WordPress + GTM4WP (or similar):** still install the Cookie Compliance **plugin** for placement; do not also paste a manual snippet, and do not put the CMP inside GTM.
- **Banner engine:** a new app uses `/v2/hu-banner.min.js`. Take the URL from the live snippet. An app already on v1 keeps the URL without `/v2/`. After an engine switch, re-copy; do not hardcode.
