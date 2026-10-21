# Cookie Compliance on a Vue SPA (Vite)

The snippet lives in [`index.html`](index.html), as classic `<script>` tags, ahead of `<script type="module" src="/src/main.js">`.

Do not put it in a Vue component, a plugin, or `onMounted`. Those run after the module graph has started. Do not give the banner tag `type="module"`, `async`, or `defer`.

Home, About, and Product are routes inside that one document, so each page gets the same head.

## Run

```bash
npm install
npm run dev
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. The Vue entry stays `type="module"` and comes later.

The dev server inserts its own client script ahead of the snippet. Judge the order on the built page: `npm run build`, then `npm run preview`.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
