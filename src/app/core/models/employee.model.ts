/**
 * FILE: employee.model.ts
 * PURPOSE: Defines TypeScript interfaces and types for Employee data.
 *
 * ANGULAR CONCEPT: TypeScript Interfaces for Data Modeling
 * In TypeScript/Angular, we use interfaces/types to describe the shape of data.
 * This gives us type safety — the compiler warns if we access non-existent properties.
 */

export enum Department {
  Engineering = 'Engineering',
  Marketing = 'Marketing',
  HR = 'HR',
  Finance = 'Finance',
  Design = 'Design',
  Sales = 'Sales',
}

export enum EmploymentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  OnLeave = 'On Leave',
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  salary: number;
  joinDate: string;
  status: EmploymentStatus;
  avatarUrl?: string;
  address?: string;
}

// Omit<T, K> — TypeScript utility: creates Employee type without 'id'
export type EmployeeFormData = Omit<Employee, 'id'>;

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  newThisMonth: number;
}
