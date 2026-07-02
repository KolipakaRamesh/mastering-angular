/**
 * FILE: page-header.component.ts
 * PURPOSE: Reusable page header component with title, subtitle, and action buttons.
 *
 * ANGULAR CONCEPTS: Component Communication
 *
 * PARENT → CHILD (Input / Property Binding):
 *   Parent: <app-page-header [title]="'Dashboard'">
 *   Child: @Input() title: string = '';
 *
 * CHILD → PARENT (Output / Event Binding):
 *   Child: @Output() addClicked = new EventEmitter<void>();
 *   Parent: <app-page-header (addClicked)="onAddEmployee()">
 *
 * ng-content = Content Projection (like React's {children})
 *
 * MODERN (Angular 17+) — Signal Inputs:
 *   title = input<string>('');         // Signal Input with default
 *   title = input.required<string>();  // Required signal input
 *
 * INTERVIEW:
 * Q: What is the difference between @Input() and input()?
 * A: @Input() is decorator-based. input() is signal-based (Angular 17+).
 *    Both work in templates the same way: [title]="someValue"
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ title }}</h1>
        @if (subtitle) {
          <p class="page-subtitle">{{ subtitle }}</p>
        }
      </div>

      <div class="header-actions">
        <!-- ng-content = CONTENT PROJECTION — parent can inject any HTML here -->
        <ng-content></ng-content>

        @if (showAddButton) {
          <button mat-raised-button color="primary" (click)="onAddClick()">
            <mat-icon>add</mat-icon>
            {{ addButtonLabel }}
          </button>
        }
      </div>
    </div>
  `,
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
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showAddButton: boolean = false;
  @Input() addButtonLabel: string = 'Add New';

  @Output() addClicked = new EventEmitter<void>();

  onAddClick(): void {
    this.addClicked.emit();
  }
}
