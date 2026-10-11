import React, { useState } from 'react';
import { StageOption } from '../types.ts';
import { Search, Compass, Target, Rocket, AlertCircle } from 'lucide-react';

interface SupplementalScreenProps {
  stageOptions: StageOption[];
  selectedStageId?: number;
  onSelectStage: (id: number) => void;
  onPrev: () => void;
  onComplete: () => void;
}

export const SupplementalScreen: React.FC<SupplementalScreenProps> = ({
  stageOptions,
  selectedStageId,
  onSelectStage,
  onPrev,
  onComplete,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedStageId) {
      setErrorMsg('Em vui lòng chọn một giai đoạn để tiếp tục xem kết quả nhé.');
      return;
    }
    setErrorMsg(null);
    onComplete();
  };

  const getStageIcon = (name?: string) => {
    switch (name) {
      case 'search':
        return <Search className="w-4 h-4 text-[#0a6962]" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-amber-600" />;
      case 'target':
        return <Target className="w-4 h-4 text-[#ff7c00]" />;
      case 'rocket':
        return <Rocket className="w-4 h-4 text-indigo-600" />;
      default:
        return <Target className="w-4 h-4 text-[#ff7c00]" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-transparent overflow-hidden select-none font-serif relative z-10">
      {/* Top Progress Track */}
      <div className="w-full max-w-2xl mx-auto pt-1">
        <div className="h-2 w-full bg-[#0a6962] rounded-2xl shadow-xs" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full py-2 sm:py-3">
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0a6962] leading-snug tracking-tight">
          Hiện tại, em thấy mình đang ở giai đoạn nào trong hành trình ước mơ?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-normal">
          Câu hỏi này không tính điểm, chỉ giúp chúng tôi đưa ra gợi ý phù hợp.
        </p>

        {/* 4 Stage Option Cards: Sketchnote rounded-2xl with bouncy micro-interaction */}
        <div className="mt-4 space-y-2.5">
          {stageOptions.map((opt) => {
            const isSelected = selectedStageId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onSelectStage(opt.id);
                }}
                className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer bouncy-tap ${
                  isSelected
                    ? 'bg-[#fff5eb] border-[#ff7c00] ring-2 ring-[#ff7c00]/30 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-[#0a6962]/40 hover:bg-[#faf9f5] shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#f4f1ea] flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/80">
                    {getStageIcon(opt.iconName)}
                  </div>
                  <div>
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        isSelected ? 'text-slate-900' : 'text-slate-800'
                      }`}
                    >
                      {opt.title}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      {opt.description}
                    </div>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors ${
                    isSelected ? 'border-[#ff7c00]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#ff7c00]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Validation Message */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-2xl border border-rose-200 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons: rounded-2xl and bouncy */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full pt-3 pb-1 border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm font-semibold cursor-pointer bouncy shadow-xs"
        >
          ← Câu trước
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-7 py-2.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/20 transition-all cursor-pointer bouncy border border-orange-400/40"
        >
          Xem kết quả →
        </button>
      </div>
    </div>
  );
};
