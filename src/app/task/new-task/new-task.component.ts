import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../interfaces/project.interface';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public projects: ProjectInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<NewTaskComponent>
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],  // Ensure this control is defined
      dueDate: ['', Validators.required],
      status: ['', Validators.required],
      detail: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        ...this.taskForm.value,
        taskNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString()
      };
      this.taskService.addTask(taskData).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
