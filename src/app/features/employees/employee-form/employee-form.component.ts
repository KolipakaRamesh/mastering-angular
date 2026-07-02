/**
 * FILE: employee-form.component.ts
 * PURPOSE: Add and Edit Employee form using Angular Reactive Forms.
 *
 * TWO TYPES OF FORMS IN ANGULAR:
 * 1. TEMPLATE-DRIVEN: Logic in HTML, uses NgModel. Simple but harder to test.
 * 2. REACTIVE FORMS (this file): Logic in TypeScript. FormControl, FormGroup, FormBuilder.
 *    More powerful, easier to test, great for complex validation.
 *
 * KEY CLASSES:
 * - FormControl  — A single form field
 * - FormGroup    — A group of FormControls (the whole form)
 * - FormBuilder  — Helper service to create FormGroups concisely
 *
 * TYPED FORMS (Angular 14+):
 *   OLD: form.get('name')?.value → type is 'any'
 *   NEW: form.controls.name.value → type is inferred!
 *
 * INTERVIEW:
 * Q: Difference between setValue() and patchValue()?
 * A: setValue() requires ALL fields. patchValue() updates only specified fields.
 *
 * Q: How to create a custom validator?
 * A: A function that takes AbstractControl and returns null (valid) or {errorKey: true}.
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

// CUSTOM VALIDATOR — returns null if valid, {errorKey: true} if invalid
function phoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const value = control.value;
  if (!value) return null;
  const phonePattern = /^\+?[\d\s\-()]{10,15}$/;
  return phonePattern.test(value) ? null : { invalidPhone: true };
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCardModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule, MatDividerModule,
    PageHeaderComponent,
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  employeeId: number | null = null;
  isSubmitting = false;

  readonly departments = this.employeeService.getDepartments();
  readonly statuses = this.employeeService.getStatuses();

  employeeForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, phoneValidator]],
    department: ['', Validators.required],
    designation: ['', [Validators.required, Validators.minLength(3)]],
    salary: [null, [Validators.required, Validators.min(10000), Validators.max(10000000)]],
    joinDate: ['', Validators.required],
    status: [EmploymentStatus.Active, Validators.required],
    avatarUrl: [''],
    address: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.isEditMode = true;
      this.employeeId = Number(id);

      const employee = this.employeeService.getEmployeeById(this.employeeId);

      if (employee) {
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
        this.router.navigate(['/employees/list']);
      }
    }
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.employeeForm.getRawValue();

    if (this.isEditMode && this.employeeId) {
      const updated = this.employeeService.updateEmployee(this.employeeId, formData);
      if (updated) {
        this.showSuccess(`${updated.firstName} ${updated.lastName} updated successfully!`);
        this.router.navigate(['/employees', this.employeeId]);
      }
    } else {
      const newEmp = this.employeeService.addEmployee(formData);
      this.showSuccess(`${newEmp.firstName} ${newEmp.lastName} added successfully!`);
      this.router.navigate(['/employees', newEmp.id]);
    }

    this.isSubmitting = false;
  }

  onCancel(): void {
    if (this.isEditMode && this.employeeId) {
      this.router.navigate(['/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employees/list']);
    }
  }

  get f() {
    return this.employeeForm.controls;
  }

  hasError(field: string, error: string): boolean {
    const control = this.employeeForm.get(field);
    return !!(control?.touched && control?.hasError(error));
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
