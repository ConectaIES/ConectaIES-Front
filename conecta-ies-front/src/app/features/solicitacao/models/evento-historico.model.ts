export type TipoEvento = 'STATUS_CHANGE' | 'COMMENT' | 'ATTACHMENT';

export interface EventoHistorico {
  id: number;
  solicitacaoId: number;
  eventoTipo: TipoEvento;
  descricao: string;
  usuarioId?: number;
  usuarioNome?: string;
  timestamp: Date;
}
