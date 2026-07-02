/**
 * FILE: dashboard.component.ts
 * PURPOSE: Dashboard page — shows statistics and quick overview.
 *
 * ANGULAR CONCEPTS:
 * - Standalone Component with Angular Material
 * - inject() for Dependency Injection
 * - Reading Signals in template (computed signals)
 * - ngClass and ngStyle directives
 * - Lifecycle Hooks (ngOnInit)
 * - RouterLink for navigation
 */

import { Component, OnInit, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgStyle } from '@angular/common';

import { EmployeeService } from '../../core/services/employee.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Employee, EmploymentStatus } from '../../core/models/employee.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    NgClass,
    NgStyle,
    PageHeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  readonly stats = this.employeeService.dashboardStats;
  readonly deptCounts = this.employeeService.departmentCounts;
  readonly isLoading = this.employeeService.isLoading;
  readonly error = this.employeeService.error;

  readonly recentEmployees = computed(() => {
    const emps = this.employeeService.employees();
    return [...emps].reverse().slice(0, 5);
  });

  getStatCards() {
    const s = this.stats();
    return [
      {
        title: 'Total Employees',
        value: s.totalEmployees,
        icon: 'people',
        color: '#1a237e',
        bgColor: '#e8eaf6',
        route: '/employees/list'
      },
      {
        title: 'Active Employees',
        value: s.activeEmployees,
        icon: 'person_check',
        color: '#1b5e20',
        bgColor: '#e8f5e9',
        route: '/employees/list'
      },
      {
        title: 'Departments',
        value: s.departments,
        icon: 'business',
        color: '#e65100',
        bgColor: '#fff3e0',
        route: '/employees/list'
      },
      {
        title: 'New This Month',
        value: s.newThisMonth,
        icon: 'trending_up',
        color: '#880e4f',
        bgColor: '#fce4ec',
        route: '/employees/add'
      },
    ];
  }

  ngOnInit(): void {
    console.log('📊 Dashboard initialized');
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      [EmploymentStatus.Active]: 'status-active',
      [EmploymentStatus.Inactive]: 'status-inactive',
      [EmploymentStatus.OnLeave]: 'status-on-leave',
    };
    return classMap[status] || '';
  }

  getDepartmentEntries(): { dept: string; count: number }[] {
    const counts = this.deptCounts();
    return Object.entries(counts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }
}
