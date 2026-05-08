import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { ServiceService } from '../../../core/services/service.service';
import { Service } from '../../../core/models/service.model';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './services.component.html'
})
export class ServicesComponent implements OnInit {
  serviceService = inject(ServiceService);
  services: Service[] = [];

  showForm = false;
  editMode = false;
  selectedId: number | null = null;
  saving = false;
  error = '';

  formData = { name: '', description: '', price: 0, is_active: true };

  ngOnInit() {
    this.load();
  }

  load() {
    this.serviceService.getServices().subscribe(data => this.services = data);
  }

  openAdd() {
    this.editMode = false;
    this.selectedId = null;
    this.error = '';
    this.formData = { name: '', description: '', price: 0, is_active: true };
    this.showForm = true;
  }

  editService(s: Service) {
    this.editMode = true;
    this.selectedId = s.id;
    this.error = '';
    this.formData = { name: s.name, description: s.description ?? '', price: s.price, is_active: s.is_active };
    this.showForm = true;
  }

  save() {
    this.saving = true;
    this.error = '';
    const action = this.editMode && this.selectedId
      ? this.serviceService.updateService(this.selectedId, this.formData)
      : this.serviceService.createService(this.formData);

    action.subscribe({
      next: () => { this.showForm = false; this.saving = false; this.load(); },
      error: () => { this.error = 'Une erreur est survenue.'; this.saving = false; }
    });
  }

  toggleActive(s: Service) {
    this.serviceService.updateService(s.id, { is_active: !s.is_active }).subscribe(() => this.load());
  }

  deleteService(id: number) {
    if (confirm('Supprimer ce service définitivement ?')) {
      this.serviceService.deleteService(id).subscribe(() => this.load());
    }
  }
}
