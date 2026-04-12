import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-client-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent implements OnInit {
  resService = inject(ReservationService);
  reservations: Reservation[] = [];

  ngOnInit() {
    this.resService.getReservations().subscribe(data => this.reservations = data);
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
}
