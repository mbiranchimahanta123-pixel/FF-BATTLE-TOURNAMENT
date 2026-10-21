import React, { useState } from 'react';
import { Swords, Trophy, Flame, ArrowRight, ShieldCheck, Zap, Users, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from '../components/HeroBanner';
import { TournamentCard } from '../components/TournamentCard';
import { Tournament } from '../types';

interface HomeViewProps {
  onSelectTournament: (tournament: Tournament) => void;
  onOpenRegister: (tournament: Tournament) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectTournament, onOpenRegister }) => {
  const { language, t, tournaments, leaderboard, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'free' | 'squad'>('all');

  const openTournaments = tournaments.filter((t) => t.status === 'open' || t.status === 'live');

  const displayedTournaments = openTournaments.filter((tour) => {
    if (filterType === 'free') return tour.category === 'free';
    if (filterType === 'squad') return tour.gameMode === 'squad';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Visual Area */}
      <HeroBanner />

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Active Tournaments Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase mb-1">
                <Flame className="w-4 h-4 text-[#ff6b00]" />
                <span>{language === 'hi' ? 'लाइव व आगामी' : 'LIVE & UPCOMING'}</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {language === 'hi' ? 'सक्रिय टूर्नामेंट्स' : 'Featured Battles'}
              </h2>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#12141c] border border-[#232733] rounded-xl text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-[#ff6b00] text-black font-bold'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('all')}
                </button>
                <button
                  onClick={() => setFilterType('free')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterType === 'free'
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('free')}
                </button>
                <button
                  onClick={() => setFilterType('squad')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    filterType === 'squad'
                      ? 'bg-[#ffaa00] text-black font-bold'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {t('squad')}
                </button>
              </div>

              <button
                onClick={() => setActiveTab('tournaments')}
                className="hidden sm:flex items-center gap-1.5 text-xs text-[#ffaa00] hover:text-[#ff8526] font-semibold font-mono-code ml-2 cursor-pointer"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTournaments.slice(0, 6).map((tour) => (
              <TournamentCard
                key={tour.id}
                tournament={tour}
                onSelect={onSelectTournament}
                onOpenRegister={onOpenRegister}
              />
            ))}
          </div>

          <div className="sm:hidden text-center pt-2">
            <button
              onClick={() => setActiveTab('tournaments')}
              className="w-full py-2.5 bg-[#171a24] border border-[#2b3142] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2"
            >
              <span>{t('viewAll')} {t('tournaments')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ff6b00]" />
            </button>
          </div>
        </section>

        {/* 3-Step "How to Compete" Esports Guide */}
        <section className="bg-[#11131a] border border-[#232733] rounded-2xl md:rounded-3xl p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs text-[#ffaa00] uppercase font-mono-code font-bold">
              {language === 'hi' ? 'सरल प्रक्रिया' : 'HOW IT WORKS'}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
              {language === 'hi' ? '3 चरणों में खेलें और बूयाह जीतें' : 'Compete & Win in 3 Easy Steps'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#0b0c10] border border-[#1f2430] rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#ff6b00] font-black font-mono-code text-base">
                01
              </div>
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                {language === 'hi' ? 'टूर्नामेंट चुनें' : 'Select Tournament'}
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                {language === 'hi'
                  ? 'सोलो, डुओ या स्क्वाड फॉर्मेट में फ्री या सशुल्क मैच चुनें और अपनी पसंदीदा मैप जैसे बरमूडा या कालाहारी चुनें।'
                  : 'Browse daily Solo, Duo, or Squad leagues across Bermuda, Purgatory, Kalahari, and Alpine maps.'}
              </p>
            </div>

            <div className="p-5 bg-[#0b0c10] border border-[#1f2430] rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-[#ffaa00] font-black font-mono-code text-base">
                02
              </div>
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                {language === 'hi' ? 'FF UID से रजिस्टर करें' : 'Register with FF UID'}
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                {language === 'hi'
                  ? 'अपना सही फ्री फायर इन-गेम नाम (IGN) और 8-12 अंकों की UID दर्ज करें। आपका स्लॉट तुरंत आरक्षित होगा।'
                  : 'Submit your exact in-game name (IGN) and verified Free Fire UID to lock in your official slot.'}
              </p>
            </div>

            <div className="p-5 bg-[#0b0c10] border border-[#1f2430] rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black font-mono-code text-base">
                03
              </div>
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                {language === 'hi' ? 'रूम आईडी लें और खेलें' : 'Get Room ID & Booyah'}
              </h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                {language === 'hi'
                  ? 'मैच से 15 मिनट पहले रूम आईडी और पासवर्ड अनलॉक होगा। गेम में कस्टम मैच जॉइन करें और जीतें!'
                  : 'Room ID & password unlock 15 minutes before start. Join custom lobby, eliminate rivals, and take Booyah.'}
              </p>
            </div>
          </div>
        </section>

        {/* Global Leaderboard Mini Preview */}
        <section className="bg-[#12141c] border border-[#232733] rounded-2xl md:rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase">
              <Trophy className="w-4 h-4 text-[#ff6b00]" />
              <span>{t('leaderboard')}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {language === 'hi' ? 'सर्वश्रेष्ठ ईस्पोर्ट्स खिलाड़ी' : 'Championship Top Fraggers'}
            </h2>
            <p className="text-xs text-[#9ca3af]">
              {language === 'hi'
                ? 'शीर्ष खिलाड़ियों की किल्स, मैच जीत और संचित प्राइज पूल रैंकिंग देखें।'
                : 'Check out the top-ranked Free Fire contenders, verified kill bounty leaders, and season standings.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ffaa00] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-600/30 cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>{language === 'hi' ? 'पूरा लीडरबोर्ड देखें' : 'View Full Leaderboard'}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </section>

      </div>
    </div>
  );
};
