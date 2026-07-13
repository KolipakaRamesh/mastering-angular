/**
 * FILE: error.interceptor.ts
 * PURPOSE: Global HTTP Error Interceptor that catches HTTP errors and displays toast alerts.
 *
 * ANGULAR CONCEPTS:
 * - Functional HTTP Interceptors (HttpInterceptorFn)
 * - Error Handling using catchError operator (RxJS)
 * - Dependency Injection inside functional middleware (inject())
 * - Material SnackBar for non-blocking alerts (MatSnackBar)
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  
  console.log('🚀 errorInterceptor: Request outgoing:', req.method, req.url);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('❌ errorInterceptor: Caught HTTP Error:', error.status, error.message);
      let errorMessage = 'An unexpected error occurred.';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error (e.g. no internet)
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Cannot connect to the server. Please check your internet connection or backend status.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Invalid request parameters (Bad Request).';
            break;
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            authService.logout();
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found on the server.';
            break;
          case 500:
            errorMessage = 'Internal Server Error. Please contact support or try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Server Error: ${error.statusText} (${error.status})`;
            break;
        }
      }

      // Display the error notification
      snackBar.open(errorMessage, 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      // Forward the error to the calling service in case they want local handling
      return throwError(() => error);
    })
  );
};
