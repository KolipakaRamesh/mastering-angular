/**
 * FILE: confirm-dialog.component.ts
 * PURPOSE: Reusable confirmation dialog using Angular Material Dialog.
 *
 * ANGULAR CONCEPTS:
 * - MAT_DIALOG_DATA injection token (injecting data into dialog)
 * - MatDialogRef (controlling the dialog from inside)
 *
 * HOW IT WORKS:
 * 1. Parent opens: this.dialog.open(ConfirmDialogComponent, { data: {...} })
 * 2. Dialog receives data via MAT_DIALOG_DATA token
 * 3. User clicks Confirm or Cancel
 * 4. Dialog closes and returns a boolean
 * 5. Parent: dialogRef.afterClosed().subscribe(result => { if (result) delete(); })
 */
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon [class.danger-icon]="data.isDestructive">
        {{ data.isDestructive ? 'warning' : 'help_outline' }}
      </mat-icon>
      {{ data.title }}
    </h2>

    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button
        mat-raised-button
        [color]="data.isDestructive ? 'warn' : 'primary'"
        [mat-dialog-close]="true">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .danger-icon { color: #f44336; margin-right: 8px; vertical-align: middle; }
    h2 { display: flex; align-items: center; }
    mat-dialog-content p { font-size: 15px; color: #555; }
  `]
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
}
