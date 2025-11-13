import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Solicitacao } from '../../features/solicitacao/models/solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class RealTimeNotifierService {
  private socket: Socket;
  private novaSolicitacaoSubject = new Subject<Solicitacao>();
  private atualizacaoStatusSubject = new Subject<{ solicitacaoId: number; status: string }>();

  constructor() {
    this.socket = io('http://localhost:3000', {
      autoConnect: false
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on('nova-solicitacao', (solicitacao: Solicitacao) => {
      this.novaSolicitacaoSubject.next(solicitacao);
    });

    this.socket.on('atualizacao-status', (data: { solicitacaoId: number; status: string }) => {
      this.atualizacaoStatusSubject.next(data);
    });
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  getNovaSolicitacao$(): Observable<Solicitacao> {
    return this.novaSolicitacaoSubject.asObservable();
  }

  getAtualizacaoStatus$(): Observable<{ solicitacaoId: number; status: string }> {
    return this.atualizacaoStatusSubject.asObservable();
  }
}
