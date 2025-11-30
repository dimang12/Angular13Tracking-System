import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-openai-toast',
  template: `
    <div class="openai-toast">
      <div class="content">{{data.result}}</div>
      <div class="actions">
        <button mat-button color="primary" (click)="accept()">Accept</button>
        <button mat-button (click)="reject()">Reject</button>
      </div>
    </div>
  `,
  styles: [`
    .openai-toast { display:flex; gap:12px; align-items:center; }
    .content { flex:1; max-width: 420px; white-space: pre-wrap; }
    .actions { display:flex; gap:8px; }
  `]
})
export class OpenaiToastComponent {
  constructor(
    public snackRef: MatSnackBarRef<OpenaiToastComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  accept() {
    this.snackRef.dismissWithAction();
  }

  reject() {
    this.snackRef.dismiss();
  }
}

