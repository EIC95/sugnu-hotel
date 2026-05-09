import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { ServiceService } from '../../../core/services/service.service';
import { Room } from '../../../core/models/room.model';
import { Service } from '../../../core/models/service.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './room-detail.component.html'
})
export class RoomDetailComponent implements OnInit {
  private roomService = inject(RoomService);
  private serviceService = inject(ServiceService);
  private route = inject(ActivatedRoute);

  room: Room | null = null;
  services: Service[] = [];

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.roomService.getRoom(+id).subscribe({
        next: (data) => this.room = data,
        error: (err) => console.error('Error fetching room', err)
      });
    }
    this.serviceService.getActiveServices().subscribe(data => this.services = data);
  }

  private storageBase = environment.apiUrl.replace(/\/api$/, '') + '/storage';

  getMainImageUrl(): string {
    const img = this.room?.images?.find(i => i.is_main) ?? this.room?.images?.[0];
    return img
      ? `${this.storageBase}/${img.image_path}`
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
  }
}
