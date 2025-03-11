import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../interfaces/project.interface';
import { TaskInterface } from '../../interfaces/task.interface';
import { percentageParams } from '../../services/params/params.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  public taskForm: FormGroup;
  public projects: ProjectInterface[] = [];
  public tasks: TaskInterface[] = [];
  public percentageParams = percentageParams;

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
      detail: [data.detail, Validators.required],
      startDate: [data.startDate],
      endDate: [data.endDate],
      numberOfDays: [{ value: data.numberOfDays, disabled: true }],
      priority: [data.priority],
      parentTask: [data.parentTask],
      loe: [data.loe],
      percentageCompletion: [data.percentageCompletion]
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
      // add number of days to task value
      this.taskForm.get('numberOfDays')?.setValue(this.taskForm.get('numberOfDays')?.value || 0);
      this.taskForm.value.numberOfDays = this.taskForm.get('numberOfDays')?.value;

      this.taskService.updateTask(this.data.id, this.taskForm.value).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
