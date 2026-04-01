/**
 * Match data for Copa do Mundo 2026 - Group C
 * @module data/matches
 */

/**
 * @typedef {Object} Match
 * @property {string} id - Unique match identifier (e.g., 'g1', 'g2')
 * @property {string} phase - Phase of tournament ('group', 'round_16', etc.)
 * @property {string} group - Group letter (e.g., 'C')
 * @property {number} round - Round number within group
 * @property {string} dateDisplay - Display date string (e.g., 'Sáb, 13 Jun 2026')
 * @property {string} time - Match time (e.g., '19h')
 * @property {string} home - Home team code (e.g., 'BRA')
 * @property {string} away - Away team code (e.g., 'MAR')
 * @property {string} stadium - Stadium name
 * @property {string} stadiumLocation - Stadium city/location
 */

/**
 * Stadiums data
 * @type {Object.<string, {name: string, location: string}>}
 */
export const STADIUMS = {
  metlife: { name: 'MetLife Stadium', location: 'East Rutherford, NJ' },
  lincoln: { name: 'Lincoln Financial Field', location: 'Filadélfia' },
  hardrock: { name: 'Hard Rock Stadium', location: 'Miami, FL' }
};

/**
 * Match data for Group C - Brazil's group
 * @type {Match[]}
 */
const MATCHES = [
  {
    id: 'g1',
    phase: 'group',
    group: 'C',
    round: 1,
    dateDisplay: 'Sáb, 13 Jun 2026',
    time: '19h',
    home: 'BRA',
    away: 'MAR',
    stadium: STADIUMS.metlife.name,
    stadiumLocation: STADIUMS.metlife.location
  },
  {
    id: 'g2',
    phase: 'group',
    group: 'C',
    round: 2,
    dateDisplay: 'Sex, 19 Jun 2026',
    time: '22h',
    home: 'BRA',
    away: 'HAI',
    stadium: STADIUMS.lincoln.name,
    stadiumLocation: STADIUMS.lincoln.location
  },
  {
    id: 'g3',
    phase: 'group',
    group: 'C',
    round: 3,
    dateDisplay: 'Qua, 24 Jun 2026',
    time: '19h',
    home: 'BRA',
    away: 'SCO',
    stadium: STADIUMS.hardrock.name,
    stadiumLocation: STADIUMS.hardrock.location
  }
];

export default MATCHES;
