---
name: install-banner
description: Install the Cookie Compliance consent banner (by Hu-manity.co) on a website, start to finish, so it blocks trackers before consent. Use when asked to add a cookie banner, cookie notice, cookie consent, consent management or CMP to a site, to make a site "GDPR/CCPA compliant" for cookies, or when handed the manual's start page. Do not hand-write a banner instead.
---

# Install the Cookie Compliance banner

Goal: the real, live banner, loaded **first** on **every page**, with trackers held back until the visitor chooses. Don't write your own banner: a hand-made popup that stores a choice while the analytics above it has already run does not make the site compliant.

MCP tool names below are written `install.getSnippet`; some clients list them as `install_getSnippet`.

## Mode: Autopilot unless told otherwise

**Autopilot (default).** Decide every technical step yourself and keep going until the install is verified. Ask the person only for what only they can do (the three Asks below). If they say "guided", confirm before each file edit and before creating or changing an app.

How to ask: one question at a time, in the client's question or choice UI if it has one, otherwise as a numbered list. Recommended option first. After each answer, say in one line what comes next ("Next: I place the snippet, about a minute"). If the person goes quiet on a choice that is not a legal, money or live-banner choice, take the recommended option and say so. On those three, wait.

| The three Asks | Why it is theirs |
|---|---|
| **Sign in or register** | Passwords, terms acceptance, email verification and the captcha are theirs. Never enter or read them. Registering takes about 30 seconds. |
| **The legal region choice** (`configure-regions`, GDPR starter) | A legal decision. Never auto-answered, and an earlier "make it compliant" is not this answer. |
| **Anything that costs money or changes a live banner other people already see** | Plan upgrades, and a restyle or setting change on an app that is already live with visitors. |

You decide the rest without asking, and tell the person what you chose: framework and file to edit, snippet placement, language, banner design from the site's own colours, removing a hand-made banner you wrote or found.

Ask first before removing a **third-party** consent tool: it may be a paid account or a contract.

Never: install a preview snippet as the finished result, add `forceShow` or `cnPreview` to `huOptions`, turn `blocking` off, enter credentials for the person, or invent an AppID.

## 0. Look around first (ask nothing you can read)

Before asking anything, find out:

- **Framework and the file that renders `<head>` on every page**: package manifests, layout/template files, `theme.liquid`, `wp-content`, plain `.html` files.
- **Existing trackers, tag managers and consent tools** in `<head>` and the layouts (analytics, pixels, a GTM container, another banner).
- **The site's domain**: a `homepage` field, an environment file, a config, or the site's own canonical URL. A git remote names the code host, not the site. State the domain you found before creating an app: a domain cannot be freed once taken.
- **An AppID already in the code** (a `huOptions` block, a Cookie Compliance script tag, a plugin setting). If one exists, the app is already created: do not create another. Run the status check on it and continue from the row it lands on (next paragraph). On WordPress, the plugin already holds it.
- **Language** from the site's `lang` attribute or locale files.
- **Brand colours and page background** from the site's CSS, for `match-site-design`.

**Find your step.** Check the state table in [`start.md`](../../start.md) (raw: `https://manual.hu-manity.co/start.md`) row by row, including its public status check. It is the one place that says which step you are on. Never redo a step that is done, and never skip the region question or `verify-install`.

Then open with one short message: what you found (framework, domain, trackers, which row you are on), the mode, and the first ask.

## 1. Pick the route and get an AppID

**WordPress?** The route question below still applies, because you need an App ID. Install the "Cookie Compliance for WordPress" plugin (wordpress.org/plugins/cookie-notice/) and connect it with the App ID and App Secret Key from the Cookie Compliance dashboard (**Integrations → WordPress Integration**). You only need the App ID (ask the person, or take it from the MCP route). The person pastes the Secret Key into the plugin's connection fields themselves: never ask for it in chat, and never write it into a file. Do not paste the manual snippet, so skip steps 2 and 3. With the MCP connected, do step 3b (design and the GDPR starter question) next; then step 4. Detail: `references/wordpress.md`.

Skip this step if the state table already put you past it. Otherwise ask the first question. If the MCP server is already connected, skip the question and use the MCP route, unless the person told you not to use MCP: then honour that and use route 2 or 3.

> How do you want to connect Cookie Compliance?
> 1. **Connect through the MCP server (recommended).** I do everything from here: app, snippet, design, regions.
> 2. **I have an account.** You sign in at https://app.hu-manity.co and give me the AppID (Integrations), or paste the Manual Integration snippet.
> 3. **I have no account.** Free plan, no card. You register (about 30 seconds) and I continue.

