import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao, CriarSolicitacaoDto } from '../models/solicitacao.model';
import { EventoHistorico } from '../models/evento-historico.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/solicitacoes';

  criarSolicitacao(dto: CriarSolicitacaoDto): Observable<Solicitacao> {
    const formData = new FormData();
    formData.append('titulo', dto.titulo);
    formData.append('descricao', dto.descricao);
    formData.append('tipo', dto.tipo);
    
    if (dto.anexos) {
      dto.anexos.forEach((file, index) => {
        formData.append(`anexos`, file, file.name);
      });
    }
    
    return this.http.post<Solicitacao>(this.apiUrl, formData);
  }

  listarMinhasSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/minhas`);
  }

  obterSolicitacao(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.apiUrl}/${id}`);
  }

  obterHistorico(id: number): Observable<EventoHistorico[]> {
    return this.http.get<EventoHistorico[]>(`${this.apiUrl}/${id}/historico`);
  }

  adicionarComentario(id: number, comentario: string): Observable<EventoHistorico> {
    return this.http.post<EventoHistorico>(`${this.apiUrl}/${id}/comentarios`, { comentario });
  }

  marcarComoResolvida(id: number): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.apiUrl}/${id}/resolver`, {});
  }

  solicitarReabertura(id: number, motivo: string): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${this.apiUrl}/${id}/reabrir`, { motivo });
  }

  // Admin
  listarNovasSolicitacoes(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/admin/novas`);
  }

  listarSolicitacoesResolvidas(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/admin/resolvidas`);
  }

  atribuirSolicitacao(id: number, usuarioId: number, nota: string): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.apiUrl}/${id}/atribuir`, { usuarioId, nota });
  }

  enviarPrimeiraResposta(id: number, resposta: string): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(`${this.apiUrl}/${id}/primeira-resposta`, { resposta });
  }
}
