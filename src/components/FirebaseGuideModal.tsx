import React, { useState } from 'react';
import { X, Database, ShieldCheck, Key, FileCode, Check, Copy, ExternalLink, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FirebaseGuideModal: React.FC = () => {
  const { language, t, isFirebaseGuideOpen, setIsFirebaseGuideOpen } = useApp();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isFirebaseGuideOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sampleConfig = `{
  "apiKey": "AIzaSy...",
  "authDomain": "ff-battle-arena.firebaseapp.com",
  "projectId": "ff-battle-arena",
  "storageBucket": "ff-battle-arena.appspot.com",
  "messagingSenderId": "...",
  "appId": "..."
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1118] border border-[#2b3142] rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 my-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#232733]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#ffaa00]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white uppercase tracking-tight">
                {t('setupFirebaseTitle')}
              </h2>
              <span className="text-[11px] text-[#8b949e] font-mono-code">
                Cloud Firestore · Firebase Auth · ABAC Security Rules
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsFirebaseGuideOpen(false)}
            className="p-1.5 rounded-full bg-[#181b24] hover:bg-[#252834] text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-6 text-xs text-[#cbd5e1]">
          
          {/* Overview Callout */}
          <div className="p-4 bg-[#141722] border border-[#262b3a] rounded-xl space-y-2">
            <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ff6b00]" />
              <span>Production Architecture Overview</span>
            </h3>
            <p className="text-xs text-[#9ca3af]">
              {language === 'hi'
                ? 'FF बैटल अरीना को क्लाउड फायरस्टोर और फायरबेस ऑथेंटिकेशन के साथ पूर्णतः एकीकृत करने के लिए सुरक्षा नियम, मध्यवर्ती ब्लूप्रिंट और सख्त भूमिका-आधारित नियम (ABAC) तैयार किए गए हैं।'
                : 'FF BATTLE ARENA is engineered with production-ready Cloud Firestore schemas, zero-trust security rules, and role-based access control protecting room credentials and player information.'}
            </p>
          </div>

          {/* Step 1: Security Rules */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5 font-mono-code">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Hardened Firestore Security Rules (`firestore.rules`)</span>
              </span>
              <button
                onClick={() => copyText('firestore.rules', 'rules')}
                className="text-[11px] text-[#ffaa00] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'rules' ? 'Copied' : 'Rule Reference'}</span>
              </button>
            </div>
            <p className="text-[#9ca3af]">
              The security rules implement the Eight Pillars of Zero-Trust Security:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#8b949e]">
              <li><strong>Room Credential Shielding:</strong> Room ID & Password are protected from non-participants and only viewable by approved players.</li>
              <li><strong>Player Information Protection:</strong> Phone numbers & private UIDs are isolated.</li>
              <li><strong>Role Escalation Guard:</strong> Self-assignment of admin role is strictly blocked.</li>
              <li><strong>Strict UID Validation:</strong> Regex guard enforces 8-12 numeric digits on Free Fire UIDs.</li>
            </ul>
          </div>

          {/* Step 2: Intermediate Blueprint */}
          <div className="space-y-2">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5 font-mono-code">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Intermediate Blueprint (`firebase-blueprint.json`)</span>
            </span>
            <p className="text-[#9ca3af]">
              Specifies the exact collection paths:
            </p>
            <div className="p-3 bg-[#0a0c10] border border-[#1e222e] rounded-xl font-mono-code text-[11px] space-y-1 text-slate-300">
              <div>/tournaments/{'{tournamentId}'}</div>
              <div>/tournaments/{'{tournamentId}'}/registrations/{'{registrationId}'}</div>
              <div>/users/{'{userId}'}</div>
              <div>/announcements/{'{announcementId}'}</div>
              <div>/leaderboard/{'{entryId}'}</div>
            </div>
          </div>

          {/* Step 3: Firebase Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5 font-mono-code">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                <span>3. Live Firebase Configuration</span>
              </span>
              <button
                onClick={() => copyText(sampleConfig, 'config')}
                className="text-[11px] text-[#ffaa00] hover:underline flex items-center gap-1"
              >
                {copiedSection === 'config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'config' ? 'Copied' : 'Copy Sample'}</span>
              </button>
            </div>
            <p className="text-[#9ca3af]">
              To enable live cloud persistence, place your Firebase project credentials in <code>firebase-applet-config.json</code> in the project root. The applet automatically detects live credentials and switches from demo cache to real-time Firestore sync.
            </p>
          </div>

          {/* Step 4: Admin PIN */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
            <div className="font-bold text-amber-300 font-mono-code">
              Admin Access & Security Credentials:
            </div>
            <div className="text-[#cbd5e1]">
              Demo security PIN: <strong className="text-white font-mono-code">7788</strong>. In production, admin credentials are tied to verified Google Workspace email tokens and trusted admin collection documents.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#232733] flex justify-end">
          <button
            onClick={() => setIsFirebaseGuideOpen(false)}
            className="px-5 py-2 bg-[#ff6b00] hover:bg-[#ff8526] text-black font-extrabold text-xs uppercase rounded-xl transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'समझ गया' : 'Got It'}
          </button>
        </div>

      </div>
    </div>
  );
};
