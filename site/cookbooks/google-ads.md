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

Google's docs say to paste the tag after the `<head>` element. With Cookie Compliance installed, keep the banner snippet first, then paste the Ads tag below it — same shape Google gives you:

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

The banner recognises the `googletagmanager.com` loader (default category **2 Content Personalisation**) and the `googleadservices.com/pagead/conversion` files (`conversion.js`, `conversion_async`; default category **4 Ad Personalisation**). The whole inline block is held when it names that address. In regions whose rule requires consent first, those files wait until the visitor allows their category; they start after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the Ads tag after it. Before choosing, in a region whose rule requires consent first, `_gcl_au`, `_gcl_aw`, `_gcl_dc`, `_gcl_gb` and `_gac_<wpid>` are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, those cookies appear. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Google Consent Mode on.** The `googletagmanager.com` loader then loads straight away with a denied signal until the visitor chooses. Judge by the cookies (`_gcl_*`, `_gac_<wpid>`), not by whether the loader request appears. See [Google Consent Mode v2](https://cookie-compliance.co/guides/google-consent-mode-v2/).
- **Tags inside GTM.** Gate them with consent triggers; on the New engine, recognised tags GTM fires are also held automatically. See the [GTM cookie consent guide](https://cookie-compliance.co/guides/google-tag-manager-cookie-consent/).

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
