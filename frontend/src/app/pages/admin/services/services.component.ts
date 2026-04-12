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
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  serviceService = inject(ServiceService);
  services: Service[] = [];

  ngOnInit() {
    this.serviceService.getServices().subscribe(data => this.services = data);
  }

  openAdd() {
    alert('Ajouter un service (formulaire à implémenter)');
  }

  deleteService(id: number) {
    if (confirm('Supprimer ce service ?')) {
      this.serviceService.deleteService(id).subscribe(() => window.location.reload());
    }
  }
}
