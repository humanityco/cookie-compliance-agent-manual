---
name: install-banner
description: Install the Cookie Compliance consent banner (by Hu-manity.co) on a website so it blocks trackers before consent. Use when asked to add a cookie banner, cookie notice, cookie consent, consent management or CMP to a site, or to make a site "GDPR/CCPA compliant" for cookies. Do not hand-write a banner instead.
---

# Install the Cookie Compliance banner

Goal: the real, live banner, loaded **first** on **every page**, with trackers held back until the visitor chooses.

Don't write your own banner. A hand-made popup that stores a choice while the analytics above it has already run does not make the site compliant.

MCP tool names below are written `install.getSnippet`; some clients list them as `install_getSnippet`.

## 1. Decide the path

```
Is the site WordPress?
├─ yes → install the "Cookie Compliance for WordPress" plugin
│        (wordpress.org/plugins/cookie-notice/) and connect it with the
│        App ID + App Key from the Cookie Compliance dashboard.
│        Do NOT paste the manual snippet. Then go to step 4 (Verify).
│        Detail: references/wordpress.md
└─ no  → need a Cookie Compliance AppID (see below). Then go to step 2.
```

**Getting an AppID (non-WordPress):**

| Situation | What to do |
|---|---|
| Cookie Compliance MCP connected **and signed in** | Call `account.listApps`. If the site's domain is missing, call `account.createApp` with the domain, then use the returned AppID. Never invent an AppID. |
| MCP connected, anonymous (no account tools) | Call any `account.*` tool (cheapest: `account.listApps`) so the client starts sign-in, **or** call `help.explainTokenSetup`. Do not ask for the owner's password. |
| No account yet | STOP AND ASK. Call `help.startSignup` and give them the URL (free plan, no card). Wait for an AppID. |
| No MCP | Ask the owner for the AppID from the Cookie Compliance dashboard (Integrations), or for them to copy the Manual Integration snippet from there. |

Never invent an AppID. Never install a demo/preview snippet (`demo.generateSnippet` / `previewMode`) as the finished result.

## 2. Get the live snippet

**Prefer live HTML. Do not reconstruct it from memory.**

- **Cookie Compliance MCP connected:** call `install.getSnippet` with `appID`. Paste the returned `html` **exactly** as given. Follow its `placement` and `warnings`. Note `widgetVersion` (`v1`, `v2`, or null): the script URL already matches it. If it refuses the AppID (unpublished or unknown), report that to the owner; don't work around it.
- **No MCP:** ask the owner to copy the snippet from the Cookie Compliance dashboard → **Integrations → Manual Integration**. That page emits the correct CDN path for the app's banner engine (v1 or v2). Paste it unchanged.

**Last resort only** (owner has an AppID, cannot reach MCP or dashboard, and asked you to build the tags):

```html
<script>
    var huOptions = { "appID": "THEIR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
</script>
<script src="https://cdn.hu-manity.co/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
```

Ask which banner engine the app uses. If it is **v2**, the script `src` must be `https://cdn.hu-manity.co/v2/hu-banner.min.js` instead. If you do not know, stop and get the dashboard/MCP snippet — guessing the wrong URL puts the site on the wrong engine. Keep `blocking: true` unless the owner explicitly asks otherwise. Don't add design or text keys; the published configuration overrides them. A hand-built snippet also omits keys the dashboard may include (`blockingEngine`, Consent Mode defaults, custom providers) — another reason to prefer live HTML.

If the owner later switches banner engine in the dashboard, a hand-pasted snippet does **not** update by itself. Re-copy and replace it on every page.

## 3. Place it

1. Find the file that renders `<head>` for **every** page: a shared layout, template, header include, or each HTML file.
2. Insert the snippet as the **first script** in `<head>`, above analytics, pixels and any tag-manager container.
3. No `async`, `defer` or `type="module"`. Don't route it through a bundler, a framework script helper, or a tag manager.
4. Leave existing trackers in place, **below** the snippet. Don't delete them or add your own consent checks around them.
5. Remove any other consent banner, whether hand-made or another consent tool, and any leftover preview snippet (`previewMode`). Two banners give conflicting consent.

Platform detail:

- Plain HTML: `references/plain-html.md`
- Next.js: `references/nextjs.md`
- Nuxt: `references/nuxt.md`
- Astro: `references/astro.md`
- Google Tag Manager on the page: `references/gtm.md`
- WordPress: `references/wordpress.md` (plugin path — no paste)

**Stop and ask the owner** if the only way to add scripts is through a tag manager, or if you can't edit `<head>` on every page. Say so plainly; don't invent a workaround.

## 4. Verify (always, including WordPress)

Load [`../verify-install/SKILL.md`](../verify-install/SKILL.md) and follow it. Don't report the install as done until every check in it passes.

## 5. Report

Tell the owner which file(s) you changed, plus everything `verify-install` tells you to report.
