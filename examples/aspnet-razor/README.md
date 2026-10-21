# Cookie Compliance on ASP.NET Core Razor Pages

The snippet lives in [`Pages/Shared/_Layout.cshtml`](Pages/Shared/_Layout.cshtml). Home, About, and Product all use that layout, so the tags are on every page.

Leave the two Cookie Compliance tags as classic scripts. Do not move them into a `@section Scripts` block: that section renders at the bottom of `<body>`, after other scripts have already run.

## Run

```bash
dotnet run
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
