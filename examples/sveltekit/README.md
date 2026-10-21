# Cookie Compliance on SvelteKit

The snippet lives in [`src/app.html`](src/app.html), before `%sveltekit.head%`. SvelteKit emits `app.html` as written, so those tags stay synchronous. Home, About, and Product all render inside that document.

Do not move the snippet into a `+layout.svelte` `<svelte:head>` block or a component. Keep it in `app.html`.

## Run

```bash
npm install
npm run dev
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. SvelteKit's module scripts come later.

The dev server inserts its own client script ahead of the snippet. Judge the order on the built page: `npm run build`, then `npm run preview`.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
