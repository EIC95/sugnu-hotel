import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { RoomService } from '../../../core/services/room.service';
import { RoomType } from '../../../core/models/room-type.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-room-types',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './room-types.component.html',
})
export class RoomTypesComponent implements OnInit {
  roomService = inject(RoomService);
  roomTypes: RoomType[] = [];

  private storageBase = environment.apiUrl.replace(/\/api$/, '') + '/storage';

  getRoomTypeImageUrl(image: string | null | undefined): string {
    return image
      ? `${this.storageBase}/${image}`
      : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
  }

  showModal = false;
  editMode = false;
  selectedId: number | null = null;
  saving = false;
  error = '';

  formData = { name: '', description: '', base_price: 0, max_occupancy: 2 };

  ngOnInit() {
    this.load();
  }

  load() {
    this.roomService.getRoomTypes().subscribe(data => this.roomTypes = data);
  }

  openAdd() {
    this.editMode = false;
    this.selectedId = null;
    this.error = '';
    this.formData = { name: '', description: '', base_price: 0, max_occupancy: 2 };
    this.showModal = true;
  }

  editType(rt: RoomType) {
    this.editMode = true;
    this.selectedId = rt.id;
    this.error = '';
    this.formData = { name: rt.name, description: rt.description, base_price: rt.base_price, max_occupancy: rt.max_occupancy };
    this.showModal = true;
  }

  save() {
    this.saving = true;
    this.error = '';
    const action = this.editMode && this.selectedId
      ? this.roomService.updateRoomType(this.selectedId, this.formData)
      : this.roomService.createRoomType(this.formData);

    action.subscribe({
      next: () => { this.showModal = false; this.saving = false; this.load(); },
      error: () => { this.error = 'Une erreur est survenue.'; this.saving = false; }
    });
  }

  deleteType(id: number) {
    if (confirm('Supprimer ce type de chambre ? Les chambres associées seront également supprimées.')) {
      this.roomService.deleteRoomType(id).subscribe(() => this.load());
    }
  }
}
