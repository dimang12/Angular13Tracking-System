import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupProjectInterface } from '../interfaces/group.project.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupProjectService {
  private collectionName = 'project-groups';

  constructor(private firestore: AngularFirestore) { }

  getProjectGroups(): Observable<GroupProjectInterface[]> {
    return this.firestore.collection<GroupProjectInterface>(this.collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as GroupProjectInterface;
        const id = a.payload.doc.id;
        return { ...data, id };
      }))
    );
  }

  addProjectGroup(group: GroupProjectInterface): Observable<void> {
    const id = this.firestore.createId();
    return new Observable(observer => {
      this.firestore.collection(this.collectionName).doc(id).set(group).then(() => {
        observer.next();
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  updateProjectGroup(group: GroupProjectInterface): Observable<void> {
    return new Observable(observer => {
      this.firestore.collection(this.collectionName).doc(group.id).update(group).then(() => {
        observer.next();
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }

  deleteProjectGroup(id: string): Observable<void> {
    debugger;
    return new Observable(observer => {
      this.firestore.collection(this.collectionName).doc(id).delete().then(() => {
        observer.next();
        observer.complete();
      }).catch(error => observer.error(error));
    });
  }
}
