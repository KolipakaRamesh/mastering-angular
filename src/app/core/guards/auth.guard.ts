/**
 * FILE: auth.guard.ts
 * PURPOSE: A Route Guard that controls access to protected routes.
 *
 * ANGULAR CONCEPT: Route Guards
 * Guards are functions that run BEFORE a route is activated.
 * They return: true (allow), false (block), or UrlTree (redirect).
 *
 * MODERN WAY (Angular 14+): Functional guards
 * export const authGuard: CanActivateFn = (route, state) => { ... }
 *
 * OLD WAY (Angular 8/9): Class-based guards implementing CanActivate
 *
 * INTERVIEW:
 * Q: What is the difference between canActivate and canDeactivate?
 * A: canActivate runs BEFORE entering a route.
 *    canDeactivate runs BEFORE LEAVING a route ("unsaved changes" warnings).
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // SIMULATION: Check if user is "logged in"
  // In a real app: const authService = inject(AuthService); return authService.isAuthenticated();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true;
  }

  // Redirect to dashboard and pass the attempted URL
  return router.parseUrl(`/dashboard?returnUrl=${state.url}`);
};
