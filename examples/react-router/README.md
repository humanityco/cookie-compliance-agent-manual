# Cookie Compliance on React Router

The snippet lives in [`app/root.tsx`](app/root.tsx), on the root layout document. It is an HTML string on `<head>` (`dangerouslySetInnerHTML`), not JSX `<script>` elements, and not a client `useEffect`.

React Router 8 renders with React 19, which hoists JSX `<script>` tags the way Next.js 16 does. An `async` placeholder then lands ahead of `huOptions`. The HTML string is the same fix as [Next.js](../nextjs/README.md): `huOptions` first, then `hu-banner.min.js` with no `async` or `defer`, then the placeholder. The framework's own scripts come after that.

Home, About, and Product are routes in that layout, so each page gets the same head.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:8103. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
