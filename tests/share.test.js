import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShareManager, shareManager } from '../js/share.js';

describe('ShareManager', () => {
  let manager;

  beforeEach(() => {
    manager = new ShareManager();
    // Mock window.location
    delete window.location;
    window.location = {
      origin: 'https://example.com',
      pathname: '/bolao/',
      search: '',
      href: 'https://example.com/bolao/',
    };
    // Mock history
    window.history.replaceState = vi.fn();
    // Mock document
    document.body.innerHTML = '';
  });

  describe('encode', () => {
    it('should encode simple data', () => {
      const data = {
        participantName: 'Test User',
        scores: { g1: { home: '2', away: '1' } }
      };
      
      const encoded = manager.encode(data);
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
    });

    it('should encode empty data', () => {
      const data = {};
      const encoded = manager.encode(data);
      expect(typeof encoded).toBe('string');
    });

    it('should handle special characters in participant name', () => {
      const data = {
        participantName: 'José da Silva',
        scores: {}
      };
      
      const encoded = manager.encode(data);
      expect(typeof encoded).toBe('string');
    });

    it('should handle emoji in participant name', () => {
      const data = {
        participantName: 'User 🇧🇷',
        scores: {}
      };
      
      const encoded = manager.encode(data);
      expect(typeof encoded).toBe('string');
    });
  });

  describe('decode', () => {
    it('should decode encoded data', () => {
      const data = {
        participantName: 'Test User',
        scores: { g1: { home: '2', away: '1' } }
      };
      
      const encoded = manager.encode(data);
      const decoded = manager.decode(encoded);
      
      expect(decoded).toEqual(data);
    });

    it('should return null for empty input', () => {
      expect(manager.decode('')).toBeNull();
      expect(manager.decode(null)).toBeNull();
      expect(manager.decode(undefined)).toBeNull();
    });

    it('should return null for invalid input', () => {
      expect(manager.decode('not-valid-base64!@#')).toBeNull();
    });

    it('should handle round-trip with complex data', () => {
      const data = {
        participantName: 'Complex User',
        scores: {
          g1: { home: '3', away: '1' },
          g2: { home: '2', away: '2' },
          g3: { home: '1', away: '0' }
        }
      };
      
      const encoded = manager.encode(data);
      const decoded = manager.decode(encoded);
      
      expect(decoded).toEqual(data);
    });
  });

  describe('generateShareableLink', () => {
    it('should generate URL with encoded data', () => {
      const data = {
        participantName: 'Test',
        scores: { g1: { home: '1', away: '0' } }
      };
      
      const link = manager.generateShareableLink(data);
      
      expect(link).toContain('https://example.com/bolao/');
      expect(link).toContain('?data=');
    });
  });

  describe('loadFromURL', () => {
    it('should return null when no data param', () => {
      window.location.search = '';
      
      const result = manager.loadFromURL();
      expect(result).toBeNull();
    });

    it('should decode data from URL', () => {
      const data = {
        participantName: 'URL User',
        scores: { g1: { home: '2', away: '1' } }
      };
      
      const encoded = manager.encode(data);
      window.location.search = `?data=${encoded}`;
      
      const result = manager.loadFromURL();
      expect(result).toEqual(data);
    });
  });

  describe('clearURL', () => {
    it('should remove data param from URL', () => {
      manager.clearURL();
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe('copyToClipboard', () => {
    it('should return true on successful copy', async () => {
      navigator.clipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      };
      
      const result = await manager.copyToClipboard('test text');
      expect(result).toBe(true);
    });

    it('should fallback when clipboard API fails', async () => {
      navigator.clipboard = {
        writeText: vi.fn().mockRejectedValue(new Error('Not allowed'))
      };
      
      const result = await manager.copyToClipboard('test text');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('share', () => {
    it('should return shared when native share succeeds', async () => {
      navigator.share = vi.fn().mockResolvedValue(undefined);
      navigator.canShare = vi.fn().mockReturnValue(true);
      
      const data = { participantName: 'Test', scores: {} };
      const result = await manager.share(data);
      
      expect(result).toBe('shared');
    });

    it('should return copied when native share not available', async () => {
      delete navigator.share;
      navigator.clipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      };
      
      const data = { participantName: 'Test', scores: {} };
      const result = await manager.share(data);
      
      expect(result).toBe('copied');
    });
  });

  describe('singleton', () => {
    it('should export a singleton instance', () => {
      expect(shareManager).toBeInstanceOf(ShareManager);
    });
  });
});
