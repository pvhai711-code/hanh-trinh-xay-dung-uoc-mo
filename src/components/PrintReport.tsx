import React from 'react';
import { ScoreReport, StageOption } from '../types.ts';
import { formatVietnameseScore } from '../utils/scoring.ts';
import { Bookmark, Compass, Sprout } from 'lucide-react';

interface PrintReportProps {
  report: ScoreReport;
  selectedStage?: StageOption;
  userCommitment: string;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  report,
  selectedStage,
  userCommitment,
}) => {
  const radius = 68;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const percent = Math.min(100, Math.max(0, report.compositeScore));
  const strokeDashoffset = circumference * (1 - percent / 100);

  return (
    <div
      id="print-report-container"
      className="print-report hidden print:block bg-white text-slate-900 p-8 max-w-[210mm] mx-auto text-sm font-serif"
    >
      {/* Print Header */}
      <div className="flex items-center justify-between border-b border-[#0a6962]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#ff7c00] font-black text-sm">➤</span>
          <span className="font-bold text-sm tracking-wider uppercase text-[#0a6962]">
            HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Phiên bản thử nghiệm · Tự đánh giá cá nhân (Sketchnote)
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-xs tracking-wider uppercase text-[#0a6962] font-bold">
          BÁO CÁO TỰ ĐÁNH GIÁ CÁ NHÂN
        </div>
        <h1 className="text-2xl font-bold text-[#0a6962] mt-1">
          Kết quả hành trình của em
        </h1>
        <p className="text-xs text-slate-500">
          Chỉ số tổng hợp dựa trên ba nguồn lực tâm lý
        </p>
      </div>

      {/* Semicircle Gauge and Overall Card */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative w-44 h-24 flex items-end justify-center">
          <svg className="w-44 h-24 overflow-visible" viewBox="0 0 160 88">
            <defs>
              <linearGradient id="printGaugeGradSketchnote" x1="0%" y1="0%" x2="100%" y2="0%">
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
              stroke="url(#printGaugeGradSketchnote)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center">
            <div className="text-3xl font-black text-[#0a6962] leading-none">
              {formatVietnameseScore(report.compositeScore)}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              CHỈ SỐ HÀNH TRÌNH
            </div>
            <div className="text-[10px] text-slate-400">/ 100</div>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="w-full mt-3 p-3 rounded-2xl bg-[#faf9f4] border border-[#0a6962]/15 text-xs text-slate-700 text-center">
          {report.encouragementSummary}
        </div>
      </div>

      {/* 3 Dimension Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-2xl bg-[#fff5f5] border border-rose-200 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-rose-800">
            <Bookmark className="w-3.5 h-3.5 text-rose-600" />
            <span>Sự bền bỉ</span>
          </div>
          <div className="text-xl font-black text-rose-950 mt-1">
            {formatVietnameseScore(report.gritScore)}
          </div>
          <div className="text-[10px] text-rose-600/80">/ 100</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#0a6962]">
            <Compass className="w-3.5 h-3.5 text-[#0a6962]" />
            <span>Mục đích sống</span>
          </div>
          <div className="text-xl font-black text-[#08554f] mt-1">
            {formatVietnameseScore(report.purposeScore)}
          </div>
          <div className="text-[10px] text-[#0a6962]/80">/ 100</div>
        </div>

        <div className="p-3 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#b35700]">
            <Sprout className="w-3.5 h-3.5 text-[#ff7c00]" />
            <span>Tự kiểm soát</span>
          </div>
          <div className="text-xl font-black text-[#8a4300] mt-1">
            {formatVietnameseScore(report.selfControlScore)}
          </div>
          <div className="text-[10px] text-[#ff7c00]/80">/ 100</div>
        </div>
      </div>

      {/* Chi tiết từng khía cạnh */}
      <div className="mb-5 border-t border-slate-200 pt-3">
        <h2 className="font-bold text-sm text-[#0a6962] mb-2">Chi tiết từng khía cạnh</h2>
        <div className="space-y-3">
          {/* Grit */}
          <div>
            <div className="text-xs font-bold text-rose-800 mb-1">
              Sự bền bỉ — {formatVietnameseScore(report.gritScore)}/100
            </div>
            {report.subdimensionScores
              .filter((s) => s.dimension === 'grit')
              .map((sub) => (
                <div key={sub.name} className="flex items-center justify-between gap-3 text-xs py-0.5">
                  <span className="w-48 text-slate-600">{sub.name}</span>
                  <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-2xl" style={{ width: `${sub.score}%` }} />
                  </div>
                  <span className="w-12 text-right font-semibold text-slate-800 tabular-nums">
                    {formatVietnameseScore(sub.score)}
                  </span>
                </div>
              ))}
          </div>

          {/* Purpose */}
          <div>
            <div className="text-xs font-bold text-[#0a6962] mb-1">
              Mục đích sống — {formatVietnameseScore(report.purposeScore)}/100
            </div>
            {report.subdimensionScores
              .filter((s) => s.dimension === 'purpose')
              .map((sub) => (
                <div key={sub.name} className="flex items-center justify-between gap-3 text-xs py-0.5">
                  <span className="w-48 text-slate-600">{sub.name}</span>
                  <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden">
                    <div className="h-full bg-[#0a6962] rounded-2xl" style={{ width: `${sub.score}%` }} />
                  </div>
                  <span className="w-12 text-right font-semibold text-slate-800 tabular-nums">
                    {formatVietnameseScore(sub.score)}
                  </span>
                </div>
              ))}
          </div>

          {/* Self-Control */}
          <div>
            <div className="text-xs font-bold text-[#b35700] mb-1">
              Tự kiểm soát — {formatVietnameseScore(report.selfControlScore)}/100
            </div>
            {report.subdimensionScores
              .filter((s) => s.dimension === 'self_control')
              .map((sub) => (
                <div key={sub.name} className="flex items-center justify-between gap-3 text-xs py-0.5">
                  <span className="w-48 text-slate-600">{sub.name}</span>
                  <div className="flex-1 h-2 bg-[#f4f1ea] rounded-2xl overflow-hidden">
                    <div className="h-full bg-[#ff7c00] rounded-2xl" style={{ width: `${sub.score}%` }} />
                  </div>
                  <span className="w-12 text-right font-semibold text-slate-800 tabular-nums">
                    {formatVietnameseScore(sub.score)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Gợi ý & Lời nhắn */}
      <div className="mb-5 border-t border-slate-200 pt-3">
        <h2 className="font-bold text-sm text-[#0a6962] mb-2">Gợi ý dành riêng cho em</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 text-xs">
            <div className="font-bold text-[#0a6962] mb-1">
              ✦ {report.recommendations.strengthTitle}
            </div>
            <ul className="space-y-0.5 text-slate-700">
              {report.recommendations.strengthBullets.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 text-xs">
            <div className="font-bold text-[#b35700] mb-1">
              ✦ {report.recommendations.growthTitle}
            </div>
            <ul className="space-y-0.5 text-slate-700">
              {report.recommendations.growthBullets.map((b, i) => (
                <li key={i}>• {b}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Commitment */}
        {userCommitment && (
          <div className="p-3 rounded-2xl bg-[#faf9f4] border border-slate-200 text-xs mt-3">
            <div className="font-bold text-slate-800 mb-1">
              Việc nhỏ em muốn thực hiện trong 7 ngày tới:
            </div>
            <p className="italic text-slate-700">"{userCommitment}"</p>
          </div>
        )}
      </div>

      {/* Print Footer */}
      <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center">
        Đây là chỉ số tự đánh giá thử nghiệm, chưa được chuẩn hóa tâm trắc. Điểm số không phải tỷ lệ thành công hay kết luận về phẩm chất, năng lực.
      </div>
    </div>
  );
};
