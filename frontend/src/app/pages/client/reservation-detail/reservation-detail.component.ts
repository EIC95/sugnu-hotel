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
