/**
 * FILE: about.component.ts
 * PURPOSE: About page — explains the application features and technology stack.
 *
 * ANGULAR CONCEPTS:
 * - Standalone Component
 * - Static data binding and template iteration (@for control flow)
 * - Routing & Navigation (RouterLink)
 * - Angular Material design integration (MatChipsModule, MatCardModule, etc.)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: How does the new `@for` control flow differ from the deprecated `*ngFor` directive?
 * A: `@for` is a built-in control flow structure compiled directly by Angular. It requires a `track` expression for element identity, which avoids bugs and optimizes performance without needing to import `CommonModule`.
 */

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatDividerModule, MatChipsModule, RouterLink],
  template: `
    <div class="about-container fade-in">
      <h1 class="page-title">About This Application</h1>\n      <p class="page-subtitle">A comprehensive Angular 20 learning project</p>

      <mat-card class="info-card about-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>school</mat-icon>
          <mat-card-title>Employee Management System</mat-card-title>\n          <mat-card-subtitle>Built to learn Angular 20 from scratch</mat-card-subtitle>
        </mat-card-header>\n        <mat-card-content>
          <p>
            This application demonstrates ALL major Angular 20 concepts through a practical,
            real-world example. Each feature is commented with explanations, comparisons
            with older Angular versions, and common interview questions.
          </p>

          <mat-divider></mat-divider>

          <h3>Angular Concepts Covered</h3>\n          <div class="chips-container">
            @for (concept of concepts; track concept) {
              <mat-chip>{{ concept }}</mat-chip>
            }
          </div>

          <mat-divider></mat-divider>

          <h3>Tech Stack</h3>\n          <div class="tech-list">
            @for (tech of techStack; track tech.name) {
              <div class="tech-item">
                <mat-icon [style.color]="tech.color">{{ tech.icon }}</mat-icon>
                <div>
                  <strong>{{ tech.name }}</strong>
                  <span>{{ tech.description }}</span>
                </div>
              </div>
            }
          </div>
        </mat-card-content>
        <mat-card-actions>
          <a mat-raised-button color="primary" routerLink="/dashboard">Go to Dashboard</a>
          <a mat-stroked-button routerLink="/employees/list">View Employees</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .about-container { padding: 0; max-width: 800px; }
    .page-title { font-size: 32px; font-weight: 700; color: #1a237e; margin: 0 0 4px; }
    .page-subtitle { color: #666; margin: 0 0 24px; }
    .about-card mat-card-content { padding: 16px !important; }
    .about-card p { color: #555; line-height: 1.6; }
    .chips-container { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
    h3 { color: #1a237e; margin: 16px 0 8px; }
    mat-divider { margin: 16px 0 !important; }
    .tech-list { display: flex; flex-direction: column; gap: 12px; }
    .tech-item { display: flex; align-items: flex-start; gap: 12px;
      mat-icon { font-size: 28px; width: 28px; height: 28px; margin-top: 4px; }
      div { display: flex; flex-direction: column; strong { font-size: 15px; } span { font-size: 13px; color: #666; } }
    }
  `]
})
export class AboutComponent {
  concepts = [
    'Standalone Components', 'Signals', 'Reactive Forms', 'Routing', 'Lazy Loading',
    'Route Guards', 'HTTP Interceptors', 'RxJS', 'Custom Pipes', 'Custom Directives',
    'Angular Material', 'Dependency Injection', 'inject()', '@Input/@Output',
    'Lifecycle Hooks', 'Route Parameters', 'Computed Signals', 'Environment Config'
  ];

  techStack = [
    { name: 'Angular 20', icon: 'web', color: '#dd0031', description: 'Frontend framework by Google' },
    { name: 'TypeScript 5.9', icon: 'code', color: '#3178c6', description: 'Typed JavaScript superset' },
    { name: 'Angular Material 20', icon: 'palette', color: '#009688', description: 'Google\\'s Material Design components' },
    { name: 'SCSS', icon: 'style', color: '#cc6699', description: 'CSS preprocessor for advanced styling' },
    { name: 'RxJS 7', icon: 'sync', color: '#b7178c', description: 'Reactive programming library' },
  ];
}
