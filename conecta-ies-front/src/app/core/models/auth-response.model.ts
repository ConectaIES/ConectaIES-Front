import { Usuario } from './usuario.model';

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  matricula?: string;
  tipoPerfil: 'ALUNO' | 'PROFESSOR';
}
