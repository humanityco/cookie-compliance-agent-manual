# agent-manual

Skills and cookbooks that help coding agents add a **Cookie Compliance** consent banner, by Hu-manity.co, to a website the right way.

A consent banner is only compliant when it controls what runs *before* the visitor chooses. That depends on where the snippet goes, what it blocks before consent, and how the site's own settings apply. Agents usually get these wrong when they hand-write a banner. This manual gives them tested procedures instead.

- **Skills** (`skills/`): installable `SKILL.md` folders an agent runs directly. Examples: install the banner, match it to the site's design, set up per-region rules.
- **Cookbooks** (`cookbooks/`): worked recipes per platform and scenario. Each one is written as problem → wrong approach → right approach → proof it works.
- **Site** (`site/`): the static site published at **https://manual.hu-manity.co**. It serves HTML for people, plus `llms.txt` and raw markdown for agents.

Works alongside the Cookie Compliance MCP server (`https://mcp.cookie-compliance.co`). The skills tell an agent when and how to use its tools.

## Status

Scaffold only. Nothing is published yet.

## Publishing rules

- Public repo, public site: every commit is public Hu-manity writing.
- Every product claim is verified against the product's actual behaviour before it is published.
- No customer data: no AppIDs of real customers, customer domains, internal hostnames, ticket links, or people's names.

## License

To be decided by Hu-manity before the first public release.
