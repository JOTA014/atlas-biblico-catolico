import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, SourceItem, TimelineItem } from './book';

@Injectable({ providedIn: 'root' })
export class BibleApiService {
  private readonly http = inject(HttpClient);
  private readonly api = '/api';

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.api}/books`);
  }

  getBook(slug: string): Observable<Book> {
    return this.http.get<Book>(`${this.api}/books/${encodeURIComponent(slug)}`);
  }

  getTimeline(): Observable<TimelineItem[]> {
    return this.http.get<TimelineItem[]>(`${this.api}/timeline`);
  }

  getSources(): Observable<SourceItem[]> {
    return this.http.get<SourceItem[]>(`${this.api}/sources`);
  }

  searchBooks(query: string, group: string, testament: string): Observable<Book[]> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    if (group) params = params.set('group', group);
    if (testament) params = params.set('testament', testament);
    return this.http.get<Book[]>(`${this.api}/books`, { params });
  }
}
