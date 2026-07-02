/**
 * FILE: environment.prod.ts  (Production environment)
 * PURPOSE: Production-specific configuration.
 *
 * Angular CLI will REPLACE environment.ts with this file
 * when you run: ng build --configuration production
 */
export const environment = {
  production: true,
  apiUrl: 'https://api.yourcompany.com/api',
  appVersion: '1.0.0',
  features: {
    enableExport: true,
    enableImport: true,
  }
};
