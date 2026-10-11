import React from 'react';
import { SunsetCityIllustration } from './SunsetCityIllustration.tsx';
import { Volume2, VolumeX } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  isAudioPlaying,
  onToggleAudio,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-[#0a6962]/10 select-none text-white font-serif">
      {/* Background illustration */}
      <SunsetCityIllustration className="absolute inset-0 z-0" />

      {/* Atmospheric gradient overlay to ensure perfect contrast and legibility */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70" />

      {/* Top bar on cover */}
      <div className="relative z-10 w-full flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-2">
          <span className="text-[#ff7c00] font-black text-sm">➤</span>
          <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white/95 drop-shadow-sm">
            HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleAudio}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all text-xs font-semibold shadow-xs bouncy cursor-pointer"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#ffb066] animate-pulse" />
              <span>Tắt âm thanh</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-white/80" />
              <span>Bật âm thanh</span>
            </>
          )}
        </button>
      </div>

      {/* Hero central content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 text-center max-w-3xl mx-auto my-auto">
        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wider text-white drop-shadow-md leading-[1.15]">
          HÀNH TRÌNH
          <br />
          XÂY DỰNG
          <br />
          <span className="text-[#fed285] drop-shadow-lg">ƯỚC MƠ</span>
        </h1>

        {/* Message Tagline */}
        <div className="mt-3 sm:mt-5 text-lg sm:text-2xl text-amber-100 font-medium italic drop-shadow-sm">
          Hiểu mình hôm nay
          <br />
          Kiến tạo ngày mai
        </div>

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-base text-slate-100 max-w-xl mx-auto font-normal leading-relaxed drop-shadow-xs">
          Khám phá sự bền bỉ, mục đích sống và khả năng tự kiểm soát để hiểu hơn về hành trình ước mơ của chính em.
        </p>

        {/* CTA Button: Cam Pastel #ff7c00 bo góc rounded-2xl với hiệu ứng nảy bouncy */}
        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={onStart}
            className="group inline-flex items-center gap-2 px-9 py-3.5 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white font-bold text-sm sm:text-base tracking-wide shadow-md shadow-orange-950/30 transition-all cursor-pointer bouncy border border-orange-400/40"
          >
            <span className="text-amber-200">✦</span>
            <span>Bắt đầu hành trình →</span>
          </button>
        </div>

        {/* Subtext info */}
        <div className="mt-4 text-[11px] sm:text-xs text-white/85 font-medium tracking-wide">
          24 câu hỏi · 7–10 phút · Kết quả ngay · Không cần đăng nhập
        </div>

        {/* Quote */}
        <div className="mt-2 text-xs sm:text-sm text-amber-200/95 italic font-serif">
          “Ước mơ không xa vời khi bạn hiểu rõ chính mình.”
        </div>
      </div>

      {/* Footer subtle imprint */}
      <div className="relative z-10 w-full text-center pb-3 text-[10px] sm:text-xs text-white/50 tracking-wider">
        HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ · Grit · Purpose · Self-Control · Sketchnote Edition
      </div>
    </div>
  );
};
