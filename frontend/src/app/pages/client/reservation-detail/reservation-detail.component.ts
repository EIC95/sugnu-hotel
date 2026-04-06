import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12" *ngIf="reservation">
        <div class="max-w-4xl mx-auto px-4">
          <div class="mb-8 flex items-center justify-between">
            <a routerLink="/client/reservations" class="text-green-800 font-bold flex items-center hover:underline">
              ← Retour à mes réservations
            </a>
            <div class="flex space-x-2">
              <span [class]="'px-4 py-2 rounded-lg text-sm font-bold shadow-sm ' + getStatusClass(reservation.status)">
                {{ translateStatus(reservation.status) }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div class="bg-green-800 px-8 py-6 text-white flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold">Réservation #{{ reservation.reservation_number }}</h1>
                <p class="text-green-100 opacity-80">Effectuée le {{ reservation.created_at | date:'short' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs uppercase font-bold opacity-70">Prix Total</p>
                <p class="text-3xl font-bold text-orange-400">{{ reservation.total_price }}€</p>
              </div>
            </div>

            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <!-- Stay Info -->
                <div>
                  <h2 class="text-lg font-bold text-green-900 mb-4 border-b pb-2">Détails du séjour</h2>
                  <div class="space-y-4">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Chambre</span>
                      <span class="font-bold text-green-800">{{ reservation.room.room_type.name }} (#{{ reservation.room.room_number }})</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Arrivée</span>
                      <span class="font-bold">{{ reservation.check_in_date }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Départ</span>
                      <span class="font-bold">{{ reservation.check_out_date }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Voyageurs</span>
                      <span class="font-bold">{{ reservation.number_of_adults }} Adultes, {{ reservation.number_of_children }} Enfants</span>
                    </div>
                  </div>
                </div>

                <!-- Room Image & Amenity Quick View -->
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 class="font-bold text-green-900 mb-2">Ma Chambre</h3>
                  <div class="h-40 rounded-lg overflow-hidden mb-4 shadow-sm">
                    <img [src]="'http://localhost:8000/storage/' + reservation.room.images[0]?.image_path" class="w-full h-full object-cover">
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span *ngFor="let am of reservation.room.amenities.slice(0, 3)" class="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-500 uppercase font-bold">
                      {{ am.amenity_name }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-12" *ngIf="reservation.special_requests">
                <h2 class="text-lg font-bold text-green-900 mb-4 border-b pb-2">Demandes spéciales</h2>
                <div class="p-4 bg-orange-50 rounded-lg text-gray-700 italic border-l-4 border-orange-400">
                  "{{ reservation.special_requests }}"
                </div>
              </div>

              <div class="mt-12 flex justify-end space-x-4" *ngIf="reservation.status === 'confirmed' || reservation.status === 'pending'">
                <button (click)="cancel()" class="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 transition">
                  Annuler la réservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class ReservationDetailComponent implements OnInit {
  resService = inject(ReservationService);
  route = inject(ActivatedRoute);
  reservation: any = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.resService.getReservation(id).subscribe(data => this.reservation = data);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  translateStatus(status: string): string {
    const translations: any = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'checked_in': 'En séjour',
      'checked_out': 'Terminée',
      'cancelled': 'Annulée'
    };
    return translations[status] || status;
  }

  cancel() {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      this.resService.cancelReservation(this.reservation.id).subscribe(() => {
        alert('Réservation annulée avec succès.');
        window.location.reload();
      });
    }
  }
}
