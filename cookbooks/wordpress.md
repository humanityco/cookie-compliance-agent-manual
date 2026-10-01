---
title: Add Cookie Compliance on WordPress
kind: platform
last_verified: 2026-09-28
---

# Add Cookie Compliance on WordPress

**In short:** install the **Cookie Compliance for WordPress** plugin and connect it with App ID + App Key. Do **not** paste the Manual Integration snippet into a theme or a "header scripts" plugin.

## You need

- A WordPress site where you can install plugins (or network-activate on multisite).
- A Cookie Compliance account. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-wordpress); the free plan needs no card.
- From the Cookie Compliance dashboard → **Integrations → WordPress Integration**: the site's **App ID** and **App Secret Key** (it goes into the plugin's **App Key** field). Agents: never put the key in chat logs or commit it; paste it only into the plugin's connection fields.

## The wrong way

```html
<!-- pasted into header.php, a custom HTML widget, or "Insert Headers and Footers" -->
<script>var huOptions = { "appID": "…" };</script>
<script src="https://cdn.hu-manity.co/hu-banner.min.js"></script>
```

On WordPress that fights the plugin (two banners, two consent stores) and skips plugin features (config pull, Script blocking engine control, WP Consent API interop). The dashboard Manual Integration snippet is for **non-WordPress** sites.

## The right way

1. In wp-admin → Plugins → Add New, search **Cookie Compliance** (slug `cookie-notice` on [wordpress.org/plugins/cookie-notice/](https://wordpress.org/plugins/cookie-notice/)). Install and activate **Cookie Compliance**.
2. Open the plugin's admin screen and connect with the **App ID** and the **App Secret Key** (in the plugin's **App Key** field) from the Cookie Compliance dashboard Integrations page for that domain.
3. Publish (or confirm published) configuration in the Cookie Compliance dashboard. The plugin pulls config on a schedule and via **Pull Configuration** — Admin Portal changes are not live on the WP site until a pull.
4. Leave analytics plugins and tags alone. The product blocks them before consent; do not delete Site Kit / MonsterInsights / etc. solely to "make consent work."
5. If a hand-rolled cookie popup or another CMP is still in the theme, remove it.

**Banner engine (v1 vs v2):** the plugin picks the CDN path from the app's WidgetVersion on config pull. You do not paste a script URL. After switching engine in the dashboard, wait for the next pull (or run Pull Configuration).

## Check it works

Same verification table as the install-banner skill (private window, strictest region or geo off, no preview badge, no tracking cookies before consent, allow-all then `hu-consent` cookie). Extra WordPress checks:

| # | Check | Pass |
|---|---|---|
| W1 | View source | The plugin injected the banner script pair early in `<head>` (not a theme paste you added). No second, hand-pasted `huOptions` block. |
| W2 | Plugin connected | App ID matches the dashboard domain; the plugin's **Domain Info** card shows **Protection: Active**, not **Not Connected**. |

## Gotchas

- **Plugin slug is still `cookie-notice`** on WordPress.org; the product name is Cookie Compliance.
- **Optimisers** (LiteSpeed, Autoptimize, "combine JS") can reorder or merge the banner. Exclude it; caching-compatibility toggles in the plugin exist for this class of problem.
- **Multisite:** capability to write network options is gated — a site admin without network rights cannot complete some writes. Say so rather than inventing a workaround.
- **Automated browsers** still bail (`navigator.webdriver` / HeadlessChrome) — same mask as other platforms when verifying with Playwright.
