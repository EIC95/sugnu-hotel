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
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  resService = inject(ReservationService);
  reservations: Reservation[] = [];

  ngOnInit() {
    this.resService.getMyReservations().subscribe(data => this.reservations = data);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'confirmed': return 'bg-stone-100 text-stone-700';
      case 'pending': return 'bg-[#f4efe6] text-[#8a7550]';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-gray-700';
    }
  }
}
