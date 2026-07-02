/**
 * FILE: employee-list.component.ts
 * PURPOSE: Displays all employees with search, sort, filter, and pagination.
 *
 * ANGULAR CONCEPTS:
 * - Signals for reactive state management
 * - Two-way Data Binding with [(ngModel)]
 * - Angular Material Table (MatTableModule)
 * - Angular Material Paginator and Sort
 * - Reactive search with debounce (RxJS)
 * - Custom Pipe usage (truncate)
 * - Custom Directive usage (appHighlight)
 * - Observables + fromEvent for search input
 * - Component lifecycle (ngOnInit, ngOnDestroy, ngAfterViewInit)
 * - Router navigation with programmatic navigate()
 */

import {
  Component, OnInit, OnDestroy, inject, signal, computed,
  ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { fromEvent, Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';

import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, Department, EmploymentStatus } from '../../../core/models/employee.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatFormFieldModule, MatButtonModule,
    MatIconModule, MatCardModule, MatChipsModule,
    MatMenuModule, MatSelectModule, MatTooltipModule,
    FormsModule, DatePipe, NgClass,
    PageHeaderComponent, TruncatePipe, HighlightDirective,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy, AfterViewInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('searchInput') searchInputRef!: ElementRef;

  dataSource = new MatTableDataSource<Employee>([]);
  displayedColumns: string[] = [
    'avatar', 'name', 'department', 'designation',
    'salary', 'status', 'joinDate', 'actions'
  ];

  searchQuery = signal('');
  selectedDepartment = signal<string>('');
  selectedStatus = signal<string>('');

  readonly isLoading = this.employeeService.isLoading;
  readonly departments = this.employeeService.getDepartments();
  readonly statuses = this.employeeService.getStatuses();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dataSource.data = this.employeeService.employees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // RxJS debounced search: fromEvent + debounceTime + distinctUntilChanged
    fromEvent<InputEvent>(this.searchInputRef.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    const query = this.searchQuery().toLowerCase().trim();
    const dept = this.selectedDepartment();
    const status = this.selectedStatus();
    const allEmployees = this.employeeService.employees();

    this.dataSource.data = allEmployees.filter(emp => {
      const matchesSearch = !query ||
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query);

      const matchesDept = !dept || emp.department === dept;
      const matchesStatus = !status || emp.status === status;

      return matchesSearch && matchesDept && matchesStatus;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedDepartment.set('');
    this.selectedStatus.set('');
    this.dataSource.data = this.employeeService.employees();
    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.value = '';
    }
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employees', id]);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees', id, 'edit']);
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: <ConfirmDialogData>{
        title: 'Delete Employee',
        message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.employeeService.deleteEmployee(employee.id);
          this.dataSource.data = this.employeeService.employees();
        }
      });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      [EmploymentStatus.Active]: 'status-active',
      [EmploymentStatus.Inactive]: 'status-inactive',
      [EmploymentStatus.OnLeave]: 'status-on-leave',
    };
    return map[status] || '';
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  formatSalary(salary: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(salary);
  }
}
