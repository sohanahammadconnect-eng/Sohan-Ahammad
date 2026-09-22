import React, { useState, useRef } from 'react';
import {
  ExternalLink,
  Film,
  Edit3,
  Youtube,
  Check,
  X,
  Link2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Video as VideoIcon,
  AlertCircle,
  Sparkles,
  Upload,
  Loader2
} from 'lucide-react';
import { ThemeMode, VideoItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioVideoPlayer } from './PortfolioVideoPlayer';
import { extractYouTubeId, uploadVideoFile } from '../utils/mediaStorage';

interface VideoGridProps {
  theme: ThemeMode;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const {
    data,
    openEditModal,
    updatePersonalInfo,
    addPortfolioVideo,
    updatePortfolioVideo,
    deletePortfolioVideo,
    reorderPortfolioVideo,
    isAdmin,
    setShowAdminLoginModal,
    setShowAdminDashboard,
    t,
    language,
  } = usePortfolio();
  const videos = data.portfolioVideos;
  const youtubeChannelUrl = data.personalInfo.youtubeChannelUrl || 'https://www.youtube.com';

  const [isEditingChannel, setIsEditingChannel] = useState(false);
  const [channelInput, setChannelInput] = useState(youtubeChannelUrl);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Link Submission state per slide
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [linkInputVal, setLinkInputVal] = useState<string>('');
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccessId, setLinkSuccessId] = useState<string | null>(null);

  // Quick Direct Video Upload state per slide
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddNewSlide = async () => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    const newId = await addPortfolioVideo();
    setToastMessage('নতুন ভিডিও স্লাইড সফলভাবে যোগ করা হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
    // Automatically open link submission for the newly added slide
    setActiveLinkId(newId);
    setLinkInputVal('');
  };

  const handleToggleQuickLink = (video: VideoItem) => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    if (activeLinkId === video.id) {
      setActiveLinkId(null);
      setLinkInputVal('');
      setLinkError(null);
    } else {
      setActiveLinkId(video.id);
      setLinkInputVal(video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : '');
      setLinkError(null);
      setLinkSuccessId(null);
    }
  };

  const handleSubmitQuickLink = (videoId: string) => {
    const trimmed = linkInputVal.trim();
    if (!trimmed) {
      setLinkError('দয়া করে আপনার ইউটিউব ভিডিও লিংক বা ১১ অক্ষরের আইডি লিখুন।');
      return;
    }

    const ytid = extractYouTubeId(trimmed);
    if (!ytid || ytid.length !== 11) {
      setLinkError('সঠিক ইউটিউব ভিডিও লিংক পাওয়া যায়নি। যেমন: https://www.youtube.com/watch?v=... বা youtu.be/...');
      return;
    }

    // Instantly update the video slide
    updatePortfolioVideo(videoId, {
      youtubeId: ytid,
      videoSourceType: 'youtube',
    });

    setLinkSuccessId(videoId);
    setLinkError(null);
    setToastMessage('✅ ভিডিও লিংক সফলভাবে স্লাইডে যুক্ত হয়েছে!');
    setTimeout(() => setToastMessage(null), 4000);

    setTimeout(() => {
      setActiveLinkId(null);
      setLinkSuccessId(null);
      setLinkInputVal('');
    }, 1800);
  };

  const handleQuickFileUpload = async (videoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|mkv|ogg|m4v)$/i.test(file.name)) {
      setLinkError('দয়া করে একটি সঠিক ভিডিও ফাইল নির্বাচন করুন (MP4, WebM, MOV)');
      return;
    }

    setUploadingSlideId(videoId);
    setLinkError(null);
    try {
      const { url, blobKey } = await uploadVideoFile(file);
      updatePortfolioVideo(videoId, {
        videoSourceType: 'local',
        videoUrl: url,
        blobKey,
      });
      setLinkSuccessId(videoId);
      setToastMessage('✅ ভিডিও ফাইল সফলভাবে আপলোড ও যুক্ত হয়েছে!');
      setTimeout(() => setToastMessage(null), 4000);
      setTimeout(() => {
        setActiveLinkId(null);
        setLinkSuccessId(null);
      }, 1800);
    } catch (err) {
      console.error(err);
      setLinkError('ভিডিও ফাইল আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setUploadingSlideId(null);
    }
  };

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
              <button
                onClick={handleAddNewSlide}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('videos_btn_add_slide')}</span>
              </button>
              <button
                onClick={() => openEditModal('videos')}
                title={t('videos_btn_change')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{t('videos_btn_change')}</span>
              </button>
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
                {/* 16:9 Responsive video player container */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <PortfolioVideoPlayer video={video} />

                  {/* Inline quick edit button */}
                  <button
                    onClick={() => openEditModal('videos', video.id)}
                    title="Change or upload video"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 backdrop-blur-sm text-white/80 hover:text-amber-400 hover:bg-slate-900 border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-semibold z-10"
                  >
                    <Edit3 className="w-3 h-3 text-amber-400" />
                    <span>Edit Video</span>
                  </button>
                </div>

                {/* Card Information */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            isDark
                              ? 'bg-slate-800 text-amber-400 border border-slate-700/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {video.category}
                        </span>

                        {/* PROMINENT: লিংক জমা দিন (Submit Link) BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleToggleQuickLink(video)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                            activeLinkId === video.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400'
                              : isDark
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                          title="এই স্লাইডে সরাসরি ইউটিউব ভিডিও লিংক জমা দিন"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>লিংক জমা দিন</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('videos', video.id)}
                          className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>More Edit</span>
                        </button>
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

                    {/* QUICK LINK SUBMISSION DRAWER */}
                    {activeLinkId === video.id && (
                      <div
                        className={`p-3.5 sm:p-4 rounded-xl border my-3 transition-all animate-fade-in ${
                          isDark
                            ? 'bg-slate-950/95 border-amber-500/60 shadow-xl'
                            : 'bg-amber-50/95 border-amber-400 shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5" />
                            <span>স্লাইড #{index + 1}-এ ইউটিউব লিংক জমা দিন</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveLinkId(null)}
                            className="p-1 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                            title="বন্ধ করুন (Close)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 mb-2 leading-normal">
                          ইউটিউব ভিডিওর লিংক বা আইডি এখানে পেস্ট করে <strong className="text-amber-400">&quot;জমা দিন&quot;</strong> চাপুন। সঙ্গে সঙ্গে এই স্লাইডে ভিডিওটি যুক্ত হয়ে যাবে:
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={linkInputVal}
                              onChange={(e) => {
                                setLinkInputVal(e.target.value);
                                setLinkError(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSubmitQuickLink(video.id);
                                }
                              }}
                              placeholder="https://www.youtube.com/watch?v=... বা youtu.be/..."
                              autoFocus
                              className={`w-full pl-3 pr-3 py-2 text-xs rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-600'
                                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                              }`}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSubmitQuickLink(video.id)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all shrink-0 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>জমা দিন (Submit)</span>
                          </button>
                        </div>

                        {/* Direct Video File Upload option */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <span className="text-slate-400">অথবা সরাসরি কম্পিউটার থেকে ভিডিও দিন:</span>
                          <button
                            type="button"
                            disabled={uploadingSlideId === video.id}
                            onClick={() => fileInputRefs.current[video.id]?.click()}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium disabled:opacity-50"
                          >
                            {uploadingSlideId === video.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                                <span>আপলোড হচ্ছে...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3 text-amber-400" />
                                <span>ভিডিও ফাইল আপলোড (MP4/WebM)</span>
                              </>
                            )}
                          </button>
                          <input
                            type="file"
                            accept="video/*,.mp4,.webm,.mov,.mkv"
                            ref={(el) => {
                              fileInputRefs.current[video.id] = el;
                            }}
                            onChange={(e) => handleQuickFileUpload(video.id, e)}
                            className="hidden"
                          />
                        </div>

                        {linkError && activeLinkId === video.id && (
                          <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{linkError}</span>
                          </div>
                        )}

                        {linkSuccessId === video.id && (
                          <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1.5 font-semibold">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>ভিডিও লিংক সফলভাবে জমা হয়েছে এবং স্লাইডে যুক্ত করা হয়েছে!</span>
                          </div>
                        )}
                      </div>
                    )}

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

                  {/* Card Bottom Controls (Slide Management) */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Slide #{index + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleQuickLink(video)}
                        className={`px-2 py-1 rounded font-semibold transition-colors flex items-center gap-1 text-[11px] ${
                          activeLinkId === video.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                        }`}
                        title="ইউটিউব লিংক জমা দিন"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>লিংক জমা দিন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => reorderPortfolioVideo(video.id, 'prev')}
                        disabled={index === 0}
                        title="Move slide up"
                        className="p-1 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderPortfolioVideo(video.id, 'next')}
                        disabled={index === videos.length - 1}
                        title="Move slide down"
                        className="p-1 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal('videos', video.id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`আপনি কি "${video.title}" ভিডিও স্লাইডটি ডিলিট করতে চান?`)) {
                              deletePortfolioVideo(video.id);
                            }
                          }}
                          title="Delete this slide"
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dotted Card: Add New Video Slide */}
          <button
            onClick={handleAddNewSlide}
            type="button"
            className={`rounded-2xl border-2 border-dashed p-8 transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer group min-h-[300px] ${
              isDark
                ? 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/40 text-slate-400 hover:text-amber-400'
                : 'border-slate-300 hover:border-amber-500/60 hover:bg-amber-50/50 text-slate-500 hover:text-amber-600'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-current">
                {language === 'bn' ? '+ নতুন ভিডিও স্লাইড যোগ করুন' : '+ Add Another Video Slide'}
              </h4>
              <p className="text-xs opacity-75 mt-1">
                {language === 'bn' ? 'আরও ভিডিও স্লাইড যোগ করতে এখানে ক্লিক করুন' : 'Click here to add more video slides'}
              </p>
            </div>
          </button>
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
