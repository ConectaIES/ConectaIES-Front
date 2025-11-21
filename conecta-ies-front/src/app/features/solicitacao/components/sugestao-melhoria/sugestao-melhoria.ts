import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitacaoService } from '../../services/solicitacao.service';

@Component({
  selector: 'app-sugestao-melhoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './sugestao-melhoria.html',
  styleUrl: './sugestao-melhoria.scss',
})
export class SugestaoMelhoria {
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);

  titulo = signal('');
  descricao = signal('');
  categoria = signal('');
  anonimo = signal(false);
  anexos = signal<File[]>([]);
  loading = signal(false);

  categorias = [
    'Didática',
    'Infraestrutura',
    'Serviços',
    'Tecnologia',
    'Gestão',
    'Outros'
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
    if (!this.titulo() || !this.descricao() || !this.categoria()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.loading.set(true);

    const tituloCompleto = `[Sugestão - ${this.categoria()}] ${this.titulo()}`;
    const descricaoCompleta = this.anonimo() 
      ? `[SUGESTÃO ANÔNIMA]\n\n${this.descricao()}`
      : this.descricao();

    this.solicitacaoService.criarSolicitacao({
      titulo: tituloCompleto,
      descricao: descricaoCompleta,
      tipo: 'OUTROS',
      anexos: this.anexos()
    }).subscribe({
      next: (solicitacao) => {
        this.loading.set(false);
        alert(`Sugestão enviada com sucesso! Protocolo: ${solicitacao.protocolo}`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        alert(`Erro ao enviar sugestão: ${err.message || 'Tente novamente'}`);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
