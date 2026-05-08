import { Component, inject, OnInit } from '@angular/core';
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
export class ReceptionistsComponent implements OnInit {
  private authService = inject(AuthService);
  receptionists: any[] = [];

  showModal = false;
  editMode = false;
  selectedId: number | null = null;
  saving = false;
  error = '';

  formData = { name: '', email: '', phone: '', password: '' };

  ngOnInit() {
    this.load();
  }

  load() {
    this.authService.getReceptionists().subscribe(data => this.receptionists = data);
  }

  openAdd() {
    this.editMode = false;
    this.selectedId = null;
    this.error = '';
    this.formData = { name: '', email: '', phone: '', password: '' };
    this.showModal = true;
  }

  editReceptionist(r: any) {
    this.editMode = true;
    this.selectedId = r.id;
    this.error = '';
    this.formData = { name: r.name, email: r.email, phone: r.phone ?? '', password: '' };
    this.showModal = true;
  }

  save() {
    this.saving = true;
    this.error = '';

    const payload: any = { name: this.formData.name, email: this.formData.email, phone: this.formData.phone };
    if (this.formData.password) payload.password = this.formData.password;

    const action = this.editMode && this.selectedId
      ? this.authService.updateReceptionist(this.selectedId, payload)
      : this.authService.createReceptionist({ ...payload, password: this.formData.password });

    action.subscribe({
      next: () => { this.showModal = false; this.saving = false; this.load(); },
      error: (err: any) => {
        this.error = err?.error?.message ?? 'Une erreur est survenue.';
        this.saving = false;
      }
    });
  }

  deleteReceptionist(id: number) {
    if (confirm('Supprimer ce réceptionniste définitivement ?')) {
      this.authService.deleteReceptionist(id).subscribe(() => this.load());
    }
  }
}
