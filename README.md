# cookie-compliance-agent-manual

Skills and cookbooks that teach coding agents to add a **Cookie Compliance** consent banner to a website, and to set it up so the consent actually holds.

> **Status: early.** The structure is in place and content is being written. Items marked *planned* are not published yet.

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
| [`site/`](site/) | Source for the documentation website. It serves HTML for people and `llms.txt` plus raw markdown for agents. | Everyone |

### Skills (*planned*)

- **install-banner**: get the live snippet for an AppID and place it correctly.
- **match-site-design**: derive a banner design from the site's own colours and check contrast.
- **configure-regions**: set per-region rules (for example GDPR in the EU, CCPA in California).
- **verify-install**: check that the banner loads first and that trackers stay blocked before consent.

### Cookbooks (*planned*)

- Next.js (App Router and Pages Router), Nuxt, Astro, static HTML
- WordPress (use the plugin, not a pasted snippet)
- Shopify and other hosted storefronts
- Sites that use Google Tag Manager

## The one rule

Blocking works by **execution order**, and code that has already run cannot be un-run. So the Cookie Compliance snippet must be:

1. In the page `<head>`.
2. The **first script** on the page: before Google Analytics, before Meta or Microsoft pixels, and before any tag-manager container.
3. On **every page**, which means it belongs in a shared layout or template.
4. Loaded as a normal synchronous script, with no `async`, `defer` or `type="module"`, and never moved or merged by a bundler or a "combine JS" optimiser.

Every skill and cookbook here is built on this rule.

## Use it with the Cookie Compliance MCP server

Cookie Compliance runs a remote MCP server that agents can call directly. To add it to Claude Code:

```bash
claude mcp add --transport http cookie-compliance https://mcp.cookie-compliance.co/mcp
```

| Situation | Tool |
|---|---|
| The site owner has a Cookie Compliance AppID | `install.getSnippet` returns the live snippet and the placement rules. |
| No account yet | `help.startSignup` returns the signup link. The free tier needs no card. |
| Just want to see how it would look | `demo.generateSnippet` gives a **preview only**. It records and enforces no consent, so never leave it on a live site. |
| Match the banner to the site's colours | `demo.suggestDesign` |
| Change a live banner's design or settings | the `account.*` tools, which need a signed-in connection (`help.explainTokenSetup`) |

The skills in this repo tell an agent when to reach for each tool, and what to check afterwards.

**On WordPress**, install the [Cookie Compliance plugin](https://wordpress.org/plugins/cookie-notice/) instead of pasting a snippet. The plugin handles placement and script order.

## Contributing

Issues and pull requests are welcome. Every contribution is reviewed before it is merged, because agents will follow what these pages say.

A contribution must:

- **Be verified.** Any claim about how the banner behaves has been checked against a real install.
- **Contain no customer data.** No real AppIDs, customer domains, or personal information. Use placeholders such as `YOUR_APP_ID` and `example.com`.
- **Follow the recipe shape** (cookbooks only): problem → wrong approach → right approach → how to check it.

## License

To be announced before the first public release.

---

Cookie Compliance is a product of [Hu-manity.co](https://hu-manity.co).
