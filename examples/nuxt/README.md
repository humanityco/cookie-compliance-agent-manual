# Cookie Compliance on Nuxt

The snippet lives in [`nuxt.config.ts`](nuxt.config.ts), in `app.head.script`. Do not put it in a client plugin or a `useHead()` call inside a page. Do not mark any script in that array `async` or `defer`. Nuxt can hoist an async script ahead of the banner. Do not set `charset` on the banner entry: with that key set, Nuxt 4.6 left the banner tag out of the response. `tagPriority` keeps these three tags ahead of Nuxt's import map.

Home, About, and Product are pages under `app/pages`, so each page gets the same head. The dev response on this Nuxt version already has `huOptions` first. The Vite client comes after it.

## Run

```bash
npm install
npm run dev
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them, and it is synchronous so Nuxt does not hoist it.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
