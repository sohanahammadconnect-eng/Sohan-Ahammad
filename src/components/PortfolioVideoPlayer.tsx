import React, { useState, useEffect } from 'react';
import { Film, Play, Sparkles, X, RefreshCw } from 'lucide-react';
import { VideoItem } from '../types';
import { resolveVideoUrl } from '../utils/mediaStorage';

interface PortfolioVideoPlayerProps {
  video: VideoItem;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export const PortfolioVideoPlayer: React.FC<PortfolioVideoPlayerProps> = ({
  video,
  className = 'w-full h-full object-cover',
  autoPlay = false,
  controls = true,
  muted = false,
}) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const isLocal = video.videoSourceType === 'local';
  const ytid = video.youtubeId || 'hsPSXISkhbo';

  const maxresThumb = `https://i.ytimg.com/vi/${ytid}/maxresdefault.jpg`;
  const hqThumb = `https://i.ytimg.com/vi/${ytid}/hqdefault.jpg`;

  const [currentThumb, setCurrentThumb] = useState<string>(video.thumbnailUrl || maxresThumb);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [ytid, video.id, autoPlay]);

  useEffect(() => {
    let isMounted = true;
    if (isLocal) {
      setIsLoading(true);
      resolveVideoUrl(video)
        .then((url) => {
          if (isMounted) {
            setResolvedUrl(url);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setCurrentThumb(video.thumbnailUrl || maxresThumb);
    }
    return () => {
      isMounted = false;
    };
  }, [isLocal, video.videoUrl, video.blobKey, video.id, ytid, video.thumbnailUrl, maxresThumb]);

  const handleThumbLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // YouTube returns a 120x90 placeholder image if maxresdefault doesn't exist
    if (img.naturalWidth <= 120 && currentThumb.includes('maxresdefault')) {
      setCurrentThumb(hqThumb);
    }
  };

  const handleThumbError = () => {
    if (currentThumb !== hqThumb) {
      setCurrentThumb(hqThumb);
    }
  };

  // LOCAL UPLOADED VIDEO
  if (isLocal) {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          <span className="text-xs">Loading video...</span>
        </div>
      );
    }

    if (!resolvedUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 p-4 text-center gap-2">
          <Film className="w-8 h-8 text-amber-500/50" />
          <p className="text-xs text-slate-400 font-medium">ভিডিও ফাইল পাওয়া যায়নি (No Video File)</p>
          <p className="text-[11px] text-slate-600">ভিডিও যোগ করতে &quot;লিংক জমা দিন&quot; বা &quot;Edit&quot; বাটনে ক্লিক করুন</p>
        </div>
      );
    }

    return (
      <video
        src={resolvedUrl}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        preload="metadata"
        poster={video.thumbnailUrl}
        className={className}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  // YOUTUBE VIDEO: PLAYING STATE
  if (isPlaying) {
    return (
      <div className="relative w-full h-full bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
        {/* Quick Close Button to return to crisp thumbnail */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(false);
          }}
          title="ভিডিও থামিয়ে কভারে ফিরে যান (Return to thumbnail cover)"
          className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 backdrop-blur-md transition-all text-[10px] flex items-center gap-1 opacity-60 hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cover</span>
        </button>
      </div>
    );
  }

  // YOUTUBE VIDEO: CRYSTAL CLEAR FULL-HD THUMBNAIL STATE
  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="relative w-full h-full cursor-pointer group/player overflow-hidden bg-slate-950 flex items-center justify-center select-none"
      title="ভিডিও দেখতে ক্লিক করুন (Click to play video in HD)"
    >
      <img
        src={currentThumb}
        alt={video.title || 'Video Thumbnail'}
        onLoad={handleThumbLoad}
        onError={handleThumbError}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/player:scale-105"
        style={{
          imageRendering: 'auto',
        }}
      />

      {/* Contrast Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30 pointer-events-none transition-opacity duration-300 group-hover/player:opacity-80" />

      {/* Top Badges: HD Quality + Category */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-400 flex items-center gap-1 shadow">
          <Sparkles className="w-2.5 h-2.5" />
          <span>HD 1080p</span>
        </span>
        {video.category && (
          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-slate-200 shadow">
            {video.category}
          </span>
        )}
      </div>

      {/* Centered High-Definition Cinematic Play Button */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2 group-hover/player:scale-110 transition-transform duration-300 pointer-events-none">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600/95 group-hover/player:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 border-2 border-white/40 backdrop-blur-sm transition-all duration-300">
          <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-0.5" />
        </div>
        <span className="text-[11px] font-bold text-white bg-black/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/15 shadow-xl tracking-wide">
          ভিডিও চালান • Play
        </span>
      </div>
    </div>
  );
};
