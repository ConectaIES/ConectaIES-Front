import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessibilityService } from '../../services/accessibility.service';
import { ScreenReaderService } from '../../services/screen-reader.service';

@Component({
  selector: 'app-accessibility-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTooltipModule],
  templateUrl: './accessibility-toolbar.component.html',
  styleUrls: ['./accessibility-toolbar.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)'
  }
})
export class AccessibilityToolbarComponent {
  protected readonly accessibilityService = inject(AccessibilityService);
  protected readonly screenReader = inject(ScreenReaderService);
  protected readonly isOpen = signal(false);
  protected readonly vLibrasActive = signal(false);

  togglePanel(): void {
    this.isOpen.set(!this.isOpen());
    const message = this.isOpen() 
      ? 'Painel de acessibilidade aberto. Use Tab para navegar entre as opções.' 
      : 'Painel de acessibilidade fechado.';
    this.screenReader.announce(message);
  }

  closePanel(): void {
    this.isOpen.set(false);
    this.screenReader.announce('Painel de acessibilidade fechado.');
  }

  increaseFontSize(): void {
    this.accessibilityService.increaseFontSize();
    const size = this.accessibilityService.fontSize();
    const sizeLabel = size === 'large' ? 'Grande' : 'Normal';
    this.screenReader.announce(`Tamanho da fonte aumentado para ${sizeLabel}`);
  }

  decreaseFontSize(): void {
    this.accessibilityService.decreaseFontSize();
    const size = this.accessibilityService.fontSize();
    const sizeLabel = size === 'small' ? 'Pequeno' : 'Normal';
    this.screenReader.announce(`Tamanho da fonte reduzido para ${sizeLabel}`);
  }

  resetFontSize(): void {
    this.accessibilityService.resetFontSize();
    this.screenReader.announce('Tamanho da fonte restaurado para Normal');
  }

  get canIncrease(): boolean {
    return this.accessibilityService.fontSize() !== 'large';
  }

  get canDecrease(): boolean {
    return this.accessibilityService.fontSize() !== 'small';
  }

  /**
   * Manipula eventos de teclado para atalhos de acessibilidade
   * Alt + A: Abre/fecha painel
   * ESC: Fecha painel
   * Ctrl + +: Aumentar fonte
   * Ctrl + -: Diminuir fonte
   * Ctrl + 0: Resetar fonte
   * Ctrl + D: Alternar modo escuro
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Alt + A: Abre/fecha o painel de acessibilidade
    if (event.altKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      this.togglePanel();
      return;
    }

    // ESC: Fecha o painel se estiver aberto
    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.closePanel();
      return;
    }

    // Atalhos apenas quando o painel está aberto
    if (this.isOpen()) {
      // Ctrl + +: Aumentar fonte
      if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
        event.preventDefault();
        if (this.canIncrease) {
          this.accessibilityService.increaseFontSize();
        }
        return;
      }

      // Ctrl + -: Diminuir fonte
      if (event.ctrlKey && event.key === '-') {
        event.preventDefault();
        if (this.canDecrease) {
          this.accessibilityService.decreaseFontSize();
        }
        return;
      }

      // Ctrl + 0: Resetar fonte
      if (event.ctrlKey && event.key === '0') {
        event.preventDefault();
        this.accessibilityService.resetFontSize();
        return;
      }

      // Ctrl + D: Alternar modo escuro
      if (event.ctrlKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        this.accessibilityService.toggleDarkMode();
        const theme = this.accessibilityService.darkMode() ? 'escuro' : 'claro';
        this.screenReader.announce(`Modo ${theme} ativado`);
        return;
      }
    }
  }

  /**
   * Toggle do widget do VLibras
   */
  toggleVLibras(): void {
    const vLibrasContainer = document.querySelector('[vw]') as HTMLElement;
    
    if (!vLibrasContainer) {
      this.screenReader.announce('VLibras não está disponível no momento');
      return;
    }

    if (this.vLibrasActive()) {
      // Desativar VLibras - recarregar a página para limpar completamente o estado
      // Esta é a única forma confiável de desativar o VLibras completamente
      window.location.reload();
    } else {
      // Ativar VLibras
      vLibrasContainer.style.display = '';
      this.vLibrasActive.set(true);
      
      // Aguarda um momento para garantir que o widget está renderizado
      setTimeout(() => {
        const accessButton = vLibrasContainer.querySelector('[vw-access-button]') as HTMLElement;
        if (accessButton) {
          accessButton.click();
          this.screenReader.announce('Tradutor VLibras ativado');
        }
      }, 100);
    }
  }
}
