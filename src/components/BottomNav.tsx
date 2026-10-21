import React from 'react';
import { Home, Swords, Trophy, Award, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    t,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
  } = useApp();

  const navItems = [
    { id: 'home', label: t('home'), icon: Home },
    { id: 'tournaments', label: t('tournaments'), icon: Swords },
    { id: 'my-matches', label: t('myTournaments'), icon: Trophy },
    { id: 'leaderboard', label: t('leaderboard'), icon: Award },
    {
      id: isAdminAuthenticated ? 'admin' : 'profile',
      label: isAdminAuthenticated ? t('admin') : t('profile'),
      icon: isAdminAuthenticated ? ShieldCheck : User,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0e14]/95 backdrop-blur-lg border-t border-[#232733] pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'admin' && !isAdminAuthenticated) {
                  setIsAdminLoginModalOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className="flex flex-col items-center justify-center h-full min-h-[48px] min-w-[48px] text-center select-none cursor-pointer group"
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive
                    ? 'text-[#ff6b00] scale-110'
                    : 'text-[#8b949e] group-hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] tracking-tight font-medium mt-0.5 whitespace-nowrap truncate max-w-[64px] ${
                  isActive ? 'text-[#ff6b00] font-bold' : 'text-[#8b949e]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
