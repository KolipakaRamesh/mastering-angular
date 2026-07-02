import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** 404 Not Found page — shown for any unmatched URL via the wildcard route */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-page fade-in">
      <div class="error-code">404</div>
      <mat-icon class="error-icon">search_off</mat-icon>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a mat-raised-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Go to Dashboard
      </a>
    </div>
  `,
  styles: [`
    .not-found-page {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 60vh; text-align: center;
    }
    .error-code { font-size: 120px; font-weight: 900; color: #e8eaf6; line-height: 1; }
    .error-icon { font-size: 64px; width: 64px; height: 64px; color: #9e9e9e; margin-bottom: 16px; }
    h2 { font-size: 24px; color: #333; margin: 0 0 8px; }
    p { color: #888; margin: 0 0 24px; }
  `]
})
export class NotFoundComponent {}
