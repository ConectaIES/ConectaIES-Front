import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { TipoSolicitacao } from '../../models/solicitacao.model';

@Component({
  selector: 'app-criar-solicitacao',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './criar-solicitacao.component.html',
  styleUrl: './criar-solicitacao.component.scss'
})
export class CriarSolicitacaoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly form: FormGroup;
  protected readonly anexos = signal<File[]>([]);
  protected readonly enviando = signal(false);

  protected readonly tiposSolicitacao: { value: TipoSolicitacao; label: string }[] = [
    { value: 'APOIO_LOCOMOCAO', label: 'Apoio à Locomoção' },
    { value: 'INTERPRETACAO_LIBRAS', label: 'Interpretação de Libras' },
    { value: 'OUTROS', label: 'Outros' }
  ];

  constructor() {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.maxLength(2000)]],
      tipo: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const novosAnexos = Array.from(input.files);
      const anexosAtuais = this.anexos();
      
      if (anexosAtuais.length + novosAnexos.length > 3) {
        this.snackBar.open('Máximo de 3 anexos permitidos', 'Fechar', { duration: 3000 });
        return;
      }
      
      this.anexos.set([...anexosAtuais, ...novosAnexos]);
    }
  }

  removerAnexo(index: number): void {
    const anexosAtuais = this.anexos();
    this.anexos.set(anexosAtuais.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.enviando.set(true);
      
      const dto = {
        titulo: this.form.value.titulo,
        descricao: this.form.value.descricao,
        tipo: this.form.value.tipo,
        anexos: this.anexos()
      };

      this.solicitacaoService.criarSolicitacao(dto).subscribe({
        next: (solicitacao) => {
          this.snackBar.open(
            `Solicitação criada com sucesso! Protocolo: ${solicitacao.protocolo}`,
            'Fechar',
            { duration: 5000 }
          );
          this.router.navigate(['/solicitacoes']);
        },
        error: (error) => {
          this.snackBar.open('Erro ao criar solicitação. Tente novamente.', 'Fechar', {
            duration: 3000
          });
          this.enviando.set(false);
        }
      });
    }
  }
}
