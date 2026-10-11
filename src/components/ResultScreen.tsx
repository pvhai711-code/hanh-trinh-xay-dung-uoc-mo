import React, { useState } from 'react';
import { ScoreReport, StageOption } from '../types.ts';
import { formatVietnameseScore } from '../utils/scoring.ts';
import { RotateCcw, Download, Bookmark, Compass, Sprout } from 'lucide-react';

interface ResultScreenProps {
  report: ScoreReport;
  selectedStage?: StageOption;
  userCommitment: string;
  onChangeCommitment: (val: string) => void;
  onRetake: () => void;
  onSavePdf: () => void;
  isPdfSaving?: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  report,
  selectedStage,
  userCommitment,
  onChangeCommitment,
  onRetake,
  onSavePdf,
  isPdfSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'suggestions' | 'notes'>('overview');

  // Gauge calculation for composite score (0 to 100)
  const radius = 68;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const percent = Math.min(100, Math.max(0, report.compositeScore));
  const strokeDashoffset = circumference * (1 - percent / 100);

  const handleRetakeClick = () => {
    try {
      const savedBg = localStorage.getItem('custom_bg_data');
      const savedSlide2 = localStorage.getItem('custom_slide2_data');
      localStorage.clear();
      sessionStorage.clear();
      if (savedBg) {
        localStorage.setItem('custom_bg_data', savedBg);
      }
      if (savedSlide2) {
        localStorage.setItem('custom_slide2_data', savedSlide2);
      }
      if (typeof document !== 'undefined') {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
      }
    } catch (e) {
      console.warn('Lỗi khi xóa client storage:', e);
    }
    onRetake();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 bg-transparent overflow-hidden select-none font-serif relative z-10">
      {/* Top Report Header */}
      <div className="text-center pt-1 shrink-0">
        <div className="text-[10px] sm:text-xs tracking-wider uppercase text-[#0a6962] font-bold">
          BÁO CÁO TỰ ĐÁNH GIÁ CÁ NHÂN
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0a6962] tracking-tight mt-0.5">
          Kết quả hành trình của em
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500">
          Chỉ số tổng hợp dựa trên ba nguồn lực tâm lý
        </p>

