/**
 * FILE: auth.guard.ts
 * PURPOSE: A routing guard that secures routes by checking user authentication status.
 *
 * ANGULAR CONCEPTS:
 * - Functional Route Guards (CanActivateFn)
 * - Dependency Injection in functional context using inject()
 * - AuthService checks to inspect authentication status
 * - Routing redirects with route state preservation (returnUrl query parameter)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What is the difference between Class-based Guards and Functional Guards in Angular?
 * A: Class-based guards implement an interface (like CanActivate) and are registered as services. Functional guards are simple arrow functions matching the CanActivateFn signature. Functional guards are the modern approach (Angular 15+), require less boilerplate, and work naturally with the `inject()` function.
 *
 * Q: How can a route guard redirect an unauthenticated user while preserving the original request URL?
 * A: Retrieve the target URL from the `RouterStateSnapshot.url` argument, and pass it as a query parameter (e.g., `returnUrl`) to the login page redirect route.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl(`/login?returnUrl=${state.url}`);
};
