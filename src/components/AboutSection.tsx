import React from 'react';
import { User, Check, Wrench, Edit3 } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutSectionProps {
  theme: ThemeMode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, openEditModal } = usePortfolio();
  const personalInfo = data.personalInfo;

  return (
    <section id="about-me" className="py-14 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500">
            <User className="w-4 h-4" />
            <span>My Story & Philosophy</span>
          </div>
          <button
            onClick={() => openEditModal('bio')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Bio</span>
          </button>
        </div>
        
        <h2
          id="about-me-heading"
          className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight mb-8 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          About Me
        </h2>

        {/* Bio Card */}
        <div
          id="about-bio-card"
          className={`rounded-3xl p-6 sm:p-10 border transition-all duration-300 relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-md shadow-slate-200/50'
          }`}
        >
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* User's Exact Honest Passionate Bio Quote */}
          <div className="relative mb-8">
            <span className="text-amber-500 font-serif text-5xl sm:text-6xl absolute -top-4 -left-3 opacity-20 select-none">
              “
            </span>
            <p
              id="about-bio-text"
              className={`text-base sm:text-xl font-normal leading-relaxed pl-4 sm:pl-6 border-l-2 border-amber-500/80 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {personalInfo.bio}
            </p>
          </div>

          {/* Pillars of Craft */}
          <div className="pt-4 border-t border-slate-800/60">
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Core Focus & Discipline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalInfo.strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-semibold text-sm text-amber-500">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{strength.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90 pl-6">
                    {strength.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Software & Tooling Workflow */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>Editing Toolkit</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {personalInfo.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-lg border font-medium ${
                    isDark
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
