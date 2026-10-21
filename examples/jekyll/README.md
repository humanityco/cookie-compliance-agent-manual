# Cookie Compliance on Jekyll

The snippet lives in [`_layouts/default.html`](_layouts/default.html), before any extra head content. Home, About, and Product use that layout, so each page gets the same head.

## Run

```bash
bundle install
bundle exec jekyll serve --host localhost --port 8106
```

Open http://localhost:8106. View Source on `/`, `/about/`, and `/product/`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
