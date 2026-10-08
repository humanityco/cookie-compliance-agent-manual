---
name: verify-install
description: Verify a Cookie Compliance consent banner actually blocks trackers before consent on a site that already has it. Use after installing a banner, when asked "is the banner working", "check the consent banner", "verify the cookie banner blocks trackers", or before reporting any Cookie Compliance install as done.
---

# Verify the Cookie Compliance banner is actually blocking

A banner that is merely visible has not been verified. Verification means proving trackers do not run before the visitor consents, then proving they do run once the visitor allows them.

## 0. Status check first

Open `https://designer-api.hu-manity.co/api/designer/user-design-live/?AppID=YOUR_APP_ID` (public, no sign-in; it is the same request the banner makes from each visitor's browser).

- **Any 400:** the configuration is not live yet. Show the person the error text. "App does not exist" or "App was deleted": the AppID is wrong or the app is gone. Get the current AppID from **Integrations** (or `account.listApps`); do not publish. Any other 400 (for example "App is not published yet"): they click **Publish Now** in the dashboard. Stop here until it returns 200.
- **200:** the configuration is live. Read `data.WidgetVersion`: `"v2"` means the New engine, so the script path must be `/v2/hu-banner.min.js`; anything else (`null`, `"v1"`) means Classic, so the path must be the root `/hu-banner.min.js`.

A 200 only means the configuration is live. It is not a pass of any check below and never replaces them, including when you cannot run a browser.

**If the script path does not match `WidgetVersion`**, first find out how the banner was installed, then fix it that way. A WordPress site with the Cookie Compliance plugin active (for example `wp-content/plugins/cookie-notice` in the code, or the plugin listed in wp-admin) uses the plugin route. Anything else is a pasted snippet: by hand, from the dashboard, or from `install.getSnippet`. If unsure, ask the person once.

| How it was installed | Fix |
|---|---|
| WordPress plugin | Update the plugin to the current version, run **Pull latest settings**, then purge the page cache (the plugin offers this in a notice when the engine changes; see "Banner engine" in the [WordPress cookbook](https://manual.hu-manity.co/cookbooks/wordpress.md)). Otherwise a cached page keeps the old script path. Never add the manual snippet to a site that runs the plugin. |
| Pasted snippet, MCP connected | Call `install.getSnippet` again and replace the snippet on every page. |
| Pasted snippet, no MCP | After publishing, copy the snippet again from **Integrations → Manual Integration** and replace it on every page. |

## 1. Browser checks

Use a fresh browser profile or private window. If you drive a browser with automation, **hide `navigator.webdriver` and use a normal desktop user agent**, because the widget deliberately doesn't run for automated or headless browsers, and you'd wrongly conclude the banner is missing.

**Location matters:** with region rules on, the visitor's region decides whether the banner shows and whether it blocks. Test from a region under the strictest rule (for example the EU), or confirm region rules are off. Otherwise a missing banner may be correct, and a pass may not hold for EU visitors.

| # | Check | Pass |
|---|---|---|
| 1 | **Screenshot** the page on first load (desktop and mobile width) | The banner is visible. No badge reading "Hu-manity PREVIEW — not active consent management". |
| 2 | **Page source** | The snippet is the first script in `<head>`, without `async`/`defer`, on the homepage **and** an inner page. No `previewMode`, `forceShow` or `cnPreview` anywhere: these are preview-only keys, and a page that carries one can stop the visitor's choice being saved. For a v2 app, the script `src` contains `/v2/hu-banner.min.js`. |
| 3 | **Before any click** | No tracking cookies (for example `_ga`, `_gcl_au`, `_fbp`) and no data hits (for example `google-analytics.com/g/collect`, `facebook.com/tr`). A tracker's script **file** in the HTML may still download (the browser starts fetching `<script src>` files it finds ahead in the page); that is fine only if it never runs. Prove it: `typeof google_tag_manager === 'undefined'` and `typeof fbq === 'undefined' \|\| !fbq.getState` are both true. Repeat this check on an inner page in a fresh profile. |
| 4 | **Allow everything**: choose the most permissive option (for example the highest level). On a Classic banner, then click Save. The New banner has no Save button: each choice saves on click, and if the app has the Reloading setting on, the page reloads once after the choice | Trackers run at once, with no reload needed: their cookies appear and data hits go out. After a reload the banner stays closed and a `hu-consent` cookie exists. |

**Consent Mode exception to check 3:** when Google, Meta or Microsoft Consent Mode is on, their loader scripts (for example `googletagmanager.com/gtag/js`, `connect.facebook.net`) load before consent **by design**, and they are sent a "denied" signal. With Google Consent Mode, cookieless pings to `google-analytics.com` carrying the denied state are expected too. That is correct; don't "fix" it. Judge check 3 by cookies only.

**Banner or revoke icon missing?** Open the browser console. With or without debug mode, the widget prints short `status` lines saying what it showed and why, for example `[hu] status banner-hidden:gpc` (the browser sends Global Privacy Control, so the banner is correctly not shown). That is expected behaviour, not a broken install: re-test in a fresh profile without Global Privacy Control. `[hu] status revoke-off:no-choice-yet` is normal on a first visit.

If you can't run a browser, give the owner this table. A row counts only when the owner checks it now against its Pass column and tells you what they saw; a bare "it works" is not a confirmation. Report those rows as "owner-confirmed, not verified by me". They do not make the install verified.

## Report

Tell the owner: the status check result and its `WidgetVersion`, the result of each check (with screenshots if taken, and which rows are owner-confirmed), the region you tested from, which banner engine URL was installed (v1 root path vs `/v2/`), and that design, wording and regions are managed in the Cookie Compliance dashboard, not in the page.
