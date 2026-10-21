# Cookie Compliance on Qwik (Vite)

`npm create qwik@latest` has no basic app. Its non-interactive choices are playground, empty, library, and e2e-library. This example is the Vite + Qwik app (`npm create vite@latest -- --template qwik-ts`).

The snippet lives in [`index.html`](index.html), as classic `<script>` tags, ahead of `<script type="module" src="/src/main.tsx">`. Do not put those tags inside a `component$`. The Qwik optimizer rewrites component scripts (it can move them or treat them as modules). Tags in `index.html` stay synchronous: no `async`, `defer`, or `type="module"` on the banner.

Home, About, and Product are URL paths inside that one document (`history.pushState`), so each page gets the same head.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:8105. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. The Qwik entry stays `type="module"` and comes later.

The dev server inserts its own client script ahead of the snippet. Judge the order on the built page: `npm run build`, then open `dist/index.html`.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
