import React, { useState } from 'react';
import { VisionPackagingLogo } from './VisionPackagingLogo';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  addToast
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Retrieve configured credentials, fallback to defaults
    const savedUsername = localStorage.getItem('portal_username') || 'admin';
    const savedPassword = localStorage.getItem('portal_password') || 'admin123';

    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in all security fields.');
      return;
    }

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password;

    // Check against standard defaults and custom configured values
    const isDefaultAdmin = enteredUser === 'admin' && enteredPass === 'admin123';
    const isDefaultVision = enteredUser === 'vision' && enteredPass === 'vision123';
    const isSavedConfig = enteredUser === savedUsername.toLowerCase() && enteredPass === savedPassword;

    if (isDefaultAdmin || isDefaultVision || isSavedConfig) {
      sessionStorage.setItem('portal_role', 'admin');
      addToast('Welcome back! Admin authentication approved.', 'success');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid username or password. Please try again.');
      addToast('Login Failed: Access Denied.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md no-print">
      <div className="w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Main Branding Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Department Heading */}
          <div className="space-y-4">
            <VisionPackagingLogo layout="vertical" size="xl" showText={false} light={false} />
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                Vision Food & Packaging
              </h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                Fleet Management — Admin Portal
              </p>
              <p className="text-[9px] font-medium text-slate-400 leading-relaxed max-w-[320px] mx-auto pt-1">
                Plot 363,364 & 366 Sundar Industrial Estate, Raiwind Road, Lahore
              </p>
              <div className="h-[2px] w-12 bg-rose-600 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Secure access notice */}
          <div className="bg-[#154294]/10 border border-[#154294]/25 p-3 rounded-xl text-center">
            <p className="text-[11px] font-medium text-slate-300 leading-normal">
              Enter admin username and password to enable editing, logs addition, and backup management.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-[#154294]/80 text-slate-200 placeholder-slate-600 rounded-xl text-sm outline-none transition-all font-sans font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-950 border border-slate-800 focus:border-[#154294]/80 text-slate-200 placeholder-slate-600 rounded-xl text-sm outline-none transition-all font-sans font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-[#154294] hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl text-sm cursor-pointer shadow-lg shadow-blue-900/20 hover:shadow-blue-700/30 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Unlock Admin Write Access
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
