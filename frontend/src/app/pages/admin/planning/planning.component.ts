import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-admin-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
  private reservationService = inject(ReservationService);

  reservations: Reservation[] = [];
  filtered: Reservation[] = [];
  loading = true;

  filterStatus = '';
  filterDate = '';

  statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    checked_in: 'Arrivée',
    checked_out: 'Départ',
    cancelled: 'Annulée',
  };

  statusClasses: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    checked_in: 'bg-green-100 text-green-700',
    checked_out: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.reservationService.getReservations().subscribe({
      next: data => { this.reservations = data; this.applyFilters(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilters() {
    this.filtered = this.reservations.filter(r => {
      const matchStatus = !this.filterStatus || r.status === this.filterStatus;
      const matchDate = !this.filterDate || r.check_in_date <= this.filterDate && r.check_out_date >= this.filterDate;
      return matchStatus && matchDate;
    });
  }

  getLabel(status: string) {
    return this.statusLabels[status] ?? status;
  }

  getClass(status: string) {
    return this.statusClasses[status] ?? 'bg-gray-100 text-gray-600';
  }

  checkIn(id: number) {
    if (confirm('Confirmer l\'arrivée du client ?')) {
      this.reservationService.checkIn(id).subscribe(() => this.load());
    }
  }

  checkOut(id: number) {
    if (confirm('Confirmer le départ du client ?')) {
      this.reservationService.checkOut(id).subscribe(() => this.load());
    }
  }

  cancel(id: number) {
    if (confirm('Annuler cette réservation ?')) {
      this.reservationService.cancelReservation(id).subscribe(() => this.load());
    }
  }

  confirm(r: Reservation) {
    if (confirm('Confirmer cette réservation ?')) {
      this.reservationService.updateReservation(r.id, { status: 'confirmed' }).subscribe(() => this.load());
    }
  }
}
