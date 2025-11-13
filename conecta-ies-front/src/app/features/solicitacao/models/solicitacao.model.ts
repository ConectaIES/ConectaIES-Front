export type StatusSolicitacao = 'ABERTO' | 'NAO_VISTO' | 'EM_ANALISE' | 'EM_EXECUCAO' | 'RESOLVIDO';

export type TipoSolicitacao = 'APOIO_LOCOMOCAO' | 'INTERPRETACAO_LIBRAS' | 'OUTROS';

export interface Anexo {
  id: number;
  nome: string;
  url: string;
  tipo: string;
}

export interface Solicitacao {
  id: number;
  protocolo: string;
  titulo: string;
  descricao: string;
  tipo: TipoSolicitacao;
  status: StatusSolicitacao;
  usuarioId: number;
  usuarioNome?: string;
  anexos: Anexo[];
  createdAt: Date;
  updatedAt: Date;
  firstResponseAt?: Date;
  timeToTmrBreach?: number;
}

export interface CriarSolicitacaoDto {
  titulo: string;
  descricao: string;
  tipo: TipoSolicitacao;
  anexos?: File[];
}
