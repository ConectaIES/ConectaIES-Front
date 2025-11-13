export type TipoPerfil = 'ALUNO' | 'PROFESSOR' | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoPerfil: TipoPerfil;
}
