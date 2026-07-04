/**
 * FILE: page-header.component.ts
 * PURPOSE: Reusable page header component with title, subtitle, and action buttons.
 *
 * ANGULAR CONCEPTS:
 * - Component Communication (@Input, @Output)
 * - Content Projection (<ng-content>)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What is the difference between @Input() and input()?
 * A: @Input() is the decorator-based approach. input() is the signal-based approach (Angular 17+), which creates a Signal representation of the input.
 *
 * Q: What is @Output() used for?
 * A: To emit events from child to parent via EventEmitter.
 *
 * Q: What is ng-content?
 * A: Content projection — allows parent to inject HTML content into the child component.
 */


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    MatButtonModule,  // For mat-button directive
    MatIconModule,    // For mat-icon component
  ],
  template: `
    <div class="page-header">
      <!-- Left side: Title and Subtitle -->\n      <div class="header-content">
        <!-- INTERPOLATION: {{ }} outputs value as text -->\n        <!-- Property Binding would be: [textContent]=\"title\" — less common -->\n        <h1 class="page-title">{{ title }}</h1>

        <!-- @if — modern control flow, replaces *ngIf -->\n        <!-- No CommonModule import needed! -->\n        @if (subtitle) {\n          <p class="page-subtitle">{{ subtitle }}</p>\n        }\n      </div>

      <!-- Right side: Action buttons passed from parent -->\n      <!-- ng-content = CONTENT PROJECTION -->\n      <!-- Parent can put any HTML here: <app-page-header><button>Add</button></app-page-header> -->\n      <div class="header-actions">\n        <ng-content></ng-content>

        <!-- @if checks the showAddButton input -->\n        @if (showAddButton) {\n          <!-- (click) is EVENT BINDING — calls onAddClick() when clicked -->\n          <button mat-raised-button color="primary" (click)="onAddClick()">\n            <!-- mat-icon uses Material Icons font -->\n            <mat-icon>add</mat-icon>\n            <!-- INTERPOLATION for the button label -->\n            {{ addButtonLabel }}\n          </button>\n        }\n      </div>\n    </div>\n  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #1a237e;
    }

    .page-subtitle {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  `]
})
export class PageHeaderComponent {
  // ─────────────────────────────────────────────
  // @Input() — Decorator-based inputs (classic approach)
  // Parent passes values: <app-page-header [title]="'Dashboard'">
  // ─────────────────────────────────────────────

  @Input() title: string = '';                         // Page title (required by convention)
  @Input() subtitle: string = '';                      // Optional subtitle
  @Input() showAddButton: boolean = false;             // Whether to show the Add button
  @Input() addButtonLabel: string = 'Add New';        // Text for the Add button

  // ─────────────────────────────────────────────
  // @Output() — Emits events to the parent component
  // EventEmitter<void> means: emit with no data payload
  // EventEmitter<Employee> would mean: emit an Employee object
  // ─────────────────────────────────────────────

  // Parent listens: <app-page-header (addClicked)="onAdd()">
  @Output() addClicked = new EventEmitter<void>();

  // Called when the Add button is clicked
  // Emits the event UP to the parent
  onAddClick(): void {\n    this.addClicked.emit(); // EventEmitter<void> — no data needed\n  }\n}
