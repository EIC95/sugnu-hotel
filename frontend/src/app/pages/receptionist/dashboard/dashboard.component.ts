import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-green-900 mb-8">Tableau de Bord Réception</h1>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div class="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-800">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Arrivées (Aujourd'hui)</p>
              <p class="text-3xl font-bold text-green-900">{{ stats?.arrivals_today || 0 }}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-500">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Départs (Aujourd'hui)</p>
              <p class="text-3xl font-bold text-green-900">{{ stats?.departures_today || 0 }}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">Chambres Occupées</p>
              <p class="text-3xl font-bold text-green-900">{{ stats?.occupied_rooms || 0 }} / {{ stats?.total_rooms || 0 }}</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-md border-b-4 border-purple-500">
              <p class="text-xs font-bold text-gray-500 uppercase mb-1">En attente</p>
              <p class="text-3xl font-bold text-green-900">{{ stats?.pending_reservations || 0 }}</p>
            </div>
          </div>

          <!-- Quick Actions / Arrivals -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 class="text-xl font-bold text-green-900">Arrivées et Départs récents</h2>
              <a routerLink="/receptionist/reservations" class="text-green-800 font-bold hover:underline">Voir toutes les réservations</a>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th class="px-6 py-4">Client</th>
                    <th class="px-6 py-4">Chambre</th>
                    <th class="px-6 py-4">Type</th>
                    <th class="px-6 py-4">Statut</th>
                    <th class="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr *ngFor="let res of recentReservations" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="font-bold text-gray-900">{{ res.user.name }}</div>
                      <div class="text-xs text-gray-500">{{ res.user.email }}</div>
                    </td>
                    <td class="px-6 py-4 font-bold text-green-800">#{{ res.room.room_number }}</td>
                    <td class="px-6 py-4 text-sm">{{ res.status === 'confirmed' ? 'Arrivée' : 'Départ' }}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded text-[10px] font-bold uppercase ' + getStatusClass(res.status)">
                        {{ res.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button *ngIf="res.status === 'confirmed'" (click)="checkIn(res.id)" class="bg-green-800 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-900 transition">Check-In</button>
                      <button *ngIf="res.status === 'checked_in'" (click)="checkOut(res.id)" class="bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-orange-600 transition">Check-Out</button>
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
  dashService = inject(DashboardService);
  resService = inject(ReservationService);
  
  stats: any = null;
  recentReservations: any[] = [];

  ngOnInit() {
    this.dashService.getStats().subscribe(data => this.stats = data);
    this.resService.getReservations().subscribe(data => {
      // Filter for confirmed (arrivals) or checked_in (departures) for quick view
      this.recentReservations = data.filter(r => r.status === 'confirmed' || r.status === 'checked_in').slice(0, 10);
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'checked_in': return 'bg-blue-100 text-blue-700';
      case 'checked_out': return 'bg-purple-100 text-purple-700';
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
