/**
 * FILE: employees.routes.ts
 * PURPOSE: Child routes for the /employees feature area.
 *
 * This file is loaded LAZILY — only when the user navigates to /employees.
 *
 * ROUTE PARAMETERS:
 * ':id' is a dynamic parameter. In /employees/5/edit, id = "5"
 * Read in component using ActivatedRoute.
 */
import { Routes } from '@angular/router';

export const employeeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./employee-list/employee-list.component')
        .then(c => c.EmployeeListComponent),
    title: 'All Employees'
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./employee-form/employee-form.component')
        .then(c => c.EmployeeFormComponent),
    title: 'Add Employee'
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./employee-detail/employee-detail.component')
        .then(c => c.EmployeeDetailComponent),
    title: 'Employee Details'
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./employee-form/employee-form.component')
        .then(c => c.EmployeeFormComponent),
    title: 'Edit Employee'
  },
];
