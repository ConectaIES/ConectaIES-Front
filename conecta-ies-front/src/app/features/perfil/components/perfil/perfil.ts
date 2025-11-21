import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { SolicitacaoService } from '../../../solicitacao/services/solicitacao.service';
import { Usuario } from '../../../../core/models/usuario.model';

interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  matricula?: string;
  curso?: string;
  periodo?: string;
  tipoPerfil: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  dataCadastro?: Date;
  avatarUrl: string;
}

interface EstatisticasPerfil {
  totalSolicitacoes: number;
  resolvidas: number;
  emAndamento: number;
  pendentes: number;
}

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly solicitacaoService = inject(SolicitacaoService);
  
  modoEdicao = signal(false);
  usuario = signal<UsuarioPerfil | null>(null);
  estatisticas = signal<EstatisticasPerfil>({
    totalSolicitacoes: 0,
    resolvidas: 0,
    emAndamento: 0,
    pendentes: 0
  });

  ngOnInit(): void {
    this.carregarDadosUsuario();
    this.carregarEstatisticas();
  }

  private carregarDadosUsuario(): void {
    const usuarioAuth = this.authService.currentUser();
    
    if (usuarioAuth) {
      this.usuario.set({
        id: usuarioAuth.id,
        nome: usuarioAuth.nome,
        email: usuarioAuth.email,
        telefone: '',
        matricula: usuarioAuth.matricula || '',
        curso: '',
        periodo: '',
        tipoPerfil: usuarioAuth.tipoPerfil,
        dataCadastro: usuarioAuth.createdAt,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(usuarioAuth.nome)}&background=1976d2&color=fff&size=200`
      });
    }
  }

  private carregarEstatisticas(): void {
    this.solicitacaoService.listarMinhasSolicitacoes().subscribe({
      next: (solicitacoes) => {
        const stats: EstatisticasPerfil = {
          totalSolicitacoes: solicitacoes.length,
          resolvidas: solicitacoes.filter(s => s.status === 'RESOLVIDO').length,
          emAndamento: solicitacoes.filter(s => s.status === 'EM_ANALISE' || s.status === 'EM_EXECUCAO').length,
          pendentes: solicitacoes.filter(s => s.status === 'ABERTO' || s.status === 'NAO_VISTO').length
        };
        this.estatisticas.set(stats);
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
      }
    });
  }

  toggleEdicao(): void {
    this.modoEdicao.update(value => !value);
  }

  salvarPerfil(): void {
    // TODO: Implementar endpoint de atualização de perfil no backend
    console.log('Salvando perfil:', this.usuario());
    this.modoEdicao.set(false);
    alert('Perfil atualizado com sucesso!');
    
    // Recarregar dados do AuthService se necessário
    this.authService.refreshUserData();
  }

  cancelarEdicao(): void {
    this.carregarDadosUsuario();
    this.modoEdicao.set(false);
  }

  getTipoPerfilLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'ALUNO': 'Aluno',
      'PROFESSOR': 'Professor',
      'ADMIN': 'Administrador'
    };
    return labels[tipo] || tipo;
  }
}
