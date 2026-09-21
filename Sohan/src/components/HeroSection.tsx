import React, { useRef, useState } from 'react';
import { Play, Sparkles, ArrowRight, Video, Mail, CheckCircle2, Edit3, Camera, Upload, User, Film, Link2, Check, X, AlertCircle } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';
import { extractYouTubeId } from '../utils/mediaStorage';

interface HeroSectionProps {
  theme: ThemeMode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, updateProfilePic, openEditModal, updateFeaturedVideo } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showQuickLink, setShowQuickLink] = useState(false);
  const [quickLinkVal, setQuickLinkVal] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleFeaturedLinkSubmit = () => {
    const trimmed = quickLinkVal.trim();
    if (!trimmed) {
      setLinkError('দয়া করে আপনার ইউটিউব ভিডিও লিংক বা আইডি লিখুন।');
      return;
    }
    const ytid = extractYouTubeId(trimmed);
    if (!ytid || ytid.length !== 11) {
      setLinkError('সঠিক ইউটিউব ভিডিও লিংক খুঁজে পাওয়া যায়নি।');
      return;
    }

    updateFeaturedVideo({
      youtubeId: ytid,
      videoSourceType: 'youtube',
    });
    setLinkSuccess(true);
    setLinkError(null);
    setTimeout(() => {
      setShowQuickLink(false);
      setLinkSuccess(false);
      setQuickLinkVal('');
    }, 1800);
  };

  const { featuredVideo, personalInfo, profilePic } = data;

  return (
    <section id="featured-work" className="pt-6 sm:pt-10 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* B1. FEATURED / BEST VIDEO (At the very top of the body in a large responsive 16:9 container) */}
        <div className="mb-8">
          {/* Header meta badge */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Showreel / Best Video</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowQuickLink(!showQuickLink);
                  setQuickLinkVal(featuredVideo.youtubeId ? `https://www.youtube.com/watch?v=${featuredVideo.youtubeId}` : '');
                  setLinkError(null);
                  setLinkSuccess(false);
                }}
                title="ফিচারড ভিডিওতে সরাসরি ইউটিউব লিংক জমা দিন"
                className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  showQuickLink
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : isDark
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>লিংক জমা দিন</span>
              </button>

              <button
                onClick={() => openEditModal('featured')}
                title="Change featured video link or upload file"
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}
              >
                1080p 60fps
              </span>
            </div>
          </div>

          {/* Quick Link Submission Drawer for Featured Video */}
          {showQuickLink && (
            <div
              className={`p-4 rounded-xl border mb-4 transition-all animate-fade-in ${
                isDark
                  ? 'bg-slate-950/95 border-amber-500/60 shadow-xl'
                  : 'bg-amber-50/95 border-amber-400 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Featured Video-তে ইউটিউব লিংক জমা দিন</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowQuickLink(false)}
                  className="p-1 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">
                ইউটিউব ভিডিওর লিংক বা আইডি এখানে পেস্ট করে <strong className="text-amber-400">&quot;জমা দিন&quot;</strong> চাপুন। সঙ্গে সঙ্গে প্রধান ট্রেলারে ভিডিওটি যোগ হয়ে যাবে:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={quickLinkVal}
                  onChange={(e) => {
                    setQuickLinkVal(e.target.value);
                    setLinkError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleFeaturedLinkSubmit();
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... বা youtu.be/..."
                  autoFocus
                  className={`flex-1 px-3 py-2 text-xs rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600'
                      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleFeaturedLinkSubmit}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all shrink-0 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>জমা দিন (Submit)</span>
                </button>
              </div>

              {linkError && (
                <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              {linkSuccess && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1.5 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Featured ভিডিও লিংক সফলভাবে জমা হয়েছে!</span>
                </div>
              )}
            </div>
          )}

          {/* 16:9 Video Container with subtle shadow & hover border */}
          <div
            id="featured-video-container"
            className={`relative rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl group ${
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
              className={`px-5 py-3.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark ? 'bg-slate-950/70 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-500">{featuredVideo.category}</span>
                <span>•</span>
                <span className="font-medium text-slate-200">{featuredVideo.title}</span>
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
                  className="hover:text-amber-500 transition-colors flex items-center gap-1 font-medium text-amber-400"
                >
                  <span>Watch on YouTube</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* B2. SHORT GREETING & PROFILE PICTURE (Right below the featured video) */}
        <div
          id="hero-greeting-card"
          className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/90 shadow-xl'
              : 'bg-white border-slate-200/90 shadow-lg'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            
            {/* Profile Picture: Clickable with upload / change option */}
            <div className="relative shrink-0 group">
              <div
                id="profile-avatar-container"
                onClick={() => fileInputRef.current?.click()}
                title={profilePic ? "Click to change profile picture (ছবি পরিবর্তন করতে ক্লিক করুন)" : "Click to upload your profile photo (আপনার ছবি আপলোড করতে ক্লিক করুন)"}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-500/30 shadow-xl relative bg-slate-900 cursor-pointer flex items-center justify-center"
              >
                {profilePic ? (
                  <img
                    id="profile-avatar-img"
                    src={profilePic}
                    alt={`${personalInfo.name} - Video Editor`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 text-amber-400 p-2 text-center select-none">
                    <span className="font-display font-black text-2xl sm:text-3xl tracking-wider text-amber-400 drop-shadow">
                      SA
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-1">
                      <Camera className="w-3 h-3 text-amber-500" />
                      <span>ছবি দিন</span>
                    </span>
                  </div>
                )}

                {/* Hover overlay for uploading/changing profile picture */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium gap-1 text-center px-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  <span>{profilePic ? 'ছবি পরিবর্তন' : 'ছবি আপলোড'}</span>
                </div>
              </div>

              {/* Hidden file input for uploading profile pic */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="profile-file-input"
              />

              {/* Small camera badge button on corner */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title={profilePic ? "ছবি পরিবর্তন করুন (Change Photo)" : "ছবি আপলোড করুন (Upload Photo)"}
                className="absolute -top-1.5 -right-1.5 p-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              <div
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1"
                title="Available for freelance & contract work"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Available</span>
              </div>
            </div>

            {/* Greeting & Headline */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isDark
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-amber-50 border-amber-300 text-amber-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-amber-500" />
                  <span>{personalInfo.role}</span>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 px-2.5 py-0.5 rounded-full transition-all cursor-pointer"
                  title="কম্পিউটার বা মোবাইল থেকে ছবি পরিবর্তন করুন"
                >
                  <Camera className="w-3 h-3 text-amber-400" />
                  <span>Change Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal('profile')}
                  className="text-[11px] text-amber-400/80 hover:text-amber-400 flex items-center gap-1 underline underline-offset-2 ml-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Bio & Info</span>
                </button>
              </div>

              <h1
                id="hero-greeting-title"
                className={`text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight mb-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Hi, I'm <span className="text-amber-500">{personalInfo.name}</span>.
              </h1>

              <p
                id="hero-greeting-description"
                className={`text-base sm:text-lg leading-relaxed mb-6 max-w-2xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Welcome to my portfolio! Passionate about cutting dynamic edits, perfecting rhythm, and shaping unforgettable audiovisual narratives.
              </p>

              {/* Call-to-actions */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href="#video-portfolio"
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-2"
                >
                  <span>Explore Works</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all flex items-center gap-2 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
