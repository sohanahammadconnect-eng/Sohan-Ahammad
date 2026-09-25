import React, { useState } from 'react';
import { Sun, Moon, Menu, X, LayoutDashboard, Languages } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenMobileSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  const {
    data,
    isAdmin,
    setShowAdminDashboard,
    language,
    toggleLanguage,
    setLanguage,
    t,
  } = usePortfolio();
  const { personalInfo, profilePic } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-colors ${
        isDark
          ? 'bg-slate-950/85 border-slate-800/80 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand / Logo & Profile Photo Frame */}
        <div className="flex items-center gap-3">
          {/* Profile Photo Slot (Display only) */}
          <div className="relative shrink-0 select-none">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden ring-2 transition-all flex items-center justify-center shadow-lg relative ${
                profilePic
                  ? 'ring-amber-500/60 bg-slate-900'
                  : 'ring-amber-500/40 bg-gradient-to-tr from-amber-500 via-amber-400 to-rose-500'
              }`}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt={personalInfo.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <span className="font-display font-black text-xl text-slate-950 select-none">
                  {personalInfo.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <a href="#featured-work" className="flex flex-col group">
            <span
              id="brand-name-logo"
              className="font-display font-black text-lg sm:text-xl tracking-tight group-hover:text-amber-500 transition-colors"
            >
              {personalInfo.name}
            </span>
            <span className="text-[11px] font-medium text-amber-500 uppercase tracking-wider">
              {personalInfo.role}
            </span>
          </a>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a
            href="#featured-work"
            className="hover:text-amber-500 transition-colors text-slate-300 hover:text-white"
          >
            {t('nav_featured')}
          </a>
          <a
            href="#video-portfolio"
            className="hover:text-amber-500 transition-colors text-slate-300 hover:text-white"
          >
            {t('nav_videos')}
          </a>
          <a
            href="#graphics-portfolio"
            className="hover:text-amber-500 transition-colors text-slate-300 hover:text-white"
          >
            {t('nav_graphics')}
          </a>
          <a
            href="#about"
            className="hover:text-amber-500 transition-colors text-slate-300 hover:text-white"
          >
            {t('nav_about')}
          </a>
        </nav>

        {/* Right Action Icons: Language Toggle, Theme Toggle, Admin Dashboard (if logged in) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Multi-language Selector (English / বাংলা) */}
          <button
            id="btn-language-toggle"
            type="button"
            onClick={toggleLanguage}
            title={language === 'bn' ? t('nav_switch_to_en') : t('nav_switch_to_bn')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
              isDark
                ? 'border-slate-800 bg-slate-900/90 text-amber-400 hover:bg-slate-800 hover:border-amber-500/40'
                : 'border-slate-300 bg-slate-100 text-amber-700 hover:bg-slate-200 hover:border-amber-400'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            <div className="flex items-center gap-1">
              <span className={language === 'bn' ? 'text-amber-400 font-extrabold' : 'text-slate-400 text-[11px]'}>
                বাং
              </span>
              <span className="text-slate-500 text-[10px]">/</span>
              <span className={language === 'en' ? 'text-amber-400 font-extrabold' : 'text-slate-400 text-[11px]'}>
                EN
              </span>
            </div>
          </button>

          {/* Admin Dashboard Button (Only visible when authenticated as Admin via /admin) */}
          {isAdmin && (
            <button
              id="btn-navbar-admin-dashboard"
              type="button"
              onClick={() => setShowAdminDashboard(true)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
              title={t('nav_admin_dashboard')}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('nav_admin_dashboard')}</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            id="btn-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 py-4 border-b space-y-3 animate-fade-in ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Mobile Language Switcher Row */}
          <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('nav_lang_label')}:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'bn'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <a
            href="#featured-work"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-amber-500 transition-colors"
          >
            {t('nav_featured')}
          </a>
          <a
            href="#video-portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-amber-500 transition-colors"
          >
            {t('nav_videos')}
          </a>
          <a
            href="#graphics-portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-amber-500 transition-colors"
          >
            {t('nav_graphics')}
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold hover:text-amber-500 transition-colors"
          >
            {t('nav_about')}
          </a>

          {isAdmin && (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAdminDashboard(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('nav_admin_dashboard')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
