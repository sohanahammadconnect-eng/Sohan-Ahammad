/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeMode } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoGrid } from './components/VideoGrid';
import { GraphicSection } from './components/GraphicSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CodeModal } from './components/CodeModal';
import { MediaCustomizerModal } from './components/MediaCustomizerModal';
import { FloatingEditButton } from './components/FloatingEditButton';

function PortfolioApp() {
  // Dark mode is the default theme on load
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Sync theme with document element class & body background
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.className =
        'bg-slate-950 text-slate-100 transition-colors duration-300 antialiased selection:bg-amber-500 selection:text-black';
    } else {
      root.classList.remove('dark');
      document.body.className =
        'bg-slate-50 text-slate-900 transition-colors duration-300 antialiased selection:bg-amber-500 selection:text-black';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <div
      id="portfolio-root"
      className={`min-h-screen transition-colors duration-300 flex flex-col font-sans relative ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* A. Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* B. Hero Section (Feature Video & Short Greeting) */}
        <HeroSection theme={theme} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`border-t transition-colors duration-300 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          />
        </div>

        {/* C. Video Portfolio Grid */}
        <VideoGrid theme={theme} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`border-t transition-colors duration-300 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          />
        </div>

        {/* D. Graphic Work Section (with Lightbox Modal) */}
        <GraphicSection theme={theme} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`border-t transition-colors duration-300 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          />
        </div>

        {/* E. Detailed About Me (Bio) Section */}
        <AboutSection theme={theme} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div
            className={`border-t transition-colors duration-300 ${
              isDark ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          />
        </div>

        {/* F. Get in Touch Section */}
        <ContactSection theme={theme} />
      </main>

      {/* Footer */}
      <Footer theme={theme} />

      {/* Floating Edit & Upload Button */}
      <FloatingEditButton />

      {/* Media Customizer & Uploader Modal */}
      <MediaCustomizerModal />

      {/* Single-File HTML Code View & Download Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
