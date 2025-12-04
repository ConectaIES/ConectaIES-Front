import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SolicitacaoService } from '../../services/solicitacao.service';

@Component({
  selector: 'app-chamado-personalizado',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chamado-personalizado.html',
  styleUrl: './chamado-personalizado.scss',
})
export class ChamadoPersonalizado {
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly snackBar = inject(MatSnackBar);
  
  titulo = signal('');
  descricao = signal('');
  anexos = signal<File[]>([]);
  enviando = signal(false);

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (this.anexos().length + files.length > 3) {
      this.snackBar.open('Você pode anexar no máximo 3 arquivos', 'Fechar', { duration: 3000 });
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
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.enviando()) return;

    this.enviando.set(true);

    const dto = {
      titulo: this.titulo(),
      descricao: this.descricao(),
      tipo: 'OUTROS' as const,
      anexos: this.anexos()
    };

    this.solicitacaoService.criarSolicitacao(dto).subscribe({
      next: (solicitacao) => {
        console.log('Solicitação criada com sucesso:', solicitacao);
        this.snackBar.open(`Solicitação criada! Protocolo: ${solicitacao.protocolo}`, 'Fechar', { duration: 5000 });
        this.router.navigate(['/solicitacoes']);
      },
      error: (error) => {
        console.error('Erro ao criar solicitação:', error);
        this.snackBar.open('Erro ao criar solicitação. Tente novamente.', 'Fechar', { duration: 3000 });
        this.enviando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
