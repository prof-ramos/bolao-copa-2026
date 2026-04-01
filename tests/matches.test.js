import { describe, it, expect } from 'vitest';
import MATCHES, { STADIUMS } from '../js/data/matches.js';

describe('Match Data', () => {
  it('should export an array of matches', () => {
    expect(Array.isArray(MATCHES)).toBe(true);
    expect(MATCHES.length).toBe(3);
  });

  it('each match should have required fields', () => {
    MATCHES.forEach(match => {
      expect(match.id).toBeTruthy();
      expect(match.phase).toBe('group');
      expect(match.group).toBe('C');
      expect(typeof match.round).toBe('number');
      expect(match.dateDisplay).toBeTruthy();
      expect(match.time).toBeTruthy();
      expect(match.home).toBeTruthy();
      expect(match.away).toBeTruthy();
      expect(match.stadium).toBeTruthy();
      expect(match.stadiumLocation).toBeTruthy();
    });
  });

  it('should have sequential match IDs', () => {
    expect(MATCHES[0].id).toBe('g1');
    expect(MATCHES[1].id).toBe('g2');
    expect(MATCHES[2].id).toBe('g3');
  });

  it('should have sequential rounds', () => {
    expect(MATCHES[0].round).toBe(1);
    expect(MATCHES[1].round).toBe(2);
    expect(MATCHES[2].round).toBe(3);
  });

  it('Brazil should be home in all matches', () => {
    MATCHES.forEach(match => {
      expect(match.home).toBe('BRA');
    });
  });

  it('should export stadiums data', () => {
    expect(STADIUMS).toBeDefined();
    expect(STADIUMS.metlife).toEqual({ name: 'MetLife Stadium', location: 'East Rutherford, NJ' });
    expect(STADIUMS.lincoln).toEqual({ name: 'Lincoln Financial Field', location: 'Filadélfia' });
    expect(STADIUMS.hardrock).toEqual({ name: 'Hard Rock Stadium', location: 'Miami, FL' });
  });
});
