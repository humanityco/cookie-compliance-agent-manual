# Cookie Compliance on Laravel

The snippet lives in [`resources/views/layouts/app.blade.php`](resources/views/layouts/app.blade.php), before `@vite`. Home, About, and Product all extend that layout.

Do not load the banner through Vite. Vite emits a module script, and the banner has to stay a classic synchronous script. `@verbatim` around the inline `huOptions` block keeps Blade from treating the braces as its own syntax.

`public/build/manifest.json` is a tiny prebuilt stylesheet so `@vite` can render without a Node install. It is not the banner.

## Run

```bash
composer install
cp .env.example .env
php artisan serve --host=localhost
```

Open the URL the command prints. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them. The Vite stylesheet tags come after that.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
