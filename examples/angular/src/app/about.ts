import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <section class="about">
      <p class="kicker">About this example</p>
      <h1>One head for every page</h1>
      <p><code>src/index.html</code> owns the document head. Home, About, and Product are routes in that same document, so they share the same banner tags.</p>
      <p>The Angular dev server inserts its own client first, and the built page is the one to judge.</p>
    </section>
  `,
})
export class About {}
