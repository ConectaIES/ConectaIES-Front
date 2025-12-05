import { Injectable } from '@angular/core';

/**
 * Serviço para anúncios de leitores de tela
 * Gerencia live regions ARIA para comunicação com tecnologias assistivas
 */
@Injectable({
  providedIn: 'root'
})
export class ScreenReaderService {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegion();
  }

  /**
   * Cria uma região ARIA live para anúncios
   */
  private createLiveRegion(): void {
    if (typeof document !== 'undefined') {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('role', 'status');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      this.liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * Anuncia uma mensagem para leitores de tela (politamente)
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
      
      // Limpa após 1 segundo
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }

  /**
   * Anuncia uma mensagem urgente (assertivamente)
   */
  announceUrgent(message: string): void {
    this.announce(message, 'assertive');
  }

  /**
   * Anuncia navegação de página
   */
  announceNavigation(pageName: string): void {
    this.announce(`Navegando para ${pageName}`);
  }

  /**
   * Anuncia mudança de estado
   */
  announceStateChange(state: string): void {
    this.announce(state);
  }

  /**
   * Anuncia resultado de ação
   */
  announceActionResult(message: string, success: boolean = true): void {
    const prefix = success ? 'Sucesso:' : 'Erro:';
    this.announce(`${prefix} ${message}`, success ? 'polite' : 'assertive');
  }
}
