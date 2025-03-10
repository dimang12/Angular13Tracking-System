import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { NewProjectComponent } from './new-project/new-project.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ConfirmDialogComponent } from '../components/uis/confirm-dialog/confirm-dialog.component';
import { ProjectService } from "../services/project.service";
import { ProjectInterface } from "../interfaces/project.interface";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements AfterViewInit, OnInit {
  public displayedColumns: string[] = ['imageUrl', 'name', 'status', 'startDate', 'endDate', 'action'];
  public dataSource = new MatTableDataSource<ProjectInterface>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    // initialize data source from project
    this.projectService.getProjects().subscribe((projects) => {
      this.dataSource.data = projects;
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewProjectComponent, {
      width: '80%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Open edit dialog
   * @param project ProjectInterface
   */
  openEditDialog(project: ProjectInterface): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '60%',
      height: '60%',
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
   * Delete project confirmation
   */
  openDeleteDialog(element: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { name: element.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(element.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((project) => project.id !== element.id);
        });
      }
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
