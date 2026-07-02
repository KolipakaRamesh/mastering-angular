/**
 * FILE: spinner.component.ts
 * PURPOSE: A reusable global loading spinner component.
 *
 * Pattern: Placed ONCE in app.component.html.
 * Reads loading state from LoadingService and shows/hides itself.
 * No component needs to talk to this spinner directly.
 */
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
  ],
  template: `
    @if (loadingService.isLoading()) {
      <div class="spinner-overlay">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="50"
          color="accent">
        </mat-progress-spinner>
        <p class="loading-text">Loading...</p>
      </div>
    }
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loading-text {
      color: white;
      margin-top: 16px;
      font-size: 14px;
      font-family: 'Roboto', sans-serif;
    }
  `]
})
export class SpinnerComponent {
  loadingService = inject(LoadingService);
}
