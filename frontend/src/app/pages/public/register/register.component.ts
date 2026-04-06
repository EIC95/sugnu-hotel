import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  
  userData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  };
  error = '';

  register() {
    this.authService.register(this.userData).subscribe({
      next: () => {
        // Redirection gérée par le service
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'inscription. Veuillez vérifier vos informations.';
      }
    });
  }
}
