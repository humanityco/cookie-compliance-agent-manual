# Example projects

Small apps that already place the Cookie Compliance snippet as the **first scripts** in the shared document `<head>`. They illustrate placement. They do not certify legal compliance. Checking a real install is still [`verify-install`](../skills/verify-install/SKILL.md).

Replace `YOUR_APP_ID` with the live snippet from MCP `install.getSnippet` or dashboard **Integrations → Manual Integration**. Leave the two tags synchronous: no `async`, `defer`, or `type="module"`.

Each app has a Home page, an About page, and a Product page that share that document, plus a placeholder analytics tag after the banner so script order is visible in View Source.

| Example | Stack | File that owns `<head>` | Run |
|---|---|---|---|
| [aspnet-razor](aspnet-razor/) | ASP.NET Core Razor Pages | `Pages/Shared/_Layout.cshtml` | `dotnet run` |
| [blazor](blazor/) | Blazor Web App | `Components/App.razor` | `dotnet run` |
| [angular](angular/) | Angular | `src/index.html` | `npm install` then `npm start` |
| [react-vite](react-vite/) | React (Vite) | `index.html` | `npm install` then `npm run dev` |
| [vue-vite](vue-vite/) | Vue (Vite) | `index.html` | `npm install` then `npm run dev` |
| [sveltekit](sveltekit/) | SvelteKit | `src/app.html` | `npm install` then `npm run dev` |
| [laravel](laravel/) | Laravel | `resources/views/layouts/app.blade.php` | `composer install` then `php artisan serve` |
| [django](django/) | Django | `templates/base.html` | `python3 -m venv .venv`, then `.venv/bin/pip install -r requirements.txt`, then `.venv/bin/python manage.py runserver` |
| [rails](rails/) | Ruby on Rails | `app/views/layouts/application.html.erb` | `bundle install` then `bin/rails server` |
| [nextjs](nextjs/) | Next.js (App Router) | `app/layout.tsx` | `npm install` then `npm run dev` |
| [nuxt](nuxt/) | Nuxt | `nuxt.config.ts` | `npm install` then `npm run dev` |
| [astro](astro/) | Astro | `src/layouts/Layout.astro` | `npm install` then `npm run dev` |
| [express](express/) | Express | `templates/layout.html` | `npm install` then `npm start` |
| [spring-boot](spring-boot/) | Spring Boot + Thymeleaf | `src/main/resources/templates/layout.html` | `mvn spring-boot:run` |
| [go](go/) | Go (`net/http`) | `templates/layout.html` | `go run .` |
| [flask](flask/) | Flask | `templates/base.html` | `python3 -m venv .venv`, then `.venv/bin/pip install -r requirements.txt`, then `.venv/bin/flask --app app run --host localhost --port 8094` |
| [fastapi](fastapi/) | FastAPI | `templates/base.html` | `python3 -m venv .venv`, then `.venv/bin/pip install -r requirements.txt`, then `.venv/bin/uvicorn app:app --host localhost --port 8095` |
| [fastify](fastify/) | Fastify | `templates/layout.html` | `npm install` then `npm start` |
| [nestjs](nestjs/) | NestJS | `templates/layout.html` | `npm install` then `npm start` |
| [symfony](symfony/) | Symfony | `templates/base.html.twig` | `composer install` then `php -S localhost:8096 -t public` |
| [eleventy](eleventy/) | Eleventy | `src/_includes/base.njk` | `npm install` then `npm start` |
| [plain-html](plain-html/) | Plain HTML | `index.html`, `about/index.html`, `product/index.html` | `python3 -m http.server 8100 --bind localhost` |
| [gtm](gtm/) | Plain HTML + Google Tag Manager | `index.html`, `about/index.html`, `product/index.html` | `python3 -m http.server 8101 --bind localhost` |
| [hono](hono/) | Hono | `templates/layout.html` | `npm install` then `npm start` |
| [react-router](react-router/) | React Router | `app/root.tsx` | `npm install` then `npm run dev` |
| [solid](solid/) | Solid (Vite) | `index.html` | `npm install` then `npm run dev` |
| [qwik](qwik/) | Qwik (Vite) | `index.html` | `npm install` then `npm run dev` |
| [jekyll](jekyll/) | Jekyll | `_layouts/default.html` | `bundle install` then `bundle exec jekyll serve --host localhost --port 8106` |
| [hugo](hugo/) | Hugo | `layouts/baseof.html` | `hugo server --bind localhost --port 8107` |
