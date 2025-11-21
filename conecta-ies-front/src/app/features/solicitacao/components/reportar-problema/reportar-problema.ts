import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';

@Component({
  selector: 'app-reportar-problema',
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar-problema.html',
  styleUrl: './reportar-problema.scss',
})
export class ReportarProblema {
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);

  titulo = signal('');
  descricao = signal('');
  local = signal('');
  urgencia = signal('');
  anexos = signal<File[]>([]);
  loading = signal(false);

  niveisUrgencia = [
    { valor: 'BAIXA', label: 'Baixa' },
    { valor: 'MEDIA', label: 'Média' },
    { valor: 'ALTA', label: 'Alta' },
    { valor: 'CRITICA', label: 'Crítica' }
  ];

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

    this.loading.set(true);

    const tituloCompleto = `[${this.urgencia()}] ${this.titulo()} - ${this.local()}`;

    this.solicitacaoService.criarSolicitacao({
      titulo: tituloCompleto,
      descricao: this.descricao(),
      tipo: 'OUTROS',
      anexos: this.anexos()
    }).subscribe({
      next: (solicitacao) => {
        this.loading.set(false);
        alert(`Problema reportado com sucesso! Protocolo: ${solicitacao.protocolo}`);
        this.router.navigate(['/solicitacoes']);
      },
      error: (err) => {
        this.loading.set(false);
        alert(`Erro ao reportar problema: ${err.message || 'Tente novamente'}`);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
