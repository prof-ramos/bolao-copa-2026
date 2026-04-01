import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager, LocalStorageAdapter, SessionStorageAdapter } from '../js/storage.js';

describe('StorageManager', () => {
  let storage;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storage = new StorageManager();
  });

  it('should support localStorage', () => {
    expect(storage.isAvailable()).toBe(true);
  });

  it('should support sessionStorage', () => {
    const sessionStorage = new StorageManager(new SessionStorageAdapter());
    expect(sessionStorage.isAvailable()).toBe(true);
  });

  it('should save and load data', () => {
    const data = {
      participantName: 'John Doe',
      scores: {
        g1: { home: '2', away: '1' },
        g2: { home: '3', away: '0' }
      }
    };
    
    storage.savePredictions(data);
    
    const loaded = storage.loadPredictions();
    expect(loaded).toMatchObject(data);
  });

  it('should clear data', () => {
    storage.savePredictions({ participantName: 'Test', scores: {} });
    storage.clearPredictions();
    
    const loaded = storage.loadPredictions();
    expect(loaded).toBeNull();
  });

  it('should handle null/undefined values', () => {
    storage.savePredictions(null);
    const loaded = storage.loadPredictions();
    
    // Should have saved something even with null input
    expect(loaded).not.toBeNull();
  });

  it('should handle missing properties', () => {
    storage.savePredictions({});
    const loaded = storage.loadPredictions();
    
    expect(loaded).toHaveProperty('version');
    expect(loaded).toHaveProperty('timestamp');
  });
});
