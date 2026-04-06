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
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-green-900">Types de Chambres</h1>
            <button class="bg-green-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition">Nouveau Type</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let type of roomTypes" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
              <div class="h-48 relative">
                <img [src]="type.image ? 'http://localhost:8000/storage/' + type.image : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover">
                <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 class="font-bold text-xl">{{ type.name }}</h3>
                </div>
              </div>
              <div class="p-6 flex-grow">
                <p class="text-gray-500 text-sm mb-4 line-clamp-3">{{ type.description }}</p>
                <div class="flex justify-between items-center mt-auto">
                  <span class="text-green-800 font-bold text-lg">{{ type.base_price }}€ / nuit</span>
                  <div class="flex space-x-2">
                    <button class="text-blue-600 font-bold text-sm">Éditer</button>
                    <button class="text-red-600 font-bold text-sm">Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class RoomTypesComponent implements OnInit {
  roomService = inject(RoomService);
  roomTypes: RoomType[] = [];

  ngOnInit() {
    this.roomService.getRoomTypes().subscribe(data => this.roomTypes = data);
  }
}
