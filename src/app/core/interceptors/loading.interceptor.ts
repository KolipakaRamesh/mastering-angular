/**
 * FILE: loading.interceptor.ts
 * PURPOSE: HTTP Interceptor that tracks HTTP requests for loading spinner.
 *
 * ANGULAR CONCEPT: HTTP Interceptors
 * An interceptor is middleware for HTTP requests.
 * It sits between your code and the actual HTTP call.
 *
 * COMMON USE CASES:
 * - Add auth token to every request
 * - Show/hide global loading spinner
 * - Log all API calls
 * - Handle 401/403 errors globally
 * - Retry failed requests
 *
 * MODERN WAY (Angular 15+): Functional interceptors
 * export const loadingInterceptor: HttpInterceptorFn = (req, next) => { ... }
 * Register: provideHttpClient(withInterceptors([loadingInterceptor]))
 *
 * INTERVIEW:
 * Q: Why do we clone the request instead of modifying it?
 * A: HttpRequest objects are IMMUTABLE. You must clone to modify them.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};
