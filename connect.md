# Connect your AI assistant to Cookie Compliance

Connect your AI app to your Cookie Compliance account, and it can read your cookie banner and, when you ask, change it. This page has the steps for each app.

## Which address do I use?

| You | Address to add |
|---|---|
| **Have a Cookie Compliance account** and want the AI to read or change your banner | `https://mcp.cookie-compliance.co/mcp/account` |
| **Just trying it out**, no account | `https://mcp.cookie-compliance.co/mcp` |

**Account address.** When you add it, your AI app asks you to sign in. A Cookie Compliance page opens in your browser and you approve it there. There is nothing to copy, and you never give your password to the AI.

**Try-it-out address.** No sign-in. The AI can show a preview of a banner and help install one. It cannot change a real banner.

Then follow the steps for your app:

- [Claude (claude.ai and Claude Desktop)](#claude-claudeai-and-claude-desktop)
- [ChatGPT](#chatgpt)
- [Claude Code](#claude-code)
- [Cursor and other coding tools](#cursor-and-other-coding-tools)
- [My app has no sign-in](#if-your-app-cannot-sign-in-use-an-api-token)

## Claude (claude.ai and Claude Desktop)

Claude in a web browser and the Claude Desktop app share the same connectors, so set it up once. Custom connectors work on the Free, Pro, Max, Team and Enterprise plans. On Free you can add one custom connector.

**Free, Pro and Max:**

1. Open **Customize**, then **Connectors**.
2. Click **+ Add**, then **Add custom connector**.
3. Name: `Cookie Compliance`. URL: paste the address from the table above.
4. Click **Continue**. Claude checks the address and shows the sign-in it found. Click **Continue** again.
5. Authentication: choose **Sign in now**.
6. OAuth client: choose **Register automatically**.
7. Click **Add**. Sign in to Cookie Compliance in the page that opens, and approve.

**Team and Enterprise:**

1. An Owner or Primary Owner adds it once for everyone: **Organization settings**, then **Connectors**, then **Add**, **Custom**, **Web**. Use the name and address above. (On Enterprise, a custom role with Manage access to Libraries can do this too.)
2. Then each member opens **Customize**, then **Connectors**, finds Cookie Compliance, clicks **Connect**, and signs in.

**Use it in a chat:** click **+** at the lower left of the message box, open **Connectors**, and switch Cookie Compliance on.

Anthropic updates these screens from time to time, so a button label may differ slightly. Their own guide: [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166).

## ChatGPT

ChatGPT connects in the web version only. What you can do depends on your plan:

| Plan | What works |
|---|---|
| Business, Enterprise, Edu | Everything: the AI can read and change your banner. On Business, only an admin or owner can add it for the workspace. |
| Pro | The AI can look at your banner but cannot change it. |
| Other plans, such as Plus | OpenAI's guide does not say these plans can add a custom server. Use the Claude app instead. |

Steps:

1. Open **Plugins** and click **+**.
2. Choose **Add custom MCP server**.
3. Name: `Cookie Compliance`. Paste the address from the table above.
4. Set up authentication: choose **OAuth**. Sign in to Cookie Compliance in the page that opens, and approve.
5. ChatGPT shows a risk warning about custom servers. Accept it to finish.

On an older version of ChatGPT you may first need to turn on **Developer mode**: go to **Settings** (on Business: **Workspace Settings**), then **Permissions & Roles**, switch on Developer mode, and then create the connector.

**If you don't see "Add custom MCP server", your plan or workspace does not allow it. Use the Claude app instead.**

OpenAI's own guide: [Developer mode and MCP apps in ChatGPT](https://help.openai.com/en/articles/12584461).

## Claude Code

1. In a terminal, run:

   ```bash
   claude mcp add --transport http --scope user cookie-compliance https://mcp.cookie-compliance.co/mcp/account
   ```

2. Start a new Claude Code session.
3. Type `/mcp`, choose **cookie-compliance**, then choose **Authenticate**. Sign in to Cookie Compliance in the browser page that opens, and approve.

Just trying it out? Use `https://mcp.cookie-compliance.co/mcp` in step 1 and skip step 3.

## Cursor and other coding tools

Add the account address. Most tools then ask you to sign in through your browser. To try it out with no account, use `https://mcp.cookie-compliance.co/mcp` instead.

| Tool | Add the server |
|---|---|
| **Cursor** | Add to `.cursor/mcp.json` (this project) or `~/.cursor/mcp.json` (all projects): `{"mcpServers": {"cookie-compliance": {"url": "https://mcp.cookie-compliance.co/mcp/account"}}}`. |
| **Windsurf** | In Cascade open the MCP settings and edit `mcp_config.json`: `{"mcpServers": {"cookie-compliance": {"serverUrl": "https://mcp.cookie-compliance.co/mcp/account"}}}`. Windsurf has no one-click install for this. |
| **GitHub Copilot (VS Code)** | Add to `.vscode/mcp.json`: `{"servers": {"cookie-compliance": {"type": "http", "url": "https://mcp.cookie-compliance.co/mcp/account"}}}`, or run `code --add-mcp "{\"name\":\"cookie-compliance\",\"type\":\"http\",\"url\":\"https://mcp.cookie-compliance.co/mcp/account\"}"`. |
| **Codex** | Run `codex mcp add cookie-compliance --url https://mcp.cookie-compliance.co/mcp/account`. If Codex shows the server as needing sign-in, run `codex mcp login cookie-compliance`. |
| **Any other MCP client** | Add a Streamable HTTP server with the address. If it cannot sign in through a browser, use an API token (next section). |

If the new tools do not show up after you add the server, start a new session in your tool.

## If your app cannot sign in: use an API token

Use this only when your app has no sign-in button for the server. A token is a long code that starts with `hu_`.

1. Sign in to your [Cookie Compliance dashboard](https://app.hu-manity.co).
2. Open <https://app.hu-manity.co/#/api-tokens/new>. (The dashboard calls this **Temporary Login**. It is also on the **Preferences** page.)
3. **Login Name:** something you will recognise, such as `My AI assistant`.
4. **Expires At:** pick the latest date the date picker allows (up to 30 days ahead).
5. Click **Submit**.
6. The **Login Created** box shows a URL ending in `token=hu_…`. It is shown only once. Copy just the part after `token=`: that is your token, and it starts with `hu_`. (The **Copy Link** button copies the whole link. If you use it, delete everything up to and including `token=`.) Keep the link private: it opens your account without a password.
7. In your AI app's connection settings for the server, use the account address and add this header:

   ```text
   Authorization: Bearer hu_…
   ```

   In Claude Code, for example:

   ```bash
   claude mcp add --transport http --scope user cookie-compliance https://mcp.cookie-compliance.co/mcp/account --header "Authorization: Bearer hu_…"
   ```

**Never paste the token into a chat message.** It goes in the connection settings only.

Tokens expire. When yours does, the AI can no longer reach your account: create a new token the same way and replace the old one. You can revoke a token at any time from the same list (**Revoke Token**).

## Check it worked

Ask your AI:

```text
Which Cookie Compliance sites can you see?
```

It should list your sites.

- **It says it is connected but cannot see your sites:** you added the try-it-out address. Remove the server and add `https://mcp.cookie-compliance.co/mcp/account` instead.
- **It asks you to sign in again:** this can happen from time to time. It is one click in the browser page that opens.

## What to ask next

Try:

```text
Make my cookie banner match my website. My brand colour is #…, my page background is #…. Show me the change before you publish it.
```

Give the AI your colours, or a screenshot of your site. It cannot reliably read colours from a web address.

Through this connection the AI can change the banner's colours, position, size, wording, button corners and animation. It cannot change the logo or the font, or add custom code.

After you publish a change, visitors whose browser saved the old banner may see it for up to an hour.

## For AI agents

- Ask which app the person uses, then give them that app's steps from this page, one step at a time.
- Existing customer: the account address. No account: the try-it-out address. Never ask for a password, and never accept a token in a chat message.
- Then follow [`skills/match-site-design/SKILL.md`](skills/match-site-design/SKILL.md) to restyle a banner, or [`skills/install-banner/SKILL.md`](skills/install-banner/SKILL.md) to install one.
