import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TaskService } from '../services/task.service';
import { TaskInterface } from '../interfaces/task.interface';
import { MatSort} from "@angular/material/sort";
import { MatPaginator} from "@angular/material/paginator";
import { MatDialog} from "@angular/material/dialog";
import { NewTaskComponent } from './new-task/new-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { ConfirmDialogComponent} from "../components/uis/confirm-dialog/confirm-dialog.component";
import { statusParams } from '../services/params/params.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  public displayedColumns: string[] = [
    'taskNumber','name', 'project', 'status', 'percentageCompletion',
    'startDate', 'endDate', 'numberOfDays', 'loe', 'action'
  ];
  public dataSource = new MatTableDataSource<TaskInterface>();
  public statusParams = statusParams;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private taskService: TaskService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.dataSource.data = tasks;
    });
  }

  onAfterViewInit() {
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
   * Apply status filter
   */
  applyStatusFilter(status: number): void {
    this.dataSource.filterPredicate = (data: TaskInterface, filter: string) => {
      return status ? +data.status === status : true;
    };
    this.dataSource.filter = status ? status.toString() : '';
  }

  /**
   * Open new task dialog
   */
  public openNewDialog(): void {
    const dialogRef = this.dialog.open(NewTaskComponent, {
      width: '60%',
      height: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
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

    dialogRef.afterClosed().subscribe(result => {
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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((t) => t.id !== task.id);
        });
      }
    });
  }
}
