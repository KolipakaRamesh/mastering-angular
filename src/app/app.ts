/**
 * FILE: app.ts
 * PURPOSE: Root application component that sets up the main layout, sidebar navigation, and handles initial data load.
 *
 * ANGULAR CONCEPTS:
 * - Root Component (standalone app setup)
 * - Navigation layout using Angular Material Sidenav, Toolbar, and List
 * - RxJS Interoperability (converting routing events into Signals using toSignal)
 * - Dynamic layout switching via computed signals (hiding sidebar on login route)
 * - Initialization logic on startup (ngOnInit loading employees)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: How does `toSignal` work in Angular, and why is it useful?
 * A: `toSignal` is a utility from `@angular/core/rxjs-interop` that converts an Observable into a Signal. It subscribes to the Observable immediately and manages cleanup automatically when the context is destroyed, making it easier to read asynchronous streams synchronously inside templates.
 *
 * Q: What is the purpose of `eventCoalescing` in zone configurations?
 * A: It merges multiple events triggered in the same macro-task cycle into a single change detection run, preventing unnecessary rendering cycles and improving application performance.
 */

import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { EmployeeService } from './core/services/employee.service';
import { AuthService } from './core/services/auth.service';

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
  private router          = inject(Router);
  private employeeService = inject(EmployeeService);
  public authService      = inject(AuthService);

  // Converts Router NavigationEnd events into a Signal containing the current URL
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  // Computed state to determine if we are on the login page (layout switching)
  isLoginRoute = computed(() =>
    this.currentUrl()?.startsWith('/login') ?? false
  );

  isMenuCollapsed = false;
  currentYear     = new Date().getFullYear();

  navItems: NavItem[] = [
    { label: 'Dashboard',    icon: 'dashboard',  route: '/dashboard',      tooltip: 'Dashboard' },
    { label: 'Employees',    icon: 'people',     route: '/employees/list', tooltip: 'All Employees' },
    { label: 'Add Employee', icon: 'person_add', route: '/employees/add',  tooltip: 'Add New Employee' },
    { label: 'About',        icon: 'info',       route: '/about',          tooltip: 'About This App' },
  ];

  ngOnInit(): void {
    this.employeeService.loadEmployees().subscribe({
      next: (employees) => console.log(`✅ Loaded ${employees.length} employees`),
      error: (err)      => console.error('❌ Failed to load employees:', err)
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onLogout(): void {
    this.authService.logout();
  }
}