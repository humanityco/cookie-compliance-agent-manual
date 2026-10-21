# Cookie Compliance on Spring Boot

The snippet lives in [`src/main/resources/templates/layout.html`](src/main/resources/templates/layout.html), before any other script. Home, About, and Product are Thymeleaf pages that render inside that layout. Do not move the snippet into a fragment that is inserted later in the body.

Needs Java 17 or newer and Maven. `target/` is build output. Do not commit it.

## Run

```bash
mvn spring-boot:run
```

Open the URL the command prints (port 8091). View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
