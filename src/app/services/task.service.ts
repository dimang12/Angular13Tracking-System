import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import {from, Observable, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskInterface } from '../interfaces/task.interface';
import { ProjectInterface } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskCollection = 'tasks';
  private projectCollection = 'projects';
  constructor(private firestore: AngularFirestore) {}

  /**
   * Get all tasks service
   * @returns Observable of TaskInterface[]
   */
  public getTasks(): Observable<TaskInterface[]> {
    return this.firestore.collection(this.taskCollection).valueChanges({ idField: 'id' }).pipe(
      map((tasks: any[]) => tasks.map(task => ({
        ...task,
        // dueDate: task.dueDate.toDate(),
        startDate: task?.startDate?.toDate(),
        endDate: task?.endDate?.toDate(),
      })))
    );
  }

  /**
   * Get task by status and limit number
   * @param statuses string[] task status
   * @param limit number limit number
   */
  public getTasksByStatus(statuses: string[], limit: number): Observable<TaskInterface[]> {
    return this.firestore.collection(this.taskCollection, ref => ref.where('status', 'in', statuses).limit(limit)).valueChanges({idField: 'id'}).pipe(
      map((tasks: any[]) => tasks.map(task => ({
        ...task,
        startDate: task?.startDate?.toDate(),
        endDate: task?.endDate?.toDate(),
      }))),
      switchMap((tasks: any[]) =>
        this.firestore.collection('projects').valueChanges({idField: 'id'}).pipe(
          map((projects: any[]) => {
            const projectMap = new Map(projects.map(project => [project.id, project.name]));
            return tasks.map(task => ({
              ...task,
              projectName: projectMap.get(task.project) || 'Unknown'
            }));
          })
        )
      )
    );
  }


  /**
   * add task service
   * @param task TaskInterface task object
   * @returns Observable
   */
  public addTask(task: TaskInterface): Observable<DocumentReference<unknown>> {
    return from(
      this.firestore
        .collection(this.taskCollection)
        .add(task)
    );
  }

  /**
   * update task service
   * @param id string task id
   * @param task TaskInterface task object
   * @returns Observable
   */
  public updateTask(id: string, task: TaskInterface): Observable<void> {
    return from(
      this.firestore
        .collection(this.taskCollection)
        .doc(id)
        .update(task)
    );
  }

  /**
   * delete task service
   * @param id string task id
   * @returns Observable
   */
  public deleteTask(id: string): Observable<void> {
    return from(
      this.firestore
        .collection(this.taskCollection)
        .doc(id)
        .delete()
    );
  }

  /**
   * Update number of task in project by searching project id in task collection
   * @param projectId string project id
   * @returns void
   */
  public updateNumberOfTaskInProject(projectId: string): void {
    this.firestore.collection(this.taskCollection, ref => ref.where('project', '==', projectId)).get().subscribe((tasks) => {
      this.firestore.collection(this.projectCollection).doc(projectId).update({taskCount: tasks.size});
    });
  }

  /**
   * Update completion percentage of project by searching project id in task collection
   * @param projectId string project id
   * @returns void
   */
  public updateCompletionPercentage(projectId: string): void {
    this.firestore.collection(this.taskCollection, ref => ref.where('project', '==', projectId)).get().subscribe((tasks) => {
      const completedTasks = tasks.docs.filter(task => {
        const taskData = task.data() as { status: string };
        return taskData.status.toString() === '3';
      });
      this.firestore.collection(this.projectCollection).doc(projectId).update({completionPercentage: ((completedTasks.length / tasks.size) * 100).toFixed(2)});
    });
  }


}
