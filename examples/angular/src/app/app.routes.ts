import { Routes } from '@angular/router';
import { About } from './about';
import { Home } from './home';
import { Product } from './product';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'product', component: Product },
];
