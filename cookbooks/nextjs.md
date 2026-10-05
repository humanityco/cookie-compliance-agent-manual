---
title: Add Cookie Compliance to a Next.js site
kind: platform
last_verified: 2026-09-28
---

# Add Cookie Compliance to a Next.js site

**In short:** paste the **live** snippet into the document `<head>` of the root layout so it is the **first script on every page**, as classic synchronous tags — not via `next/script` with `strategy`, not in a client component that hydrates later.

## You need

- A Cookie Compliance AppID and the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration** (a new app uses `/v2/hu-banner.min.js`; an existing app keeps the URL in that snippet). No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&utm_source=agent-manual&utm_medium=docs&utm_content=cookbook-nextjs) (free plan, no card); with MCP, call `help.startSignup`.
- Edit access to the App Router root layout or the Pages Router document.

## The wrong way

```tsx
// app/layout.tsx — BAD
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://cdn.hu-manity.co/hu-banner.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

Problems: loaded after the page (and usually after analytics), `next/script` strategies break execution order, and `huOptions` is missing. Consent becomes decoration.

## The right way

### App Router (`app/layout.tsx`)

Put the live snippet inside `<head>` of the root layout. Use raw `<script>` tags (or `dangerouslySetInnerHTML` for the inline `huOptions` block). Do **not** wrap the CDN file in `next/script` with `afterInteractive` / `lazyOnload`.

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

Prefer pasting the exact HTML string from MCP/dashboard into the layout (or a tiny server-only include) rather than rebuilding `huOptions` keys by hand — the live snippet may carry Consent Mode defaults and the correct CDN path.

Confirm this file still owns the document head in your Next.js version before treating the path as fixed.

### Pages Router

Put the same two tags in `pages/_document.tsx` inside `<Head>`, ahead of any other scripts. Only use `_app` if that path still renders into `<head>` before other scripts on your Next version — verify in View Source.

## Check it works

Same table as the install-banner skill / plain-html cookbook. Extra:

| # | Check | Pass |
|---|---|---|
| N1 | View source on `/` and an inner route | `huOptions` + `hu-banner.min.js` (or `/v2/…`) appear in `<head>` before gtag/GTM/pixels, with no `async`/`defer` on the Cookie Compliance tags. |
| N2 | No `next/script` strategy on the banner | The CDN tag is a plain classic script. |

## Gotchas

- **Client components** that inject scripts after hydration are too late for pre-consent blocking.
- **GTM in the layout:** leave the GTM snippet **below** Cookie Compliance — see `gtm.md`. Never put Cookie Compliance inside the GTM container.
- **Engine switch:** re-paste the live snippet when WidgetVersion changes; the layout does not auto-update.
