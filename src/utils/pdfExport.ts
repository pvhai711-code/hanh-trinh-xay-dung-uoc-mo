// Client-side PDF export utility using html2pdf.js with bulletproof promise handling & memory cleanup

export interface PdfExportOptions {
  filename?: string;
  margin?: number | [number, number] | [number, number, number, number];
}

/**
 * Generates and downloads a crisp PDF report client-side using html2pdf.js.
 * Strictly wrapped in setTimeout to yield to the browser main thread,
 * with pointer-events: none and full cleanup.
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
    // 1. Tách rời tiến trình với setTimeout để giải phóng Main Thread của trình duyệt
    await new Promise((resolve) => setTimeout(resolve, 120));

    // Dynamically import html2pdf.js to ensure strict client-side evaluation
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = (html2pdfModule.default || html2pdfModule) as any;

    clone = element.cloneNode(true) as HTMLElement;
    clone.classList.remove('hidden', 'print:block');
    clone.id = `${elementId}-export-clone`;

    // Off-screen layout for crisp capture - strictly pointer-events: none
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
    clone.style.pointerEvents = 'none';

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

    // 2. Chạy pipeline Promise chuẩn với cơ chế then / catch / finally
    const pdfPromise = new Promise<boolean>((resolve, reject) => {
      try {
        html2pdf()
          .set(options)
          .from(clone)
          .toPdf()
          .get('pdf')
          .then(function (_pdf: any) {
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

    // Timeout an toàn tối đa 12s
    const timeoutPromise = new Promise<boolean>((_, reject) => {
      setTimeout(() => reject(new Error('PDF Export Timeout')), 12000);
    });

    const result = await Promise.race([pdfPromise, timeoutPromise]);
    return result;
  } catch (error) {
    console.warn('[PDF Export] Gặp sự cố hoặc người dùng hủy, chuyển sang in trình duyệt:', error);
    try {
      window.print();
      return true;
    } catch (_) {
      return false;
    }
  } finally {
    // ⚠️ Xóa bỏ hoàn toàn phần tử clone khỏi DOM và giải phóng bộ nhớ
    if (clone && clone.parentNode) {
      try {
        clone.parentNode.removeChild(clone);
      } catch (_) {}
    }

    // Đảm bảo không còn bất kỳ overlay nào có pointerEvents = 'none' kẹt trên body hay html
    try {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    } catch (_) {}
  }
}
