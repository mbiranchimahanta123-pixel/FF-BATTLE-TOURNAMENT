import React from 'react';
import { Flame, Shield, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { language, t, setActiveTab, setIsFirebaseGuideOpen, setIsAdminLoginModalOpen, isAdminAuthenticated } = useApp();

  return (
    <footer className="w-full bg-[#08090d] border-t border-[#1a1c24] text-[#8b949e] text-xs pt-10 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#161822]">
          {/* Brand */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#ff4500] to-[#ffaa00] flex items-center justify-center">
                <Flame className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-heading text-xl font-black tracking-wider text-white uppercase">
                FF <span className="text-[#ff6b00]">BATTLE</span> ARENA
              </span>
            </div>
            <p className="text-xs text-[#8b949e] max-w-md">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              {t('home')}
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              {t('tournaments')}
            </button>
            <button
              onClick={() => setActiveTab('my-matches')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              {t('myTournaments')}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              {t('leaderboard')}
            </button>
            <button
              onClick={() => setIsFirebaseGuideOpen(true)}
              className="text-[#ffaa00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Firebase Guide</span>
            </button>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActiveTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
              className="hover:text-[#ffaa00] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('admin')}</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-[#6b7280]">
          <p>
            © {new Date().getFullYear()} FF BATTLE ARENA. All rights reserved. Free Fire is a registered trademark of Garena.
          </p>
          <div className="flex items-center gap-3">
            <span>Fair Play Certified</span>
            <span aria-hidden="true">·</span>
            <span>Zero Emulator Tolerance</span>
            <span aria-hidden="true">·</span>
            <span>Automated Results</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
