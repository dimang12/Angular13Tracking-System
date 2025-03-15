import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentReference} from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private firestore: AngularFirestore) {}

  addComment(taskId: string, comment: string): Observable<DocumentReference<unknown>> {
    const commentData = {
      taskId,
      comment,
      timestamp: new Date()
    };
    return from(this.firestore.collection('comments').add(commentData));
  }

  getComments(taskId: string): Observable<any[]> {
    return this.firestore.collection('comments', ref => ref.where('taskId', '==', taskId).orderBy('timestamp'))
      .valueChanges();
  }
}
