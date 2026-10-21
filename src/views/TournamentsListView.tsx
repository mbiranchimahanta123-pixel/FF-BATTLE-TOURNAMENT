import React, { useState } from 'react';
import { Search, Filter, Swords, Trophy, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TournamentCard } from '../components/TournamentCard';
import { Tournament, GameMode, TournamentCategory, TournamentStatus } from '../types';

interface TournamentsListViewProps {
  onSelectTournament: (tournament: Tournament) => void;
  onOpenRegister: (tournament: Tournament) => void;
}

export const TournamentsListView: React.FC<TournamentsListViewProps> = ({
  onSelectTournament,
  onOpenRegister,
}) => {
  const { language, t, tournaments } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | 'all'>('all');

  const filteredTournaments = tournaments.filter((tour) => {
    // Search
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.map.toLowerCase().includes(searchQuery.toLowerCase());

    // Mode filter
    const matchesMode = selectedMode === 'all' || tour.gameMode === selectedMode;

    // Category filter
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;

    // Status filter
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'open' && tour.status === 'open') ||
      (selectedStatus === 'live' && tour.status === 'live') ||
      (selectedStatus === 'completed' && tour.status === 'completed');

    return matchesSearch && matchesMode && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase mb-1">
            <Swords className="w-4 h-4 text-[#ff6b00]" />
            <span>{language === 'hi' ? 'सक्रिय ईस्पोर्ट्स लीग' : 'ACTIVE ESPORTS ARENAS'}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t('tournaments')}
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {language === 'hi'
              ? 'सोलो, डुओ और स्क्वाड कस्टम मैचों में भाग लें। नि:शुल्क व सशुल्क दोनों विकल्प उपलब्ध।'
              : 'Compete in Solo, Duo, and Squad custom lobbies. Daily Free and Paid entry matches.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchTournaments')}
            className="w-full h-11 pl-10 pr-3.5 bg-[#12141c] border border-[#232733] focus:border-[#ff6b00] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-[#11131a] border border-[#232733] p-3 rounded-2xl">
        
        {/* Mode filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#181b24] rounded-xl border border-[#262b3a] text-xs">
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedMode === 'all' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setSelectedMode('solo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedMode === 'solo' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('solo')}
          </button>
          <button
            onClick={() => setSelectedMode('duo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedMode === 'duo' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('duo')}
          </button>
          <button
            onClick={() => setSelectedMode('squad')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedMode === 'squad' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('squad')}
          </button>
        </div>

        {/* Category: Free vs Paid */}
        <div className="flex items-center gap-1 p-1 bg-[#181b24] rounded-xl border border-[#262b3a] text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all' ? 'bg-[#ffaa00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setSelectedCategory('free')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCategory === 'free' ? 'bg-emerald-500 text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('free')}
          </button>
          <button
            onClick={() => setSelectedCategory('paid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCategory === 'paid' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('paid')}
          </button>
        </div>

        {/* Status: Open, Live, Completed */}
        <div className="flex items-center gap-1 p-1 bg-[#181b24] rounded-xl border border-[#262b3a] text-xs ml-auto">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedStatus === 'all' ? 'bg-white text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('all')}
          </button>
          <button
            onClick={() => setSelectedStatus('open')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedStatus === 'open' ? 'bg-white text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('open')}
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedStatus === 'completed' ? 'bg-white text-black font-bold' : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            {t('completed')}
          </button>
        </div>

      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="bg-[#11131a] border border-[#232733] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white uppercase">
            {t('noTournamentsFound')}
          </h3>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMode('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 bg-[#ff6b00] text-black font-extrabold text-xs uppercase rounded-xl cursor-pointer"
          >
            {language === 'hi' ? 'फिल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTournaments.map((tour) => (
            <TournamentCard
              key={tour.id}
              tournament={tour}
              onSelect={onSelectTournament}
              onOpenRegister={onOpenRegister}
            />
          ))}
        </div>
      )}

    </div>
  );
};
