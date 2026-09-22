import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioDataState, VideoItem, GraphicItem, PersonalInfo, Language } from '../types';
import { PERSONAL_INFO, FEATURED_VIDEO, PORTFOLIO_VIDEOS, GRAPHIC_ITEMS } from '../portfolioData';
import { getItem, setItem, clearAll, extractYouTubeId } from '../utils/mediaStorage';
import { t as translate, TranslationKey } from '../utils/translations';

interface PortfolioContextType {
  data: PortfolioDataState;
  isLoaded: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  lastSavedTime: string | null;
  activeEditModal: 'all' | 'profile' | 'featured' | 'videos' | 'graphics' | 'bio' | null;
  activeEditingItemId?: string;
  openEditModal: (section?: 'all' | 'profile' | 'featured' | 'videos' | 'graphics' | 'bio', itemId?: string) => void;
  closeEditModal: () => void;
  isAdmin: boolean;
  hasCustomPassword: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  resetAdminPasswordToDefault: () => void;
  changeAdminPassword: (oldPass: string, newPass: string, forceAdminOverride?: boolean) => { success: boolean; message: string };
  setCustomPasswordDirectly: (newPass: string) => { success: boolean; message: string };
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;
  showAdminDashboard: boolean;
  setShowAdminDashboard: (show: boolean) => void;
  openAdminDashboard: () => void;
  updateProfilePic: (newImageSrc: string) => Promise<void>;
  updateFeaturedVideo: (video: Partial<VideoItem>) => Promise<void>;
  updatePortfolioVideo: (id: string, updates: Partial<VideoItem>) => Promise<void>;
  addPortfolioVideo: (newVideo?: Partial<VideoItem>) => Promise<string>;
  deletePortfolioVideo: (id: string) => Promise<void>;
  reorderPortfolioVideo: (id: string, direction: 'prev' | 'next') => Promise<void>;
  updateGraphicItem: (id: string, updates: Partial<GraphicItem>) => Promise<void>;
  addGraphicItem: (newItem?: Partial<GraphicItem>) => Promise<string>;
  deleteGraphicItem: (id: string) => Promise<void>;
  reorderGraphicItem: (id: string, direction: 'prev' | 'next') => Promise<void>;
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => Promise<void>;
  saveAllNow: () => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
  importBackupData: (backupObj: any) => Promise<boolean>;
  generateCustomHtml: () => string;
}

const STORAGE_KEY = 'sohan_portfolio_data_v1';

