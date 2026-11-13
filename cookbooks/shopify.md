---
title: Add a cookie consent banner to a Shopify store
description: Paste the Cookie Compliance snippet first inside <head> in layout/theme.liquid via Edit code, so one edit covers every storefront page.
kind: platform
last_verified: 2026-09-30
---

# Add a cookie consent banner to a Shopify store

**In short:** paste the **live** snippet as the first thing inside `<head>` in `layout/theme.liquid`, via **Online Store → Themes → theme actions (⋯) → Edit code**. One edit there covers every storefront page.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-shopify) (free plan, no card); with MCP, call `help.startSignup`.
- Edit-code access to the store's live theme (Online Store → Themes).

## Where it goes

1. Get the live snippet (MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**).
2. **Online Store → Themes** → find the **live** theme → theme actions menu (⋯) → **Edit code**.
3. Open `layout/theme.liquid`.
4. Paste the snippet as the very first thing after the `<head>` tag — before the `<meta charset>` line, before every `{%- if ... -%}` block, and before `{{ content_for_header }}`.
5. Save.

```liquid
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
  <head>
    <!-- Cookie Compliance FIRST — before anything else in <head> -->
    <script>
        var huOptions = {
        "appID": "YOUR_APP_ID",
        "currentLanguage": "en",
        "blocking": true,
        "globalCookie": false
    };
    </script>
    <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
    <!-- A new app. If the live snippet has no /v2/, the app is on v1 — keep that URL. -->

    <meta charset="utf-8">
    <!-- ...rest of the theme's existing <head>, including {{ content_for_header }}, unchanged... -->
```

`layout/theme.liquid` is shared by every template (home, product, collection, cart, page), so one edit covers the whole storefront. Checkout and the order-status page render through Shopify's separate Checkout system, outside the theme.

### Where each Shopify spot reaches

| Spot | What it reaches |
|---|---|
| `layout/theme.liquid` (Edit code) | Every storefront template. This is where the snippet goes. |
| Settings → Checkout → Additional scripts | The checkout and order-status pages only. |
| Settings → Customer events (custom pixel) | Runs inside Shopify's Web Pixels Manager; Shopify applies the visitor's choice according to each pixel's customer privacy settings (see Gotchas). |
| A theme section or snippet on one template | Only the pages that include it. |

If the snippet is currently in one of the other spots, move it to the top of `<head>` in `layout/theme.liquid`.

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Gotchas

- **Shopify's own first-party analytics loads ahead of theme code on every store.** The Cookie Compliance snippet manages the trackers you install. In the live DOM, Shopify's async analytics script appears before the snippet even when the snippet is the first thing in `theme.liquid`; keep the snippet first in the source, as shown above.
- **The snippet passes the visitor's choice to Shopify, and Shopify applies it to Customer Events pixels.** Shopify has its own consent record, set through its Customer Privacy API (`Shopify.customerPrivacy.setTrackingConsent`), and Shopify Analytics plus every **Customer Events** pixel read that record. The widget writes the visitor's choice into it. A purpose turns on after an explicit click (saving a choice, or allowing a held item); closing the banner or a Global Privacy Control signal can only turn purposes off. After a saved choice, `Shopify.customerPrivacy.currentVisitorConsent()` reflects it. Before the visitor chooses, the widget switches off any purpose Shopify still holds as allowed without a matching Cookie Compliance choice, and those pixels otherwise follow Shopify's own region defaults. The snippet holds trackers that are real `<script>`/`<iframe>` tags in theme code (a hand-pasted GTM container or pixel, a theme app embed that injects into `<head>`). Customer Events pixels are gated by Shopify, not by the snippet, so set each pixel's customer privacy setting in Shopify.
- **Keep a single consent banner.** Leave Shopify's own cookie banner (Settings → Customer privacy → Cookie banner) off, so visitors see one clear choice.
- **Use "Edit code", which opens `layout/theme.liquid`.** "Edit default theme content" edits theme *settings* (text, images) instead.
- **Edit the live theme.** Check the Themes page for which theme is marked as the current theme before opening Edit code.

## Confirm the result

Run `verify-install` (`skills/verify-install/SKILL.md`) against the live storefront. Shopify-specific extra:

| # | Check | Pass |
|---|---|---|
| SP1 | Fetch the raw HTML response (not the live DOM) for `/` | `huOptions` and the `hu-banner.min.js` tag are the first content inside `<head>`, as plain synchronous tags (no `async` or `defer`), before `<meta charset>` and before `{{ content_for_header }}`'s output. |
| SP2 | Load the storefront in a fresh session | The consent banner renders (tiers/choices appear) before any interaction. |
| SP3 | Add a real tracker tag (e.g. `<script async src="https://www.googletagmanager.com/gtag/js?id=...">`) below the snippet in `theme.liquid`, reload, inspect the live DOM, then remove the test tag | The tag's `src` is moved to `data-src` and `type` becomes `javascript/blocked`, so it is held until the visitor chooses, in a region whose rule requires consent first. |
| SP4 | `document.head.firstElementChild` in the live DOM | Usually Shopify's own async analytics script, which loads ahead of theme code on every store (see Gotchas). SP1 confirms the snippet's position in the source. |

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
