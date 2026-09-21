import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Film,
  Youtube,
  Check,
  Trash2,
  MoveLeft,
  MoveRight,
  FileVideo,
  Image,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react';
import { VideoItem } from '../types';
import { extractYouTubeId, uploadVideoFile, resolveVideoUrl } from '../utils/mediaStorage';

interface VideoItemEditorProps {
  video: VideoItem;
  label: string;
  onUpdate: (updates: Partial<VideoItem>) => void;
  onDelete?: () => void;
  onReorder?: (direction: 'prev' | 'next') => void;
  canReorder?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  isActive?: boolean;
  showCategoryAndDesc?: boolean;
}

export const VideoItemEditor: React.FC<VideoItemEditorProps> = ({
  video,
  label,
  onUpdate,
  onDelete,
  onReorder,
  canReorder = false,
  isFirst = false,
  isLast = false,
  isActive = false,
  showCategoryAndDesc = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const sourceType = video.videoSourceType || (video.videoUrl ? 'local' : 'youtube');

  useEffect(() => {
    let isMounted = true;
    if (sourceType === 'local') {
      resolveVideoUrl(video).then((url) => {
        if (isMounted) setPreviewUrl(url);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [sourceType, video.videoUrl, video.blobKey, video.id]);

  const processVideoFile = async (file: File) => {
    if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|mkv|ogg|m4v)$/i.test(file.name)) {
      setUploadError('দয়া করে একটি সঠিক ভিডিও ফাইল নির্বাচন করুন (MP4, WebM, MOV, ইত্যাদি)');
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const { url, blobKey } = await uploadVideoFile(file);
      setPreviewUrl(url);
      const updates: Partial<VideoItem> = {
        videoSourceType: 'local',
        videoUrl: url,
        blobKey,
      };
      if (!video.title || video.title.startsWith('New Video Slide')) {
        updates.title = file.name.replace(/\.[^/.]+$/, '');
      }
      onUpdate(updates);
    } catch (err) {
      console.error(err);
      setUploadError('ভিডিও আপলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processVideoFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processVideoFile(file);
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result) onUpdate({ thumbnailUrl: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
        isActive
          ? 'bg-slate-900/90 border-amber-500 ring-2 ring-amber-500/20'
          : 'bg-slate-950/70 border-slate-800'
      }`}
    >
      {/* Top Header: Label & Slide Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {label}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            {sourceType === 'local' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <FileVideo className="w-3.5 h-3.5" /> Uploaded Video
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5" /> YouTube
              </span>
            )}
          </span>
        </div>

        {/* Reorder and Delete */}
        <div className="flex items-center gap-1">
          {canReorder && onReorder && (
            <>
              <button
                type="button"
                onClick={() => onReorder('prev')}
                disabled={isFirst}
                title="Move left / up"
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <MoveLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onReorder('next')}
                disabled={isLast}
                title="Move right / down"
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <MoveRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete this video slide"
              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Source Toggle: Upload Video File vs YouTube Link */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
          <span>ভিডিও সোর্স নির্বাচন করুন (Select Video Source):</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => onUpdate({ videoSourceType: 'local' })}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sourceType === 'local'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Video File (ভিডিও আপলোড)</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ videoSourceType: 'youtube' })}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              sourceType === 'youtube'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Link (ইউটিউব লিংক)</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={thumbInputRef}
        type="file"
        accept="image/*"
        onChange={handleThumbSelect}
        className="hidden"
      />

      {/* OPTION 1: DIRECT VIDEO FILE UPLOAD */}
      {sourceType === 'local' && (
        <div className="space-y-3">
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploading ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 flex flex-col items-center justify-center text-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-400">ভিডিও আপলোড ও প্রসেসিং হচ্ছে...</p>
                <p className="text-[11px] text-slate-400">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন</p>
              </div>
            </div>
          ) : previewUrl || video.videoUrl ? (
            <div className="space-y-3">
              {/* Video Player Preview */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-slate-800 shadow">
                <video
                  src={previewUrl || video.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.thumbnailUrl}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Action Buttons for Uploaded Video */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5" />
                  <span>ভিডিও ফাইল রেডি</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                    title="Upload custom poster image"
                  >
                    <Image className="w-3 h-3 text-amber-400" />
                    <span>{video.thumbnailUrl ? 'Change Poster' : '+ Add Poster'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      onUpdate({ videoUrl: '', blobKey: '', thumbnailUrl: '' });
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Remove video file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer group ${
                isDragOver
                  ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/50 text-slate-400 hover:text-amber-400'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                  কম্পিউটার বা মোবাইল থেকে ভিডিও আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-500">
                  ক্লিক করুন অথবা ফাইল ড্র্যাগ ও ড্রপ করুন (MP4, WebM, MOV)
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                1080p / 4K Video Files Supported
              </span>
            </div>
          )}
        </div>
      )}

      {/* OPTION 2: YOUTUBE VIDEO LINK */}
      {sourceType === 'youtube' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              YouTube Video URL or 11-Character ID
            </label>
            <input
              type="text"
              value={video.youtubeId || ''}
              onChange={(e) => {
                const id = extractYouTubeId(e.target.value);
                onUpdate({ youtubeId: id, videoSourceType: 'youtube' });
              }}
              placeholder="https://www.youtube.com/watch?v=... বা youtu.be/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-red-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              ইউটিউবের সাধারণ লিংক, Shorts লিংক বা কেবল ১১ অক্ষরের ভিডিও আইডি দিলেই চলবে।
            </p>
          </div>

          {video.youtubeId && (
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
                title="Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      {/* Meta Fields: Title, Category, Description */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div>
          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
            ভিডিও টাইটেল (Video Title)
          </label>
          <input
            type="text"
            value={video.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g. Cinematic Commercial Reel"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {showCategoryAndDesc && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                ক্যাটাগরি ট্যাগ (Category)
              </label>
              <input
                type="text"
                value={video.category || ''}
                onChange={(e) => onUpdate({ category: e.target.value })}
                placeholder="e.g. Commercial / Color Grading / Short Form"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                বর্ণনা (Description)
              </label>
              <textarea
                rows={2}
                value={video.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="ভিডিও সম্পর্কে ছোট একটি বিবরণ..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
