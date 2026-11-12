---
title: Add a cookie consent banner to WordPress
description: Install the Cookie Compliance for WordPress plugin and connect it with your App ID and App Secret Key; the plugin places the banner early in the head for you.
kind: platform
last_verified: 2026-10-07
---

# Add a cookie consent banner to WordPress

**In short:** install the **Cookie Compliance for WordPress** plugin and connect it with your App ID and App Secret Key (plugin 3.1.12 and older label it **App Key**). The plugin adds the banner script to every page for you, so no snippet needs pasting into the theme.

## You need

- A WordPress site where you can install plugins (or network-activate on multisite).
- A Cookie Compliance account. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-wordpress); the free plan needs no card.
- From the Cookie Compliance dashboard → **Integrations → WordPress Integration**: the site's **App ID** and **App Secret Key** (plugin 3.1.13 or later uses the same names). Agents: never put the key in chat logs or commit it; paste it only into the plugin's connection fields.

## Where it goes

1. In wp-admin → Plugins → Add New, search **Cookie Compliance** (slug `cookie-notice` on [wordpress.org/plugins/cookie-notice/](https://wordpress.org/plugins/cookie-notice/)). Install and activate **Cookie Compliance**.
2. Open the plugin's admin screen and connect with the **App ID** and **App Secret Key** from the Cookie Compliance dashboard Integrations page for that domain. You can also sign in or sign up from the plugin: if the account has apps but none for this site, the plugin (3.1.13 or later) asks which app to use or offers to create one.
3. Publish (or confirm published) configuration in the Cookie Compliance dashboard. The plugin pulls config on a schedule and via **Pull latest settings** (**Pull Configuration** in plugin 3.1.12 and older) — Dashboard changes are not live on the WP site until a pull.
4. Keep your analytics plugins and tags (Site Kit, MonsterInsights and similar). The banner holds recognised trackers until the visitor chooses, in regions whose rule requires consent first.
5. Keep a single consent banner. Remove any hand-rolled cookie popup or other CMP in the theme, so visitors see one clear choice.

**Banner engine:** a new app starts on v2, whether it is created in the dashboard, through MCP, or from the plugin (3.1.13 or later: signup, or a sign-in that creates an app for this site). Connecting an app that already exists keeps that app's engine, and an app switched back to v1 stays on v1. The plugin picks the CDN path from the app's engine on each settings pull, so you do not paste a script URL. When the engine changes, the plugin shows a notice offering to purge the page cache; you can also run **Pull latest settings**. On a v2 site, the plugin's new admin interface also lets you choose a Standard or Compact banner.

If the Manual Integration snippet is currently pasted into `header.php`, a custom HTML widget or an "Insert Headers and Footers" plugin, remove that paste and let the plugin place the banner. The dashboard Manual Integration snippet is for non-WordPress sites; on WordPress the plugin adds the config pull, Script blocking engine control and WP Consent API interop.

## What the order controls

The plugin places the banner early in `<head>`. It holds recognised trackers until the visitor chooses, in regions whose rule requires consent first, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision.

## Confirm the result

Same verification table as the install-banner skill (private window, strictest region or geo off, no preview badge, no tracking cookies before the visitor chooses in a region whose rule requires consent first, allow-all then `hu-consent` cookie). Extra WordPress checks:

| # | Check | Pass |
|---|---|---|
| W1 | View source | The plugin injected the banner script pair early in `<head>` (not a theme paste you added). No second, hand-pasted `huOptions` block. |
| W2 | Plugin connected | App ID matches the dashboard domain; the plugin's **Domain Info** card shows **Protection: Active**, not **Not connected**. |

## Gotchas

- **Plugin slug is still `cookie-notice`** on WordPress.org; the product name is Cookie Compliance.
- **Optimisers** (LiteSpeed, Autoptimize, "combine JS") can reorder or merge the banner. Exclude it; caching-compatibility toggles in the plugin exist for this class of problem.
- **Multisite:** writing network options needs network rights, so ask a network administrator to complete those settings. See the multisite guide below.
- **Page caches:** plugin 3.1.14 and later marks the plugin's preview (administrators only), Beaver Builder previews and JSON requests as not to be cached, which caches that honour the standard no-cache signals respect. If a cache may already hold such a page, purge it once.
- **Automated browsers:** when verifying with Playwright, mask `navigator.webdriver` and use a desktop user agent, as on other platforms; the banner does not show in HeadlessChrome.

## More help

- [Getting started](https://cookie-compliance.co/documentation/getting-started/) — connecting the plugin to a Cookie Compliance account.
- [Caching plugin compatibility](https://cookie-compliance.co/documentation/caching-plugin-compatibility/) — optimiser and page-cache settings.
- [Multisite support](https://cookie-compliance.co/documentation/multisite-support/) — what a network install can and cannot do.
