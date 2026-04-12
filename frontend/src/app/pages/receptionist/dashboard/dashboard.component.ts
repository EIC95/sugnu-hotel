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
  templateUrl: './dashboard.component.html'
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
