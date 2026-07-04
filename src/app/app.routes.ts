/**
 * FILE: app.routes.ts
 * PURPOSE: Configures root-level routes, lazy-loaded feature components, redirects, and guards.
 *
 * ANGULAR CONCEPTS:
 * - Routing Module Configuration (Routes array)
 * - Lazy Loading using loadComponent and loadChildren (dynamically importing components/modules on-demand)
 * - Route Guards (canActivate using authGuard for secure routes)
 * - Wildcard routes for unmatched paths (fallback handling to NotFoundComponent)
 * - Route-level page titles mapping to browser title bar
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What is the difference between `loadComponent` and `loadChildren` in Angular routing?
 * A: `loadComponent` is used for lazy loading a single standalone component. `loadChildren` is used for lazy loading a set of child routes or an entire routing module config.
 *
 * Q: What is the `pathMatch: 'full'` strategy in routing?
 * A: It specifies that the router should only redirect or load the component if the remaining, unmatched segments of the URL match the path exactly. This is crucial for empty path redirects (e.g., path: '').
 */

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(c => c.LoginComponent),
    title: 'Sign In — EmpManager'
  },
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
    title: 'Dashboard — EmpManager',
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employees.routes')
        .then(r => r.employeeRoutes),
    canActivate: [authGuard]
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component')
        .then(c => c.AboutComponent),
    title: 'About — EmpManager'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component')
        .then(c => c.NotFoundComponent),
    title: '404 — Page Not Found'
  }
];
