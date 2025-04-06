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
      titre: 'Path of the Loner\n',
      description: 'Projet scolaire de création d\'un jeu RPG textuel, fait avec Python.',
      image: 'assets/img/projet3.png',
      github: 'https://github.com/LBouzac/path-of-the-loner'
    },
    {
      id: 4,
      titre: 'Covid-19',
      description: 'Projet scolaire de création d\'une application web sur la Covid-19, fait avec Angular.',
      image: 'assets/img/projet4.png',
      github: 'https://github.com/LBouzac/Angular-CDAN-Cours'
    },
    {
      id: 5,
      titre: 'PythonBF',
      description: 'Projet personnel de création d\'un brute force fait avec Python.',
      image: 'assets/img/projet5.png',
      github: 'https://github.com/LBouzac/PythonBF'
    },
    {
      id: 6,
      titre: 'PyChess',
      description: 'Projet personnel de création d\'un jeu d\'échec fait avec Python.',
      image: 'assets/img/projet6.png',
      github: 'https://github.com/LBouzac/PyChess'
    },
    {
      id: 7,
      titre: 'Kotlin API',
      description: 'Projet scolaire de création d\'une application et utilisation d\'une API en Kotlin.',
      image: 'assets/img/projet7.png',
      github: 'https://github.com/LBouzac/TP_Kotlin_API'
    },
    {
      id: 8,
      titre: 'Site Variations Horaires',
      description: 'Site de gestion des horaires de travail, durant mon alternance chez l\'ANRAS, fait avec PHP, SQL.',
      image: 'assets/img/projet8.png'
    },
    {
      id: 9,
      titre: 'M2L',
      description: 'Projet de première année de BTS SIO en B1 SLAM Atelier Professionnel, fait avec PHP, SQL.',
      image: 'assets/img/projet9.png',
      github: 'https://github.com/LBouzac/SioSlamGroupe2'
    },
  ];

  ngOnInit() {
    // Enregistrer les éléments personnalisés Swiper
    register();
  }
}
