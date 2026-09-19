import React from 'react';
import { Sun, Moon, Code2, Upload, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCodeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenCodeModal,
}) => {
  const isDark = theme === 'dark';
  const { data, openEditModal } = usePortfolio();
  const personalInfo = data.personalInfo;

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b ${
        isDark
          ? 'bg-slate-950/85 border-slate-800/80 text-white'
          : 'bg-white/85 border-slate-200/90 text-slate-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Name on Left */}
        <a
          id="nav-brand-link"
          href="#"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-sm">
            {personalInfo.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight group-hover:text-amber-500 transition-colors">
              {personalInfo.name}
            </span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-amber-500/90 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {personalInfo.role}
            </span>
          </div>
        </a>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a
            id="nav-link-featured"
            href="#featured-work"
            className={`transition-colors hover:text-amber-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Featured
          </a>
          <a
            id="nav-link-videos"
            href="#video-portfolio"
            className={`transition-colors hover:text-amber-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Videos
          </a>
          <a
            id="nav-link-graphics"
            href="#graphic-designs"
            className={`transition-colors hover:text-amber-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Graphics
          </a>
          <a
            id="nav-link-about"
            href="#about-me"
            className={`transition-colors hover:text-amber-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            About
          </a>
          <a
            id="nav-link-contact"
            href="#contact"
            className={`transition-colors hover:text-amber-500 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Right Action Controls: Media Uploader + Single-File HTML exporter + Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* UPLOAD / CUSTOMIZE BUTTON */}
          <button
            id="open-upload-modal-button"
            onClick={() => openEditModal('all')}
            title="Upload your own photos, change videos, and edit info"
            className="px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">আপলোড / কাস্টমাইজ</span>
            <span className="sm:hidden">আপলোড</span>
          </button>

          <button
            id="open-source-code-button"
            onClick={onOpenCodeModal}
            title="View & copy single-file standalone HTML code"
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border ${
              isDark
                ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:border-amber-500/50'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-amber-500/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">HTML Code</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="text-xs font-medium pr-1 hidden xs:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-medium pr-1 hidden xs:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
