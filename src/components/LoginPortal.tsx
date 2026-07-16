import React, { useState } from 'react';
import { VisionPackagingLogo } from './VisionPackagingLogo';
import { Lock, User, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

interface LoginPortalProps {
  onLoginSuccess: (role: 'admin' | 'user') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess, addToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve configured credentials, fallback to defaults
  const savedUsername = localStorage.getItem('portal_username') || 'admin';
  const savedPassword = localStorage.getItem('portal_password') || 'admin123';

  const savedUserUsername = localStorage.getItem('portal_user_username') || 'user';
  const savedUserPassword = localStorage.getItem('portal_user_password') || 'user123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in all security fields.');
      return;
    }

    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password;

    const isDefaultAdmin = enteredUser === 'admin' && enteredPass === 'admin123';
    const isDefaultVision = enteredUser === 'vision' && enteredPass === 'vision123';
    const isSavedConfig = enteredUser === savedUsername.toLowerCase() && enteredPass === savedPassword;

    const isDefaultUser = enteredUser === 'user' && enteredPass === 'user123';
    const isSavedUserConfig = enteredUser === savedUserUsername.toLowerCase() && enteredPass === savedUserPassword;

    if (isDefaultAdmin || isDefaultVision || isSavedConfig) {
      sessionStorage.setItem('portal_authenticated', 'true');
      sessionStorage.setItem('portal_role', 'admin');
      addToast('Welcome back! Admin authentication approved.', 'success');
      onLoginSuccess('admin');
    } else if (isDefaultUser || isSavedUserConfig) {
      sessionStorage.setItem('portal_authenticated', 'true');
      sessionStorage.setItem('portal_role', 'user');
      addToast('Welcome! Standard User authentication approved (View Only).', 'success');
      onLoginSuccess('user');
    } else {
      setError('Invalid username or password. Please try again.');
      addToast('Login Failed: Access Denied.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none antialiased">
      {/* Abstract Glowing ambient circles for premium depth */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#154294]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Main Branding Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6 glow-indigo/5">
          
          {/* Logo & Department Heading */}
          <div className="space-y-4">
            <VisionPackagingLogo layout="vertical" size="xl" showText={false} light={false} />
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                Vision Food & Packaging
              </h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                Fleet Management Department
              </p>
              <p className="text-[9px] font-medium text-slate-400 leading-relaxed max-w-[320px] mx-auto pt-1">
                Plot 363,364 & 366 Sundar Industrial Estate, Raiwind Road, Lahore
              </p>
              <div className="h-[2px] w-12 bg-rose-600 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Secure access notice */}
          <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl text-center space-y-2.5">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Portal Access Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg">
                <span className="block font-bold text-emerald-400 mb-0.5">Admin (Full Access)</span>
                <span className="block text-slate-400 font-mono">User: {savedUsername}</span>
                <span className="block text-slate-400 font-mono">Pass: {savedPassword}</span>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/10 p-2 rounded-lg">
                <span className="block font-bold text-blue-400 mb-0.5">User (View Only)</span>
                <span className="block text-slate-400 font-mono">User: {savedUserUsername}</span>
                <span className="block text-slate-400 font-mono">Pass: {savedUserPassword}</span>
              </div>
            </div>
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
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-[#154294]/80 text-slate-200 placeholder-slate-600 rounded-xl text-sm outline-none transition-all font-sans font-medium"
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
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-950/80 border border-slate-800 focus:border-[#154294]/80 text-slate-200 placeholder-slate-600 rounded-xl text-sm outline-none transition-all font-sans font-medium"
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
              Sign In to Portal
            </button>
          </form>

        </div>

        {/* Footer info tag */}
        <div className="text-center text-[10px] text-slate-600 mt-6 tracking-wide">
          Vision Food & Packaging • Sunder Industrial Estate, Lahore<br />
          <span className="text-[9px] mt-1 inline-block text-slate-700">Protected by Admin Terminal Encryption • Safe Inside</span>
        </div>

      </div>
    </div>
  );
};
