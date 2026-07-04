/**
 * FILE: auth.service.ts
 * PURPOSE: Manages user authentication state, session storage persistence, and login/logout flows.
 *
 * ANGULAR CONCEPTS:
 * - Injectable Service (providedIn: 'root' singleton)
 * - State management using Signals (tokenSignal, currentUser, currentUserRole)
 * - Reactively derived state via computed signals (isAuthenticated)
 * - Dependency Injection using inject() function
 * - HTTP request handling via HttpClient
 * - LocalStorage integration for persistent user sessions
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: How can we persist authentication state in an Angular app across browser page refreshes?
 * A: Persist the authentication token and username/role in `localStorage` or `sessionStorage` during login, and initialize the component/service state signals using those stored values when the app bootstraps.
 *
 * Q: What is the difference between setting a signal vs updating a signal?
 * A: `.set(value)` replaces the current value of the signal with a completely new one. `.update(fn)` computes a new value based on the current value by passing a callback function (e.g., `this.token.update(val => !val)`).
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly authUrl = `${environment.backendUrl}/api/authentication`;

  // Initialize state signals from localStorage for session persistence across refreshes
  private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));
  currentUser = signal<string | null>(localStorage.getItem('auth_username'));
  currentUserRole = signal<string | null>(localStorage.getItem('auth_role'));

  // Reactively computed authentication status
  isAuthenticated = computed(() => !!this.tokenSignal());

  /**
   * Sends user credentials to the API to authenticate.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap((response: LoginResponse) => {
          this.saveSession(response);
        })
      );
  }

  /**
   * Clears the session and redirects to the login page.
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Retrieves the current token value.
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  private saveSession(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_username', response.username);
    localStorage.setItem('auth_role', response.role);
    localStorage.setItem('auth_expires', response.expiresAt);

    this.tokenSignal.set(response.token);
    this.currentUser.set(response.username);
    this.currentUserRole.set(response.role);
  }

  private clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_expires');

    this.tokenSignal.set(null);
    this.currentUser.set(null);
    this.currentUserRole.set(null);
  }
}
