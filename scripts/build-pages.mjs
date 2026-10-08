#!/usr/bin/env node
// Renders the human-readable twin of every markdown page the site mirrors, so
// a person gets a styled page at a pretty URL while agents keep fetching the
// raw markdown, byte for byte, at its usual path:
//
//   start.md                -> start/index.html                  (/start/)
//   prompts.md              -> prompts/index.html                (/prompts/)
//   skills/<name>/SKILL.md  -> skills/<name>/index.html          (/skills/<name>/)
//   cookbooks/<name>.md     -> cookbooks/<name>/index.html       (/cookbooks/<name>/)
//
// plus the shared assets/site.css and assets/site.js. Called by
// scripts/sync-site.sh on the mirror it builds, never on its own:
//
//   node scripts/build-pages.mjs <mirror dir>
//
// Node standard library plus one vendored file: marked v18.1.0 (MIT), copied
// unchanged from the npm package's lib/marked.esm.js, sha256
// 054d73b676031dc8e60e247ef228044fbeebe10af14bac1a6e53852f80f826e5. Its
// licence is scripts/vendor/marked.LICENSE. To upgrade, replace both files
// and update the version and hash here.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked, Renderer } from './vendor/marked.esm.js';
import { BASE, STYLESHEET, SCRIPT, SKIP_LINK, header, FOOTER } from './site-layout.mjs';

const scripts = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
if (!out || !existsSync(out)) {
  console.error('usage: node scripts/build-pages.mjs <mirror dir>  (run scripts/sync-site.sh instead)');
  process.exit(2);
}

// ---------- the page set ----------

// Sidebar order follows the journey (and the home page); anything new is
// appended alphabetically, so adding a skill or cookbook needs no edit here.
const SKILL_ORDER = ['install-banner', 'verify-install', 'match-site-design', 'configure-regions'];
const COOKBOOK_ORDER = ['plain-html', 'wordpress', 'nextjs', 'nuxt', 'astro', 'gtm', 'shopify'];
const ordered = (names, order) => [...names].sort((a, b) => {
  const [i, j] = [order.indexOf(a), order.indexOf(b)].map((n) => (n < 0 ? Infinity : n));
  return i - j || (a < b ? -1 : a > b ? 1 : 0);
});

const ls = (dir) => (existsSync(join(out, dir)) ? readdirSync(join(out, dir)) : []);
const skills = ordered(ls('skills').filter((n) => existsSync(join(out, 'skills', n, 'SKILL.md'))), SKILL_ORDER);
const cookbooks = ordered(ls('cookbooks').filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)), COOKBOOK_ORDER);

// { src: raw markdown path, url: pretty path, section: header nav entry, kind (shown under
// the h1), label (sidebar), description (else the front-matter's, else the first paragraph) }
const PAGES = [
  { src: 'start.md', url: '/start/', section: 'start', label: 'Start here',
    description: 'The one page a coding agent follows to install the Cookie Compliance consent banner, start to finish.' },
  { src: 'prompts.md', url: '/prompts/', section: 'start', label: 'Prompts and tool setup' },
  ...skills.map((n) => ({ src: `skills/${n}/SKILL.md`, url: `/skills/${n}/`, section: 'skills', kind: 'Skill', label: n })),
  ...cookbooks.map((n) => ({ src: `cookbooks/${n}.md`, url: `/cookbooks/${n}/`, section: 'cookbooks', kind: 'Cookbook', label: n })),
];

// Raw markdown path -> its HTML twin. The galleries' twins are written by scripts/gallery.mjs.
const TWINS = new Map([
  ...PAGES.map((p) => [p.src, p.url]),
  ['gallery/README.md', '/gallery/'],
  ['gallery/v2/README.md', '/gallery/v2/'],
]);

// ---------- helpers ----------

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" };
// Rendered inline HTML -> its text content.
const plain = (html) => html.replace(/<[^>]*>/g, '').replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ENTITIES[e]);

