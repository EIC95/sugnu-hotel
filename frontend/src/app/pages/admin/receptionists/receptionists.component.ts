import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-receptionists',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './receptionists.component.html'
})
export class ReceptionistsComponent {
  private authService = inject(AuthService);
  showForm = false;
  newData = { name: '', email: '', phone: '', password: '' };

  create() {
    this.authService.createReceptionist(this.newData).subscribe({
      next: () => {
        alert('Compte créé avec succès');
        this.showForm = false;
        this.newData = { name: '', email: '', phone: '', password: '' };
      },
      error: () => alert('Erreur lors de la création')
    });
  }
}
