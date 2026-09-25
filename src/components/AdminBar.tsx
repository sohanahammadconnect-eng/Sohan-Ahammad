import React from 'react';
import { ShieldCheck, Plus, Video, Image as ImageIcon, LayoutDashboard, LogOut, Settings, Languages, KeyRound } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminBar: React.FC = () => {
  const { isAdmin, hasCustomPassword, setShowAdminDashboard, logoutAdmin, openEditModal, language, toggleLanguage, t } = usePortfolio();

  if (!isAdmin) return null;

  return (
    <div
      id="admin-top-active-bar"
      className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-amber-500/30 text-white backdrop-blur-md px-4 py-2 text-xs shadow-xl animate-fade-in"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('admin_bar_active')}</span>
          </div>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            {t('admin_bar_hint')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Language Toggle in Admin Bar */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px]"
            title={language === 'bn' ? t('nav_switch_to_en') : t('nav_switch_to_bn')}
          >
            <Languages className="w-3 h-3" />
            <span>{language === 'bn' ? 'English করুন' : 'বাংলা করুন'}</span>
          </button>

          {/* Quick Password Setup / Security button */}
          <button
            type="button"
            onClick={() => setShowAdminDashboard(true)}
            className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] border ${
              !hasCustomPassword
                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={language === 'bn' ? 'পাসওয়ার্ড সিকিউরিটি' : 'Password Security'}
          >
            <KeyRound className="w-3 h-3 text-amber-400" />
            <span>{!hasCustomPassword ? (language === 'bn' ? 'পাসওয়ার্ড সেট করুন' : 'Set Password') : (language === 'bn' ? 'সিকিউরিটি' : 'Security')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdminDashboard(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 text-[11px]"
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>{t('admin_bar_dashboard')}</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-all cursor-pointer text-[11px]"
            title={t('admin_bar_logout')}
          >
            <LogOut className="w-3 h-3" />
            <span>{t('admin_bar_logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

