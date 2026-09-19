import React, { useRef } from 'react';
import { Play, Sparkles, ArrowRight, Video, Mail, CheckCircle2, Camera, Upload, Edit3 } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroSectionProps {
  theme: ThemeMode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, updateProfilePic, openEditModal } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
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
                onClick={() => openEditModal('featured')}
                title="Change featured video link or YouTube ID"
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Change Video</span>
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
              <iframe
                id="featured-video-iframe"
                src={`https://www.youtube-nocookie.com/embed/${featuredVideo.youtubeId}?rel=0&modestbranding=1&autoplay=0`}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
              />
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
              <a
                href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-500 transition-colors flex items-center gap-1 font-medium text-amber-400"
              >
                <span>Watch on YouTube</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
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
            
            {/* Profile Picture using exact "profile.jpg" with upload overlay */}
            <div className="relative shrink-0 group">
              <div
                onClick={handleTriggerUpload}
                title="Click to update or change profile photo"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 shadow-xl relative bg-slate-800 cursor-pointer"
              >
                <img
                  id="profile-avatar-img"
                  src={profilePic}
                  alt={`${personalInfo.name} - Video Editor`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== window.location.origin + '/profile.jpg') {
                      target.src = '/profile.jpg';
                    }
                  }}
                />

                {/* Hover Overlay to change picture */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium gap-1 text-center px-1">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>ছবি পরিবর্তন করুন</span>
                </div>
              </div>

              {/* Hidden file input for custom upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="profile-file-input"
              />

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
                  onClick={() => openEditModal('profile')}
                  className="text-[11px] text-amber-400/80 hover:text-amber-400 flex items-center gap-1 underline underline-offset-2 ml-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Profile & Bio</span>
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
