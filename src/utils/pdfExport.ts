import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads a high-fidelity PDF of the self-assessment report.
 * Works seamlessly inside iframes and standalone browsers without depending on blocked window.print().
 */
export async function exportReportToPdf(
  elementId: string,
  filename = 'Bao_Cao_Hanh_Trinh_Uoc_Mo.pdf'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  // Temporarily ensure the element is visible for capture if hidden
  const originalDisplay = element.style.display;
  const originalPosition = element.style.position;
  const originalLeft = element.style.left;
  const originalWidth = element.style.width;

  element.style.display = 'block';
  element.style.position = 'fixed';
  element.style.left = '0';
  element.style.top = '0';
  element.style.width = '794px'; // Standard A4 width in px at 96 DPI (approx 210mm)
  element.style.zIndex = '-9999';
  element.style.backgroundColor = '#ffffff';

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (300 DPI equivalent)
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Handle single or multi-page if height exceeds A4 (297mm)
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

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to window.print if html2canvas/jsPDF fails
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  } finally {
    // Restore element style
    element.style.display = originalDisplay;
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.width = originalWidth;
    element.style.zIndex = '';
  }
}
