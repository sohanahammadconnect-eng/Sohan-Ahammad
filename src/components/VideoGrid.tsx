import React from 'react';
import {
  ExternalLink,
  Film,
  Youtube,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';

interface VideoGridProps {
  theme: ThemeMode;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, t, language } = usePortfolio();
  const videos = data.portfolioVideos;
  const youtubeChannelUrl = data.personalInfo.youtubeChannelUrl || 'https://www.youtube.com';

  return (
    <section id="video-portfolio" className="py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
              <Film className="w-4 h-4" />
              <span>{t('videos_badge_selected')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                id="video-portfolio-heading"
                className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t('videos_title')}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                {videos.length} {language === 'bn' ? 'টি ভিডিও' : 'Videos'}
              </span>
            </div>
          </div>
          <p
            className={`text-sm max-w-md ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {t('videos_subtitle')}
          </p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on md/lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video, index) => {
            const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

            return (
              <div
                key={video.id}
                id={`video-card-${index + 1}`}
                className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:shadow-amber-500/5'
                    : 'bg-white border-slate-200 hover:border-amber-500/40 hover:shadow-slate-300/60'
                }`}
              >
                {/* 16:9 Responsive video player container */}
                <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                  <PortfolioVideoPlayer video={video} />
                </div>

                {/* Card Information */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isDark
                            ? 'bg-slate-800 text-amber-400 border border-slate-700/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {video.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {video.videoSourceType === 'local' ? (
                          <span
                            className="text-xs flex items-center gap-1 font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                            title="Direct video file uploaded"
                          >
                            <Film className="w-3 h-3" />
                            <span>Direct Video</span>
                          </span>
                        ) : (
                          <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Watch on YouTube in new tab"
                            className={`text-xs flex items-center gap-1 font-medium transition-colors hover:text-amber-500 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            <span>YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-lg mb-2 text-current group-hover:text-amber-500 transition-colors">
                      {video.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {video.description}
                    </p>
                  </div>

                  {/* Card bottom info */}
                  <div className="pt-4 mt-4 border-t border-slate-800/40 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Slide #{index + 1}
                    </span>

                    {video.videoSourceType === 'local' ? (
                      <span className="text-[11px] text-emerald-400 font-medium">Uploaded File</span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">ID: {video.youtubeId}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* "ALL VIDEOS" CTA BUTTON                                   */}
        {/* ========================================================= */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Main Action Button: Opens YouTube Channel */}
            <a
              id="btn-all-videos-youtube"
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white shadow-xl shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <Youtube className="w-5 h-5 text-white fill-current transition-transform group-hover:scale-110" />
              <span>All Videos</span>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Click <span className="font-semibold text-red-400">&quot;All Videos&quot;</span> to explore the complete catalog of projects directly on YouTube.
          </p>
        </div>

      </div>
    </section>
  );
};
