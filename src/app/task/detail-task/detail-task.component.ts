import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { FormGroup, FormControl } from '@angular/forms';
  import { TaskService } from '../../services/task.service';
  import { ProjectService } from '../../services/project.service';
  import { TaskInterface } from '../../interfaces/task.interface';
  import { ProjectInterface } from '../../interfaces/project.interface';
  import { BreadcrumbInterface } from '../../interfaces/breadcrumb.interface';
  import { MatDialog } from '@angular/material/dialog';
  import { EditTaskComponent } from '../edit-task/edit-task.component';
  import { statusParams } from '../../services/params/params.service';


  @Component({
    selector: 'app-detail-task',
    templateUrl: './detail-task.component.html',
    styleUrls: ['./detail-task.component.css']
  })
  export class DetailTaskComponent implements OnInit {
    public taskForm: FormGroup = new FormGroup({
      name: new FormControl(''),
      project: new FormControl(''),
      status: new FormControl(''),
      priority: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      numberOfDays: new FormControl(''),
      loe: new FormControl(''),
      percentageCompletion: new FormControl(''),
      detail: new FormControl('')

    });
    public projects: ProjectInterface[] = [];
    public statusParams = statusParams;
    public priorityParams = [
      { value: 'Low', label: 'Low' },
      { value: 'Medium', label: 'Medium' },
      { value: 'High', label: 'High' },
      { value: 'Critical', label: 'Critical' }
    ];
    public breadcrumbs: BreadcrumbInterface[] = [
      { label: 'Task', link: '/task', active: false },
      { label: 'Task Detail', link: '', active: true }
    ];

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private taskService: TaskService,
      private projectService: ProjectService,
      private dialog: MatDialog
    ) {}

    ngOnInit(): void {
      // Get the list of projects
      this.projectService.getProjects().subscribe((projects) => {
        this.projects = projects;
      });

      const taskId: string | null = this.route.snapshot.paramMap.get('taskId');
      if (taskId) {
        this.taskService.getTaskById(taskId).subscribe((task: TaskInterface) => {
          // set values to taskForm properties
          this.taskForm.patchValue({
            name: task.name,
            project: task.project,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            endDate: task.endDate,
            numberOfDays: task.numberOfDays,
            loe: task.loe,
            percentageCompletion: task.percentageCompletion,
            detail: task.detail
          });
        });
      }
    }
    public getTaskForm(): FormGroup {
      return this.taskForm;
    }

    /**
     * Calculate the number of days between start date and end date
     */
    public calculateDays(): void {
      const startDate = this.taskForm.get('startDate')?.value;
      const endDate = this.taskForm.get('endDate')?.value;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.taskForm.get('numberOfDays')?.setValue(diffDays+1);
      }
    }

    /**
     * Update a task directly without opening a dialog
     */
    public onUpdate(): void {
      const taskId: string | null = this.route.snapshot.paramMap.get('taskId');
      if (taskId) {
        // Get current form values
        const taskData: TaskInterface = {
          ...this.taskForm.value,
          id: taskId
        };

        // Update a task directly using TaskService
        this.taskService.updateTask(taskId, taskData).subscribe(() => {
          // Update the number of tasks in a project
          this.taskService.updateNumberOfTaskInProject(taskData.project);
          // Update percentage completion in project
          this.taskService.updateCompletionPercentage(taskData.project);

          // Reload the task data to ensure we have the latest values
          this.taskService.getTaskById(taskId).subscribe((updatedTask: TaskInterface) => {
            this.taskForm.patchValue({
              name: updatedTask.name,
              project: updatedTask.project,
              status: updatedTask.status,
              priority: updatedTask.priority,
              startDate: updatedTask.startDate,
              endDate: updatedTask.endDate,
              numberOfDays: updatedTask.numberOfDays,
              loe: updatedTask.loe,
              percentageCompletion: updatedTask.percentageCompletion,
              detail: updatedTask.detail
            });
          });
        });
      }
    }
    /**
     * Redirect to edit task page
     */
    public onCancel(): void {
      const taskId: string | null = this.route.snapshot.paramMap.get('taskId');
      if (taskId) {
        this.router.navigate(['/task']);
      }
    }
  }
