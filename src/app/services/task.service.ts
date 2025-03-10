import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskInterface } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private firestore: AngularFirestore) {}

  public getTasks(): Observable<TaskInterface[]> {
    return this.firestore.collection('tasks').valueChanges({ idField: 'id' }).pipe(
      map((tasks: any[]) => tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toDate()
      })))
    );
  }

  /**
   * add task service
   */
  public addTask(task: TaskInterface): Observable<DocumentReference<unknown>> {
    return from(this.firestore.collection('tasks').add(task));
  }

  /**
   * update task service
   */
  public updateTask(id: string, task: TaskInterface): Observable<void> {
    return from(this.firestore.collection('tasks').doc(id).update(task));
  }

  /**
   * delete task service
   */
  public deleteTask(id: string): Observable<void> {
    return from(this.firestore.collection('tasks').doc(id).delete());
  }
}
