import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { ServiceService } from '../../../core/services/service.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { PromotionService } from '../../../core/services/promotion.service';
import { Room } from '../../../core/models/room.model';
import { Service } from '../../../core/models/service.model';
import { Promotion } from '../../../core/models/promotion.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
  roomService = inject(RoomService);
  serviceService = inject(ServiceService);
  resService = inject(ReservationService);
  promoService = inject(PromotionService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  room: Room | null = null;
  availableServices: Service[] = [];
  selectedServices: { [id: number]: boolean } = {};
  loading = false;
  error = '';

  
  promoCode = '';
  appliedPromotion: Promotion | null = null;
  promoError = '';
  checkingPromo = false;

  bookingData = {
    room_id: 0,
    check_in_date: '',
    check_out_date: '',
    number_of_adults: 1,
    number_of_children: 0,
    special_requests: '',
    promo_code: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.params['roomId'];
    this.bookingData.room_id = +id;
    this.roomService.getRoom(+id).subscribe(data => this.room = data);
    this.serviceService.getActiveServices().subscribe(data => this.availableServices = data);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    this.bookingData.check_in_date = tomorrow.toISOString().split('T')[0];
    this.bookingData.check_out_date = dayAfter.toISOString().split('T')[0];
  }

  get nights(): number {
    if (!this.bookingData.check_in_date || !this.bookingData.check_out_date) return 0;
    const diff = new Date(this.bookingData.check_out_date).getTime() - new Date(this.bookingData.check_in_date).getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  get servicesTotal(): number {
    return this.availableServices
      .filter(s => this.selectedServices[s.id])
      .reduce((sum, s) => sum + s.price, 0);
  }

  get subtotal(): number {
    return (this.room?.price_per_night ?? 0) * this.nights + this.servicesTotal;
  }

  get discountAmount(): number {
    if (!this.appliedPromotion) return 0;
    const sub = this.subtotal;
    if (this.appliedPromotion.is_percentage) {
      return (sub * this.appliedPromotion.discount) / 100;
    }
    return this.appliedPromotion.discount;
  }

  get total(): number {
    return Math.max(0, this.subtotal - this.discountAmount);
  }

  applyPromo() {
    if (!this.promoCode) return;
    this.checkingPromo = true;
    this.promoError = '';
    this.appliedPromotion = null;

    this.promoService.checkCode(this.promoCode).subscribe({
      next: (promo) => {
        this.appliedPromotion = promo;
        this.bookingData.promo_code = promo.code;
        this.checkingPromo = false;
      },
      error: (err) => {
        this.promoError = 'Code invalide ou expirAc.';
        this.checkingPromo = false;
        this.bookingData.promo_code = '';
      }
    });
  }

  removePromo() {
    this.appliedPromotion = null;
    this.promoCode = '';
    this.bookingData.promo_code = '';
  }

  getMainImageUrl(): string {
    if (!this.room) return '';
    const mainImg = this.room.images?.find(img => img.is_main);
    if (mainImg) return `http://localhost:8000/storage/${mainImg.image_path}`;
    return this.room.images?.length > 0
      ? `http://localhost:8000/storage/${this.room.images[0].image_path}`
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
  }

  book() {
    this.loading = true;
    this.error = '';

    const services = this.availableServices
      .filter(s => this.selectedServices[s.id])
      .map(s => ({ id: s.id, quantity: 1, price: s.price }));

    const payload: any = { ...this.bookingData };
    if (services.length) payload.services = services;

    this.resService.createReservation(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/client/reservations']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 422) {
          const messages = err.error?.errors;
          if (messages?.check_in_date) {
            this.error = 'La date d\'arrivée doit être aujourd\'hui ou dans le futur.';
          } else if (messages?.check_out_date) {
            this.error = 'La date de départ doit être après la date d\'arrivée.';
          } else {
            this.error = 'Données invalides. Vérifiez les dates saisies.';
          }
        } else if (err.status === 409) {
          this.error = 'Cette chambre est déjà réservée pour ces dates.';
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}
