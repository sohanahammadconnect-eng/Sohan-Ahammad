import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  X,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Moon,
  Sun,
  Eye,
  Film,
  Grid,
  Mail,
  User,
  Check,
  Share2,
  Maximize2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ThemeMode } from '../types';

interface MobileSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeMode;
  onToggleTheme: () => void;
}

export const MobileSimulatorModal: React.FC<MobileSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onToggleTheme,
}) => {
  const { data, language, t } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'interactive' | 'mockup'>('interactive');
  const [phoneScale, setPhoneScale] = useState<number>(0.9);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Adjust default scale on small screens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerHeight < 800) {
        setPhoneScale(0.8);
      } else {
        setPhoneScale(0.9);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://sohan-ahammad.vercel.app';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isDark = currentTheme === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-hidden"
    >
      <div className="relative w-full max-w-5xl h-[95vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Header & Mode Switcher */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">
                  স্মার্টফোন লাইভ প্রিভিউ (Mobile Phone Preview)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Responsive 390px
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                যেকোনো স্মার্টফোনে সোবহান আহাম্মদের পোর্টফোলিও কেমন দেখাবে তার রিয়েল-টাইম সিমুলেশন।
              </p>
            </div>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'interactive'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>ইন্টারেক্টিভ ফোন</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mockup')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'mockup'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>মকআপ আর্ট</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
              title="বন্ধ করুন (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row bg-slate-950/60">
          
          {/* Main Visual Display (Center) */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-6 overflow-auto">
            {activeTab === 'interactive' ? (
              /* REALISTIC SMARTPHONE (iPhone 16 Pro Style) DEVICE FRAME */
              <div
                style={{ transform: `scale(${phoneScale})`, transformOrigin: 'center center' }}
                className="transition-transform duration-300 relative w-[390px] h-[780px] bg-slate-950 rounded-[52px] p-3 shadow-[0_0_60px_-15px_rgba(245,158,11,0.25)] border-[8px] border-slate-800 ring-1 ring-white/10 shrink-0 select-none flex flex-col"
              >
                {/* Physical Phone Side Buttons (Titanium Accents) */}
                <div className="absolute -left-[11px] top-28 w-[3px] h-8 bg-slate-700 rounded-l-md"></div>
                <div className="absolute -left-[11px] top-40 w-[3px] h-12 bg-slate-700 rounded-l-md"></div>
                <div className="absolute -left-[11px] top-56 w-[3px] h-12 bg-slate-700 rounded-l-md"></div>
                <div className="absolute -right-[11px] top-36 w-[3px] h-16 bg-slate-700 rounded-r-md"></div>

                {/* Inner Screen Area */}
                <div className="relative w-full h-full bg-slate-950 rounded-[42px] overflow-hidden flex flex-col border border-slate-800/80">
                  
                  {/* Status Bar & Dynamic Island */}
                  <div className="w-full h-9 bg-slate-950 px-6 flex items-center justify-between z-30 shrink-0 text-white font-medium text-[11px]">
                    <span>9:41</span>
                    {/* Dynamic Island pill */}
                    <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 space-x-1 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>5G</span>
                      <div className="w-4 h-2.5 rounded-[3px] border border-white/60 p-0.5 flex items-center">
                        <div className="w-2 h-1.5 bg-white rounded-[1px]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Screen Content (Interactive Mini Layout) */}
                  <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} scrollbar-thin`}>
                    
                    {/* Mini Mobile Navbar */}
                    <div className="sticky top-0 z-20 px-4 py-2.5 flex items-center justify-between border-b backdrop-blur-md bg-slate-950/90 border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-amber-500/50 bg-slate-800 shrink-0">
                          {data.profilePic ? (
                            <img src={data.profilePic} alt="Sohan" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 m-1.5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display font-bold text-xs text-white leading-tight">
                            {data.personalInfo.name}
                          </span>
                          <span className="text-[9px] text-amber-400 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                            <span>{data.personalInfo.role}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={onToggleTheme}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400"
                        >
                          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        </button>
                        <div className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
                          {language === 'bn' ? 'BN' : 'EN'}
                        </div>
                      </div>
                    </div>

                    {/* Mini Hero Profile */}
                    <div className="px-4 py-5 text-center flex flex-col items-center">
                      <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] bg-slate-900">
                          {data.profilePic ? (
                            <img src={data.profilePic} alt="Sohan Ahammad" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-12 h-12 m-6 text-amber-400" />
                          )}
                        </div>
                        <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950 border border-slate-950 shadow">
                          Available
                        </span>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2">
                        {data.personalInfo.role}
                      </span>

                      <h2 className="font-display font-extrabold text-xl text-white mb-1.5">
                        Hi, I'm <span className="text-amber-400">{data.personalInfo.name}</span>
                      </h2>
                      <p className="text-[11px] text-slate-300 leading-relaxed max-w-[280px] mb-3.5">
                        {data.personalInfo.bio || 'Passionate video editor dedicated to cinematic visual storytelling, gaming montages, trailers, and YouTube content.'}
                      </p>

                      <div className="flex items-center gap-2 w-full max-w-[270px]">
                        <button
                          type="button"
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md"
                        >
                          Explore Works
                        </button>
                        <button
                          type="button"
                          className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs"
                        >
                          Contact Me
                        </button>
                      </div>
                    </div>

                    {/* Mini Featured Video Showreel */}
                    <div className="px-4 py-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1.5 uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                          <span>Featured Showreel</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">1080p 60fps</span>
                      </div>
                      
                      {/* Responsive 16:9 Player Preview */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-amber-500/30 group shadow-lg">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${data.featuredVideo.youtubeId || 'dQw4w9WgXcQ'}?controls=1&rel=0`}
                          title="Featured Video"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 truncate">
                        {data.featuredVideo.title || 'Official Video Editing Showreel & Trailers'}
                      </p>
                    </div>

                    {/* Mini Video Portfolio (Single Column on Phone) */}
                    <div className="px-4 py-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-amber-400" />
                          <span>Video Portfolio</span>
                        </h4>
                        <span className="text-[9px] text-amber-400/90 font-mono">
                          {data.portfolioVideos.length} Videos
                        </span>
                      </div>

                      {/* 1-Column Cards list */}
                      <div className="space-y-2.5">
                        {data.portfolioVideos.slice(0, 3).map((v) => (
                          <div
                            key={v.id}
                            className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5"
                          >
                            <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-slate-800 shrink-0">
                              <img
                                src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                                alt={v.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                                  <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-slate-950 ml-0.5"></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400">
                                {v.category}
                              </span>
                              <h5 className="font-semibold text-[11px] text-white truncate">
                                {v.title}
                              </h5>
                              <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                <span>{v.client}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini Graphics & Poster Grid (2 columns) */}
                    <div className="px-4 py-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                          <Grid className="w-3.5 h-3.5 text-amber-400" />
                          <span>Graphic Designs</span>
                        </h4>
                        <span className="text-[9px] text-slate-400 font-mono">Posters & Covers</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {data.graphics.slice(0, 2).map((g) => (
                          <div key={g.id} className="rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                            <div className="aspect-[3/4] bg-slate-800">
                              <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-1.5">
                              <p className="text-[10px] font-semibold text-white truncate">{g.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini Contact Bar */}
                    <div className="px-4 py-4 border-t border-slate-800/80 bg-slate-900/60 text-center">
                      <h4 className="font-display font-bold text-xs text-white mb-1">
                        Get In Touch
                      </h4>
                      <p className="text-[10px] text-slate-400 mb-2.5">
                        {data.personalInfo.email || 'sohanahammad.connect@gmail.com'}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`https://wa.me/${(data.socialLinks.whatsapp || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold"
                        >
                          WhatsApp
                        </a>
                        <a
                          href={`https://t.me/${(data.socialLinks.telegram || '').replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-sky-600 text-white text-[10px] font-bold"
                        >
                          Telegram
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Home Indicator bar */}
                  <div className="w-full h-5 bg-slate-950 flex items-center justify-center shrink-0">
                    <div className="w-28 h-1 bg-white/40 rounded-full"></div>
                  </div>

                </div>
              </div>
            ) : (
              /* HIGH-RES VISUAL MOCKUP VIEW */
              <div className="w-full max-w-sm h-full flex flex-col items-center justify-center py-2 animate-fade-in">
                <div className="relative rounded-[36px] overflow-hidden border-4 border-slate-700 shadow-2xl bg-black max-h-[80vh] aspect-[9/16]">
                  <img
                    src="/mobile_phone_mockup.jpg"
                    alt="Sohan Ahammad Mobile UI Mockup"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-center">
                    <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>HD মোবাইল আর্কিটেকচার মকআপ</span>
                    </span>
                    <p className="text-[10px] text-slate-300 mt-0.5">
                      Sohan Ahammad • Video Editor & Visual Storyteller
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Mobile Feature Explanations & Controls */}
          <div className="w-full md:w-80 bg-slate-950/90 border-t md:border-t-0 md:border-l border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>মোবাইল অপ্টিমাইজেশন</span>
                </span>
                {/* Scale buttons for phone simulator */}
                {activeTab === 'interactive' && (
                  <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setPhoneScale(0.8)}
                      className={`px-1.5 py-0.5 rounded ${phoneScale === 0.8 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      80%
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneScale(0.9)}
                      className={`px-1.5 py-0.5 rounded ${phoneScale === 0.9 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      90%
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneScale(1)}
                      className={`px-1.5 py-0.5 rounded ${phoneScale === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                    >
                      100%
                    </button>
                  </div>
                )}
              </div>

              {/* Key Mobile Highlights List */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>১. সিঙ্গেল-কলাম রেস্পন্সিভ লেআউট</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    কম্পিউটারে থাকা ৩-কলামের ভিডিওগুলো ফোনে পরপর ১-কলামে আসে, যাতে বুড়ো আঙুল দিয়ে সহজে স্ক্রল করা যায়।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>২. ১৬:৯ ফুল-উইডথ শো-রিল প্লেয়ার</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    সেরা ট্রেইলার ও ভিডিওটি ফোনের পুরো স্ক্রিনজুড়ে হাই-ডেফিনিশনে ভেসে ওঠে এবং এক ট্যাপে ফুলস্ক্রিন করা যায়।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>৩. ওয়ান-ট্যাপ যোগাযোগ বাটন</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    হোয়াটসঅ্যাপ ও টেলিগ্রাম বাটনে চাপ দিলে সরাসরি অ্যাপে গিয়ে আপনার চ্যাটবক্স ওপেন হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>সাইটের লিংক কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-950" />
                    <span>ফোনে টেস্ট করতে লিংক কপি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 cursor-pointer"
              >
                প্রিভিউ বন্ধ করুন
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
