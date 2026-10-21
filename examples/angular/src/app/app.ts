import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">Cookie Compliance</a>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/about">About</a>
        <a routerLink="/product">Product</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer class="site-footer">
      <p class="footer-name">Field Notes Market</p>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/about">About</a>
        <a routerLink="/product">Product</a>
      </nav>
    </footer>
  `,
})
export class App {}
