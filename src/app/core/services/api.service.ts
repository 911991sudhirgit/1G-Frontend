import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get api(): string {
    return this.config.apiUrl;
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    let options: { params?: HttpParams } = {};
    if (params && Object.keys(params).length) {
      let httpParams = new HttpParams();
      Object.entries(params).forEach(([k, v]) => {
        httpParams = httpParams.set(k, String(v));
      });
      options.params = httpParams;
    }
    return this.http.get<T>(`${this.api}${path}`, options);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.api}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.api}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.api}${path}`);
  }

  /** Upload a file (e.g. image). Returns { url, thumbnailUrl } from backend. */
  uploadFile(path: string, file: File): Observable<{ url: string; thumbnailUrl: string }> {
    const formData = new FormData();
    formData.set('file', file);
    return this.http.post<{ url: string; thumbnailUrl: string }>(`${this.api}${path}`, formData);
  }
}
