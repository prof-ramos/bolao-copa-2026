/**
 * Countries data for Copa do Mundo 2026
 * @module data/countries
 */

/**
 * @typedef {Object} Country
 * @property {string} name - Country name in Portuguese
 * @property {string} code - 3-letter country code
 * @property {string} flag - Emoji flag
 */

/**
 * Countries participating in the pool
 * @type {Object.<string, Country>}
 */
const COUNTRIES = {
  BRA: { name: 'Brasil', code: 'BRA', flag: '🇧🇷' },
  MAR: { name: 'Marrocos', code: 'MAR', flag: '🇲🇦' },
  HAI: { name: 'Haiti', code: 'HAI', flag: '🇭🇹' },
  SCO: { name: 'Escócia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }
};

export default COUNTRIES;
