import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Video,
  Image as ImageIcon,
  User,
  Check,
  RotateCcw,
  Download,
  Sparkles,
  ExternalLink,
  Youtube,
  Trash2,
  HelpCircle,
  FileCode,
  Plus,
  MoveLeft,
  MoveRight,
  Layers,
  Link2,
  Camera,
  Image,
  Save
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId } from '../utils/mediaStorage';
import { VideoItemEditor } from './VideoItemEditor';

export const MediaCustomizerModal: React.FC = () => {
  const {
    data,
    activeEditModal,
    activeEditingItemId,
    closeEditModal,
    updateProfilePic,
    updateFeaturedVideo,
    updatePortfolioVideo,
    addPortfolioVideo,
    deletePortfolioVideo,
    reorderPortfolioVideo,
    updateGraphicItem,
    addGraphicItem,
    deleteGraphicItem,
    reorderGraphicItem,
    updatePersonalInfo,
    saveAllNow,
    lastSavedTime,
    resetToDefaults,
    generateCustomHtml,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'featured' | 'videos' | 'graphics'>('profile');
  const [saveToast, setSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync tab with whichever trigger was clicked
  useEffect(() => {
    if (activeEditModal === 'featured') setActiveTab('featured');
    else if (activeEditModal === 'videos') setActiveTab('videos');
    else if (activeEditModal === 'graphics') setActiveTab('graphics');
    else if (activeEditModal === 'profile' || activeEditModal === 'bio') setActiveTab('profile');
    else if (activeEditModal === 'all') setActiveTab('profile');
  }, [activeEditModal]);

  const profileFileInputRef = useRef<HTMLInputElement>(null);

  if (!activeEditModal) return null;

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await saveAllNow();
      showToast();
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJsonBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sohan_portfolio_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateProfilePic(result);
          showToast();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGraphicUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateGraphicItem(id, { filename: result });
        showToast();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadUpdatedHtml = () => {
    const html = generateCustomHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="media-customizer-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
      onClick={closeEditModal}
    >
      <div
        id="media-customizer-container"
        className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  Media & Portfolio Manager
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Upload
                </span>
              </div>
              <p className="text-xs text-slate-400">
                আপলোড করুন আপনার নিজের ছবি, ভিডিও লিঙ্ক এবং পোর্টফোলিও কন্টেন্ট
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadUpdatedHtml}
              title="Download updated single-file website with your uploads"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Website</span>
            </button>
            <button
              onClick={closeEditModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>

          <button
            onClick={() => setActiveTab('featured')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'featured'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Featured Video</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video Portfolio (4)</span>
          </button>

          <button
            onClick={() => setActiveTab('graphics')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'graphics'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Graphic Posters (6)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: PROFILE & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0 group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-amber-500/25 bg-slate-900 shadow-xl relative flex items-center justify-center">
                    {data.profilePic ? (
                      <img
                        src={data.profilePic}
                        alt="Current profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-400">
                        <User className="w-10 h-10 text-amber-500/80 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">No Photo</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => profileFileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-xs font-semibold text-white gap-1 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>{data.profilePic ? 'ছবি পরিবর্তন' : 'ছবি আপলোড'}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                    title="ছবি আপলোড / পরিবর্তন করুন"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={profileFileInputRef}
                    onChange={handleProfileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h4 className="font-display font-bold text-base text-white">
                      Profile Picture (প্রোফাইল ছবি)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-md mt-0.5">
                      {data.profilePic
                        ? 'আপনার নিজস্ব ছবি সফলভাবে আপলোড করা আছে। চাইলে নতুন ছবি দিয়ে পরিবর্তন বা রিমুভ করতে পারেন।'
                        : 'বর্তমানে কোনো ডেমো বা এআই ছবি নেই। আপনার আসল ছবি আপলোড করতে নিচের বাটনে ক্লিক করুন।'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => profileFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{data.profilePic ? 'Upload New Photo' : 'Upload from Device'}</span>
                    </button>

                    {data.profilePic && (
                      <button
                        type="button"
                        onClick={() => {
                          updateProfilePic('');
                          showToast();
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="প্রোফাইল ছবি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo (ছবি মুছুন)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Info & Bio Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => {
                      updatePersonalInfo({ name: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.role}
                    onChange={(e) => {
                      updatePersonalInfo({ role: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => {
                      updatePersonalInfo({ email: e.target.value });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    WhatsApp Phone Number (ফোন নম্বর)
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.whatsappNumber || ''}
                    onChange={(e) => {
                      const num = e.target.value;
                      let cleanDigits = num.replace(/\D/g, '');
                      if (cleanDigits.startsWith('01') && cleanDigits.length === 11) {
                        cleanDigits = '88' + cleanDigits;
                      }
                      const waUrl = cleanDigits
                        ? `https://wa.me/${cleanDigits}?text=Hi%20Sohan,%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!`
                        : data.personalInfo.whatsappUrl;
                      updatePersonalInfo({ whatsappNumber: num, whatsappUrl: waUrl });
                    }}
                    placeholder="+880 1700-000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    WhatsApp Direct URL (wa.me লিংক)
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.whatsappUrl}
                    onChange={(e) => {
                      updatePersonalInfo({ whatsappUrl: e.target.value });
                    }}
                    placeholder="https://wa.me/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Location (লোকেশন)
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.location || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ location: e.target.value });
                    }}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Work Status / Availability
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.availability || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ availability: e.target.value });
                    }}
                    placeholder="Available for Worldwide Remote & Freelance Projects"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    YouTube Channel URL (All Videos বাটন)
                  </label>
                  <input
                    type="url"
                    value={data.personalInfo.youtubeChannelUrl || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ youtubeChannelUrl: e.target.value });
                    }}
                    placeholder="https://www.youtube.com/@yourchannel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Behance Profile URL (Go to Behance বাটন)
                  </label>
                  <input
                    type="url"
                    value={data.personalInfo.behanceUrl || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ behanceUrl: e.target.value });
                    }}
                    placeholder="https://www.behance.net/yourprofile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  About Me / Bio Text
                </label>
                <textarea
                  rows={4}
                  value={data.personalInfo.bio}
                  onChange={(e) => {
                    updatePersonalInfo({ bio: e.target.value });
                  }}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Explicit Save & Backup Action Card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 font-bold text-sm">
                    <Save className="w-4 h-4 text-amber-500" />
                    <span>Save Profile & Bio (তথ্য সেভ করুন)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    আপনার নাম, রোল, বায়ো ও কন্টাক্ট তথ্য ব্রাউজার এবং সার্ভারে স্থায়ীভাবে সংরক্ষিত হবে।
                  </p>
                  {lastSavedTime && (
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>সর্বশেষ সেভ: {lastSavedTime}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={handleManualSave}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Save Profile & Bio'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJsonBackup}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="সম্পূর্ণ প্রোফাইল ডাটা ব্যাকআপ ডাউনলোড করুন"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Backup JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURED VIDEO */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span>Main Featured Video / Showreel</span>
                </h4>
                <p className="text-xs text-slate-400">
                  ওয়েবসাইটের শীর্ষে থাকা প্রধান শো-রিল বা সেরা ভিডিও। আপনি সরাসরি কম্পিউটার/মোবাইল থেকে ভিডিও ফাইল আপলোড করতে পারেন অথবা ইউটিউব লিংক ব্যবহার করতে পারেন।
                </p>
              </div>

              <VideoItemEditor
                video={data.featuredVideo}
                label="Featured Trailer / Best Video"
                onUpdate={(updates) => {
                  updateFeaturedVideo(updates);
                  showToast();
                }}
                showCategoryAndDesc={true}
              />
            </div>
          )}

          {/* TAB 3: VIDEO PORTFOLIO (4 VIDEOS) */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {/* YouTube Channel CTA Configuration */}
              <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-red-500/30 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <Youtube className="w-5 h-5 fill-current" />
                    <span>"All Videos" বাটন লিংক (YouTube Channel)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    Portfolio Footer Button
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  ভিডিও সেকশনের নিচে যে <strong className="text-white">"All Videos"</strong> বাটনটি রয়েছে, তাতে ক্লিক করলে অডিয়েন্স আপনার এই চ্যানেলে যাবে।
                </p>
                <div className="relative">
                  <input
                    type="url"
                    value={data.personalInfo.youtubeChannelUrl || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ youtubeChannelUrl: e.target.value });
                    }}
                    placeholder="https://www.youtube.com/@yourchannel"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <span>Manage Video Slides</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      {data.portfolioVideos.length} Slides
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    এখানে আপনার যেকোনো ভিডিও স্লাইডের ইউটিউব লিংক, টাইটেল ও ক্যাটাগরি সেট করুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await addPortfolioVideo();
                    showToast();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Video Slide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.portfolioVideos.map((video, idx) => (
                  <VideoItemEditor
                    key={video.id}
                    video={video}
                    label={`Slide #${idx + 1}`}
                    isActive={activeEditingItemId === video.id}
                    canReorder={true}
                    isFirst={idx === 0}
                    isLast={idx === data.portfolioVideos.length - 1}
                    onReorder={(direction) => reorderPortfolioVideo(video.id, direction)}
                    onDelete={
                      data.portfolioVideos.length > 1
                        ? () => {
                            if (window.confirm(`আপনি কি "${video.title}" ভিডিও স্লাইডটি মুছে ফেলতে চান?`)) {
                              deletePortfolioVideo(video.id);
                            }
                          }
                        : undefined
                    }
                    onUpdate={(updates) => {
                      updatePortfolioVideo(video.id, updates);
                      showToast();
                    }}
                    showCategoryAndDesc={true}
                  />
                ))}
              </div>

              {/* Bottom Add Slide Button */}
              <button
                type="button"
                onClick={async () => {
                  await addPortfolioVideo();
                  showToast();
                }}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/30 text-slate-400 hover:text-amber-400 flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Video Slide (আরেকটি নতুন ভিডিও স্লাইড যোগ করুন)</span>
              </button>
            </div>
          )}

          {/* TAB 4: GRAPHIC POSTERS */}
          {activeTab === 'graphics' && (
            <div className="space-y-6">
              {/* Behance Profile CTA Configuration */}
              <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-blue-500/30 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-xs leading-none">
                      Bē
                    </span>
                    <span>"Go to Behance" বাটন লিংক (Behance Profile)</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                    Portfolio Footer Button
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  গ্রাফিক ও পোস্টার সেকশনের নিচে যে <strong className="text-white">"Go to Behance"</strong> বাটনটি রয়েছে, তাতে ক্লিক করলে অডিয়েন্স সরাসরি আপনার Behance প্রোফাইলে যাবে।
                </p>
                <div className="relative">
                  <input
                    type="url"
                    value={data.personalInfo.behanceUrl || ''}
                    onChange={(e) => {
                      updatePersonalInfo({ behanceUrl: e.target.value });
                    }}
                    placeholder="https://www.behance.net/yourprofile"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    Manage Graphic & Poster Designs ({data.graphicItems.length} Slides)
                  </h4>
                  <p className="text-xs text-slate-400">
                    আপনার ইচ্ছামতো নতুন ডিজাইন স্লাইড যোগ করুন, ছবি আপলোড করুন অথবা ক্রম সাজান
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await addGraphicItem({
                      title: `New Design ${data.graphicItems.length + 1}`,
                      category: 'Poster Design',
                      subtitle: 'Custom Visual Art',
                      filename: '/graphics/1.jpg',
                      fitMode: 'cover',
                    });
                    showToast();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন স্লাইড যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.graphicItems.map((item, idx) => {
                  const inputId = `graphic-file-input-${item.id}`;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border bg-slate-950/60 space-y-3 flex flex-col justify-between ${
                        activeEditingItemId === item.id
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Slide {idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {/* Reorder Left */}
                            <button
                              type="button"
                              onClick={() => reorderGraphicItem(item.id, 'prev')}
                              disabled={idx === 0}
                              title="Move Left"
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <MoveLeft className="w-3.5 h-3.5" />
                            </button>
                            {/* Reorder Right */}
                            <button
                              type="button"
                              onClick={() => reorderGraphicItem(item.id, 'next')}
                              disabled={idx === data.graphicItems.length - 1}
                              title="Move Right"
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                            >
                              <MoveRight className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete Slide */}
                            {data.graphicItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('এই স্লাইডটি মুছে ফেলতে চান?')) {
                                    deleteGraphicItem(item.id);
                                    showToast();
                                  }
                                }}
                                title="Delete Slide"
                                className="p-1 rounded text-slate-500 hover:text-rose-400 ml-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Image Preview with Upload Button */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black group border border-slate-800">
                          <img
                            src={item.filename}
                            alt={item.title}
                            className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                              item.fitMode === 'contain' ? 'object-contain p-1' : 'object-cover'
                            }`}
                          />
                          <label
                            htmlFor={inputId}
                            className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs font-semibold text-white gap-1 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 text-amber-400" />
                            <span>Upload Image</span>
                          </label>
                          <input
                            type="file"
                            id={inputId}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGraphicUpload(item.id, file);
                            }}
                            className="hidden"
                          />
                        </div>

                        {/* Display Fit Mode Toggle */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">Display Fit:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateGraphicItem(item.id, { fitMode: 'cover' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                item.fitMode !== 'contain'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => updateGraphicItem(item.id, { fitMode: 'contain' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                item.fitMode === 'contain'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              Contain
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                            Poster Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateGraphicItem(item.id, { title: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                            Category / Tag
                          </label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) =>
                              updateGraphicItem(item.id, { category: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                            Subtitle / Note
                          </label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) =>
                              updateGraphicItem(item.id, { subtitle: e.target.value })
                            }
                            placeholder="Optional note or client"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <label
                        htmlFor={inputId}
                        className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors mt-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose New File</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to reset all media and texts back to original?')) {
                  await resetToDefaults();
                  showToast();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            {saveToast && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fade-in bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5" />
                <span>সব তথ্য সফলভাবে সেভ করা হয়েছে!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJsonBackup}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Backup complete data"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Save Now'}</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await handleManualSave();
                closeEditModal();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Close</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
