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
  templateUrl: './reservation-detail.component.html'
})
export class ReservationDetailComponent implements OnInit {
  resService = inject(ReservationService);
  route = inject(ActivatedRoute);
  reservation: any = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.resService.getReservation(id).subscribe(data => this.reservation = data);
  }

  get nights(): number {
    if (!this.reservation) return 0;
    const start = new Date(this.reservation.check_in_date);
    const end = new Date(this.reservation.check_out_date);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.round(diff / 86400000));
  }

  get roomTotal(): number {
    if (!this.reservation) return 0;
    return this.reservation.room.price_per_night * this.nights;
  }

  get servicesTotal(): number {
    if (!this.reservation || !this.reservation.services) return 0;
    return this.reservation.services.reduce((sum: number, s: any) => sum + (s.pivot.price * s.pivot.quantity), 0);
  }

  get subtotal(): number {
    return this.roomTotal + this.servicesTotal;
  }

  getMainImageUrl(): string {
    if (!this.reservation || !this.reservation.room || !this.reservation.room.images) return '';
    const images = this.reservation.room.images;
    const mainImg = images.find((img: any) => img.is_main);
    const path = mainImg ? mainImg.image_path : (images[0]?.image_path || '');
    if (!path) return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
    return `http://localhost:8000/storage/${path}`;
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
