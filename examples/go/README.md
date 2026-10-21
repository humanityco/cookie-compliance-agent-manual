# Cookie Compliance on Go

The snippet lives in [`templates/layout.html`](templates/layout.html), as literal tags. Home, About, and Product define only the main content. Do not pass the snippet through a `{{ }}` action. `html/template` would escape it.

The module path is `example.com/cookie-compliance-go`. It imports only the standard library, so there is no `go.sum`. Do not commit a `go.sum` that points at a module proxy. If you add a third-party module later, run `go mod download` locally and keep proxy URLs out of the repo.

## Run

```bash
go run .
```

Open http://localhost:8093. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
