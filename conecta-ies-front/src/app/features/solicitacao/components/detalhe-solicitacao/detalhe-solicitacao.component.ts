import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { RealTimeNotifierService } from '../../../../shared/services/real-time-notifier.service';
import { Solicitacao } from '../../models/solicitacao.model';
import { EventoHistorico } from '../../models/evento-historico.model';

@Component({
  selector: 'app-detalhe-solicitacao',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './detalhe-solicitacao.component.html',
  styleUrl: './detalhe-solicitacao.component.scss'
})
export class DetalheSolicitacaoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly realTimeNotifier = inject(RealTimeNotifierService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly solicitacao = signal<Solicitacao | null>(null);
  protected readonly historico = signal<EventoHistorico[]>([]);
  protected readonly carregando = signal(true);
  protected readonly comentarioForm: FormGroup;

  constructor() {
    this.comentarioForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarSolicitacao(id);
    this.carregarHistorico(id);
    this.setupRealTimeUpdates();
  }

  private carregarSolicitacao(id: number): void {
    this.solicitacaoService.obterSolicitacao(id).subscribe({
      next: (solicitacao) => {
        this.solicitacao.set(solicitacao);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar solicitação', 'Fechar', { duration: 3000 });
        this.router.navigate(['/solicitacoes']);
      }
    });
  }

  private carregarHistorico(id: number): void {
    this.solicitacaoService.obterHistorico(id).subscribe({
      next: (historico) => {
        this.historico.set(historico);
      }
    });
  }

  private setupRealTimeUpdates(): void {
    this.realTimeNotifier.getAtualizacaoStatus$().subscribe((update) => {
      const sol = this.solicitacao();
      if (sol && sol.id === update.solicitacaoId) {
        this.solicitacao.set({ ...sol, status: update.status as any });
      }
    });
  }

  adicionarComentario(): void {
    if (this.comentarioForm.valid && this.solicitacao()) {
      const comentario = this.comentarioForm.value.comentario;
      this.solicitacaoService.adicionarComentario(this.solicitacao()!.id, comentario).subscribe({
        next: (evento) => {
          this.historico.set([...this.historico(), evento]);
          this.comentarioForm.reset();
          this.snackBar.open('Comentário adicionado', 'Fechar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Erro ao adicionar comentário', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  marcarComoResolvida(): void {
    if (this.solicitacao()) {
      this.solicitacaoService.marcarComoResolvida(this.solicitacao()!.id).subscribe({
        next: (solicitacao) => {
          this.solicitacao.set(solicitacao);
          this.snackBar.open('Solicitação marcada como resolvida', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Erro ao marcar como resolvida', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/solicitacoes']);
  }
}
