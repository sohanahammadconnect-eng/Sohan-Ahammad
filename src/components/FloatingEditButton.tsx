import React from 'react';
import { Upload, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const FloatingEditButton: React.FC = () => {
  const { openEditModal } = usePortfolio();

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <button
        onClick={() => openEditModal('all')}
        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-900 border border-amber-500/50 text-white shadow-xl hover:shadow-amber-500/20 backdrop-blur-md transition-all duration-300 hover:scale-105"
        title="Upload your own media and customize portfolio"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <Upload className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-tight">
          Upload & Edit Works
        </span>
      </button>
    </div>
  );
};
