import { Dimension, Question } from '../types.ts';
import { DEFAULT_OPTIONS } from '../data/defaultQuestions.ts';

// 3 Core Groups & Subdimensions
export const DIMENSION_METADATA: Record<
  Dimension,
  { name: string; englishKey: Dimension; subdimensions: string[] }
> = {
  grit: {
    name: 'Sự bền bỉ',
    englishKey: 'grit',
    subdimensions: ['Bền bỉ của hứng thú', 'Kiên trì nỗ lực'],
  },
  purpose: {
    name: 'Mục đích sống',
    englishKey: 'purpose',
    subdimensions: ['Khám phá định hướng', 'Cảm nhận ý nghĩa', 'Đóng góp cho người khác'],
  },
  self_control: {
    name: 'Tự kiểm soát',
    englishKey: 'self_control',
    subdimensions: ['Thực hiện nhiệm vụ', 'Lập kế hoạch', 'Điều chỉnh phản ứng'],
  },
};

/**
 * Generates sample CSV content structured across the 3 core dimensions
 */
export function generateSampleCsv(): string {
  const headers = ['STT', 'Nội dung câu hỏi', 'Nhóm', 'Phân nhóm', 'Đảo điểm (1: Có, 0: Không)', 'Tính điểm (1: Có, 0: Không)', 'Bắt buộc (1: Có, 0: Không)'];

  const rows = [
    // Nhóm 1: Sự bền bỉ (Grit)
    ['1', 'Em có một môn học hoặc hoạt động mà mình đã yêu thích trong thời gian dài.', 'Sự bền bỉ', 'Bền bỉ của hứng thú', '0', '1', '1'],
    ['2', 'Em vẫn quan tâm đến một hoạt động hoặc dự án dù nó không còn mới lạ như lúc bắt đầu.', 'Sự bền bỉ', 'Bền bỉ của hứng thú', '0', '1', '1'],
    ['3', 'Em thường bỏ một sở thích đang theo đuổi để chuyển sang sở thích mới.', 'Sự bền bỉ', 'Bền bỉ của hứng thú', '1', '1', '1'],
    ['4', 'Khi kết quả không như mong đợi, em thường thử lại hoặc tìm cách khác.', 'Sự bền bỉ', 'Kiên trì nỗ lực', '0', '1', '1'],

    // Nhóm 2: Mục đích sống (Purpose)
    ['5', 'Em có những điều trong cuộc sống mà mình cảm thấy thực sự quan trọng.', 'Mục đích sống', 'Cảm nhận ý nghĩa', '0', '1', '1'],
    ['6', 'Em thường suy nghĩ về người mà mình muốn trở thành trong tương lai.', 'Mục đích sống', 'Khám phá định hướng', '0', '1', '1'],
    ['7', 'Em chủ động tìm kiếm cơ hội làm những việc có ích cho gia đình, bạn bè hoặc cộng đồng.', 'Mục đích sống', 'Đóng góp cho người khác', '0', '1', '1'],

    // Nhóm 3: Tự kiểm soát (Self-Control)
    ['8', 'Khi có nhiệm vụ cần làm, em thường bắt đầu mà không trì hoãn quá lâu.', 'Tự kiểm soát', 'Thực hiện nhiệm vụ', '0', '1', '1'],
    ['9', 'Em thường bị cuốn vào việc khác khi đang làm một nhiệm vụ quan trọng.', 'Tự kiểm soát', 'Điều chỉnh phản ứng', '1', '1', '1'],
    ['10', 'Em tự thực hiện những việc đã lên kế hoạch ngay cả khi không có ai nhắc nhở.', 'Tự kiểm soát', 'Lập kế hoạch', '0', '1', '1'],
  ];

  const csvRows = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ];

  return '\uFEFF' + csvRows.join('\r\n');
}

/**
 * Downloads sample CSV file with UTF-8 BOM for Microsoft Excel compatibility
 */
export function downloadSampleCsvFile() {
  const content = generateSampleCsv();
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Mau_Cau_Hoi_3_Nhom_Hanh_Trinh.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Normalizes dimension string to valid Dimension key
 */
export function normalizeDimension(dimStr: string): Dimension {
  const lower = dimStr.trim().toLowerCase();
  if (lower.includes('bền bỉ') || lower.includes('grit')) return 'grit';
  if (lower.includes('mục đích') || lower.includes('purpose')) return 'purpose';
  if (lower.includes('kiểm soát') || lower.includes('self_control') || lower.includes('self control')) return 'self_control';
  return 'grit'; // fallback
}

/**
 * Parses CSV content into list of Question objects
 */
export function parseQuestionsCsv(csvText: string, currentMaxId: number): Question[] {
  // Remove BOM if present
  const clean = csvText.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse CSV line taking quotes into account
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const parsedQuestions: Question[] = [];
  let nextId = currentMaxId + 1;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (cols.length < 2) continue;

    const text = cols[1] || '';
    if (!text.trim()) continue;

    const dimStr = cols[2] || 'Sự bền bỉ';
    const dimension = normalizeDimension(dimStr);
    const subdimension = cols[3]?.trim() || DIMENSION_METADATA[dimension].subdimensions[0];

    const reverseStr = cols[4]?.trim().toLowerCase();
    const reverseScored = reverseStr === '1' || reverseStr === 'true' || reverseStr === 'có';

    const scoredStr = cols[5]?.trim().toLowerCase();
    const scored = scoredStr === undefined || scoredStr === '' || scoredStr === '1' || scoredStr === 'true' || scoredStr === 'có';

    const reqStr = cols[6]?.trim().toLowerCase();
    const required = reqStr === undefined || reqStr === '' || reqStr === '1' || reqStr === 'true' || reqStr === 'có';

    parsedQuestions.push({
      id: nextId++,
      order: parsedQuestions.length + 1,
      text: text.trim(),
      dimension,
      subdimension,
      options: DEFAULT_OPTIONS,
      required,
      scored,
      reverseScored,
      enabled: true,
    });
  }

  return parsedQuestions;
}
