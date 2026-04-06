import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  userRole = signal<string | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (token && userStr && role) {
      this.currentUser.set(JSON.parse(userStr));
      this.userRole.set(role);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.role);
        
        this.currentUser.set(response.user);
        this.userRole.set(response.role);
        
        this.redirectByRole(response.role);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('role', response.role);
        
        this.currentUser.set(response.user);
        this.userRole.set(response.role);
        
        this.redirectByRole(response.role);
      })
    );
  }

  createReceptionist(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/receptionists`, data);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearStorage()),
      catchError(() => {
        this.clearStorage();
        return of(null);
      })
    ).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  private clearStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.currentUser.set(null);
    this.userRole.set(null);
  }

  private redirectByRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'receptionist':
        this.router.navigate(['/receptionist/dashboard']);
        break;
      case 'client':
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string | string[]): boolean {
    const currentRole = this.userRole();
    if (!currentRole) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }
    return currentRole === role;
  }
}
