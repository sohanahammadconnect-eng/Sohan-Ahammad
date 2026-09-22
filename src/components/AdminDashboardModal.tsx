import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Video,
  Image as ImageIcon,
  User,
  ShieldCheck,
  LogOut,
  Save,
  Check,
  Trash2,
  MoveUp,
  MoveDown,
  Upload,
  Link2,
  ExternalLink,
  KeyRound,
  Download,
  FileCode,
  Copy,
  AlertCircle,
  Sparkles,
  Camera,
  Youtube,
  Languages,
  Globe,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  Edit3,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId } from '../utils/mediaStorage';
import { VideoItem, GraphicItem } from '../types';

export const AdminDashboardModal: React.FC = () => {
  const {
    data,
    showAdminDashboard,
    setShowAdminDashboard,
    logoutAdmin,
    hasCustomPassword,
    changeAdminPassword,
    setCustomPasswordDirectly,
    addPortfolioVideo,
    deletePortfolioVideo,
    reorderPortfolioVideo,
    updatePortfolioVideo,
    addGraphicItem,
    deleteGraphicItem,
    reorderGraphicItem,
    updateGraphicItem,
    updatePersonalInfo,
    updateProfilePic,
    updateFeaturedVideo,
    saveAllNow,
    lastSavedTime,
    importBackupData,
    language,
    setLanguage,
    toggleLanguage,
    t,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'videos' | 'graphics' | 'language' | 'profile' | 'security' | 'backup'>('videos');

  // New Video Form State
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Commercial Edit');
  const [newVideoDesc, setNewVideoDesc] = useState('');
  const [videoSuccess, setVideoSuccess] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // New Graphic Form State
  const [graphicFile, setGraphicFile] = useState<string | null>(null);
  const [newGraphicUrl, setNewGraphicUrl] = useState('');
  const [newGraphicTitle, setNewGraphicTitle] = useState('');
  const [newGraphicSubtitle, setNewGraphicSubtitle] = useState('');
  const [newGraphicCategory, setNewGraphicCategory] = useState('Movie Poster');
  const [newGraphicFit, setNewGraphicFit] = useState<'cover' | 'contain'>('cover');
  const [graphicSuccess, setGraphicSuccess] = useState<string | null>(null);
  const [graphicError, setGraphicError] = useState<string | null>(null);
  const graphicFileInputRef = useRef<HTMLInputElement>(null);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [directAdminReset, setDirectAdminReset] = useState(true);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Profile Form State
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Copy code toast
  const [copiedCode, setCopiedCode] = useState(false);

  // Import JSON Backup state
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Manual Save All state
  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Inline video edit state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoTitle, setEditVideoTitle] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoCategory, setEditVideoCategory] = useState('');
  const [editVideoDesc, setEditVideoDesc] = useState('');

  // Inline graphic edit state
  const [editingGraphicId, setEditingGraphicId] = useState<string | null>(null);
  const [editGraphicTitle, setEditGraphicTitle] = useState('');
  const [editGraphicSubtitle, setEditGraphicSubtitle] = useState('');
  const [editGraphicCategory, setEditGraphicCategory] = useState('');
  const [editGraphicFit, setEditGraphicFit] = useState<'cover' | 'contain'>('cover');
  const [isBuildingZip, setIsBuildingZip] = useState(false);
  const [zipDownloadSuccess, setZipDownloadSuccess] = useState(false);

  if (!showAdminDashboard) return null;

  // Save All Changes Immediately
  const handleManualSaveAll = async () => {
    setIsSaving(true);
    await saveAllNow();
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  // Sync Everything & Download Fresh ZIP
  const handleDownloadFreshZip = async () => {
    setIsBuildingZip(true);
    setZipDownloadSuccess(false);
    try {
      // 1. Post entire live state to server to save files and regenerate ZIP
      await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // 2. Fetch binary ZIP blob to ensure 100% clean archive download
      const res = await fetch(`/api/download-zip?t=${Date.now()}`);
      if (!res.ok) throw new Error('Failed to download ZIP file');
      const blob = await res.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'sohan-portfolio-latest.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 15000);

      setZipDownloadSuccess(true);
      setTimeout(() => setZipDownloadSuccess(false), 8000);
    } catch (err) {
      console.error('Error generating fresh ZIP', err);
      // Fallback direct link
      window.location.href = `/api/download-zip?t=${Date.now()}`;
    } finally {
      setIsBuildingZip(false);
    }
  };

  // Video Inline Edit Handlers
  const handleStartEditVideo = (v: VideoItem) => {
    setEditingVideoId(v.id);
    setEditVideoTitle(v.title);
    setEditVideoUrl(`https://www.youtube.com/watch?v=${v.youtubeId}`);
    setEditVideoCategory(v.category);
    setEditVideoDesc(v.description || '');
  };

  const handleSaveEditVideo = async (id: string) => {
    const trimmedUrl = editVideoUrl.trim();
    const ytId = extractYouTubeId(trimmedUrl);
    await updatePortfolioVideo(id, {
      title: editVideoTitle.trim() || 'Untitled Video',
      youtubeId: ytId || trimmedUrl,
      category: editVideoCategory || 'Commercial',
      description: editVideoDesc.trim(),
    });
    setEditingVideoId(null);
  };

  // Graphic Inline Edit Handlers
  const handleStartEditGraphic = (g: GraphicItem) => {
    setEditingGraphicId(g.id);
    setEditGraphicTitle(g.title);
    setEditGraphicSubtitle(g.subtitle || '');
    setEditGraphicCategory(g.category);
    setEditGraphicFit(g.fitMode || 'cover');
  };

  const handleSaveEditGraphic = async (id: string) => {
    await updateGraphicItem(id, {
      title: editGraphicTitle.trim() || 'Untitled Design',
      subtitle: editGraphicSubtitle.trim(),
      category: editGraphicCategory || 'Film Poster',
      fitMode: editGraphicFit,
    });
    setEditingGraphicId(null);
  };

  // Handle New Video Submit
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoError(null);
    setVideoSuccess(null);

    const trimmedUrl = newVideoUrl.trim();
    if (!trimmedUrl) {
      setVideoError('দয়া করে ইউটিউব ভিডিও লিংক বা আইডি লিখুন।');
      return;
    }

    const ytid = extractYouTubeId(trimmedUrl);
    if (!ytid) {
      setVideoError('সঠিক ইউটিউব ভিডিও লিংক পাওয়া যায়নি। যেমন: https://www.youtube.com/watch?v=...');
      return;
    }

    await addPortfolioVideo({
      youtubeId: ytid,
      videoSourceType: 'youtube',
      title: newVideoTitle.trim() || `Project Edit ${data.portfolioVideos.length + 1}`,
      category: newVideoCategory.trim() || 'Creative Video Edit',
      description: newVideoDesc.trim() || 'High-impact commercial video cut showcasing pacing and sound design.',
    });

    setVideoSuccess('নতুন ভিডিও সফলভাবে যোগ করা হয়েছে!');
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDesc('');
    setTimeout(() => setVideoSuccess(null), 3500);
  };

  // Handle New Graphic Image Select
  const handleGraphicImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setGraphicFile(result);
          setGraphicError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle New Graphic Submit
  const handleAddGraphic = async (e: React.FormEvent) => {
    e.preventDefault();
    setGraphicError(null);
    setGraphicSuccess(null);

    const finalImage = graphicFile || newGraphicUrl.trim();
    if (!finalImage) {
      setGraphicError(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন অথবা ছবির ওয়েব লিংক দিন।' : 'Please upload an image file or provide an image URL.');
      return;
    }

    await addGraphicItem({
      filename: finalImage,
      title: newGraphicTitle.trim() || `Design ${data.graphicItems.length + 1}`,
      subtitle: newGraphicSubtitle.trim() || 'Key visual artwork & editorial poster',
      category: newGraphicCategory.trim() || 'Poster Design',
      fitMode: newGraphicFit,
    });

    setGraphicSuccess(language === 'bn' ? 'নতুন গ্রাফিক ডিজাইন সফলভাবে যোগ করা হয়েছে!' : 'New graphic slide added successfully!');
    setGraphicFile(null);
    setNewGraphicUrl('');
    setNewGraphicTitle('');
    setNewGraphicSubtitle('');
    if (graphicFileInputRef.current) graphicFileInputRef.current.value = '';
    setTimeout(() => setGraphicSuccess(null), 3500);
  };

  // Handle Profile Photo Upload
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          updateProfilePic(result);
          setProfileSuccess(true);
          setTimeout(() => setProfileSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    const trimmedNew = newPassword.trim();
    if (!trimmedNew || trimmedNew.length < 4) {
      setPasswordMsg({
        text: language === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'New password must be at least 4 characters long.',
        isError: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        text: language === 'bn' ? 'নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।' : 'New password and confirm password do not match.',
        isError: true,
      });
      return;
    }

    let res;
    if (directAdminReset) {
      res = setCustomPasswordDirectly(newPassword);
    } else {
      res = changeAdminPassword(oldPassword, newPassword);
    }

    setPasswordMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Export JSON
  const handleDownloadBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sohan_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = await importBackupData(parsed);
        if (success) {
          setImportStatus('success:ডাটা সফলভাবে রিস্টোর হয়েছে!');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('error:ব্যাকআপ ফাইলটি সঠিক নয়।');
          setTimeout(() => setImportStatus(null), 4000);
        }
      } catch {
        setImportStatus('error:JSON ফাইল পড়া সম্ভব হয়নি।');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div
      id="admin-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={() => setShowAdminDashboard(false)}
    >
      <div
        id="admin-dashboard-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-lg text-white">
                  অ্যাডমিন কন্ট্রোল সেন্টার (Admin Center)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  Protected Owner Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                সোহান আহমেদ — এখান থেকে সরাসরি নতুন ভিডিও ও গ্রাফিক্স যোগ করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Manual Save All Button */}
            <button
              type="button"
              onClick={handleManualSaveAll}
              disabled={isSaving}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                savedToast
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
              }`}
              title="সবকিছু সেভ করুন এবং লাইভ ওয়েবসাইটে তাৎক্ষণিক আপডেট করুন"
            >
              {savedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>লাইভ আপডেট হয়েছে!</span>
                </>
              ) : isSaving ? (
                <>
                  <Save className="w-3.5 h-3.5 animate-spin" />
                  <span>সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>সেভ করুন</span>
                </>
              )}
            </button>

            {/* Quick Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title={language === 'bn' ? t('nav_switch_to_en') : t('nav_switch_to_bn')}
            >
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-rose-500/50 bg-slate-800/80 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdminDashboard(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global info reminder banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-between text-[11px] text-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {language === 'bn'
                ? 'পাবলিশ করার পর আর এখানে আসতে হবে না—অনলাইনে সরাসরি আপনার সাইটেই লগইন করে সব ভিডিও, গ্রাফিক্স ও কন্টাক্ট লিংক পরিবর্তন ও যোগ করতে পারবেন।'
                : 'Manage everything live on your website after publishing—no need to return to the editor.'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Status: {lastSavedTime ? `Synced (${lastSavedTime})` : 'Auto-Sync Ready'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{language === 'bn' ? 'ভিডিও ম্যানেজার' : 'Videos'} ({data.portfolioVideos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('graphics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'graphics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{language === 'bn' ? 'গ্রাফিক ডিজাইন' : 'Graphics'} ({data.graphicItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'language'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>{language === 'bn' ? '🌐 ভাষা (Language)' : '🌐 Language'} ({language === 'bn' ? 'বাংলা' : 'EN'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রোফাইল ও লিংক' : 'Profile & Links'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>{language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডাটা ব্যাকআপ ও সিঙ্ক' : 'Backup & Sync'}</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: VIDEOS MANAGER                                     */}
          {/* ========================================================= */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              
              {/* Form to Add New Video Slide */}
              <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-amber-400">
                    নতুন ভিডিও স্লাইড যোগ করুন (Add New Video Slide)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  আপনার ইউটিউব ভিডিওর লিংক এখানে দিন। যত খুশি ততগুলো ভিডিও যোগ করতে পারবেন।
                </p>

                <form onSubmit={handleAddVideo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ইউটিউব ভিডিও লিংক বা আইডি *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-red-500">
                          <Youtube className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... বা youtu.be/..."
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ভিডিওর শিরোনাম (Title)
                      </label>
                      <input
                        type="text"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        placeholder="যেমন: Cyberpunk Narrative Cut"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ক্যাটাগরি (Category)
                      </label>
                      <select
                        value={newVideoCategory}
                        onChange={(e) => setNewVideoCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Commercial Edit">Commercial Edit</option>
                        <option value="Music Video">Music Video</option>
                        <option value="Cinematic Reel">Cinematic Reel</option>
                        <option value="Documentary Short">Documentary Short</option>
                        <option value="Trailer & Teaser">Trailer & Teaser</option>
                        <option value="YouTube Content">YouTube Content</option>
                        <option value="Fashion / Lifestyle">Fashion / Lifestyle</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        বিবরণ (Description - Optional)
                      </label>
                      <input
                        type="text"
                        value={newVideoDesc}
                        onChange={(e) => setNewVideoDesc(e.target.value)}
                        placeholder="ভিডিও সম্পর্কে ছোট্ট এক লাইনের বিবরণ..."
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {videoError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{videoError}</span>
                    </div>
                  )}

                  {videoSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{videoSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ভিডিও স্লাইড যোগ করুন (+ Add Video)</span>
                  </button>
                </form>
              </div>

              {/* List of Existing Videos with Reorder & Delete */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-200 mb-3 flex items-center justify-between">
                  <span>বর্তমান ভিডিওসমূহ ({data.portfolioVideos.length} টি)</span>
                  <span className="text-xs text-slate-400 font-normal">উপরে বা নিচে সরিয়ে সাজাতে পারেন</span>
                </h4>

                <div className="space-y-3">
                  {data.portfolioVideos.map((video, idx) => (
                    <div
                      key={video.id}
                      className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                            #{idx + 1}
                          </div>
                          <div className="w-16 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700 relative">
                            <img
                              src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                              {video.title}
                            </h5>
                            <span className="text-[11px] text-amber-400 font-medium">
                              {video.category} • YouTube ID: {video.youtubeId}
                            </span>
                          </div>
                        </div>

                        {/* Controls: Edit, Up, Down, Delete */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => (editingVideoId === video.id ? setEditingVideoId(null) : handleStartEditVideo(video))}
                            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                              editingVideoId === video.id
                                ? 'bg-amber-500 text-slate-950 border-amber-500'
                                : 'border-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400'
                            }`}
                            title="ভিডিওর তথ্য পরিবর্তন বা এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden sm:inline">{editingVideoId === video.id ? 'বাতিল' : 'পরিবর্তন'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderPortfolioVideo(video.id, 'prev')}
                            disabled={idx === 0}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="উপরে নিন"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderPortfolioVideo(video.id, 'next')}
                            disabled={idx === data.portfolioVideos.length - 1}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="নিচে নিন"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`"${video.title}" ভিডিওটি মুছে ফেলতে চান?`)) {
                                deletePortfolioVideo(video.id);
                              }
                            }}
                            disabled={data.portfolioVideos.length <= 1}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="ভিডিও মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Video Editor Drawer */}
                      {editingVideoId === video.id && (
                        <div className="w-full mt-2 pt-3 border-t border-slate-800 bg-slate-900/60 p-3 rounded-xl space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ভিডিও টাইটেল (Title)</label>
                              <input
                                type="text"
                                value={editVideoTitle}
                                onChange={(e) => setEditVideoTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">YouTube লিংক বা ভিডিও আইডি</label>
                              <input
                                type="text"
                                value={editVideoUrl}
                                onChange={(e) => setEditVideoUrl(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ক্যাটাগরি (Category)</label>
                              <input
                                type="text"
                                value={editVideoCategory}
                                onChange={(e) => setEditVideoCategory(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">বিবরণ (Description)</label>
                              <input
                                type="text"
                                value={editVideoDesc}
                                onChange={(e) => setEditVideoDesc(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingVideoId(null)}
                              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                            >
                              বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditVideo(video.id)}
                              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>পরিবর্তন সংরক্ষণ করুন</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: GRAPHIC DESIGNS MANAGER                           */}
          {/* ========================================================= */}
          {activeTab === 'graphics' && (
            <div className="space-y-6">

              {/* Form to Add New Graphic Slide */}
              <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-base text-amber-400">
                    নতুন গ্রাফিক ডিজাইন যোগ করুন (Add New Graphic Slide)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  আপনার পোস্টার, থাম্বনেইল বা আর্টওয়ার্ক ইমেজ সরাসরি আপলোড করুন। যেকোনো সময় যত খুশি যোগ করতে পারেন।
                </p>

                <form onSubmit={handleAddGraphic} className="space-y-4">
                  {/* File Upload Box */}
                  <div
                    onClick={() => graphicFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      graphicFile
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-700 hover:border-amber-500 bg-slate-950/60'
                    }`}
                  >
                    <input
                      type="file"
                      ref={graphicFileInputRef}
                      onChange={handleGraphicImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {graphicFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={graphicFile}
                          alt="Preview"
                          className="h-28 w-auto rounded-xl object-contain shadow-lg border border-slate-700"
                        />
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>ছবি নির্বাচিত হয়েছে (Click to Change)</span>
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-200">
                          ছবি আপলোড করতে এখানে ক্লিক করুন (Click to upload design image)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          JPG, PNG, WebP supported
                        </span>
                      </>
                    )}
                  </div>

                  {/* Or enter Image URL */}
                  <div className="flex items-center gap-2 my-2 text-xs text-slate-400">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span>{language === 'bn' ? 'অথবা ছবির ওয়েব লিংক ব্যবহার করুন' : 'OR use Image Web URL'}</span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'bn' ? 'ছবির লিংক (Image URL - Behance, Imgur, Cloudinary, etc.)' : 'Image URL (Behance, Imgur, Cloudinary, etc.)'}
                    </label>
                    <div className="relative">
                      <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="url"
                        value={newGraphicUrl}
                        onChange={(e) => {
                          setNewGraphicUrl(e.target.value);
                          if (e.target.value) setGraphicFile(null);
                        }}
                        placeholder="https://images.unsplash.com/... বা https://mir-s3-cdn-cf.behance.net/..."
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ডিজাইনের নাম (Title) *
                      </label>
                      <input
                        type="text"
                        value={newGraphicTitle}
                        onChange={(e) => setNewGraphicTitle(e.target.value)}
                        placeholder="যেমন: Neon Requiem Key Art"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ক্যাটাগরি (Category)
                      </label>
                      <select
                        value={newGraphicCategory}
                        onChange={(e) => setNewGraphicCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Movie Poster">Movie Poster</option>
                        <option value="YouTube Thumbnail">YouTube Thumbnail</option>
                        <option value="Visual Key Art">Visual Key Art</option>
                        <option value="Brand Identity">Brand Identity</option>
                        <option value="Editorial Cover">Editorial Cover</option>
                        <option value="Album Artwork">Album Artwork</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        সাবটাইটেল / বিবরণ (Subtitle)
                      </label>
                      <input
                        type="text"
                        value={newGraphicSubtitle}
                        onChange={(e) => setNewGraphicSubtitle(e.target.value)}
                        placeholder="যেমন: Cinema release official poster"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ফিট মোড (Fit Mode)
                      </label>
                      <select
                        value={newGraphicFit}
                        onChange={(e) => setNewGraphicFit(e.target.value as 'cover' | 'contain')}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="cover">Cover (ক্রপ করে পুরো বক্স পূর্ণ করবে)</option>
                        <option value="contain">Contain (পুরো ছবি অক্ষত দেখাবে)</option>
                      </select>
                    </div>
                  </div>

                  {graphicError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{graphicError}</span>
                    </div>
                  )}

                  {graphicSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{graphicSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>গ্রাফিক স্লাইড যোগ করুন (+ Add Graphic Design)</span>
                  </button>
                </form>
              </div>

              {/* List of Existing Graphic Slides */}
              <div>
                <h4 className="font-display font-bold text-sm text-slate-200 mb-3 flex items-center justify-between">
                  <span>বর্তমান গ্রাফিক্স ও পোস্টার ({data.graphicItems.length} টি)</span>
                  <span className="text-xs text-slate-400 font-normal">উপরে বা নিচে সাজাতে পারেন</span>
                </h4>

                <div className="space-y-3">
                  {data.graphicItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                            #{idx + 1}
                          </div>
                          <div className="w-14 h-14 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-700">
                            <img
                              src={item.filename.startsWith('data:') || item.filename.startsWith('http') ? item.filename : `/${item.filename}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-white truncate">
                              {item.title}
                            </h5>
                            <span className="text-[11px] text-amber-400 font-medium">
                              {item.category} • {item.subtitle || 'Poster assignment'}
                            </span>
                          </div>
                        </div>

                        {/* Controls: Edit, Up, Down, Delete */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => (editingGraphicId === item.id ? setEditingGraphicId(null) : handleStartEditGraphic(item))}
                            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                              editingGraphicId === item.id
                                ? 'bg-amber-500 text-slate-950 border-amber-500'
                                : 'border-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400'
                            }`}
                            title="গ্রাফিক ডিজাইনের তথ্য পরিবর্তন বা এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px] hidden sm:inline">{editingGraphicId === item.id ? 'বাতিল' : 'পরিবর্তন'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderGraphicItem(item.id, 'prev')}
                            disabled={idx === 0}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="উপরে নিন"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => reorderGraphicItem(item.id, 'next')}
                            disabled={idx === data.graphicItems.length - 1}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            title="নিচে নিন"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`"${item.title}" ডিজাইনটি মুছে ফেলতে চান?`)) {
                                deleteGraphicItem(item.id);
                              }
                            }}
                            disabled={data.graphicItems.length <= 1}
                            className="p-2 rounded-lg border border-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="ডিজাইন মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Graphic Editor Drawer */}
                      {editingGraphicId === item.id && (
                        <div className="w-full mt-2 pt-3 border-t border-slate-800 bg-slate-900/60 p-3 rounded-xl space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ডিজাইনের নাম (Title)</label>
                              <input
                                type="text"
                                value={editGraphicTitle}
                                onChange={(e) => setEditGraphicTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ক্যাটাগরি (Category)</label>
                              <input
                                type="text"
                                value={editGraphicCategory}
                                onChange={(e) => setEditGraphicCategory(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">সাবটাইটেল / বিবরণ</label>
                              <input
                                type="text"
                                value={editGraphicSubtitle}
                                onChange={(e) => setEditGraphicSubtitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-300 mb-1">ফিট মোড (Fit Mode)</label>
                              <select
                                value={editGraphicFit}
                                onChange={(e) => setEditGraphicFit(e.target.value as 'cover' | 'contain')}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="cover">Cover (বক্স পূর্ণ করবে)</option>
                                <option value="contain">Contain (পুরো ছবি অক্ষত দেখাবে)</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingGraphicId(null)}
                              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                            >
                              বাতিল
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditGraphic(item.id)}
                              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>পরিবর্তন সংরক্ষণ করুন</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: LANGUAGE SETTINGS (ভাষা নিয়ন্ত্রণ ও নির্বাচন)          */}
          {/* ========================================================= */}
          {activeTab === 'language' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Box */}
              <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                      {language === 'bn' ? 'ওয়েবসাইট ভাষা নির্বাচন ও পরিচালনা' : 'Website Language Settings'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === 'bn'
                        ? 'আপনার পোর্টফোলিও ওয়েবসাইটটি সম্পূর্ণ বাংলা অথবা সম্পূর্ণ ইংরেজি যেকোনো ভাষায় রূপান্তর করুন।'
                        : 'Switch your portfolio completely between Bengali and English anytime.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Language Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bengali Option */}
                <div
                  onClick={() => setLanguage('bn')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    language === 'bn'
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {language === 'bn' && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      <span>বর্তমান ভাষা (Active)</span>
                    </div>
                  )}

                  <div>
                    <div className="text-3xl mb-2">🇧🇩</div>
                    <h4 className="font-display font-bold text-lg text-white mb-1">
                      বাংলা (Bengali)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      পোর্টফোলিওর সমস্ত হেডার, বাটন, ভিডিও ফিল্টার, মোডাল ও নোটিফিকেশন সুন্দর প্রমিত বাংলায় প্রদর্শিত হবে।
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ভিডিও ও পোস্টার গ্যালারির বাংলা লেবেল</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>অ্যাডমিন প্যানেলের সম্পূর্ণ বাংলা ইন্টারফেস</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>সহজ বাংলা নেভিগেশন ও যোগাযোগ ফর্ম</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage('bn');
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      language === 'bn'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    {language === 'bn' ? '✓ বাংলা সক্রিয় আছে' : 'বাংলায় পরিবর্তন করুন'}
                  </button>
                </div>

                {/* English Option */}
                <div
                  onClick={() => setLanguage('en')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    language === 'en'
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {language === 'en' && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      <span>Active Language</span>
                    </div>
                  )}

                  <div>
                    <div className="text-3xl mb-2">🇺🇸</div>
                    <h4 className="font-display font-bold text-lg text-white mb-1">
                      English (ইংরেজি)
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Ideal for international clients, global outreach, and English-speaking prospects.
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1 mb-4">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Professional English navigation & action buttons</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>International video & graphic design showcase categories</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Instant toggle via top navigation bar for all visitors</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage('en');
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    {language === 'en' ? '✓ English is Active' : 'Switch to English'}
                  </button>
                </div>
              </div>

              {/* Visitor Toggle Explanation */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <Globe className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block mb-1">
                    {language === 'bn' ? 'সাধারণ ভিজিটরদের জন্য সুবিধা:' : 'Notice for Visitors:'}
                  </span>
                  {language === 'bn'
                    ? 'ওয়েবসাইটের উপরে ডানপাশে নেভিগেশন বারে একটি "বাং / EN" বোতাম রাখা হয়েছে। ফলে কোনো ভিজিটর বা বিদেশী ক্লায়েন্ট ওয়েবসাইট দেখতে আসলে তারাও নিজের পছন্দমতো এক ক্লিকে বাংলা বা ইংরেজি নির্বাচন করতে পারবেন।'
                    : 'A clean "বাং / EN" switcher is permanently located in the top navigation bar. Any visitor or client can switch between Bengali and English instantly at any time.'}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PROFILE & SOCIAL LINKS                             */}
          {/* ========================================================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Profile Photo Upload */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-amber-500/40 bg-slate-800 flex items-center justify-center">
                    {data.profilePic ? (
                      <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-500" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-amber-400" />
                  </button>
                  <input
                    type="file"
                    ref={profilePhotoInputRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-white mb-1">প্রোফাইল ছবি (Profile Picture)</h4>
                  <p className="text-xs text-slate-400 mb-3">
                    ওয়েবসাইটের শীর্ষের মূল ইমেজ পরিবর্তন করতে এখানে ছবি আপলোড করুন।
                  </p>
                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 flex items-center gap-1.5 mx-auto sm:mx-0 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>ছবি নির্বাচন করুন</span>
                  </button>
                  {profileSuccess && (
                    <span className="text-xs text-emerald-400 font-semibold block mt-1.5">
                      ✓ প্রোফাইল ছবি আপডেট হয়েছে!
                    </span>
                  )}
                </div>
              </div>

              {/* Personal Info & Links Form */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
                <h4 className="font-display font-bold text-sm text-slate-200">
                  ব্যক্তিগত তথ্য ও লিংকসমূহ (Info & External Channels)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">আপনার নাম (Name)</label>
                    <input
                      type="text"
                      value={data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">পদবি (Role)</label>
                    <input
                      type="text"
                      value={data.personalInfo.role}
                      onChange={(e) => updatePersonalInfo({ role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      YouTube চ্যানেল লিংক ("All Videos" বাটনের লিংক)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.youtubeChannelUrl}
                      onChange={(e) => updatePersonalInfo({ youtubeChannelUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Behance লিংক ("Go to Behance" বাটনের লিংক)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.behanceUrl || ''}
                      onChange={(e) => updatePersonalInfo({ behanceUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp সরাসরি চ্যাট লিংক (যেমন: https://wa.me/8801700000000)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.whatsappUrl}
                      onChange={(e) => updatePersonalInfo({ whatsappUrl: e.target.value })}
                      placeholder="https://wa.me/8801700000000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      WhatsApp মোবাইল নাম্বার (যেমন: +880 1700-000000)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.whatsappNumber || ''}
                      onChange={(e) => updatePersonalInfo({ whatsappNumber: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ইমেইল (Email)</label>
                    <input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      placeholder="sohanahammad.connect@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 text-blue-400">
                      ভিয়েন্স লিংক (Behance Portfolio URL)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.behanceUrl || ''}
                      onChange={(e) => updatePersonalInfo({ behanceUrl: e.target.value })}
                      placeholder="https://www.behance.net/sohanahammad"
                      className="w-full px-3 py-2 rounded-xl border border-blue-500/50 bg-slate-900 text-white text-xs font-mono focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 text-red-400">
                      ইউটিউব চ্যানেল লিংক (YouTube Channel URL)
                    </label>
                    <input
                      type="text"
                      value={data.personalInfo.youtubeChannelUrl || ''}
                      onChange={(e) => updatePersonalInfo({ youtubeChannelUrl: e.target.value })}
                      placeholder="https://www.youtube.com/@sohanahammad"
                      className="w-full px-3 py-2 rounded-xl border border-red-500/50 bg-slate-900 text-white text-xs font-mono focus:border-red-400 focus:ring-1 focus:ring-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">ইনস্টাগ্রাম লিংক (Instagram - ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={data.personalInfo.instagramUrl || ''}
                      onChange={(e) => updatePersonalInfo({ instagramUrl: e.target.value })}
                      placeholder="https://www.instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">লিংকডইন লিংক (LinkedIn - ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={data.personalInfo.linkedinUrl || ''}
                      onChange={(e) => updatePersonalInfo({ linkedinUrl: e.target.value })}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">লোকেশন (Location)</label>
                    <input
                      type="text"
                      value={data.personalInfo.location || ''}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      placeholder="Dhaka, Bangladesh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">প্রাপ্যতা (Availability)</label>
                    <input
                      type="text"
                      value={data.personalInfo.availability || ''}
                      onChange={(e) => updatePersonalInfo({ availability: e.target.value })}
                      placeholder="Available for Worldwide Remote & Freelance Projects"
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">বায়ো (Bio Statement)</label>
                    <textarea
                      rows={3}
                      value={data.personalInfo.bio}
                      onChange={(e) => updatePersonalInfo({ bio: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>পরিবর্তনগুলো স্বয়ংক্রিয়ভাবে সংরক্ষিত হচ্ছে!</span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: SECURITY & PASSWORD CHANGE                         */}
          {/* ========================================================= */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-6">
              
              {/* Security Status Card */}
              <div
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  hasCustomPassword
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    hasCustomPassword
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {hasCustomPassword ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">
                      {hasCustomPassword
                        ? (language === 'bn' ? 'আপনার নিজস্ব কাস্টম পাসওয়ার্ড সুরক্ষিত রয়েছে' : 'Your Private Custom Password is Active')
                        : (language === 'bn' ? 'প্রাথমিক ডিফল্ট পাসওয়ার্ড সক্রিয় রয়েছে' : 'Default Initial Password is Active')}
                    </h4>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        hasCustomPassword ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {hasCustomPassword ? (language === 'bn' ? 'সুরক্ষিত' : 'Protected') : (language === 'bn' ? 'আপডেট জরুরি' : 'Update Needed')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {hasCustomPassword
                      ? (language === 'bn'
                          ? 'আপনার অ্যাডমিন প্যানেলটি সম্পূর্ণ নিরাপদ। এই পাসওয়ার্ডটি আর কেউ জানে না বা পাবে না। আপনি চাইলে যেকোনো সময় নিজের ইচ্ছামতো নতুন পাসওয়ার্ড পরিবর্তন করতে পারেন।'
                          : 'Your admin panel is secured with your custom secret password. Only you can access it.')
                      : (language === 'bn'
                          ? 'আপনার পছন্দমতো একটি গোপন পাসওয়ার্ড তৈরি করে নিন, যাতে আপনি ছাড়া অন্য কেউ কখনো অ্যাডমিন প্যানেলে ঢুকতে না পারে।'
                          : 'Please set your own custom private password below to keep your admin access private.')}
                  </p>
                </div>
              </div>

              {/* Password Change Form Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {language === 'bn' ? 'পাসওয়ার্ড সেট বা পরিবর্তন করুন' : 'Set or Change Admin Password'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'bn' ? 'আপনার পছন্দের যেকোনো পাসওয়ার্ড দিয়ে সুরক্ষিত করুন' : 'Choose and save your secret private credentials'}
                    </p>
                  </div>
                </div>

                {/* Direct Admin Reset Switch */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {language === 'bn' ? 'বর্তমান সেশন থেকে সরাসরি নতুন পাসওয়ার্ড দিন' : 'Direct Admin Override Mode'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {language === 'bn'
                          ? 'যেহেতু আপনি ইতোমধ্যে অ্যাডমিন হিসেবে লগইন আছেন, আগের পাসওয়ার্ড না দিয়েও সরাসরি নতুন পাসওয়ার্ড সেট করতে পারবেন'
                          : 'Since you are currently authenticated, you can set a new password directly'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={directAdminReset}
                    onChange={(e) => setDirectAdminReset(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Current Password - Only if directAdminReset is false */}
                  {!directAdminReset && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {language === 'bn' ? 'বর্তমান পাসওয়ার্ড (Current Password)' : 'Current Password'}
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required={!directAdminReset}
                          placeholder={language === 'bn' ? 'আপনার বর্তমান পাসওয়ার্ড লিখুন...' : 'Enter current password...'}
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {language === 'bn' ? 'নতুন গোপন পাসওয়ার্ড (New Secret Password)' : 'New Secret Password'}
                      </label>
                      {newPassword && (
                        <span
                          className={`text-[10px] font-bold ${
                            newPassword.length < 4
                              ? 'text-rose-400'
                              : newPassword.length < 7
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {newPassword.length < 4
                            ? (language === 'bn' ? 'খুব ছোট (<৪ অক্ষর)' : 'Too short')
                            : newPassword.length < 7
                            ? (language === 'bn' ? 'মোটামুটি' : 'Moderate')
                            : (language === 'bn' ? '✓ শক্তিশালী ও নিরাপদ' : '✓ Strong & Secure')}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder={language === 'bn' ? 'আপনার ইচ্ছামতো যেকোনো নতুন পাসওয়ার্ড দিন...' : 'Choose your private secret password...'}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        title={showNewPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        {language === 'bn' ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন (Confirm Password)' : 'Confirm New Password'}
                      </label>
                      {confirmPassword && (
                        <span
                          className={`text-[10px] font-bold ${
                            newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {newPassword === confirmPassword
                            ? (language === 'bn' ? '✓ মিলেছে' : '✓ Matches')
                            : (language === 'bn' ? '✕ মিলছে না' : '✕ Does not match')}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder={language === 'bn' ? 'নতুন পাসওয়ার্ডটি আবার লিখুন...' : 'Re-type your new password...'}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                        title={showConfirmPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Feedback message */}
                  {passwordMsg && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-fade-in ${
                        passwordMsg.isError
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                      }`}
                    >
                      {passwordMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                      <span>{passwordMsg.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{language === 'bn' ? 'নতুন নিজস্ব পাসওয়ার্ড সেভ করুন' : 'Save My Secret Password'}</span>
                  </button>
                </form>
              </div>

              {/* Privacy Guarantee Note */}
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-white block mb-1">
                    {language === 'bn' ? '১০০% গোপনীয়তা ও সুরক্ষার নিশ্চয়তা:' : '100% Privacy & Security Guarantee:'}
                  </span>
                  {language === 'bn'
                    ? 'আপনার নির্বাচিত পাসওয়ার্ডটি সম্পূর্ণ গোপন থাকবে। এটি ওয়েবসাইটে বা অন্য কোথাও প্রকাশ পাবে না। শুধুমাত্র আপনি ছাড়া অন্য কোনো ভিজিটর বা কেউ এটা দেখতে বা প্রবেশ করতে পারবে না।'
                    : 'Your chosen password remains completely private to you. It is never exposed anywhere on the website or to any visitor.'}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: BACKUP & VERCEL SYNC                               */}
          {/* ========================================================= */}
          {activeTab === 'backup' && (
            <div className="space-y-5">
              
              {/* Featured Card: 1-Click Project ZIP Download for Vercel */}
              <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-950 to-slate-950 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-white">
                          {language === 'bn' ? 'সম্পূর্ণ আপডেটেড প্রজেক্ট এক ক্লিকে ডাউনলোড (ZIP)' : 'Download Complete Updated Project (ZIP)'}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                          {language === 'bn' ? 'একবারে সব আপডেট' : 'All-in-One'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {language === 'bn'
                          ? 'আপনার নতুন যুক্ত করা বাংলা-ইংরেজি ভাষা, গোপন পাসওয়ার্ড সিস্টেম ও সকল ভিডিও/গ্রাফিক্স সহ পুরো সাইটটির রেডি ফাইল একসাথে জিপ আকারে ডাউনলোড করুন।'
                          : 'Download the entire project including all bilingual features, security updates, and portfolios in a ready-to-deploy ZIP archive.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFreshZip}
                    disabled={isBuildingZip}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBuildingZip ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{language === 'bn' ? 'সব ভিডিও ও লিংক সিঙ্ক করে নতুন ZIP তৈরি হচ্ছে...' : 'Syncing all videos & links into new ZIP...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>{language === 'bn' ? '১-ক্লিকে সব লিংক ও ভিডিও সহ নতুন প্রজেক্ট ZIP ডাউনলোড করুন' : 'Download Complete Project (.ZIP)'}</span>
                      </>
                    )}
                  </button>

                  {zipDownloadSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                      <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                      <span>
                        {language === 'bn'
                          ? 'আপনার সব ইউটিউব লিংক, বেহ্যান্স লিংক, হোয়াটসঅ্যাপ নাম্বার, ভিডিও ও গ্রাফিক্স সফলভাবে কোডে সেভ হয়েছে এবং নতুন জিপ ডাউনলোড শুরু হয়েছে!'
                          : 'All your YouTube links, Behance links, WhatsApp numbers, videos, and graphics have been packaged into your fresh ZIP file!'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3 Simple Steps for Vercel Update */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {language === 'bn' ? '🚀 ভার্সেলে আপনার আগের লিংকেই একবারে আপডেট করার নিয়ম:' : '🚀 3 Steps to Update Your Existing Vercel Site:'}
                  </h5>
                  <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>
                      <span className="text-white font-medium">
                        {language === 'bn' ? 'উপরের বাটনে ক্লিক করে ' : 'Download '}
                      </span>
                      <strong className="text-amber-400">sohan-portfolio-latest.zip</strong> {language === 'bn' ? 'ডাউনলোড ও আনজিপ করুন।' : 'and extract it.'}
                    </li>
                    <li>
                      {language === 'bn'
                        ? 'আপনার GitHub রিপোজিটরিতে ঢুকে "Add file" > "Upload files" এ ক্লিক করে সব ফাইল ড্র্যাগ অ্যান্ড ড্রপ করে Commit changes করুন।'
                        : 'Go to your GitHub repo, click "Add file" > "Upload files", drag & drop the files, and click Commit changes.'}
                    </li>
                    <li>
                      {language === 'bn'
                        ? 'গিটহাবে আপলোড করার সাথে সাথে Vercel নিজে থেকেই ১-২ মিনিটের মধ্যে আপনার আগের লিংকেই পুরো সাইটটি নতুনভাবে আপডেট করে দেবে!'
                        : 'Vercel will automatically detect the commit and deploy your updated site to your existing domain in 1 minute!'}
                    </li>
                  </ol>
                </div>
              </div>

              {/* JSON Backup & Restore Card */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {language === 'bn' ? 'ডাটা ব্যাকআপ ও রিস্টোর (Backup & Restore)' : 'Data Backup & Restore (JSON)'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'bn'
                        ? 'আপনার সমস্ত ভিডিও, গ্রাফিক্স ও ব্যক্তিগত তথ্য ডাউনলোড করে রাখতে পারেন অথবা আগের কোনো ব্যাকআপ রিস্টোর করতে পারেন।'
                        : 'Download a backup JSON file or restore previous portfolio data instantly.'}
                    </p>
                  </div>
                </div>

                {/* Import Status Alert */}
                {importStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      importStatus.startsWith('success')
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {importStatus.startsWith('success') ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{importStatus.split(':')[1]}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {/* Download Backup */}
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{language === 'bn' ? 'JSON ব্যাকআপ ডাউনলোড' : 'Download Backup (.JSON)'}</span>
                  </button>

                  {/* Restore / Upload Backup */}
                  <button
                    type="button"
                    onClick={() => backupFileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ব্যাকআপ ফাইল আপলোড/রিস্টোর করুন' : 'Upload & Restore Backup (.JSON)'}</span>
                  </button>

                  <input
                    type="file"
                    ref={backupFileInputRef}
                    onChange={handleImportFile}
                    accept=".json,application/json"
                    className="hidden"
                  />
                </div>
              </div>

              {/* 1-Click Code Copy Card */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60">
                <h4 className="font-display font-bold text-sm text-white mb-2">
                  {language === 'bn' ? 'গিটহাব কোড কপি (1-Click Copy)' : 'GitHub Data Code Copy (1-Click)'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {language === 'bn'
                    ? 'আপনি চাইলে এক ক্লিকে সম্পূর্ণ আপডেটেড ডাটা কোড কপি করে আপনার গিটহাবের src/portfolioData.ts ফাইলে সরাসরি পেস্ট করে দিতে পারেন।'
                    : 'You can copy the updated data code with a single click and paste it directly into your GitHub src/portfolioData.ts file.'}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    const code = `export const PERSONAL_INFO = ${JSON.stringify(data.personalInfo, null, 2)};\n\nexport const FEATURED_VIDEO = ${JSON.stringify(data.featuredVideo, null, 2)};\n\nexport const PORTFOLIO_VIDEOS = ${JSON.stringify(data.portfolioVideos, null, 2)};\n\nexport const GRAPHIC_ITEMS = ${JSON.stringify(data.graphicItems, null, 2)};\n`;
                    navigator.clipboard.writeText(code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 3000);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? (language === 'bn' ? 'কোড ক্লিপবোর্ডে কপি হয়েছে!' : 'Code copied to clipboard!') : (language === 'bn' ? 'কোড কপি করুন (Copy Code)' : 'Copy Updated Data for GitHub (1-Click)')}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info & close */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>অ্যাডমিন মোড সক্রিয় • সর্বমোট ভিডিও: {data.portfolioVideos.length}, গ্রাফিক্স: {data.graphicItems.length}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowAdminDashboard(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
          >
            বন্ধ করুন (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
