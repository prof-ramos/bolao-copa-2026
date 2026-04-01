/**
 * Image export functionality for Bolão Brasil Copa 2026
 * @module image
 */

/**
 * ImageExporter class
 * Handles exporting the bolão as an image
 */
export class ImageExporter {
  /**
   * Export content element as image
   * @param {string} participantName - Participant name for filename
   * @returns {Promise<boolean>} Success status
   */
  async export(participantName = 'Bolão') {
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      throw new Error('html2canvas não está carregado');
    }
    
    const content = document.querySelector('.content');
    if (!content) {
      throw new Error('Elemento .content não encontrado');
    }
    
    try {
      // Get background color from CSS variable
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--color-bg').trim() || '#0d150d';
      
      // Generate canvas
      const canvas = await html2canvas(content, {
        backgroundColor: bgColor,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Generate filename
      const filename = this.generateFilename(participantName);
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      return true;
    } catch (e) {
      console.error('Error exporting image:', e);
      throw e;
    }
  }

  /**
   * Generate filename from participant name
   * @param {string} participantName - Participant's name
   * @returns {string} Sanitized filename
   */
  generateFilename(participantName = 'bolao') {
    const sanitized = participantName
      .replace(/\s+/g, '-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    return `bolao-copa-2026-${sanitized}.png`;
  }
}

// Export singleton instance
export const imageExporter = new ImageExporter();

export default ImageExporter;
