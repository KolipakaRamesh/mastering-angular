/**
 * FILE: truncate.pipe.ts
 * PURPOSE: A custom Pipe that truncates long text with an ellipsis.
 *
 * ANGULAR CONCEPT: Pipes
 * A Pipe transforms data for DISPLAY purposes in templates.
 * Syntax: {{ value | pipeName:arg1:arg2 }}
 *
 * BUILT-IN PIPES:
 *   {{ salary | currency:'INR' }}
 *   {{ joinDate | date:'mediumDate' }}
 *   {{ name | uppercase }}
 *   {{ obj | json }}   ← useful for debugging!
 *
 * PURE vs IMPURE:
 *   Pure (default) — only re-executes when INPUT REFERENCE changes (performant)
 *   Impure (pure: false) — re-executes on every change detection cycle
 *
 * INTERVIEW:
 * Q: What is the async pipe and why is it useful?
 * A: Subscribes to Observable/Promise and auto-unsubscribes on component destroy.
 *    Prevents memory leaks without manual unsubscribe. Usage: {{ users$ | async }}
 *
 * 2019 vs Modern:
 *   2019: Declared in NgModule's declarations array.
 *   Modern: Standalone — imported directly in component's imports array.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + ellipsis;
  }
}
