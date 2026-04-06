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
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-green-900">Gestion des Chambres</h1>
            <button (click)="openModal()" class="bg-green-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition">Ajouter une chambre</button>
          </div>

          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th class="px-6 py-4">N°</th>
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Étage</th>
                  <th class="px-6 py-4">Prix/Nuit</th>
                  <th class="px-6 py-4">Statut</th>
                  <th class="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let room of rooms" class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-bold">{{ room.room_number }}</td>
                  <td class="px-6 py-4">{{ room.room_type.name }}</td>
                  <td class="px-6 py-4">{{ room.floor }}</td>
                  <td class="px-6 py-4 font-bold text-green-800">{{ room.price_per_night }}€</td>
                  <td class="px-6 py-4">
                    <span [class]="'px-2 py-1 rounded text-[10px] font-bold uppercase ' + getStatusClass(room.status)">
                      {{ room.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 space-x-2 text-xs">
                    <button (click)="editRoom(room)" class="text-blue-600 hover:underline">Modifier</button>
                    <button (click)="deleteRoom(room.id)" class="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <app-footer></app-footer>

      <!-- Modal placeholder (simple alert for brevity in this generation) -->
    </div>
  `
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
