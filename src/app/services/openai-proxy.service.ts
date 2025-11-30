import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OpenAiProxyService {
  constructor(private fns: AngularFireFunctions, private http: HttpClient, private afAuth: AngularFireAuth) {}

  private isLocalhost(): boolean {
    try {
      return window && window.location && window.location.hostname === 'localhost';
    } catch (e) {
      return false;
    }
  }

  async improveTextHttp(text: string): Promise<string> {
    try {
      // If local server is used, prefer simple POST to local proxy
      //      const user = await firstValueFrom(this.afAuth.user);
      //      if (!user) {
      //        console.warn('User not authenticated for HTTP improveText');
      //        return '';
      //      }
      //      const token = await user.getIdToken();
      //      const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
      //      const url = `https://us-central1-${environment.firebase.projectId}.cloudfunctions.net/improveWithOpenAIHttp`;
      //      const resp = await firstValueFrom(this.http.post<any>(url, { text }, { headers }));
      // Local development: call local Express proxy at port 5000. Ensure you set OPENAI_KEY in backend/localserver/.env
      const url = `http://localhost:5020/improve`;
      const resp = await firstValueFrom(this.http.post<any>(url, { text }));
      return resp && resp.improvedText ? resp.improvedText : '';
    } catch (err) {
      console.error('improveTextHttp error', err);
      return '';
    }
  }

  /**
   * Improve text using the callable Firebase Function `improveWithOpenAI`.
   * Returns an Observable emitting the improved text or an empty string on error.
   */
  improveText(text: string): Observable<string> {
    if (this.isLocalhost()) {
      // prefer HTTP endpoint when running locally to avoid CORS issues with callable
      return new Observable(observer => {
        this.improveTextHttp(text).then(result => {
          observer.next(result);
          observer.complete();
        }).catch(err => {
          observer.error(err);
        });
      });
    }

    // default: use callable function
    try {
      const callable = this.fns.httpsCallable('improveWithOpenAI');
      return callable({ text }).pipe(
        map((result: any) => {
          return (result && (result.improvedText || (result.data && result.data.improvedText))) || '';
        }),
        catchError(err => {
          console.error('improveText callable error', err);
          return of('');
        })
      );
    } catch (err) {
      console.error('improveText setup error', err);
      return of('');
    }
  }
}
