/**
 * FILE: app.component.ts  (Root Component / Shell)
 * PURPOSE: The outermost shell of the application — contains the nav sidebar and router outlet.
 *
 * LIFECYCLE HOOKS — Angular calls these methods at specific times:
 *   ngOnInit()  — Called ONCE after component initializes
 *   ngOnDestroy() — Called just before component is destroyed (cleanup)
 *
 * INTERVIEW QUESTIONS:
 * Q: What is the difference between ngOnInit() and constructor()?
 * A: Constructor runs when TypeScript creates the class instance.
 *    ngOnInit() runs after Angular has set all @Input() values.
 *    BEST PRACTICE: Use constructor ONLY for DI. Use ngOnInit() for init logic.
 */

import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { EmployeeService } from './core/services/employee.service';

// Navigation item interface — defines shape of our nav links
interface NavItem {
  label: string;
  icon: string;
  route: string;
  tooltip: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SpinnerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private employeeService = inject(EmployeeService);

  isMenuCollapsed = false;
  currentYear = new Date().getFullYear();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', tooltip: 'Dashboard' },
    { label: 'Employees', icon: 'people', route: '/employees/list', tooltip: 'All Employees' },
    { label: 'Add Employee', icon: 'person_add', route: '/employees/add', tooltip: 'Add New Employee' },
    { label: 'About', icon: 'info', route: '/about', tooltip: 'About This App' },
  ];

  ngOnInit(): void {
    this.employeeService.loadEmployees().subscribe({
      next: (employees) => {
        console.log(`✅ Loaded ${employees.length} employees`);
      },
      error: (err) => {
        console.error('❌ Failed to load employees:', err);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
