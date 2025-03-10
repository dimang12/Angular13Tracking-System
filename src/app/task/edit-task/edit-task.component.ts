import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../interfaces/project.interface';
import { TaskInterface } from '../../interfaces/task.interface';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public projects: ProjectInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskInterface
  ) {
    this.taskForm = this.fb.group({
      name: [data.name, Validators.required],
      project: [data.project, Validators.required],
      dueDate: [data.dueDate, Validators.required],
      status: [data.status, Validators.required],
      detail: [data.detail, Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.data.id, this.taskForm.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