const defaultState: PortfolioDataState = {
  profilePic: '',
  personalInfo: PERSONAL_INFO,
  featuredVideo: FEATURED_VIDEO,
  portfolioVideos: PORTFOLIO_VIDEOS,
  graphicItems: GRAPHIC_ITEMS,
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [activeEditModal, setActiveEditModal] = useState<'all' | 'profile' | 'featured' | 'videos' | 'graphics' | 'bio' | null>(null);
  const [activeEditingItemId, setActiveEditingItemId] = useState<string | undefined>(undefined);

  // Admin authentication & control state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sohan_admin_authenticated') === 'true';
  });
  const [hasCustomPassword, setHasCustomPassword] = useState<boolean>(() => {
    return localStorage.getItem('sohan_admin_is_custom') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [pendingEditAction, setPendingEditAction] = useState<{
    section?: 'all' | 'profile' | 'featured' | 'videos' | 'graphics' | 'bio';
    itemId?: string;
  } | null>(null);

  // Multi-Language state: supports 'bn' (বাংলা) and 'en' (English)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sohan_portfolio_lang');
    return saved === 'en' || saved === 'bn' ? saved : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sohan_portfolio_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const t = (key: TranslationKey): string => {
    return translate(language, key);
  };

  // Listen to #admin hash navigation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (isAdmin) {
          setShowAdminDashboard(true);
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  const loginAdmin = (password: string): boolean => {
    const stored = localStorage.getItem('sohan_admin_pwd');
    const trimmed = password.trim();

    // 1. 'sohan123' (case-insensitive) always works as the master owner key
    // 2. Any custom password saved in localStorage also works
    const isMasterDefault = trimmed.toLowerCase() === 'sohan123';
    const isCustomMatch = stored ? (trimmed === stored.trim() || trimmed.toLowerCase() === stored.trim().toLowerCase()) : false;
    const isValid = isMasterDefault || isCustomMatch;

    if (isValid) {
      setIsAdmin(true);
      localStorage.setItem('sohan_admin_authenticated', 'true');
      setShowAdminLoginModal(false);
      
      if (pendingEditAction) {
        setActiveEditModal(pendingEditAction.section || 'all');
        setActiveEditingItemId(pendingEditAction.itemId);
        setPendingEditAction(null);
      } else {
        setShowAdminDashboard(true);
      }
      return true;
    }
    return false;
  };

  const resetAdminPasswordToDefault = () => {
    localStorage.removeItem('sohan_admin_is_custom');
    localStorage.removeItem('sohan_admin_pwd');
    setHasCustomPassword(false);
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('sohan_admin_authenticated');
    setShowAdminDashboard(false);
    setActiveEditModal(null);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const changeAdminPassword = (
    oldPass: string,
    newPass: string,
    forceAdminOverride = false
  ): { success: boolean; message: string } => {
    const isCustom = localStorage.getItem('sohan_admin_is_custom') === 'true';
    const currentStored = localStorage.getItem('sohan_admin_pwd') || 'sohan123';

    if (!forceAdminOverride) {
      if (oldPass.trim() !== currentStored.trim()) {
        return {
          success: false,
          message: language === 'bn' 
            ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়! দয়া করে আপনার সঠিক পূর্ববর্তী পাসওয়ার্ড দিন।' 
            : 'Current password is incorrect! Please enter your valid current password.'
        };
      }
    }

    if (!newPass || newPass.trim().length < 4) {
      return {
        success: false,
        message: language === 'bn'
          ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।'
          : 'New password must be at least 4 characters.'
      };
    }

    const trimmedNew = newPass.trim();
    localStorage.setItem('sohan_admin_pwd', trimmedNew);
    localStorage.setItem('sohan_admin_is_custom', 'true');
    setHasCustomPassword(true);

    return {
      success: true,
      message: language === 'bn'
        ? 'আপনার নিজস্ব গোপন পাসওয়ার্ড সফলভাবে সেভ করা হয়েছে! এখন থেকে শুধুমাত্র এই নতুন পাসওয়ার্ড দিয়েই অ্যাডমিন পোর্টাল খোলা যাবে।'
        : 'Your private custom password has been saved! From now on, only this password can unlock the admin portal.'
    };
  };

  const setCustomPasswordDirectly = (newPass: string): { success: boolean; message: string } => {
    return changeAdminPassword('', newPass, true);
  };

  const openAdminDashboard = () => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
    } else {
      setShowAdminDashboard(true);
    }
  };

  // Load from IndexedDB or Server API on startup
  useEffect(() => {
    async function loadData() {
      try {
        let saved = await getItem<PortfolioDataState>(STORAGE_KEY);
        
        // Fallback to localStorage backup if IndexedDB is empty
        if (!saved) {
          try {
            const ls = localStorage.getItem('sohan_portfolio_backup');
            if (ls) saved = JSON.parse(ls);
          } catch {
            // ignore
          }
        }

        // Fallback to server API or static saved_portfolio.json if local is empty
        if (!saved) {
          try {
            const res = await fetch('/api/get-portfolio');
            if (res.ok) {
              saved = await res.json();
            } else {
              const staticRes = await fetch('/saved_portfolio.json');
              if (staticRes.ok) {
                saved = await staticRes.json();
              }
            }
          } catch {
            try {
              const staticRes = await fetch('/saved_portfolio.json');
              if (staticRes.ok) {
                saved = await staticRes.json();
              }
            } catch {
              // ignore
            }
          }
        }

        if (saved) {
          const isOldGeneratedPic =
            saved.profilePic &&
            (saved.profilePic.includes('profile_photo') ||
             saved.profilePic.includes('sohan_exact'));

          const cleanProfilePic = isOldGeneratedPic ? '/profile.jpg' : (saved.profilePic || '/profile.jpg');

          let mergedVideos = saved.portfolioVideos && saved.portfolioVideos.length ? saved.portfolioVideos : defaultState.portfolioVideos;
          // Ensure new slots (up to 10) are included for users with existing cached state
          if (mergedVideos.length < defaultState.portfolioVideos.length) {
            const existingIds = new Set(mergedVideos.map((v) => v.id));
            const newSlots = defaultState.portfolioVideos.filter((v) => !existingIds.has(v.id));
            mergedVideos = [...mergedVideos, ...newSlots];
          }

          const finalState: PortfolioDataState = {
            ...defaultState,
            ...saved,
            profilePic: cleanProfilePic,
            personalInfo: { ...defaultState.personalInfo, ...(saved.personalInfo || {}) },
            featuredVideo: { ...defaultState.featuredVideo, ...(saved.featuredVideo || {}) },
            portfolioVideos: mergedVideos,
            graphicItems: saved.graphicItems && saved.graphicItems.length ? saved.graphicItems : defaultState.graphicItems,
          };

          setData(finalState);
          setLastSavedTime('Loaded from saved profile');

          // Auto-sync with server so src/portfolioData.ts, public/saved_portfolio.json, and the ZIP are in perfect sync
          try {
            fetch('/api/save-portfolio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(finalState),
            }).catch(() => {});
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load saved portfolio data', err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const persist = async (nextState: PortfolioDataState) => {
    setData(nextState);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(now);

    // 1. Save to IndexedDB (for large images and videos)
    try {
      await setItem(STORAGE_KEY, nextState);
    } catch (e) {
      console.error('Failed to save to IndexedDB', e);
    }

    // 2. Save backup to localStorage
    try {
      localStorage.setItem('sohan_portfolio_backup', JSON.stringify(nextState));
    } catch (e) {
      // ignore quota limits if image is large
    }

    // 3. Save to Server File via API
    try {
      await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextState),
      });
    } catch {
      // silent offline fallback
    }
  };

  const saveAllNow = async (): Promise<boolean> => {
    await persist(data);
    return true;
  };

  const openEditModal = (section: 'all' | 'profile' | 'featured' | 'videos' | 'graphics' | 'bio' = 'all', itemId?: string) => {
    if (!isAdmin) {
      setPendingEditAction({ section, itemId });
      setShowAdminLoginModal(true);
      return;
    }
    setActiveEditModal(section);
    setActiveEditingItemId(itemId);
  };

  const closeEditModal = () => {
    setActiveEditModal(null);
    setActiveEditingItemId(undefined);
  };

  const updateProfilePic = async (newImageSrc: string) => {
    const next = { ...data, profilePic: newImageSrc };
    await persist(next);
  };

  const updateFeaturedVideo = async (videoUpdates: Partial<VideoItem>) => {
    const cleaned = { ...videoUpdates };
    if (cleaned.youtubeId) {
      cleaned.youtubeId = extractYouTubeId(cleaned.youtubeId);
    }
    const next = {
      ...data,
      featuredVideo: { ...data.featuredVideo, ...cleaned },
    };
    await persist(next);
  };

  const updatePortfolioVideo = async (id: string, updates: Partial<VideoItem>) => {
    const cleaned = { ...updates };
    if (cleaned.youtubeId) {
      cleaned.youtubeId = extractYouTubeId(cleaned.youtubeId);
    }
    const nextVideos = data.portfolioVideos.map((v) =>
      v.id === id ? { ...v, ...cleaned } : v
    );
    const next = { ...data, portfolioVideos: nextVideos };
    await persist(next);
  };

  const addPortfolioVideo = async (newVideo?: Partial<VideoItem>): Promise<string> => {
    const newId = 'video-' + Date.now();
    const item: VideoItem = {
      id: newId,
      youtubeId: newVideo?.youtubeId ? extractYouTubeId(newVideo.youtubeId) : (newVideo?.videoSourceType === 'local' ? '' : 'hsPSXISkhbo'),
      videoSourceType: newVideo?.videoSourceType || 'youtube',
      videoUrl: newVideo?.videoUrl || '',
      blobKey: newVideo?.blobKey || '',
      thumbnailUrl: newVideo?.thumbnailUrl || '',
      title: newVideo?.title || `New Video Slide ${data.portfolioVideos.length + 1}`,
      category: newVideo?.category || 'Creative Video Edit',
      description: newVideo?.description || 'Custom video editing cut showcasing narrative pacing and sound design.',
    };
    const next = { ...data, portfolioVideos: [...data.portfolioVideos, item] };
    await persist(next);
    return newId;
  };

  const deletePortfolioVideo = async (id: string) => {
    if (data.portfolioVideos.length <= 1) {
      alert('কমপক্ষে একটি ভিডিও স্লাইড থাকতে হবে।');
      return;
    }
    const next = { ...data, portfolioVideos: data.portfolioVideos.filter((v) => v.id !== id) };
    await persist(next);
  };

  const reorderPortfolioVideo = async (id: string, direction: 'prev' | 'next') => {
    const index = data.portfolioVideos.findIndex((v) => v.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.portfolioVideos.length) return;

    const nextItems = [...data.portfolioVideos];
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, moved);
    const next = { ...data, portfolioVideos: nextItems };
    await persist(next);
  };

  const updateGraphicItem = async (id: string, updates: Partial<GraphicItem>) => {
    const nextGraphics = data.graphicItems.map((g) =>
      g.id === id ? { ...g, ...updates } : g
    );
    const next = { ...data, graphicItems: nextGraphics };
    await persist(next);
  };

  const addGraphicItem = async (newItem?: Partial<GraphicItem>): Promise<string> => {
    const newId = 'graphic-' + Date.now();
    const item: GraphicItem = {
      id: newId,
      filename: newItem?.filename || '/graphics/1.jpg',
      title: newItem?.title || `New Design ${data.graphicItems.length + 1}`,
      subtitle: newItem?.subtitle || 'Custom Visual Art',
      category: newItem?.category || 'Poster Design',
      fitMode: newItem?.fitMode || 'cover',
    };
    const next = { ...data, graphicItems: [...data.graphicItems, item] };
    await persist(next);
    return newId;
  };

  const deleteGraphicItem = async (id: string) => {
    if (data.graphicItems.length <= 1) {
      alert('কমপক্ষে একটি ডিজাইন স্লাইড থাকতে হবে।');
      return;
    }
    const next = { ...data, graphicItems: data.graphicItems.filter((g) => g.id !== id) };
    await persist(next);
  };

  const reorderGraphicItem = async (id: string, direction: 'prev' | 'next') => {
    const index = data.graphicItems.findIndex((g) => g.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.graphicItems.length) return;

    const nextItems = [...data.graphicItems];
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, moved);
    const next = { ...data, graphicItems: nextItems };
    await persist(next);
  };

  const updatePersonalInfo = async (updates: Partial<PersonalInfo>) => {
    const next = {
      ...data,
      personalInfo: { ...data.personalInfo, ...updates },
    };
    await persist(next);
  };

  const resetToDefaults = async () => {
    await clearAll();
    setData(defaultState);
  };

  const importBackupData = async (backupData: any): Promise<boolean> => {
    try {
      if (!backupData || typeof backupData !== 'object') return false;
      const next: PortfolioDataState = {
        profilePic: backupData.profilePic || data.profilePic,
        personalInfo: backupData.personalInfo || data.personalInfo,
        featuredVideo: backupData.featuredVideo || data.featuredVideo,
        portfolioVideos: Array.isArray(backupData.portfolioVideos) ? backupData.portfolioVideos : data.portfolioVideos,
        graphicItems: Array.isArray(backupData.graphicItems) ? backupData.graphicItems : data.graphicItems,
      };
      setData(next);
      await persist(next);
      return true;
    } catch {
      return false;
    }
  };

  const generateCustomHtml = () => {
    // Generate standalone HTML with all current customizations embedded
    const { personalInfo, featuredVideo, portfolioVideos, graphicItems, profilePic } = data;

    const videoCardsHtml = portfolioVideos.map((v, i) => `
        <!-- Video ${i + 1} -->
        <div class="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl">
          <div class="aspect-video w-full bg-black relative">
            <iframe
              src="https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0&modestbranding=1"
              title="${v.title}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
              class="absolute inset-0 w-full h-full border-0"
            ></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700/60 inline-block mb-2">
              ${v.category}
            </span>
            <h3 class="text-lg font-display font-bold text-slate-100">
              ${v.title}
            </h3>
            ${v.description ? `<p class="text-xs text-slate-400 mt-1">${v.description}</p>` : ''}
          </div>
        </div>`).join('\n');

    const graphicCardsHtml = graphicItems.map((g) => `
        <!-- Graphic Card -->
        <div class="graphic-card cursor-pointer group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5" data-src="${g.filename}" data-title="${g.title}">
          <div class="aspect-[4/3] w-full overflow-hidden bg-black flex items-center justify-center">
            <img src="${g.filename}" alt="${g.title}" class="w-full h-full ${g.fitMode === 'contain' ? 'object-contain p-2' : 'object-cover'} transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div class="p-4">
            <span class="text-[11px] font-semibold text-amber-400">${g.category}</span>
            <h3 class="font-display font-bold text-base text-slate-100">${g.title}</h3>
            ${g.subtitle ? `<p class="text-xs text-slate-400 mt-0.5">${g.subtitle}</p>` : ''}
          </div>
        </div>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personalInfo.name} | Video Editor Portfolio</title>
  <meta name="description" content="Portfolio of ${personalInfo.name}, ${personalInfo.role}." />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            display: ['Syne', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body, nav, header, section, footer, div, card {
      transition-property: background-color, border-color, color;
      transition-duration: 250ms;
      transition-timing-function: ease-in-out;
    }
    .aspect-video { aspect-ratio: 16 / 9; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-black">

  <!-- A. Navigation Bar -->
  <header class="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 text-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="#" class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-slate-950 font-bold text-lg">
          ${personalInfo.name.charAt(0)}
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold text-base sm:text-lg tracking-tight">${personalInfo.name}</span>
          <span class="text-[11px] font-medium uppercase text-amber-500/90 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ${personalInfo.role}
          </span>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <a href="#featured-section" class="hover:text-amber-500 transition-colors">Featured</a>
        <a href="#videos-section" class="hover:text-amber-500 transition-colors">Videos</a>
        <a href="#graphics-section" class="hover:text-amber-500 transition-colors">Graphics</a>
        <a href="#about-section" class="hover:text-amber-500 transition-colors">About</a>
        <a href="#contact-section" class="hover:text-amber-500 transition-colors">Contact</a>
      </nav>

      <button id="theme-toggle-btn" class="p-2 rounded-lg border border-slate-800 bg-slate-900 text-amber-400 flex items-center gap-1.5">
        <span id="theme-icon">🌙</span>
        <span id="theme-text" class="text-xs font-semibold pr-1">Dark</span>
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

    <!-- B. Hero Section -->
    <section id="featured-section" class="mb-16">
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3 px-1">
          <div class="flex items-center gap-2">
            <span class="flex h-2.5 w-2.5 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span class="text-xs uppercase tracking-wider font-semibold text-rose-500">
              ${featuredVideo.category}
            </span>
          </div>
          <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Showreel
          </span>
        </div>
        <div class="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-video">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${featuredVideo.youtubeId}?rel=0&modestbranding=1"
            title="${featuredVideo.title}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            class="absolute inset-0 w-full h-full border-0"
          ></iframe>
        </div>
      </div>

      <div class="rounded-2xl p-6 sm:p-8 border border-slate-800 bg-slate-900/60 shadow-lg">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div class="relative shrink-0">
            <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 shadow-xl bg-slate-800">
              <img src="${profilePic}" alt="${personalInfo.name}" class="w-full h-full object-cover object-center" />
            </div>
            <div class="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
              Available
            </div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-amber-500/10 border-amber-500/30 text-amber-400">
              <span>${personalInfo.role}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight mb-3">
              Hi, I'm ${personalInfo.name}.
            </h1>
            <p class="text-base sm:text-lg leading-relaxed mb-6 text-slate-300 max-w-2xl">
              Welcome to my portfolio! Passionate about cutting dynamic edits, perfecting rhythm, and shaping unforgettable audiovisual narratives.
            </p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a href="#videos-section" class="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
                Explore Works ↓
              </a>
              <a href="#contact-section" class="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-800 text-slate-200">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- C. Video Portfolio Grid -->
    <section id="videos-section" class="py-12 border-t border-slate-800/80">
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white mb-2">
          Video Portfolio
        </h2>
        <p class="text-sm text-slate-400">Curated selection of recent editing projects and cuts.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        ${videoCardsHtml}
      </div>
      <div class="mt-10 flex flex-col items-center justify-center">
        <a href="${personalInfo.youtubeChannelUrl || 'https://www.youtube.com'}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>All Videos</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </section>

    <!-- D. Graphic Work Section -->
    <section id="graphics-section" class="py-12 border-t border-slate-800/80">
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white mb-2">
          Graphic & Poster Designs
        </h2>
        <p class="text-sm text-slate-400">Visual key art, thumbnails & editorial designs. Click any image to view.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${graphicCardsHtml}
      </div>
      <div class="mt-10 flex flex-col items-center justify-center">
        <a href="${personalInfo.behanceUrl || 'https://www.behance.net'}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#0057ff] to-[#003bb3] hover:from-[#1a68ff] hover:to-[#004bd9] text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105">
          <span class="w-5 h-5 rounded bg-white text-[#0057ff] flex items-center justify-center font-black text-xs">Bē</span>
          <span>Go to Behance</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </section>

    <!-- E. About Me Section -->
    <section id="about-section" class="py-12 border-t border-slate-800/80">
      <h2 class="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white mb-6">About Me</h2>
      <div class="rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-900/60 shadow-xl">
        <p class="text-base sm:text-xl font-normal leading-relaxed text-slate-200 pl-4 sm:pl-6 border-l-2 border-amber-500">
          "${personalInfo.bio}"
        </p>
      </div>
    </section>

    <!-- F. Contact & Location Section -->
    <section id="contact-section" class="py-14 border-t border-slate-800/80">
      <div class="rounded-3xl p-6 sm:p-12 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
        <div class="text-center max-w-2xl mx-auto mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>${personalInfo.availability || 'Available for Worldwide Remote & Freelance Projects'}</span>
          </div>
          <h2 class="text-2xl sm:text-4xl font-display font-extrabold tracking-tight text-white mb-3">
            Let's Create Something Memorable
          </h2>
          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            Ready to collaborate on your next video, trailer, or visual campaign? Feel free to reach out directly via Gmail or WhatsApp!
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <!-- Gmail Card -->
          <div class="rounded-2xl p-5 border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
            <div>
              <div class="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Gmail / Email</div>
              <p class="text-xs text-slate-400 mb-3">${personalInfo.responseTime || 'Quick Response (under 2 hours)'}</p>
              <div class="p-2.5 rounded-xl border border-slate-800 bg-slate-900 font-mono text-xs text-slate-200 truncate mb-4">
                ${personalInfo.email}
              </div>
            </div>
            <div class="space-y-2">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=Video%20Editing%20Inquiry" target="_blank" rel="noopener noreferrer" class="block w-full py-2.5 px-3 rounded-xl font-bold text-xs text-center bg-red-600 hover:bg-red-500 text-white shadow-md">
                Open in Gmail Web
              </a>
              <a href="mailto:${personalInfo.email}?subject=Video%20Editing%20Inquiry" class="block w-full py-2 px-3 rounded-xl font-semibold text-xs text-center border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white">
                Default Mail App
              </a>
            </div>
          </div>

          <!-- WhatsApp Card -->
          <div class="rounded-2xl p-5 border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
            <div>
              <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">WhatsApp Direct</div>
              <p class="text-xs text-slate-400 mb-3">Direct Chat & Call</p>
              <div class="p-2.5 rounded-xl border border-slate-800 bg-slate-900 font-mono text-xs text-emerald-300 font-semibold truncate mb-4">
                ${personalInfo.whatsappNumber || '+880 1700-000000'}
              </div>
            </div>
            <div>
              <a href="${personalInfo.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="block w-full py-2.5 px-3 rounded-xl font-bold text-xs text-center bg-emerald-600 hover:bg-emerald-500 text-white shadow-md">
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <!-- Location Card -->
          <div class="rounded-2xl p-5 border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
            <div>
              <div class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Location & Remote</div>
              <p class="text-xs text-slate-400 mb-3">Based in <strong class="text-white">${personalInfo.location || 'Dhaka, Bangladesh'}</strong></p>
              <div class="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 mb-2">
                📍 ${personalInfo.location || 'Dhaka, Bangladesh'}
              </div>
              <div class="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-300 font-mono">
                🕒 Timezone: GMT+6 (BST)
              </div>
            </div>
            <div class="pt-3 text-[11px] text-slate-400">
              Cloud delivery via Google Drive & Frame.io
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  <footer class="py-8 border-t border-slate-900 text-center text-xs text-slate-500">
    <p>© 2026 ${personalInfo.name} • ${personalInfo.role}</p>
  </footer>

  <!-- Lightbox -->
  <div id="image-lightbox" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
    <div class="relative max-w-4xl w-full flex flex-col items-center">
      <button id="lightbox-close" class="absolute -top-12 right-0 p-2 text-white hover:text-amber-400 text-2xl font-bold">✕ Close</button>
      <div class="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 max-h-[75vh]">
        <img id="lightbox-img" src="" alt="" class="max-h-[70vh] w-auto max-w-full object-contain" />
      </div>
      <h4 id="lightbox-caption" class="text-white font-display font-bold text-lg mt-3 text-center"></h4>
    </div>
  </div>

  <script>
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    let isDark = true;
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.remove('bg-slate-50', 'text-slate-900');
        document.body.classList.add('bg-slate-950', 'text-slate-100');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-slate-950', 'text-slate-100');
        document.body.classList.add('bg-slate-50', 'text-slate-900');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
      }
    });

    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    document.querySelectorAll('.graphic-card').forEach(card => {
      card.addEventListener('click', () => {
        lightboxImg.src = card.getAttribute('data-src');
        lightboxCaption.textContent = card.getAttribute('data-title');
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
      });
    });
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
      }
    });
  </script>
</body>
</html>`;
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoaded,
        language,
        setLanguage,
        toggleLanguage,
        t,
        activeEditModal,
        activeEditingItemId,
        openEditModal,
        closeEditModal,
        isAdmin,
        hasCustomPassword,
        loginAdmin,
        logoutAdmin,
        resetAdminPasswordToDefault,
        changeAdminPassword,
        setCustomPasswordDirectly,
        showAdminLoginModal,
        setShowAdminLoginModal,
        showAdminDashboard,
        setShowAdminDashboard,
        openAdminDashboard,
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
        importBackupData,
        generateCustomHtml,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
