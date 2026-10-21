# Cookie Compliance on Ruby on Rails

The snippet lives in [`app/views/layouts/application.html.erb`](app/views/layouts/application.html.erb), before `yield :head` and `javascript_importmap_tags`. Home, About, and Product all use that layout.

Do not put the snippet in a page that fills `:head`, and do not let Importmap come first. Importmap tags are module scripts. The banner has to stay a classic synchronous script ahead of them.

## Run

```bash
bundle install
bin/rails server --binding=localhost
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. Importmap tags come after that.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
