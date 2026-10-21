import React, { useState, useEffect } from 'react';
import { Clock, Users, Trophy, Key, Crosshair, MapPin } from 'lucide-react';
import { Tournament } from '../types';
import { useApp } from '../context/AppContext';
import { calculateTimeLeft, formatTimeLeftString } from '../utils/countdown';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
  onOpenRegister?: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onSelect,
  onOpenRegister,
}) => {
  const { language, t, getUserRegistration } = useApp();
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(tournament.matchDateTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(tournament.matchDateTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [tournament.matchDateTime]);

  const userReg = getUserRegistration(tournament.id);
  const slotsPercentage = Math.min(100, Math.round((tournament.registeredCount / tournament.totalSlots) * 100));
  const isFull = tournament.registeredCount >= tournament.totalSlots;

  const getModeLabel = (mode: string) => {
    if (mode === 'solo') return t('solo');
    if (mode === 'duo') return t('duo');
    if (mode === 'squad') return t('squad');
    return mode;
  };

  return (
    <div
      onClick={() => onSelect(tournament)}
      className="group relative bg-[#11131a] hover:bg-[#161922] border border-[#232733] hover:border-[#ff6b00]/50 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner Image & Metadata Header */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <img
          src={tournament.bannerUrl}
          alt={tournament.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-[#11131a]/40 to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded font-mono-code text-[11px] font-bold uppercase tracking-wider ${
                tournament.category === 'free'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#ff6b00] text-black'
              }`}
            >
              {tournament.category === 'free' ? t('free') : `₹${tournament.entryFee} ${t('paid')}`}
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-300 font-mono-code text-[11px] font-semibold uppercase">
              {getModeLabel(tournament.gameMode)}
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#9ca3af] text-[11px]">
            <MapPin className="w-3 h-3 text-[#ff6b00]" />
            <span className="font-medium text-white">{tournament.map}</span>
          </div>
        </div>

        {/* Bottom overlay: Title & Match Countdown */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono-code font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
            <span>
              {tournament.status === 'live'
                ? 'LIVE NOW'
                : tournament.status === 'completed'
                ? 'FINISHED'
                : formatTimeLeftString(timeLeft)}
            </span>
          </div>

          {userReg && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                userReg.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {userReg.status === 'approved'
                ? (language === 'hi' ? 'स्वीकृत' : 'Approved')
                : (language === 'hi' ? 'समीक्षाधीन' : 'Pending')}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide uppercase line-clamp-1 group-hover:text-[#ff6b00] transition-colors">
            {tournament.title}
          </h3>

          {/* Clean Unboxed Metadata Separators */}
          <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-1 mb-3">
            <span>{tournament.version}</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(tournament.matchDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(tournament.matchDateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Prize pool & Bounty stats */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#0b0c10] border border-[#1f2430] rounded-xl mb-3 text-xs">
            <div>
              <div className="text-[10px] text-[#8b949e] uppercase font-medium">{t('prizePool')}</div>
              <div className="font-mono-code text-base font-extrabold text-[#ffaa00]">
                ₹{tournament.prizePool.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8b949e] uppercase font-medium">{t('firstPrize')}</div>
              <div className="font-mono-code text-base font-extrabold text-white">
                ₹{tournament.firstPrize.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Per Kill Bounty info */}
          <div className="flex items-center justify-between text-xs text-[#cbd5e1] px-1 mb-3">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span className="text-[#9ca3af]">{t('perKill')}:</span>
              <span className="font-mono-code font-bold text-white">₹{tournament.perKill}</span>
            </span>
            <span className="text-[11px] text-[#8b949e]">
              {tournament.totalSlots - tournament.registeredCount} {language === 'hi' ? 'सीटें बाकी' : 'slots left'}
            </span>
          </div>

          {/* Slot Progress Bar */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-[11px] text-[#8b949e] font-mono-code">
              <span>{t('slots')}</span>
              <span className="text-white font-semibold">
                {tournament.registeredCount} / {tournament.totalSlots}
              </span>
            </div>
            <div className="w-full bg-[#1e222d] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  slotsPercentage > 85 ? 'bg-gradient-to-r from-[#ff6b00] to-red-500' : 'bg-gradient-to-r from-amber-500 to-[#ff6b00]'
                }`}
                style={{ width: `${slotsPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#1f2430]">
          {userReg ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(tournament);
              }}
              className="w-full h-10 rounded-xl bg-[#1e222e] hover:bg-[#282d3d] border border-[#ff6b00]/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Key className="w-4 h-4 text-[#ff6b00]" />
              <span>
                {tournament.credentialsReleased
                  ? (language === 'hi' ? 'रूम आईडी व पासवर्ड देखें' : 'View Room ID & Password')
                  : (language === 'hi' ? 'मेरी टिकट व क्रेडेंशियल' : 'Registered • View Details')}
              </span>
            </button>
          ) : tournament.status === 'completed' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(tournament);
              }}
              className="w-full h-10 rounded-xl bg-[#1a1d26] text-[#9ca3af] font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4" />
              <span>{language === 'hi' ? 'परिणाम देखें' : 'View Match Results'}</span>
            </button>
          ) : isFull ? (
            <button
              disabled
              className="w-full h-10 rounded-xl bg-[#151720] text-[#6b7280] font-semibold text-xs flex items-center justify-center cursor-not-allowed"
            >
              {t('slotsFull')}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenRegister) {
                  onOpenRegister(tournament);
                } else {
                  onSelect(tournament);
                }
              }}
              className="w-full h-10 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] hover:from-[#ff7914] hover:to-[#ffa61a] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/20 active:scale-98 transition-all"
            >
              <span>{t('registerNow')}</span>
              <span className="font-mono-code">
                ({tournament.category === 'free' ? t('free') : `₹${tournament.entryFee}`})
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
