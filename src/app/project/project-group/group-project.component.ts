import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupProjectService } from '../../services/group-project.service';
import { GroupProjectInterface } from '../../interfaces/group.project.interface';
import { ConfirmDialogComponent } from '../../components/uis/confirm-dialog/confirm-dialog.component'
import { AddGroupProjectDialogComponent } from "../add-group-project-dialog/add-group-project-dialog.component";
import { EditGroupProjectDialogComponent } from "../edit-group-project-dialog/edit-group-project-dialog.component";

@Component({
  selector: 'app-group-project',
  templateUrl: './group-project.component.html',
  styleUrls: ['./group-project.component.css']
})
export class GroupProjectComponent implements OnInit {
  public groupsProject: GroupProjectInterface[] = [];
  public displayedColumns: string[] = ['groupName', 'detail', 'numberOfProjects', 'status', 'action'];

  constructor(private groupProjectService: GroupProjectService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadProjectGroups();
  }

  loadProjectGroups(): void {
    this.groupProjectService.getProjectGroups().subscribe(groups => {
      console.log(groups);
      this.groupsProject = groups;
    });
  }

  addGroupProject(): void {
    const dialogRef = this.dialog.open(AddGroupProjectDialogComponent, {
      width: '60%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupProjectService.addProjectGroup(result).subscribe(() => {
          this.loadProjectGroups();
        });
      }
    });
  }

  editGroupProject(group: GroupProjectInterface): void {
    const dialogRef = this.dialog.open(EditGroupProjectDialogComponent, {
      width: '60%',
      height: '80%',
      data: {
        groupName: group.groupName,
        parentProject: group.parentProject,
        status: group.status,
        imageUrl: group.imageUrl,
        detail: group.detail,
        numberOfProjects: group.numberOfProjects
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedGroup: GroupProjectInterface = {
          ...result,
          id: group.id
        };
        this.groupProjectService.updateProjectGroup(updatedGroup).subscribe(() => {
          this.loadProjectGroups();
        });
      }
    });
  }

  deleteProjectGroup(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this project group?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupProjectService.deleteProjectGroup(id).subscribe(() => {
          this.loadProjectGroups();
        });
      }
    });
  }
}
