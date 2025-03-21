// src/app/services/project.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectInterface } from "../interfaces/project.interface";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectCollection = 'projects';
  constructor(private firestore: AngularFirestore) {}

  getProjects(): Observable<ProjectInterface[]> {
    return this.firestore.collection(this.projectCollection).valueChanges({ idField: 'id' }).pipe(
      map((projects: any[]) => projects.map(project => ({
        ...project,
        startDate: project.startDate.toDate(),
        endDate: project.endDate.toDate()
      })))
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return from(this.firestore.collection(this.projectCollection).doc(projectId).delete());
  }
}
