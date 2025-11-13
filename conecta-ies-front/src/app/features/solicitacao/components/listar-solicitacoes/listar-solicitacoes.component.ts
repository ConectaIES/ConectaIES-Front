import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { RealTimeNotifierService } from '../../../../shared/services/real-time-notifier.service';
import { Solicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-listar-solicitacoes',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './listar-solicitacoes.component.html',
  styleUrl: './listar-solicitacoes.component.scss'
})
export class ListarSolicitacoesComponent implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly realTimeNotifier = inject(RealTimeNotifierService);
  private readonly router = inject(Router);

  protected readonly solicitacoes = signal<Solicitacao[]>([]);
  protected readonly carregando = signal(true);

  ngOnInit(): void {
    this.carregarSolicitacoes();
    this.setupRealTimeUpdates();
  }

  private carregarSolicitacoes(): void {
    this.solicitacaoService.listarMinhasSolicitacoes().subscribe({
      next: (solicitacoes) => {
        this.solicitacoes.set(solicitacoes);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });
  }

  private setupRealTimeUpdates(): void {
    this.realTimeNotifier.getAtualizacaoStatus$().subscribe((update) => {
      const solicitacoesAtuais = this.solicitacoes();
      const index = solicitacoesAtuais.findIndex(s => s.id === update.solicitacaoId);
      
      if (index !== -1) {
        const atualizada = { ...solicitacoesAtuais[index], status: update.status as any };
        const novaLista = [...solicitacoesAtuais];
        novaLista[index] = atualizada;
        this.solicitacoes.set(novaLista);
      }
    });
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/solicitacoes', id]);
  }

  novaSolicitacao(): void {
    this.router.navigate(['/solicitacoes/nova']);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'ABERTO': 'primary',
      'NAO_VISTO': 'warn',
      'EM_ANALISE': 'accent',
      'EM_EXECUCAO': 'accent',
      'RESOLVIDO': ''
    };
    return colors[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'ABERTO': 'Aberto',
      'NAO_VISTO': 'Não Visto',
      'EM_ANALISE': 'Em Análise',
      'EM_EXECUCAO': 'Em Execução',
      'RESOLVIDO': 'Resolvido'
    };
    return labels[status] || status;
  }
}
