import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../services/task.service';
import { TaskInterface } from '../interfaces/task.interface';
import { ProjectInterface } from '../interfaces/project.interface';
import { BreadcrumbInterface } from "../interfaces/breadcrumb.interface";
import { ProjectService } from '../services/project.service';
import { MatSort} from "@angular/material/sort";
import { MatPaginator} from "@angular/material/paginator";
import { MatDialog} from "@angular/material/dialog";
import { NewTaskComponent } from './new-task/new-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { ConfirmDialogComponent} from "../components/uis/confirm-dialog/confirm-dialog.component";
import { statusParams } from '../services/params/params.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map} from "rxjs";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'taskNumber', 'project', 'name', 'status', 'percentageCompletion',
    'numberOfDays', 'loe', 'startDate', 'endDate', 'action'
  ];
  public dataSource = new MatTableDataSource<TaskInterface>();
  public statusParams = statusParams;
  public projectId: string | null = '';
  public pageSize = 10;
  public projects: ProjectInterface[] = [];
  public selectedProject: string | null = '';

  // create breadcrumb items
  public breadcrumbs: BreadcrumbInterface[] = [
    { label: 'Task', link: '/task', active: true }
  ];

  // Edit Cells
  private editingCell: { [key: string]: boolean } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


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

  /**
   * After view init
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Apply search filter
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**
   * Apply project filter
   * @param projectId string
   */
  applyProjectFilter(projectId: string): void {
    this.selectedProject = projectId;
    this.dataSource.filter = this.selectedProject? this.selectedProject : '';
  }

  /**
   * Apply status filter
   */
  applyStatusFilter(status: number): void {
    this.dataSource.filterPredicate = (data: TaskInterface) => {
      return status ? +data.status === status : true;
    };
    this.dataSource.filter = status ? status.toString() : '';
  }

  /**
   * Load tasks and order small end date to the top
   */
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

  /**
   * Load projects
   */
  private loadProjects(): Observable<ProjectInterface[]> {
    return this.projectService.getProjects().pipe(
      map((projects) => {
        this.projects = projects;
        return projects;
      })
    );
  }

  /**
   * Open new task dialog
   */
  public openNewDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '80%',
      height: '80%',
      data: {
        projectId: this.projectId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Open edit dialog
   * @param task TaskInterface
   */
  public openEditDialog(task: TaskInterface): void {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '80%',
      height: '80%',
      data: task
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Open delete dialog
   * @param task TaskInterface
   */
  openDeleteDialog(task: TaskInterface): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete task "${task.name}"?`
      }
    });

    /**
     * After dialog closed
     */
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((t) => t.id !== task.id);
          this.taskService.updateNumberOfTaskInProject(task.project)
        });
      }
    });
  }

  /**
   * Edit cell
   * @param element TaskInterface
   * @param column string
   */
  editCell(element: TaskInterface, column: string): void {
    this.editingCell[element.id + column] = true;
  }

  /**
   * Is the cell being edited
   * @param element TaskInterface
   * @param column string
   * @returns boolean
   */
  isEditing(element: TaskInterface, column: string): boolean {
    return this.editingCell[element.id + column];
  }

  /**
   * Save edit cell
   * @param element TaskInterface
   * @param column string
   */
  saveEdit(element: TaskInterface, column: string): void {
    this.editingCell[element.id + column] = false;
    this.taskService.updateTask(element.id, element).subscribe();
  }


  /**
   * Get project name
   * @param projectId string
   * @returns string
   */
  getProjectName(projectId: string): string {
    const project = this.projects.find(p => p.id.toString() === projectId);
    return project ? project.name : '';
  }
}
