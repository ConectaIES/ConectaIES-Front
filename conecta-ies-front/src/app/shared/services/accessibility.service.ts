import { Injectable, signal, effect } from '@angular/core';

export type FontSize = 'small' | 'normal' | 'large';
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly FONT_SIZE_KEY = 'conectaies-font-size';
  private readonly THEME_KEY = 'conectaies-theme';
  
  // Tamanhos de fonte disponíveis
  private fontSizes: Record<FontSize, number> = {
    small: 14,
    normal: 16,
    large: 20
  };

  // State atual do tamanho de fonte
  fontSize = signal<FontSize>(this.loadFontSize());
  
  // State atual do tema
  darkMode = signal<boolean>(this.loadTheme() === 'dark');

  constructor() {
    this.applyFontSize(this.fontSize());
    this.applyTheme(this.darkMode());
    
    // Observa mudanças no tema e aplica
    effect(() => {
      this.applyTheme(this.darkMode());
    });
  }

  // ========================================
  // CONTROLES DE FONTE
  // ========================================

  /**
   * Aumenta o tamanho da fonte
   */
  increaseFontSize(): void {
    const current = this.fontSize();
    if (current === 'small') {
      this.setFontSize('normal');
    } else if (current === 'normal') {
      this.setFontSize('large');
    }
  }

  /**
   * Diminui o tamanho da fonte
   */
  decreaseFontSize(): void {
    const current = this.fontSize();
    if (current === 'large') {
      this.setFontSize('normal');
    } else if (current === 'normal') {
      this.setFontSize('small');
    }
  }

  /**
   * Reseta para o tamanho normal
   */
  resetFontSize(): void {
    this.setFontSize('normal');
  }

  /**
   * Define um tamanho específico
   */
  setFontSize(size: FontSize): void {
    this.fontSize.set(size);
    this.applyFontSize(size);
    this.saveFontSize(size);
  }

  /**
   * Retorna o tamanho atual em pixels
   */
  getCurrentFontSizeValue(): number {
    return this.fontSizes[this.fontSize()];
  }

  /**
   * Aplica o tamanho de fonte no documento
   */
  private applyFontSize(size: FontSize): void {
    const rootFontSize = this.fontSizes[size];
    document.documentElement.style.fontSize = `${rootFontSize}px`;
  }

  /**
   * Salva preferência no localStorage
   */
  private saveFontSize(size: FontSize): void {
    localStorage.setItem(this.FONT_SIZE_KEY, size);
  }

  /**
   * Carrega preferência do localStorage
   */
  private loadFontSize(): FontSize {
    const saved = localStorage.getItem(this.FONT_SIZE_KEY);
    return (saved as FontSize) || 'normal';
  }

  // ========================================
  // CONTROLES DE TEMA
  // ========================================

  /**
   * Alterna entre modo claro e escuro
   */
  toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
    this.saveTheme(this.darkMode() ? 'dark' : 'light');
  }

  /**
   * Ativa o modo escuro
   */
  enableDarkMode(): void {
    this.darkMode.set(true);
    this.saveTheme('dark');
  }

  /**
   * Desativa o modo escuro
   */
  disableDarkMode(): void {
    this.darkMode.set(false);
    this.saveTheme('light');
  }

  /**
   * Aplica o tema no documento
   */
  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  /**
   * Salva preferência de tema no localStorage
   */
  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  /**
   * Carrega preferência de tema do localStorage
   */
  private loadTheme(): Theme {
    const saved = localStorage.getItem(this.THEME_KEY);
    return (saved as Theme) || 'light';
  }
}
