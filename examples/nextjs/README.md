# Cookie Compliance on Next.js (App Router)

The snippet lives in [`app/layout.tsx`](app/layout.tsx), as raw `<script>` tags inside `<head>`. They are an HTML string on the `<head>` element, not JSX `<script>` elements. Do not use `next/script`, and do not set `afterInteractive` or `lazyOnload`. Do not put the snippet in a client component.

JSX `<script>` tags are the trap on Next.js 16. The built page hoists them, and an `async` placeholder then renders ahead of `huOptions`. The HTML string keeps `huOptions` first, then `hu-banner.min.js` with no `async` or `defer`, then the placeholder. Next's own runtime scripts come after that.

Home, About, and Product are routes in that layout, so each page gets the same head.

## Run

```bash
npm install
npm run dev
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
