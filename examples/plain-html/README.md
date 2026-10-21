# Cookie Compliance on plain HTML

There is no layout engine, so the same snippet is the first scripts in `<head>` of [`index.html`](index.html), [`about/index.html`](about/index.html), and [`product/index.html`](product/index.html). A shared head partial is not available. If a page omits the tags, that page does not block trackers. The rule is the same one in [plain-html](../../cookbooks/plain-html.md): every page, first scripts, no `async` or `defer` on the banner.

## Run

```bash
python3 -m http.server 8100 --bind localhost
```

Open http://localhost:8100. View Source on `/`, `/about/`, and `/product/`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
