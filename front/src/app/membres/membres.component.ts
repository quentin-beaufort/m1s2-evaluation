import { Component } from '@angular/core';
import { MembreService,Membre } from '../service/membre.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-membres',
  imports: [FormsModule,CommonModule],
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.css'
})
export class MembresComponent {
  membres: Membre[] = [];
  newMembre: Membre = { firstName: '', lastName: '', email: '' };
  validationErrors: { [key: string]: string } = {};

  constructor(private membreService: MembreService) {}

  ngOnInit(){
    this.loadMembres();
  }

  // Toggle 
  toggleEditMembre(index: number): void {
    const membre = this.membres[index];

    if (membre.editing) {
      this.updateMembre(membre);
    }

    membre.editing = !membre.editing;
  }

  loadMembres() {
    this.membreService.getAll().subscribe(m =>{
      this.membres = m
    })
  }


  // Update via API
  updateMembre(membre: Membre): void {
    // Validation côté client pour la mise à jour
    const tempErrors: { [key: string]: string } = {};
    let isValid = true;

    if (membre.firstName && !/^[a-zA-ZÀ-ÿ\s]+$/.test(membre.firstName)) {
      tempErrors['firstName'] = 'Le prénom ne doit contenir que des lettres';
      isValid = false;
    }

    if (membre.lastName && !/^[a-zA-ZÀ-ÿ\s]+$/.test(membre.lastName)) {
      tempErrors['lastName'] = 'Le nom ne doit contenir que des lettres';
      isValid = false;
    }

    if (membre.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(membre.email)) {
      tempErrors['email'] = 'Veuillez fournir une adresse email valide';
      isValid = false;
    }

    if (!isValid) {
      console.error('❌ Erreurs de validation', tempErrors);
      membre.editing = true; // Rester en mode édition
      return;
    }

    this.membreService.updateMembre(membre.id!, membre).subscribe({
      next: updated => {
        console.log('✅ Membre mis à jour', updated);
      },
      error: err => {
        console.error('❌ Erreur mise à jour', err);
        membre.editing = true; // Revenir en mode édition en cas d'erreur
      }
    });
  }

  // Autres méthodes possibles
  deleteMembre(id: number): void {
    this.membreService.deleteMembre(id).subscribe(() => {
      this.membres = this.membres.filter(m => m.id !== id);
    });
  }

  addMembre(): void {
    // Validation côté client
    this.validationErrors = {};
    
    if (!this.validateMembre(this.newMembre)) {
      return;
    }

    this.membreService.addMembre(this.newMembre).subscribe({
      next: (membre) => {
        this.membres.push({ ...membre, editing: false });
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'ajout du membre', err);
        if (err.error && err.error.error) {
          this.validationErrors['server'] = err.error.error;
        }
      }
    });
  }

  resetForm(): void {
    this.newMembre = { firstName: '', lastName: '', email: '' };
    this.validationErrors = {};
  }

  validateMembre(membre: Membre): boolean {
    let isValid = true;

    // Validation firstName
    if (!membre.firstName || membre.firstName.trim() === '') {
      this.validationErrors['firstName'] = 'Le prénom est requis';
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(membre.firstName)) {
      this.validationErrors['firstName'] = 'Le prénom ne doit contenir que des lettres';
      isValid = false;
    }

    // Validation lastName
    if (!membre.lastName || membre.lastName.trim() === '') {
      this.validationErrors['lastName'] = 'Le nom est requis';
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(membre.lastName)) {
      this.validationErrors['lastName'] = 'Le nom ne doit contenir que des lettres';
      isValid = false;
    }

    // Validation email
    if (!membre.email || membre.email.trim() === '') {
      this.validationErrors['email'] = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(membre.email)) {
      this.validationErrors['email'] = 'Veuillez fournir une adresse email valide';
      isValid = false;
    }

    return isValid;
  }

  // Validation en temps réel pour les champs
  onFieldChange(field: string): void {
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
      
      // Re-valider le champ spécifique
      if (field === 'firstName' && this.newMembre.firstName) {
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(this.newMembre.firstName)) {
          this.validationErrors['firstName'] = 'Le prénom ne doit contenir que des lettres';
        }
      } else if (field === 'lastName' && this.newMembre.lastName) {
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(this.newMembre.lastName)) {
          this.validationErrors['lastName'] = 'Le nom ne doit contenir que des lettres';
        }
      } else if (field === 'email' && this.newMembre.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newMembre.email)) {
          this.validationErrors['email'] = 'Veuillez fournir une adresse email valide';
        }
      }
    }
  }
}

