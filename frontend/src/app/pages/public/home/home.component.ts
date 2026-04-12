import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomCardComponent } from '../../../shared/room-card/room-card.component';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, RoomCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  router = inject(Router);
  roomService = inject(RoomService);

  searchData = {
    check_in_date: '',
    check_out_date: '',
    number_of_adults: '1'
  };

  featuredRooms: Room[] = [];
  loading = true;

  ngOnInit() {
    this.roomService.getAvailableRooms({}).subscribe({
      next: (rooms) => {
        this.featuredRooms = rooms.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  search() {
    this.router.navigate(['/rooms'], { queryParams: this.searchData });
  }
}
