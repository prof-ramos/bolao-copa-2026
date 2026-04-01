import { describe, it, expect } from 'vitest';
import COUNTRIES from '../js/data/countries.js';

describe('Country Data', () => {
  it('should export an object with country codes as keys', () => {
    expect(typeof COUNTRIES).toBe('object');
    expect(COUNTRIES).not.toBeNull();
  });

  it('should have 4 countries', () => {
    expect(Object.keys(COUNTRIES).length).toBe(4);
  });

  it('should have Brazil', () => {
    expect(COUNTRIES.BRA).toEqual({ name: 'Brasil', code: 'BRA', flag: '🇧🇷' });
  });

  it('should have Morocco', () => {
    expect(COUNTRIES.MAR).toEqual({ name: 'Marrocos', code: 'MAR', flag: '🇲🇦' });
  });

  it('should have Haiti', () => {
    expect(COUNTRIES.HAI).toEqual({ name: 'Haiti', code: 'HAI', flag: '🇭🇹' });
  });

  it('should have Scotland', () => {
    expect(COUNTRIES.SCO).toEqual({ name: 'Escócia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' });
  });

  it('each country should have name, code, and flag', () => {
    Object.entries(COUNTRIES).forEach(([code, country]) => {
      expect(country.name).toBeTruthy();
      expect(country.code).toBe(code);
      expect(country.code.length).toBe(3);
      expect(country.flag).toBeTruthy();
    });
  });
});
