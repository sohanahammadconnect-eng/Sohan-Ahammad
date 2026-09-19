import React, { useState } from 'react';
import { ExternalLink, Film, Edit3, Youtube, Check, X, Link2 } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface VideoGridProps {
  theme: ThemeMode;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, openEditModal, updatePersonalInfo } = usePortfolio();
  const videos = data.portfolioVideos;
  const youtubeChannelUrl = data.personalInfo.youtubeChannelUrl || 'https://www.youtube.com';

  const [isEditingChannel, setIsEditingChannel] = useState(false);
  const [channelInput, setChannelInput] = useState(youtubeChannelUrl);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveChannel = () => {
    let url = channelInput.trim();
    if (!url) url = 'https://www.youtube.com';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    updatePersonalInfo({ youtubeChannelUrl: url });
    setIsEditingChannel(false);
    setToastMessage('YouTube চ্যানেল লিংক সংরক্ষিত হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <section id="video-portfolio" className="py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
              <Film className="w-4 h-4" />
              <span>Selected Works</span>
            </div>
            <div className="flex items-center gap-3">
              <h2
                id="video-portfolio-heading"
                className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Video Portfolio
              </h2>
              <button
                onClick={() => openEditModal('videos')}
                title="Change or update video links"
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>ভিডিও পরিবর্তন করুন</span>
              </button>
            </div>
          </div>
          <p
            className={`text-sm max-w-md ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Narrative edits, commercial cuts, and rhythm-synchronized visual storytelling.
          </p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on md/lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video, index) => {
            const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
            const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`;

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
                {/* 16:9 Responsive iframe container */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full border-0"
                  ></iframe>

                  {/* Inline quick edit button */}
                  <button
                    onClick={() => openEditModal('videos', video.id)}
                    title="Change this video"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white/80 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-semibold"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Edit Video</span>
                  </button>
                </div>

                {/* Card Information */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
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
                        <button
                          onClick={() => openEditModal('videos', video.id)}
                          className="text-[11px] text-amber-500/80 hover:text-amber-400 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Change</span>
                        </button>
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
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-display font-bold mb-2 group-hover:text-amber-500 transition-colors ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {video.title}
                    </h3>

                    {video.description && (
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* End of videos grid */}

        {/* ========================================================= */}
        {/* "ALL VIDEOS" CTA BUTTON & CHANNEL LINK SETUP              */}
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

            {/* Quick Edit YouTube Channel Link Button */}
            <button
              id="btn-edit-youtube-channel-link"
              type="button"
              onClick={() => {
                setChannelInput(youtubeChannelUrl);
                setIsEditingChannel(true);
              }}
              title="আপনার YouTube চ্যানেল লিংক সেট বা পরিবর্তন করুন"
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-amber-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">চ্যানেল লিংক পরিবর্তন</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Click <span className="font-semibold text-red-400">"All Videos"</span> to explore the complete catalog of projects directly on YouTube.
          </p>

          {toastMessage && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

      </div>

      {/* Quick Edit YouTube Channel Link Modal */}
      {isEditingChannel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsEditingChannel(false)}
        >
          <div
            className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">
                    YouTube চ্যানেল লিংক সেট করুন
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    "All Videos" বাটনে ক্লিক করলে ভিজিটররা এই চ্যানেলে যাবে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingChannel(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  YouTube Channel URL:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    placeholder="https://www.youtube.com/@yourchannel"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                💡 উদাহরণ: <code>https://www.youtube.com/@SohanAhammad</code> অথবা <code>https://youtube.com/channel/UC...</code>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingChannel(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveChannel}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md flex items-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>লিংক সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
