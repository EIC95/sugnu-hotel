import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomCardComponent } from '../../../shared/room-card/room-card.component';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, RoomCardComponent],
  templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  rooms: Room[] = [];
  loading = true;
  filters = {
    check_in_date: '',
    check_out_date: '',
    number_of_adults: ''
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.filters = { ...this.filters, ...params };
      this.loadRooms();
    });
  }

  loadRooms() {
    this.loading = true;
    this.roomService.getAvailableRooms(this.filters).subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching rooms', err);
        this.loading = false;
      }
    });
  }

  resetFilters() {
    this.filters = {
      check_in_date: '',
      check_out_date: '',
      number_of_adults: ''
    };
    this.router.navigate(['/rooms']);
  }
}
