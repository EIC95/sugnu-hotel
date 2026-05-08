import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { RoomType } from '../../../core/models/room-type.model';

@Component({
  selector: 'app-admin-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './rooms.component.html'
})
export class RoomsComponent implements OnInit {
  roomService = inject(RoomService);
  rooms: Room[] = [];
  roomTypes: RoomType[] = [];

  showModal = false;
  editMode = false;
  selectedRoomId: number | null = null;
  saving = false;
  error = '';

  
  showAmenities = false;
  amenityRoom: Room | null = null;
  newAmenity = '';
  amenityError = '';

  formData = {
    room_number: '',
    room_type_id: 0,
    floor: 1,
    price_per_night: 0,
    max_occupancy: 2,
    status: 'available'
  };

  statuses = [
    { value: 'available',     label: 'Disponible' },
    { value: 'occupied',      label: 'Occupée' },
    { value: 'maintenance',   label: 'Maintenance' },
    { value: 'out_of_service',label: 'Hors service' },
  ];

  ngOnInit() {
    this.load();
    this.roomService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
      if (data.length > 0) this.formData.room_type_id = data[0].id;
    });
  }

  load() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
      
      if (this.amenityRoom) {
        const updated = data.find(r => r.id === this.amenityRoom!.id);
        if (updated) this.amenityRoom = updated;
      }
    });
  }

  openModal() {
    this.editMode = false;
    this.selectedRoomId = null;
    this.error = '';
    this.formData = {
      room_number: '',
      room_type_id: this.roomTypes[0]?.id ?? 0,
      floor: 1,
      price_per_night: 0,
      max_occupancy: 2,
      status: 'available'
    };
    this.showModal = true;
  }

  editRoom(room: Room) {
    this.editMode = true;
    this.selectedRoomId = room.id;
    this.error = '';
    this.formData = {
      room_number: room.room_number,
      room_type_id: room.room_type_id,
      floor: room.floor,
      price_per_night: room.price_per_night,
      max_occupancy: room.max_occupancy,
      status: room.status
    };
    this.showModal = true;
  }

  save() {
    this.saving = true;
    this.error = '';
    const action = this.editMode && this.selectedRoomId
      ? this.roomService.updateRoom(this.selectedRoomId, this.formData)
      : this.roomService.createRoom(this.formData);

    action.subscribe({
      next: () => { this.showModal = false; this.saving = false; this.load(); },
      error: () => { this.error = 'Une erreur est survenue.'; this.saving = false; }
    });
  }

  deleteRoom(id: number) {
    if (confirm('Supprimer cette chambre définitivement ?')) {
      this.roomService.deleteRoom(id).subscribe(() => this.load());
    }
  }

  openAmenities(room: Room) {
    this.amenityRoom = room;
    this.newAmenity = '';
    this.amenityError = '';
    this.showAmenities = true;
  }

  addAmenity() {
    if (!this.newAmenity.trim() || !this.amenityRoom) return;
    this.amenityError = '';
    const name = this.newAmenity.trim();
    this.roomService.addAmenity(this.amenityRoom.id, name).subscribe({
      next: (created) => {
        this.amenityRoom!.amenities = [...(this.amenityRoom!.amenities ?? []), created];
        this.newAmenity = '';
        this.load();
      },
      error: (err) => {
        this.amenityError = err?.error?.message ?? 'Erreur lors de l\'ajout. Vérifiez que le serveur est relancé.';
      }
    });
  }

  removeAmenity(amenityId: number) {
    if (!this.amenityRoom) return;
    this.roomService.removeAmenity(this.amenityRoom.id, amenityId).subscribe({
      next: () => {
        this.amenityRoom!.amenities = this.amenityRoom!.amenities.filter(a => a.id !== amenityId);
        this.load();
      },
      error: () => { this.amenityError = 'Erreur lors de la suppression.'; }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available':      return 'bg-green-100 text-green-700';
      case 'occupied':       return 'bg-orange-100 text-orange-700';
      case 'maintenance':    return 'bg-red-100 text-red-700';
      case 'out_of_service': return 'bg-gray-100 text-gray-500';
      default:               return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    return this.statuses.find(s => s.value === status)?.label ?? status;
  }
}
