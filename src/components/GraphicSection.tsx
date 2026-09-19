import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  ZoomIn,
  Upload,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  MoveLeft,
  MoveRight,
  Sliders,
  LayoutGrid,
  Maximize2,
  Check,
  X,
  Link2,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ThemeMode, GraphicItem } from '../types';
import { usePortfolio } from '../context/PortfolioContext';
import { LightboxModal } from './LightboxModal';

interface GraphicSectionProps {
  theme: ThemeMode;
}

export const GraphicSection: React.FC<GraphicSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const {
    data,
    updateGraphicItem,
    addGraphicItem,
    deleteGraphicItem,
    reorderGraphicItem,
    openEditModal,
    updatePersonalInfo
  } = usePortfolio();

  const graphicItems = data.graphicItems;
  const behanceUrl = data.personalInfo.behanceUrl || 'https://www.behance.net';

  // Behance quick-edit state
  const [isEditingBehance, setIsEditingBehance] = useState(false);
  const [behanceInput, setBehanceInput] = useState(behanceUrl);
  const [behanceToast, setBehanceToast] = useState<string | null>(null);

  const handleSaveBehance = () => {
    let url = behanceInput.trim();
    if (!url) url = 'https://www.behance.net';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    updatePersonalInfo({ behanceUrl: url });
    setIsEditingBehance(false);
    setBehanceToast('Behance প্রোফাইল লিংক সংরক্ষিত হয়েছে!');
    setTimeout(() => setBehanceToast(null), 3000);
  };

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [selectedGraphic, setSelectedGraphic] = useState<GraphicItem | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Quick edit modal for a specific graphic slide
  const [editingSlide, setEditingSlide] = useState<GraphicItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editFitMode, setEditFitMode] = useState<'cover' | 'contain'>('cover');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Drag & drop state for the active slide
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Hidden file input refs
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const gridFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  // Ensure activeSlideIndex stays within bounds when items change
  useEffect(() => {
    if (graphicItems.length === 0) {
      setActiveSlideIndex(0);
    } else if (activeSlideIndex >= graphicItems.length) {
      setActiveSlideIndex(Math.max(0, graphicItems.length - 1));
    }
  }, [graphicItems.length, activeSlideIndex]);

  const activeItem: GraphicItem | undefined = graphicItems[activeSlideIndex] || graphicItems[0];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : graphicItems.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev < graphicItems.length - 1 ? prev + 1 : 0));
  };

  const handleOpenLightbox = (item: GraphicItem) => {
    setSelectedGraphic(item);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Direct file reading utility
  const processUploadedFile = (file: File, targetId: string) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে একটি ছবি (JPG, PNG, WEBP) ফাইল নির্বাচন করুন।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateGraphicItem(targetId, { filename: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSlideFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeItem) {
      processUploadedFile(file, activeItem.id);
    }
    // reset input value so re-uploading same file triggers change
    e.target.value = '';
  };

  const handleGridFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetId) {
      processUploadedFile(file, uploadTargetId);
    }
    e.target.value = '';
    setUploadTargetId(null);
  };

  // Drag and drop handlers for active slide
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && activeItem) {
      processUploadedFile(file, activeItem.id);
    }
  };

  // Open inline edit modal for details
  const openSlideEditor = (item: GraphicItem) => {
    setEditingSlide(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditSubtitle(item.subtitle || '');
    setEditFitMode(item.fitMode || 'cover');
    setEditImageUrl(item.filename);
    setShowUrlInput(false);
  };

  const closeSlideEditor = () => {
    setEditingSlide(null);
  };

  const handleSaveSlideEdit = () => {
    if (!editingSlide) return;
    updateGraphicItem(editingSlide.id, {
      title: editTitle.trim() || 'Untitled Design',
      category: editCategory.trim() || 'Visual Art',
      subtitle: editSubtitle.trim() || '',
      fitMode: editFitMode,
      filename: editImageUrl.trim() ? editImageUrl : editingSlide.filename,
    });
    setEditingSlide(null);
  };

  const handleAddNewDesign = async () => {
    const newId = await addGraphicItem({
      title: `New Design ${graphicItems.length + 1}`,
      category: 'Custom Poster',
      subtitle: 'Original Design Artwork',
      filename: '/graphics/1.jpg',
      fitMode: 'cover',
    });
    // Jump to the newly added slide
    setActiveSlideIndex(graphicItems.length);
    // Trigger file chooser for this new slide so they can immediately set their artwork
    setTimeout(() => {
      slideFileInputRef.current?.click();
    }, 200);
  };

  const handleDeleteActiveSlide = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (graphicItems.length <= 1) {
      alert('কমপক্ষে একটি ডিজাইন স্লাইড থাকতে হবে।');
      return;
    }
    if (window.confirm('আপনি কি এই ডিজাইন স্লাইডটি মুছে ফেলতে চান?')) {
      await deleteGraphicItem(id);
      if (activeSlideIndex >= graphicItems.length - 1) {
        setActiveSlideIndex(Math.max(0, graphicItems.length - 2));
      }
    }
  };

  const toggleFitMode = (item: GraphicItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextFit = item.fitMode === 'contain' ? 'cover' : 'contain';
    updateGraphicItem(item.id, { fitMode: nextFit });
  };

  return (
    <section id="graphic-designs" className="py-14 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with View Switcher & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
              <Palette className="w-4 h-4" />
              <span>Visual Arts & Graphics</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="graphic-designs-heading"
                className={`text-2xl sm:text-3xl font-display font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Graphic & Poster Designs
              </h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {graphicItems.length} Designs
              </span>
            </div>
            <p
              className={`text-sm mt-1 max-w-xl ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              স্লাইডার বা গ্রিড ভিউতে আপনার নিজস্ব থাম্বনেইল, ব্যানার বা সিনেমাটিক পোস্টার আপলোড ও সাজিয়ে রাখুন।
            </p>
          </div>

          {/* Action buttons: Mode Switcher + Add New Design */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Slider / Grid Toggle */}
            <div
              className={`p-1 rounded-xl border flex items-center gap-1 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                onClick={() => setViewMode('slider')}
                title="স্লাইডার ভিউ"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'slider'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Slider</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="গ্রিড ভিউ"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>

            {/* Add New Slide Button */}
            <button
              onClick={handleAddNewDesign}
              title="নতুন ডিজাইন স্লাইড যোগ করুন"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md hover:shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন ডিজাইন যোগ করুন</span>
            </button>

            {/* Manage all button */}
            <button
              onClick={() => openEditModal('graphics')}
              title="সব ডিজাইন একসাথে কাস্টমাইজ করুন"
              className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-amber-600 hover:border-slate-400'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">সবগুলো এডিট</span>
            </button>
          </div>
        </div>

        {/* Hidden Global File Inputs */}
        <input
          type="file"
          ref={slideFileInputRef}
          accept="image/*"
          onChange={handleSlideFileUpload}
          className="hidden"
          id="slide-active-file-input"
        />
        <input
          type="file"
          ref={gridFileInputRef}
          accept="image/*"
          onChange={handleGridFileUpload}
          className="hidden"
          id="grid-card-file-input"
        />

        {/* ================================================================= */}
        {/* VIEW MODE 1: INTERACTIVE SHOWCASE SLIDER                         */}
        {/* ================================================================= */}
        {viewMode === 'slider' && activeItem && (
          <div className="space-y-6">
            {/* Top Slide Meta & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              {/* Slide Counter & Category */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                    isDark
                      ? 'bg-slate-900 text-amber-400 border border-slate-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  Slide {activeSlideIndex + 1} of {graphicItems.length}
                </span>
                <span className="text-xs font-semibold text-amber-500">
                  {activeItem.category}
                </span>
              </div>

              {/* Slide Action Bar */}
              <div className="flex items-center gap-2">
                {/* Fit Mode Toggle */}
                <button
                  onClick={(e) => toggleFitMode(activeItem, e)}
                  title={
                    activeItem.fitMode === 'contain'
                      ? 'Click to Cover/Fill frame'
                      : 'Click to Fit full image without cropping'
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    activeItem.fitMode === 'contain'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{activeItem.fitMode === 'contain' ? 'Fit Whole' : 'Fill'}</span>
                </button>

                {/* Direct Upload Button */}
                <button
                  onClick={() => slideFileInputRef.current?.click()}
                  title="আপনার ডিভাইস থেকে নতুন ডিজাইন আপলোড করুন"
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ডিজাইন আপলোড</span>
                </button>

                {/* Edit Title & Info */}
                <button
                  onClick={() => openSlideEditor(activeItem)}
                  title="টাইটেল ও বিস্তারিত এডিট করুন"
                  className={`p-1.5 rounded-lg border text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Reorder Left */}
                <button
                  onClick={() => reorderGraphicItem(activeItem.id, 'prev')}
                  disabled={activeSlideIndex === 0}
                  title="স্লাইডটি বামে নিন"
                  className={`p-1.5 rounded-lg border text-xs transition-all disabled:opacity-30 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-black'
                  }`}
                >
                  <MoveLeft className="w-3.5 h-3.5" />
                </button>

                {/* Reorder Right */}
                <button
                  onClick={() => reorderGraphicItem(activeItem.id, 'next')}
                  disabled={activeSlideIndex === graphicItems.length - 1}
                  title="স্লাইডটি ডানে নিন"
                  className={`p-1.5 rounded-lg border text-xs transition-all disabled:opacity-30 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-black'
                  }`}
                >
                  <MoveRight className="w-3.5 h-3.5" />
                </button>

                {/* Delete Slide */}
                {graphicItems.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteActiveSlide(activeItem.id, e)}
                    title="এই স্লাইড মুছে ফেলুন"
                    className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Interactive Showcase Slide */}
            <div
              id="active-graphic-slide-stage"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl group ${
                isDraggingOver
                  ? 'border-amber-500 ring-4 ring-amber-500/30 bg-amber-500/5 scale-[1.005]'
                  : isDark
                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Drag & Drop Indicator Overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-amber-400 rounded-3xl animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <Upload className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    ডিজাইনটি এখানে ছেড়ে দিন
                  </h4>
                  <p className="text-sm text-slate-300">
                    Drop your image here to instantly replace this slide's design!
                  </p>
                </div>
              )}

              {/* Main Image Stage (16:10 or 4:3 responsive height) */}
              <div
                onClick={() => handleOpenLightbox(activeItem)}
                className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] flex items-center justify-center bg-slate-950 cursor-zoom-in overflow-hidden select-none"
              >
                <img
                  id="active-slide-image"
                  src={activeItem.filename}
                  alt={activeItem.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full transition-all duration-500 ${
                    activeItem.fitMode === 'contain'
                      ? 'object-contain p-2 sm:p-4'
                      : 'object-cover group-hover:scale-[1.02]'
                  }`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== window.location.origin + '/' + activeItem.filename) {
                      target.src = '/' + activeItem.filename;
                    }
                  }}
                />

                {/* Gradient vignette for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Floating Navigation Controls (< and >) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  aria-label="Previous Slide"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-slate-950/70 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  aria-label="Next Slide"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-slate-950/70 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Top Corner Quick Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenLightbox(activeItem);
                    }}
                    title="সম্পূর্ণ স্ক্রিনে দেখুন (Fullscreen)"
                    className="px-3 py-1.5 rounded-xl bg-slate-950/75 hover:bg-slate-900 border border-slate-800 text-white text-xs font-semibold backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fullscreen</span>
                  </button>
                </div>

                {/* Bottom Slide Info & Drag Cue */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                  <div className="space-y-1 pointer-events-auto">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-slate-950 shadow-sm inline-block mb-1">
                      {activeItem.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-md">
                      {activeItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium drop-shadow">
                      {activeItem.subtitle || 'Click image to inspect in full resolution'}
                    </p>
                  </div>

                  {/* Quick drag & drop badge */}
                  <div className="pointer-events-auto shrink-0 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        slideFileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ছবি পরিবর্তন করুন</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSlideEditor(activeItem);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 backdrop-blur-md transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>এডিট</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Slides Carousel Strip */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>সকল ডিজাইন স্লাইড (ক্লিক করে নির্বাচন করুন)</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {activeSlideIndex + 1} / {graphicItems.length}
                </span>
              </div>

              {/* Scrollable Thumbnails Strip */}
              <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-800 px-1">
                {graphicItems.map((item, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 group ${
                        isActive
                          ? 'border-amber-500 ring-4 ring-amber-500/20 scale-105 shadow-lg'
                          : isDark
                          ? 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                          : 'border-slate-300 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.filename}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-1 left-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-white font-mono">
                          {idx + 1}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Add New Slide Thumbnail Card */}
                <button
                  onClick={handleAddNewDesign}
                  title="নতুন ডিজাইন যোগ করুন"
                  className={`shrink-0 w-24 sm:w-28 aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                    isDark
                      ? 'border-slate-800 hover:border-amber-500/70 hover:bg-slate-900/60 text-slate-400 hover:text-amber-400'
                      : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 text-slate-600 hover:text-amber-700'
                  }`}
                >
                  <Plus className="w-5 h-5 text-amber-500" />
                  <span className="text-[11px]">+ Add Slide</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW MODE 2: RESPONSIVE GRID VIEW                                */}
        {/* ================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphicItems.map((item, index) => {
              return (
                <div
                  key={item.id}
                  id={`graphic-card-${index + 1}`}
                  className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl relative flex flex-col justify-between ${
                    isDark
                      ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 hover:shadow-black/50'
                      : 'bg-white border-slate-200 hover:border-amber-500/40 hover:shadow-slate-300/50'
                  }`}
                >
                  {/* Image Container with 4:3 Aspect Ratio */}
                  <div
                    onClick={() => handleOpenLightbox(item)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 cursor-pointer group/img"
                  >
                    <img
                      id={`graphic-img-${index + 1}`}
                      src={item.filename}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                        item.fitMode === 'contain' ? 'object-contain p-2' : 'object-cover'
                      }`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== window.location.origin + '/' + item.filename) {
                          target.src = '/' + item.filename;
                        }
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <ZoomIn className="w-3.5 h-3.5" />
                        Expand View
                      </span>
                    </div>

                    {/* Category Pill & Slot Index */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-950/85 text-amber-400 border border-slate-800 shadow-sm">
                        #{index + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-950/75 backdrop-blur-md text-slate-200 border border-slate-800/80 shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Quick Fit Mode Indicator */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => toggleFitMode(item, e)}
                        title={`Current: ${item.fitMode || 'cover'}. Click to toggle fit.`}
                        className="px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-400 backdrop-blur-sm"
                      >
                        {item.fitMode === 'contain' ? 'Contain' : 'Cover'}
                      </button>
                    </div>
                  </div>

                  {/* Card Meta & Action Tools */}
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-2">
                    <div
                      onClick={() => handleOpenLightbox(item)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h3
                        className={`font-display font-bold text-base mb-1 truncate group-hover:text-amber-500 transition-colors ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-xs truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {item.subtitle || item.category}
                      </p>
                    </div>

                    {/* Quick Buttons: Upload new image, Edit info, Delete */}
                    <div className="shrink-0 flex items-center gap-1">
                      {/* Upload Photo Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadTargetId(item.id);
                          gridFileInputRef.current?.click();
                        }}
                        title="এই স্লটে আপনার ফটো আপলোড করুন"
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                      </button>

                      {/* Edit Details */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openSlideEditor(item);
                        }}
                        title="টাইটেল ও তথ্য পরিবর্তন করুন"
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      {graphicItems.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteActiveSlide(item.id, e)}
                          title="এই ডিজাইন মুছে ফেলুন"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Design Card in Grid View */}
            <div
              onClick={handleAddNewDesign}
              className={`rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.01] ${
                isDark
                  ? 'border-slate-800 hover:border-amber-500/60 hover:bg-slate-900/50 text-slate-400 hover:text-amber-400'
                  : 'border-slate-300 hover:border-amber-500 hover:bg-amber-50/40 text-slate-600 hover:text-amber-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="font-display font-bold text-sm block">
                  + নতুন ডিজাইন যোগ করুন
                </span>
                <span className="text-xs text-slate-400">
                  Click to add a new poster or thumbnail slot
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* "GO TO BEHANCE" CTA BUTTON & BEHANCE LINK SETUP           */}
        {/* ========================================================= */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Main Action Button: Opens Behance Profile */}
            <a
              id="btn-go-to-behance"
              href={behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base bg-gradient-to-r from-[#0057ff] to-[#003bb3] hover:from-[#1a68ff] hover:to-[#004bd9] text-white shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 hover:scale-[1.03] active:scale-95"
            >
              <span className="w-6 h-6 rounded-lg bg-white text-[#0057ff] flex items-center justify-center font-black text-xs tracking-tighter shadow-sm transition-transform group-hover:scale-110">
                Bē
              </span>
              <span>Go to Behance</span>
              <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Quick Edit Behance Link Button */}
            <button
              id="btn-edit-behance-link"
              type="button"
              onClick={() => {
                setBehanceInput(behanceUrl);
                setIsEditingBehance(true);
              }}
              title="আপনার Behance প্রোফাইল লিংক সেট বা পরিবর্তন করুন"
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-amber-600 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Behance লিংক পরিবর্তন</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Click <span className="font-semibold text-blue-400">"Go to Behance"</span> to view my full portfolio of graphic posters, visual identity designs, and case studies.
          </p>

          {behanceToast && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{behanceToast}</span>
            </div>
          )}
        </div>

      </div>

      {/* Quick Edit Behance Profile Link Modal */}
      {isEditingBehance && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsEditingBehance(false)}
        >
          <div
            className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs">
                  Bē
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">
                    Behance প্রোফাইল লিংক সেট করুন
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    "Go to Behance" বাটনে ক্লিক করলে ভিজিটররা এই লিংকে যাবে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingBehance(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Behance Profile URL:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={behanceInput}
                    onChange={(e) => setBehanceInput(e.target.value)}
                    placeholder="https://www.behance.net/yourusername"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                💡 উদাহরণ: <code>https://www.behance.net/sohanahammad</code> অথবা আপনার Behance পোর্টফোলিও লিংক দিন
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingBehance(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveBehance}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0057ff] hover:bg-[#0047d4] text-white shadow-md flex items-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>লিংক সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* INLINE DESIGN CUSTOMIZER DIALOG / MODAL                          */}
      {/* ================================================================= */}
      {editingSlide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={closeSlideEditor}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">
                    ডিজাইন কাস্টমাইজ করুন
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customize your artwork, image source, and display text
                  </p>
                </div>
              </div>
              <button
                onClick={closeSlideEditor}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Artwork Preview & File Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ডিজাইন ইমেজ (Device Upload or Link)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black border border-slate-800 shrink-0">
                    <img
                      src={editImageUrl}
                      alt="Preview"
                      className={`w-full h-full ${
                        editFitMode === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>কম্পিউটার/মোবাইল থেকে ফাইল বাছুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) setEditImageUrl(result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] text-amber-400/90 hover:text-amber-400 underline flex items-center gap-1"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{showUrlInput ? 'Hide URL input' : 'Or paste image Web link / URL'}</span>
                    </button>
                  </div>
                </div>

                {showUrlInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Fit Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ডিসপ্লে স্টাইল (Display Fit)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFitMode('cover')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      editFitMode === 'cover'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Fill (Crop to fill container)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFitMode('contain')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      editFitMode === 'contain'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>Fit (Show full image)</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ডিজাইনের নাম / Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. YouTube Masterclass Thumbnail, Movie Poster..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ক্যাটাগরি / Category Tag
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g. Poster Design, Thumbnail, Banner..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সাবটাইটেল / Client or Description (Optional)
                </label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="e.g. Promotional Visual for Client XYZ"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeSlideEditor}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSaveSlideEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>সংরক্ষণ করুন (Save Design)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        item={selectedGraphic}
        items={graphicItems}
        isOpen={isLightboxOpen}
        onClose={handleCloseLightbox}
        onSelect={(item) => setSelectedGraphic(item)}
      />
    </section>
  );
};
