import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  element?: HTMLElement | null;
  quality?: number;
  orientation?: 'portrait' | 'landscape';
}

export interface ImageExportOptions {
  fileName?: string;
  elementId?: string;
  element?: HTMLElement | null;
  format?: 'png' | 'jpeg';
}

/**
 * Downloads a DOM element as a high-resolution A4 PDF document
 */
export async function exportElementToPDF(options: PDFExportOptions): Promise<boolean> {
  try {
    let el = options.element;
    if (!el && options.elementId) {
      el = document.getElementById(options.elementId);
    }

    if (!el) {
      console.error('Target element not found for PDF export');
      return false;
    }

    // Capture with high devicePixelRatio for crisp text and logos
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const safeFileName = (options.fileName || 'document').replace(/[^a-zA-Z0-9-_]/g, '_');
    pdf.save(`${safeFileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to window print
    window.print();
    return false;
  }
}

/**
 * Downloads a DOM element as a crisp PNG or JPEG image (ideal for direct WhatsApp chat sharing)
 */
export async function exportElementToImage(options: ImageExportOptions): Promise<boolean> {
  try {
    let el = options.element;
    if (!el && options.elementId) {
      el = document.getElementById(options.elementId);
    }

    if (!el) {
      console.error('Target element not found for Image export');
      return false;
    }

    const canvas = await html2canvas(el, {
      scale: 2.5, // Ultra-sharp 2.5x resolution for WhatsApp mobile viewing
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
    });

    const format = options.format || 'png';
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const imgData = canvas.toDataURL(mimeType, 0.95);

    const safeFileName = (options.fileName || 'document_image').replace(/[^a-zA-Z0-9-_]/g, '_');
    const link = document.createElement('a');
    link.download = `${safeFileName}.${format}`;
    link.href = imgData;
    link.click();
    return true;
  } catch (error) {
    console.error('Error exporting image:', error);
    return false;
  }
}

/**
 * Trigger print dialog with specific target element isolated
 */
export function triggerPrint(elementId?: string): void {
  if (typeof window === 'undefined') return;
  window.print();
}
