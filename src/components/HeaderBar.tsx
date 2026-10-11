import React from 'react';
import { Volume2, VolumeX, Settings, Monitor, Smartphone, Download } from 'lucide-react';
import { AspectRatioMode, ScreenType } from '../types.ts';

interface HeaderBarProps {
  currentScreen: ScreenType;
  questionIndex?: number;
  totalQuestions?: number;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  aspectMode: AspectRatioMode;
  onToggleAspect: (mode: AspectRatioMode) => void;
  onOpenSettings: () => void;
  onSavePdf?: () => void;
  isPdfLoading?: boolean;
  onGoHome?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen,
  questionIndex = 1,
  totalQuestions = 24,
  isAudioPlaying,
  onToggleAudio,
  aspectMode,
  onToggleAspect,
  onOpenSettings,
  onSavePdf,
  isPdfLoading = false,
  onGoHome,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-8 py-3 select-none shrink-0 border-b border-[#0a6962]/10 bg-[#fdfdfd]/90 backdrop-blur-sm shadow-xs font-serif">
      {/* Brand title */}
      <div
        onClick={onGoHome}
        className="flex items-center gap-2 cursor-pointer group bouncy-tap"
        title="Về trang chủ"
      >
        <span className="text-[#ff7c00] font-black text-sm tracking-wide">➤</span>
        <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#0a6962] group-hover:text-[#08554f] transition-colors">
          HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-medium text-slate-700">
        {/* Aspect Ratio Switcher */}
        <div className="flex items-center bg-[#f4f1ea] rounded-2xl p-0.5 border border-slate-200/90 shadow-xs">
          <button
            type="button"
            onClick={() => onToggleAspect('16:9')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xl text-[11px] sm:text-xs transition-all bouncy-tap ${
              aspectMode === '16:9'
                ? 'bg-white text-[#0a6962] font-bold shadow-xs border border-[#0a6962]/15'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
            title="Chế độ màn hình ngang 16:9"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">16:9</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleAspect('9:16')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xl text-[11px] sm:text-xs transition-all bouncy-tap ${
              aspectMode === '9:16'
                ? 'bg-white text-[#0a6962] font-bold shadow-xs border border-[#0a6962]/15'
                : 'text-slate-600 hover:text-[#0a6962]'
            }`}
            title="Chế độ màn hình dọc 9:16"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">9:16</span>
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`flex items-center gap-1 px-3 py-1 rounded-2xl border transition-all text-[11px] sm:text-xs bouncy shadow-xs cursor-pointer ${
            isAudioPlaying
              ? 'bg-[#fff5eb] text-[#ff7c00] border-[#ff7c00]/40 font-semibold'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0a6962]/30'
          }`}
          title={isAudioPlaying ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#ff7c00] animate-pulse" />
              <span className="hidden sm:inline">Tắt âm</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Âm thanh</span>
            </>
          )}
        </button>

        {/* Screen Specific Indicators */}
        {currentScreen === 'survey' && (
          <div className="font-bold text-xs sm:text-sm text-[#0a6962] px-3 py-1 bg-[#edf6f5] rounded-2xl border border-[#0a6962]/20 shadow-xs">
            Câu {questionIndex}/{totalQuestions}
          </div>
        )}

        {currentScreen === 'supplemental' && (
          <div className="text-[11px] sm:text-xs text-[#0a6962] font-semibold px-3 py-1 bg-[#edf6f5] rounded-2xl border border-[#0a6962]/20 shadow-xs hidden sm:block">
            Câu bổ sung
          </div>
        )}

        {currentScreen === 'results' && onSavePdf && (
          <button
            type="button"
            onClick={onSavePdf}
            disabled={isPdfLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#ff7c00] text-white hover:bg-[#e67000] transition-all shadow-sm text-xs font-bold cursor-pointer disabled:opacity-60 bouncy"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isPdfLoading ? 'Đang tạo PDF...' : 'Lưu PDF'}</span>
          </button>
        )}

        {/* Nút Setting Quản Trị Hệ Thống */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white hover:bg-[#edf6f5] text-[#0a6962] border border-[#0a6962]/30 transition-all text-xs font-bold cursor-pointer bouncy shadow-xs"
          title="Cài đặt hệ thống & Điều chỉnh câu hỏi"
        >
          <Settings className="w-3.5 h-3.5 text-[#0a6962]" />
          <span className="hidden sm:inline">Cài đặt</span>
        </button>
      </div>
    </header>
  );
};
