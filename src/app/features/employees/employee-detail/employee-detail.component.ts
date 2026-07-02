/**
 * FILE: employee-detail.component.ts
 * PURPOSE: Shows full details of a single employee.
 *
 * CONCEPTS:
 * - Route Parameters (reading :id from URL via ActivatedRoute)
 * - Signals for local state
 * - Router navigation (programmatic)
 * - MatDialog for delete confirmation
 */
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, EmploymentStatus } from '../../../core/models/employee.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatDividerModule, DatePipe, CurrencyPipe,
    PageHeaderComponent,
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  employee: Employee | null = null;
  notFound = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    const found = this.employeeService.getEmployeeById(id);
    if (found) {
      this.employee = found;
    } else {
      this.notFound = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editEmployee(): void {
    this.router.navigate(['/employees', this.employee?.id, 'edit']);
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: <ConfirmDialogData>{
        title: 'Delete Employee',
        message: `Delete ${this.employee.firstName} ${this.employee.lastName}?`,
        confirmText: 'Delete', isDestructive: true
      }
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(confirmed => {
      if (confirmed && this.employee) {
        this.employeeService.deleteEmployee(this.employee.id);
        this.snackBar.open('Employee deleted', 'OK', { duration: 3000 });
        this.router.navigate(['/employees/list']);
      }
    });
  }

  getStatusClass(status: string): string {
    return status === EmploymentStatus.Active ? 'status-active' :
           status === EmploymentStatus.Inactive ? 'status-inactive' : 'status-on-leave';
  }
}
