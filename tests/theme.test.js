import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeManager, themeManager } from '../js/theme.js';

describe('ThemeManager', () => {
  let manager;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    
    // Create new instance for each test
    manager = new ThemeManager();
    
    // Reset document
    document.body.innerHTML = '';
  });

  describe('detectTheme', () => {
    it('should return saved theme if valid', () => {
      localStorage.setItem('bolao_theme', 'light');
      
      const theme = manager.detectTheme();
      expect(theme).toBe('light');
    });

    it('should fallback to system preference for invalid saved theme', () => {
      localStorage.setItem('bolao_theme', 'invalid');
      
      // With matchMedia returning false (not dark), it should return 'light'
      const theme = manager.detectTheme();
      expect(theme).toBe('light');
    });

    it('should detect system preference for dark mode', () => {
      localStorage.removeItem('bolao_theme');
      
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const newManager = new ThemeManager();
      expect(newManager.detectTheme()).toBe('dark');
    });

    it('should detect system preference for light mode', () => {
      localStorage.removeItem('bolao_theme');
      
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
      
      const newManager = new ThemeManager();
      expect(newManager.detectTheme()).toBe('light');
    });
  });

  describe('init', () => {
    it('should apply initial theme to root element', () => {
      const root = document.createElement('div');
      manager.init(root);
      
      expect(root.getAttribute('data-theme')).toBeDefined();
    });

    it('should save theme to localStorage', () => {
      const root = document.createElement('div');
      manager.init(root);
      
      const saved = localStorage.getItem('bolao_theme');
      expect(saved).toBeDefined();
    });

    it('should setup toggle button if present', () => {
      document.body.innerHTML = '<button data-theme-toggle></button>';
      const root = document.documentElement;
      
      manager.init(root);
      
      const toggleBtn = document.querySelector('[data-theme-toggle]');
      expect(toggleBtn).not.toBeNull();
    });
  });

  describe('applyTheme', () => {
    it('should set data-theme attribute', () => {
      const root = document.createElement('div');
      manager.rootElement = root;
      
      manager.applyTheme('dark');
      expect(root.getAttribute('data-theme')).toBe('dark');
      
      manager.applyTheme('light');
      expect(root.getAttribute('data-theme')).toBe('light');
    });

    it('should save theme to localStorage', () => {
      const root = document.createElement('div');
      manager.rootElement = root;
      
      manager.applyTheme('dark');
      expect(localStorage.getItem('bolao_theme')).toBe('dark');
    });

    it('should update currentTheme', () => {
      const root = document.createElement('div');
      manager.rootElement = root;
      
      manager.applyTheme('light');
      expect(manager.currentTheme).toBe('light');
    });
  });

  describe('toggle', () => {
    it('should switch from dark to light', () => {
      const root = document.createElement('div');
      manager.rootElement = root;
      manager.currentTheme = 'dark';
      
      manager.toggle();
      
      expect(manager.currentTheme).toBe('light');
    });

    it('should switch from light to dark', () => {
      const root = document.createElement('div');
      manager.rootElement = root;
      manager.currentTheme = 'light';
      
      manager.toggle();
      
      expect(manager.currentTheme).toBe('dark');
    });
  });

  describe('getTheme', () => {
    it('should return current theme', () => {
      manager.currentTheme = 'dark';
      expect(manager.getTheme()).toBe('dark');
      
      manager.currentTheme = 'light';
      expect(manager.getTheme()).toBe('light');
    });
  });

  describe('singleton', () => {
    it('should export a singleton instance', () => {
      expect(themeManager).toBeInstanceOf(ThemeManager);
    });
  });
});
