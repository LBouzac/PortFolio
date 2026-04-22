import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({ providedIn: 'root' })
export class PocketBaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://192.168.1.113:8080'); // URL DE TEST
  }

  // Récupérer tous les projets
  async getProjets() {
    return await this.pb.collection('articles').getFullList();
  }

  // Récupérer un projet détaillé
  async getProjetDetail(recordId: string) {
    return await this.pb.collection('articles').getOne(recordId, {
      expand: 'relField1,relField2.subRelField',
    });
  }
}
