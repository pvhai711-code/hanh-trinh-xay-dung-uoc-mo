// Client-side PDF export utility using html2pdf.js with bulletproof promise handling & memory cleanup

export interface PdfExportOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
}

/**
 * Generates and downloads a crisp PDF report client-side using html2pdf.js.
 * Strictly wrapped in a bulletproof Promise and try/catch/finally to guarantee
 * that under NO circumstances does the UI freeze or stay locked.
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

  // Clone element off-screen to safely render without disturbing the interactive UI
  let clone: HTMLElement | null = null;

  try {
    // Dynamically import html2pdf.js to ensure strict client-side evaluation
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

    clone = element.cloneNode(true) as HTMLElement;
    clone.classList.remove('hidden', 'print:block');
    clone.id = `${elementId}-export-clone`;

    // Off-screen layout for crisp capture
    clone.style.display = 'block';
    clone.style.position = 'fixed';
    clone.style.left = '-10000px';
    clone.style.top = '0';
    clone.style.width = '794px'; // Standard A4 width at 96 DPI
    clone.style.maxWidth = '794px';
    clone.style.minHeight = '1123px';
    clone.style.backgroundColor = '#ffffff';
    clone.style.zIndex = '-9999';
    clone.style.opacity = '1';
    clone.style.visibility = 'visible';

    document.body.appendChild(clone);

    // Allow short tick for any SVG elements or styling to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    const options = {
      margin: [10, 10, 10, 10], // top, left, bottom, right in mm
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
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

    // Execute html2pdf Promise pipeline with guaranteed timeout protection (max 15s)
    const pdfPromise = new Promise<boolean>((resolve, reject) => {
      try {
        html2pdf()
          .set(options)
          .from(clone)
          .toPdf()
          .get('pdf')
          .then(function (_pdf: any) {
            // Success in generating PDF, now save/download
            return html2pdf().set(options).from(clone).save();
          })
          .then(function () {
            resolve(true);
          })
          .catch(function (error: any) {
            console.error('[PDF Export Pipeline Error]:', error);
            reject(error);
          });
      } catch (err) {
        reject(err);
      }
    });

    // Race against a safety timeout so slow devices or dialog cancellation never hangs the browser
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('PDF Export Timeout - falling back to browser print')), 15000);
    });

    const result = await Promise.race([pdfPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn('[PDF Export] Encountered issue or cancellation, attempting graceful fallback:', error);
    try {
      window.print();
      return true;
    } catch (_) {
      return false;
    }
  } finally {
    // ⚠️ CRITICAL: Always clean up cloned DOM elements and release memory
    if (clone && clone.parentNode) {
      try {
        clone.parentNode.removeChild(clone);
      } catch (_) {}
    }
  }
}
