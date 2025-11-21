import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { TipoSolicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-solicitar-apoio',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-apoio.html',
  styleUrl: './solicitar-apoio.scss',
})
export class SolicitarApoio {
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);

  titulo = signal('');
  descricao = signal('');
  tipoApoio = signal<TipoSolicitacao | ''>('');
  anexos = signal<File[]>([]);
  loading = signal(false);

  tiposApoio = [
    { valor: 'APOIO_LOCOMOCAO' as TipoSolicitacao, label: 'Apoio à Locomoção' },
    { valor: 'INTERPRETACAO_LIBRAS' as TipoSolicitacao, label: 'Interpretação em Libras' },
    { valor: 'OUTROS' as TipoSolicitacao, label: 'Outros' }
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
    if (!this.titulo() || !this.descricao() || !this.tipoApoio()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.loading.set(true);

    this.solicitacaoService.criarSolicitacao({
      titulo: this.titulo(),
      descricao: this.descricao(),
      tipo: this.tipoApoio() as TipoSolicitacao,
      anexos: this.anexos()
    }).subscribe({
      next: (solicitacao) => {
        this.loading.set(false);
        alert(`Solicitação de apoio enviada com sucesso! Protocolo: ${solicitacao.protocolo}`);
        this.router.navigate(['/solicitacoes']);
      },
      error: (err) => {
        this.loading.set(false);
        alert(`Erro ao enviar solicitação: ${err.message || 'Tente novamente'}`);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
