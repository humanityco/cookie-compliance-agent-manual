# Cookie Compliance on NestJS

The snippet lives in [`templates/layout.html`](templates/layout.html). [`src/pages.controller.ts`](src/pages.controller.ts) reads that file and returns it for `/`, `/about`, and `/product`. The Nest compiler never sees the document, so it cannot bundle the tags.

Do not serve a frontend `index.html` through `@nestjs/serve-static` after a build step. A bundler can rewrite the banner into a module script. Return the layout from the controller instead.

## Run

```bash
npm install
npm start
```

Open http://localhost:8098. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
