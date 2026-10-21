import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Key,
  Users,
  Trophy,
  Calendar,
  Layers,
  Bell,
  Database,
  BarChart3,
  AlertOctagon,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tournament, GameMode, TournamentCategory, RegistrationStatus, LeaderboardEntry } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    t,
    tournaments,
    registrations,
    announcements,
    leaderboard,
    createTournament,
    updateTournament,
    cancelTournament,
    updateRegistrationStatus,
    publishMatchResults,
    addAnnouncement,
    deleteAnnouncement,
    setIsFirebaseGuideOpen,
    resetToDemoData,
    logoutAdmin,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'tournaments' | 'registrations' | 'results' | 'announcements' | 'stats'
  >('tournaments');

  // Create/Edit Tournament Modal state
  const [isEditingTour, setIsEditingTour] = useState(false);
  const [tourFormId, setTourFormId] = useState<string | null>(null);
  const [tourTitle, setTourTitle] = useState('');
  const [tourMap, setTourMap] = useState<Tournament['map']>('Bermuda');
  const [tourMode, setTourMode] = useState<GameMode>('solo');
  const [tourCategory, setTourCategory] = useState<TournamentCategory>('free');
  const [tourEntryFee, setTourEntryFee] = useState(0);
  const [tourPrizePool, setTourPrizePool] = useState(1500);
  const [tourFirstPrize, setTourFirstPrize] = useState(800);
  const [tourSecondPrize, setTourSecondPrize] = useState(400);
  const [tourThirdPrize, setTourThirdPrize] = useState(300);
  const [tourPerKill, setTourPerKill] = useState(15);
  const [tourDateTime, setTourDateTime] = useState(
    new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16)
  );
  const [tourTotalSlots, setTourTotalSlots] = useState(48);
  const [tourRoomId, setTourRoomId] = useState('');
  const [tourRoomPass, setTourRoomPass] = useState('');
  const [tourReleased, setTourReleased] = useState(false);

  // Filter registrations by tournament
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>('all');

  // Announcement state
  const [newAnnTitleEn, setNewAnnTitleEn] = useState('');
  const [newAnnTitleHi, setNewAnnTitleHi] = useState('');
  const [newAnnMsgEn, setNewAnnMsgEn] = useState('');
  const [newAnnMsgHi, setNewAnnMsgHi] = useState('');
  const [newAnnPriority, setNewAnnPriority] = useState<'normal' | 'urgent'>('normal');

  // Results publish state
  const [resultTourId, setResultTourId] = useState<string>(tournaments[0]?.id || '');
  const [winnerTeamName, setWinnerTeamName] = useState('ALPHA PHOENIX');
  const [winnerUid, setWinnerUid] = useState('2948201955');
  const [winnerKills, setWinnerKills] = useState(14);
  const [winnerPoints, setWinnerPoints] = useState(45);
  const [winnerPrize, setWinnerPrize] = useState(1500);

  // Statistics calculation
  const totalPrizeDisbursed = tournaments.reduce((acc, t) => acc + (t.status === 'completed' ? t.prizePool : 0), 0);
  const totalActiveTournaments = tournaments.filter((t) => t.status === 'open' || t.status === 'live').length;

  const handleOpenCreateTour = () => {
    setTourFormId(null);
    setTourTitle('Daily Solo Bermuda Rush');
    setTourMap('Bermuda');
    setTourMode('solo');
    setTourCategory('free');
    setTourEntryFee(0);
    setTourPrizePool(1500);
    setTourFirstPrize(800);
    setTourSecondPrize(400);
    setTourThirdPrize(300);
    setTourPerKill(15);
    setTourDateTime(new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16));
    setTourTotalSlots(48);
    setTourRoomId('');
    setTourRoomPass('');
    setTourReleased(false);
    setIsEditingTour(true);
  };

  const handleOpenEditTour = (tour: Tournament) => {
    setTourFormId(tour.id);
    setTourTitle(tour.title);
    setTourMap(tour.map);
    setTourMode(tour.gameMode);
    setTourCategory(tour.category);
    setTourEntryFee(tour.entryFee);
    setTourPrizePool(tour.prizePool);
    setTourFirstPrize(tour.firstPrize);
    setTourSecondPrize(tour.secondPrize);
    setTourThirdPrize(tour.thirdPrize);
    setTourPerKill(tour.perKill);
    setTourDateTime(new Date(tour.matchDateTime).toISOString().slice(0, 16));
    setTourTotalSlots(tour.totalSlots);
    setTourRoomId(tour.roomId || '');
    setTourRoomPass(tour.roomPassword || '');
    setTourReleased(tour.credentialsReleased);
    setIsEditingTour(true);
  };

  const handleSaveTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (tourFormId) {
      updateTournament(tourFormId, {
        title: tourTitle,
        map: tourMap,
        gameMode: tourMode,
        category: tourCategory,
        entryFee: Number(tourEntryFee),
        prizePool: Number(tourPrizePool),
        firstPrize: Number(tourFirstPrize),
        secondPrize: Number(tourSecondPrize),
        thirdPrize: Number(tourThirdPrize),
        perKill: Number(tourPerKill),
        matchDateTime: new Date(tourDateTime).toISOString(),
        totalSlots: Number(tourTotalSlots),
        roomId: tourRoomId || undefined,
        roomPassword: tourRoomPass || undefined,
        credentialsReleased: tourReleased,
      });
    } else {
      createTournament({
        title: tourTitle,
        map: tourMap,
        gameMode: tourMode,
        category: tourCategory,
        entryFee: Number(tourEntryFee),
        prizePool: Number(tourPrizePool),
        firstPrize: Number(tourFirstPrize),
        secondPrize: Number(tourSecondPrize),
        thirdPrize: Number(tourThirdPrize),
        perKill: Number(tourPerKill),
        matchDateTime: new Date(tourDateTime).toISOString(),
        totalSlots: Number(tourTotalSlots),
        status: 'open',
        roomId: tourRoomId || undefined,
        roomPassword: tourRoomPass || undefined,
        credentialsReleased: tourReleased,
        version: 'Battle Royale',
        rules: ['Standard esports solo/squad rules apply.'],
        bannerUrl: '/src/assets/images/ff_tournament_hero_1792577808859.jpg',
      });
    }
    setIsEditingTour(false);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitleEn.trim() || !newAnnMsgEn.trim()) return;

    addAnnouncement({
      titleEn: newAnnTitleEn.trim(),
      titleHi: newAnnTitleHi.trim() || newAnnTitleEn.trim(),
      messageEn: newAnnMsgEn.trim(),
      messageHi: newAnnMsgHi.trim() || newAnnMsgEn.trim(),
      priority: newAnnPriority,
      pinned: newAnnPriority === 'urgent',
    });

    setNewAnnTitleEn('');
    setNewAnnTitleHi('');
    setNewAnnMsgEn('');
    setNewAnnMsgHi('');
  };

  const handlePublishResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultTourId) return;

    const newLeaderboardEntry: LeaderboardEntry = {
      id: `lead-${Date.now()}`,
      tournamentId: resultTourId,
      rank: 1,
      playerName: winnerTeamName.trim(),
      freeFireUid: winnerUid.trim(),
      kills: Number(winnerKills),
      matches: 1,
      wins: 1,
      points: Number(winnerPoints),
      prizeWon: Number(winnerPrize),
      isVerified: true,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(winnerTeamName)}`
    };

    publishMatchResults(resultTourId, [newLeaderboardEntry]);
    alert(language === 'hi' ? 'परिणाम सफलतापूर्वक प्रकाशित किए गए!' : 'Match results and leaderboard published!');
  };

  const filteredRegistrations = selectedTourFilter === 'all'
    ? registrations
    : registrations.filter((r) => r.tournamentId === selectedTourFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      
      {/* Admin Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
            <span>{language === 'hi' ? 'प्रशासक नियंत्रण' : 'COMMAND CENTER'}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t('adminPortal')}
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {language === 'hi'
              ? 'टूर्नामेंट बनाएं, रूम क्रेडेंशियल जारी करें, खिलाड़ियों को स्वीकृत करें और परिणाम प्रकाशित करें।'
              : 'Create tournaments, set slots, release room credentials, approve participants & publish scores.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsFirebaseGuideOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1a1e2b] hover:bg-[#252b3d] border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'फायरबेस गाइड' : 'Firebase Guide'}</span>
          </button>

          <button
            onClick={resetToDemoData}
            className="px-3 py-2 rounded-xl bg-[#1e222e] hover:bg-[#282d3d] border border-[#353b4e] text-xs font-semibold text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            title="Reset to default seed data"
          >
            {language === 'hi' ? 'डेमो रीसेट' : 'Reset Demo'}
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-xs font-semibold text-red-400 transition-colors cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl">
          <div className="flex items-center justify-between text-[#8b949e] mb-1">
            <span className="text-xs uppercase">{t('totalTournaments')}</span>
            <Layers className="w-4 h-4 text-[#ffaa00]" />
          </div>
          <div className="font-mono-code text-2xl font-black text-white tabular-nums">
            {tournaments.length}
          </div>
        </div>

        <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl">
          <div className="flex items-center justify-between text-[#8b949e] mb-1">
            <span className="text-xs uppercase">{t('totalPlayersRegistered')}</span>
            <Users className="w-4 h-4 text-[#ff6b00]" />
          </div>
          <div className="font-mono-code text-2xl font-black text-white tabular-nums">
            {registrations.length}
          </div>
        </div>

        <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl">
          <div className="flex items-center justify-between text-[#8b949e] mb-1">
            <span className="text-xs uppercase">{t('activeTournamentsCount')}</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono-code text-2xl font-black text-emerald-400 tabular-nums">
            {totalActiveTournaments}
          </div>
        </div>

        <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl">
          <div className="flex items-center justify-between text-[#8b949e] mb-1">
            <span className="text-xs uppercase">{t('prizePoolDisbursed')}</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono-code text-2xl font-black text-[#ffaa00] tabular-nums">
            ₹{totalPrizeDisbursed.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Admin Nav Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-[#12141c] border border-[#232733] rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveAdminTab('tournaments')}
          className={`px-3.5 py-2 font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeAdminTab === 'tournaments'
              ? 'bg-[#ff6b00] text-black shadow'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          {t('manageTournaments')} ({tournaments.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('registrations')}
          className={`px-3.5 py-2 font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeAdminTab === 'registrations'
              ? 'bg-[#ff6b00] text-black shadow'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          {t('registrations')} ({registrations.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('results')}
          className={`px-3.5 py-2 font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeAdminTab === 'results'
              ? 'bg-[#ff6b00] text-black shadow'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          {t('results')}
        </button>
        <button
          onClick={() => setActiveAdminTab('announcements')}
          className={`px-3.5 py-2 font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeAdminTab === 'announcements'
              ? 'bg-[#ff6b00] text-black shadow'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          {t('publishAnnouncements')} ({announcements.length})
        </button>
      </div>

      {/* TAB 1: MANAGE TOURNAMENTS */}
      {activeAdminTab === 'tournaments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              {t('manageTournaments')}
            </h2>
            <button
              onClick={handleOpenCreateTour}
              className="px-4 py-2 bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createTournament')}</span>
            </button>
          </div>

          <div className="bg-[#11131a] border border-[#232733] rounded-2xl overflow-hidden divide-y divide-[#1f2430]">
            {tournaments.map((tour) => (
              <div
                key={tour.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#151821] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-code mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tour.category === 'free' ? 'bg-emerald-500 text-black' : 'bg-[#ff6b00] text-black'
                      }`}
                    >
                      {tour.category === 'free' ? 'FREE' : `₹${tour.entryFee}`}
                    </span>
                    <span className="text-[#ffaa00] font-semibold">{tour.gameMode.toUpperCase()}</span>
                    <span>·</span>
                    <span className="text-white font-medium">{tour.map}</span>
                    <span>·</span>
                    <span className="text-[#8b949e]">
                      {new Date(tour.matchDateTime).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white uppercase">{tour.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-[#9ca3af] mt-1 font-mono-code">
                    <span>
                      {t('slots')}: {tour.registeredCount} / {tour.totalSlots}
                    </span>
                    <span>·</span>
                    <span>{t('prizePool')}: ₹{tour.prizePool}</span>
                    <span>·</span>
                    <span className={tour.credentialsReleased ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {tour.credentialsReleased
                        ? `Room: ${tour.roomId} (Released)`
                        : 'Room: Not Released'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  {/* Quick Toggle Release Room */}
                  <button
                    onClick={() => {
                      if (!tour.roomId) {
                        alert(language === 'hi' ? 'कृपया पहले रूम आईडी व पासवर्ड सेट करें!' : 'Please set Room ID & Password first by editing!');
                        handleOpenEditTour(tour);
                        return;
                      }
                      updateTournament(tour.id, { credentialsReleased: !tour.credentialsReleased });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      tour.credentialsReleased
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400'
                        : 'bg-amber-950/30 border border-amber-500/30 text-amber-300 hover:bg-amber-950/50'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{tour.credentialsReleased ? (language === 'hi' ? 'रूम जारी है' : 'Room Live') : t('releaseRoom')}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditTour(tour)}
                    className="p-2 rounded-lg bg-[#1f2432] hover:bg-[#2c3345] text-white text-xs transition-colors cursor-pointer"
                    title="Edit Tournament"
                  >
                    <Edit className="w-4 h-4 text-slate-300" />
                  </button>

                  {tour.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        if (confirm(language === 'hi' ? 'क्या आप इस टूर्नामेंट को रद्द करना चाहते हैं?' : 'Are you sure you want to cancel this tournament?')) {
                          cancelTournament(tour.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs border border-red-500/20 transition-colors cursor-pointer"
                      title={t('cancelTournament')}
                    >
                      <AlertOctagon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE REGISTRATIONS (Approve / Reject) */}
      {activeAdminTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
              {t('registrations')} ({filteredRegistrations.length})
            </h2>

            <select
              value={selectedTourFilter}
              onChange={(e) => setSelectedTourFilter(e.target.value)}
              className="h-10 px-3 bg-[#131620] border border-[#232733] rounded-xl text-xs text-white outline-none"
            >
              <option value="all">{language === 'hi' ? 'सभी टूर्नामेंट्स' : 'All Tournaments'}</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#11131a] border border-[#232733] rounded-2xl overflow-hidden divide-y divide-[#1f2430]">
            {filteredRegistrations.length === 0 ? (
              <p className="p-6 text-center text-xs text-[#8b949e]">
                {language === 'hi' ? 'कोई खिलाड़ी पंजीकरण नहीं मिला।' : 'No registrations found.'}
              </p>
            ) : (
              filteredRegistrations.map((reg) => {
                const tour = tournaments.find((t) => t.id === reg.tournamentId);

                return (
                  <div
                    key={reg.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#151821] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono-code mb-1">
                        <span className="text-[#ffaa00] font-bold">Slot #{reg.slotNumber}</span>
                        <span>·</span>
                        <span className="text-white font-medium">{tour?.title || 'Tournament'}</span>
                        <span>·</span>
                        <span className="text-[#8b949e]">{new Date(reg.registeredAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-base font-bold text-white uppercase">
                          {reg.playerName} ({reg.freeFireIgn})
                        </h4>
                        {reg.teamName && (
                          <span className="px-2 py-0.5 rounded bg-[#1e2330] text-[#ffaa00] text-[10px] font-mono-code font-bold">
                            TEAM: {reg.teamName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#8b949e] font-mono-code mt-1">
                        <span>FF UID: <strong className="text-white">{reg.freeFireUid}</strong></span>
                        <span>·</span>
                        <span>Phone: <strong className="text-white">{reg.playerPhone}</strong></span>
                      </div>

                      {reg.teamMembers && reg.teamMembers.length > 0 && (
                        <div className="mt-2 text-[11px] text-[#9ca3af] bg-[#0b0c10] p-2 rounded-lg border border-[#1e222e]">
                          <span className="font-semibold text-white">Squad Members:</span>{' '}
                          {reg.teamMembers.map((m, i) => `${m.ign} (${m.uid})`).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono-code uppercase ${
                          reg.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : reg.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {reg.status}
                      </span>

                      {reg.status !== 'approved' && (
                        <button
                          onClick={() => updateRegistrationStatus(reg.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          {t('approve')}
                        </button>
                      )}

                      {reg.status !== 'rejected' && (
                        <button
                          onClick={() => updateRegistrationStatus(reg.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 font-bold text-xs rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                        >
                          {t('reject')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH MATCH RESULTS */}
      {activeAdminTab === 'results' && (
        <div className="bg-[#11131a] border border-[#232733] rounded-2xl p-5 sm:p-6 space-y-4 max-w-2xl">
          <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffaa00]" />
            <span>{t('results')}</span>
          </h2>
          <p className="text-xs text-[#9ca3af]">
            {language === 'hi'
              ? 'मैच समाप्ति पर विजेता टीम, कुल किल्स और प्राइज पूल दर्ज करके परिणाम आधिकारिक लीडरबोर्ड पर प्रकाशित करें।'
              : 'Publish verified winner, total kills, and award prize payouts directly to the global leaderboard.'}
          </p>

          <form onSubmit={handlePublishResults} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">{t('tournaments')}</label>
              <select
                value={resultTourId}
                onChange={(e) => setResultTourId(e.target.value)}
                className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.map} · {t.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Winner Player / Team IGN</label>
                <input
                  type="text"
                  value={winnerTeamName}
                  onChange={(e) => setWinnerTeamName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Winner Free Fire UID</label>
                <input
                  type="text"
                  value={winnerUid}
                  onChange={(e) => setWinnerUid(e.target.value)}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">{t('kills')}</label>
                <input
                  type="number"
                  value={winnerKills}
                  onChange={(e) => setWinnerKills(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">{t('points')}</label>
                <input
                  type="number"
                  value={winnerPoints}
                  onChange={(e) => setWinnerPoints(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">{t('prizeWon')} (₹)</label>
                <input
                  type="number"
                  value={winnerPrize}
                  onChange={(e) => setWinnerPrize(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-orange-600/30"
            >
              {language === 'hi' ? 'सत्यापित परिणाम घोषित करें' : 'Publish Verified Match Results'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeAdminTab === 'announcements' && (
        <div className="space-y-6">
          {/* Create Announcement Form */}
          <form
            onSubmit={handleAddAnnouncement}
            className="bg-[#11131a] border border-[#232733] rounded-2xl p-5 space-y-3 max-w-2xl text-xs"
          >
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#ff6b00]" />
              <span>{language === 'hi' ? 'नई ईस्पोर्ट्स घोषणा प्रकाशित करें' : 'Post Esports Announcement'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Title (English)</label>
                <input
                  type="text"
                  value={newAnnTitleEn}
                  onChange={(e) => setNewAnnTitleEn(e.target.value)}
                  placeholder="e.g. Bermuda Custom Room Live"
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Title (हिन्दी)</label>
                <input
                  type="text"
                  value={newAnnTitleHi}
                  onChange={(e) => setNewAnnTitleHi(e.target.value)}
                  placeholder="e.g. बरमूडा कस्टम रूम लाइव"
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Message (English)</label>
                <textarea
                  rows={2}
                  value={newAnnMsgEn}
                  onChange={(e) => setNewAnnMsgEn(e.target.value)}
                  placeholder="Details for players..."
                  className="w-full p-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Message (हिन्दी)</label>
                <textarea
                  rows={2}
                  value={newAnnMsgHi}
                  onChange={(e) => setNewAnnMsgHi(e.target.value)}
                  placeholder="खिलाड़ियों के लिए संदेश..."
                  className="w-full p-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={newAnnPriority === 'normal'}
                    onChange={() => setNewAnnPriority('normal')}
                  />
                  <span className="text-white">Normal Notice</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    checked={newAnnPriority === 'urgent'}
                    onChange={() => setNewAnnPriority('urgent')}
                  />
                  <span className="text-red-400 font-bold">Urgent Header Alert</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2 bg-[#ff6b00] hover:bg-[#ff8526] text-black font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'घोषणा भेजें' : 'Broadcast Notice'}
              </button>
            </div>
          </form>

          {/* Announcements list */}
          <div className="bg-[#11131a] border border-[#232733] rounded-2xl overflow-hidden divide-y divide-[#1f2430]">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-code mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ann.priority === 'urgent' ? 'bg-red-500 text-white' : 'bg-[#232733] text-[#9ca3af]'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[#8b949e]">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-white uppercase">{ann.titleEn}</h4>
                  <p className="text-xs text-[#9ca3af] mt-0.5">{ann.messageEn}</p>
                </div>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT TOURNAMENT MODAL */}
      {isEditingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 my-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tight mb-4">
              {tourFormId ? t('editTournament') : t('createTournament')}
            </h2>

            <form onSubmit={handleSaveTour} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#9ca3af] mb-1 font-medium">Tournament Title</label>
                <input
                  type="text"
                  value={tourTitle}
                  onChange={(e) => setTourTitle(e.target.value)}
                  className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('map')}</label>
                  <select
                    value={tourMap}
                    onChange={(e) => setTourMap(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="NexTerra">NexTerra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('mode')}</label>
                  <select
                    value={tourMode}
                    onChange={(e) => setTourMode(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  >
                    <option value="solo">Solo (48)</option>
                    <option value="duo">Duo (24 Teams)</option>
                    <option value="squad">Squad (12 Teams)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('filterByCategory')}</label>
                  <select
                    value={tourCategory}
                    onChange={(e) => setTourCategory(e.target.value as any)}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                  >
                    <option value="free">Free (₹0)</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('entryFee')} (₹)</label>
                  <input
                    type="number"
                    value={tourEntryFee}
                    onChange={(e) => setTourEntryFee(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('prizePool')} (₹)</label>
                  <input
                    type="number"
                    value={tourPrizePool}
                    onChange={(e) => setTourPrizePool(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('firstPrize')} (₹)</label>
                  <input
                    type="number"
                    value={tourFirstPrize}
                    onChange={(e) => setTourFirstPrize(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('perKill')} (₹)</label>
                  <input
                    type="number"
                    value={tourPerKill}
                    onChange={(e) => setTourPerKill(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('matchTime')}</label>
                  <input
                    type="datetime-local"
                    value={tourDateTime}
                    onChange={(e) => setTourDateTime(e.target.value)}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1 font-medium">{t('slots')} Limit</label>
                  <input
                    type="number"
                    value={tourTotalSlots}
                    onChange={(e) => setTourTotalSlots(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none"
                    required
                  />
                </div>
              </div>

              {/* Room credentials setup */}
              <div className="p-3 bg-[#12141c] border border-[#232733] rounded-xl space-y-2.5">
                <span className="font-bold text-white flex items-center gap-1.5 uppercase font-mono-code">
                  <Key className="w-3.5 h-3.5 text-[#ff6b00]" />
                  <span>{t('roomCredentials')} (Restricted)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8b949e] mb-1">{t('roomId')}</label>
                    <input
                      type="text"
                      value={tourRoomId}
                      onChange={(e) => setTourRoomId(e.target.value)}
                      placeholder="e.g. 9482710"
                      className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white font-mono-code outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8b949e] mb-1">{t('roomPassword')}</label>
                    <input
                      type="text"
                      value={tourRoomPass}
                      onChange={(e) => setTourRoomPass(e.target.value)}
                      placeholder="e.g. ffa7"
                      className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white font-mono-code outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tourReleased}
                    onChange={(e) => setTourReleased(e.target.checked)}
                    className="rounded text-[#ff6b00]"
                  />
                  <span className="text-white font-medium">
                    {language === 'hi' ? 'स्वीकृत खिलाड़ियों के लिए रूम आईडी तुरंत जारी करें' : 'Release Room ID & Password immediately to approved players'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingTour(false)}
                  className="px-4 py-2 bg-[#1e2330] rounded-xl text-xs text-[#9ca3af] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ff6b00] hover:bg-[#ff8526] text-black font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
