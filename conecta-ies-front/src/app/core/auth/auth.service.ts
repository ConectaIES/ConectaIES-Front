import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AuthResponse, LoginCredentials, RegisterData } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'conecta_ies_token';
  private readonly USER_KEY = 'conecta_ies_user';

  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly currentUser = signal<Usuario | null>(this.getUserFromStorage());

  constructor() {
    // Sincronizar estado inicial
    if (this.hasToken() && !this.getUserFromStorage()) {
      this.logout();
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/inicial']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.tipoPerfil === 'ADMIN';
  }

  isProfessor(): boolean {
    const user = this.currentUser();
    return user?.tipoPerfil === 'PROFESSOR';
  }

  isAluno(): boolean {
    const user = this.currentUser();
    return user?.tipoPerfil === 'ALUNO';
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.tipoPerfil) : false;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.usuario));
    this.isAuthenticated.set(true);
    this.currentUser.set(response.usuario);
    this.currentUserSubject.next(response.usuario);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): Usuario | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  refreshUserData(): void {
    // Método para recarregar dados do usuário se necessário
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUser.set(user);
      this.currentUserSubject.next(user);
    }
  }
}