// GitHub's heading ids (github-slugger): lowercase, drop punctuation other
// than "-" and "_", spaces become "-", repeats get -1, -2, ...
function slugger() {
  const seen = new Map(); // slug -> how many repeats it has had
  return (text) => {
    const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '').replace(/ /g, '-');
    let slug = base;
    while (seen.has(slug)) {
      seen.set(base, seen.get(base) + 1);
      slug = `${base}-${seen.get(base)}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}

// The YAML front-matter the skills and cookbooks open with: flat "key: value" lines only.
function frontMatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(src);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, '$2');
  }
  return { meta, body: src.slice(m[0].length) };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const longDate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : null;
};

function truncate(text, max = 200) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,;:.]$/, '') + '…';
}

// ---------- markdown -> HTML ----------

// A relative link in the markdown is relative to the raw file; the twin lives
// one directory deeper. Point it at the target's twin when there is one, else
// at the raw target by its site path, keeping any #fragment.
// An absolute link to this site's own raw markdown is treated the same way,
// so the HTML page links to the HTML twin (the markdown keeps the raw URL).
const SAME_ORIGIN = 'https://manual.hu-manity.co/';
function rewrite(href, fromSrc) {
  if (href && href.startsWith(SAME_ORIGIN)) {
    const local = href.slice(SAME_ORIGIN.length);
    const cut = local.search(/[?#]/);
    const [path, rest] = cut < 0 ? [local, ''] : [local.slice(0, cut), local.slice(cut)];
    const twin = TWINS.get(path);
    return twin ? twin + rest : href;
  }
  if (!href || /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) return href;
  const cut = href.search(/[?#]/);
  const [path, rest] = cut < 0 ? [href, ''] : [href.slice(0, cut), href.slice(cut)];
  const target = posix.normalize(posix.join(posix.dirname(fromSrc), path));
  if (target.startsWith('..')) return href; // outside the site: leave it alone
  return (TWINS.get(target) ?? `/${target}`) + rest;
}

class SiteRenderer extends Renderer {
  constructor(src) {
    super();
    this.src = src;
    this.slug = slugger();
    this.toc = []; // [id, text] for every h2
  }
  heading(token) {
    const inner = this.parser.parseInline(token.tokens);
    const text = plain(inner).trim(); // trimmed: a trailing <a id> must not leave a trailing "-"
    const id = this.slug(text);
    if (token.depth === 2) this.toc.push([id, text]);
    const anchor = token.depth > 1 ? ` <a class="anchor" href="#${id}" aria-label="Link to this section">#</a>` : '';
    return `<h${token.depth} id="${id}">${inner}${anchor}</h${token.depth}>\n`;
  }
  code({ text, lang }) {
    const cls = lang ? ` class="language-${esc(lang.split(/\s/)[0])}"` : '';
    return `<div class="code"><pre tabindex="0"><code${cls}>${esc(text.replace(/\n$/, ''))}\n</code></pre></div>\n`;
  }
  table(token) {
    return `<div class="table-wrap" role="region" aria-label="Table" tabindex="0">\n${super.table(token)}</div>\n`;
  }
  link(token) {
    return super.link({ ...token, href: rewrite(token.href, this.src) });
  }
  image(token) {
    return super.image({ ...token, href: rewrite(token.href, this.src) });
  }
}

const marked = new Marked({ gfm: true });

// ---------- layout ----------

