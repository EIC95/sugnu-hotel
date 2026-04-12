import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ReservationService } from '../../../core/services/reservation.service';

@Component({
  selector: 'app-receptionist-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './reservations.component.html'
})
export class ReservationsComponent implements OnInit {
  resService = inject(ReservationService);
  reservations: any[] = [];
  searchTerm = '';
  statusFilter = '';

  ngOnInit() {
    this.resService.getReservations().subscribe(data => this.reservations = data);
  }

  filteredReservations() {
    return this.reservations.filter(res => {
      const matchesSearch = res.user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                           res.reservation_number.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === '' || res.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
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
