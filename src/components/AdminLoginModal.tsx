import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, X, ShieldAlert, ArrowRight, Languages, Sparkles, RefreshCw } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminLoginModal: React.FC = () => {
  const {
    showAdminLoginModal,
    setShowAdminLoginModal,
    loginAdmin,
    resetAdminPasswordToDefault,
    language,
    toggleLanguage,
    t
  } = usePortfolio();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!showAdminLoginModal) return null;

  const handleClose = () => {
    setShowAdminLoginModal(false);
    setPassword('');
    setError(null);
    setSuccess(false);
  };

  const executeLogin = (pass: string) => {
    const ok = loginAdmin(pass);
    if (ok) {
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        handleClose();
      }, 700);
      return true;
    } else {
      setError(language === 'bn' ? 'পাসওয়ার্ডটি সঠিক নয়! অনুগ্রহ করে "sohan123" ব্যবহার করুন।' : 'Incorrect password! Please use "sohan123".');
      return false;
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const targetPass = password.trim() || 'sohan123';
    executeLogin(targetPass);
  };

  const handleDirectSohanLogin = () => {
    setPassword('sohan123');
    resetAdminPasswordToDefault();
    executeLogin('sohan123');
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={handleClose}
    >
      <div
        id="admin-login-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-slate-900 text-white shadow-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top actions: Language switch & Close */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title={language === 'bn' ? t('nav_switch_to_en') : t('nav_switch_to_bn')}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold mb-5 shadow-lg shadow-amber-500/20">
          <Lock className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="font-display font-extrabold text-2xl tracking-tight text-white mb-1.5">
          {t('admin_login_title')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          {t('admin_login_desc')}
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('admin_login_label')}
              </label>
              <button
                type="button"
                onClick={handleDirectSohanLogin}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer underline underline-offset-2"
              >
                <Sparkles className="w-3 h-3" />
                <span>{language === 'bn' ? 'sohan123 অটো-লগইন' : 'Use sohan123'}</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder={t('admin_login_placeholder')}
                autoFocus
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-700 bg-slate-950/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message with 1-click Reset */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex flex-col gap-2 animate-shake">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={handleDirectSohanLogin}
                className="mt-1 py-1.5 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 self-start hover:bg-amber-400 cursor-pointer shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '১-ক্লিকে sohan123 দিয়ে লগইন করুন' : '1-Click Login with sohan123'}</span>
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{language === 'bn' ? 'লগইন সফল হয়েছে! অ্যাডমিন ড্যাশবোর্ড ওপেন হচ্ছে...' : 'Login successful! Opening dashboard...'}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="btn-admin-submit-login"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{t('admin_login_btn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Master Login Helper */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{language === 'bn' ? 'মাস্টার পাসওয়ার্ড:' : 'Master Password:'} <code className="text-amber-400 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">sohan123</code></span>
          <button
            type="button"
            onClick={handleDirectSohanLogin}
            className="text-amber-400 hover:underline font-bold cursor-pointer"
          >
            {language === 'bn' ? 'সরাসরি প্রবেশ করুন' : 'Instant Login'}
          </button>
        </div>

        {/* Hint / Helper for owner */}
        <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('admin_login_hint')}
          </p>
        </div>
      </div>
    </div>
  );
};

