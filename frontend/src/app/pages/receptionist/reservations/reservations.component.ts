import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-receptionist-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-green-900 mb-8">Toutes les Réservations</h1>

          <!-- Search / Filter -->
          <div class="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4">
            <input type="text" [(ngModel)]="searchTerm" placeholder="Chercher un client ou #..." class="border-gray-300 rounded-lg flex-grow">
            <select [(ngModel)]="statusFilter" class="border-gray-300 rounded-lg">
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="checked_in">En séjour</option>
              <option value="checked_out">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4">Numéro</th>
                    <th class="px-6 py-4">Client</th>
                    <th class="px-6 py-4">Chambre</th>
                    <th class="px-6 py-4">Dates</th>
                    <th class="px-6 py-4">Statut</th>
                    <th class="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let res of filteredReservations()" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-bold text-green-900">{{ res.reservation_number }}</td>
                    <td class="px-6 py-4">
                      <div class="font-medium text-gray-900">{{ res.user.name }}</div>
                      <div class="text-xs text-gray-500">{{ res.user.email }}</div>
                    </td>
                    <td class="px-6 py-4">#{{ res.room.room_number }} ({{ res.room.room_type.name }})</td>
                    <td class="px-6 py-4 text-sm">
                      Du {{ res.check_in_date }}<br>Au {{ res.check_out_date }}
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="'px-3 py-1 rounded-full text-[10px] font-bold uppercase ' + getStatusClass(res.status)">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 space-x-2">
                      <button *ngIf="res.status === 'confirmed'" (click)="checkIn(res.id)" class="text-green-700 bg-green-50 px-2 py-1 rounded font-bold text-xs hover:bg-green-100 transition">Check-In</button>
                      <button *ngIf="res.status === 'checked_in'" (click)="checkOut(res.id)" class="text-orange-700 bg-orange-50 px-2 py-1 rounded font-bold text-xs hover:bg-orange-100 transition">Check-Out</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class ReservationsComponent implements OnInit {
  resService = inject(ReservationService);
  reservations: any[] = [];
  searchTerm = '';
  statusFilter = '';

  ngOnInit() {
    this.resService.getReservations().subscribe(data => this.reservations = data);
  }

  filteredReservations() {
    return this.reservations.filter(res => {
      const matchesSearch = res.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                           res.reservation_number.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === '' || res.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'checked_in': return 'bg-blue-100 text-blue-700';
      case 'checked_out': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  checkIn(id: number) {
    if (confirm('Confirmer le Check-In ?')) {
      this.resService.checkIn(id).subscribe(() => window.location.reload());
    }
  }

  checkOut(id: number) {
    if (confirm('Confirmer le Check-Out ?')) {
      this.resService.checkOut(id).subscribe(() => window.location.reload());
    }
  }
}
