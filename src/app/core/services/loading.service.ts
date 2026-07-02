/**
 * FILE: loading.service.ts
 * PURPOSE: Tracks global HTTP loading state using a Signal.
 * Used by the loading interceptor and loading spinner component.
 *
 * Demonstrates the "shared state via service + signal" pattern.
 */
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Counter-based approach: track how many requests are in-flight
  // Handles CONCURRENT requests correctly
  private _requestCount = signal(0);
  readonly isLoading = signal(false);

  show(): void {
    this._requestCount.update(count => count + 1);
    this.isLoading.set(true);
  }

  hide(): void {
    this._requestCount.update(count => Math.max(0, count - 1));
    if (this._requestCount() === 0) {
      this.isLoading.set(false);
    }
  }
}
