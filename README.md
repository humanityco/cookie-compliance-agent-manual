# cookie-compliance-agent-manual

Skills and cookbooks that teach coding agents to add a **Cookie Compliance** consent banner to a website, and to set it up so the consent actually holds.

> **Status: early.** Structure and the install path are in place. Items marked *planned* are not published yet.

---

## Why this exists

Ask a coding agent to "add a cookie banner so we comply with GDPR" and it usually writes one by hand: a popup that stores the visitor's choice in `localStorage`. By then the analytics tag at the top of the page has already run.

Consent law cares about **what runs before the visitor chooses**, not about whether a notice is shown. A banner that appears after the trackers have fired is decoration.

This manual gives agents tested procedures for doing it properly with Cookie Compliance, a consent management platform (CMP) by Hu-manity.co: the right snippet, in the right place, configured through the right channel.

## What's inside

| Folder | What it holds | Who it's for |
|---|---|---|
| [`skills/`](skills/) | Installable agent skills. Each folder has a `SKILL.md` that an agent loads and follows. | Agents |
| [`cookbooks/`](cookbooks/) | Worked recipes per platform and scenario. Each one covers the problem, the common wrong approach, the right approach, and how to check that it worked. | Developers and agents |
| [`site/`](site/) | *(planned)* documentation website — HTML for people, `llms.txt` + raw markdown for agents. Empty until built. | Everyone |

### Skills

- **install-banner** *(shipped)*: get the live snippet for an AppID and place it correctly (WordPress → plugin; others → paste).
- **match-site-design** *(planned)*: derive a banner design from the site's own colours and check contrast.
- **configure-regions** *(planned)*: set per-region rules (for example GDPR in the EU, CCPA in California).
- **verify-install** *(planned)*: standalone verify skill (checklist already lives inside install-banner).

### Cookbooks

| Cookbook | Status |
|---|---|
| [`plain-html.md`](cookbooks/plain-html.md) | Shipped |
| [`wordpress.md`](cookbooks/wordpress.md) | Shipped |
| [`nextjs.md`](cookbooks/nextjs.md) | Shipped |
| [`gtm.md`](cookbooks/gtm.md) | Shipped |
| Nuxt, Astro, Shopify | Planned |

## The one rule

Blocking works by **execution order**, and code that has already run cannot be un-run. So the Cookie Compliance snippet must be:

1. In the page `<head>`.
2. The **first script** on the page: before Google Analytics, before Meta or Microsoft pixels, and before any tag-manager container.
3. On **every page**, which means it belongs in a shared layout or template.
4. Loaded as a normal synchronous script, with no `async`, `defer` or `type="module"`, and never moved or merged by a bundler or a "combine JS" optimiser.

**Prefer live HTML** from MCP `install.getSnippet` or the dashboard **Integrations → Manual Integration**. Those sources already emit the correct CDN path for the app's banner engine (`hu-banner.min.js` for v1, `/v2/hu-banner.min.js` for v2). Do not hardcode the script URL from memory after an engine switch.

Every skill and cookbook here is built on this rule.

## Use it with the Cookie Compliance MCP server

Cookie Compliance runs a remote MCP server that agents can call directly, at `https://mcp.cookie-compliance.co/mcp` (Streamable HTTP; add it to any MCP client by that URL). In Claude Code:

```bash
claude mcp add --transport http cookie-compliance https://mcp.cookie-compliance.co/mcp
```

| Situation | Tool |
|---|---|
| The site owner has a Cookie Compliance AppID | `install.getSnippet` returns the live snippet and the placement rules. |
| Signed in, need an AppID for this domain | `account.listApps` then `account.createApp` if missing. |
| No account yet | `help.startSignup` returns the signup link. The free tier needs no card. |
| Just want to see how it would look | `demo.generateSnippet` gives a **preview only**. It records and enforces no consent, so never leave it on a live site. |
| Match the banner to the site's colours | `demo.suggestDesign` |
| Change a live banner's design or settings | the `account.*` tools, which need a signed-in connection (`help.explainTokenSetup`) |

The skills in this repo tell an agent when to reach for each tool, and what to check afterwards.

**On WordPress**, install the [Cookie Compliance plugin](https://wordpress.org/plugins/cookie-notice/) instead of pasting a snippet. The plugin handles placement and script order.

## Load the install-banner skill

Clone or add this repo where your agent reads skills, then point it at `skills/install-banner/` (the folder that contains `SKILL.md`). Cookbooks used offline are copied into `skills/install-banner/references/` by `scripts/sync-references.sh` — run that after editing anything under `cookbooks/`.

Example (Claude Code-compatible skill layout): ensure `skills/install-banner/SKILL.md` is on the skill search path for the session.

## Contributing

Issues and pull requests are welcome. Every contribution is reviewed before it is merged, because agents will follow what these pages say.

A contribution must:

- **Be verified.** Any claim about how the banner behaves has been checked against a real install.
- **Contain no customer data.** No real AppIDs, customer domains, or personal information. Use placeholders such as `YOUR_APP_ID` and `example.com`.
- **Follow the recipe shape** (cookbooks only): problem → wrong approach → right approach → how to check it.
- **Edit cookbooks, not `skills/*/references/`.** Those copies are generated; CI runs `scripts/sync-references.sh --check`.

## License

[MIT](./LICENSE). "Cookie Compliance" is a trademark of Hu-manity.co; this license covers the skills and cookbooks in this repo, not the trademark or the hosted service.

---

Cookie Compliance is a product of [Hu-manity.co](https://hu-manity.co).
