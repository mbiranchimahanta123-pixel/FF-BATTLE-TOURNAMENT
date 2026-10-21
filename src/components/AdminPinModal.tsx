import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPinModal: React.FC = () => {
  const {
    language,
    t,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    verifyAdminPin,
    adminPinError,
  } = useApp();

  const [pin, setPin] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAdminPin(pin);
  };

  const handleQuickDemoAdmin = () => {
    setPin('7788');
    verifyAdminPin('7788');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-sm bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-[#ffaa00]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white uppercase tracking-tight">
                {t('adminLogin')}
              </h2>
              <span className="text-[10px] text-[#8b949e] font-mono-code uppercase">
                Restricted Access Portal
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="p-1.5 rounded-full bg-[#181b24] hover:bg-[#252834] text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {adminPinError && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adminPinError}</span>
            </div>
          )}

          <div>
            <label className="block text-[#9ca3af] mb-1.5 font-medium flex items-center justify-between">
              <span>{t('adminPassword')}</span>
              <span className="text-[10px] text-[#8b949e] font-mono-code">PIN: 4 Digits</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full h-11 pl-10 pr-3 bg-[#171a24] border border-[#2b3142] focus:border-[#ffaa00] rounded-xl text-white font-mono-code text-center text-lg tracking-widest outline-none transition-colors"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Demo Hint */}
          <div className="p-3 bg-[#141722] border border-[#262b3a] rounded-xl text-[11px] text-[#9ca3af] space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold font-mono-code">
              <KeyRound className="w-3.5 h-3.5" />
              <span>{t('adminSecretDemoHint')}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full py-1.5 bg-[#232838] hover:bg-[#2f354a] text-[#ffaa00] rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{t('quickDemoAdmin')}</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-[#ffaa00] to-[#ff6b00] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-amber-600/20"
          >
            {language === 'hi' ? 'एडमिन पैनल खोलें' : 'Unlock Admin Panel'}
          </button>
        </form>

      </div>
    </div>
  );
};
