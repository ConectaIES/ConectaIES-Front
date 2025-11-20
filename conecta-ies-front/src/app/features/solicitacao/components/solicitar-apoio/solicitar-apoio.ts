import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-apoio',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitar-apoio.html',
  styleUrl: './solicitar-apoio.scss',
})
export class SolicitarApoio {
  titulo = signal('');
  descricao = signal('');
  tipoApoio = signal('');
  anexos = signal<File[]>([]);

  tiposApoio = [
    { valor: 'APOIO_LOCOMOCAO', label: 'Apoio à Locomoção' },
    { valor: 'INTERPRETACAO_LIBRAS', label: 'Interpretação em Libras' },
    { valor: 'MATERIAL_ADAPTADO', label: 'Material Adaptado' },
    { valor: 'ACESSIBILIDADE_DIGITAL', label: 'Acessibilidade Digital' },
    { valor: 'OUTROS', label: 'Outros' }
  ];
  
  constructor(private router: Router) {}

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

    console.log({
      titulo: this.titulo(),
      descricao: this.descricao(),
      tipo: this.tipoApoio(),
      anexos: this.anexos()
    });

    alert('Solicitação de apoio enviada com sucesso! Protocolo: #' + Math.floor(Math.random() * 10000));
    this.router.navigate(['/solicitacoes']);
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
