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
  templateUrl: './booking.component.html'
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
