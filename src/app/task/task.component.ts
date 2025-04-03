// src/app/task/task.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../services/task.service';
import { TaskInterface } from '../interfaces/task.interface';
import { ProjectInterface } from '../interfaces/project.interface';
import { BreadcrumbInterface } from "../interfaces/breadcrumb.interface";
import { ProjectService } from '../services/project.service';
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { NewTaskComponent } from './new-task/new-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { ConfirmDialogComponent } from "../components/uis/confirm-dialog/confirm-dialog.component";
import { statusParams } from '../services/params/params.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from "rxjs";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'taskNumber',
    'name',
    'status',
    'progress',
    'dates',
    'numberOfDays',
    'loe',
    'action'
  ];
  public dataSource = new MatTableDataSource<TaskInterface>();
  public statusParams = statusParams;
  public projectId: string | null = '';
  public pageSize = 10;
  public projects: ProjectInterface[] = [];
  public selectedProject: string | null = '';
  public currentStatusFilter: number | null = null;
  public selectedTask: TaskInterface | null = null;

  // create breadcrumb items
  public breadcrumbs: BreadcrumbInterface[] = [
    { label: 'Task', link: '/task', active: true }
  ];

  // Edit Cells
  private editingCell: { [key: string]: boolean } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('statusFilter') statusFilter!: ElementRef;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProjects().subscribe(() => {
      this.route.paramMap.subscribe(params => {
        this.projectId = params.get('projectId');
        this.loadTasks();
      });
    });

    this.applyStatusFilter(2);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyProjectFilter(projectId: string): void {
    this.selectedProject = projectId;
    this.currentStatusFilter = null; // Reset status filter
    this.dataSource.filterPredicate = (data: TaskInterface) => {
      return this.selectedProject ? data.project === this.selectedProject : true;
    };
    this.dataSource.filter = this.selectedProject ? this.selectedProject : '';
    if (this.statusFilter && this.statusFilter.nativeElement) {
      this.statusFilter.nativeElement.value = '';
    }
  }

  applyStatusFilter(status: number): void {
    this.currentStatusFilter = status;
    this.dataSource.filterPredicate = (data: TaskInterface) => {
      const matchesStatus = this.currentStatusFilter ? +data.status === this.currentStatusFilter : true;
      const matchesProject = this.selectedProject ? data.project === this.selectedProject : true;
      return matchesStatus && matchesProject;
    };
    this.dataSource.filter = status ? status.toString() : '';
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      if (this.projectId) {
        this.dataSource.data = tasks
          .filter(task => task.project === this.projectId)
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
      } else {
        this.dataSource.data = tasks.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
      }
    });
  }

  private loadProjects(): Observable<ProjectInterface[]> {
    return this.projectService.getProjects().pipe(
      map(projects => {
        this.projects = projects;
        return projects;
      })
    );
  }

  public openNewDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '80%',
      height: '80%',
      data: {
        projectId: this.projectId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  public openEditDialog(task: TaskInterface): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '80%',
      height: '80%',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openDeleteDialog(task: TaskInterface): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete task "${task.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((t) => t.id !== task.id);
          this.taskService.updateNumberOfTaskInProject(task.project)
        });
      }
    });
  }

  editCell(element: TaskInterface, column: string): void {
    this.editingCell[element.id + column] = true;
  }

  isEditing(element: TaskInterface, column: string): boolean {
    return this.editingCell[element.id + column];
  }

  saveEdit(element: TaskInterface, column: string): void {
    this.editingCell[element.id + column] = false;
    this.taskService.updateTask(element.id, element).subscribe();
  }

  /**
   * Get project name by project id
   * @param projectId string project id
   */
  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id.toString() === projectId);
    return project ? project.name : '';
  }

  /**
   * Get project image
   * @param projectId string project id
   */
  getProjectImage(projectId: string): string {
    const project = this.projects.find(p => p.id.toString() === projectId);
    return (project && project?.imageUrl !== '') ? project.imageUrl : 'assets/images/default-image-icon.png';
  }

  /**
   * Get progress bar color based on completion percentage
   * @param percentage number completion percentage
   * @returns string color name for the progress bar
   */
  getProgressColor(percentage: number): string {
    if (percentage >= 100) {
      return 'accent'; // Green for completed tasks
    } else if (percentage >= 50) {
      return 'primary'; // Blue for tasks in progress
    } else {
      return 'warn'; // Red for tasks that need attention
    }
  }

  /**
   * Select task to show detail
   * @param task TaskInterface task object
   */
  selectTask(task: TaskInterface): void {
    this.selectedTask = task;
  }
}
