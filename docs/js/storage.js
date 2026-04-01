/**
 * Storage abstraction layer for Bolão Brasil Copa 2026
 * @module storage
 */

const STORAGE_KEY = 'bolao_copa_2026_v3';
const SCHEMA_VERSION = 1;

/**
 * @typedef {Object} StorageData
 * @property {string} participantName - Participant's name
 * @property {Object.<string, {home: string, away: string}>} scores - Scores by match ID
 * @property {string} timestamp - ISO timestamp
 * @property {number} [version] - Schema version
 */

/**
 * Storage adapter interface
 * @interface StorageAdapter
 */
class StorageAdapter {
  get(key) {
    throw new Error('StorageAdapter.get must be implemented');
  }
  set(key, value) {
    throw new Error('StorageAdapter.set must be implemented');
  }
  remove(key) {
    throw new Error('StorageAdapter.remove must be implemented');
  }
}

/**
 * LocalStorage adapter
 * @extends StorageAdapter
 */
export class LocalStorageAdapter extends StorageAdapter {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('LocalStorageAdapter.get error:', e);
      return null;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('LocalStorageAdapter.set error:', e);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorageAdapter.remove error:', e);
      return false;
    }
  }
}

/**
 * SessionStorage adapter (fallback)
 * @extends StorageAdapter
 */
export class SessionStorageAdapter extends StorageAdapter {
  get(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error('SessionStorageAdapter.get error:', e);
      return null;
    }
  }

  set(key, value) {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error('SessionStorageAdapter.set error:', e);
      return false;
    }
  }

  remove(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('SessionStorageAdapter.remove error:', e);
      return false;
    }
  }
}

/**
 * Storage Manager class
 * Provides abstraction over browser storage with fallback support
 */
export class StorageManager {
  /**
   * @param {StorageAdapter} [adapter] - Storage adapter to use
   */
  constructor(adapter = null) {
    // Auto-detect best available storage
    if (adapter) {
      this.adapter = adapter;
    } else {
      this.adapter = this.detectBestAdapter();
    }
  }

  /**
   * Detect best available storage adapter
   * @returns {StorageAdapter}
   */
  detectBestAdapter() {
    // Try localStorage first
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return new LocalStorageAdapter();
    } catch (e) {
      // Fall back to sessionStorage
      try {
        const testKey = '__storage_test__';
        sessionStorage.setItem(testKey, testKey);
        sessionStorage.removeItem(testKey);
        return new SessionStorageAdapter();
      } catch (e2) {
        console.warn('No storage available');
        return null;
      }
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean}
   */
  isAvailable() {
    return this.adapter !== null;
  }

  /**
   * Get a value from storage
   * @param {string} key - Storage key
   * @returns {*} Parsed value or null
   */
  get(key) {
    if (!this.adapter) return null;
    
    const raw = this.adapter.get(key);
    if (!raw) return null;
    
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('StorageManager.get parse error:', e);
      return null;
    }
  }

  /**
   * Set a value in storage
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON serialized)
   * @returns {boolean} Success status
   */
  set(key, value) {
    if (!this.adapter) return false;
    
    try {
      const serialized = JSON.stringify(value);
      return this.adapter.set(key, serialized);
    } catch (e) {
      console.error('StorageManager.set error:', e);
      return false;
    }
  }

  /**
   * Remove a value from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  clear(key) {
    if (!this.adapter) return false;
    return this.adapter.remove(key);
  }

  /**
   * Save predictions to storage
   * @param {StorageData} data - Prediction data
   * @returns {boolean} Success status
   */
  savePredictions(data) {
    const payload = {
      ...data,
      version: SCHEMA_VERSION,
      timestamp: new Date().toISOString()
    };
    return this.set(STORAGE_KEY, payload);
  }

  /**
   * Load predictions from storage
   * @returns {StorageData|null} Stored predictions or null
   */
  loadPredictions() {
    const data = this.get(STORAGE_KEY);
    if (!data) return null;
    
    // Handle schema migration if needed
    if (data.version && data.version < SCHEMA_VERSION) {
      return this.migrate(data);
    }
    
    return data;
  }

  /**
   * Clear all stored predictions
   * @returns {boolean} Success status
   */
  clearPredictions() {
    return this.clear(STORAGE_KEY);
  }

  /**
   * Migrate data from older schema versions
   * @param {Object} data - Old data
   * @returns {Object} Migrated data
   */
  migrate(data) {
    // For now, just return the data
    // In the future, handle version-specific migrations
    return {
      ...data,
      version: SCHEMA_VERSION
    };
  }
}

// Export singleton instance for convenience
export const storage = new StorageManager();

export default StorageManager;
