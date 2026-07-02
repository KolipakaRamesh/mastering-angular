/**
 * FILE: app.routes.ts
 * PURPOSE: Defines the top-level navigation routes for the application.
 *
 * KEY CONCEPTS:
 * 1. LAZY LOADING: loadComponent/loadChildren — loads code ONLY when navigating
 * 2. ROUTE PARAMETERS: { path: 'employees/:id' } — dynamic URL segments
 * 3. REDIRECTS: { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
 * 4. WILDCARD ROUTE: { path: '**' } — catches all unmatched URLs (MUST BE LAST)
 *
 * INTERVIEW:
 * Q: What is the difference between lazy loading and eager loading?
 * A: Eager loads code immediately. Lazy loads code only on navigation to that route.
 *
 * Q: Where should the wildcard route be placed?
 * A: ALWAYS last. Angular processes routes top-to-bottom.
 */

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(c => c.DashboardComponent),
    title: 'Dashboard — Employee Management'
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employees.routes')
        .then(r => r.employeeRoutes),
    // canActivate: [authGuard]  ← Enable this to protect routes
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component')
        .then(c => c.AboutComponent),
    title: 'About — Employee Management'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component')
        .then(c => c.NotFoundComponent),
    title: '404 — Page Not Found'
  }
];
