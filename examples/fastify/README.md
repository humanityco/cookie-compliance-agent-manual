# Cookie Compliance on Fastify

The snippet lives in [`templates/layout.html`](templates/layout.html). `server.js` reads that file and sends it with `reply.type('text/html')` for `/`, `/about`, and `/product`.

Do not inject the snippet from an `onSend` hook or a view plugin. Those can wrap the document or add `defer`. The route sends the layout file as text, so nothing rewrites the tags.

## Run

```bash
npm install
npm start
```

Open http://localhost:8097. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
