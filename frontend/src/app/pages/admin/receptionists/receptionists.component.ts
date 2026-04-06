import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-receptionists',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-green-900">Gestion du Staff</h1>
            <button (click)="showForm = !showForm" class="bg-green-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition">
              {{ showForm ? 'Annuler' : 'Ajouter un réceptionniste' }}
            </button>
          </div>

          <div *ngIf="showForm" class="bg-white p-8 rounded-xl shadow-lg mb-8 max-w-2xl">
            <h2 class="text-xl font-bold text-green-900 mb-6">Nouveau Compte Réception</h2>
            <form (ngSubmit)="create()" #staffForm="ngForm" class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
                <input type="text" [(ngModel)]="newData.name" name="name" required class="w-full border-gray-300 rounded-lg">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input type="email" [(ngModel)]="newData.email" name="email" required class="w-full border-gray-300 rounded-lg">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                <input type="text" [(ngModel)]="newData.phone" name="phone" class="w-full border-gray-300 rounded-lg">
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
                <input type="password" [(ngModel)]="newData.password" name="password" required class="w-full border-gray-300 rounded-lg">
              </div>
              <div class="col-span-2">
                <button type="submit" [disabled]="!staffForm.form.valid" class="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">Créer le compte</button>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h2 class="font-bold text-green-900">Équipe actuelle</h2>
            </div>
            <div class="p-12 text-center text-gray-400">
              <p>La liste des réceptionnistes s'affichera ici.</p>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class ReceptionistsComponent {
  private authService = inject(AuthService);
  showForm = false;
  newData = { name: '', email: '', phone: '', password: '' };

  create() {
    this.authService.createReceptionist(this.newData).subscribe({
      next: () => {
        alert('Compte créé avec succès');
        this.showForm = false;
        this.newData = { name: '', email: '', phone: '', password: '' };
      },
      error: () => alert('Erreur lors de la création')
    });
  }
}
