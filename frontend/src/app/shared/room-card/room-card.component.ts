import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room } from '../../core/models/room.model';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div class="relative h-48">
        <img [src]="getMainImageUrl(room)" [alt]="room.room_type.name" class="w-full h-full object-cover">
        <div class="absolute top-0 right-0 m-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
          {{ room.price_per_night }}€ / nuit
        </div>
      </div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-xl font-bold text-green-900">{{ room.room_type.name }}</h3>
          <span class="text-gray-500 text-sm font-medium">Chambre #{{ room.room_number }}</span>
        </div>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ room.room_type.description }}</p>
        <div class="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            {{ room.max_occupancy }} pers.
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            Étage {{ room.floor }}
          </span>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <a [routerLink]="['/rooms', room.id]" class="text-green-800 font-bold hover:underline">Détails</a>
          <a [routerLink]="['/client/booking', room.id]" class="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition duration-300">Réserver</a>
        </div>
      </div>
    </div>
  `
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
