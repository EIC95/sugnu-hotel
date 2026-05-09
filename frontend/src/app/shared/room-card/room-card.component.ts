import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../core/models/room.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-card.component.html'
})
export class RoomCardComponent {
  @Input({ required: true }) room!: Room;

  private storageBase = environment.apiUrl.replace(/\/api$/, '') + '/storage';

  getMainImageUrl(room: Room): string {
    const img = room.images?.find(i => i.is_main) ?? room.images?.[0];
    return img
      ? `${this.storageBase}/${img.image_path}`
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
  }
}
