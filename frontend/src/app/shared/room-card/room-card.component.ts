import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-card.component.html'
})
export class RoomCardComponent {
  @Input({ required: true }) room!: Room;

  getMainImageUrl(room: Room): string {
    const mainImg = room.images.find(img => img.is_main);
    if (mainImg) {
      return `http://localhost:8000/storage/${mainImg.image_path}`;
    }
    return room.images.length > 0 ? `http://localhost:8000/storage/${room.images[0].image_path}` : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
  }
}
