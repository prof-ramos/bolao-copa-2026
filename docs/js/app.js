/**
 * Main application module for Bolão Brasil Copa 2026
 * @module app
 */

import { StorageManager, storage } from './storage.js';
import { ThemeManager, themeManager } from './theme.js';
import { ShareManager, shareManager } from './share.js';
import { PrintManager, printManager } from './print.js';
import { ImageExporter, imageExporter } from './image.js';
import { MatchRenderer } from './render.js';
import MATCHES from './data/matches.js';

/**
 * Utility function: Debounce
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {number} [duration=2500] - Duration in ms
 */
function showToast(message, duration = 2500) {
  // Remove existing toasts
  document.querySelectorAll('.toast-notification').forEach(t => t.remove());
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), duration);
}

/**
 * BolaoApp class
 * Main application controller
 */
export class BolaoApp {
  constructor() {
    this.storage = storage;
    this.themeManager = themeManager;
    this.shareManager = shareManager;
    this.printManager = printManager;
    this.imageExporter = imageExporter;
    this.renderer = null;
    this.participantNameInput = null;
  }

  /**
   * Initialize the application
   */
  init() {
    // Initialize theme
    this.themeManager.init();
    
    // Setup participant name input
    this.participantNameInput = document.getElementById('participantName');
    
    // Render match cards dynamically
    const matchesContainer = document.getElementById('matches-container');
    if (matchesContainer) {
      this.renderer = new MatchRenderer(matchesContainer);
      this.renderer.renderMatches();
    }
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load data: URL first, then localStorage
    this.loadData();
    
    // Expose methods globally for button onclick handlers
    this.exposeGlobals();
    
    console.log('Bolão Brasil Copa 2026 initialized');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Score input listeners with auto-save
    const debouncedSave = debounce(() => this.saveData(), 800);
    
    document.querySelectorAll('.score-input').forEach(input => {
      // Validation on input
      input.addEventListener('input', (e) => {
        if (e.target.value.length > 2) {
          e.target.value = e.target.value.slice(-2);
        }
        if (parseInt(e.target.value) < 0) {
          e.target.value = 0;
        }
        if (parseInt(e.target.value) > 99) {
          e.target.value = 99;
        }
        debouncedSave();
      });
      
      // Select on focus
      input.addEventListener('focus', (e) => e.target.select());
    });
    
    // Participant name input
    if (this.participantNameInput) {
      this.participantNameInput.addEventListener('input', debouncedSave);
    }
  }

  /**
   * Load data from URL or localStorage
   */
  loadData() {
    // Try URL first
    const urlData = this.shareManager.loadFromURL();
    if (urlData) {
      this.restoreData(urlData);
      this.shareManager.clearURL();
      showToast('✓ Palpites carregados!');
      return;
    }
    
    // Fall back to localStorage
    const storedData = this.storage.loadPredictions();
    if (storedData) {
      this.restoreData(storedData);
      console.log('Palpites restaurados do localStorage');
    }
  }

  /**
   * Restore data to form
   * @param {Object} data - Data to restore
   */
  restoreData(data) {
    // Restore participant name
    if (data.participantName && this.participantNameInput) {
      this.participantNameInput.value = data.participantName;
    }
    
    // Restore scores
    if (data.scores) {
      Object.entries(data.scores).forEach(([gameId, teams]) => {
        // Only restore group stage matches (g1, g2, g3, etc.)
        if (!gameId.startsWith('g')) return;
        
        Object.entries(teams).forEach(([team, value]) => {
          const input = document.querySelector(`[data-game="${gameId}"][data-team="${team}"]`);
          if (input) {
            input.value = value;
          }
        });
      });
    }
  }

  /**
   * Collect form data
   * @returns {Object} Form data
   */
  collectData() {
    const data = {
      participantName: this.participantNameInput?.value || '',
      scores: {},
      timestamp: new Date().toISOString()
    };
    
    // Collect scores from all group stage matches
    document.querySelectorAll('.score-input').forEach(input => {
      const gameId = input.dataset.game;
      const team = input.dataset.team;
      
      // Only include group stage matches
      if (gameId && gameId.startsWith('g')) {
        if (!data.scores[gameId]) {
          data.scores[gameId] = {};
        }
        if (input.value) {
          data.scores[gameId][team] = input.value;
        }
      }
    });
    
    return data;
  }

  /**
   * Check if user has entered any predictions
   * @returns {boolean} True if has predictions
   */
  hasPredictions() {
    const data = this.collectData();
    const hasScores = Object.values(data.scores).some(game => game.home || game.away);
    return hasScores || (data.participantName && data.participantName.trim() !== '');
  }

  /**
   * Save data to localStorage
   * @param {boolean} [showToastMessage=true] - Whether to show toast
   */
  saveData(showToastMessage = true) {
    const data = this.collectData();
    this.storage.savePredictions(data);
    
    if (showToastMessage) {
      showToast('✓ Palpites salvos automaticamente');
    }
  }

  /**
   * Clear all predictions
   */
  clearAll() {
    if (!confirm('Apagar todos os palpites? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    // Clear score inputs
    document.querySelectorAll('.score-input').forEach(input => {
      input.value = '';
    });
    
    // Clear participant name
    if (this.participantNameInput) {
      this.participantNameInput.value = '';
    }
    
    // Clear storage
    this.storage.clearPredictions();
    
    showToast('✓ Palpites apagados com sucesso!');
  }

  /**
   * Export as image
   */
  async exportAsImage() {
    if (typeof html2canvas === 'undefined') {
      showToast('Erro: html2canvas não carregado');
      return;
    }
    
    const participantName = this.participantNameInput?.value || 'bolao';
    showToast('Gerando imagem...');
    
    try {
      await this.imageExporter.exportAsImage(participantName);
      showToast('✓ Imagem salva com sucesso!');
    } catch (e) {
      console.error('Error exporting image:', e);
      showToast('Erro ao gerar imagem');
    }
  }

  /**
   * Share predictions
   */
  async share() {
    if (!this.hasPredictions()) {
      showToast('⚠️ Preencha seus palpites primeiro!');
      return;
    }
    
    const data = this.collectData();
    const result = await this.shareManager.share(data);
    
    switch (result) {
      case 'shared':
        showToast('✓ Compartilhado com sucesso!');
        break;
      case 'copied':
        showToast('✓ Link copiado!');
        break;
      case 'error':
        showToast('Erro ao compartilhar');
        break;
    }
  }

  /**
   * Print the page
   */
  print() {
    this.printManager.print();
  }

  /**
   * Expose methods globally for onclick handlers
   */
  exposeGlobals() {
    window.bolaoApp = this;
    window.clearAll = () => this.clearAll();
    window.exportAsImage = () => this.exportAsImage();
    window.shareBolao = () => this.share();
    window.printBolao = () => this.print();
  }
}

// Create and initialize app when DOM is ready
let app = null;

function initApp() {
  app = new BolaoApp();
  app.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export default BolaoApp;
