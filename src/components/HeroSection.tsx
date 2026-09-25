import React from 'react';
import { Sparkles, ArrowRight, Video, Mail, CheckCircle2, Film } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';

interface HeroSectionProps {
  theme: ThemeMode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, t } = usePortfolio();

  const { featuredVideo, personalInfo, profilePic } = data;

  return (
    <section id="featured-work" className="pt-6 sm:pt-10 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        
        {/* ========================================================= */}
        {/* 1. HERO GREETING & LARGE PROFILE PICTURE PANEL (AT THE TOP) */}
        {/* ========================================================= */}
        <div
          id="hero-greeting-card"
          className={`rounded-3xl p-6 sm:p-10 lg:p-12 border transition-all duration-300 relative overflow-hidden shadow-2xl ${
            isDark
              ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border-slate-800/90 shadow-black/50'
              : 'bg-gradient-to-br from-white via-slate-50 to-amber-50/30 border-slate-200/90 shadow-slate-200/70'
          }`}
        >
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 relative z-10">
            
            {/* Prominent Large Profile Image - Protected Display Only */}
            <div className="relative shrink-0 select-none">
              <div
                id="profile-avatar-container"
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-3xl overflow-hidden ring-4 ring-amber-500/40 shadow-2xl relative bg-slate-900 flex items-center justify-center transition-all duration-300"
              >
                {profilePic ? (
                  <img
                    id="profile-avatar-img"
                    src={profilePic}
                    alt={`${personalInfo.name} - Video Editor`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 text-amber-400 p-4 text-center select-none">
                    <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-wider text-amber-400 drop-shadow-md">
                      SA
                    </span>
                  </div>
                )}
              </div>

              {/* Available status badge */}
              <div
                className="absolute -bottom-2.5 -right-2.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-lg flex items-center gap-1.5 border-2 border-slate-950"
                title="Available for freelance & remote contracts"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Available</span>
              </div>
            </div>

            {/* Greeting & Headline */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3.5">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                    isDark
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      : 'bg-amber-50 border-amber-300 text-amber-700'
                  }`}
                >
                  <Video className="w-4 h-4 text-amber-500" />
                  <span>{personalInfo.role}</span>
                </div>
              </div>

              <h1
                id="hero-greeting-title"
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t('hero_greeting_hi')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500">{personalInfo.name}</span>.
              </h1>

              <p
                id="hero-greeting-description"
                className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {t('hero_welcome_desc')}
              </p>

              {/* Call-to-actions: Explore Works & Get in Touch */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a
                  href="#video-portfolio"
                  className="px-6 py-3 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
                >
                  <span>{t('hero_explore_works')}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base border transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 shadow-md ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>{t('hero_get_in_touch')}</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. FEATURED / BEST VIDEO SHOWREEL (BELOW THE GREETING PANEL) */}
        {/* ========================================================= */}
        <div>
          {/* Header meta badge */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('featured_showreel_badge')}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}
              >
                1080p 60fps
              </span>
            </div>
          </div>

          {/* 16:9 Video Container with subtle shadow */}
          <div
            id="featured-video-container"
            className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl group ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="aspect-video w-full bg-black relative">
              <PortfolioVideoPlayer video={featuredVideo} />
            </div>

            {/* Video Footer info */}
            <div
              className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark ? 'bg-slate-950/70 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-500">{featuredVideo.category}</span>
                <span>•</span>
                <span className="font-semibold text-slate-200">{featuredVideo.title}</span>
              </div>
              {featuredVideo.videoSourceType === 'local' ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <Film className="w-3.5 h-3.5" />
                  <span>Direct Upload Video</span>
                </span>
              ) : (
                <a
                  href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-500 transition-colors flex items-center gap-1.5 font-bold text-amber-400"
                >
                  <span>Watch on YouTube</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
