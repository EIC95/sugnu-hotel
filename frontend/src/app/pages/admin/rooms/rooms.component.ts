import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { RoomImage } from '../../../core/models/room-image.model';
import { RoomType } from '../../../core/models/room-type.model';
import { environment } from '../../../../environments/environment';

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

  showImages = false;
  imageRoom: Room | null = null;
  pendingFiles: File[] = [];
  imageUploading = false;
  imageError = '';

  private storageBase = environment.apiUrl.replace(/\/api$/, '') + '/storage';

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
      if (this.imageRoom) {
        const updated = data.find(r => r.id === this.imageRoom!.id);
        if (updated) this.imageRoom = updated;
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

  openImages(room: Room) {
    this.imageRoom = room;
    this.pendingFiles = [];
    this.imageError = '';
    this.showImages = true;
  }

  getImageUrl(path: string): string {
    return `${this.storageBase}/${path}`;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pendingFiles = input.files ? Array.from(input.files) : [];
  }

  uploadImages() {
    if (!this.imageRoom || !this.pendingFiles.length) return;
    this.imageUploading = true;
    this.imageError = '';
    const fd = new FormData();
    this.pendingFiles.forEach(f => fd.append('images[]', f));
    this.roomService.uploadRoomImages(this.imageRoom.id, fd).subscribe({
      next: (uploaded: RoomImage[]) => {
        this.imageRoom!.images = [...(this.imageRoom!.images ?? []), ...uploaded];
        this.pendingFiles = [];
        this.imageUploading = false;
        this.load();
      },
      error: () => { this.imageError = 'Erreur lors de l\'upload.'; this.imageUploading = false; }
    });
  }

  setMainImage(imageId: number) {
    if (!this.imageRoom) return;
    this.roomService.setMainImage(this.imageRoom.id, imageId).subscribe({
      next: () => {
        this.imageRoom!.images.forEach(img => img.is_main = img.id === imageId);
        this.load();
      },
      error: () => { this.imageError = 'Erreur lors de la mise à jour.'; }
    });
  }

  deleteImage(imageId: number) {
    if (!this.imageRoom || !confirm('Supprimer cette image ?')) return;
    this.roomService.deleteImage(this.imageRoom.id, imageId).subscribe({
      next: () => {
        this.imageRoom!.images = this.imageRoom!.images.filter(img => img.id !== imageId);
        this.load();
      },
      error: () => { this.imageError = 'Erreur lors de la suppression.'; }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'available':      return 'bg-stone-100 text-stone-700';
      case 'occupied':       return 'bg-[#f4efe6] text-[#8a7550]';
      case 'maintenance':    return 'bg-red-100 text-red-700';
      case 'out_of_service': return 'bg-stone-100 text-stone-500';
      default:               return 'bg-stone-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    return this.statuses.find(s => s.value === status)?.label ?? status;
  }
}
