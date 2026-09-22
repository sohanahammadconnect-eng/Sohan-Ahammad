import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Sliders, Menu, X, Video, Film, Mail, ExternalLink, Lock, ShieldCheck, LayoutDashboard, Languages } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';
  const {
    data,
    openEditModal,
    isAdmin,
    openAdminDashboard,
    setShowAdminLoginModal,
    setShowAdminDashboard,
    language,
    toggleLanguage,
    setLanguage,
    t,
  } = usePortfolio();
  const { personalInfo } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
        isDark
          ? 'bg-slate-950/85 border-slate-800/80 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#featured-work" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-rose-500 flex items-center justify-center text-slate-950 font-display font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            {personalInfo.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight group-hover:text-amber-500 transition-colors">
              {personalInfo.name}
            </span>
            <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{personalInfo.role}</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <a
            href="#featured-work"
            className={`transition-colors hover:text-amber-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {t('nav_featured')}
          </a>
          <a
            href="#video-portfolio"
            className={`transition-colors hover:text-amber-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {t('nav_videos')}
          </a>
          <a
            href="#graphics-portfolio"
            className={`transition-colors hover:text-amber-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {t('nav_graphics')}
          </a>
          <a
            href="#about"
            className={`transition-colors hover:text-amber-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {t('nav_about')}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher Pill */}
          <button
            id="btn-language-toggle"
            type="button"
            onClick={toggleLanguage}
            title={language === 'bn' ? t('nav_switch_to_en') : t('nav_switch_to_bn')}
            className={`group px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
              isDark
                ? 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-amber-500/50 hover:text-amber-400'
                : 'border-slate-300 bg-slate-100/90 text-slate-800 hover:border-amber-500/50 hover:text-amber-600'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-amber-500 transition-transform group-hover:rotate-12" />
            <div className="flex items-center gap-1">
              <span className={language === 'bn' ? 'text-amber-500 font-black' : 'text-slate-400 font-semibold'}>
                বাং
              </span>
              <span className="text-slate-500 text-[10px]">/</span>
              <span className={language === 'en' ? 'text-amber-500 font-black' : 'text-slate-400 font-semibold'}>
                EN
              </span>
            </div>
          </button>

          {/* Admin Panel Button */}
          {isAdmin ? (
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
          ) : (
            <button
              id="btn-navbar-admin-login"
              type="button"
              onClick={() => setShowAdminLoginModal(true)}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/40'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:text-amber-600 hover:border-amber-500/40'
              }`}
              title={t('nav_admin_login')}
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">{t('nav_admin_login')}</span>
              <span className="sm:hidden">Admin</span>
            </button>
          )}

          {/* Quick Edit / Customize Button */}
          <button
            id="btn-edit-portfolio"
            type="button"
            onClick={() => openEditModal('all')}
            title={t('nav_customize')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">{t('nav_customize')}</span>
          </button>

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

          <div className="pt-2 border-t border-slate-800">
            {isAdmin ? (
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
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAdminLoginModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 text-amber-400 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>{t('nav_admin_login')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
