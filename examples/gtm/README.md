# Cookie Compliance with Google Tag Manager

The snippet is the first scripts in [`index.html`](index.html), [`about/index.html`](about/index.html), and [`product/index.html`](product/index.html). The GTM container (`gtm.js?id=GTM-XXXX`, head script plus the noscript iframe) comes after it. Never put the banner inside GTM. A tag that fires from the container is already too late. See [gtm](../../cookbooks/gtm.md).

There is no layout engine, so each page repeats that order.

## Run

```bash
python3 -m http.server 8101 --bind localhost
```

Open http://localhost:8101. View Source on `/`, `/about/`, and `/product/`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The GTM bootstrap comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
