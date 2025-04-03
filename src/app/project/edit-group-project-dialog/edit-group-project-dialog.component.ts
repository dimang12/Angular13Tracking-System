import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface EditGroupProjectDialogData {
  groupName: string;
  parentProject: string;
  status: boolean;
  imageUrl: string;
  detail: string;
  numberOfProjects: number;
}

@Component({
  selector: 'app-edit-group-project-dialog',
  templateUrl: './edit-group-project-dialog.component.html',
  styleUrls: ['./edit-group-project-dialog.component.css']
})
export class EditGroupProjectDialogComponent {
  public groupProjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditGroupProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditGroupProjectDialogData
  ) {
    this.groupProjectForm = this.fb.group({
      groupName: [data.groupName, Validators.required],
      parentProject: [data.parentProject, Validators.required],
      status: [data.status, Validators.required],
      imageUrl: [data.imageUrl],
      detail: [data.detail],
      numberOfProjects: [data.numberOfProjects]
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