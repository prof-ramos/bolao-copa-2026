/**
 * Print functionality for Bolão Brasil Copa 2026
 * @module print
 */

/**
 * PrintManager class
 * Handles printing and export functionality
 */
export class PrintManager {
  /**
   * Trigger browser print dialog
   */
  print() {
    window.print();
  }

  /**
   * Export element as image using html2canvas
   * @param {HTMLElement} element - Element to capture
   * @param {string} filename - Filename for download
   * @returns {Promise<boolean>} Success status
   */
  async exportAsImage(element, filename = 'bolao-copa-2026.png') {
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      console.error('html2canvas not loaded');
      return false;
    }
    
    try {
      // Get background color from CSS variable
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--color-bg').trim() || '#0d150d';
      
      // Generate canvas
      const canvas = await html2canvas(element, {
        backgroundColor: bgColor,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      return true;
    } catch (e) {
      console.error('Error exporting image:', e);
      return false;
    }
  }

  /**
   * Generate filename from participant name
   * @param {string} participantName - Participant's name
   * @returns {string} Sanitized filename
   */
  generateFilename(participantName = 'bolao') {
    const sanitized = participantName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `bolao-copa-2026-${sanitized}.png`;
  }
}

// Export singleton instance
export const printManager = new PrintManager();

export default PrintManager;
