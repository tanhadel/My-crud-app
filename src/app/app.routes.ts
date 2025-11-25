import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'books',
    canActivate: [authGuard],
    loadComponent: () => import('./components/books/books.component').then(m => m.BooksComponent)
  },
  {
    path: 'quotes',
    canActivate: [authGuard],
    loadComponent: () => import('./components/quotes/quotes.component').then(m => m.QuotesComponent)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
