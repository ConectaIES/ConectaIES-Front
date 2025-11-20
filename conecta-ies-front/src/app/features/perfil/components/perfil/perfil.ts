import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  matricula: string;
  curso: string;
  periodo: string;
  tipoPerfil: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  dataCadastro: Date;
  avatarUrl: string;
}

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  modoEdicao = signal(false);
  
  usuario = signal<UsuarioPerfil>({
    id: 1,
    nome: 'Maria Silva Santos',
    email: 'maria.santos@estudante.ies.edu.br',
    telefone: '(11) 98765-4321',
    matricula: '2023001234',
    curso: 'Ciência da Computação',
    periodo: '5º Período',
    tipoPerfil: 'ALUNO',
    dataCadastro: new Date('2023-02-15'),
    avatarUrl: 'https://ui-avatars.com/api/?name=Maria+Silva&background=1976d2&color=fff&size=200'
  });

  toggleEdicao(): void {
    this.modoEdicao.update(value => !value);
  }

  salvarPerfil(): void {
    // TODO: Implementar integração com backend
    console.log('Salvando perfil:', this.usuario());
    this.modoEdicao.set(false);
    // Simular sucesso
    alert('Perfil atualizado com sucesso!');
  }

  cancelarEdicao(): void {
    // TODO: Restaurar dados originais
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
