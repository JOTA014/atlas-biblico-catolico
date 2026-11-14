import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Atlas } from './book';

@Injectable({ providedIn: 'root' })
export class BibleApiService {
  private readonly http = inject(HttpClient);

  getAtlas(): Observable<Atlas> {
    return this.http.get<Atlas>('/api/atlas');
  }
}

