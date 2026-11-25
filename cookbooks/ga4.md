---
title: GA4 with Cookie Compliance
description: Place the Google Analytics 4 tag below the Cookie Compliance snippet so the banner can hold it until the visitor chooses, in regions whose rule requires consent first.
kind: guide
last_verified: 2026-11-25
---

# GA4 with Cookie Compliance

**In short:** keep the Cookie Compliance snippet as the first script in `<head>`, then paste Google's GA4 tag below it. The banner holds the recognised Google loader until the visitor allows Content Personalisation, in regions whose rule requires consent first.

## You need

- The Cookie Compliance snippet already installed as the first script in `<head>` (see [plain-html](plain-html.md) or your platform guide).
- Your GA4 Measurement ID (`G-XXXX`) and Google's standard tag from the Google Analytics admin.
- Edit access to the same template, theme or head field as the banner snippet.

## Where it goes

Google's docs place the standard tag immediately after the opening `<head>` tag. With Cookie Compliance installed, keep the banner snippet first, then paste the GA4 tag below it — same shape Google gives you:

```html
<!-- Cookie Compliance snippet first, then: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXX');
</script>
```

Firing GA4 through Google Tag Manager instead? Put the banner above the GTM container and gate tags with consent triggers — see [gtm](gtm.md) and the [GTM cookie consent guide](https://cookie-compliance.co/guides/google-tag-manager-cookie-consent/).

## What the order controls

The banner recognises the `googletagmanager.com` loader (`gtag/js` or `gtm.js`) and holds it under category **2 Content Personalisation** by default. The whole inline block is held when it names that address. In regions whose rule requires consent first, the tag waits until the visitor allows that category; it starts after Allow. A script placed above the banner snippet runs straight away.

## Confirm the result

View the page source: the banner snippet comes first in `<head>`, the GA4 tag after it. Before choosing, in a region whose rule requires consent first, `_ga` and `_ga_<container-id>` are absent; the held script shows `type="javascript/blocked"` in the Elements panel. After Allow, those cookies appear. Browser checks: [plain-html](plain-html.md#confirm-the-result); full procedure: [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md).

## Gotchas

- **Google Consent Mode on.** The `googletagmanager.com` loader then loads straight away with a denied signal until the visitor chooses. Judge by the cookies (`_ga`, `_ga_<container-id>`), not by whether the loader request appears. See [Google Consent Mode v2](https://cookie-compliance.co/guides/google-consent-mode-v2/).
- **Tags inside GTM.** Gate them with consent triggers; on the New engine, recognised tags GTM fires are also held automatically. See the [GTM cookie consent guide](https://cookie-compliance.co/guides/google-tag-manager-cookie-consent/).

## More help

- [Tags and pixels hub](trackers.md) — every recognised tag at a glance.
- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule, for the site owner.
