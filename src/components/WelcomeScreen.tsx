import React, { useRef, useState } from 'react';
import { SunsetCityIllustration } from './SunsetCityIllustration.tsx';
import { Volume2, VolumeX, Settings, Image as ImageIcon } from 'lucide-react';
import defaultWelcomeBg from '../assets/br.png';

interface WelcomeScreenProps {
  onStart: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
  onOpenSettings?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  isAudioPlaying,
  onToggleAudio,
  volume = 0.5,
  onVolumeChange,
  onOpenSettings,
}) => {
  const [bgSrc, setBgSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('custom_bg_data');
      if (saved && (saved.startsWith('data:image/') || saved.startsWith('blob:'))) {
        return saved;
      }
    } catch (_) {}
    return defaultWelcomeBg;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadStatus('Vui lòng chọn tập tin hình ảnh (PNG, JPG, WEBP)');
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setBgSrc(dataUrl);
      try {
        localStorage.setItem('custom_bg_data', dataUrl);
      } catch (err) {
        console.warn('LocalStorage limit for background image', err);
      }
      setUploadStatus('Đã áp dụng hình nền thành công!');
      setTimeout(() => setUploadStatus(null), 3000);

      try {
        await fetch('/api/upload-background', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl }),
        });
      } catch (err) {
        console.warn('Server upload background warning', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none text-white font-serif bg-cover bg-center bg-no-repeat transition-all ${
        isDragging ? 'ring-4 ring-amber-400 ring-inset' : ''
      }`}
      style={{
        backgroundImage: `url('${bgSrc}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Kéo thả ảnh phản hồi trực quan */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-amber-400 m-4 rounded-3xl animate-in fade-in">
          <ImageIcon className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
          <h3 className="text-xl font-bold text-white tracking-wide">Thả file ảnh vào đây</h3>
          <p className="text-sm text-amber-200 mt-1">Ảnh sẽ tự động đặt làm hình nền 16:9 của trang Welcome</p>
        </div>
      )}

      {/* Thông báo trạng thái tải ảnh */}
      {uploadStatus && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 border border-amber-400/50 rounded-2xl text-amber-200 text-xs font-semibold shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {uploadStatus}
        </div>
      )}

      {/* 1. Lớp hình nền: Chuẩn 16:9, bao phủ toàn màn hình, căn giữa, không lặp lại - Tăng 10% độ sáng */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={bgSrc}
          alt="Hình nền Hành trình xây dựng ước mơ"
          className="w-full h-full object-cover object-center select-none brightness-100 contrast-[1.02]"
          onError={(e) => {
            // Tự động ẩn thẻ img nếu ảnh lỗi để hiển thị hình nền đồ họa dự phòng
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Lớp đồ họa dự phòng nếu ảnh bị xóa hoặc tải chậm */}
        <SunsetCityIllustration className="absolute inset-0 -z-10 w-full h-full" />
      </div>

      {/* 2. Lớp phủ tương phản cân bằng giúp nền sáng hơn 10% trong khi chữ vẫn nổi bật sắc nét */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-slate-950/20 backdrop-blur-[1px]" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-slate-950/35 via-slate-950/15 to-slate-950/50" />

      {/* 3. Top Header Bar (Điểm trên cùng) */}
      <header className="relative z-10 w-full flex items-center justify-between px-4 sm:px-8 py-3.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#ff7c00] font-black text-sm drop-shadow-sm">➤</span>
          <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white drop-shadow-md">
            HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ
          </span>
        </div>

        {/* Hidden file input for uploading custom background */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div className="flex items-center gap-2">
          {/* Nút thay đổi ảnh nền */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/30 text-white hover:bg-black/55 transition-all text-xs font-semibold shadow-xs bouncy cursor-pointer"
            title="Tải lên hoặc thay đổi ảnh nền từ máy tính"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Đổi ảnh nền</span>
          </button>

          {/* Nút cài đặt quản trị */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-1.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/30 text-white hover:bg-black/55 transition-all text-xs font-semibold shadow-xs bouncy cursor-pointer"
              title="Cài đặt hệ thống"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cụm điều khiển Nhạc nền: Bật/Tắt & Thanh kéo âm lượng (Volume Input Range) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 text-white shadow-xs">
            {/* Nút Bật/Tắt nhạc với hiệu ứng sóng âm khi phát */}
            <button
              type="button"
              onClick={onToggleAudio}
              className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#ffb066] transition-all cursor-pointer bouncy-tap"
              title={isAudioPlaying ? 'Tạm dừng nhạc (uocmo.mp3)' : 'Bật nhạc nền (uocmo.mp3)'}
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#ffb066] animate-pulse shrink-0" />
                  <span className="text-[11px] font-bold text-[#ffb066] hidden sm:inline">Tắt nhạc</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-[11px] text-white/90 hidden sm:inline">Bật nhạc</span>
                </>
              )}
            </button>

            {/* Thanh kéo chỉnh âm lượng từ 0 đến 1 (mặc định 0.5) */}
            {onVolumeChange && (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-14 sm:w-20 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#ff7c00] focus:outline-none"
                  title={`Âm lượng: ${Math.round(volume * 100)}%`}
                />
                <span className="text-[10px] text-white/70 font-mono w-6 text-right hidden sm:inline">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 4. Central Content: Hoàn toàn trong suốt (background: transparent), không có backdrop-blur hay màu nền tối */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 my-auto py-2">
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-transparent text-center flex flex-col items-center">
          {/* Hàng chữ mới viết hoa hoàn toàn ở phía trên 'HÀNH TRÌNH': Tăng kích cỡ chữ, màu vàng tươi rực rỡ, in đậm, đổ bóng nét */}
          <div
            className="text-sm sm:text-base md:text-lg font-black tracking-[0.2em] sm:tracking-[0.25em] text-[#fde047] uppercase mb-2 sm:mb-3"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95), 0 0 12px rgba(0, 0, 0, 0.85)' }}
          >
            HỌC SINH TRƯỜNG THPT VÕ TRƯỜNG TOẢN
          </div>

          {/* Tiêu đề chính lớn: Màu trắng sáng tinh khôi và vàng hoàng kim, in đậm font-black, bóng đổ kép cực rõ */}
          <h1
            className="text-3xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-wider text-white leading-tight"
            style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.95), 0 4px 14px rgba(0, 0, 0, 0.9)' }}
          >
            HÀNH TRÌNH
            <br />
            <span
              className="text-[#fef08a] text-3xl sm:text-6xl lg:text-[68px] inline-block mt-1 sm:mt-2 tracking-wide font-black"
              style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.95), 0 4px 16px rgba(0, 0, 0, 0.95)' }}
            >
              XÂY DỰNG ƯỚC MƠ
            </span>
          </h1>

          {/* Tagline thông điệp: Màu vàng sáng hổ phách, in đậm nổi bật */}
          <div
            className="mt-3.5 sm:mt-4 text-base sm:text-xl md:text-2xl text-[#fef08a] font-extrabold italic"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8)' }}
          >
            Hiểu mình hôm nay — Kiến tạo ngày mai
          </div>

          {/* 2 dòng nội dung cốt lõi: Chữ trắng không in đậm (font-normal), giữ cỡ chữ to và đổ bóng nét */}
          <div
            className="mt-3 sm:mt-3.5 text-base sm:text-lg md:text-xl text-white font-normal leading-snug max-w-2xl mx-auto flex flex-col gap-1 sm:gap-1.5"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95), 0 0 12px rgba(0, 0, 0, 0.85)' }}
          >
            <div>Khám phá sự bền bỉ, mục đích sống và khả năng tự kiểm soát</div>
            <div>để hiểu hơn về hành trình ước mơ của chính em</div>
          </div>

          {/* Nút Bắt đầu hành trình: Tăng kích cỡ nút và chữ to hơn */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex items-center gap-3 px-10 py-4.5 rounded-2xl bg-[#ff7c00] hover:bg-[#ff881a] text-white font-extrabold text-base sm:text-lg tracking-wide shadow-2xl shadow-black/95 transition-all cursor-pointer bouncy border-2 border-amber-300"
              style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)' }}
            >
              <span className="text-[#fef08a] text-xl">✦</span>
              <span>Bắt đầu hành trình →</span>
            </button>
          </div>

          {/* Dòng thông tin phụ: Chữ trắng không in đậm (font-normal) */}
          <div
            className="mt-4 text-sm sm:text-base md:text-lg text-white font-normal tracking-wide"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95)' }}
          >
            24 câu hỏi · 7–10 phút · Kết quả ngay · Không cần đăng nhập
          </div>

          {/* Câu trích dẫn khích lệ: Giữ màu vàng hổ phách nổi bật */}
          <div
            className="mt-2.5 text-base sm:text-lg md:text-xl text-[#fef08a] font-bold italic font-serif"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95)' }}
          >
            “Ước mơ không xa vời khi bạn hiểu rõ chính mình.”
          </div>

          {/* Ngay phía dưới dòng trích dẫn: Copyright by Seroto. (Chữ trắng sáng không in đậm - font-normal) */}
          <div
            className="mt-1.5 text-sm sm:text-base md:text-lg text-slate-100 font-normal tracking-wider"
            style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95)' }}
          >
            Copyright by Seroto.
          </div>
        </div>
      </main>

      {/* 5. Bottom Imprint Bar (Hàng chân trang chữ trắng không in đậm - font-normal) */}
      <footer className="relative z-10 w-full text-center pb-3 px-4 flex flex-col items-center gap-1.5 shrink-0">
        <div
          className="text-sm sm:text-base text-white font-normal tracking-wider font-sans"
          style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95)' }}
        >
          HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ · Grit · Purpose · Self-Control · Phiên bản thử nghiệm
        </div>
        <div
          className="text-xs sm:text-sm md:text-base text-slate-100 font-normal tracking-normal font-sans italic"
          style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.95)' }}
        >
          This version has been copied and edited, but the original core content remains unaffected.
        </div>
      </footer>
    </div>
  );
};
