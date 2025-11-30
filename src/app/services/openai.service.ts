import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface OpenAIResponse {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class OpenAIService {
  private base = 'https://api.openai.com/v1';
  private apiKey = environment.openaiApiKey;

  constructor(private http: HttpClient) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
  }

  // Simple completion call using the Chat Completions endpoint
  improveText(prompt: string): Observable<string> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured in environment.openaiApiKey');
      return of('');
    }

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Improve and refine the user-selected text. Keep meaning and intent; make it more concise and professional.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.6
    };

    return this.http.post<any>(`${this.base}/chat/completions`, body, { headers: this.headers }).pipe(
      map(res => {
        // Map to the assistant text
        if (res && res.choices && res.choices.length > 0) {
          return res.choices[0].message.content as string;
        }
        return '';
      }),
      catchError(err => {
        console.error('OpenAI improveText error', err);
        return of('');
      })
    );
  }
}

