import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>

      <main class="flex-grow">
        <!-- Hero Section -->
        <div class="relative h-[600px] flex items-center justify-center text-white">
          <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" alt="Hotel Hero" class="w-full h-full object-cover brightness-50">
          </div>
          
          <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-6">Vivez une expérience inoubliable au SugnuHotel</h1>
            <p class="text-xl mb-8">Confort, luxe et hospitalité au cœur de la ville.</p>
            
            <!-- Search Bar -->
            <div class="bg-white p-6 rounded-2xl shadow-2xl text-gray-900 max-w-3xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-left">
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Arrivée</label>
                  <input type="date" [(ngModel)]="searchData.check_in_date" class="w-full border-gray-300 rounded-lg focus:ring-green-800 focus:border-green-800">
                </div>
                <div class="text-left">
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Départ</label>
                  <input type="date" [(ngModel)]="searchData.check_out_date" class="w-full border-gray-300 rounded-lg focus:ring-green-800 focus:border-green-800">
                </div>
                <div class="text-left">
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Adultes</label>
                  <select [(ngModel)]="searchData.number_of_adults" class="w-full border-gray-300 rounded-lg focus:ring-green-800 focus:border-green-800">
                    <option value="1">1 Adulte</option>
                    <option value="2">2 Adultes</option>
                    <option value="3">3 Adultes</option>
                    <option value="4">4 Adultes</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button (click)="search()" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition duration-300">Rechercher</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Rooms -->
        <section class="max-w-7xl mx-auto px-4 py-16">
          <div class="flex justify-between items-end mb-12">
            <div>
              <h2 class="text-3xl font-bold text-green-900">Nos Chambres</h2>
              <p class="text-gray-500">Découvrez nos espaces conçus pour votre bien-être.</p>
            </div>
            <a routerLink="/rooms" class="text-green-800 font-bold hover:underline">Voir tout →</a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Mocked for visualization if backend not ready -->
            <div *ngFor="let i of [1,2,3]" class="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div class="h-48 bg-gray-200"></div>
              <div class="p-6">
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {
  router = inject(Router);
  searchData = {
    check_in_date: '',
    check_out_date: '',
    number_of_adults: '1'
  };

  search() {
    this.router.navigate(['/rooms'], { queryParams: this.searchData });
  }
}
