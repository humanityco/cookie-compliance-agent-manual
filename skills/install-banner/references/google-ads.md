---
title: Google Ads with Cookie Compliance
description: Place the Google Ads tag below the Cookie Compliance snippet so the banner can hold the loader and conversion files until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# Google Ads with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste the Google Ads tag below it. The banner holds the recognised Google loader and conversion files until the visitor allows their categories, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your Google Ads tag from the Ads admin (the same Google tag shape as GA4).
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Google's docs place the tag in the page's `<head>`. With Cookie Compliance installed, keep the banner snippet first, then paste the Ads tag below it — same shape Google gives you:

```html
<!-- Cookie Compliance snippet first, then: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXX');
</script>
```

Firing Ads through Google Tag Manager instead? Put the banner above the GTM container and gate tags with consent triggers — see [gtm](gtm.md) and the [GTM cookie consent guide](https://cookie-compliance.co/guides/google-tag-manager-cookie-consent/).

## What the order controls

The banner recognises the `googletagmanager.com` loader (default category **2 Content Personalisation**) and the `googleadservices.com/pagead/conversion` files (`conversion.js`, `conversion_async`; default category **4 Ad Personalisation**). With Google Consent Mode off, in regions whose rule requires consent first, the Tag Manager / Google tag loaders wait until the visitor allows their category; with it on, those loaders load before the choice with denied Consent Mode defaults. The conversion files always wait until their category is allowed where the region requires consent first. They start after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the Ads tag after it. Before choosing, in a region whose rule requires consent first, `_gcl_au` (and the other `_gcl_*` cookies Google lists) are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, `_gcl_au` appears. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Google Consent Mode on.** Tag Manager and the Google tag then load before the visitor's choice, with Consent Mode defaults that deny the advertising signals (Google's advanced consent mode). On the New engine this applies when Cookie Compliance's snippet comes first in the page head, the standard GTM snippet or `gtag/js` file and the default dataLayer are used, and **Block trackers added by other scripts** is on; otherwise the loaders stay held until their category is accepted, where the region requires consent first. Judge by the cookies (`_gcl_*`, `_gac_<wpid>`), not by whether the loader request appears. See [Google Consent Mode v2](https://cookie-compliance.co/guides/google-consent-mode-v2/).
- **Tags inside GTM.** Gate them with consent triggers; on the New engine, recognised tags GTM fires are also held where the region requires consent first. See the [GTM cookie consent guide](https://cookie-compliance.co/guides/google-tag-manager-cookie-consent/).

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
