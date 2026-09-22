import React from 'react';
import { Mail, MessageCircle, MapPin, Clock, Sparkles, ExternalLink, Heart, Edit3, Lock } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface AboutAndContactProps {
  theme: ThemeMode;
}

export const AboutAndContact: React.FC<AboutAndContactProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, openEditModal, isAdmin, setShowAdminDashboard, setShowAdminLoginModal, t, language } = usePortfolio();
  const { personalInfo } = data;

  const mailtoLink = `mailto:${personalInfo.email}?subject=Project%20Inquiry%20from%20Portfolio&body=Hi%20Sohan,%0A%0AI%20came%20across%20your%20video%20editing%20portfolio%20and%20would%20like%20to%20collaborate%20on%20a%20project!`;

  return (
    <>
      {/* ========================================================= */}
      {/* ABOUT ME SECTION                                          */}
      {/* ========================================================= */}
      <section id="about" className="py-14 sm:py-16 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{t('about_badge_background')}</span>
              </div>
              <h2
                id="about-heading"
                className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t('about_title')}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => openEditModal('bio')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>{t('about_btn_edit_bio')}</span>
            </button>
          </div>

          <div
            className={`rounded-3xl p-6 sm:p-10 border transition-all ${
              isDark
                ? 'bg-slate-900/60 border-slate-800/90 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-lg'
            }`}
          >
            <blockquote
              className={`text-base sm:text-lg leading-relaxed pl-4 sm:pl-6 border-l-4 border-amber-500 mb-8 italic ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              "{personalInfo.bio}"
            </blockquote>

            {/* Strengths Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800/60">
              {personalInfo.strengths && personalInfo.strengths.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h4 className="font-display font-bold text-sm text-amber-400 mb-1">
                    {s.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Editing Tools Badges */}
            {personalInfo.tools && personalInfo.tools.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-3">
                  {t('about_tools_heading')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                        isDark
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-100 border-slate-300 text-slate-800'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTACT SECTION                                           */}
      {/* ========================================================= */}
      <section id="contact" className="py-16 sm:py-20 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`rounded-3xl p-8 sm:p-14 border text-center relative overflow-hidden shadow-2xl ${
              isDark
                ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
                : 'bg-gradient-to-b from-slate-50 via-white to-amber-50/30 border-slate-200'
            }`}
          >
            {/* Top availability pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{personalInfo.availability || (language === 'bn' ? 'বিশ্বব্যাপী রিমোট ও ফ্রিল্যান্স প্রজেক্টের জন্য উন্মুক্ত' : 'Available for Worldwide Remote & Freelance Projects')}</span>
            </div>

            <h2
              id="contact-heading"
              className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t('contact_heading_pre')}{' '}
              <span className="text-amber-500">{t('contact_heading_highlight')}</span>
            </h2>

            <p
              className={`text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {t('contact_subtitle')}
            </p>

            {/* Direct Connect Buttons: WhatsApp & Gmail */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {/* WhatsApp direct chat */}
              <a
                id="btn-contact-whatsapp"
                href={personalInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t('contact_btn_whatsapp')}</span>
              </a>

              {/* Gmail mailto */}
              <a
                id="btn-contact-email"
                href={mailtoLink}
                className={`inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm border transition-all hover:scale-105 active:scale-95 shadow-lg ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white shadow-black/40'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-900 shadow-slate-200'
                }`}
              >
                <Mail className="w-5 h-5 text-amber-500" />
                <span>{t('contact_btn_email')}</span>
              </a>
            </div>

            {/* Location & Response info badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-6 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{personalInfo.location || 'Dhaka, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{personalInfo.responseTime || (language === 'bn' ? 'দ্রুত উত্তর (২ ঘণ্টার মধ্যে)' : 'Quick Response (under 2 hours)')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>Direct Email:</span>
                <span className="font-mono text-amber-400">{personalInfo.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="py-10 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold text-sm">
              {personalInfo.name.charAt(0)}
            </div>
            <span className="font-display font-bold text-slate-200">{personalInfo.name}</span>
            <span>•</span>
            <span>{personalInfo.role}</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <a href="#featured-work" className="hover:text-amber-400 transition-colors">{t('nav_featured')}</a>
            <a href="#video-portfolio" className="hover:text-amber-400 transition-colors">{t('nav_videos')}</a>
            <a href="#graphics-portfolio" className="hover:text-amber-400 transition-colors">{t('nav_graphics')}</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">{t('nav_about')}</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">{t('nav_contact')}</a>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>© {new Date().getFullYear()} {personalInfo.name}. {t('footer_rights')}</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                if (isAdmin) setShowAdminDashboard(true);
                else setShowAdminLoginModal(true);
              }}
              className="hover:text-amber-400 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Admin Portal Access"
            >
              <Lock className="w-3 h-3 text-amber-500/80" />
              <span>{isAdmin ? t('footer_admin_active') : t('footer_admin_login')}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
