import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicial',
  imports: [],
  templateUrl: './inicial.html',
  styleUrl: './inicial.scss',
})
export class Inicial {
  private router = inject(Router);

  navegarParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navegarParaCadastro(): void {
    this.router.navigate(['/auth/cadastro']);
  }
}
