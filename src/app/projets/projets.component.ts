import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css',
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajout du schéma pour les éléments web personnalisés
})
export class ProjetsComponent implements OnInit {

  projets = [
    {
      id: 1,
      titre: 'Projet 1',
      description: 'Description du projet 1',
      image: 'assets/images/projet1.jpg'
    },
    {
      id: 2,
      titre: 'Projet 2',
      description: 'Description du projet 2',
      image: 'assets/images/projet2.jpg'
    },
    {
      id: 3,
      titre: 'Projet 3',
      description: 'Description du projet 3',
      image: 'assets/images/projet3.jpg'
    },
    {
      id: 4,
      titre: 'Projet 3',
      description: 'Description du projet 3',
      image: 'assets/images/projet3.jpg'
    },
    {
      id: 3,
      titre: 'Projet 3',
      description: 'Description du projet 3',
      image: 'assets/images/projet3.jpg'
    }
  ];

  ngOnInit() {
    // Enregistrer les éléments personnalisés Swiper
    register();
  }
}
