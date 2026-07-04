/**
 * FILE: auth.interceptor.ts
 * PURPOSE: Intercepts outgoing HTTP requests and appends a Bearer JWT token if the user is authenticated.
 *
 * ANGULAR CONCEPTS:
 * - Functional HTTP Interceptors (HttpInterceptorFn)
 * - Dependency Injection inside functional middleware (inject())
 * - Cloning immutable HttpRequest objects via req.clone() to safely append HTTP headers
 * - Environment checks to prevent leaking sensitive tokens to third-party domains
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: Why do we clone the HTTP request inside interceptors instead of modifying the request directly?
 * A: `HttpRequest` objects in Angular are immutable by design. Immutability ensures that the same request object can be safely retried or handled by multiple interceptors in the pipeline without side-effects.
 *
 * Q: Why is it a security risk to attach authorization tokens to all outgoing requests unconditionally?
 * A: If the application calls a third-party API or an external domain (e.g., fetching a map or image), sending the Authorization header with your JWT token exposes your credentials to that third party. Interceptors should check the URL (e.g., matching `environment.backendUrl`) before appending headers.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // SECURITY BEST PRACTICE: Only attach the JWT token if:
  // 1. The token exists
  // 2. The request is directed to our backend API (prevents leaking the token to third-party domains)
  const isApiRequest = (environment.backendUrl && req.url.startsWith(environment.backendUrl)) ||
                       req.url.startsWith('api/') ||
                       req.url.startsWith('/api/');

  if (token && isApiRequest) {
    // Clone the request and add the Authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Pass the cloned request with the header to the next handler
    return next(authReq);
  }

  // If there is no token or it's an external request, pass the original request unchanged
  return next(req);
};