        {/* 4 Tabs: Sketchnote rounded-2xl with bouncy micro-interaction */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#f4f1ea] rounded-2xl mt-2.5 border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1 rounded-2xl text-xs font-bold transition-all cursor-pointer bouncy-tap ${
              activeTab === 'overview'
                ? 'bg-[#0a6962] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
          >
            Tổng quan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3.5 py-1 rounded-2xl text-xs font-bold transition-all cursor-pointer bouncy-tap ${
              activeTab === 'details'
                ? 'bg-[#0a6962] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
          >
            Chi tiết
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`px-3.5 py-1 rounded-2xl text-xs font-bold transition-all cursor-pointer bouncy-tap ${
              activeTab === 'suggestions'
                ? 'bg-[#0a6962] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
          >
            Gợi ý
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1 rounded-2xl text-xs font-bold transition-all cursor-pointer bouncy-tap ${
              activeTab === 'notes'
                ? 'bg-[#0a6962] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
          >
            Lời nhắn
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full py-2 overflow-hidden">
        {/* TAB 1: TỔNG QUAN */}
        {activeTab === 'overview' && (
          <div className="flex flex-col items-center justify-center space-y-2.5">
            {/* Semicircular Gauge with #ff7c00 and #0a6962 gradient */}
            <div className="relative w-44 h-24 flex items-end justify-center">
              <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 88">
                <defs>
                  <linearGradient id="sketchnoteGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff7c00" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#0a6962" />
                  </linearGradient>
                </defs>

                <path
                  d="M 12 80 A 68 68 0 0 1 148 80"
                  fill="none"
                  stroke="#e8e4d8"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />

                <path
                  d="M 12 80 A 68 68 0 0 1 148 80"
                  fill="none"
                  stroke="url(#sketchnoteGaugeGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
                <div className="text-2xl sm:text-3xl font-black text-[#0a6962] tracking-tight leading-none">
                  {formatVietnameseScore(report.compositeScore)}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  CHỈ SỐ HÀNH TRÌNH
                </div>
                <div className="text-[10px] text-slate-400 font-medium">/ 100</div>
              </div>
            </div>

            {/* Encouragement Summary Box */}
            <div className="w-full p-3 rounded-2xl bg-[#faf9f4] border border-[#0a6962]/15 text-xs text-slate-700 leading-relaxed text-center font-normal shadow-xs">
              {report.encouragementSummary}
            </div>

            {/* 3 Metric Cards: rounded-2xl, soft drop shadow */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {/* Grit Card */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#fff5f5] border border-rose-200/90 text-center shadow-xs bouncy-tap">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rose-800">
                  <Bookmark className="w-3 h-3 text-rose-600" />
                  <span>Sự bền bỉ</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-rose-950 mt-0.5">
                  {formatVietnameseScore(report.gritScore)}
                </div>
                <div className="text-[10px] text-rose-600/80">/ 100</div>
              </div>

              {/* Purpose Card */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 text-center shadow-xs bouncy-tap">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#0a6962]">
                  <Compass className="w-3 h-3 text-[#0a6962]" />
                  <span>Mục đích sống</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-[#08554f] mt-0.5">
                  {formatVietnameseScore(report.purposeScore)}
                </div>
                <div className="text-[10px] text-[#0a6962]/80">/ 100</div>
              </div>

              {/* Self-Control Card */}
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 text-center shadow-xs bouncy-tap">
                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#b35700]">
                  <Sprout className="w-3 h-3 text-[#ff7c00]" />
                  <span>Tự kiểm soát</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-[#8a4300] mt-0.5">
                  {formatVietnameseScore(report.selfControlScore)}
                </div>
                <div className="text-[10px] text-[#ff7c00]/80">/ 100</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHI TIẾT */}
        {activeTab === 'details' && (
          <div className="w-full flex flex-col justify-center space-y-2 text-xs">
            <h3 className="font-bold text-sm text-[#0a6962]">Chi tiết từng khía cạnh</h3>

            {/* Grit Subdimensions */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-rose-800">
                <Bookmark className="w-3 h-3 text-rose-600" />
                <span>Sự bền bỉ — {formatVietnameseScore(report.gritScore)}/100</span>
              </div>
              {report.subdimensionScores
                .filter((s) => s.dimension === 'grit')
                .map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="w-40 truncate text-slate-600">{sub.name}</span>
                    <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden border border-slate-200/40">
                      <div
                        className="h-full bg-rose-400 rounded-2xl transition-all duration-500"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-slate-800 tabular-nums">
                      {formatVietnameseScore(sub.score)}
                    </span>
                  </div>
                ))}
            </div>

            {/* Purpose Subdimensions */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#0a6962]">
                <Compass className="w-3 h-3 text-[#0a6962]" />
                <span>Mục đích sống — {formatVietnameseScore(report.purposeScore)}/100</span>
              </div>
              {report.subdimensionScores
                .filter((s) => s.dimension === 'purpose')
                .map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="w-40 truncate text-slate-600">{sub.name}</span>
                    <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden border border-slate-200/40">
                      <div
                        className="h-full bg-[#0a6962] rounded-2xl transition-all duration-500"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-slate-800 tabular-nums">
                      {formatVietnameseScore(sub.score)}
                    </span>
                  </div>
                ))}
            </div>

            {/* Self-Control Subdimensions */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#b35700]">
                <Sprout className="w-3 h-3 text-[#ff7c00]" />
                <span>Tự kiểm soát — {formatVietnameseScore(report.selfControlScore)}/100</span>
              </div>
              {report.subdimensionScores
                .filter((s) => s.dimension === 'self_control')
                .map((sub) => (
                  <div key={sub.name} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="w-40 truncate text-slate-600">{sub.name}</span>
                    <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden border border-slate-200/40">
                      <div
                        className="h-full bg-[#ff7c00] rounded-2xl transition-all duration-500"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-semibold text-slate-800 tabular-nums">
                      {formatVietnameseScore(sub.score)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: GỢI Ý */}
        {activeTab === 'suggestions' && (
          <div className="w-full flex flex-col justify-center space-y-2.5 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#0a6962]">Gợi ý dành riêng cho em</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dựa trên các điểm tự đánh giá, đây là những gợi ý để phát triển nguồn lực của mình.
              </p>
            </div>

            {/* Strength advice box */}
            <div className="p-3 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 shadow-xs">
              <div className="font-bold text-[#0a6962] text-xs">
                ✦ {report.recommendations.strengthTitle}
              </div>
              <ul className="mt-1.5 space-y-1 text-[11px] text-slate-700">
                {report.recommendations.strengthBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#0a6962] font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth advice box */}
            <div className="p-3 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 shadow-xs">
              <div className="font-bold text-[#b35700] text-xs">
                ✦ {report.recommendations.growthTitle}
              </div>
              <ul className="mt-1.5 space-y-1 text-[11px] text-slate-700">
                {report.recommendations.growthBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#ff7c00] font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: LỜI NHẮN */}
        {activeTab === 'notes' && (
          <div className="w-full flex flex-col justify-center space-y-2 text-xs">
            <div>
              <h3 className="font-bold text-sm text-[#0a6962]">
                Lời nhắn cho hành trình tiếp theo
              </h3>
              {selectedStage && (
                <p className="text-[11px] text-[#0a6962] font-medium mt-0.5">
                  {selectedStage.description}
                </p>
              )}
            </div>

            {/* Commitment Box: rounded-2xl */}
            <div className="p-3 rounded-2xl bg-[#faf9f4] border border-slate-200/90 shadow-xs">
              <div className="font-bold text-slate-800 text-xs">
                Việc nhỏ em muốn thực hiện trong 7 ngày tới
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 mb-1.5">
                Em có thể tự viết một cam kết ngắn dưới đây.
              </div>
              <textarea
                value={userCommitment}
                onChange={(e) => onChangeCommitment(e.target.value)}
                placeholder="Trong 7 ngày tới, em sẽ..."
                rows={3}
                className="w-full p-2.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a6962]/30 resize-none font-serif shadow-xs"
              />
            </div>

            {/* Gentle Quote */}
            <div className="text-center text-[11px] text-slate-600 italic py-1">
              “Không cần đi thật nhanh. Điều quan trọng là hiểu bản thân và thực hiện từng bước phù hợp với mình.”
            </div>
          </div>
        )}
      </div>

      {/* Bottom Disclaimer & Action Buttons */}
      <div className="shrink-0 pt-1 max-w-2xl mx-auto w-full flex flex-col justify-end">
        {/* Disclaimer Note: Được nâng cao lên trên (mb-12 sm:mb-16) với nền bảo vệ nhẹ để tuyệt đối không chạm hay đè lên đầu nhóm học sinh phía dưới */}
        <div className="w-full text-center px-3 mb-12 sm:mb-16">
          <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium leading-relaxed max-w-xl mx-auto inline-block px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-xs border border-slate-200/60 shadow-xs">
            Đây là chỉ số tự đánh giá thử nghiệm, chưa được chuẩn hóa tâm trắc. Điểm số không phải tỷ lệ thành công hay kết luận về phẩm chất, năng lực. Không có dữ liệu trả lời nào được gửi lên máy chủ bởi website này.
          </p>
        </div>

        {/* Action Buttons: Giữ nguyên vị trí ở dưới cùng, hai bên cân đối */}
        <div className="flex items-center justify-between border-t border-slate-100/80 pt-2 pb-0.5">
          <button
            type="button"
            onClick={handleRetakeClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-xs font-semibold cursor-pointer bouncy shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại khảo sát</span>
          </button>

          <button
            type="button"
            onClick={onSavePdf}
            disabled={isPdfSaving}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white text-xs font-bold shadow-md shadow-orange-950/20 transition-all cursor-pointer bouncy disabled:opacity-60 border border-orange-400/40"
          >
            <Download className={`w-3.5 h-3.5 ${isPdfSaving ? 'animate-bounce' : ''}`} />
            <span>{isPdfSaving ? 'Đang xuất PDF...' : 'Xuất PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
