import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { RealTimeNotifierService } from '../../../../shared/services/real-time-notifier.service';
import { Solicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonToggleModule
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly realTimeNotifier = inject(RealTimeNotifierService);
  private readonly router = inject(Router);

  protected readonly solicitacoes = signal<Solicitacao[]>([]);
  protected readonly solicitacoesResolvidas = signal<Solicitacao[]>([]);
  protected readonly carregando = signal(true);
  protected readonly carregandoResolvidas = signal(false);
  protected readonly filtroOrdenacao = signal<string>('data');
  protected readonly visualizacao = signal<'abertas' | 'resolvidas'>('abertas');

  protected readonly novasSolicitacoesCount = computed(() => {
    return this.solicitacoes().filter(s => s.status === 'ABERTO' || s.status === 'NAO_VISTO').length;
  });

  protected readonly solicitacoesOrdenadas = computed(() => {
    const lista = [...this.solicitacoes()];
    const filtro = this.filtroOrdenacao();

    if (filtro === 'data') {
      return lista.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filtro === 'tmr') {
      return lista.sort((a, b) => (a.timeToTmrBreach || 0) - (b.timeToTmrBreach || 0));
    }
    return lista;
  });

  protected readonly resolvidasOrdenadas = computed(() => {
    const lista = [...this.solicitacoesResolvidas()];
    return lista.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  });

  ngOnInit(): void {
    this.realTimeNotifier.connect();
    this.carregarSolicitacoes();
    this.carregarSolicitacoesResolvidas();
    this.setupRealTimeNotifications();
  }

  private carregarSolicitacoes(): void {
    this.solicitacaoService.listarNovasSolicitacoes().subscribe({
      next: (solicitacoes) => {
        this.solicitacoes.set(solicitacoes);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });
  }

  private carregarSolicitacoesResolvidas(): void {
    this.carregandoResolvidas.set(true);
    this.solicitacaoService.listarSolicitacoesResolvidas().subscribe({
      next: (solicitacoes) => {
        this.solicitacoesResolvidas.set(solicitacoes);
        this.carregandoResolvidas.set(false);
      },
      error: () => {
        this.carregandoResolvidas.set(false);
      }
    });
  }

  private setupRealTimeNotifications(): void {
    this.realTimeNotifier.getNovaSolicitacao$().subscribe((novaSolicitacao) => {
      this.solicitacoes.set([novaSolicitacao, ...this.solicitacoes()]);
    });

    this.realTimeNotifier.getAtualizacaoStatus$().subscribe((update) => {
      const lista = this.solicitacoes();
      const index = lista.findIndex(s => s.id === update.solicitacaoId);
      
      if (index !== -1) {
        const atualizada = { ...lista[index], status: update.status as any };
        
        // Se foi resolvida, move para a lista de resolvidas
        if (update.status === 'RESOLVIDO') {
          const novaLista = lista.filter(s => s.id !== update.solicitacaoId);
          this.solicitacoes.set(novaLista);
          this.solicitacoesResolvidas.set([atualizada, ...this.solicitacoesResolvidas()]);
        } else {
          const novaLista = [...lista];
          novaLista[index] = atualizada;
          this.solicitacoes.set(novaLista);
        }
      }
    });
  }

  verDetalhes(id: number): void {
    this.router.navigate(['/admin/solicitacoes', id]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'ABERTO': 'warn',
      'NAO_VISTO': 'warn',
      'EM_ANALISE': 'accent',
      'EM_EXECUCAO': 'primary',
      'RESOLVIDO': ''
    };
    return colors[status] || '';
  }

  getUrgenciaClass(solicitacao: Solicitacao): string {
    if (!solicitacao.timeToTmrBreach) return '';
    
    const minutos = solicitacao.timeToTmrBreach / 60;
    if (minutos < 60) return 'urgente';
    if (minutos < 120) return 'atencao';
    return '';
  }

  getTmrLabel(solicitacao: Solicitacao): string {
    if (!solicitacao.timeToTmrBreach) return '';
    
    const horas = Math.floor(solicitacao.timeToTmrBreach / 3600);
    const minutos = Math.floor((solicitacao.timeToTmrBreach % 3600) / 60);
    
    return `${horas}h ${minutos}m restantes`;
  }

  alternarVisualizacao(tipo: 'abertas' | 'resolvidas'): void {
    this.visualizacao.set(tipo);
  }
}
