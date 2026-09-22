import React, { useState } from 'react';
import { ExternalLink, Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight, Edit3, Plus } from 'lucide-react';
import { ThemeMode, GraphicItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface GraphicsGridProps {
  theme: ThemeMode;
}

export const GraphicsGrid: React.FC<GraphicsGridProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, openEditModal, addGraphicItem, isAdmin, setShowAdminLoginModal, setShowAdminDashboard, t, language } = usePortfolio();
  const graphics = data.graphicItems;
  const behanceUrl = data.personalInfo.behanceUrl || 'https://www.behance.net';

  // Quick Direct Graphic Upload ref
  const quickGraphicInputRef = React.useRef<HTMLInputElement>(null);
  const [isAddingQuick, setIsAddingQuick] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lightbox Modal state
  const [selectedGraphicIndex, setSelectedGraphicIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setSelectedGraphicIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedGraphicIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedGraphicIndex !== null) {
      setSelectedGraphicIndex((prev) => (prev! > 0 ? prev! - 1 : graphics.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedGraphicIndex !== null) {
      setSelectedGraphicIndex((prev) => (prev! < graphics.length - 1 ? prev! + 1 : 0));
    }
  };

  const handleAddSlideClick = () => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    // If admin is logged in, trigger file select or open customizer
    quickGraphicInputRef.current?.click();
  };

  const handleQuickGraphicFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAddingQuick(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        await addGraphicItem({
          filename: result,
          title: `New Graphic Design ${graphics.length + 1}`,
          subtitle: 'Custom poster & visual artwork',
          category: 'Poster Design',
          fitMode: 'cover',
        });
        setToastMessage('✅ নতুন গ্রাফিক ডিজাইন সফলভাবে যোগ করা হয়েছে!');
        setTimeout(() => setToastMessage(null), 3500);
      }
      setIsAddingQuick(false);
      if (quickGraphicInputRef.current) quickGraphicInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const activeItem = selectedGraphicIndex !== null ? graphics[selectedGraphicIndex] : null;

  return (
    <section id="graphics-portfolio" className="py-14 sm:py-16 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
              <ImageIcon className="w-4 h-4" />
              <span>{t('graphics_badge_visual')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2
                id="graphics-heading"
                className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {t('graphics_title')}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                {graphics.length} {language === 'bn' ? 'টি ডিজাইন' : 'Designs'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!isAdmin) {
                    setShowAdminLoginModal(true);
                  } else {
                    setShowAdminDashboard(true);
                  }
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-amber-600 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{t('graphics_btn_change')}</span>
              </button>

              <button
                type="button"
                onClick={handleAddSlideClick}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('graphics_btn_add_slide')}</span>
              </button>
            </div>
          </div>
          <p
            className={`text-sm max-w-md ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {t('graphics_subtitle')}
          </p>
        </div>

        {/* Toast Message */}
        {toastMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hidden file input for fast quick-add */}
        <input
          type="file"
          ref={quickGraphicInputRef}
          onChange={handleQuickGraphicFile}
          accept="image/*"
          className="hidden"
        />

        {/* Graphics Grid (2 cols sm, 3 cols lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {graphics.map((item, index) => {
            const isDataUrl = item.filename && (item.filename.startsWith('data:') || item.filename.startsWith('blob:') || item.filename.startsWith('http'));
            const imageSrc = isDataUrl ? item.filename : `/${item.filename}`;

            return (
              <div
                key={item.id || index}
                id={`graphic-card-${index + 1}`}
                onClick={() => handleOpenLightbox(index)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between select-none ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:shadow-amber-500/5'
                    : 'bg-white border-slate-200 hover:border-amber-500/40 hover:shadow-slate-300/60'
                }`}
              >
                {/* 4:3 Aspect Container for Artwork */}
                <div className="aspect-[4/3] w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    onError={(e) => {
                      // Fallback placeholder with aesthetic graphic banner
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`;
                    }}
                    className={`w-full h-full ${
                      item.fitMode === 'contain' ? 'object-contain p-2' : 'object-cover'
                    } transition-transform duration-500 group-hover:scale-105`}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-semibold text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Click to Enlarge</span>
                    </span>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`font-display font-bold text-base group-hover:text-amber-500 transition-colors mb-1 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p
                        className={`text-xs leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Design #{index + 1}</span>
                    <span className="group-hover:text-amber-400 transition-colors">View HD Preview →</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dotted Card: Add New Graphic Slide */}
          <div
            id="card-add-new-graphic-slide"
            onClick={handleAddSlideClick}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02] min-h-[280px] select-none ${
              isDark
                ? 'border-slate-800 hover:border-amber-500/60 bg-slate-900/40 hover:bg-amber-500/5'
                : 'border-slate-300 hover:border-amber-500/60 bg-slate-50 hover:bg-amber-500/5'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-lg shadow-amber-500/10">
              <Plus className="w-7 h-7" />
            </div>
            <h3 className={`font-display font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              + নতুন গ্রাফিক ডিজাইন যোগ করুন
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-3">
              ক্লিক করে যেকোনো পোস্টার বা আর্টওয়ার্ক ইমেজ স্লাইড আপলোড করুন
            </p>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              + Add Design Slide
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* "GO TO BEHANCE" CTA BUTTON                                */}
        {/* ========================================================= */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col items-center justify-center text-center space-y-4">
          <a
            id="btn-go-to-behance"
            href={behanceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base bg-gradient-to-r from-[#0057ff] via-[#0047d9] to-[#003bb3] hover:from-[#1a68ff] hover:via-[#0057ff] hover:to-[#0047d9] text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span className="w-6 h-6 rounded-lg bg-white text-[#0057ff] flex items-center justify-center font-black text-xs shadow-inner">
              Bē
            </span>
            <span>Go to Behance</span>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <p className="text-xs text-slate-400 max-w-md">
            Click <span className="font-semibold text-blue-400">"Go to Behance"</span> to view complete high-resolution design case studies and portfolios.
          </p>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {selectedGraphicIndex !== null && activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                activeItem.filename.startsWith('data:') || activeItem.filename.startsWith('blob:') || activeItem.filename.startsWith('http')
                  ? activeItem.filename
                  : `/${activeItem.filename}`
              }
              alt={activeItem.title}
              onError={(e) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85`;
              }}
              className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-center text-white">
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1.5">
                {activeItem.category}
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                {activeItem.title}
              </h3>
              {activeItem.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  {activeItem.subtitle}
                </p>
              )}
              <p className="text-[11px] text-slate-500 mt-2">
                Item {selectedGraphicIndex + 1} of {graphics.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
