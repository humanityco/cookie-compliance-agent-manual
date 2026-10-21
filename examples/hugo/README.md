# Cookie Compliance on Hugo

The snippet lives in [`layouts/baseof.html`](layouts/baseof.html). Hugo 0.168 looks up that file, not `layouts/_default/baseof.html`. The snippet is the first scripts in `<head>`, before the `head` block. This site does not call the theme partial `head/js.html`, which emits a `<script>` when `assets/js/main.js` exists. Anything added in the `head` block stays after the banner.

Home, About, and Product use that layout, so each page gets the same head.

## Run

```bash
hugo server --bind localhost --port 8107
```

Open http://localhost:8107. View Source on `/`, `/about/`, and `/product/`. In the template, `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

`hugo server` injects `livereload.js` (with `defer`) as the first script in `<head>`. That tag is not in the template. Judge the built page instead: `hugo`, then open `public/index.html`. The banner scripts are first there.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
