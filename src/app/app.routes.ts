import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import {ProjetsComponent} from './projets/projets.component';
import {ContactComponent} from './contact/contact.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }
];
