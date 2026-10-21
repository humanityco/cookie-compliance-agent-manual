# Cookie Compliance on Eleventy

The snippet lives in [`src/_includes/base.njk`](src/_includes/base.njk), as raw `<script>` tags. Home, About, and Product use that layout. Nothing in the layout prints the tags from a shortcode.

Do not emit the banner from a shortcode or a JavaScript bundle plugin. Eleventy leaves raw script tags in this Nunjucks layout unchanged, but a shortcode or a bundler can add `defer` or `type="module"`. `npm run build` writes `dist/`. The banner tags there stay classic synchronous scripts.

## Run

```bash
npm install
npm start
```

`npm start` builds `dist/` and serves it. Open http://localhost:8099. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
