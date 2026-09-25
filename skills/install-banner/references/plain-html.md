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

1. **Get the snippet.** Copy it from the dashboard, or ask an agent that has the Cookie Compliance MCP server connected to call `install.getSnippet` with your AppID. It looks like this:

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

| # | Check | Pass |
|---|---|---|
| 1 | **Look at the page** | The banner appears on first visit. There is **no** "Hu-manity PREVIEW — not active consent management" badge (that badge means a demo snippet was installed instead of the real one). |
| 2 | **View the page source** | The `huOptions` block and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. |
| 3 | **Network tab, before clicking anything** | No requests to analytics or ad hosts (for example `google-analytics.com`, `googletagmanager.com/gtag`, `connect.facebook.net`). |
| 4 | **Click Accept, then reload** | Those requests now appear, the banner stays closed, and a `hu-consent` cookie exists. |
| 5 | **Another page** | Repeat checks 1–2 on an inner page, not only the homepage. |

Check 3 is the one that matters for compliance. In the Elements panel, blocked tags show `type="javascript/blocked"`, but the network tab is the real proof, because a script can still inject other scripts.

## Gotchas

- **Automated browsers see no banner.** The widget deliberately doesn't run when the browser reports that it is automated (`navigator.webdriver`), or when the user agent looks like a bot, including `HeadlessChrome`. If you check with Playwright, Puppeteer or Selenium, hide `navigator.webdriver` and use a normal desktop user agent, or you'll get a false "banner missing".
- **"Combine" or "minify JS" optimisers** (in hosting panels or caching plugins) can merge or move the snippet. Exclude both tags from them.
- **"Banner not showing" right after signup** usually means the configuration was saved but not **published** in the dashboard.
- **Only install your own AppID.** Consent recorded by the snippet is logged against that app, together with the page address it came from.
