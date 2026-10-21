# Cookie Compliance on Flask

The snippet lives in [`templates/base.html`](templates/base.html), as the first scripts in `<head>`, before `{% block title %}` and `{% block extra_head %}`. Home, About, and Product extend that template.

Do not put the snippet in `extra_head`. A child template fills that block after the banner, or replaces it and drops the tags. Do not print the snippet with `{{ }}`. Jinja escapes it.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/flask --app app run --host localhost --port 8094
```

Open http://localhost:8094. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
