/**
 * FILE: app.config.ts
 * PURPOSE: Application-wide configuration — this REPLACES the old AppModule.
 *
 * In Angular 8/9, you had AppModule which was the "root module".
 * In Angular 20, everything is done with provider functions (provideXxx).
 * These are cleaner, tree-shakable, and don't require NgModules.
 *
 * INTERVIEW QUESTIONS:
 * Q: What replaced AppModule in Angular 20?
 * A: bootstrapApplication() + app.config.ts with ApplicationConfig.
 *
 * Q: What is provideHttpClient(withInterceptors([...]))?
 * A: Configures Angular's HttpClient with functional interceptors.
 */

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([loadingInterceptor])
    ),
    provideAnimationsAsync(),
  ]
};
