import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { RoomType } from '../../../core/models/room-type.model';

@Component({
  selector: 'app-admin-room-types',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './room-types.component.html',
})
export class RoomTypesComponent implements OnInit {
  roomService = inject(RoomService);
  roomTypes: RoomType[] = [];

  ngOnInit() {
    this.roomService.getRoomTypes().subscribe(data => this.roomTypes = data);
  }
}
