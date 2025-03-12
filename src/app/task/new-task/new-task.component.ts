import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../interfaces/project.interface';
import { TaskInterface } from '../../interfaces/task.interface';
import { percentageParams } from '../../services/params/params.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public projects: ProjectInterface[] = [];
  public tasks: TaskInterface[] = [];
  public percentageParams = percentageParams;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<NewTaskComponent>
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      project: ['', Validators.required],
      dueDate: [''],
      status: ['', Validators.required],
      detail: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      numberOfDays: [{ value: '', disabled: true }],
      priority: [''],
      parentTask: [''],
      loe: [''],
      percentageCompletion: [''],
      taskNumber: ['']
    });
  }

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });

    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  calculateDays(): void {
    const startDate = this.taskForm.get('startDate')?.value;
    const endDate = this.taskForm.get('endDate')?.value;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.taskForm.get('numberOfDays')?.setValue(diffDays);
    }
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
