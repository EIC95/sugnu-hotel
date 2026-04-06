import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-gray-100 border-t border-gray-200 py-8 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-500 text-sm">© 2026 SugnuHotel. Tous droits réservés.</p>
        <p class="text-gray-400 text-xs mt-2">Design moderne pour une expérience hôtelière unique.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}
