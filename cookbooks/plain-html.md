---
title: Add Cookie Compliance to a plain HTML site
kind: platform
last_verified: 2026-09-25
---

# Add Cookie Compliance to a plain HTML site

**In short:** paste the two-tag snippet as the **first thing inside `<head>`** on **every page**, above every other script. Leave your analytics tags where they are, below it.

## You need

- A Cookie Compliance **AppID**, for example `examplecom-1a2b3c4`. You'll find it in the Cookie Compliance dashboard. No account yet? Sign up; the free plan needs no card.
- Access to edit the HTML of every page, or the shared header file they all include.

## The wrong way

```html
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
  <script>/* gtag config */</script>

  <!-- banner added last, "so it doesn't slow the page down" -->
  <script async src="https://cdn.hu-manity.co/hu-banner.min.js"></script>
</head>
```

The banner shows up, but Google Analytics has **already run and set its cookies** before the visitor sees it. The consent is decoration. Three things are wrong here:

1. The snippet comes **after** a tracker. The widget can only block scripts that haven't run yet.
2. `async` lets the browser run it whenever it likes, so the order is lost.
3. The `huOptions` block is missing, so the widget doesn't know which app it belongs to.

## The right way

1. **Get the snippet.** Copy it from the dashboard, or ask an agent that has the Cookie Compliance MCP server connected to use its `getSnippet` tool (listed as `install.getSnippet` or `install_getSnippet`, depending on the client) with your AppID. It looks like this:

   ```html
   <script>
       var huOptions = {
           "appID": "YOUR_APP_ID",
           "currentLanguage": "en",
           "blocking": true,
           "globalCookie": false
       };
   </script>
   <script src="https://cdn.hu-manity.co/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
   ```

2. **Put it first in `<head>`**, before anything else that runs code:

   ```html
   <head>
     <meta charset="utf-8">
     <!-- Cookie Compliance: FIRST script on the page -->
     <script>
         var huOptions = { "appID": "YOUR_APP_ID", "currentLanguage": "en", "blocking": true, "globalCookie": false };
     </script>
     <script src="https://cdn.hu-manity.co/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>

     <!-- your existing tags stay here, unchanged -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
   </head>
   ```

3. **Repeat on every page.** If your pages share a header include, put it there once.

4. **Leave your trackers alone.** Don't delete them and don't wrap them in your own "if consented" code. The widget holds them back until the visitor agrees.

**Options in `huOptions`:**

| Key | Default | Change it when |
|---|---|---|
| `blocking` | `true` | Almost never. `false` means scripts run before consent. |
| `currentLanguage` | `"en"` | The page is in another language (two-letter code). |
| `globalCookie` | `false` | Consent should be shared across your subdomains. |

Colours, wording, consent categories and regions are **not** set here. They live in your published configuration in the dashboard, and anything you add to the page for them is overwritten when the banner loads.

## Check it works

Use a **private window**, so no earlier consent is remembered.

**Your location matters.** If region rules are switched on in the dashboard, the banner and the blocking follow the rule for the visitor's region. Some regions may be set to show no banner, or not to block. Test from a location covered by your strictest rule (for example the EU), or confirm region rules are off, before judging checks 1 and 3.

| # | Check | Pass |
|---|---|---|
| 1 | **Look at the page** | The banner appears on first visit. There is **no** "Hu-manity PREVIEW — not active consent management" badge (that badge means a demo snippet was installed instead of the real one). |
| 2 | **View the page source** | The `huOptions` block and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`, and the page contains no `previewMode`. |
| 3 | **Before clicking anything** | No tracking cookies (for example `_ga`, `_gcl_au`, `_fbp`) in the Application → Cookies panel, and no requests to analytics or ad hosts in the Network tab. |
| 4 | **Accept all** | Trackers start loading straight away, with no reload needed. After a reload the banner stays closed and a `hu-consent` cookie exists. |
| 5 | **Another page** | Repeat checks 1–2 on an inner page, not only the homepage. |

Check 3 is the one that matters for compliance. In the Elements panel, blocked tags show `type="javascript/blocked"`, but cookies and network requests are the real proof, because a script can still inject other scripts.

**Google, Meta or Microsoft Consent Mode on?** Then their loader scripts (such as `googletagmanager.com/gtag/js` or `connect.facebook.net`) are **allowed to load before consent** on purpose. They receive a "denied" consent signal instead of being blocked. With Google Consent Mode, cookieless pings to `google-analytics.com` that carry the denied state are expected too. Seeing those requests is correct. Judge check 3 by the cookies: none of their tracking cookies should appear before the visitor accepts.

## Gotchas

- **Automated browsers see no banner.** The widget deliberately doesn't run when the browser reports that it is automated (`navigator.webdriver`), or when the user agent looks like a bot, including `HeadlessChrome`. If you check with Playwright, Puppeteer or Selenium, hide `navigator.webdriver` and use a normal desktop user agent, or you'll get a false "banner missing".
- **"Combine" or "minify JS" optimisers** (in hosting panels or caching plugins) can merge or move the snippet. Exclude both tags from them.
- **"Banner not showing" right after signup:** one common cause is a configuration that was saved but not **published** in the dashboard.
- **Remove any other consent banner.** If the site already has a hand-made cookie popup or another consent tool, take it out. Two banners give visitors two conflicting choices.
- **Only install your own AppID.** Consent recorded by the snippet is logged against that app, together with the page address it came from.
