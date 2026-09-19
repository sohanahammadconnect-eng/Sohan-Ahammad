import React from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { ThemeMode } from '../types';
import { PERSONAL_INFO } from '../portfolioData';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className={`py-10 border-t transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950 border-slate-900 text-slate-400'
          : 'bg-slate-100/70 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs">
          <span className="font-semibold text-slate-200">
            © {new Date().getFullYear()} {PERSONAL_INFO.name}
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span>Video Editor & Visual Storyteller</span>
        </div>

        {/* Back to top button */}
        <button
          id="scroll-to-top-button"
          onClick={scrollToTop}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

      </div>
    </footer>
  );
};
