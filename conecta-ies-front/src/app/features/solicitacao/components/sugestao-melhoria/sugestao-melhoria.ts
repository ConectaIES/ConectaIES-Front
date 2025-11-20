import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sugestao-melhoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './sugestao-melhoria.html',
  styleUrl: './sugestao-melhoria.scss',
})
export class SugestaoMelhoria {
  titulo = signal('');
  descricao = signal('');
  categoria = signal('');
  anonimo = signal(false);
  anexos = signal<File[]>([]);

  categorias = [
    'Didática',
    'Infraestrutura',
    'Serviços',
    'Tecnologia',
    'Gestão',
    'Outros'
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
    if (!this.titulo() || !this.descricao() || !this.categoria()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    console.log({
      titulo: this.titulo(),
      descricao: this.descricao(),
      categoria: this.categoria(),
      anonimo: this.anonimo(),
      tipo: 'FEEDBACK',
      anexos: this.anexos()
    });

    alert('Sugestão enviada com sucesso!');
    this.router.navigate(['/home']);
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
