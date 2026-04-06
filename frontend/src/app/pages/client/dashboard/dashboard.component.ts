import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>

      <main class="flex-grow bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-green-900 mb-8">Mon Espace Client</h1>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-800">
              <h3 class="text-gray-500 text-sm font-bold uppercase">Réservations Totales</h3>
              <p class="text-3xl font-bold text-green-900">{{ reservations.length }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 class="text-xl font-bold text-green-900">Mes Réservations Récentes</h2>
              <a routerLink="/client/reservations" class="text-orange-500 font-bold hover:underline">Voir tout</a>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th class="px-6 py-4">#</th>
                    <th class="px-6 py-4">Chambre</th>
                    <th class="px-6 py-4">Arrivée</th>
                    <th class="px-6 py-4">Départ</th>
                    <th class="px-6 py-4">Statut</th>
                    <th class="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let res of reservations.slice(0, 5)" class="hover:bg-gray-50">
                    <td class="px-6 py-4 font-bold">{{ res.reservation_number }}</td>
                    <td class="px-6 py-4">{{ res.room.room_type.name }}</td>
                    <td class="px-6 py-4">{{ res.check_in_date }}</td>
                    <td class="px-6 py-4">{{ res.check_out_date }}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded text-xs font-bold ' + getStatusClass(res.status)">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <a [routerLink]="['/client/reservations', res.id]" class="text-green-800 hover:underline font-bold">Détails</a>
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
export class DashboardComponent implements OnInit {
  resService = inject(ReservationService);
  reservations: Reservation[] = [];

  ngOnInit() {
    this.resService.getReservations().subscribe(data => this.reservations = data);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
