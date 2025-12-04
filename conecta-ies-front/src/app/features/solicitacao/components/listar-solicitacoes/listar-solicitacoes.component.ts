import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { RealTimeNotifierService } from '../../../../shared/services/real-time-notifier.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-listar-solicitacoes',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './listar-solicitacoes.component.html',
  styleUrl: './listar-solicitacoes.component.scss'
})
export class ListarSolicitacoesComponent implements OnInit, OnDestroy {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly realTimeNotifier = inject(RealTimeNotifierService);
  private readonly router = inject(Router);
  private routerSubscription?: Subscription;

  protected readonly solicitacoes = signal<Solicitacao[]>([]);
  protected readonly carregando = signal(true);

  ngOnInit(): void {
    this.carregarSolicitacoes();
    this.setupRealTimeUpdates();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private setupRouterEvents(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/solicitacoes') {
          console.log('Navegou de volta para /solicitacoes - recarregando...');
          this.carregarSolicitacoes();
        }
      });
  }

  private carregarSolicitacoes(): void {
    console.log('Carregando solicitações...');
    this.solicitacaoService.listarMinhasSolicitacoes().subscribe({
      next: (solicitacoes) => {
        console.log('Solicitações recebidas:', solicitacoes);
        this.solicitacoes.set(solicitacoes);
        this.carregando.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar solicitações:', error);
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

  abrirFormulario(tipo: string): void {
    const rotas: Record<string, string> = {
      'chamado': '/chamado-personalizado',
      'sugestao': '/sugestao-melhoria',
      'apoio': '/solicitar-apoio',
      'problema': '/reportar-problema'
    };
    
    this.router.navigate([rotas[tipo]]);
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
