/**
 * FILE: login.component.ts
 * PURPOSE: Authenticates user credentials and provides access to the application.
 *
 * ANGULAR CONCEPTS:
 * - Standalone Component
 * - Reactive Forms (FormGroup, FormBuilder, Validators)
 * - Signals for UI state management (isLoading, errorMessage, showPassword)
 * - Routing & Navigation redirecting authenticated users
 * - AuthService integration for backend authentication flow
 * - Angular Material integration (MatCardModule, MatFormFieldModule, etc.)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: How do you handle validation errors in Reactive Forms dynamically?
 * A: Use control properties like `touched`, `dirty`, and methods like `hasError(errorName)` to dynamically show validation error messages.
 *
 * Q: What is the benefit of using Signals over plain properties in components?
 * A: Signals provide fine-grained reactivity. When a signal value changes, Angular updates only the exact DOM nodes that depend on it, instead of running a full component tree change detection check.
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl:    './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb          = inject(FormBuilder);
  private router      = inject(Router);
  private authService = inject(AuthService);

  isLoading    = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(3),
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
    ]],
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.isLoading.set(true);

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Invalid username or password.');
      }
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.touched && control.hasError(error));
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}
