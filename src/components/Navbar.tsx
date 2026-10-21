import React from 'react';
import { Flame, ShieldCheck, User, Globe, Database, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    currentUser,
    isAdmin,
    isAdminAuthenticated,
    setIsAuthModalOpen,
    setIsAdminLoginModalOpen,
    setIsFirebaseGuideOpen,
    logoutAdmin,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0e14]/90 backdrop-blur-md border-b border-[#232733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark with flame brand mark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left cursor-pointer group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#ff4500] to-[#ffaa00] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-black tracking-wider text-white uppercase leading-none">
              FF <span className="text-[#ff6b00]">BATTLE</span> ARENA
            </span>
            <span className="text-[10px] tracking-widest text-[#ffaa00] font-mono-code uppercase font-semibold">
              FREE FIRE ESPORTS
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#ff6b00] ${
              activeTab === 'home' ? 'text-[#ff6b00] font-semibold' : 'text-[#9ca3af]'
            }`}
          >
            {t('home')}
          </button>
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`whitespace-nowrap transition-colors hover:text-[#ff6b00] ${
              activeTab === 'tournaments' ? 'text-[#ff6b00] font-semibold' : 'text-[#9ca3af]'
            }`}
          >
            {t('tournaments')}
          </button>
          <button
            onClick={() => setActiveTab('my-matches')}
            className={`whitespace-nowrap transition-colors hover:text-[#ff6b00] ${
              activeTab === 'my-matches' ? 'text-[#ff6b00] font-semibold' : 'text-[#9ca3af]'
            }`}
          >
            {t('myTournaments')}
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`whitespace-nowrap transition-colors hover:text-[#ff6b00] ${
              activeTab === 'leaderboard' ? 'text-[#ff6b00] font-semibold' : 'text-[#9ca3af]'
            }`}
          >
            {t('leaderboard')}
          </button>
          <button
            onClick={() => {
              if (isAdminAuthenticated) {
                setActiveTab('admin');
              } else {
                setIsAdminLoginModalOpen(true);
              }
            }}
            className={`whitespace-nowrap transition-colors hover:text-[#ffaa00] flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'text-[#ffaa00] font-semibold' : 'text-[#9ca3af]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#ffaa00]" />
            {t('admin')}
          </button>
        </nav>

        {/* Zone 3: Actions - Language switcher, Firebase guide, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Switcher */}
          <div className="flex items-center p-0.5 bg-[#171923] rounded-lg border border-[#2b3040]">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'en'
                  ? 'bg-[#ff6b00] text-black shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                language === 'hi'
                  ? 'bg-[#ff6b00] text-black shadow-sm'
                  : 'text-[#9ca3af] hover:text-white'
              }`}
              title="हिन्दी"
            >
              हिन्दी
            </button>
          </div>

          {/* Firebase Guide button */}
          <button
            onClick={() => setIsFirebaseGuideOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f59e0b] bg-[#1a1c24] hover:bg-[#252834] border border-[#f59e0b]/30 rounded-lg transition-colors cursor-pointer"
            title="Firebase Setup, Firestore & Rules"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Firebase</span>
          </button>

          {/* User profile / Login CTA */}
          {currentUser ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#171923] hover:bg-[#222533] border border-[#2e3346] rounded-lg transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full bg-slate-800 border border-[#ff6b00]"
              />
              <span className="hidden sm:inline text-xs font-semibold text-white max-w-[100px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-[#ff6b00] to-[#ff9900] hover:from-[#ff7c1a] hover:to-[#ffaa1a] rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('login')}</span>
            </button>
          )}

          {/* Admin Logout icon if logged into admin */}
          {isAdminAuthenticated && (
            <button
              onClick={logoutAdmin}
              className="p-1.5 text-[#ef4444] hover:bg-red-950/30 rounded-lg border border-red-500/20"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
