/**
 * URL sharing functionality for Bolão Brasil Copa 2026
 * @module share
 */

/**
 * @typedef {Object} ShareData
 * @property {string} participantName - Participant's name
 * @property {Object.<string, {home: string, away: string}>} scores - Scores by match ID
 */

/**
 * ShareManager class
 * Handles encoding/decoding prediction data to/from URLs
 */
export class ShareManager {
  /**
   * Encode data to URL-safe string
   * Uses LZString if available, otherwise base64
   * @param {ShareData} data - Data to encode
   * @returns {string} Encoded string
   */
  encode(data) {
    const jsonString = JSON.stringify(data);
    
    // Use LZString for better compression if available
    if (typeof LZString !== 'undefined') {
      return LZString.compressToEncodedURIComponent(jsonString);
    }
    
    // Fallback to base64
    try {
      return btoa(jsonString);
    } catch (e) {
      // Handle Unicode
      return btoa(unescape(encodeURIComponent(jsonString)));
    }
  }

  /**
   * Decode data from URL-safe string
   * @param {string} encoded - Encoded string
   * @returns {ShareData|null} Decoded data or null on error
   */
  decode(encoded) {
    if (!encoded) return null;
    
    try {
      let jsonString;
      
      // Try LZString first
      if (typeof LZString !== 'undefined') {
        jsonString = LZString.decompressFromEncodedURIComponent(encoded);
        if (jsonString) {
          return JSON.parse(jsonString);
        }
      }
      
      // Fallback to base64
      jsonString = atob(encoded);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('ShareManager.decode error:', e);
      return null;
    }
  }

  /**
   * Generate shareable URL with prediction data
   * @param {ShareData} data - Prediction data
   * @returns {string} Full URL with encoded data
   */
  generateShareableLink(data) {
    const encoded = this.encode(data);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?data=${encoded}`;
  }

  /**
   * Load data from current URL
   * @returns {ShareData|null} Decoded data from URL or null
   */
  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    
    if (!dataParam) return null;
    
    return this.decode(dataParam);
  }

  /**
   * Clear data parameter from URL
   * Uses replaceState to avoid adding to history
   */
  clearURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete('data');
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    // Try modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.error('Clipboard API error:', e);
      }
    }
    
    // Fallback for older browsers
    return this.fallbackCopyToClipboard(text);
  }

  /**
   * Fallback copy method using textarea
   * @param {string} text - Text to copy
   * @returns {boolean} Success status
   */
  fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    
    try {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (e) {
      console.error('Fallback copy error:', e);
      document.body.removeChild(textarea);
      return false;
    }
  }

  /**
   * Share via Web Share API if available, otherwise copy to clipboard
   * @param {ShareData} data - Prediction data
   * @returns {Promise<'shared'|'copied'|'error'>} Result status
   */
  async share(data) {
    const shareableLink = this.generateShareableLink(data);
    
    // Prepare share data
    const shareData = {
      title: 'Bolão Brasil - Copa 2026',
      text: 'Confira meus palpites para a Copa do Mundo 2026!',
      url: shareableLink
    };
    
    // Try native share API (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return 'shared';
      } catch (err) {
        // User cancelled or error
        if (err.name === 'AbortError') {
          return 'error';
        }
        // Fall through to clipboard
      }
    }
    
    // Fallback to clipboard
    const copied = await this.copyToClipboard(shareableLink);
    return copied ? 'copied' : 'error';
  }
}

// Export singleton instance
export const shareManager = new ShareManager();

export default ShareManager;
