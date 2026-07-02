/**
 * FILE: employee.service.ts
 * PURPOSE: The central service that manages all employee data.
 *
 * ANGULAR CONCEPTS:
 * 1. SERVICES — Share data or logic between components (no UI)
 * 2. DEPENDENCY INJECTION — @Injectable() registers with Angular's DI system
 * 3. SIGNALS (Angular 16+) — Reactive primitive for state management
 * 4. HTTP CLIENT — Angular's HttpClient to fetch data
 * 5. OBSERVABLES + RXJS — HttpClient returns Observables
 *
 * MODERN Angular 20 vs 2019:
 *   OLD:  constructor(private http: HttpClient) {}
 *   NEW:  private http = inject(HttpClient);   // inject() function
 *
 *   OLD:  private employees: Employee[] = [];
 *   NEW:  private employees = signal<Employee[]>([]);  // Signals for reactivity
 *
 * INTERVIEW:
 * Q: What is providedIn: 'root'?
 * A: Angular creates ONE singleton instance for the entire app.
 *
 * Q: What is the difference between a Signal and an Observable?
 * A: Signal is synchronous, always has a current value, simpler API.
 *    Observable is async, lazy, powerful with RxJS operators.
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Employee, EmployeeFormData, DashboardStats, Department, EmploymentStatus } from '../models/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  private _employees = signal<Employee[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _nextId = signal<number>(11);

  readonly employees = this._employees.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // computed() creates a DERIVED signal — recalculated whenever dependencies change
  readonly dashboardStats = computed<DashboardStats>(() => {
    const emps = this._employees();
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalEmployees: emps.length,
      activeEmployees: emps.filter(e => e.status === EmploymentStatus.Active).length,
      departments: new Set(emps.map(e => e.department)).size,
      newThisMonth: emps.filter(e => new Date(e.joinDate) >= firstOfMonth).length,
    };
  });

  readonly departmentCounts = computed(() => {
    const emps = this._employees();
    const counts: Record<string, number> = {};
    emps.forEach(e => {
      counts[e.department] = (counts[e.department] || 0) + 1;
    });
    return counts;
  });

  loadEmployees(): Observable<Employee[]> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<Employee[]>(`${environment.apiUrl}/employees.json`).pipe(
      tap(employees => {
        this._employees.set(employees);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._error.set('Failed to load employees. Please try again.');
        this._isLoading.set(false);
        console.error('Error loading employees:', error);
        return throwError(() => error);
      })
    );
  }

  getEmployeeById(id: number): Employee | undefined {
    return this._employees().find(emp => emp.id === id);
  }

  addEmployee(formData: EmployeeFormData): Employee {
    const newEmployee: Employee = {
      ...formData,
      id: this._nextId(),
    };
    this._employees.update(current => [...current, newEmployee]);
    this._nextId.update(id => id + 1);
    return newEmployee;
  }

  updateEmployee(id: number, formData: EmployeeFormData): Employee | null {
    let updated: Employee | null = null;
    this._employees.update(current =>
      current.map(emp => {
        if (emp.id === id) {
          updated = { ...formData, id };
          return updated;
        }
        return emp;
      })
    );
    return updated;
  }

  deleteEmployee(id: number): void {
    this._employees.update(current => current.filter(emp => emp.id !== id));
  }

  searchEmployees(query: string): Employee[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return this._employees();
    return this._employees().filter(emp =>
      emp.firstName.toLowerCase().includes(lowerQuery) ||
      emp.lastName.toLowerCase().includes(lowerQuery) ||
      emp.email.toLowerCase().includes(lowerQuery) ||
      emp.department.toLowerCase().includes(lowerQuery) ||
      emp.designation.toLowerCase().includes(lowerQuery)
    );
  }

  getDepartments(): Department[] {
    return Object.values(Department);
  }

  getStatuses(): EmploymentStatus[] {
    return Object.values(EmploymentStatus);
  }
}
