// service for get projets data from PocketBase

import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { PocketBaseService } from './pocketbase.service';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  constructor(private pocketBaseService: PocketBaseService) { }

  getProjets(): Observable<any[]> {
    return from(this.pocketBaseService.getProjets());
  }

  getProjetDetail(recordId: string): Observable<any> {
    return from(this.pocketBaseService.getProjetDetail(recordId));
  }
}
