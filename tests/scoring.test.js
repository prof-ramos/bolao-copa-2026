import { describe, it, expect } from 'vitest';
import SCORING, { getOutcome, calculatePoints, calculateMaxPoints } from '../js/data/scoring.js';

describe('Scoring Rules', () => {
  it('should export correct point values', () => {
    expect(SCORING.correctResult).toBe(1);
    expect(SCORING.exactScore).toBe(3);
  });

  describe('getOutcome', () => {
    it('returns WIN when home scores more', () => {
      expect(getOutcome(2, 1)).toBe('WIN');
      expect(getOutcome(1, 0)).toBe('WIN');
      expect(getOutcome(5, 3)).toBe('WIN');
    });

    it('returns LOSS when away scores more', () => {
      expect(getOutcome(1, 2)).toBe('LOSS');
      expect(getOutcome(0, 1)).toBe('LOSS');
    });

    it('returns DRAW when scores are equal', () => {
      expect(getOutcome(0, 0)).toBe('DRAW');
      expect(getOutcome(1, 1)).toBe('DRAW');
      expect(getOutcome(3, 3)).toBe('DRAW');
    });

    it('returns null for null/undefined inputs', () => {
      expect(getOutcome(null, 1)).toBeNull();
      expect(getOutcome(1, null)).toBeNull();
      expect(getOutcome(undefined, 1)).toBeNull();
      expect(getOutcome(1, undefined)).toBeNull();
      expect(getOutcome(null, null)).toBeNull();
    });
  });

  describe('calculatePoints', () => {
    it('returns 3 for exact score', () => {
      expect(calculatePoints({ home: 2, away: 1 }, { home: 2, away: 1 })).toBe(3);
      expect(calculatePoints({ home: 0, away: 0 }, { home: 0, away: 0 })).toBe(3);
    });

    it('returns 1 for correct result (win)', () => {
      expect(calculatePoints({ home: 3, away: 0 }, { home: 2, away: 1 })).toBe(1);
      expect(calculatePoints({ home: 1, away: 0 }, { home: 3, away: 2 })).toBe(1);
    });

    it('returns 1 for correct result (draw)', () => {
      expect(calculatePoints({ home: 2, away: 2 }, { home: 1, away: 1 })).toBe(1);
    });

    it('returns 1 for correct result (loss)', () => {
      expect(calculatePoints({ home: 0, away: 2 }, { home: 1, away: 3 })).toBe(1);
    });

    it('returns 0 for wrong result', () => {
      expect(calculatePoints({ home: 2, away: 1 }, { home: 0, away: 2 })).toBe(0);
      expect(calculatePoints({ home: 0, away: 1 }, { home: 2, away: 0 })).toBe(0);
    });
  });

  describe('calculateMaxPoints', () => {
    it('calculates max points correctly', () => {
      expect(calculateMaxPoints(3)).toBe(9);
      expect(calculateMaxPoints(1)).toBe(3);
      expect(calculateMaxPoints(10)).toBe(30);
      expect(calculateMaxPoints(0)).toBe(0);
    });
  });
});
