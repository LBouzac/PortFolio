import { Component } from '@angular/core';
import {ProjetsComponent} from '../projets/projets.component';
import {ContactComponent} from '../contact/contact.component';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-accueil',
  imports: [
    ProjetsComponent,
    ContactComponent,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

}
