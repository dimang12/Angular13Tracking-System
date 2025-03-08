import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker} from "@angular/material/datepicker";
import { MatOption } from '@angular/material/core';

import { NewProjectComponent } from './new-project/new-project.component';

export interface ProjectElement {
  id: number;
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

const PROJECT_DATA: ProjectElement[] = [
  { id: 1, name: 'Project Alpha', status: 'Active', startDate: new Date('2023-01-01'), endDate: new Date('2023-12-31') },
  { id: 2, name: 'Project Beta', status: 'Completed', startDate: new Date('2022-01-01'), endDate: new Date('2022-12-31') },
  { id: 3, name: 'Project Gamma', status: 'On Hold', startDate: new Date('2023-06-01'), endDate: new Date('2024-05-31') },
  { id: 4, name: 'Project Delta', status: 'Active', startDate: new Date('2023-03-01'), endDate: new Date('2023-11-30') },
  { id: 5, name: 'Project Epsilon', status: 'Cancelled', startDate: new Date('2023-02-01'), endDate: new Date('2023-04-30') },
];

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements AfterViewInit, OnInit {
  public displayedColumns: string[] = ['id', 'name', 'status', 'startDate', 'endDate'];
  public dataSource = new MatTableDataSource(PROJECT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
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

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
