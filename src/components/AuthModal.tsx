import React, { useState } from 'react';
import { X, User, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isValidFreeFireUid } from '../utils/countdown';

export const AuthModal: React.FC = () => {
  const {
    language,
    t,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginAsDemoPlayer,
    signInWithGoogleAccount,
    signupPlayer,
  } = useApp();

  const [displayName, setDisplayName] = useState('');
  const [ign, setIgn] = useState('');
  const [uid, setUid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ign.trim()) {
      setError(language === 'hi' ? 'कृपया अपना इन-गेम नाम दर्ज करें।' : 'Please enter your Free Fire In-Game Name (IGN).');
      return;
    }

    if (!isValidFreeFireUid(uid)) {
      setError(
        language === 'hi'
          ? 'फ्री फायर यूआईडी में केवल 8 से 12 अंक होने चाहिए।'
          : 'Free Fire UID must be numeric (8 to 12 digits).'
      );
      return;
    }

    if (!phone.trim()) {
      setError(language === 'hi' ? 'कृपया फोन / व्हाट्सएप नंबर दर्ज करें।' : 'Please enter your phone number.');
      return;
    }

    const success = signupPlayer({
      displayName: displayName.trim() || ign.trim(),
      email: email.trim() || `${ign.toLowerCase().replace(/\s+/g, '')}@player.ff`,
      freeFireUid: uid.trim(),
      freeFireIgn: ign.trim(),
      phone: phone.trim(),
    });

    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff4500] to-[#ffaa00] flex items-center justify-center">
              <Flame className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tight">
                {authModalMode === 'login' ? t('login') : t('signup')}
              </h2>
              <span className="text-[10px] text-[#8b949e] font-mono-code uppercase">
                Free Fire Esports Profile
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full bg-[#181b24] hover:bg-[#252834] text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-[#151722] border border-[#232733] rounded-xl my-4 text-xs font-semibold">
          <button
            onClick={() => setAuthModalMode('login')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              authModalMode === 'login' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af]'
            }`}
          >
            {t('login')}
          </button>
          <button
            onClick={() => setAuthModalMode('signup')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              authModalMode === 'signup' ? 'bg-[#ff6b00] text-black font-bold' : 'text-[#9ca3af]'
            }`}
          >
            {t('signup')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {authModalMode === 'login' ? (
          <div className="space-y-4">
            {/* Google Firebase Auth Sign In */}
            <button
              onClick={async () => {
                try {
                  await signInWithGoogleAccount();
                } catch (err: any) {
                  setError(err?.message || 'Google Sign-In failed');
                }
              }}
              className="w-full h-11 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{language === 'hi' ? 'गूगल से लॉगिन करें (Firebase)' : 'Sign In with Google (Firebase)'}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#232733]"></div>
              <span className="flex-shrink mx-3 text-[10px] text-[#8b949e] uppercase font-mono-code">
                {language === 'hi' ? 'या' : 'OR'}
              </span>
              <div className="flex-grow border-t border-[#232733]"></div>
            </div>

            <div className="p-4 bg-[#141722] border border-[#262b3a] rounded-2xl text-center space-y-2">
              <User className="w-8 h-8 text-[#ff6b00] mx-auto" />
              <h3 className="font-heading text-base font-bold text-white uppercase">
                {language === 'hi' ? 'तुरंत डेमो प्लेयर लॉगिन' : 'Instant Player Account'}
              </h3>
              <p className="text-xs text-[#9ca3af]">
                {language === 'hi'
                  ? 'पहले से तैयार डेमो प्लेयर (PRO_WARRIOR_07, Heroic Rank, UID: 2948201955) से लॉगिन करें।'
                  : 'Log in with our pre-configured demo pro player profile with verified Free Fire UID and match history.'}
              </p>
              <button
                onClick={loginAsDemoPlayer}
                className="w-full h-11 bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-orange-600/30"
              >
                {language === 'hi' ? 'डेमो अकाउंट से लॉगिन करें' : 'Login as Demo Player'}
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-[#8b949e]">
                {language === 'hi' ? 'नया खिलाड़ी हैं?' : "Don't have an account?"}{' '}
              </span>
              <button
                onClick={() => setAuthModalMode('signup')}
                className="text-xs text-[#ffaa00] font-bold hover:underline cursor-pointer"
              >
                {t('signup')}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {t('ffIgn')} <span className="text-[#ff6b00]">*</span>
              </label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="e.g. 『PRO』WARRIOR"
                className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none focus:border-[#ff6b00]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {t('ffUid')} <span className="text-[#ff6b00]">* (8-12 digits)</span>
              </label>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2948201955"
                maxLength={12}
                className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white font-mono-code outline-none focus:border-[#ff6b00]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">
                {t('phone')} <span className="text-[#ff6b00]">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none focus:border-[#ff6b00]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] mb-1 font-medium">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="player@gmail.com"
                className="w-full h-10 px-3 bg-[#171a24] border border-[#2b3142] rounded-xl text-white outline-none focus:border-[#ff6b00]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 bg-gradient-to-r from-[#ff6b00] to-[#ff9900] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-orange-600/30"
            >
              {language === 'hi' ? 'अकाउंट बनाएं और खेलें' : 'Create Account & Play'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
