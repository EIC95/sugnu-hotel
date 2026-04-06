import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-3xl font-bold text-green-900 mb-8">Finaliser votre réservation</h1>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-6">
              <div class="bg-white p-8 rounded-xl shadow-lg">
                <h2 class="text-xl font-bold text-green-900 mb-6">Détails du séjour</h2>
                
                <form (ngSubmit)="book()" #bookForm="ngForm" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Date d'arrivée</label>
                      <input type="date" [(ngModel)]="bookingData.check_in_date" name="check_in" required class="w-full border-gray-300 rounded-lg focus:ring-green-800">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Date de départ</label>
                      <input type="date" [(ngModel)]="bookingData.check_out_date" name="check_out" required class="w-full border-gray-300 rounded-lg focus:ring-green-800">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Adultes</label>
                      <input type="number" [(ngModel)]="bookingData.number_of_adults" name="adults" min="1" required class="w-full border-gray-300 rounded-lg focus:ring-green-800">
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Enfants</label>
                      <input type="number" [(ngModel)]="bookingData.number_of_children" name="children" min="0" class="w-full border-gray-300 rounded-lg focus:ring-green-800">
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Demandes spéciales</label>
                    <textarea [(ngModel)]="bookingData.special_requests" name="requests" rows="3" class="w-full border-gray-300 rounded-lg focus:ring-green-800"></textarea>
                  </div>

                  <div *ngIf="error" class="p-4 bg-red-100 text-red-700 rounded-lg">{{ error }}</div>

                  <button type="submit" [disabled]="!bookForm.form.valid || loading" class="w-full bg-green-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-900 shadow-lg transition duration-300 disabled:opacity-50">
                    {{ loading ? 'Traitement...' : 'Confirmer la réservation' }}
                  </button>
                </form>
              </div>
            </div>

            <div class="md:col-span-1">
              <div class="bg-white p-6 rounded-xl shadow-lg sticky top-8" *ngIf="room">
                <h3 class="font-bold text-green-900 mb-4 text-lg">Résumé</h3>
                <div class="h-40 mb-4 rounded-lg overflow-hidden">
                  <img [src]="getMainImageUrl()" class="w-full h-full object-cover">
                </div>
                <div class="space-y-2">
                  <p class="font-bold text-green-900">{{ room.room_type.name }}</p>
                  <p class="text-sm text-gray-500">Chambre #{{ room.room_number }}</p>
                  <p class="text-sm text-gray-500">Étage {{ room.floor }}</p>
                </div>
                <hr class="my-4">
                <div class="flex justify-between font-bold text-xl text-green-900">
                  <span>Total</span>
                  <span>{{ room.price_per_night }}€</span>
                </div>
                <p class="text-xs text-gray-400 mt-2 text-center">Taxe de séjour incluse</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class BookingComponent implements OnInit {
  roomService = inject(RoomService);
  resService = inject(ReservationService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  room: Room | null = null;
  loading = false;
  error = '';

  bookingData = {
    room_id: 0,
    check_in_date: '',
    check_out_date: '',
    number_of_adults: 1,
    number_of_children: 0,
    special_requests: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.params['roomId'];
    this.bookingData.room_id = +id;
    this.roomService.getRoom(+id).subscribe(data => this.room = data);
    
    // Default dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.bookingData.check_in_date = today.toISOString().split('T')[0];
    this.bookingData.check_out_date = tomorrow.toISOString().split('T')[0];
  }

  getMainImageUrl(): string {
    if (!this.room) return '';
    const mainImg = this.room.images.find(img => img.is_main);
    if (mainImg) return `http://localhost:8000/storage/${mainImg.image_path}`;
    return this.room.images.length > 0 ? `http://localhost:8000/storage/${this.room.images[0].image_path}` : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
  }

  book() {
    this.loading = true;
    this.error = '';
    this.resService.createReservation(this.bookingData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/client/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Une erreur est survenue. Vérifiez la disponibilité pour ces dates.';
      }
    });
  }
}
