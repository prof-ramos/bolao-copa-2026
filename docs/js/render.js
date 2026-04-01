/**
 * Dynamic rendering for Bolão Brasil Copa 2026
 * @module render
 */

import COUNTRIES from './data/countries.js';
import MATCHES from './data/matches.js';
import SCORING, { calculateMaxPoints } from './data/scoring.js';

/**
 * MatchRenderer class
 * Renders match cards dynamically from data
 */
export class MatchRenderer {
  /**
   * @param {HTMLElement} container - Container to render matches into
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * Render all matches
   * @param {Object[]} [matches] - Matches to render (defaults to all)
   */
  renderMatches(matches = MATCHES) {
    if (!this.container) {
      console.error('MatchRenderer: No container provided');
      return;
    }
    
    const html = matches.map(match => this.renderMatchCard(match)).join('');
    this.container.innerHTML = html;
  }

  /**
   * Render single match card
   * @param {Object} match - Match data
   * @returns {string} HTML string
   */
  renderMatchCard(match) {
    const homeTeam = COUNTRIES[match.home];
    const awayTeam = COUNTRIES[match.away];
    
    if (!homeTeam || !awayTeam) {
      console.error(`Match ${match.id}: Invalid team code`);
      return '';
    }
    
    const homeTeamClass = match.home === 'BRA' ? 'brazil' : '';
    
    return `
      <article class="match-card" id="${match.id}" aria-labelledby="${match.id}-title">
        <h3 id="${match.id}-title" class="visually-hidden">${homeTeam.name} vs ${awayTeam.name} - ${match.dateDisplay}</h3>
        <div class="match-meta">
          <div class="match-date">
            <span>${match.dateDisplay}</span>
            <span class="dot" aria-hidden="true">●</span>
            <span>${match.time}</span>
          </div>
          <span class="match-stage">Grupo ${match.group} · Rodada ${match.round}</span>
        </div>
        <fieldset class="score-row">
          <legend class="visually-hidden">Palpite para ${homeTeam.name} vs ${awayTeam.name}</legend>
          <div class="team">
            <span class="team-flag" aria-hidden="true">${homeTeam.flag}</span>
            <span class="team-name ${homeTeamClass}">${homeTeam.name}</span>
          </div>
          <div class="vs-block">
            <div class="score-inputs">
              <label for="${match.id}-home" class="visually-hidden">Gols do ${homeTeam.name}</label>
              <input type="number" id="${match.id}-home" class="score-input" min="0" max="99" placeholder="–" data-team="home" data-game="${match.id}" aria-label="Gols do ${homeTeam.name}">
              <span class="score-separator" aria-hidden="true">×</span>
              <label for="${match.id}-away" class="visually-hidden">Gols do ${awayTeam.name}</label>
              <input type="number" id="${match.id}-away" class="score-input" min="0" max="99" placeholder="–" data-team="away" data-game="${match.id}" aria-label="Gols do ${awayTeam.name}">
            </div>
            <span class="vs-label">Seu palpite</span>
          </div>
          <div class="team">
            <span class="team-flag" aria-hidden="true">${awayTeam.flag}</span>
            <span class="team-name">${awayTeam.name}</span>
          </div>
        </fieldset>
        <div class="stadium-info">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${match.stadium} · ${match.stadiumLocation}</span>
        </div>
      </article>
    `;
  }

  /**
   * Render points section
   * @param {HTMLElement} container - Container element
   * @param {number} matchCount - Number of matches
   */
  renderPointsSection(container, matchCount = MATCHES.length) {
    if (!container) return;
    
    const maxPoints = calculateMaxPoints(matchCount);
    
    container.innerHTML = `
      <div class="points-section">
        <p class="points-title">Tabela de Pontos</p>
        <div class="points-grid">
          <div class="points-item"><span class="points-label">Resultado correto (V/E/D)</span><span class="points-val">${SCORING.correctResult} pt</span></div>
          <div class="points-item"><span class="points-label">Placar exato</span><span class="points-val">${SCORING.exactScore} pts</span></div>
        </div>
        <div class="total-bar">
          <span class="total-label">Pontos Possíveis</span>
          <span class="total-score">${maxPoints} pts</span>
        </div>
      </div>
    `;
  }
}

/**
 * PointsRenderer class
 * Renders points and scoring information
 */
export class PointsRenderer {
  /**
   * Render total score display
   * @param {HTMLElement} container - Container element
   * @param {number} score - Current score
   */
  renderTotalScore(container, score) {
    if (!container) return;
    
    const scoreEl = container.querySelector('.total-score');
    if (scoreEl) {
      scoreEl.textContent = `${score} pts`;
    }
  }
}

export default MatchRenderer;
