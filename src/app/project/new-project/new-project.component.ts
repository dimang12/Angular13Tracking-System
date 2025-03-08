import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {
  parentProjects = [
    { id: 1, name: 'Parent Project 1' },
    { id: 2, name: 'Parent Project 2' },
    { id: 3, name: 'Parent Project 3' }
  ];
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<NewProjectComponent>,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {}

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
        parentProject: form.value.parentProject,
        detail: form.value.detail,
        startDate: form.value.startDate,
        endDate: form.value.endDate,
        imageUrl: ''
      };

      if (this.selectedFile) {
        const filePath = `projects/${this.selectedFile.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.selectedFile);

        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              formData.imageUrl = url;
              this.firestore.collection('projects').add(formData).then(() => {
                console.log('Project added successfully');
                this.dialogRef.close(formData);
              });
            });
          })
        ).subscribe();
      } else {
        this.firestore.collection('projects').add(formData).then(() => {
          console.log('Project added successfully');
          this.dialogRef.close(formData);
        });
      }
    }
  }
}
