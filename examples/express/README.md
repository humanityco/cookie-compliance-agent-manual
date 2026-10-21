# Cookie Compliance on Express

The snippet lives in [`templates/layout.html`](templates/layout.html). `server.js` reads that file and sends it as the document for `/`, `/about`, and `/product`. There is no view engine, so nothing relocates the scripts.

Home, About, and Product all use that file, so each page gets the same head.

## Run

```bash
npm install
npm start
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
