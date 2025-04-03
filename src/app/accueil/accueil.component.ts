import { Component } from '@angular/core';
import {ProjetsComponent} from '../projets/projets.component';
import {CompetencesComponent} from '../competences/competences.component';
import {ContactComponent} from '../contact/contact.component';

@Component({
  selector: 'app-accueil',
  imports: [
    ProjetsComponent,
    CompetencesComponent,
    ContactComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

}
