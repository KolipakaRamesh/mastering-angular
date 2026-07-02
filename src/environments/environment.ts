/**
 * FILE: environment.ts  (Development environment)
 * PURPOSE: Stores environment-specific configuration variables.
 *
 * WHY DO WE NEED THIS?
 * Different environments (dev, staging, production) often have different
 * API URLs, feature flags, etc. Instead of hardcoding values everywhere,
 * we centralize them here. Angular CLI automatically swaps this file
 * for environment.prod.ts when you run `ng build --configuration production`.
 *
 * ANGULAR CONCEPT: Environment Configuration
 */
export const environment = {
  production: false,
  apiUrl: 'assets/data',
  appVersion: '1.0.0-dev',
  features: {
    enableExport: true,
    enableImport: false,
  }
};
