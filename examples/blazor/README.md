# Cookie Compliance on a Blazor Web App

The snippet lives in [`Components/App.razor`](Components/App.razor), before `<HeadOutlet />` and before `blazor.web.js`. Home, About, and Product are routes inside that same document.

Do not load the banner from a component after render, or from a JS interop call. By then other scripts may already have run.

A Blazor WebAssembly app has no `App.razor` document. Put the same two tags first in `wwwroot/index.html` instead. This sample is the Blazor Web App (static server rendering).

## Run

```bash
dotnet run
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