function sidebar(current, toc) {
  const item = (p) => {
    const here = p === current;
    const sub = here && toc.length
      ? `\n          <ul class="toc" aria-label="On this page">\n${toc.map(([id, text]) => `            <li><a href="#${id}">${esc(text)}</a></li>`).join('\n')}\n          </ul>`
      : '';
    return `        <li><a href="${p.url}"${here ? ' aria-current="page"' : ''}>${esc(p.label)}</a>${sub}</li>`;
  };
  const group = (title, pages) => `      <h2>${title}</h2>\n      <ul>\n${pages.map(item).join('\n')}\n      </ul>`;
  return `<details class="sidebar" open>
    <summary>All pages${toc.length ? ' and this page\'s sections' : ''}</summary>
    <nav aria-label="Manual pages">
${group('Get started', PAGES.filter((p) => p.section === 'start'))}
${group('Skills', PAGES.filter((p) => p.section === 'skills'))}
${group('Cookbooks', PAGES.filter((p) => p.section === 'cookbooks'))}
      <h2>Design gallery</h2>
      <ul>
        <li><a href="/gallery/">v1 banner designs</a></li>
        <li><a href="/gallery/v2/">v2 banner designs</a></li>
      </ul>
    </nav>
  </details>`;
}

function page(p) {
  const { meta, body } = frontMatter(readFileSync(join(out, p.src), 'utf8'));
  const renderer = new SiteRenderer(p.src);
  let html = marked.parse(body, { renderer });
  const tokens = marked.lexer(body);
  const h1 = tokens.find((t) => t.type === 'heading' && t.depth === 1);
  const title = h1 ? plain(marked.parseInline(h1.text)) : meta.title ?? p.label;
  const lead = tokens.find((t) => t.type === 'paragraph');
  const description = truncate(p.description ?? meta.description ?? (lead ? plain(marked.parseInline(lead.text)) : title));

  // Under the h1: what kind of page this is, front-matter facts, and the raw file.
  const facts = [p.kind === 'Cookbook' && meta.kind ? `Cookbook · ${esc(meta.kind)}` : p.kind].filter(Boolean);
  const verified = longDate(meta.last_verified);
  if (verified) facts.push(`Last verified <time datetime="${esc(meta.last_verified)}">${verified}</time>`);
  facts.push(`<a href="/${p.src}">View raw markdown (for agents)</a>`);
  const metaLine = `<p class="page-meta">${facts.join(' <span aria-hidden="true">·</span> ')}</p>\n`;
  html = /<\/h1>\n/.test(html) ? html.replace(/<\/h1>\n/, (m) => m + metaLine) : metaLine + html;

  return `<!doctype html>
<!-- Generated by scripts/build-pages.mjs from ${p.src}. Do not edit by hand. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} — Cookie Compliance Agent Manual</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${BASE}${p.url}">
<link rel="alternate" type="text/markdown" href="/${p.src}" title="Raw markdown (for agents)">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${BASE}${p.url}">
<meta property="og:site_name" content="Cookie Compliance Agent Manual">
${STYLESHEET}
${SCRIPT}
</head>
<body>
${SKIP_LINK}
${header(p.section, p.url)}
<div class="layout">
  ${sidebar(p, renderer.toc)}
  <main id="content" class="doc">
${html.trimEnd()}
  </main>
</div>
${FOOTER}
</body>
</html>
`;
}

// ---------- build ----------

for (const p of PAGES) {
  const dest = join(out, p.url, 'index.html');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, page(p));
}
mkdirSync(join(out, 'assets'), { recursive: true });
for (const f of ['site.css', 'site.js']) copyFileSync(join(scripts, 'site-assets', f), join(out, 'assets', f));

// The hand-written home page must carry the shared layout verbatim.
const home = readFileSync(join(out, 'index.html'), 'utf8');
const missing = [[STYLESHEET, 'stylesheet link'], [SCRIPT, 'script tag'], [SKIP_LINK, 'skip link'], [header(), 'header'], [FOOTER, 'footer']]
  .filter(([s]) => !home.includes(s)).map(([, name]) => name);
if (missing.length) {
  console.error(`build-pages: site/index.html lacks the shared ${missing.join(', ')} from scripts/site-layout.mjs; copy them in exactly`);
  process.exit(1);
}
console.log(`build-pages: rendered ${PAGES.length} pages`);
