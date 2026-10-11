import React, { useState } from 'react';
import { Question, Dimension } from '../types.ts';
import { DEFAULT_OPTIONS } from '../data/defaultQuestions.ts';
import {
  DIMENSION_METADATA,
  downloadSampleCsvFile,
  parseQuestionsCsv,
} from '../utils/fileTemplate.ts';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  RotateCcw,
  LogOut,
  Save,
  Eye,
  AlertTriangle,
  Edit2,
  X,
  FileSpreadsheet,
  HelpCircle,
  CheckCircle2,
  FolderUp,
} from 'lucide-react';

interface AdminDashboardProps {
  questions: Question[];
  authToken: string;
  onSaveQuestions: (updated: Question[]) => Promise<void>;
  onRestoreDefaults: () => Promise<void>;
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  onSaveQuestions,
  onRestoreDefaults,
  onLogout,
  onClose,
}) => {
  const [list, setList] = useState<Question[]>(questions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [importedPreview, setImportedPreview] = useState<{
    questions: Question[];
    filename: string;
  } | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const updated = [...list];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((q, idx) => ({ ...q, order: idx + 1 }));
    setList(reordered);
  };

  const handleDelete = (id: number) => {
    const updated = list
      .filter((q) => q.id !== id)
      .map((q, idx) => ({ ...q, order: idx + 1 }));
    setList(updated);
    setDeleteConfirmId(null);
    setStatusMsg({ type: 'success', text: 'Đã xóa câu hỏi thành công' });
  };

  const handleDuplicate = (q: Question) => {
    const newId = Math.max(0, ...list.map((item) => item.id)) + 1;
    const duplicated: Question = {
      ...q,
      id: newId,
      order: list.length + 1,
      text: `${q.text} (Bản sao)`,
    };
    setList([...list, duplicated]);
    setStatusMsg({ type: 'success', text: 'Đã sao chép câu hỏi' });
  };

  const handleAddNewSingle = () => {
    const newId = Math.max(0, ...list.map((item) => item.id)) + 1;
    const newQ: Question = {
      id: newId,
      order: list.length + 1,
      text: 'Nội dung câu hỏi mới...',
      dimension: 'grit',
      subdimension: 'Bền bỉ của hứng thú',
      options: DEFAULT_OPTIONS,
      required: true,
      scored: true,
      reverseScored: false,
      enabled: true,
    };
    setList([...list, newQ]);
    setEditingQuestion(newQ);
  };

  const handleSaveEdit = (updatedQ: Question) => {
    const updated = list.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    setList(updated);
    setEditingQuestion(null);
    setStatusMsg({ type: 'success', text: 'Đã cập nhật câu hỏi' });
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      await onSaveQuestions(list);
      setStatusMsg({ type: 'success', text: 'Đã lưu và đồng bộ cấu hình câu hỏi thành công!' });
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi khi lưu cấu hình lên máy chủ' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cau_hoi_hanh_trinh_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        let parsed: Question[] = [];
        if (file.name.endsWith('.json')) {
          const raw = JSON.parse(text);
          if (Array.isArray(raw)) {
            parsed = raw.map((q, idx) => ({
              ...q,
              id: q.id || idx + 1,
              order: idx + 1,
              options: q.options || DEFAULT_OPTIONS,
            }));
          }
        } else {
          // Parse CSV
          const maxId = Math.max(0, ...list.map((item) => item.id));
          parsed = parseQuestionsCsv(text, maxId);
        }

        if (parsed.length > 0) {
          setImportedPreview({ questions: parsed, filename: file.name });
        } else {
          setStatusMsg({ type: 'error', text: 'Không tìm thấy câu hỏi hợp lệ trong tệp' });
        }
      } catch (err) {
        console.error(err);
        setStatusMsg({ type: 'error', text: 'Tệp không đúng định dạng chuẩn. Vui lòng xem hướng dẫn.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleApplyImport = (mode: 'append' | 'replace') => {
    if (!importedPreview) return;
    let nextList: Question[] = [];
    if (mode === 'replace') {
      nextList = importedPreview.questions.map((q, i) => ({ ...q, order: i + 1 }));
      setStatusMsg({
        type: 'success',
        text: `Đã thay thế toàn bộ bằng ${nextList.length} câu hỏi mới từ tệp!`,
      });
    } else {
      let curMaxId = Math.max(0, ...list.map((item) => item.id));
      const appended = importedPreview.questions.map((q) => ({
        ...q,
        id: ++curMaxId,
        order: list.length + 1,
      }));
      nextList = [...list, ...appended].map((q, i) => ({ ...q, order: i + 1 }));
      setStatusMsg({
        type: 'success',
        text: `Đã thêm thành công ${appended.length} câu hỏi từ tệp vào danh sách!`,
      });
    }
    setList(nextList);
    setImportedPreview(null);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fbf9f5] overflow-hidden text-slate-800 font-serif">
      {/* Top Header: Xanh đậm #0a6962 */}
      <header className="flex items-center justify-between px-5 sm:px-8 py-3.5 bg-[#0a6962] text-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm sm:text-base tracking-wider uppercase">
            QUẢN TRỊ VIÊN — HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
          </span>
          <span className="text-xs bg-[#08554f] text-[#fed285] px-2.5 py-0.5 rounded-2xl font-sans border border-[#08554f]/50">
            {list.length} câu hỏi
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToServer}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white font-bold text-xs transition-all shadow-sm disabled:opacity-60 cursor-pointer bouncy border border-orange-400/40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-[#08554f] hover:bg-[#06443f] text-white text-xs transition-all cursor-pointer bouncy shadow-xs"
            title="Quay lại khảo sát"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem khảo sát</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white text-xs transition-all cursor-pointer bouncy shadow-xs"
            title="Đăng xuất"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Action Bar: 2 methods parallel (Single entry & File Upload) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-[#fdfdfd] border-b border-slate-200/90 shrink-0 text-xs">
        {/* Nhóm Thao tác Thêm câu hỏi song song: rounded-2xl, bouncy */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Cách 1: Nhập từng câu */}
          <button
            type="button"
            onClick={handleAddNewSingle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#0a6962] hover:bg-[#08554f] text-white font-bold shadow-xs cursor-pointer bouncy"
            title="Nhập từng câu thủ công"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm 1 câu hỏi</span>
          </button>

          {/* Cách 2: Tải lên cả file câu hỏi */}
          <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white font-bold shadow-xs cursor-pointer bouncy border border-orange-400/30">
            <FolderUp className="w-3.5 h-3.5" />
            <span>Tải lên file câu hỏi</span>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Nút tải file mẫu theo 3 nhóm */}
          <button
            type="button"
            onClick={downloadSampleCsvFile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border border-[#0a6962]/30 text-[#0a6962] bg-[#edf6f5] hover:bg-[#e0f0ee] font-bold transition-all cursor-pointer bouncy shadow-xs"
            title="Tải tệp Excel/CSV mẫu theo 3 nhóm tính năng"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#0a6962]" />
            <span>Tải file mẫu (3 nhóm)</span>
          </button>

          {/* Nút hướng dẫn */}
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer bouncy shadow-xs font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0a6962]" />
            <span>Hướng dẫn file</span>
          </button>
        </div>

        {/* Các nút phụ trợ: Khôi phục & Xuất */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer bouncy shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all cursor-pointer bouncy shadow-xs font-semibold"
            title="Khôi phục lại 24 câu hỏi ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>
        </div>
      </div>

      {/* Thông báo trạng thái */}
      {statusMsg && (
        <div
          className={`mx-6 mt-2 px-4 py-2 rounded-2xl text-xs flex items-center justify-between shadow-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bảng Danh sách câu hỏi */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-[#fdfdfd] rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f4f1ea] border-b border-slate-200 text-[#0a6962] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-12 text-center">STT</th>
                <th className="py-2.5 px-4">Nội dung câu hỏi</th>
                <th className="py-2.5 px-3 w-32">Nhóm</th>
                <th className="py-2.5 px-3 w-40">Phân nhóm</th>
                <th className="py-2.5 px-2 w-20 text-center">Đảo điểm</th>
                <th className="py-2.5 px-2 w-20 text-center">Tính điểm</th>
                <th className="py-2.5 px-4 w-36 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((q, idx) => {
                let dimBadge = 'bg-[#fff5f5] text-rose-800 border-rose-200';
                let dimLabel = 'Sự bền bỉ';
                if (q.dimension === 'purpose') {
                  dimBadge = 'bg-[#edf6f5] text-[#0a6962] border-[#0a6962]/20';
                  dimLabel = 'Mục đích sống';
                } else if (q.dimension === 'self_control') {
                  dimBadge = 'bg-[#fff8f0] text-[#b35700] border-[#ff7c00]/25';
                  dimLabel = 'Tự kiểm soát';
                }

                return (
                  <tr key={q.id} className="hover:bg-[#faf9f4] transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900 leading-snug">
                      {q.text}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-2xl font-bold border shadow-xs ${dimBadge}`}>
                        {dimLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {q.subdimension}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {q.reverseScored ? (
                        <span className="px-2 py-0.5 bg-[#fff4ea] text-[#b35700] font-bold rounded-2xl border border-[#ff7c00]/30 shadow-xs">
                          Có (6-đ)
                        </span>
                      ) : (
                        <span className="text-slate-400">Không</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {q.scored ? (
                        <span className="text-[#0a6962] font-bold">✓</span>
                      ) : (
                        <span className="text-slate-400">✕</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          title="Di chuyển lên"
                          className="p-1 hover:text-[#0a6962] disabled:opacity-30 cursor-pointer bouncy-tap"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === list.length - 1}
                          title="Di chuyển xuống"
                          className="p-1 hover:text-[#0a6962] disabled:opacity-30 cursor-pointer bouncy-tap"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingQuestion(q)}
                          title="Chỉnh sửa câu hỏi này"
                          className="p-1 hover:text-[#0a6962] cursor-pointer bouncy-tap"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(q)}
                          title="Nhân bản câu này"
                          className="p-1 hover:text-[#0a6962] cursor-pointer bouncy-tap"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(q.id)}
                          title="Xóa câu hỏi"
                          className="p-1 hover:text-rose-600 cursor-pointer bouncy-tap"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: HƯỚNG DẪN CẤU TRÚC FILE VÀ 3 NHÓM CHỨC NĂNG */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-[#fdfdfd] p-6 shadow-2xl border border-[#0a6962]/20 text-xs font-serif max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#0a6962]" />
                <h3 className="font-bold text-sm sm:text-base text-[#0a6962]">
                  Hướng dẫn chuẩn bị File câu hỏi & 3 Nhóm năng lực
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer bouncy-tap"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-slate-700 leading-relaxed">
              <p>
                Bạn có thể tạo file bằng <strong>Microsoft Excel</strong> hoặc <strong>Google Sheets</strong> rồi lưu lại dưới dạng <code className="bg-[#f0eee6] px-1.5 py-0.5 rounded-2xl font-mono">.csv</code> (CSV UTF-8) để tải lên hàng loạt.
              </p>

              {/* Bảng 3 nhóm chức năng của Web App */}
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="bg-[#f4f1ea] px-3 py-2 font-bold text-[#0a6962] text-[11px] uppercase tracking-wide">
                  3 Nhóm Năng Lực Chuẩn Của Web App:
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="p-3 bg-[#fff5f5]/60">
                    <div className="font-bold text-rose-900">1. Nhóm: Sự bền bỉ (Grit)</div>
                    <div className="text-slate-600 mt-1">
                      Các phân nhóm hỗ trợ: <em>Bền bỉ của hứng thú</em>, <em>Kiên trì nỗ lực</em>
                    </div>
                  </div>
                  <div className="p-3 bg-[#edf6f5]/60">
                    <div className="font-bold text-[#0a6962]">2. Nhóm: Mục đích sống (Purpose)</div>
                    <div className="text-slate-600 mt-1">
                      Các phân nhóm hỗ trợ: <em>Khám phá định hướng</em>, <em>Cảm nhận ý nghĩa</em>, <em>Đóng góp cho người khác</em>
                    </div>
                  </div>
                  <div className="p-3 bg-[#fff8f0]/60">
                    <div className="font-bold text-[#b35700]">3. Nhóm: Tự kiểm soát (Self-Control)</div>
                    <div className="text-slate-600 mt-1">
                      Các phân nhóm hỗ trợ: <em>Thực hiện nhiệm vụ</em>, <em>Lập kế hoạch</em>, <em>Điều chỉnh phản ứng</em>
                    </div>
                  </div>
                </div>
              </div>

              {/* Giải thích các cột */}
              <div>
                <div className="font-bold text-slate-900 mb-1">Cấu trúc 7 cột trong File CSV:</div>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                  <li><strong>STT</strong>: Số thứ tự câu hỏi (1, 2, 3...).</li>
                  <li><strong>Nội dung câu hỏi</strong>: Câu hỏi khảo sát học sinh.</li>
                  <li><strong>Nhóm</strong>: Điền <code className="text-[#0a6962] font-semibold">Sự bền bỉ</code>, <code className="text-[#0a6962] font-semibold">Mục đích sống</code> hoặc <code className="text-[#0a6962] font-semibold">Tự kiểm soát</code>.</li>
                  <li><strong>Phân nhóm</strong>: Tên phân nhóm tương ứng ở bảng trên.</li>
                  <li><strong>Đảo điểm</strong>: Điền <code className="text-[#ff7c00] font-semibold">1</code> nếu câu hỏi mang nghĩa ngược (ví dụ thường bỏ sở thích), hệ thống sẽ tự tính $6 - điểm$. Nếu không đảo, điền <code className="text-slate-500">0</code>.</li>
                  <li><strong>Tính điểm</strong>: Điền <code className="text-[#0a6962] font-semibold">1</code> (Có) hoặc <code className="text-slate-500">0</code> (Không).</li>
                  <li><strong>Bắt buộc</strong>: Điền <code className="text-[#0a6962] font-semibold">1</code> (Có) hoặc <code className="text-slate-500">0</code> (Không).</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={downloadSampleCsvFile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white font-bold cursor-pointer shadow-sm bouncy border border-orange-400/40"
              >
                <Download className="w-4 h-4" />
                <span>Tải File Excel/CSV Mẫu Chuẩn</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer font-semibold bouncy shadow-xs"
              >
                Đã hiểu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM TRƯỚC VÀ XÁC NHẬN KHI TẢI FILE LÊN */}
      {importedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-[#fdfdfd] p-6 shadow-2xl border border-[#0a6962]/20 text-xs font-serif max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#0a6962]" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#0a6962]">
                    Xem trước File câu hỏi vừa tải lên
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tệp: {importedPreview.filename} · Tổng: {importedPreview.questions.length} câu hỏi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImportedPreview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer bouncy-tap"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thống kê 3 nhóm trong file vừa tải */}
            <div className="grid grid-cols-3 gap-2 py-3 shrink-0">
              <div className="p-2 rounded-2xl bg-[#fff5f5] border border-rose-200 text-center shadow-xs">
                <div className="font-bold text-rose-800">Sự bền bỉ</div>
                <div className="text-base font-black text-rose-950">
                  {importedPreview.questions.filter((q) => q.dimension === 'grit').length} câu
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 text-center shadow-xs">
                <div className="font-bold text-[#0a6962]">Mục đích sống</div>
                <div className="text-base font-black text-[#08554f]">
                  {importedPreview.questions.filter((q) => q.dimension === 'purpose').length} câu
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 text-center shadow-xs">
                <div className="font-bold text-[#b35700]">Tự kiểm soát</div>
                <div className="text-base font-black text-[#8a4300]">
                  {importedPreview.questions.filter((q) => q.dimension === 'self_control').length} câu
                </div>
              </div>
            </div>

            {/* Danh sách cuộn xem trước */}
            <div className="flex-1 overflow-y-auto border border-slate-200/90 rounded-2xl p-2.5 divide-y divide-slate-100 mb-4 bg-[#faf9f4]/60">
              {importedPreview.questions.map((q, idx) => (
                <div key={idx} className="py-2 text-[11px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-800">#{idx + 1}</span>
                    <span className="text-slate-500 font-semibold">[{q.subdimension}]</span>
                    {q.reverseScored && (
                      <span className="text-[10px] bg-[#fff4ea] text-[#b35700] px-2 py-0.5 rounded-2xl font-bold border border-[#ff7c00]/30">
                        Đảo điểm
                      </span>
                    )}
                  </div>
                  <div className="text-slate-800 font-medium">{q.text}</div>
                </div>
              ))}
            </div>

            {/* Các nút lựa chọn thêm */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setImportedPreview(null)}
                className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer bouncy shadow-xs font-semibold"
              >
                Hủy
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyImport('append')}
                  className="px-4 py-2 rounded-2xl bg-[#0a6962] text-white font-bold hover:bg-[#08554f] cursor-pointer shadow-sm bouncy"
                >
                  Gộp thêm vào danh sách
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyImport('replace')}
                  className="px-4 py-2 rounded-2xl bg-[#ff7c00] text-white font-bold hover:bg-[#e67000] cursor-pointer shadow-sm bouncy border border-orange-400/40"
                >
                  Thay thế toàn bộ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHỈNH SỬA TỪNG CÂU HỎI */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-[#fdfdfd] p-6 shadow-2xl border border-[#0a6962]/20 text-xs font-serif">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0a6962]">Chỉnh sửa câu hỏi</h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer bouncy-tap"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung câu hỏi
                </label>
                <textarea
                  value={editingQuestion.text}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, text: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border border-slate-300/90 rounded-2xl focus:ring-2 focus:ring-[#0a6962]/20 focus:border-[#0a6962] font-serif text-slate-900 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nhóm năng lực
                  </label>
                  <select
                    value={editingQuestion.dimension}
                    onChange={(e) => {
                      const dim = e.target.value as Dimension;
                      setEditingQuestion({
                        ...editingQuestion,
                        dimension: dim,
                        subdimension: DIMENSION_METADATA[dim].subdimensions[0],
                      });
                    }}
                    className="w-full p-2.5 border border-slate-300/90 rounded-2xl bg-white shadow-xs"
                  >
                    <option value="grit">Sự bền bỉ (Grit)</option>
                    <option value="purpose">Mục đích sống (Purpose)</option>
                    <option value="self_control">Tự kiểm soát (Self-Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phân nhóm chi tiết
                  </label>
                  <select
                    value={editingQuestion.subdimension}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, subdimension: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300/90 rounded-2xl bg-white shadow-xs"
                  >
                    {DIMENSION_METADATA[editingQuestion.dimension].subdimensions.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.reverseScored}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        reverseScored: e.target.checked,
                      })
                    }
                    className="rounded text-[#0a6962]"
                  />
                  <span className="font-semibold text-slate-700">Đảo điểm (6 - điểm)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.scored}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        scored: e.target.checked,
                      })
                    }
                    className="rounded text-[#0a6962]"
                  />
                  <span className="font-semibold text-slate-700">Tính điểm</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingQuestion.required}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        required: e.target.checked,
                      })
                    }
                    className="rounded text-[#0a6962]"
                  />
                  <span className="font-semibold text-slate-700">Bắt buộc</span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer bouncy shadow-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(editingQuestion)}
                className="px-5 py-2 rounded-2xl bg-[#0a6962] text-white font-bold hover:bg-[#08554f] cursor-pointer bouncy shadow-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: XÁC NHẬN XÓA CÂU HỎI */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#fdfdfd] p-5 shadow-2xl border border-slate-200 text-xs font-serif">
            <div className="flex items-center gap-2 text-rose-600 mb-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Xác nhận xóa câu hỏi</span>
            </div>
            <p className="text-slate-600 mb-4">
              Bạn có chắc chắn muốn xóa câu hỏi này? Việc xóa có thể ảnh hưởng đến cách tính điểm khảo sát.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer bouncy shadow-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer bouncy shadow-xs"
              >
                Xóa câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: XÁC NHẬN KHÔI PHỤC MẶC ĐỊNH */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#fdfdfd] p-5 shadow-2xl border border-slate-200 text-xs font-serif">
            <div className="flex items-center gap-2 text-amber-600 mb-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Khôi phục câu hỏi ban đầu</span>
            </div>
            <p className="text-slate-600 mb-4">
              Thao tác này sẽ đặt lại toàn bộ 24 câu hỏi và các phân nhóm về cấu hình mặc định chuẩn. Bạn có chắc chắn muốn tiếp tục?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer bouncy shadow-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsResetConfirmOpen(false);
                  await onRestoreDefaults();
                  setStatusMsg({ type: 'success', text: 'Đã khôi phục 24 câu hỏi mặc định' });
                }}
                className="px-4 py-1.5 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer bouncy shadow-xs"
              >
                Khôi phục mặc định
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
