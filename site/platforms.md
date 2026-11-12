# Install Cookie Compliance on your platform

**In short:** the banner is one two-tag snippet that works on any website whose code you can edit, whatever it is built with. What changes from platform to platform is **where the snippet goes**. Find your platform below for the exact spot, or use the general steps if it isn't listed.

## The one rule

Blocking works by **execution order**, and code that has already run cannot be un-run. So the snippet must be the **first script** on every page, in `<head>`, as plain synchronous tags (no `async`, `defer` or `type="module"`), above analytics, pixels and any tag manager.

## Platforms with a guide

Each guide covers the wrong way, the right way, and how to check that it worked.

| Platform | Where the snippet goes | Guide |
|---|---|---|
| WordPress | Install the Cookie Compliance for WordPress plugin; do not paste the snippet into a theme | [wordpress](cookbooks/wordpress.md) |
| Shopify | First thing in `<head>` of `layout/theme.liquid`, not checkout Additional scripts or a Customer Events pixel | [shopify](cookbooks/shopify.md) |
| Next.js | The document `<head>` of the root layout, as classic tags (not `next/script`) | [nextjs](cookbooks/nextjs.md) |
| Nuxt | `app.head.script` in `nuxt.config.ts`, never marked `async` | [nuxt](cookbooks/nuxt.md) |
| Astro | The shared layout's `<head>`, with `is:inline` on every tag | [astro](cookbooks/astro.md) |
| Angular | `<head>` of `src/index.html`, not the `angular.json` scripts array | [angular](cookbooks/angular.md) |
| React or Vue (Vite) | `<head>` of `index.html`, ahead of the module entry | [vite](cookbooks/vite.md) |
| SvelteKit | `src/app.html`, above `%sveltekit.head%` | [sveltekit](cookbooks/sveltekit.md) |
| Google Tag Manager | `<head>`, above the GTM container; never as a tag inside GTM | [gtm](cookbooks/gtm.md) |
| Static HTML or any other site you edit directly | First thing in `<head>` on every page (or the shared header file) | [plain-html](cookbooks/plain-html.md) |

## Your platform isn't listed

If you can put code in the `<head>` of every page, the plain HTML steps apply:

1. Copy the live snippet from the dashboard (**Integrations → Manual Integration**), or with the MCP server connected call `install.getSnippet`. Paste it unchanged. No account yet? [Sign up](https://app.hu-manity.co/#/register?enable-free=true&discount=JOIN-40D&utm_source=agent-manual&utm_medium=docs&utm_content=platforms) (free plan, no card).
2. Paste it as the first thing inside `<head>`, on every page or in the shared header your pages include.
3. Check it with [verify-install](skills/verify-install/SKILL.md): before the visitor chooses, no tracking cookies should appear.

If your platform only offers a footer or `<body>` code box, or places custom code after its own scripts, the snippet will run after your trackers and cannot hold them. Say so rather than installing it there, and use a spot that comes first. The checks in [verify-install](skills/verify-install/SKILL.md) show whether it held.

## More help

- [Where to put the Cookie Compliance snippet](https://cookie-compliance.co/documentation/where-to-put-the-consent-snippet/): the placement rule, for the site owner.
- [start](start.md): the page a coding agent follows to install the banner start to finish.
