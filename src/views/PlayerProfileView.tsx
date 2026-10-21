import React, { useState } from 'react';
import { User, Shield, Trophy, Crosshair, Award, Edit3, Check, X, Phone, Mail, Hash, LogOut, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isValidFreeFireUid } from '../utils/countdown';

export const PlayerProfileView: React.FC = () => {
  const {
    language,
    t,
    currentUser,
    updateProfile,
    logoutUser,
    loginAsDemoPlayer,
    setIsAuthModalOpen,
    setActiveTab,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [ign, setIgn] = useState(currentUser?.freeFireIgn || '');
  const [uid, setUid] = useState(currentUser?.freeFireUid || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#ff6b00] mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-white uppercase">
          {language === 'hi' ? 'खिलाड़ी प्रोफाइल' : 'Player Profile'}
        </h2>
        <p className="text-xs text-[#9ca3af]">
          {language === 'hi'
            ? 'अपनी फ्री फायर यूआईडी और मैच रिकॉर्ड देखने के लिए लॉग इन करें।'
            : 'Sign in to view your Free Fire stats, registered matches, and career earnings.'}
        </p>
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-orange-600/30"
          >
            {t('login')} / {t('signup')}
          </button>
          <button
            onClick={loginAsDemoPlayer}
            className="w-full h-11 rounded-xl bg-[#171a24] hover:bg-[#232733] border border-[#2b3142] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'डेमो प्रो प्लेयर के रूप में लॉगिन करें' : 'Login as Demo Pro Player'}
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ign.trim()) {
      setError(language === 'hi' ? 'कृपया अपना इन-गेम नाम दर्ज करें।' : 'IGN cannot be empty.');
      return;
    }

    if (!isValidFreeFireUid(uid)) {
      setError(
        language === 'hi'
          ? 'फ्री फायर यूआईडी में केवल 8 से 12 अंक होने चाहिए।'
          : 'Free Fire UID must be 8-12 digits.'
      );
      return;
    }

    updateProfile({
      freeFireIgn: ign.trim(),
      freeFireUid: uid.trim(),
      phone: phone.trim(),
      displayName: displayName.trim() || ign.trim(),
    });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      
      {/* Profile Card Header */}
      <div className="relative rounded-2xl md:rounded-3xl bg-[#12141c] border border-[#262b3a] p-5 sm:p-8 overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#ff6b00] bg-slate-900 object-cover shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-[#ff6b00] text-black font-mono-code font-bold text-[10px]">
                LVL {currentUser.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  {currentUser.freeFireIgn}
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code text-[11px] font-bold border border-amber-500/30">
                  {currentUser.rank}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8b949e] font-mono-code mt-1">
                <span className="text-white font-semibold">{t('ffUid')}:</span>
                <span className="text-[#ffaa00] font-bold">{currentUser.freeFireUid}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#8b949e] mt-1">
                <span>{currentUser.email}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                setIgn(currentUser.freeFireIgn);
                setUid(currentUser.freeFireUid);
                setPhone(currentUser.phone);
                setDisplayName(currentUser.displayName);
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2 rounded-xl bg-[#1e2330] hover:bg-[#2a3042] border border-[#353b4e] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>{isEditing ? t('cancel') : t('editProfile')}</span>
            </button>

            <button
              onClick={logoutUser}
              className="p-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 text-xs transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!'}</span>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-[#12141c] border border-[#ff6b00]/40 rounded-2xl p-5 space-y-4">
          <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#ff6b00]" />
            <span>{t('editProfile')}</span>
          </h3>

          {error && (
            <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-lg text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">{t('ffIgn')}</label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white outline-none focus:border-[#ff6b00]"
                required
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">{t('ffUid')} (8-12 digits)</label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                maxLength={12}
                className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white font-mono-code outline-none focus:border-[#ff6b00]"
                required
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">{t('phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white outline-none focus:border-[#ff6b00]"
                required
              />
            </div>
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">{language === 'hi' ? 'डिस्प्ले नाम' : 'Display Name'}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-10 px-3 bg-[#191d29] border border-[#2b3142] rounded-lg text-white outline-none focus:border-[#ff6b00]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-[#1e2330] rounded-xl text-xs text-[#9ca3af]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ff6b00] hover:bg-[#ff8526] text-black font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
            >
              {t('saveChanges')}
            </button>
          </div>
        </form>
      )}

      {/* Career Stats Grid */}
      <div>
        <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider mb-3">
          {t('playerStats')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-2">
              <span className="text-xs uppercase">{t('matchesPlayed')}</span>
              <Trophy className="w-4 h-4 text-[#ffaa00]" />
            </div>
            <div className="font-mono-code text-2xl font-black text-white tabular-nums">
              {currentUser.matchesPlayed}
            </div>
          </div>

          <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-2">
              <span className="text-xs uppercase">{t('totalWins')}</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono-code text-2xl font-black text-emerald-400 tabular-nums">
              {currentUser.totalWins}
            </div>
          </div>

          <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-2">
              <span className="text-xs uppercase">{t('totalKills')}</span>
              <Crosshair className="w-4 h-4 text-[#ff6b00]" />
            </div>
            <div className="font-mono-code text-2xl font-black text-white tabular-nums">
              {currentUser.totalKills}
            </div>
          </div>

          <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b949e] mb-2">
              <span className="text-xs uppercase">{t('totalEarnings')}</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono-code text-2xl font-black text-[#ffaa00] tabular-nums">
              ₹{currentUser.totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Account Verification & Security details */}
      <div className="p-4 bg-[#11131a] border border-[#232733] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="font-bold text-white uppercase font-mono-code">
            {language === 'hi' ? 'ईस्पोर्ट्स सत्यापन स्थिति' : 'Esports Player Verification'}
          </div>
          <div className="text-[#8b949e] mt-0.5">
            {language === 'hi'
              ? 'फ्री फायर यूआईडी डेटाबेस से जुड़ी है। आपके पंजीकृत मैचों का परिणाम स्वचालित दर्ज होगा।'
              : 'Linked to Free Fire UID. Verified match results update career statistics automatically.'}
          </div>
        </div>

        <button
          onClick={() => setActiveTab('my-matches')}
          className="px-4 py-2 bg-[#1a1e2b] hover:bg-[#252b3d] text-white rounded-xl font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          {t('myTournaments')}
        </button>
      </div>

    </div>
  );
};
