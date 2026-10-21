# Cookie Compliance on FastAPI

The snippet lives in [`templates/base.html`](templates/base.html), as the first scripts in `<head>`, before `{% block title %}` and `{% block extra_head %}`. Home, About, and Product extend that template. `Jinja2Templates` renders it.

Do not put the snippet in `extra_head`. A child template fills that block after the banner. Do not pass the tags through `{{ }}`. `Jinja2Templates` autoescapes `.html` files, so the markup would show up as text.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app:app --host localhost --port 8095
```

Open http://localhost:8095. View Source on `/`, `/about`, and `/product`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
