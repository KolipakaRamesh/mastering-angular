/**
 * FILE: loading.interceptor.ts
 * PURPOSE: HTTP Interceptor that tracks HTTP requests for loading spinner.
 *
 * ANGULAR CONCEPTS:
 * - Functional HTTP Interceptors (HttpInterceptorFn)
 * - intercepting outgoing requests and incoming responses
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: How do you add a JWT token to all API requests?
 * A: Use an interceptor that clones the request and adds the Authorization header: `req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })`.
 *
 * Q: Why do we clone the request instead of modifying it?
 * A: `HttpRequest` objects are immutable. You must clone them to modify headers or parameters safely.
 *
 * Q: What is the difference between multi: true and functional interceptors?
 * A: Old class-based interceptors required HTTP_INTERCEPTORS tokens with `multi: true`. Functional interceptors are registered directly as an array in `provideHttpClient(withInterceptors([...]))`.
 */


import { HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * LOADING INTERCEPTOR (Functional — Modern Angular way)
 *
 * This interceptor:
 * 1. Sets loading = true before any HTTP request
 * 2. Sets loading = false when the request completes (success or error)
 *
 * HttpInterceptorFn is the type for functional interceptors:
 *   (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() works inside functional interceptors
  const loadingService = inject(LoadingService);

  // Tell the loading service: a request has started
  loadingService.show();

  // next(req) passes the request to the next interceptor (or actual HTTP call)
  // It returns an Observable of HttpEvents
  return next(req).pipe(
    // finalize() runs when the Observable completes OR errors
    // This is like a "finally" block — perfect for cleanup
    finalize(() => {
      loadingService.hide();
    })
  );
};
