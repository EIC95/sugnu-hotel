import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { receptionistGuard } from './core/guards/receptionist.guard';
import { clientGuard } from './core/guards/client.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./pages/public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'rooms',
    loadComponent: () => import('./pages/public/rooms/rooms.component').then(m => m.RoomsComponent)
  },
  {
    path: 'rooms/:id',
    loadComponent: () => import('./pages/public/room-detail/room-detail.component').then(m => m.RoomDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/public/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/public/register/register.component').then(m => m.RegisterComponent)
  },

  // Client Routes
  {
    path: 'client',
    canActivate: [authGuard, clientGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/client/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./pages/client/reservations/reservations.component').then(m => m.ReservationsComponent)
      },
      {
        path: 'reservations/:id',
        loadComponent: () => import('./pages/client/reservation-detail/reservation-detail.component').then(m => m.ReservationDetailComponent)
      },
      {
        path: 'booking/:roomId',
        loadComponent: () => import('./pages/client/booking/booking.component').then(m => m.BookingComponent)
      }
    ]
  },

  // Receptionist Routes
  {
    path: 'receptionist',
    canActivate: [authGuard, receptionistGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/receptionist/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./pages/receptionist/reservations/reservations.component').then(m => m.ReservationsComponent)
      }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'rooms',
        loadComponent: () => import('./pages/admin/rooms/rooms.component').then(m => m.RoomsComponent)
      },
      {
        path: 'room-types',
        loadComponent: () => import('./pages/admin/room-types/room-types.component').then(m => m.RoomTypesComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./pages/admin/services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./pages/admin/promotions/promotions.component').then(m => m.PromotionsComponent)
      },
      {
        path: 'receptionists',
        loadComponent: () => import('./pages/admin/receptionists/receptionists.component').then(m => m.ReceptionistsComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
