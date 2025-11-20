import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  menuAberto = signal(false);

  toggleMenu(): void {
    this.menuAberto.update(value => !value);
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
  }
}
