import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './room-detail.component.html'
})
export class RoomDetailComponent implements OnInit {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  
  room: Room | null = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.roomService.getRoom(+id).subscribe({
        next: (data) => this.room = data,
        error: (err) => console.error('Error fetching room', err)
      });
    }
  }

  getMainImageUrl(): string {
    if (!this.room || !this.room.images || this.room.images.length === 0) {
      return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800';
    }
    
    const mainImg = this.room.images.find(img => img.is_main);
    if (mainImg) {
      return `http://localhost:8000/storage/${mainImg.image_path}`;
    }
    
    return `http://localhost:8000/storage/${this.room.images[0].image_path}`;
  }
}
