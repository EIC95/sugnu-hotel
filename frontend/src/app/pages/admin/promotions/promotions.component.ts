import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { PromotionService } from '../../../core/services/promotion.service';
import { Promotion } from '../../../core/models/promotion.model';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './promotions.component.html',
})
export class PromotionsComponent implements OnInit {
  promService = inject(PromotionService);
  promotions: Promotion[] = [];

  ngOnInit() {
    this.promService.getPromotions().subscribe(data => this.promotions = data);
  }

  deletePromotion(id: number) {
    if (confirm('Supprimer cette promotion ?')) {
      this.promService.deletePromotion(id).subscribe(() => window.location.reload());
    }
  }
}
