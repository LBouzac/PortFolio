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
      image: 'assets/img/projet1.png'
    },
    {
      id: 2,
      titre: 'Projet 2',
      description: 'Description du projet 2',
      image: 'assets/images/projet2.png'
    },
    {
      id: 3,
      titre: 'Projet 3',
      description: 'Description du projet 3',
      image: 'assets/images/projet3.png'
    },
    {
      id: 4,
      titre: 'Projet 4',
      description: 'Description du projet 4',
      image: 'assets/images/projet4.png'
    },
    {
      id: 5,
      titre: 'Projet 5',
      description: 'Description du projet 5',
      image: 'assets/images/projet5.jpg'
    },
    {
      id: 6,
      titre: 'Projet 6',
      description: 'Description du projet 6',
      image: 'assets/images/projet6.jpg'
    },
    {
      id: 7,
      titre: 'Projet 7',
      description: 'Description du projet 7',
      image: 'assets/images/projet7.jpg'
    }
  ];

  ngOnInit() {
    // Enregistrer les éléments personnalisés Swiper
    register();
  }
}
