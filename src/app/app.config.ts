/**
 * FILE: app.config.ts
 * PURPOSE: Application-wide configuration — this REPLACES the old AppModule.
 *
 * ANGULAR CONCEPTS:
 * - Application Configuration (ApplicationConfig)
 * - Standalone API provider functions (provideRouter, provideHttpClient, etc.)
 * - Tree-shaking optimizations enabled by provider functions
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What replaced AppModule in Angular?
 * A: Standalone bootstrapping using `bootstrapApplication()` with `ApplicationConfig` objects defined in `app.config.ts`.
 *
 * Q: What is provideHttpClient(withInterceptors([...]))?
 * A: A provider function that registers the `HttpClient` service and configures it with functional interceptors and optional features like native Fetch API (`withFetch()`).
 *
 * Q: What is provideAnimationsAsync()?
 * A: A provider function that loads Angular animation capabilities lazily for better initial load performance, replacing the eager `BrowserAnimationsModule`.
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
import { authInterceptor } from './core/interceptors/auth.interceptor';

// ApplicationConfig is just an object with a "providers" array
// It's passed to bootstrapApplication() in main.ts
export const appConfig: ApplicationConfig = {
  providers: [

    // ── GLOBAL ERROR LISTENER ───────────────────────────────
    // Angular 20 feature — captures unhandled errors globally
    provideBrowserGlobalErrorListeners(),

    // ── CHANGE DETECTION STRATEGY ───────────────────────────
    // Zone.js-based change detection with event coalescing.
    // eventCoalescing: true batches multiple DOM events into
    // a single change detection cycle — BETTER PERFORMANCE.
    // This is the modern replacement of NgZone configurations.
    provideZoneChangeDetection({ eventCoalescing: true }),

    // ── ROUTER ───────────────────────────────────────────────
    // Provides Angular's Router with our routes configuration.
    // withViewTransitions() enables smooth page transition animations
    // (Angular 17+ feature, uses browser's View Transitions API)
    provideRouter(
      routes,
      withViewTransitions() // Smooth fade between route changes
    ),

    // ── HTTP CLIENT ───────────────────────────────────────────
    // Provides Angular's HttpClient service app-wide.
    // withInterceptors([]) registers our functional interceptors.
    // withFetch() uses browser's native Fetch API (faster than XHR).
    provideHttpClient(
      withFetch(),                              // Use Fetch instead of XHR
      withInterceptors([authInterceptor, loadingInterceptor])    // Register our interceptors
    ),

    // ── ANIMATIONS ────────────────────────────────────────────
    // Provides Angular animations (required for Angular Material).
    // Async version loads animation code lazily — better performance.
    // OLD WAY: imports: [BrowserAnimationsModule] in AppModule
    provideAnimationsAsync(),
  ]
};
