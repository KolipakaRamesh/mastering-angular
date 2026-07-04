/**
 * FILE: employee-form.component.ts
 * PURPOSE: Add and Edit Employee form using Angular Reactive Forms.
 *
 * ANGULAR CONCEPTS:
 * - Reactive Forms (FormGroup, FormControl, FormBuilder, Typed Forms)
 * - Built-in and Custom Validators
 * - Route snapshot parameters (ActivatedRoute)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: Difference between Reactive Forms and Template-driven Forms?
 * A: Reactive forms are code-driven, synchronous, and highly testable. Template-driven forms rely on template directives and are asynchronous.
 *
 * Q: What is FormBuilder?
 * A: A helper service that provides syntactic sugar for creating FormGroup and FormControl instances.
 *
 * Q: What is the difference between setValue() and patchValue()?
 * A: `setValue()` requires all fields in the FormGroup to be set and throws an error if any is missing. `patchValue()` updates only the specified subset of fields.
 *
 * Q: How do you create a custom validator?
 * A: A function that takes an `AbstractControl` and returns `null` if valid, or an error object (e.g., `{ errorName: true }`) if invalid.
 */


import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder, FormGroup, Validators, AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, EmploymentStatus, Department } from '../../../core/models/employee.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

// ─────────────────────────────────────────────
// CUSTOM VALIDATOR FUNCTION
// A validator is a function that takes a control and returns:
//   null → valid
//   { errorKey: any } → invalid (errorKey can be anything descriptive)
// ─────────────────────────────────────────────
function phoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null; // Not required here — let Validators.required handle that

  // Simple phone validation: must start with + and have at least 10 digits
  const phonePattern = /^\+?[\d\s\-()]{10,15}$/;
  return phonePattern.test(value) ? null : { invalidPhone: true };
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,   // REQUIRED for Reactive Forms!
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDividerModule,
    PageHeaderComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  // ─────────────────────────────────────────────
  // DEPENDENCY INJECTION — All using inject()
  // ─────────────────────────────────────────────
  private fb = inject(FormBuilder);             // Form creation helper
  private router = inject(Router);              // For navigation after save
  private route = inject(ActivatedRoute);       // To read :id from URL
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);       // Material toast notifications

  // ─────────────────────────────────────────────
  // COMPONENT STATE
  // ─────────────────────────────────────────────
  isEditMode = false;           // true = editing, false = adding new
  employeeId: number | null = null;
  isSubmitting = false;

  // Dropdown options
  readonly departments = this.employeeService.getDepartments();
  readonly statuses = this.employeeService.getStatuses();

  // ─────────────────────────────────────────────
  // REACTIVE FORM
  // FormBuilder.group() creates a FormGroup with all our form controls.
  // Each field: [initialValue, [validators]]
  // ─────────────────────────────────────────────
  employeeForm: FormGroup = this.fb.group({
    // Personal Info
    firstName: ['', [
      Validators.required,          // Cannot be empty
      Validators.minLength(2),      // At least 2 characters
      Validators.maxLength(50),     // Maximum 50 characters
    ]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [
      Validators.required,
      Validators.email,             // Built-in email format validation
    ]],
    phone: ['', [
      Validators.required,
      phoneValidator,               // Our custom validator!
    ]],

    // Employment Info
    department: ['', Validators.required],
    designation: ['', [Validators.required, Validators.minLength(3)]],
    salary: [null, [
      Validators.required,
      Validators.min(10000),        // Minimum salary
      Validators.max(10000000),     // Maximum salary
    ]],
    joinDate: ['', Validators.required],
    status: [EmploymentStatus.Active, Validators.required],

    // Optional fields (no required validator)
    avatarUrl: [''],
    address: [''],
  });

  ngOnInit(): void {
    // ─────────────────────────────────────────────
    // ROUTE PARAMETERS
    // ActivatedRoute gives access to URL params.
    // route.snapshot.params — current params at time of navigation (synchronous)
    // route.params — Observable that emits new params when URL changes (reactive)
    //
    // We use snapshot for simplicity since we don't expect params to change
    // while on this page.
    // ─────────────────────────────────────────────
    const id = this.route.snapshot.params['id'];

    if (id) {
      // If there's an :id in the URL → EDIT mode
      this.isEditMode = true;
      this.employeeId = Number(id); // Convert string param to number

      // Load existing employee data
      const employee = this.employeeService.getEmployeeById(this.employeeId);

      if (employee) {
        // patchValue() sets only the specified fields
        // (safer than setValue() which requires ALL fields)
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          salary: employee.salary,
          joinDate: employee.joinDate,
          status: employee.status,
          avatarUrl: employee.avatarUrl || '',
          address: employee.address || '',
        });
      } else {
        // Employee not found — go back to list
        this.router.navigate(['/employees/list']);
      }
    }
    // If no id → ADD mode (form stays with empty defaults)
  }

  // ─────────────────────────────────────────────
  // FORM SUBMISSION
  // ─────────────────────────────────────────────
  onSubmit(): void {
    // Check if form is valid before submitting
    // markAllAsTouched() triggers validation UI on all fields
    // (so user sees all errors, not just touched ones)
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.employeeForm.getRawValue(); // Get all values including disabled fields

    if (this.isEditMode && this.employeeId) {
      // UPDATE
      const updated = this.employeeService.updateEmployee(this.employeeId, formData);
      if (updated) {
        this.showSuccess(`${updated.firstName} ${updated.lastName} updated successfully!`);
        this.router.navigate(['/employees', this.employeeId]);
      }
    } else {
      // CREATE
      const newEmp = this.employeeService.addEmployee(formData);
      this.showSuccess(`${newEmp.firstName} ${newEmp.lastName} added successfully!`);
      this.router.navigate(['/employees', newEmp.id]);
    }

    this.isSubmitting = false;
  }

  // Cancel and go back
  onCancel(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employees/list']);
    }
  }

  // ─────────────────────────────────────────────
  // HELPER: Access form controls easily in template
  // Instead of: employeeForm.get('firstName')
  // We use: f['firstName']
  // ─────────────────────────────────────────────
  get f() {
    return this.employeeForm.controls;
  }

  // Helper: Check if a specific field has an error
  hasError(field: string, error: string): boolean {
    const control = this.employeeForm.get(field);
    // Only show error if: field has been touched AND has this specific error
    return !!(control?.touched && control?.hasError(error));
  }

  // Show Material snackbar (toast notification)
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,              // Auto-dismiss after 3 seconds
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
