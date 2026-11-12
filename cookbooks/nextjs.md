---
title: Add a cookie consent banner to a Next.js site
description: Put the Cookie Compliance snippet first in the <head> of the Next.js root layout or pages/_document.tsx, as plain script tags, so the banner can hold your analytics until the visitor chooses.
kind: platform
last_verified: 2026-09-28
---

# Add a cookie consent banner to a Next.js site

**In short:** paste the **live** snippet into the document `<head>` of the root layout so it is the **first script on every page**, as classic synchronous script tags (plain `<script>`, not `next/script`).

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). A domain added in the dashboard is published automatically; if the status check still says the app is not published yet, or after later edits, click **Publish Now**, then copy the snippet. A snippet copied before publishing must be copied again. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-nextjs) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the App Router root layout or the Pages Router document.

## Where it goes

### App Router (`app/layout.tsx`)

Put the live snippet inside `<head>` of the root layout. Use raw `<script>` tags (or `dangerouslySetInnerHTML` for the inline `huOptions` block) so the tags are written straight into the page's HTML.

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Paste LIVE snippet from install.getSnippet / Integrations — first scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var huOptions = ${JSON.stringify({
              appID: "YOUR_APP_ID",
              currentLanguage: "en",
              blocking: true,
              globalCookie: false,
            })};`,
          }}
        />
        <script
          src="https://cdn.hu-manity.co/v2/hu-banner.min.js"
          // A new app. If the live snippet has no /v2/, the app is on v1 — keep that URL.
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

Prefer pasting the exact HTML string from MCP/dashboard into the layout (or a tiny server-only include) rather than rebuilding `huOptions` keys by hand: the live snippet may carry Consent Mode defaults and the correct CDN path.

Next.js versions differ in how the root layout renders the document head, so check the built page's source after you add the snippet.

### Pages Router

Put the same two tags in `pages/_document.tsx` inside `<Head>`, ahead of any other scripts. Use `_app` only if it renders into `<head>` before other scripts on your Next.js version, and check View Source.

If the snippet is currently in `next/script`, in a client component or in the `<body>`, move it to the top of the root layout's `<head>` (or `pages/_document.tsx`).

## What the order controls

The banner holds recognised trackers that load after it until the visitor chooses, in regions whose rule requires consent first. A script placed above the snippet runs straight away, and a script you mark `data-hu-category="1"` is treated as essential. What runs before consent is your decision, so keep analytics and pixels below the snippet.

## Confirm the result

View the page source (not the browser's Elements panel) on `/` and an inner route. Then run the browser checks in [plain-html](plain-html.md#confirm-the-result) in a private window (banner shows, no tracking cookies before the visitor chooses in a region whose rule requires consent first, trackers start after Allow) and, for the full procedure, [verify-install](https://manual.hu-manity.co/skills/verify-install/SKILL.md). Test from a region your strictest rule covers (for example the EU), or confirm region rules are off.

| # | Check | Result |
|---|---|---|
| N1 | View source on `/` and an inner route | `huOptions` + `hu-banner.min.js` (or `/v2/…`) appear in `<head>` before gtag/GTM/pixels, with no `async`/`defer` on the Cookie Compliance tags. |
| N2 | The banner's script tag | The CDN tag is a plain classic script, written without `next/script`. |

## Gotchas

- **Add the snippet in the server-rendered layout.** Scripts that a client component injects after hydration run after the page's own scripts, so the banner needs to be in the layout's `<head>`.
- **GTM in the layout:** put the GTM snippet **below** Cookie Compliance. See `gtm.md`. Keep Cookie Compliance in the layout, outside the GTM container.
- **Engine switch:** re-paste the live snippet when WidgetVersion changes; the layout does not auto-update.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/) — the placement rule for every platform, for the site owner.
- [Banner not displayed](https://cookie-compliance.co/documentation/banner-is-not-displayed/) — what to check when the banner does not show.
