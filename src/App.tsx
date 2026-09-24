/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoGrid } from './components/VideoGrid';
import { GraphicsGrid } from './components/GraphicsGrid';
import { AboutAndContact } from './components/AboutAndContact';
import { MediaCustomizerModal } from './components/MediaCustomizerModal';
import { AdminBar } from './components/AdminBar';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { MobileSimulatorModal } from './components/MobileSimulatorModal';
import { Smartphone } from 'lucide-react';
import { ThemeMode } from './types';

function PortfolioMain() {
  const { isAdmin } = usePortfolio();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('sohan_theme_mode');
    return (saved as ThemeMode) || 'dark';
  });
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);

  useEffect(() => {
    localStorage.setItem('sohan_theme_mode', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Admin Floating Control Bar (only visible when logged in as admin) */}
      <AdminBar />

      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMobileSimulator={() => setShowMobileSimulator(true)}
      />

      {/* Main Page Content */}
      <main className="relative">
        {/* 1. Featured Showreel & 2. Profile / Greet / Explore / Contact */}
        <HeroSection theme={theme} />

        {/* 3. Video Portfolio Grid with All Videos -> YouTube */}
        <VideoGrid theme={theme} />

        {/* 4. Graphic & Poster Designs with Go to Behance */}
        <GraphicsGrid theme={theme} />

        {/* 5. About Me & Contact (WhatsApp & Email) & Footer */}
        <AboutAndContact theme={theme} />
      </main>

      {/* Portfolio Media & Details Customizer Modal */}
      <MediaCustomizerModal />

      {/* Protected Admin Access Login Modal */}
      <AdminLoginModal />

      {/* Full-Featured Admin Control Center Dashboard */}
      <AdminDashboardModal />

      {/* Floating Interactive Mobile Phone Simulator Toggle (Admin only) */}
      {isAdmin && (
        <div className="fixed bottom-5 left-5 z-30">
          <button
            type="button"
            onClick={() => setShowMobileSimulator(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 border-2 border-slate-950 cursor-pointer"
            title="মোবাইলে সাইটটি কেমন দেখাবে তা পরীক্ষা করুন"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">📱 মোবাইল প্রিভিউ</span>
            <span className="sm:hidden">মোবাইল ভিউ</span>
          </button>
        </div>
      )}

      {/* Mobile Device Simulator Modal */}
      <MobileSimulatorModal
        isOpen={showMobileSimulator}
        onClose={() => setShowMobileSimulator(false)}
        currentTheme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioMain />
    </PortfolioProvider>
  );
}

