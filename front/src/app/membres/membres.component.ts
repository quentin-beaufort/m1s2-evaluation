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

  constructor(private membreService: MembreService) {}

  ngOnInit(){
    this.loadMembres();
  }

  // Toggle Edit
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
    this.membreService.addMembre(this.newMembre).subscribe(membre => {
      this.membres.push({ ...membre, editing: false });
      this.newMembre = { firstName: '', lastName: '', email: '' };
    });
  }
}

