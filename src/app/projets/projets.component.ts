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
      titre: 'AppRestoWeb',
      description: 'Projet de seconde année de BTS SIO en B2 SLAM Atelier Professionnel, fait avec PHP, SQL.',
      image: 'assets/img/projet1.png',
      github:  'https://github.com/LoutrePasSauvage/B2SLAM-AppRestoWeb'
    },
    {
      id: 2,
      titre: 'AppRestoSwing',
      description: 'Projet de seconde année de BTS SIO en B2 SLAM Atelier Professionnel, fait avec Java, JSON.',
      image: 'assets/img/projet2.png',
      github: 'https://github.com/LoutrePasSauvage/B2SLAM-AppRestoSwing'
    },
    {
      id: 3,
      titre: 'Site Variations Horaires',
      description: 'Site de gestion des horaires de travail, durant mon alternance chez l\'ANRAS, fait avec PHP, SQL.',
      image: 'assets/img/projet3.png'
    },
    {
      id: 4,
      titre: 'M2L',
      description: 'Projet de première année de BTS SIO en B1 SLAM Atelier Professionnel, fait avec PHP, SQL.',
      image: 'assets/img/projet4.png',
      github: 'https://github.com/LBouzac/SioSlamGroupe2'
    }
  ];

  ngOnInit() {
    // Enregistrer les éléments personnalisés Swiper
    register();
  }
}
