# Cookie Compliance on Angular

The snippet lives in [`src/index.html`](src/index.html). That file is the document for every route, including Home, About, and Product.

Do not put it in a component template. Angular renders those after bootstrap. Do not add the banner to the `scripts` array in `angular.json`. That array is bundled, so the tag is no longer a synchronous script at the start of `<head>`.

## Run

```bash
npm install
npm start
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. Angular's own bundles are injected later.

`ng serve` inserts its own client script ahead of the snippet. Judge the order on the built page: `npm run build`, then open `dist/angular/browser/index.html`.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
