import React, { useState, useRef } from 'react';
import { Sun, Moon, Sparkles, Sliders, Menu, X, Video, Film, Mail, ExternalLink, Lock, ShieldCheck, LayoutDashboard, Languages, Camera, User, Smartphone } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenMobileSimulator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme, onOpenMobileSimulator }) => {
  const isDark = theme === 'dark';
  const {
    data,
    updateProfilePic,
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
  const { personalInfo, profilePic } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleNavPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateProfilePic(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
        
        {/* Brand / Logo & Profile Photo Frame */}
        <div className="flex items-center gap-3">
          {/* Profile Photo Slot (ঘর) */}
          <div className="relative group shrink-0">
            <div
              onClick={() => {
                if (isAdmin) {
                  navPhotoInputRef.current?.click();
                }
              }}
              title={
                isAdmin
                  ? (profilePic ? 'প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন' : 'প্রোফাইল ছবি আপলোড করতে ক্লিক করুন')
                  : personalInfo.name
              }
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden ring-2 transition-all flex items-center justify-center shadow-lg relative ${
                profilePic
                  ? 'ring-amber-500/60 bg-slate-900'
                  : 'ring-amber-500/40 bg-gradient-to-tr from-amber-500 via-amber-400 to-rose-500'
              } ${isAdmin ? 'cursor-pointer hover:scale-105 hover:ring-amber-400' : ''}`}
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

              {/* Admin Camera Hover Overlay */}
              {isAdmin && (
                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-400">
                  <Camera className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Admin Floating Camera Badge */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navPhotoInputRef.current?.click()}
                title="ছবি আপলোড / পরিবর্তন করুন"
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md border border-slate-900 cursor-pointer transition-transform hover:scale-110"
              >
                <Camera className="w-3 h-3" />
              </button>
            )}

            {/* Hidden Input for Nav Photo Upload */}
            <input
              type="file"
              ref={navPhotoInputRef}
              onChange={handleNavPhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <a href="#featured-work" className="flex flex-col group">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight group-hover:text-amber-500 transition-colors">
              {personalInfo.name}
            </span>
            <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{personalInfo.role}</span>
            </span>
          </a>
        </div>

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

          {/* Admin Dashboard & Customize Buttons (Only visible when authenticated as Admin via /admin) */}
          {isAdmin && (
            <>
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
            </>
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
