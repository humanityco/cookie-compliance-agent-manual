import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'

function navigate(event: Event, el: Element, path: { value: string }) {
  event.preventDefault()
  const next = el.getAttribute('href') || '/'
  history.pushState({}, '', next)
  path.value = next
}

export const App = component$(() => {
  const path = useSignal('/')

  useVisibleTask$(() => {
    path.value = window.location.pathname
    const onPop = () => {
      path.value = window.location.pathname
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  })

  return (
    <>
      <header class="topbar">
        <a class="brand" href="/" onClick$={(event, el) => navigate(event, el, path)}>Cookie Compliance</a>
        <nav>
          <a href="/" onClick$={(event, el) => navigate(event, el, path)}>Home</a>
          <a href="/about" onClick$={(event, el) => navigate(event, el, path)}>About</a>
          <a href="/product" onClick$={(event, el) => navigate(event, el, path)}>Product</a>
        </nav>
      </header>
      <main>
        {path.value === '/about' ? (
          <section class="about">
            <p class="kicker">About this example</p>
            <h1>One head for every page.</h1>
            <p><code>index.html</code> owns the document head. Home, About, and Product are views in that same document, so they share the same banner tags.</p>
            <p>Put the snippet in <code>index.html</code>, not in a component. The optimizer rewrites component scripts.</p>
          </section>
        ) : path.value === '/product' ? (
          <section class="product">
            <p class="kicker">Field Notes Market</p>
            <h1>Graph Paper Notebook</h1>
            <p class="lede">A sewn notebook of graph paper for sketches and shopping lists. Weekend orders go out on Monday.</p>
            <p>This sample product uses the same shared head as Home and About.</p>
          </section>
        ) : (
          <>
            <section class="hero">
              <p class="kicker">Placement example</p>
              <h1>Consent before the trackers run.</h1>
              <p class="lede">This page is a placement example for the Cookie Compliance banner (Hu-manity.co). The snippet sits in the shared document head, on Home, About, and Product together.</p>
            </section>
            <div class="cards">
              <article class="card">
                <h2>Blocks before consent</h2>
                <p>The shared head sets blocking to true and places the banner script before the analytics placeholder.</p>
              </article>
              <article class="card">
                <h2>Shared layout</h2>
                <p>Home, About, and Product share one layout, so the snippet is installed once.</p>
              </article>
              <article class="card">
                <h2>Replace YOUR_APP_ID</h2>
                <p>The app id in huOptions is the placeholder YOUR_APP_ID. Replace it with the id for the site you are installing.</p>
              </article>
            </div>
            <section class="story">
              <p class="kicker">From the shop</p>
              <h2>Field Notes Market</h2>
              <p>Notebooks, tins, and a jar of honey. Weekend orders go out on Monday. The list stays short: graph paper, black tea, and beeswax wraps.</p>
              <p>This block is sample page content, so the example looks like a site the banner would sit on.</p>
            </section>
            <section class="categories">
              <p class="kicker">Cookie categories</p>
              <h2>Four groups a banner can list</h2>
              <div class="category-grid">
                <article class="card">
                  <h2>Necessary</h2>
                  <p>Cookies the shop uses to load pages, keep a cart, and store the consent choice.</p>
                </article>
                <article class="card">
                  <h2>Preferences</h2>
                  <p>Cookies that remember choices such as language or a saved list.</p>
                </article>
                <article class="card">
                  <h2>Statistics</h2>
                  <p>Cookies that count visits and show which pages people open.</p>
                </article>
                <article class="card">
                  <h2>Marketing</h2>
                  <p>Cookies that measure ads and remember a campaign someone arrived from.</p>
                </article>
              </div>
              <p class="note">These names illustrate the groups a banner can list on a page like this.</p>
            </section>
          </>
        )}
      </main>
      <footer class="site-footer">
        <p class="footer-name">Field Notes Market</p>
        <nav>
          <a href="/" onClick$={(event, el) => navigate(event, el, path)}>Home</a>
          <a href="/about" onClick$={(event, el) => navigate(event, el, path)}>About</a>
          <a href="/product" onClick$={(event, el) => navigate(event, el, path)}>Product</a>
        </nav>
      </footer>
    </>
  )
})
