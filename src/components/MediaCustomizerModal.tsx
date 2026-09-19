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
  Link2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId } from '../utils/mediaStorage';

export const MediaCustomizerModal: React.FC = () => {
  const {
    data,
    activeEditModal,
    activeEditingItemId,
    closeEditModal,
    updateProfilePic,
    updateFeaturedVideo,
    updatePortfolioVideo,
    updateGraphicItem,
    addGraphicItem,
    deleteGraphicItem,
    reorderGraphicItem,
    updatePersonalInfo,
    resetToDefaults,
    generateCustomHtml,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'featured' | 'videos' | 'graphics'>('profile');
  const [saveToast, setSaveToast] = useState(false);

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
    setTimeout(() => setSaveToast(false), 2000);
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
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 bg-slate-800 shadow-xl">
                    <img
                      src={data.profilePic}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-xs font-semibold text-white gap-1"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload New</span>
                  </button>
                  <input
                    type="file"
                    ref={profileFileInputRef}
                    onChange={handleProfileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h4 className="font-display font-bold text-base text-white">
                    Profile Photo
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                    আপনার কম্পিউটার বা ফোন থেকে যেকোনো ছবি সিলেক্ট করুন। সাইজ অটোমেটিক অ্যাডজাস্ট হবে।
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <button
                      onClick={() => profileFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Image from Device</span>
                    </button>
                    <button
                      onClick={() => {
                        updateProfilePic('profile.jpg');
                        showToast();
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      Reset Photo
                    </button>
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
            </div>
          )}

          {/* TAB 2: FEATURED VIDEO */}
          {activeTab === 'featured' && (
            <div className="space-y-6">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span>Main Featured Trailer Video</span>
                </div>
                <p className="text-xs text-slate-400">
                  You can paste any YouTube URL (e.g. <code>https://www.youtube.com/watch?v=hsPSXISkhbo</code> or <code>https://youtu.be/hsPSXISkhbo</code>) or just the 11-character Video ID.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      YouTube URL or Video ID
                    </label>
                    <input
                      type="text"
                      value={data.featuredVideo.youtubeId}
                      onChange={(e) => {
                        const id = extractYouTubeId(e.target.value);
                        updateFeaturedVideo({ youtubeId: id });
                      }}
                      placeholder="Paste YouTube link or ID..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={data.featuredVideo.title}
                        onChange={(e) => updateFeaturedVideo({ title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={data.featuredVideo.category}
                        onChange={(e) => updateFeaturedVideo({ category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 mb-2 block">
                    Live Video Preview:
                  </span>
                  <div className="aspect-video w-full max-w-lg mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 shadow-md">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${data.featuredVideo.youtubeId}?rel=0`}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
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

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-white">
                    Manage 4 Portfolio Videos
                  </h4>
                  <p className="text-xs text-slate-400">
                    এখানে আপনার যেকোনো ৪টি ভিডিওর ইউটিউব লিংক বসান
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.portfolioVideos.map((video, idx) => (
                  <div
                    key={video.id}
                    className={`p-4 rounded-2xl border bg-slate-950/60 space-y-3 ${
                      activeEditingItemId === video.id
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Slot {idx + 1}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {video.youtubeId}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        YouTube URL or ID
                      </label>
                      <input
                        type="text"
                        value={video.youtubeId}
                        onChange={(e) => {
                          const id = extractYouTubeId(e.target.value);
                          updatePortfolioVideo(video.id, { youtubeId: id });
                        }}
                        placeholder="Paste link or ID..."
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={video.title}
                        onChange={(e) =>
                          updatePortfolioVideo(video.id, { title: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={video.category}
                          onChange={(e) =>
                            updatePortfolioVideo(video.id, { category: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={video.description || ''}
                          onChange={(e) =>
                            updatePortfolioVideo(video.id, { description: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Thumbnail preview */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
                      <div className="w-20 h-12 rounded-lg overflow-hidden bg-black shrink-0 relative">
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                          alt="Thumb"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Check on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
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
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to your browser!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadUpdatedHtml}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Export index.html</span>
            </button>
            <button
              onClick={closeEditModal}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow transition-all"
            >
              Done & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
