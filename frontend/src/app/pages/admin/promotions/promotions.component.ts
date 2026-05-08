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

  showModal = false;
  editMode = false;
  selectedId: number | null = null;
  saving = false;
  error = '';

  formData = {
    code: '',
    description: '',
    discount: 0,
    is_percentage: true,
    starts_at: '',
    ends_at: '',
    max_uses: null as number | null,
    is_active: true,
  };

  ngOnInit() {
    this.load();
  }

  load() {
    this.promService.getPromotions().subscribe(data => this.promotions = data);
  }

  openAdd() {
    this.editMode = false;
    this.selectedId = null;
    this.error = '';
    this.formData = { code: '', description: '', discount: 0, is_percentage: true, starts_at: '', ends_at: '', max_uses: null, is_active: true };
    this.showModal = true;
  }

  editPromotion(p: Promotion) {
    this.editMode = true;
    this.selectedId = p.id;
    this.error = '';
    this.formData = {
      code: p.code,
      description: p.description ?? '',
      discount: p.discount,
      is_percentage: p.is_percentage,
      starts_at: p.starts_at?.substring(0, 10) ?? '',
      ends_at: p.ends_at?.substring(0, 10) ?? '',
      max_uses: (p as any).max_uses ?? null,
      is_active: p.is_active,
    };
    this.showModal = true;
  }

  save() {
    this.saving = true;
    this.error = '';
    const action = this.editMode && this.selectedId
      ? this.promService.updatePromotion(this.selectedId, this.formData)
      : this.promService.createPromotion(this.formData);

    action.subscribe({
      next: () => { this.showModal = false; this.saving = false; this.load(); },
      error: () => { this.error = 'Une erreur est survenue.'; this.saving = false; }
    });
  }

  toggleActive(p: Promotion) {
    this.promService.updatePromotion(p.id, { is_active: !p.is_active }).subscribe(() => this.load());
  }

  deletePromotion(id: number) {
    if (confirm('Supprimer cette promotion définitivement ?')) {
      this.promService.deletePromotion(id).subscribe(() => this.load());
    }
  }
}
