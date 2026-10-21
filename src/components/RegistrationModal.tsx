import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Users, Crosshair, Shield } from 'lucide-react';
import { Tournament, SquadMember } from '../types';
import { useApp } from '../context/AppContext';
import { isValidFreeFireUid } from '../utils/countdown';

interface RegistrationModalProps {
  tournament: Tournament | null;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ tournament, onClose }) => {
  const { language, t, currentUser, registerForTournament, setSelectedTournament } = useApp();

  const [ign, setIgn] = useState(currentUser?.freeFireIgn || '');
  const [uid, setUid] = useState(currentUser?.freeFireUid || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [teamName, setTeamName] = useState('');
  
  // Teammates for Duo or Squad
  const [teammates, setTeammates] = useState<SquadMember[]>(() => {
    if (tournament?.gameMode === 'duo') {
      return [{ ign: '', uid: '' }];
    }
    if (tournament?.gameMode === 'squad') {
      return [
        { ign: '', uid: '' },
        { ign: '', uid: '' },
        { ign: '', uid: '' },
      ];
    }
    return [];
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tournament) return null;

  const handleTeammateChange = (index: number, field: 'ign' | 'uid', value: string) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ign.trim()) {
      setError(language === 'hi' ? 'कृपया अपना इन-गेम नाम (IGN) दर्ज करें।' : 'Please enter your In-Game Name (IGN).');
      return;
    }

    if (!isValidFreeFireUid(uid)) {
      setError(
        language === 'hi'
          ? 'फ्री फायर यूआईडी में केवल 8 से 12 अंक होने चाहिए।'
          : 'Free Fire UID must contain exactly 8 to 12 digits.'
      );
      return;
    }

    if (!phone.trim()) {
      setError(language === 'hi' ? 'कृपया अपना फोन / व्हाट्सएप नंबर दर्ज करें।' : 'Please provide WhatsApp/Phone number for notifications.');
      return;
    }

    if (tournament.gameMode !== 'solo') {
      if (!teamName.trim()) {
        setError(language === 'hi' ? 'कृपया टीम या क्लैन का नाम दर्ज करें।' : 'Please enter your Team/Clan Name.');
        return;
      }

      for (let i = 0; i < teammates.length; i++) {
        const member = teammates[i];
        if (!member.ign.trim()) {
          setError(
            language === 'hi'
              ? `खिलाड़ी ${i + 2} का IGN दर्ज करें।`
              : `Please enter IGN for Teammate #${i + 2}.`
          );
          return;
        }
        if (!isValidFreeFireUid(member.uid)) {
          setError(
            language === 'hi'
              ? `खिलाड़ी ${i + 2} की FF UID अमान्य है (8-12 अंक)।`
              : `Invalid Free Fire UID for Teammate #${i + 2} (must be 8-12 digits).`
          );
          return;
        }
      }
    }

    setIsSubmitting(true);

    const res = registerForTournament({
      tournamentId: tournament.id,
      playerName: currentUser?.displayName || ign,
      playerPhone: phone,
      freeFireUid: uid,
      freeFireIgn: ign,
      teamName: tournament.gameMode !== 'solo' ? teamName : undefined,
      teamMembers: tournament.gameMode !== 'solo' ? teammates : undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setSelectedTournament(tournament);
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#232733] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#ffaa00] font-mono-code uppercase">
              <Crosshair className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>{tournament.gameMode.toUpperCase()} {t('tournaments')}</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-0.5">
              {t('registerNow')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#181b24] hover:bg-[#252834] text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Captain / Primary Player Section */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#ff6b00]" />
              <span>{tournament.gameMode === 'solo' ? t('player') : (language === 'hi' ? 'कप्तान विवरण' : 'Captain Details')}</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                {t('ffIgn')} <span className="text-[#ff6b00]">*</span>
              </label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="e.g. 『PRO』WARRIOR"
                className="w-full h-11 px-3.5 bg-[#141722] border border-[#2b3142] focus:border-[#ff6b00] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                  {t('ffUid')} <span className="text-[#ff6b00]">* (8-12 digits)</span>
                </label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 2948201955"
                  maxLength={12}
                  className="w-full h-11 px-3.5 bg-[#141722] border border-[#2b3142] focus:border-[#ff6b00] rounded-xl text-xs sm:text-sm text-white font-mono-code placeholder-slate-500 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                  {t('phone')} <span className="text-[#ff6b00]">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full h-11 px-3.5 bg-[#141722] border border-[#2b3142] focus:border-[#ff6b00] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Duo / Squad Fields */}
          {tournament.gameMode !== 'solo' && (
            <div className="space-y-4 pt-3 border-t border-[#232733]">
              <div>
                <label className="block text-[11px] font-medium text-[#9ca3af] mb-1">
                  {t('teamName')} <span className="text-[#ff6b00]">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. ROYAL STRIKERS ESPORTS"
                  className="w-full h-11 px-3.5 bg-[#141722] border border-[#2b3142] focus:border-[#ff6b00] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ffaa00]" />
                  <span>{t('teammateDetails')}</span>
                </div>

                {teammates.map((teammate, idx) => (
                  <div key={idx} className="p-3 bg-[#11131a] border border-[#232733] rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-[#ffaa00] uppercase font-mono-code">
                      {language === 'hi' ? `खिलाड़ी #${idx + 2}` : `Teammate #${idx + 2}`}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={teammate.ign}
                        onChange={(e) => handleTeammateChange(idx, 'ign', e.target.value)}
                        placeholder={`${t('playerIgn')} #${idx + 2}`}
                        className="h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-lg text-xs text-white placeholder-slate-500 outline-none"
                        required
                      />
                      <input
                        type="text"
                        value={teammate.uid}
                        onChange={(e) => handleTeammateChange(idx, 'uid', e.target.value.replace(/\D/g, ''))}
                        placeholder={`${t('playerUid')} (8-12 digits)`}
                        maxLength={12}
                        className="h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-lg text-xs text-white font-mono-code placeholder-slate-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guidelines acknowledgement */}
          <div className="p-3 bg-[#12141c] border border-[#222736] rounded-xl text-[11px] text-[#9ca3af]">
            <p>
              {language === 'hi'
                ? 'पंजीकरण करके आप निष्पक्ष खेल और एंटी-चीट नियमों से सहमत होते हैं।'
                : 'By registering, you agree to official tournament rules and anti-hack terms.'}
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1e222e] hover:bg-[#282d3d] text-xs font-semibold text-[#cbd5e1] transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] hover:from-[#ff7914] hover:to-[#ffa61a] text-black font-extrabold text-xs uppercase tracking-wider shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (language === 'hi' ? 'दर्ज हो रहा है...' : 'Registering...') : t('registerNow')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
