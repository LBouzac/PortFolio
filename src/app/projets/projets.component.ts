import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { ProjetService } from '../services/projet.service';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projets.component.html',
  styleUrl: './projets.component.css',
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProjetsComponent implements OnInit {
  @Input() isHomePage: boolean = false;

  isProjectsPage: boolean = false;
  projetsFiltres: any[] = [];
  filtresActifs: string[] = [];
  categories: string[] = ['Ecole', 'Personnel', 'Alternance'];
  projets: any[] = [];

  constructor(
    private router: Router,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    register();
    this.isProjectsPage = this.router.url === '/projets';

    // Charger les projets depuis le service
    this.projetService.getProjets().subscribe(data => {
      this.projets = data;
      this.projetsFiltres = this.projets;
    });
  }
  // Nouvelle méthode pour gérer les sélections multiples
  filtrerProjets(categorie: string): void {
    const index = this.filtresActifs.indexOf(categorie);

    if (index === -1) {
      // Ajouter la catégorie si elle n'est pas déjà sélectionnée
      this.filtresActifs.push(categorie);
    } else {
      // Retirer la catégorie si elle est déjà sélectionnée
      this.filtresActifs.splice(index, 1);
    }

    // Filtrer les projets selon les catégories sélectionnées
    if (this.filtresActifs.length > 0) {
      this.projetsFiltres = this.projets.filter(projet =>
        this.filtresActifs.includes(projet.categories)
      );
    } else {
      // Si aucun filtre actif, afficher tous les projets tous les selectionnés
      this.projetsFiltres = this.projets;
    }
  }
  // Méthode utilitaire pour vérifier si une catégorie est sélectionnée
  estCategorieActive(categorie: string): boolean {
    return this.filtresActifs.includes(categorie);
  }
}
