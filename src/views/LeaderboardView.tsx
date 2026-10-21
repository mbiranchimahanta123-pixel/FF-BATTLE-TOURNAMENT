import React, { useState } from 'react';
import { Award, Trophy, Flame, ShieldCheck, Crosshair, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LeaderboardView: React.FC = () => {
  const { language, t, leaderboard } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'top'>('all');

  const filteredLeaderboard = leaderboard.filter((entry) => {
    const matchQuery =
      entry.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.freeFireUid.includes(searchQuery);
    return matchQuery;
  });

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase mb-1">
            <Award className="w-4 h-4 text-[#ff6b00]" />
            <span>{language === 'hi' ? 'आधिकारिक ईस्पोर्ट्स रैंकिंग' : 'OFFICIAL ESPORTS RANKINGS'}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t('leaderboard')}
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">{t('verifiedResults')}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'खिलाड़ी या FF UID खोजें...' : 'Search player or UID...'}
            className="w-full h-10 pl-9 pr-3 bg-[#131620] border border-[#232733] focus:border-[#ff6b00] rounded-xl text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Top 3 Champions Podium Banner */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-b from-[#191d29] to-[#0f1118] border border-[#ffaa00]/30 p-5 sm:p-8">
        
        {/* Trophy Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden hidden sm:block">
          <img
            src="/src/assets/images/ff_trophy_cup_1792577809108.jpg"
            alt="Trophy Cup"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ffaa00] uppercase font-mono-code mb-4">
            <Trophy className="w-4 h-4 text-[#ff6b00]" />
            <span>{t('topFraggers')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topThree.map((player, idx) => (
              <div
                key={player.id}
                className={`relative p-4 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-b from-[#ff6b00]/20 to-[#12141c] border-[#ff6b00] shadow-lg shadow-orange-950/40 sm:-translate-y-2'
                    : idx === 1
                    ? 'bg-[#141722] border-slate-400/40'
                    : 'bg-[#141722] border-amber-700/40'
                }`}
              >
                {/* Crown / Rank Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black font-mono-code text-xs ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-400 to-[#ff6b00] text-black'
                        : idx === 1
                        ? 'bg-slate-300 text-black'
                        : 'bg-amber-700 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <img
                    src={player.avatarUrl}
                    alt={player.playerName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-[#ff6b00] bg-slate-900"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-heading text-base font-bold text-white uppercase truncate">
                      {player.playerName}
                    </h3>
                    <div className="text-[11px] font-mono-code text-[#8b949e]">
                      UID: {player.freeFireUid}
                    </div>
                  </div>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#232733] text-center text-xs">
                  <div>
                    <div className="text-[9px] text-[#8b949e] uppercase">{t('kills')}</div>
                    <div className="font-mono-code font-bold text-white">{player.kills}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#8b949e] uppercase">{t('points')}</div>
                    <div className="font-mono-code font-extrabold text-[#ffaa00]">{player.points}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#8b949e] uppercase">{t('prizeWon')}</div>
                    <div className="font-mono-code font-bold text-emerald-400">₹{player.prizeWon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standings Table with Tabular Numerals */}
      <div className="bg-[#11131a] border border-[#232733] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1f2430] flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
            {t('overallRankings')}
          </h2>
          <span className="text-xs text-[#8b949e] font-mono-code">
            {filteredLeaderboard.length} {language === 'hi' ? 'खिलाड़ी' : 'Players'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0b0c10] text-[#8b949e] uppercase font-mono-code text-[11px] border-b border-[#1f2430]">
                <th className="py-3 px-4 w-14 text-center">{t('rank')}</th>
                <th className="py-3 px-4">{t('player')}</th>
                <th className="py-3 px-4 text-center">{t('matchesPlayed')}</th>
                <th className="py-3 px-4 text-center">{t('totalWins')}</th>
                <th className="py-3 px-4 text-center">{t('kills')}</th>
                <th className="py-3 px-4 text-center">{t('points')}</th>
                <th className="py-3 px-4 text-right">{t('prizeWon')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1f2b]">
              {filteredLeaderboard.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-[#161a24] transition-colors font-medium text-white"
                >
                  <td className="py-3.5 px-4 text-center font-mono-code font-bold">
                    <span
                      className={`inline-block w-6 h-6 rounded-full text-xs leading-6 ${
                        entry.rank === 1
                          ? 'bg-[#ff6b00] text-black'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-black'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'text-[#8b949e]'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-white font-heading uppercase text-sm">
                        {entry.playerName}
                      </div>
                      {entry.isVerified && (
                        <span title="Verified Player">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#8b949e] font-mono-code">
                      UID: {entry.freeFireUid}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-code tabular-nums text-[#cbd5e1]">
                    {entry.matches}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-code tabular-nums text-amber-300">
                    {entry.wins}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-code tabular-nums font-bold text-white">
                    {entry.kills}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono-code tabular-nums font-extrabold text-[#ffaa00]">
                    {entry.points}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono-code tabular-nums font-bold text-emerald-400">
                    ₹{entry.prizeWon.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
