/**
 * FILE: truncate.pipe.ts
 * PURPOSE: A custom Pipe that truncates long text with an ellipsis.
 *
 * ANGULAR CONCEPTS:
 * - Standalone Pipes (formatting data for display in templates)
 * - Pure vs Impure Pipes (performance differences and execution triggers)
 *
 * ─────────────────────────────────────────────
 * INTERVIEW QUESTIONS:
 * ─────────────────────────────────────────────
 * Q: What is the async pipe and why is it useful?
 * A: The async pipe subscribes to an Observable or Promise and automatically unsubscribes when the component is destroyed, preventing memory leaks.
 *
 * Q: What is the difference between pure and impure pipes?
 * A: Pure pipes execute only when the input reference changes (very performant). Impure pipes execute on every change detection cycle (can be a performance risk).
 *
 * Q: How would you create a pipe for currency formatting?
 * A: Create a pipe implementing `PipeTransform` and use `Intl.NumberFormat` inside the `transform()` method to format values according to locale settings.
 */


import { Pipe, PipeTransform } from '@angular/core';

// @Pipe decorator marks this class as a pipe
// standalone: true — no NgModule needed
// name: 'truncate' — how you use it in templates: {{ text | truncate:50 }}
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true // Default, but explicit for learning
})
export class TruncatePipe implements PipeTransform {
  /**
   * transform() is the REQUIRED method for all pipes.
   * It's called every time the pipe processes data.
   *
   * @param value   - The input string (what comes before the pipe: 'text | truncate')
   * @param limit   - Max characters before truncation (default: 50)
   * @param ellipsis - The suffix to add (default: '...')
   * @returns The truncated string
   */
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    // Guard clause: handle null/undefined/empty values gracefully
    if (!value) return '';

    // If text is shorter than limit, return as-is
    if (value.length <= limit) return value;

    // Truncate and append ellipsis
    return value.substring(0, limit) + ellipsis;
  }
}