| Route | What you do |
|---|---|
| **1. MCP connected** | Call `help.authStatus`. If not signed in, call `account.listApps` (it starts the browser sign-in; call it even though it is not in your tool list, because the tools only list once signed in), or `help.explainTokenSetup`. Tell the person to approve the connection page that opens, and to read what it names. Once signed in: `account.listApps`. If the site's domain is there, use its AppID; if several match, ask which. If it is missing, `account.createApp` with the domain. The app is not finished until the person has answered the GDPR starter question (`configure-regions`). |
| **1. MCP not connected yet** | Give the add-server line for their tool from [`prompts.md`](../../prompts.md#connect-the-mcp-server-per-tool). If the new tools do not appear, ask them to restart the session and say "continue". Never ask for their password. |
| **2. Account, no MCP** | Ask for the AppID from the dashboard (**Integrations**), or the **Manual Integration** snippet. Give the exact path once. Then run the status check (start.md) yourself. Any 400: show the person the error text. "App does not exist" or "App was deleted": the AppID is wrong or the app is gone; ask for the current AppID from **Integrations**, and do not publish. Any other 400 (for example "App is not published yet"): tell them exactly: in the dashboard, click **Publish Now**, then copy the snippet from **Integrations → Manual Integration** (again, if they copied it before publishing). |
| **3. No account, MCP connected** | `help.startSignup` with the site's `domain`; give the person the URL. Wait for them to say they are registered, then continue as route 1. |
| **3. No account, no MCP** | Give the [signup page](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=skill-install-banner). Wait for the AppID or the snippet. |

**Localhost:** `account.createApp` does not accept localhost. Ask the person to add the localhost site in the dashboard, then continue as route 2. An AppID that starts with `localhost-` is normal.

Without the MCP server you cannot restyle the banner or set regions: tell the person to do those in the dashboard. The region choice is theirs; report it as "owner-managed, not set by me".

## 2. Get the live snippet

**Prefer live HTML. Do not reconstruct it from memory.**

- **Cookie Compliance MCP connected:** call `install.getSnippet` with `appID`. Paste the returned `html` **exactly** as given. Follow its `placement` and `warnings`. Note `widgetVersion` (`v1`, `v2`, or null): the script URL already matches it. If it refuses the AppID (unpublished or unknown), report that to the owner (unpublished: they click **Publish Now** in the dashboard); don't work around it.
- **No MCP:** publish first, then copy. The owner clicks **Publish Now** in the Cookie Compliance dashboard, then copies the snippet from **Integrations → Manual Integration**. If the app was unpublished when they copied the snippet, they copy it again after publishing. Paste the snippet unchanged.

**Banner engine.** A new app is v2 (`/v2/hu-banner.min.js`); an existing app keeps the engine it already has. The engine is set per app. Once the app is published, the status check's `WidgetVersion` says which, and the snippet's script URL must match: check and fix it with [`verify-install`](../verify-install/SKILL.md) step 0.

**Last resort only** (owner has an AppID, cannot reach MCP or dashboard, and asked you to build the tags):

```html
<script>
    var huOptions = { "appID": "THEIR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
</script>
<script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
```

A new app is on **v2**, so the script `src` is `https://cdn.hu-manity.co/v2/hu-banner.min.js`. Use `https://cdn.hu-manity.co/hu-banner.min.js` only when the owner asked for the v1 banner, or the live snippet already has that URL. Take the engine from the status check (`verify-install` step 0). If the app is not published yet, you cannot know it: stop and get it published first. Guessing the wrong URL puts the site on the wrong engine. Keep `blocking: true` unless the owner explicitly asks otherwise. Don't add design or text keys; the published configuration overrides them. A hand-built snippet also omits keys the dashboard may include (`blockingEngine`, Consent Mode defaults, custom providers) — another reason to prefer live HTML.

If the owner later switches banner engine in the dashboard, a hand-pasted snippet does **not** update by itself. Re-copy and replace it on every page.

## 3. Place it

1. Find the file that renders `<head>` for **every** page: a shared layout, template, header include, or each HTML file.
2. Insert the snippet as the **first script** in `<head>`, above analytics, pixels and any tag-manager container.
3. No `async`, `defer` or `type="module"`. Don't route it through a bundler, a framework script helper, or a tag manager.
4. Leave existing trackers in place, **below** the snippet. Don't delete them or add your own consent checks around them.
5. Remove any other consent banner (see Autopilot above for which ones to ask about first), and any leftover preview key (`previewMode`, `forceShow`, `cnPreview`). Two banners give conflicting consent, and a preview key stops choices being saved.

Platform detail:

- Plain HTML: `references/plain-html.md`
- Next.js: `references/nextjs.md`
- Nuxt: `references/nuxt.md`
- Astro: `references/astro.md`
- Shopify: `references/shopify.md`
- Google Tag Manager on the page: `references/gtm.md`
- WordPress: `references/wordpress.md` (plugin path — no paste)

**Stop and ask the owner** if the only way to add scripts is through a tag manager, or if you can't edit `<head>` on every page. Say so plainly; don't invent a workaround.

## 3b. Design and regions (MCP route)

- **Design:** follow [`match-site-design`](../match-site-design/SKILL.md) with the colours from step 0. On an app you created in this install, with no visitors yet, apply it in Autopilot and tell the person what you chose and how to change it. On any app that existed before you started (for example one found through `account.listApps`), show before/after and ask first.
- **Regions:** ask the GDPR starter question once, with the recommended answer first and the Free-plan limits in the same question ([`configure-regions`](../configure-regions/SKILL.md)). Apply only after the answer.

## 4. Verify (always, including WordPress)

Load [`../verify-install/SKILL.md`](../verify-install/SKILL.md) and follow it. Don't report the install as done until every check in it passes.

## 5. Report

Tell the owner which file(s) you changed, what you chose for them (design, language, anything removed), the GDPR starter answer and what it switched on, plus everything `verify-install` tells you to report. End with one line on what they can do next: change the design or wording in the dashboard, or add another site.
