import React, { useState } from 'react';
import { Shield, Lock, X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { safeFetchJson } from '../utils/api.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Use relative endpoint /api/admin/login with safe JSON parser
      let res = await safeFetchJson<{ success: boolean; token: string; message?: string }>(
        '/api/admin/login',
        {
          method: 'POST',
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        }
      );

      // Fallback route check in case Vercel rewrites directly to /api/login
      if (res.status === 404) {
        res = await safeFetchJson<{ success: boolean; token: string; message?: string }>(
          '/api/login',
          {
            method: 'POST',
            body: JSON.stringify({ username: username.trim(), password: password.trim() }),
          }
        );
      }

      if (!res.ok) {
        throw new Error(res.message || 'Tài khoản hoặc mật khẩu không chính xác');
      }

      if (!res.data?.token) {
        throw new Error('Máy chủ không trả về token xác thực hợp lệ');
      }

      onSuccess(res.data.token);
      setUsername('');
      setPassword('');
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi đăng nhập');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm rounded-2xl bg-[#fdfdfd] p-6 shadow-2xl border border-[#0a6962]/20 font-serif">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[#edf6f5] border border-[#0a6962]/20 flex items-center justify-center text-[#0a6962] shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0a6962] leading-tight">
                Cài đặt & Quản trị hệ thống
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                Xác thực để điều chỉnh khung & câu hỏi khảo sát
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer bouncy-tap"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Biểu mẫu đăng nhập bảo mật */}
        <form onSubmit={handleAdminLogin} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tài khoản Quản trị viên
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản"
              className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-300/90 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a6962]/20 focus:border-[#0a6962] font-sans shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs rounded-2xl border border-slate-300/90 bg-white pr-9 focus:outline-none focus:ring-2 focus:ring-[#0a6962]/20 focus:border-[#0a6962] font-sans shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer bouncy shadow-xs border border-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl text-xs font-bold bg-[#ff7c00] hover:bg-[#e67000] text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer bouncy border border-orange-400/40"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập Quản trị viên'}</span>
            </button>
          </div>
        </form>

        {/* Ghi chú bảo mật */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-snug">
          Khu vực bảo mật dành riêng cho người quản lý khảo sát. Vui lòng không chia sẻ thông tin truy cập.
        </div>
      </div>
    </div>
  );
};
