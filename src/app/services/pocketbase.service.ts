import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';

@Injectable({ providedIn: 'root' })
export class PocketBaseService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase('http://192.168.1.113:8080');
  }

  // // Récupérer tous les projets
  // async getProjets() {
  //   return await this.pb.collection('projets').getFullList();
  // }

  // // Récupérer un projet détaillé
  // async getProjetDetail(recordId: string) {
  //   return await this.pb.collection('projets').getOne(recordId, {
  //     expand: 'relField1,relField2.subRelField',
  //   });
  // }
  async getProjets() {
  const projets = await this.pb.collection('projets').getFullList();
  return projets.map(projet => ({
    ...projet,
    image: projet['image'] ? this.getImageUrl('projets', projet.id, projet['image']) : ''
  }));
}

private getImageUrl(collection: string, recordId: string, filename: string): string {
  return `http://192.168.1.113:8080/api/files/${collection}/${recordId}/${filename}`;
}

async getProjetDetail(recordId: string) {
  const projet = await this.pb.collection('projets').getOne(recordId, {
    expand: 'relField1,relField2.subRelField',
  });
  if (projet['image']) {
    projet['image'] = this.getImageUrl('projets', recordId, projet['image']);
  }
  return projet;
  }
}
