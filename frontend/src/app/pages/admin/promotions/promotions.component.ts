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
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <app-navbar></app-navbar>

      <main class="flex-grow py-12">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-green-900">Codes Promotionnels</h1>
            <button class="bg-green-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 transition">Nouveau Code</button>
          </div>

          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th class="px-6 py-4">Code</th>
                  <th class="px-6 py-4">Réduction</th>
                  <th class="px-6 py-4">Statut</th>
                  <th class="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let p of promotions" class="hover:bg-gray-50">
                  <td class="px-6 py-4 font-bold text-orange-500 uppercase">{{ p.code }}</td>
                  <td class="px-6 py-4 font-bold">{{ p.discount }}{{ p.is_percentage ? '%' : '€' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="'px-2 py-1 rounded text-[10px] font-bold uppercase ' + (p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                      {{ p.is_active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <button (click)="deletePromotion(p.id)" class="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `
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
