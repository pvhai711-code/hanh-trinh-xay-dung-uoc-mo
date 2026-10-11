// Client-side PDF export utility using html2pdf.js

export interface PdfExportOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
}

/**
 * Generates and downloads a crisp PDF report client-side using html2pdf.js.
 * Correctly renders hidden/off-screen report elements on Vercel and standard browsers
 * without clipping, blank pages, or reliance on server-side rendering.
 */
export async function exportReportToPdf(
  elementId: string,
  filename = 'Bao_Cao_Hanh_Trinh_Uoc_Mo.pdf'
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`[PDF Export] Element with id "${elementId}" not found in DOM.`);
    return false;
  }

  // Dynamically import html2pdf.js to ensure strict client-side evaluation
  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

  // Clone element to safely render off-screen without interfering with original DOM or layout
  const clone = element.cloneNode(true) as HTMLElement;

  // Strip print-only / hidden classes that might prevent html2canvas from rendering content
  clone.classList.remove('hidden', 'print:block');
  clone.id = `${elementId}-export-clone`;

  // Apply explicit styling for crisp A4 capture
  clone.style.display = 'block';
  clone.style.position = 'fixed';
  clone.style.left = '-10000px';
  clone.style.top = '0';
  clone.style.width = '794px'; // Standard A4 width at 96 DPI
  clone.style.maxWidth = '794px';
  clone.style.minHeight = '1123px'; // Standard A4 height
  clone.style.backgroundColor = '#ffffff';
  clone.style.zIndex = '-9999';
  clone.style.opacity = '1';
  clone.style.visibility = 'visible';

  document.body.appendChild(clone);

  // Allow short tick for any fonts or SVG gradients to settle in the clone
  await new Promise((resolve) => setTimeout(resolve, 150));

  const options = {
    margin: [10, 10, 10, 10], // top, left, bottom, right in mm
    filename: filename,
    image: {
      type: 'jpeg',
      quality: 0.98,
    },
    html2canvas: {
      scale: 2, // 2x scale for crisp print resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollY: 0,
      scrollX: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
    },
  };

  try {
    await html2pdf().set(options).from(clone).save();
    return true;
  } catch (error) {
    console.error('[PDF Export] html2pdf failed:', error);
    // Graceful fallback to browser print if available
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  } finally {
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
