// service for get json data

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  constructor(private http: HttpClient) { }

  getProjets(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/projets.json');
  }
}
