# Install Cookie Compliance on your platform

**In short:** the banner is one two-tag snippet that works on any site where you can place code in the `<head>`, whatever it is built with. What changes from platform to platform is **where the snippet goes**. Find your platform below for the exact spot, or use the general steps if it isn't listed.

## The one rule

Blocking works by **execution order**: the banner holds the recognised trackers that come after it, in regions whose rule requires consent first. So the snippet goes **first** on every page, in `<head>`, as plain synchronous tags (no `async`, `defer` or `type="module"`), above analytics, pixels and any tag manager.

Scripts you mark essential (`data-hu-category="1"`) run straight away. Recognised trackers wait for the visitor's choice, in regions whose rule requires consent first. What runs before consent is your decision.

## Platforms with a guide

Each guide shows where the snippet goes and how to confirm it.

| Platform | Where the snippet goes | Guide |
|---|---|---|
| WordPress | Install the Cookie Compliance for WordPress plugin, which handles placement | [wordpress](cookbooks/wordpress.md) |
| Shopify | First thing in `<head>` of `layout/theme.liquid` | [shopify](cookbooks/shopify.md) |
| Next.js | The document `<head>` of the root layout, as classic script tags | [nextjs](cookbooks/nextjs.md) |
| Nuxt | `app.head.script` in `nuxt.config.ts`, kept synchronous | [nuxt](cookbooks/nuxt.md) |
| Astro | The shared layout's `<head>`, with `is:inline` on every tag | [astro](cookbooks/astro.md) |
| Angular | `<head>` of `src/index.html` | [angular](cookbooks/angular.md) |
| React or Vue (Vite) | `<head>` of `index.html`, ahead of the module entry | [vite](cookbooks/vite.md) |
| SvelteKit | `src/app.html`, above `%sveltekit.head%` | [sveltekit](cookbooks/sveltekit.md) |
| Google Tag Manager | `<head>`, above the GTM container | [gtm](cookbooks/gtm.md) |
| Hugo | The head partial or `baseof.html` your layouts render on every page, first | [hugo](cookbooks/hugo.md) |
| Gatsby | `gatsby-ssr.js` `setHeadComponents` with the snippet first, or a custom `src/html.js` | [gatsby](cookbooks/gatsby.md) |
| Docusaurus | `headTags` in `docusaurus.config.js`, as two synchronous script entries | [docusaurus](cookbooks/docusaurus.md) |
| Laravel | Directly after `<head>` in the shared Blade layout, above `@fonts` and `@vite` | [laravel](cookbooks/laravel.md) |
| Django | First thing in `<head>` of the base template every page extends | [django](cookbooks/django.md) |
| Rails | Directly after `<head>` in `app/views/layouts/application.html.erb` | [rails](cookbooks/rails.md) |
| Drupal | The theme's `html.html.twig`, first in `<head>` (or a small module with a low library weight) | [drupal](cookbooks/drupal.md) |
| Joomla | The template's `index.php`, first in `<head>` above the scripts include (or a system plugin) | [joomla](cookbooks/joomla.md) |
| Ghost | The theme's `default.hbs`, first in `<head>` above `{{ghost_head}}` | [ghost](cookbooks/ghost.md) |
| PrestaShop | The theme's `_partials/head.tpl`, at the very top (or a `displayHeader` module at position 1) | [prestashop](cookbooks/prestashop.md) |
| Magento | `Magento_Theme/templates/root.phtml` in your theme, first inside `<head>` | [magento](cookbooks/magento.md) |
| Wix | **Settings → Custom Code**, on all pages, placed in Head | [wix](cookbooks/wix.md) |
| Squarespace | **Code Injection → Header** (a plan that includes code injection) | [squarespace](cookbooks/squarespace.md) |
| Webflow | **Site settings → Custom code → Head code**, then publish | [webflow](cookbooks/webflow.md) |
| Framer | **Site Settings → Custom Code**, at the start of `<head>`, then publish | [framer](cookbooks/framer.md) |
| Static HTML or any other site you edit directly | First thing in `<head>` on every page (or the shared header file) | [plain-html](cookbooks/plain-html.md) |

## Your platform isn't listed

If you can put code in the `<head>` of every page, the plain HTML steps apply:

1. Copy the live snippet from the dashboard (**Integrations → Manual Integration**), or with the MCP server connected call `install.getSnippet`. Paste it unchanged. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=platforms) (free plan, no card).
2. Paste it as the first thing inside `<head>`, on every page or in the shared header your pages include.
3. Confirm it with [verify-install](skills/verify-install/SKILL.md): in a region whose rule requires consent first, no tracking cookies appear before the visitor chooses. It also explains what to expect with Google Consent Mode.

The banner works from any spot that comes first in `<head>`. Most site builders have a header or head-code field: use that one. If a platform offers only a footer or `<body>` code box, look for its header option, or a template where you can edit `<head>`. [verify-install](skills/verify-install/SKILL.md) confirms the result. A coding agent that finds no head position should tell the site owner which options exist before installing.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/): the placement rule, for the site owner.
- [trackers](cookbooks/trackers.md): how GA4, Google Ads, Meta Pixel, Hotjar, Clarity, LinkedIn, TikTok and Matomo are held until the visitor chooses in regions whose rule requires consent first, and how to add each one.
- [start](start.md): the page a coding agent follows to install the banner start to finish.
