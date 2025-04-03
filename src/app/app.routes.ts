import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import {CompetencesComponent} from './competences/competences.component';
import {ProjetsComponent} from './projets/projets.component';
import {ContactComponent} from './contact/contact.component';
import {VeilleComponent} from './veille/veille.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'competences', component: CompetencesComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'veille', component: VeilleComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' }
];
