import React, { useState } from 'react';
import { ExternalLink, Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeMode } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

interface GraphicsGridProps {
  theme: ThemeMode;
}

export const GraphicsGrid: React.FC<GraphicsGridProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const { data, t, language } = usePortfolio();
  const graphics = data.graphicItems;
  const behanceUrl = data.personalInfo.behanceUrl || 'https://www.behance.net';

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
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span>Go to Behance</span>
            <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <p className="text-xs text-slate-400 max-w-md">
            Click <span className="font-semibold text-blue-400">&quot;Go to Behance&quot;</span> to browse high-resolution graphic design portfolios and case studies.
          </p>
        </div>

      </div>

      {/* Lightbox / HD Artwork Preview Modal */}
      {activeItem && selectedGraphicIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={handleCloseLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                  {activeItem.category} • {selectedGraphicIndex + 1} of {graphics.length}
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {activeItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Preview Container */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-2 min-h-[300px] max-h-[65vh]">
              <img
                src={
                  activeItem.filename && (activeItem.filename.startsWith('data:') || activeItem.filename.startsWith('blob:') || activeItem.filename.startsWith('http'))
                    ? activeItem.filename
                    : `/${activeItem.filename}`
                }
                alt={activeItem.title}
                className="max-h-full max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              {graphics.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors shadow-lg cursor-pointer"
                    title="Previous Design"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors shadow-lg cursor-pointer"
                    title="Next Design"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Footer / Subtitle */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{activeItem.subtitle || 'Custom Visual Art'}</span>
              <a
                href={behanceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on Behance</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
