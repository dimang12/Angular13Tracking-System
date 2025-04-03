import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { GroupProjectService } from '../../services/group-project.service';
import { GroupProjectInterface } from '../../interfaces/group.project.interface';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  groupProjects: GroupProjectInterface[] = [];
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  projectData: any;

  constructor(
    public dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private groupProjectService: GroupProjectService
  ) {
    this.projectData = { ...data };
  }

  ngOnInit(): void {
    this.loadGroupProjects();
    if (this.projectData.imageUrl) {
      this.previewImage = this.projectData.imageUrl;
    }
  }

  loadGroupProjects(): void {
    this.groupProjectService.getProjectGroups().subscribe(groups => {
      this.groupProjects = groups;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Image Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = {
        name: form.value.name,
        status: form.value.status,
        groupProject: form.value.groupProject,
        detail: form.value.detail,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        imageUrl: this.projectData.imageUrl
      };

      if (this.selectedFile) {
        const filePath = `projects/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              formData.imageUrl = url;
              this.updateProject(formData);
            });
          })
        ).subscribe();
      } else {
        this.updateProject(formData);
      }
    }
  }

  updateProject(formData: any) {
    this.firestore.collection('projects').doc(this.projectData.id).update(formData).then(() => {
      console.log('Project updated successfully');
      this.dialogRef.close(formData);
    });
  }
}
