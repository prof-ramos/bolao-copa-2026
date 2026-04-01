/**
 * Theme management for Bolão Brasil Copa 2026
 * @module theme
 */

const THEME_KEY = 'bolao_theme';

/**
 * Theme icons
 */
const THEME_ICONS = {
  dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
};

/**
 * ThemeManager class
 * Handles theme toggling and persistence
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = this.detectTheme();
    this.toggleButton = null;
  }

  /**
   * Detect initial theme (saved preference or system preference)
   * @returns {string} Theme name
   */
  detectTheme() {
    // Check saved preference
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && (saved === 'dark' || saved === 'light')) {
      return saved;
    }
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'dark';
  }

  /**
   * Initialize theme on page load
   * @param {HTMLElement} rootElement - Root element to apply theme
   */
  init(rootElement = document.documentElement) {
    this.rootElement = rootElement;
    this.applyTheme(this.currentTheme);
    
    // Find and setup toggle button
    this.toggleButton = document.querySelector('[data-theme-toggle]');
    if (this.toggleButton) {
      this.updateButtonIcon();
      this.toggleButton.addEventListener('click', () => this.toggle());
    }
  }

  /**
   * Apply theme to document
   * @param {string} theme - Theme name ('dark' or 'light')
   */
  applyTheme(theme) {
    if (!this.rootElement) return;
    
    this.rootElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    this.currentTheme = theme;
    this.updateButtonIcon();
    
    // Update aria-pressed state
    if (this.toggleButton) {
      this.toggleButton.setAttribute('aria-pressed', theme === 'dark');
    }
  }

  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  /**
   * Update toggle button icon
   */
  updateButtonIcon() {
    if (!this.toggleButton) return;
    
    const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.toggleButton.innerHTML = THEME_ICONS[nextTheme];
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  getTheme() {
    return this.currentTheme;
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

export default ThemeManager;
