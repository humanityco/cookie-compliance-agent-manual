# Cookie Compliance on Astro

The snippet lives in [`src/layouts/Layout.astro`](src/layouts/Layout.astro). Every Cookie Compliance `<script>` and the placeholder analytics tag has `is:inline`. Without it, Astro rewrites the tags into deferred modules.

Home, About, and Product use that layout, so each page gets the same head.

## Run

```bash
npm install
npm run dev
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`, and they are not `type="module"`. The placeholder analytics tag comes after them.

`npm run dev` adds the Vite client after those tags. The built page (`npm run build`) is the one without that client. `is:inline` is what keeps the snippet from becoming a deferred module in either one.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
