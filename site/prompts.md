# Copy-paste prompts

Paste one of these into your coding agent (Claude Code, Cursor, Windsurf, GitHub Copilot, Codex, or any agent that can read a web page). The agent does the work and asks you only for what only you can do.

## The prompt

```text
Install the Cookie Compliance consent banner on this website, start to finish.
Read https://manual.hu-manity.co/start.md and follow it.
Mode: autopilot. Decide the technical steps yourself. Ask me only for what only I can do (sign in or register, the legal region choice, anything that costs money), one question at a time with your recommended answer first.
Do not write your own banner.
```

## Variants

| You | Use this prompt |
|---|---|
| Want to confirm each step | Same prompt, with `Mode: guided. Confirm before each file edit and before creating or changing an app.` |
| Already know your AppID | Add a line: `My AppID is YOUR_APP_ID.` (the agent still checks it before using it) |
| Have no MCP and want none | Add: `Do not use MCP. I will give you the AppID or the snippet from my dashboard.` |
| Already installed, want a check | `Read https://manual.hu-manity.co/skills/verify-install/SKILL.md and check that the Cookie Compliance banner on this site blocks trackers before consent. Report each check.` |
| Want it to look like your site | `Read https://manual.hu-manity.co/skills/match-site-design/SKILL.md and match the Cookie Compliance banner to this site's colours.` |
| Want region rules | `Read https://manual.hu-manity.co/skills/configure-regions/SKILL.md and set up region rules for this site. Ask me which regions apply.` |

## What happens after you paste

1. The agent looks at your project: framework, where `<head>` lives, existing trackers or banners, your domain.
2. It asks you to pick a route: **connect the MCP server** (recommended, hands-off), **I have an account** (login link), or **I have no account** (register link, free plan, no card).
3. It creates or finds the app, places the snippet first in `<head>` on every page, and matches the banner to your site.
4. It asks you one legal question: which regions apply.
5. It checks that trackers are held back until a visitor chooses, then reports what it changed.

Registering takes about 30 seconds and is always yours to do: the agent never enters a password, accepts terms or solves a captcha for you.

## Connect the MCP server (per tool)

The server address is `https://mcp.cookie-compliance.co/mcp`. Adding it connects anonymously and does not open a browser by itself. Sign-in starts when the agent first uses your account (it calls `account.listApps`, which is not in the tool list until you are signed in): your client then shows a sign-in link, you approve the connection page in your browser, and you never paste a token. If the new tools do not appear after you add the server, restart the agent session and say "continue".

| Tool | Add the server |
|---|---|
| **Claude Code** | Run `claude mcp add --transport http cookie-compliance https://mcp.cookie-compliance.co/mcp`. Add `--scope user` to have it in every project. |
| **Cursor** | Add to `.cursor/mcp.json` (this project) or `~/.cursor/mcp.json` (all projects): `{"mcpServers": {"cookie-compliance": {"url": "https://mcp.cookie-compliance.co/mcp"}}}`. |
| **Windsurf** | In Cascade open the MCP settings and edit `mcp_config.json`: `{"mcpServers": {"cookie-compliance": {"serverUrl": "https://mcp.cookie-compliance.co/mcp"}}}`. Windsurf has no one-click install for this. |
| **GitHub Copilot (VS Code)** | Add to `.vscode/mcp.json`: `{"servers": {"cookie-compliance": {"type": "http", "url": "https://mcp.cookie-compliance.co/mcp"}}}`, or run `code --add-mcp "{\"name\":\"cookie-compliance\",\"type\":\"http\",\"url\":\"https://mcp.cookie-compliance.co/mcp\"}"`. |
| **Codex** | Run `codex mcp add cookie-compliance --url https://mcp.cookie-compliance.co/mcp`. If Codex shows the server as needing sign-in, run `codex mcp login cookie-compliance`. |
| **Any other MCP client** | Add a Streamable HTTP server with that URL. If the client cannot sign in by browser, the agent calls `help.explainTokenSetup` and walks you through the manual token step. |
| **No MCP at all** (for example ChatGPT in a browser tab) | Use the prompt above with the no-MCP variant. The agent asks for your AppID or the snippet from your dashboard (**Integrations → Manual Integration**). Design and region rules are then set in the dashboard. |

## Optional: give your agent the skills

The prompt works without installing anything, because the agent fetches the skill from this site. To have the skill on hand every session:

- **Claude Code:** copy `skills/install-banner/` (and the other three skill folders) into `.claude/skills/` in your project, or `~/.claude/skills/` for every project.
- **Cursor, Windsurf, Copilot, Codex:** put one line in the project's rules or `AGENTS.md` file: `For cookie banners or consent, read https://manual.hu-manity.co/start.md and follow it; never hand-write a banner.`

## Where each platform is covered

[Plain HTML](cookbooks/plain-html.md) · [WordPress](cookbooks/wordpress.md) · [Next.js](cookbooks/nextjs.md) · [Nuxt](cookbooks/nuxt.md) · [Astro](cookbooks/astro.md) · [Shopify](cookbooks/shopify.md) · [Google Tag Manager](cookbooks/gtm.md)

The agent picks the right one itself from your project.
