import React, { useState } from 'react';
import { Question } from '../types.ts';
import { Bookmark, Compass, Sprout, AlertCircle, Settings } from 'lucide-react';

interface SurveyScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer?: number;
  onSelectAnswer: (questionId: number, value: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onOpenSettings?: () => void;
}

export const SurveyScreen: React.FC<SurveyScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  onOpenSettings,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const percentage = Math.round((currentIndex / totalQuestions) * 100);

  const handleNextClick = () => {
    if (question.required && !currentAnswer) {
      setErrorMsg('Em vui lòng chọn một mức độ trước khi tiếp tục nhé.');
      return;
    }
    setErrorMsg(null);
    onNext();
  };

  const handleSelect = (val: number) => {
    setErrorMsg(null);
    onSelectAnswer(question.id, val);
  };

  const getDimensionMeta = () => {
    switch (question.dimension) {
      case 'grit':
        return {
          icon: <Bookmark className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Sự bền bỉ',
          badgeClass: 'bg-[#fff5f5] text-rose-800 border-rose-200',
        };
      case 'purpose':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-[#0a6962]" />,
          label: 'Mục đích sống',
          badgeClass: 'bg-[#edf6f5] text-[#0a6962] border-[#0a6962]/20',
        };
      case 'self_control':
        return {
          icon: <Sprout className="w-3.5 h-3.5 text-[#ff7c00]" />,
          label: 'Tự kiểm soát',
          badgeClass: 'bg-[#fff8f0] text-[#b35700] border-[#ff7c00]/25',
        };
    }
  };

  const meta = getDimensionMeta();

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-8 bg-[#fdfdfd] overflow-hidden select-none font-serif">
      {/* Top Progress Track with #0a6962 */}
      <div className="w-full max-w-2xl mx-auto pt-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="h-2 flex-1 bg-[#f0eee6] rounded-2xl overflow-hidden mr-3 border border-slate-200/50">
            <div
              className="h-full bg-[#0a6962] rounded-2xl transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-[11px] sm:text-xs text-[#0a6962] font-bold shrink-0 tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full py-2 sm:py-3">
        {/* Dimension Badge & Quick Setting */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-2xl text-[11px] sm:text-xs font-bold border shadow-xs ${meta.badgeClass}`}
          >
            {meta.icon}
            <span>{meta.label}</span>
          </span>

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="text-slate-400 hover:text-[#0a6962] hover:bg-[#edf6f5] p-1.5 rounded-2xl transition-colors cursor-pointer bouncy-tap"
              title="Cài đặt & điều chỉnh câu hỏi"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Question Heading: Xanh đậm #0a6962 */}
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#0a6962] leading-snug tracking-tight">
          {question.text}
        </h2>

        {/* Instruction subtext */}
        <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal">
          Hãy chọn mức độ đúng với bản thân:
        </p>

        {/* 5 Response Options: Sketchnote rounded-2xl with bouncy micro-interaction */}
        <div className="mt-3.5 sm:mt-4 space-y-2 sm:space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = currentAnswer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl border text-left transition-all cursor-pointer bouncy-tap ${
                  isSelected
                    ? 'bg-[#fff5eb] border-[#ff7c00] shadow-sm ring-2 ring-[#ff7c00]/30'
                    : 'bg-white border-slate-200/90 hover:border-[#0a6962]/40 hover:bg-[#faf9f5] shadow-xs'
                }`}
              >
                {/* Number Circle */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#ff7c00] text-white shadow-xs'
                      : 'bg-[#f4f1ea] text-slate-600'
                  }`}
                >
                  {opt.value}
                </div>

                {/* Option Label */}
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-2xl border border-rose-200 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
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
          onClick={handleNextClick}
          className="px-7 py-2.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-950/20 transition-all cursor-pointer bouncy border border-orange-400/40"
        >
          {currentIndex === totalQuestions ? 'Tiếp tục →' : 'Câu tiếp theo →'}
        </button>
      </div>

      {/* Imprint */}
      <div className="text-center pt-2 text-[10px] text-slate-400">
        HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ · Sketchnote Edition · Grit · Purpose · Self-Control
      </div>
    </div>
  );
};
