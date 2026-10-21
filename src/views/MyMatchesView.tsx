import React from 'react';
import { Trophy, Clock, Key, CheckCircle, AlertTriangle, ArrowRight, Swords, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTimeLeft, formatTimeLeftString } from '../utils/countdown';

export const MyMatchesView: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    tournaments,
    registrations,
    setSelectedTournament,
    setActiveTab,
    setIsAuthModalOpen,
  } = useApp();

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ff6b00] mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase mb-2">
          {language === 'hi' ? 'लॉग इन करें' : 'Sign In Required'}
        </h2>
        <p className="text-xs sm:text-sm text-[#9ca3af] max-w-md mx-auto mb-6">
          {language === 'hi'
            ? 'अपने पंजीकृत मैच, रूम आईडी और पासवर्ड देखने के लिए अपने खाते में लॉग इन करें।'
            : 'Sign in to access your registered tournaments, custom room credentials, and match timings.'}
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-orange-600/30"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  // Find tournaments registered by current user
  const userRegistrations = registrations.filter(
    (r) => r.userId === currentUser.id || r.freeFireUid === currentUser.freeFireUid
  );

  const registeredTournamentIds = new Set(userRegistrations.map((r) => r.tournamentId));
  const userTournaments = tournaments.filter((t) => registeredTournamentIds.has(t.id));

  const activeMatches = userTournaments.filter((t) => t.status === 'open' || t.status === 'live' || t.status === 'upcoming');
  const pastMatches = userTournaments.filter((t) => t.status === 'completed' || t.status === 'cancelled');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase mb-1">
            <Swords className="w-4 h-4 text-[#ff6b00]" />
            <span>{language === 'hi' ? 'खिलाड़ी डैशबोर्ड' : 'PLAYER DASHBOARD'}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t('myTournaments')}
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">{t('myMatchesDesc')}</p>
        </div>

        <button
          onClick={() => setActiveTab('tournaments')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#171a24] hover:bg-[#222634] border border-[#2b3142] text-xs font-semibold text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>{language === 'hi' ? '+ नया टूर्नामेंट खोजें' : '+ Find Tournaments'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {userTournaments.length === 0 ? (
        <div className="bg-[#11131a] border border-[#232733] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ff6b00] mx-auto">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-xl font-bold text-white uppercase">
            {language === 'hi' ? 'कोई सक्रिय रजिस्ट्रेशन नहीं' : 'No Active Registrations'}
          </h3>
          <p className="text-xs text-[#9ca3af]">{t('noRegistrations')}</p>
          <button
            onClick={() => setActiveTab('tournaments')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-orange-600/30"
          >
            {language === 'hi' ? 'टूर्नामेंट्स ब्राउज़ करें' : 'Browse Tournaments'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active / Upcoming Matches */}
          <section className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-pulse" />
              <span>{language === 'hi' ? 'आगामी व सक्रिय मैच' : 'Upcoming & Live Matches'}</span>
              <span className="text-xs font-mono-code text-[#8b949e]">({activeMatches.length})</span>
            </h2>

            {activeMatches.length === 0 ? (
              <p className="text-xs text-[#8b949e] italic">
                {language === 'hi' ? 'कोई आगामी मैच नहीं है।' : 'No upcoming scheduled matches.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMatches.map((tour) => {
                  const reg = userRegistrations.find((r) => r.tournamentId === tour.id);
                  const isApproved = reg?.status === 'approved';
                  const timeLeft = calculateTimeLeft(tour.matchDateTime);

                  return (
                    <div
                      key={tour.id}
                      className="bg-[#12141c] border border-[#262b3a] hover:border-[#ff6b00]/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all"
                    >
                      <div>
                        {/* Status bar */}
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-code ${
                              reg?.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            }`}
                          >
                            {reg?.status === 'approved' ? t('statusApproved') : t('statusPending')}
                          </span>

                          <span className="font-mono-code text-xs font-bold text-[#ffaa00] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#ff6b00]" />
                            <span>{tour.status === 'live' ? 'LIVE NOW' : formatTimeLeftString(timeLeft)}</span>
                          </span>
                        </div>

                        <h3 className="font-heading text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                          {tour.title}
                        </h3>

                        {/* Unboxed Metadata */}
                        <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-1 mb-4">
                          <span>{tour.gameMode.toUpperCase()}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tour.map}</span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(tour.matchDateTime).toLocaleString()}</span>
                        </div>

                        {/* Registration Details Strip */}
                        <div className="p-3 bg-[#0a0c10] border border-[#1e222e] rounded-xl mb-4 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">{t('ffIgn')}:</span>
                            <span className="font-semibold text-white">{reg?.freeFireIgn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">{t('ffUid')}:</span>
                            <span className="font-mono-code text-[#ffaa00]">{reg?.freeFireUid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#8b949e]">{t('slots')}:</span>
                            <span className="font-mono-code font-bold text-white">#{reg?.slotNumber}</span>
                          </div>
                        </div>

                        {/* Room Credentials Card */}
                        <div className="p-3 rounded-xl bg-[#171a24] border border-[#2a3040]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono-code">
                              <Key className="w-3.5 h-3.5 text-[#ff6b00]" />
                              <span>{t('roomCredentials')}</span>
                            </span>
                            {tour.credentialsReleased && isApproved && (
                              <span className="text-[10px] text-emerald-400 font-bold uppercase">
                                {language === 'hi' ? 'सक्रिय' : 'RELEASED'}
                              </span>
                            )}
                          </div>

                          {isApproved ? (
                            tour.credentialsReleased && tour.roomId ? (
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-[#0c0e14] rounded-lg border border-[#232838] flex items-center justify-between">
                                  <div>
                                    <div className="text-[9px] text-[#8b949e] uppercase font-mono-code">{t('roomId')}</div>
                                    <div className="font-mono-code font-black text-white">{tour.roomId}</div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(tour.roomId!, `id-${tour.id}`)}
                                    className="p-1 text-[#cbd5e1] hover:text-white"
                                  >
                                    {copiedId === `id-${tour.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>

                                <div className="p-2 bg-[#0c0e14] rounded-lg border border-[#232838] flex items-center justify-between">
                                  <div>
                                    <div className="text-[9px] text-[#8b949e] uppercase font-mono-code">{t('roomPassword')}</div>
                                    <div className="font-mono-code font-black text-[#ffaa00]">{tour.roomPassword}</div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(tour.roomPassword!, `pass-${tour.id}`)}
                                    className="p-1 text-[#cbd5e1] hover:text-white"
                                  >
                                    {copiedId === `pass-${tour.id}` ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-[#9ca3af] bg-[#0c0e14] p-2.5 rounded-lg text-center">
                                {t('roomStatusLocked')}
                              </div>
                            )
                          ) : (
                            <div className="text-[11px] text-amber-400 bg-amber-950/20 p-2.5 rounded-lg text-center">
                              {t('registrationPendingMsg')}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTournament(tour)}
                        className="mt-4 w-full h-10 rounded-xl bg-[#1e2330] hover:bg-[#2a3042] text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        {language === 'hi' ? 'पूरा विवरण व नियम देखें' : 'View Full Details & Rules'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Past Tournament Registration History */}
          {pastMatches.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-[#232733]">
              <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'पुराने मैच का इतिहास' : 'Registration & Match History'}</span>
                <span className="text-xs font-mono-code text-[#8b949e]">({pastMatches.length})</span>
              </h2>

              <div className="bg-[#11131a] border border-[#232733] rounded-2xl overflow-hidden divide-y divide-[#1f2430]">
                {pastMatches.map((tour) => {
                  const reg = userRegistrations.find((r) => r.tournamentId === tour.id);

                  return (
                    <div
                      key={tour.id}
                      onClick={() => setSelectedTournament(tour)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#151821] transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono-code text-[#8b949e]">
                          <span>{tour.gameMode.toUpperCase()}</span>
                          <span aria-hidden="true">·</span>
                          <span>{tour.map}</span>
                          <span aria-hidden="true">·</span>
                          <span>{new Date(tour.matchDateTime).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-heading text-base font-bold text-white uppercase mt-0.5">
                          {tour.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-[#1d212d] text-xs font-mono-code text-white">
                          {language === 'hi' ? `स्लॉट #${reg?.slotNumber}` : `Slot #${reg?.slotNumber}`}
                        </span>
                        <span className="text-xs font-bold text-[#ffaa00]">
                          {tour.status === 'completed'
                            ? (language === 'hi' ? 'समाप्त' : 'Completed')
                            : (language === 'hi' ? 'रद्द' : 'Cancelled')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
};
