import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);

  menuAberto = signal(false);
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  toggleMenu(): void {
    this.menuAberto.update(value => !value);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }

  logout(): void {
    this.fecharMenu();
    this.authService.logout();
  }
}
