import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';

@Component({
  selector: 'app-admin-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit {
  roomService = inject(RoomService);
  rooms: Room[] = [];

  ngOnInit() {
    this.roomService.getRooms().subscribe(data => this.rooms = data);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'occupied': return 'bg-orange-100 text-orange-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  openModal() {
    alert('Fonctionnalité de création à implémenter avec un formulaire modal complet.');
  }

  editRoom(room: Room) {
    alert('Modification de la chambre ' + room.room_number);
  }

  deleteRoom(id: number) {
    if (confirm('Supprimer cette chambre ?')) {
      this.roomService.deleteRoom(id).subscribe(() => window.location.reload());
    }
  }
}
