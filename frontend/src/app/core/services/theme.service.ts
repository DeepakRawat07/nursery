import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'nursery.theme';
  private readonly themeState = signal<ThemeMode>('light');
  private initialized = false;

  readonly theme = this.themeState.asReadonly();
  readonly isDark = computed(() => this.themeState() === 'dark');

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    const storedTheme = this.readStoredTheme();
    const fallbackTheme = this.prefersDarkMode() ? 'dark' : 'light';
    this.applyTheme(storedTheme ?? fallbackTheme, false);
  }

  toggle() {
    this.applyTheme(this.isDark() ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode) {
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode, persist = true) {
    this.themeState.set(theme);

    const root = this.document?.documentElement;
    if (root) {
      root.classList.toggle('dark', theme === 'dark');
      root.dataset['theme'] = theme;
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private readStoredTheme(): ThemeMode | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const theme = localStorage.getItem(this.storageKey);
    return theme === 'dark' || theme === 'light' ? theme : null;
  }

  private prefersDarkMode() {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }
}
