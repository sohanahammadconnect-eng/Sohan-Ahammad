import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { GraphicItem } from '../types';

interface LightboxModalProps {
  item: GraphicItem | null;
  items: GraphicItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: GraphicItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onSelect,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, item, items]);

  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % items.length;
    onSelect(items[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIdx]);
  };

  return (
    <div
      id="graphic-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {item.category}
            </span>
            <span className="text-xs text-slate-400">
              {currentIndex + 1} of {items.length}
            </span>
          </div>

          <button
            id="lightbox-close-button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Image Box */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 flex items-center justify-center max-h-[75vh]">
          <img
            id="lightbox-current-image"
            src={item.filename}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="max-h-[70vh] w-auto max-w-full object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== window.location.origin + '/' + item.filename) {
                target.src = '/' + item.filename;
              }
            }}
          />

          {/* Navigation Arrows */}
          <button
            id="lightbox-prev-button"
            onClick={handlePrev}
            aria-label="Previous graphic"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-lg transition-transform hover:scale-110 border border-slate-700/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="lightbox-next-button"
            onClick={handleNext}
            aria-label="Next graphic"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-lg transition-transform hover:scale-110 border border-slate-700/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Caption */}
        <div className="w-full text-center pt-4">
          <h4 className="text-lg font-display font-bold text-white mb-1">
            {item.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400">
            {item.subtitle} • Filename: <code className="text-amber-400 font-mono text-xs">{item.filename}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
