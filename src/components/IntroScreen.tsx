import React from 'react';
import { Bookmark, Compass, Sprout, Info, Settings } from 'lucide-react';

interface IntroScreenProps {
  onBack: () => void;
  onNext: () => void;
  onOpenSettings?: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onBack, onNext, onOpenSettings }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#fdfdfd] overflow-hidden select-none font-serif">
      {/* Stepper Progress */}
      <div className="max-w-md mx-auto w-full pt-1 sm:pt-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-1">
            <div className="w-7 h-7 rounded-2xl bg-[#0a6962] text-white font-bold text-xs flex items-center justify-center shadow-xs ring-4 ring-[#fdfdfd]">
              1
            </div>
            <span className="text-[11px] font-bold text-[#0a6962] mt-1">Giới thiệu</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-1">
            <div className="w-7 h-7 rounded-2xl bg-[#f0eee6] text-slate-500 font-bold text-xs flex items-center justify-center ring-4 ring-[#fdfdfd]">
              2
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-1">Trả lời</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-1">
            <div className="w-7 h-7 rounded-2xl bg-[#f0eee6] text-slate-500 font-bold text-xs flex items-center justify-center ring-4 ring-[#fdfdfd]">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-1">Kết quả</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full py-3 sm:py-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0a6962] tracking-tight">
          Chào em!
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          Bài khảo sát giúp em tự đánh giá ba nguồn lực tâm lý liên quan đến hành trình khám phá và theo đuổi ước mơ. <span className="font-semibold text-[#0a6962]">Em không cần có sẵn ước mơ để tham gia.</span>
        </p>

        {/* 3 Psychological Resource Cards with Sketchnote rounded-2xl borders and soft shadow */}
        <div className="mt-4 space-y-2.5 sm:space-y-3">
          {/* Grit */}
          <div className="p-3.5 rounded-2xl bg-[#fff5f5] border border-rose-200/80 shadow-xs flex items-start gap-3 bouncy-tap">
            <div className="w-8 h-8 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
              <Bookmark className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-rose-900">
                Sự bền bỉ (Grit)
              </div>
              <div className="text-[11px] sm:text-xs text-rose-700/90 mt-0.5">
                Duy trì hứng thú, kiên trì nỗ lực khi gặp khó khăn.
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="p-3.5 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 shadow-xs flex items-start gap-3 bouncy-tap">
            <div className="w-8 h-8 rounded-2xl bg-[#0a6962]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#0a6962]/20">
              <Compass className="w-4 h-4 text-[#0a6962]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#0a6962]">
                Mục đích sống (Purpose)
              </div>
              <div className="text-[11px] sm:text-xs text-[#08554f]/90 mt-0.5">
                Khám phá điều có ý nghĩa, định hướng và cách đóng góp.
              </div>
            </div>
          </div>

          {/* Self-Control */}
          <div className="p-3.5 rounded-2xl bg-[#fff8f0] border border-[#ff7c00]/25 shadow-xs flex items-start gap-3 bouncy-tap">
            <div className="w-8 h-8 rounded-2xl bg-[#ff7c00]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#ff7c00]/20">
              <Sprout className="w-4 h-4 text-[#ff7c00]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#b35700]">
                Tự kiểm soát (Self-Control)
              </div>
              <div className="text-[11px] sm:text-xs text-[#8a4300]/90 mt-0.5">
                Quản lý hành vi, sự tập trung và việc thực hiện kế hoạch.
              </div>
            </div>
          </div>
        </div>

        {/* Lưu ý Box */}
        <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-[#f7f5ed] border border-[#0a6962]/15 text-[11px] sm:text-xs text-slate-700 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#0a6962]">
            <Info className="w-3.5 h-3.5 text-[#0a6962]" />
            <span>Lưu ý:</span>
          </div>
          <div className="pl-5 space-y-0.5 text-slate-600">
            <div>• Không có câu trả lời đúng hay sai.</div>
            <div>• Hãy dựa vào trải nghiệm thật của em trong khoảng 3 tháng gần đây.</div>
            <div>• Kết quả để tự khám phá, không phải đánh giá hay gán nhãn năng lực.</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons: rounded-2xl, #ff7c00 for CTA, bouncy animations */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full pt-3 pb-1 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm font-semibold cursor-pointer bouncy shadow-xs"
        >
          ← Trang đầu
        </button>

        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-3.5 py-2 rounded-2xl border border-[#0a6962]/20 text-[#0a6962] hover:bg-[#edf6f5] transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer bouncy shadow-xs"
              title="Cài đặt và điều chỉnh câu hỏi"
            >
              <Settings className="w-3.5 h-3.5 text-[#0a6962]" />
              <span className="hidden sm:inline">Cài đặt</span>
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            className="px-7 py-2.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer bouncy border border-orange-400/40"
          >
            Tiếp tục →
          </button>
        </div>
      </div>

      {/* Subtle Imprint */}
      <div className="text-center pt-2 text-[10px] text-slate-400">
        HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ · Sketchnote Design · Grit · Purpose · Self-Control
      </div>
    </div>
  );
};
