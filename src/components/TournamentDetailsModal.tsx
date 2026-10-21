import React, { useState, useEffect } from 'react';
import { X, Trophy, Crosshair, Users, Clock, ShieldAlert, Key, Copy, Check, Info, MapPin } from 'lucide-react';
import { Tournament } from '../types';
import { useApp } from '../context/AppContext';
import { calculateTimeLeft, formatTimeLeftString } from '../utils/countdown';

interface TournamentDetailsModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onRegister: (tournament: Tournament) => void;
}

export const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
  tournament,
  onClose,
  onRegister,
}) => {
  const { language, t, currentUser, getUserRegistration } = useApp();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    tournament ? calculateTimeLeft(tournament.matchDateTime) : { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, totalSeconds: 0 }
  );

  useEffect(() => {
    if (!tournament) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(tournament.matchDateTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [tournament]);

  if (!tournament) return null;

  const userReg = getUserRegistration(tournament.id);
  const isFull = tournament.registeredCount >= tournament.totalSlots;
  const isApproved = userReg?.status === 'approved';

  const handleCopyId = () => {
    if (tournament.roomId) {
      navigator.clipboard.writeText(tournament.roomId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyPass = () => {
    if (tournament.roomPassword) {
      navigator.clipboard.writeText(tournament.roomPassword);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Visual */}
        <div className="relative h-44 sm:h-52 w-full">
          <img
            src={tournament.bannerUrl}
            alt={tournament.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-[#0f1118]/60 to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-[#cbd5e1] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Map & Mode Header Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono-code ${
                tournament.category === 'free' ? 'bg-emerald-500 text-black' : 'bg-[#ff6b00] text-black'
              }`}
            >
              {tournament.category === 'free' ? t('free') : `₹${tournament.entryFee} ${t('paid')}`}
            </span>
            <span className="px-2.5 py-1 rounded bg-black/70 text-amber-300 text-xs font-semibold font-mono-code uppercase">
              {tournament.gameMode.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded bg-black/70 text-white text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#ff6b00]" />
              {tournament.map}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {tournament.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-1 font-mono-code">
              <span>{new Date(tournament.matchDateTime).toLocaleString()}</span>
              <span>·</span>
              <span className="text-[#ffaa00] font-bold">
                {tournament.status === 'live' ? 'MATCH IN PROGRESS' : `${t('startsIn')}: ${formatTimeLeftString(timeLeft)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Room Credentials Section (Protected & Restricted) */}
          <div className="bg-[#141722] border border-[#2b3142] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#ff6b00]" />
                <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">
                  {t('roomCredentials')}
                </h3>
              </div>
              {userReg && (
                <span className="px-2 py-0.5 rounded bg-[#ff6b00]/20 text-[#ffaa00] font-mono-code text-xs font-bold">
                  {language === 'hi' ? `स्लॉट #${userReg.slotNumber}` : `Slot #${userReg.slotNumber}`}
                </span>
              )}
            </div>

            {userReg ? (
              isApproved ? (
                tournament.credentialsReleased && tournament.roomId ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                      {t('roomStatusUnlocked')}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Room ID */}
                      <div className="p-3 bg-[#0b0c10] border border-[#222736] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#8b949e] uppercase font-mono-code">
                            {t('roomId')}
                          </div>
                          <div className="text-xl font-black font-mono-code text-white tracking-widest mt-0.5">
                            {tournament.roomId}
                          </div>
                        </div>
                        <button
                          onClick={handleCopyId}
                          className="px-3 py-1.5 bg-[#232733] hover:bg-[#32384a] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{t('copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-300" />
                              <span>{t('copy')}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="p-3 bg-[#0b0c10] border border-[#222736] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#8b949e] uppercase font-mono-code">
                            {t('roomPassword')}
                          </div>
                          <div className="text-xl font-black font-mono-code text-[#ffaa00] tracking-widest mt-0.5">
                            {tournament.roomPassword}
                          </div>
                        </div>
                        <button
                          onClick={handleCopyPass}
                          className="px-3 py-1.5 bg-[#232733] hover:bg-[#32384a] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedPass ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">{t('copied')}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-300" />
                              <span>{t('copy')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#0d0f16] border border-[#232836] rounded-xl text-center space-y-2">
                    <Clock className="w-6 h-6 text-[#ffaa00] mx-auto animate-pulse" />
                    <p className="text-xs text-[#cbd5e1] font-medium">
                      {t('roomStatusLocked')}
                    </p>
                    <div className="text-xs text-[#ffaa00] font-mono-code font-bold">
                      {language === 'hi' ? 'अनुमानित रिलीज:' : 'Scheduled Unlock:'}{' '}
                      {new Date(new Date(tournament.matchDateTime).getTime() - 15 * 60000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )
              ) : (
                <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  {t('registrationPendingMsg')}
                </div>
              )
            ) : (
              <div className="p-4 bg-[#0d0f16] border border-[#232836] rounded-xl text-center space-y-2">
                <Info className="w-6 h-6 text-[#9ca3af] mx-auto" />
                <p className="text-xs text-[#9ca3af]">
                  {language === 'hi'
                    ? 'कस्टम रूम आईडी और पासवर्ड केवल पंजीकृत और स्वीकृत खिलाड़ियों को ही दिखता है।'
                    : 'Room ID & Password are strictly restricted to registered and verified players.'}
                </p>
              </div>
            )}
          </div>

          {/* Prize Distribution Grid */}
          <div>
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#ffaa00]" />
              <span>{language === 'hi' ? 'पुरस्कार विवरण' : 'Prize Pool Breakdown'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl">
                <div className="text-[10px] text-[#8b949e] uppercase">{t('firstPrize')}</div>
                <div className="font-mono-code text-base font-black text-[#ffaa00] mt-0.5">
                  ₹{tournament.firstPrize}
                </div>
              </div>
              <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl">
                <div className="text-[10px] text-[#8b949e] uppercase">{t('secondPrize')}</div>
                <div className="font-mono-code text-base font-bold text-white mt-0.5">
                  ₹{tournament.secondPrize}
                </div>
              </div>
              <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl">
                <div className="text-[10px] text-[#8b949e] uppercase">{t('thirdPrize')}</div>
                <div className="font-mono-code text-base font-bold text-white mt-0.5">
                  ₹{tournament.thirdPrize}
                </div>
              </div>
              <div className="p-3 bg-[#11131a] border border-[#232733] rounded-xl">
                <div className="text-[10px] text-[#8b949e] uppercase">{t('perKill')}</div>
                <div className="font-mono-code text-base font-bold text-emerald-400 mt-0.5">
                  ₹{tournament.perKill}
                </div>
              </div>
            </div>
          </div>

          {/* How to Join Custom Room Steps */}
          <div className="bg-[#11131a] border border-[#232733] rounded-2xl p-4">
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-3">
              {t('howToJoinRoom')}
            </h3>
            <ol className="space-y-2 text-xs text-[#cbd5e1] list-decimal list-inside">
              <li>{t('howToJoinStep1')}</li>
              <li>{t('howToJoinStep2')}</li>
              <li>{t('howToJoinStep3')}</li>
              <li>{t('howToJoinStep4')}</li>
            </ol>
          </div>

          {/* Tournament Guidelines */}
          <div className="bg-[#11131a] border border-[#232733] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-[#ef4444]">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                {t('rulesTitle')}
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs text-[#9ca3af] list-disc list-inside">
              <li>{t('rule1')}</li>
              <li>{t('rule2')}</li>
              <li>{t('rule3')}</li>
              <li>{t('rule4')}</li>
              {tournament.rules?.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-5 bg-[#0d0e14] border-t border-[#232733] flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8b949e] font-mono-code">{t('entryFee')}</span>
            <span className="font-mono-code text-lg font-black text-white">
              {tournament.category === 'free' ? t('free') : `₹${tournament.entryFee}`}
            </span>
          </div>

          {userReg ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                {language === 'hi' ? 'आप पंजीकृत हैं' : 'You are Registered'}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#232733] hover:bg-[#32384a] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>
          ) : isFull ? (
            <button
              disabled
              className="px-6 py-2.5 rounded-xl bg-[#1e222e] text-[#6b7280] font-bold text-xs uppercase cursor-not-allowed"
            >
              {t('slotsFull')}
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onRegister(tournament);
              }}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] hover:from-[#ff7914] hover:to-[#ffa61a] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 active:scale-95 transition-all cursor-pointer"
            >
              {t('registerNow')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
