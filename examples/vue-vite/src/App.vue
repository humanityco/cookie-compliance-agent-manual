<script setup>
import { ref } from 'vue'

const path = ref(window.location.pathname)

function go(event, next) {
  event.preventDefault()
  window.history.pushState({}, '', next)
  path.value = next
}

window.addEventListener('popstate', () => {
  path.value = window.location.pathname
})
</script>

<template>
  <header class="topbar">
    <a class="brand" href="/" @click="go($event, '/')">Cookie Compliance</a>
    <nav>
      <a href="/" @click="go($event, '/')">Home</a>
      <a href="/about" @click="go($event, '/about')">About</a>
      <a href="/product" @click="go($event, '/product')">Product</a>
    </nav>
  </header>
  <main>
    <section v-if="path === '/product'" class="product">
      <p class="kicker">Field Notes Market</p>
      <h1>Graph Paper Notebook</h1>
      <p class="lede">A sewn notebook of graph paper for sketches and shopping lists. Weekend orders go out on Monday.</p>
      <p>This sample product uses the same shared head as Home and About.</p>
    </section>
    <section v-else-if="path === '/about'" class="about">
      <p class="kicker">About this example</p>
      <h1>One head for every page</h1>
      <p><code>index.html</code> owns the document head. Home, About, and Product are views in that same document, so they share the same banner tags.</p>
      <p>The Vite dev server inserts its own client first, and the built page is the one to judge.</p>
    </section>
    <template v-else>
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
    </template>
  </main>
  <footer class="site-footer">
    <p class="footer-name">Field Notes Market</p>
    <nav>
      <a href="/" @click="go($event, '/')">Home</a>
      <a href="/about" @click="go($event, '/about')">About</a>
      <a href="/product" @click="go($event, '/product')">Product</a>
    </nav>
  </footer>
</template>
