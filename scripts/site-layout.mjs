// The header and footer every HTML page on manual.hu-manity.co shares, so the
// generated pages (scripts/build-pages.mjs, scripts/gallery.mjs) and the
// hand-written site/index.html cannot drift apart. build-pages.mjs fails if
// site/index.html does not carry these exact strings.

export const BASE = 'https://manual.hu-manity.co';
export const GITHUB = 'https://github.com/humanityco/cookie-compliance-agent-manual';
export const STYLESHEET = '<link rel="stylesheet" href="/assets/site.css">';
export const SCRIPT = '<script src="/assets/site.js" defer></script>';
export const SKIP_LINK = '<a class="skip" href="#content">Skip to content</a>';

// [section, label, href]. `section` marks the current entry with aria-current.
const NAV = [
  ['start', 'Start', '/start/'],
  ['skills', 'Skills', '/#skills'],
  ['cookbooks', 'Cookbooks', '/#cookbooks'],
  ['gallery', 'Gallery', '/gallery/'],
  ['agents', 'For agents <span class="nav-note">(llms.txt)</span>', '/llms.txt'],
  ['github', 'GitHub', GITHUB],
];

// `current` is one of the NAV sections, or '' (the home page); `path` is the
// page's own URL path, so the entry is "page" when it links to this very page
// and "true" (current section) otherwise.
export function header(current = '', path = '') {
  const items = NAV.map(([section, label, href]) => {
    const here = section === current ? ` aria-current="${href === path ? 'page' : 'true'}"` : '';
    return `      <li><a href="${href}"${here}>${label}</a></li>`;
  });
  return `<header class="site-header">
  <div class="bar">
    <a class="brand" href="/">Cookie Compliance <span>Agent Manual</span></a>
    <nav aria-label="Main">
    <ul>
${items.join('\n')}
    </ul>
    </nav>
  </div>
</header>`;
}

export const FOOTER = `<footer class="site-footer">
  <p>Cookie Compliance is a product of <a href="https://hu-manity.co">Hu-manity.co</a>.
  Source and contributions: <a href="${GITHUB}">github.com/humanityco/cookie-compliance-agent-manual</a>.</p>
</footer>`;
