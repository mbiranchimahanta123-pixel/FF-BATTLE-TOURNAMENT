import React from 'react';
import { Flame, Bell, Shield, Users, Trophy, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { language, t, announcements, setActiveTab, setSelectedTournament, tournaments } = useApp();

  const urgentAnnouncement = announcements.find((a) => a.priority === 'urgent') || announcements[0];

  const handleJoinFeatured = () => {
    const featured = tournaments.find((t) => t.status === 'open') || tournaments[0];
    if (featured) {
      setSelectedTournament(featured);
    } else {
      setActiveTab('tournaments');
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0c10] border-b border-[#1f2430]">
      {/* Announcement Bar */}
      {urgentAnnouncement && (
        <div className="bg-gradient-to-r from-[#e11d48]/90 via-[#ff6b00]/90 to-[#b45309]/90 text-white px-4 py-2 text-xs flex items-center justify-between shadow-sm">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-black/40 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0">
                {language === 'hi' ? 'ताज़ा घोषणा' : 'ALERT'}
              </span>
              <p className="font-medium truncate text-xs">
                {language === 'hi'
                  ? urgentAnnouncement.messageHi || urgentAnnouncement.messageEn
                  : urgentAnnouncement.messageEn}
              </p>
            </div>
            {urgentAnnouncement.tournamentId && (
              <button
                onClick={() => {
                  const tour = tournaments.find((t) => t.id === urgentAnnouncement.tournamentId);
                  if (tour) setSelectedTournament(tour);
                }}
                className="text-[11px] font-bold underline hover:text-amber-200 shrink-0 cursor-pointer"
              >
                {language === 'hi' ? 'देखें >' : 'View >'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Visual Area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#ff6b00]/30 shadow-2xl shadow-orange-950/30">
          
          {/* Background Image with esports contrast scrim */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              src="/src/assets/images/ff_tournament_hero_1792577808859.jpg"
              alt="Free Fire Battle Arena Championship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center scale-105"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c10]/90 via-[#0a0c10]/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 p-5 sm:p-8 md:p-10 flex flex-col justify-end max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] mb-2 font-mono-code uppercase">
              <Flame className="w-4 h-4 text-[#ff6b00] animate-bounce" />
              <span>{language === 'hi' ? 'डेली ईस्पोर्ट्स मैच' : 'DAILY TOURNAMENT SERIES'}</span>
              <span>·</span>
              <span>{language === 'hi' ? 'सोलो · डुओ · स्क्वाड' : 'SOLO · DUO · SQUAD'}</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase mb-3">
              {language === 'hi' ? (
                <>
                  फ्री फायर <span className="text-[#ff6b00]">बैटल अरीना</span> में अपना दम दिखाएं
                </>
              ) : (
                <>
                  DOMINATE THE <span className="text-[#ff6b00]">FREE FIRE</span> BATTLEGROUND
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#cbd5e1] mb-5 line-clamp-2 max-w-xl">
              {language === 'hi'
                ? 'नि:शुल्क और सशुल्क दोनों टूर्नामेंट्स में भाग लें। 100% सत्यापित स्कोर, तुरंत कस्टम रूम आईडी और सुरक्षित प्राइज पूल।'
                : 'Join certified Free Fire esports showdowns. Instant custom room credentials, verified kill bounty payouts, and live leaderboards.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleJoinFeatured}
                className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] hover:from-[#ff7c1a] hover:to-[#ffa826] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{language === 'hi' ? 'टूर्नामेंट में भाग लें' : 'Join Next Match'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tournaments')}
                className="h-11 px-4 rounded-xl bg-[#181b24]/90 hover:bg-[#252834] text-white border border-[#374151] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-[#ffaa00]" />
                <span>{language === 'hi' ? 'सभी टूर्नामेंट्स देखें' : 'Browse All'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* 4-Item KPI Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#ff6b00] shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {language === 'hi' ? 'सत्यापित पुरस्कार' : 'Verified Prizes'}
              </div>
              <div className="text-[11px] text-[#9ca3af]">
                {language === 'hi' ? '100% पारदर्शी वितरण' : 'Guaranteed Payouts'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-[#ffaa00] shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {language === 'hi' ? 'एंटी-चीट नियम' : 'Strict Anti-Cheat'}
              </div>
              <div className="text-[11px] text-[#9ca3af]">
                {language === 'hi' ? 'एमुलेटर बैन व निष्पक्ष गेम' : 'Zero Emulator Policy'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {language === 'hi' ? 'फ्री व पेड स्लॉट' : 'Free & Paid Slots'}
              </div>
              <div className="text-[11px] text-[#9ca3af]">
                {language === 'hi' ? 'डेली कस्टम रूम्स' : 'Daily Custom Matches'}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {language === 'hi' ? 'तुरंत रूम क्रेडेंशियल' : 'Room ID & Password'}
              </div>
              <div className="text-[11px] text-[#9ca3af]">
                {language === 'hi' ? 'मैच से 15 मिनट पहले' : 'Instant 15m Unlock'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
