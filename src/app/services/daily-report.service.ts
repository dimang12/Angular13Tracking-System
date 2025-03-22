import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import {from, Observable} from 'rxjs';
import { DailyReportInterface } from '../interfaces/daily-report.interface';

@Injectable({
  providedIn: 'root'
})
export class DailyReportService {
  private dailyReportCollection = 'dailyReports';
  constructor(
    private firestore: AngularFirestore
  ) {}


  /**
   * Get all daily reports service
   * @returns Observable of DailyReportInterface[]
   */
  public getDailyReports(): Observable<DailyReportInterface[]> {
    return this.firestore.collection(this.dailyReportCollection).valueChanges({ idField: 'id' }) as Observable<DailyReportInterface[]>;
  }


  /**
   * add task service
   * @returns Observable
   * @param dailyReport
   */
  public addDalyReport(dailyReport: DailyReportInterface): Observable<DocumentReference<unknown>> {
    return from(
      this.firestore
        .collection(this.dailyReportCollection)
        .add(dailyReport)
    );
  }

  /**
   * update daily report service
   * @param id string task id
   * @param dailyReport DailReportInterface task object
   * @returns Observable
   */
  public updateDailyReport(id: string, dailyReport: DailyReportInterface): Observable<void> {
    return from(
      this.firestore
        .collection(this.dailyReportCollection)
        .doc(id)
        .update(dailyReport)
    );
  }

  /**
   * Delete daily report service
   * @param id string task id
   * @returns Observable
   */
  public deleteDailyReport(id: string): Observable<void> {
    return from(this.firestore.collection(this.dailyReportCollection).doc(id).delete());
  }

}
