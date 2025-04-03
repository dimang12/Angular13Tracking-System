import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-group-project-dialog',
  templateUrl: './add-group-project-dialog.component.html',
  styleUrls: ['./add-group-project-dialog.component.css']
})
export class AddGroupProjectDialogComponent {
  public groupProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddGroupProjectDialogComponent>
  ) {
    this.groupProjectForm = this.fb.group({
      groupName: ['', Validators.required],
      parentProject: ['', Validators.required],
      status: [true, Validators.required],
      imageUrl: [''],
      detail: [''],
      numberOfProjects: [0]
    });
  }

  onSubmit(): void {
    if (this.groupProjectForm.valid) {
      this.dialogRef.close(this.groupProjectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
