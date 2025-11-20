import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chamado-personalizado',
  imports: [CommonModule, FormsModule],
  templateUrl: './chamado-personalizado.html',
  styleUrl: './chamado-personalizado.scss',
})
export class ChamadoPersonalizado {
  private router = Router;
  
  titulo = signal('');
  descricao = signal('');
  anexos = signal<File[]>([]);
  
  constructor(private routerInject: Router) {}

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (this.anexos().length + files.length > 3) {
      alert('Você pode anexar no máximo 3 arquivos');
      return;
    }
    this.anexos.set([...this.anexos(), ...files.slice(0, 3 - this.anexos().length)]);
  }

  removerAnexo(index: number): void {
    const novosAnexos = this.anexos().filter((_, i) => i !== index);
    this.anexos.set(novosAnexos);
  }

  enviar(): void {
    if (!this.titulo() || !this.descricao()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // TODO: Integrar com o serviço
    console.log({
      titulo: this.titulo(),
      descricao: this.descricao(),
      tipo: 'OUTROS',
      anexos: this.anexos()
    });

    alert('Solicitação enviada com sucesso! Protocolo: #' + Math.floor(Math.random() * 10000));
    this.routerInject.navigate(['/solicitacoes']);
  }

  cancelar(): void {
    this.routerInject.navigate(['/home']);
  }
}
