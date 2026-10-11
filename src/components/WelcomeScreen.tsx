import React, { useRef, useState } from 'react';
import { SunsetCityIllustration } from './SunsetCityIllustration.tsx';
import { Volume2, VolumeX, Settings, Image as ImageIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onOpenSettings?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  isAudioPlaying,
  onToggleAudio,
  onOpenSettings,
}) => {
  const [bgSrc, setBgSrc] = useState<string>(() => {
    return localStorage.getItem('custom_bg_data') || '/br.png';
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

      {/* 1. Lớp hình nền: Chuẩn 16:9, bao phủ toàn màn hình, căn giữa, không lặp lại */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={bgSrc}
          alt="Hình nền Hành trình xây dựng ước mơ"
          className="w-full h-full object-cover object-center select-none"
          onError={(e) => {
            // Tự động ẩn thẻ img nếu ảnh lỗi để hiển thị hình nền đồ họa dự phòng
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Lớp đồ họa dự phòng nếu ảnh bị xóa hoặc tải chậm */}
        <SunsetCityIllustration className="absolute inset-0 -z-10 w-full h-full" />
      </div>

      {/* 2. Measured contrast scrim to balance illumination and ensure text is high-contrast and readable */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-slate-950/75" />

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

          {/* Nút bật tắt âm thanh */}
          <button
            type="button"
            onClick={onToggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/30 text-white hover:bg-black/55 transition-all text-xs font-semibold shadow-xs bouncy cursor-pointer"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#ffb066] animate-pulse" />
                <span className="hidden sm:inline">Tắt nhạc</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-white/80" />
                <span className="hidden sm:inline">Bật nhạc</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 4. Central Content Card: Đặt trong khung thủy tinh mờ giúp làm nổi bật chữ tối đa, cân đối trên/dưới */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 my-auto py-2">
        <div className="w-full max-w-xl mx-auto p-5 sm:p-7 rounded-3xl bg-slate-950/45 backdrop-blur-md border border-white/20 shadow-2xl text-center flex flex-col items-center">
          {/* Tiêu đề chính lớn, nổi bật với sắc vàng hoàng hôn */}
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-wider text-white drop-shadow-lg leading-[1.18]">
            HÀNH TRÌNH
            <br />
            XÂY DỰNG
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#fed7aa] to-orange-300 drop-shadow-md">
              ƯỚC MƠ
            </span>
          </h1>

          {/* Tagline thông điệp */}
          <div className="mt-2 sm:mt-3 text-sm sm:text-lg text-amber-200 font-semibold italic drop-shadow-sm">
            Hiểu mình hôm nay — Kiến tạo ngày mai
          </div>

          {/* Mô tả dễ đọc trên nền tối mờ */}
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-slate-100 max-w-md mx-auto font-normal leading-relaxed drop-shadow-xs">
            Khám phá sự bền bỉ, mục đích sống và khả năng tự kiểm soát để hiểu hơn về hành trình ước mơ của chính em.
          </p>

          {/* Nút Bắt đầu hành trình: Cam Pastel #ff7c00 bo góc rounded-2xl nảy nhẹ */}
          <div className="mt-4 sm:mt-5">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#ff7c00] hover:bg-[#e67000] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-950/60 transition-all cursor-pointer bouncy border border-orange-400/50"
            >
              <span className="text-amber-200">✦</span>
              <span>Bắt đầu hành trình →</span>
            </button>
          </div>

          {/* Dòng thông tin phụ */}
          <div className="mt-3 text-[11px] sm:text-xs text-slate-200/90 font-medium tracking-wide">
            24 câu hỏi · 7–10 phút · Kết quả ngay · Không cần đăng nhập
          </div>

          {/* Câu trích dẫn khích lệ */}
          <div className="mt-1.5 text-xs sm:text-sm text-amber-200/95 italic font-serif">
            “Ước mơ không xa vời khi bạn hiểu rõ chính mình.”
          </div>
        </div>
      </main>

      {/* 5. Bottom Imprint Bar (Điểm dưới cùng - Cân đối tuyệt đối với điểm trên cùng) */}
      <footer className="relative z-10 w-full text-center pb-3.5 text-[10px] sm:text-xs text-white/60 tracking-wider shrink-0 drop-shadow-sm">
        HÀNH TRÌNH XÂY DỰNG ƯỚC MƠ · Grit · Purpose · Self-Control · Phiên bản thử nghiệm
      </footer>
    </div>
  );
};
