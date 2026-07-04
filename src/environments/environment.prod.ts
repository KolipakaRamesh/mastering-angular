/**
 * FILE: environment.prod.ts  (Production environment)
 * Angular CLI replaces environment.ts with this file in production builds.
 *
 * backendUrl in production should point to your deployed API domain.
 * In a real CI/CD pipeline, you'd inject this at build time via:
 *   ng build --configuration production
 * Or use runtime environment injection for true 12-factor app compliance.
 */
export const environment = {
  production: true,

  // Production mock data URL (if still used, else point to real API endpoint)
  apiUrl: 'https://api.yourcompany.com/api',

  // ── REAL BACKEND API URL in Production ────────────────────────────────
  // Replace with your actual deployed API domain before going live.
  backendUrl: 'https://api.yourcompany.com',

  appVersion: '1.0.0',
  features: {
    enableExport: true,
    enableImport: true,
  }
};
