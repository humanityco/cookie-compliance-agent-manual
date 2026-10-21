# Cookie Compliance on Django

The snippet lives in [`templates/base.html`](templates/base.html), before `{% block extra_head %}`. Home, About, and Product extend that template, so a child page cannot put a script ahead of the banner.

Do not put the snippet in a single view, or in `extra_head`. Anything in `extra_head` renders after the banner.

## Run

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py runserver localhost:8000
```

Open the URL the command prints. View Source on `/`, `/about/`, and `/product/`. `huOptions` and `hu-banner.min.js` are the first scripts in `<head>`, with no `async` or `defer`. The placeholder analytics tag comes after them.

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. This sample illustrates placement. It does not certify legal compliance. A real install is checked with the [verify-install](../../skills/verify-install/SKILL.md) skill.
