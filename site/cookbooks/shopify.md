---
title: Add Cookie Compliance to a Shopify store
kind: platform
last_verified: 2026-09-30
---

# Add Cookie Compliance to a Shopify store

**In short:** paste the **live** snippet as the first thing inside `<head>` in `layout/theme.liquid`, via **Online Store → Themes → theme actions (⋯) → Edit code** — not the checkout "Additional scripts" field, and not a Custom Pixel added through **Settings → Customer events**.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**.
- Edit-code access to the store's live theme (Online Store → Themes).

## The wrong way

- **Settings → Checkout → Additional scripts.** This field only renders on the checkout and order-status pages. It never touches the storefront `<head>`, so nothing on the actual product/collection/home pages gets blocked.
- **Settings → Customer events → Add a custom pixel.** A pixel added this way runs inside Shopify's own sandboxed **Web Pixels Manager**, not as a normal page script. It cannot see or gate a `<script>` tag sitting in `theme.liquid`. The Cookie Compliance snippet in `theme.liquid` can't block a pixel registered this way either; it passes the visitor's choice to Shopify instead, and Shopify gates pixels whose customer privacy setting requires consent (see Gotchas).
- **A theme section or snippet rendered only on `index.liquid`.** `layout/theme.liquid` is the one file every template shares; a section only reaches whatever pages include it.

## The right way

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
    <script src="https://cdn.hu-manity.co/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

    <meta charset="utf-8">
    <!-- ...rest of the theme's existing <head>, including {{ content_for_header }}, unchanged... -->
```

`layout/theme.liquid` is shared by every template (home, product, collection, cart, page), so one edit covers the whole storefront. It does **not** cover checkout or the order-status page — those render through Shopify's separate Checkout system, out of scope for a theme edit.

## Gotchas

- **Shopify injects its own analytics script ahead of anything in your `<head>`, and you cannot move it.** Verified 2026-09-30 on a live dev store: even with the Cookie Compliance snippet as the literal first byte after `<head>` in `theme.liquid`'s source, the rendered DOM's `document.head.firstElementChild` was Shopify's own `trekkie.storefront.*.min.js` (tied to `window.ShopifyAnalytics`) — injected by the platform, not by the theme, and loaded `async`. This is normal, expected, and not a placement bug; do not try to "fix" it by moving the snippet further, there is nowhere to move it to. It is Shopify's own first-party analytics, separate from the merchant-installed trackers this snippet exists to gate.
- **Cookie Compliance passes the visitor's choice to Shopify; it does not block Customer Events pixels itself.** Shopify has its own consent record, set through its Customer Privacy API (`Shopify.customerPrivacy.setTrackingConsent`), and Shopify Analytics plus every **Customer Events** pixel read that record — not the Cookie Compliance cookie. The widget writes the visitor's choice into that record. It turns a purpose on only after an explicit click (saving a choice, or unblocking a blocked item) during the current page view; an implied accept (such as closing the banner) or a Global Privacy Control signal can only turn purposes off. Before the visitor chooses, the widget sends nothing new, except that it turns off any purpose Shopify still holds as allowed without a matching Cookie Compliance choice; otherwise those pixels follow Shopify's own region defaults. Verified 2026-09-30 on a real Shopify dev store: after a saved choice, `Shopify.customerPrivacy.currentVisitorConsent()` reflects it. The snippet blocks trackers that are real `<script>`/`<iframe>` tags in theme code (a hand-pasted GTM container or pixel, a theme app embed that injects into `<head>`); pixels installed through Customer Events are gated by Shopify, according to each pixel's customer privacy settings. Never tell a merchant this snippet blocks those pixels.
- **Don't also turn on Shopify's own cookie banner.** Settings → Customer privacy → Cookie banner is a second consent banner; running both asks the visitor twice and records two conflicting answers.
- **Don't confuse "Edit code" with "Edit default theme content."** The latter edits theme *settings* (text, images), not `layout/theme.liquid`.
- **A published (live) theme vs. a draft theme.** Edit the theme that's actually live, not a draft — check the Themes page for which one is marked as the current theme before opening Edit code.

## Check it works

Run `verify-install` (`skills/verify-install/SKILL.md`) against the live storefront. Shopify-specific extra:

| # | Check | Pass |
|---|---|---|
| SP1 | Fetch the raw HTML response (not the live DOM) for `/` | `huOptions` and the `hu-banner.min.js` tag are the first content inside `<head>`, before `<meta charset>` and before `{{ content_for_header }}`'s output. |
| SP2 | Load the storefront in a fresh session | The consent banner renders (tiers/choices appear) before any interaction. |
| SP3 | Add a real tracker tag (e.g. `<script async src="https://www.googletagmanager.com/gtag/js?id=...">`) below the snippet in `theme.liquid`, reload, inspect the live DOM | The tag's `src` is emptied and moved to `data-src`, `type` becomes `javascript/blocked`, and a `hu-blocked` class is added — it never executes pre-consent. |
| SP4 | `document.head.firstElementChild` in the live DOM | Will usually be Shopify's own async analytics script, **not** the Cookie Compliance snippet — expected per the gotcha above, not a failure. |

**Verified 2026-09-30** against a real Shopify dev store (Partners-created, `*.myshopify.com`, password-gated, no real customer data), a real non-production Cookie Compliance AppID, and a real `googletagmanager.com/gtag/js` tag as the test tracker: the tracker rendered with `type="javascript/blocked"`, class `hu-blocked`, `data-hu-category="2"`, and its `src` moved to `data-src` — confirmed via the live DOM, not the tool's own preview response. The test tracker line was removed from `theme.liquid` after verification; only the real Cookie Compliance snippet remains live on that store.
