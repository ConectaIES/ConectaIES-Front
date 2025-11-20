import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportar-problema',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar-problema.html',
  styleUrl: './reportar-problema.scss',
})
export class ReportarProblema {
  titulo = signal('');
  descricao = signal('');
  local = signal('');
  urgencia = signal('');
  anexos = signal<File[]>([]);

  niveisUrgencia = [
    { valor: 'BAIXA', label: 'Baixa' },
    { valor: 'MEDIA', label: 'Média' },
    { valor: 'ALTA', label: 'Alta' },
    { valor: 'CRITICA', label: 'Crítica' }
  ];
  
  constructor(private router: Router) {}

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (this.anexos().length + files.length > 3) {
      alert('Você pode anexar no máximo 3 arquivos');
      return;
    }
    this.anexos.set([...this.anexos(), ...files.slice(0, 3 - this.anexos().length)]);
  }

  removerAnexo(index: number): void {
    this.anexos.set(this.anexos().filter((_, i) => i !== index));
  }

  enviar(): void {
    if (!this.titulo() || !this.descricao() || !this.local() || !this.urgencia()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    console.log({
      titulo: this.titulo(),
      descricao: this.descricao(),
      local: this.local(),
      urgencia: this.urgencia(),
      tipo: 'PROBLEMA',
      anexos: this.anexos()
    });

    alert('Problema reportado com sucesso! Protocolo: #' + Math.floor(Math.random() * 10000));
    this.router.navigate(['/solicitacoes']);
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
