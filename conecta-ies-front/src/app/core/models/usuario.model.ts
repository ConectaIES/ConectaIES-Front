export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoPerfil: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  matricula?: string;
  createdAt?: Date;
}
