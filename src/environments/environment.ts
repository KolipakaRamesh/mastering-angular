/**
 * FILE: environment.ts  (Development environment)
 * PURPOSE: Environment-specific configuration variables.
 *
 * ANGULAR CONCEPT: Environment Files
 * ════════════════════════════════════════════════════════
 * Angular CLI automatically swaps this file for environment.prod.ts
 * when you run: ng build --configuration production
 *
 * This is the ANGULAR equivalent of ASP.NET Core's appsettings layering:
 *   environment.ts      → appsettings.Development.json
 *   environment.prod.ts → appsettings.Production.json + env variables
 *
 * NEVER hardcode URLs, keys, or environment-specific values in components/services.
 * Always read them from here.
 *
 * INTERVIEW QUESTION:
 * Q: How do Angular environment files get swapped at build time?
 * A: Via the "fileReplacements" array in angular.json under the "production"
 *    build configuration. The CLI replaces environment.ts with environment.prod.ts
 *    before compilation. The import path in your code stays the same — only the
 *    file on disk changes.
 */
export const environment = {
  production: false,

  // ── MOCK DATA API (for EmployeeService — reads local JSON files) ──────
  // This is used by EmployeeService to load employees.json from /assets/
  apiUrl: 'assets/data',

  // ── REAL BACKEND API (ASP.NET Core Web API) ───────────────────────────
  // Used by AuthService and any future real API calls.
  // In production, this will be swapped with the real server URL.
  backendUrl: 'http://localhost:5225',

  appVersion: '1.0.0-dev',
  features: {
    enableExport: true,
    enableImport: false,
  }
};
