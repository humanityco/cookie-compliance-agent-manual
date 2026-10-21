# Cookie Compliance on Symfony

The snippet lives in [`templates/base.html.twig`](templates/base.html.twig), as the first scripts in `<head>`, before `{% block title %}` and `{% block extra_head %}`. Home, About, and Product extend that template. `public/index.php`, `public/about/index.php`, and `public/product/index.php` call the same front controller, which renders the matching Twig template. The PHP built-in server maps `/about` and `/product` to those directories, so the app does not need a rewrite rule.

Do not put the snippet in `{% block extra_head %}` or in a `{% block javascripts %}` that calls `importmap()`. A child template can replace those blocks, and AssetMapper emits module scripts. Leave the banner tags as literal markup before any block. Do not print them with `{{ }}`. Twig would escape them.

## Run

```bash
composer install
php -S localhost:8096 -t public
```

Open http://localhost:8096. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
