import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Tournament,
  Registration,
  PlayerProfile,
  Announcement,
  LeaderboardEntry,
  GameMode,
  TournamentCategory,
  TournamentStatus,
  RegistrationStatus,
  SquadMember
} from '../types';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_LEADERBOARD,
  CURRENT_DEMO_PLAYER
} from '../mockData';
import { translations } from '../translations';
import {
  auth,
  db,
  loginWithGoogle,
  logoutFirebaseAuth,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: PlayerProfile | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  isAdminAuthenticated: boolean;
  adminPinError: string;
  tournaments: Tournament[];
  registrations: Registration[];
  announcements: Announcement[];
  leaderboard: LeaderboardEntry[];
  selectedTournament: Tournament | null;
  setSelectedTournament: (tournament: Tournament | null) => void;
  
  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isFirebaseGuideOpen: boolean;
  setIsFirebaseGuideOpen: (open: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  
  // Actions
  loginAsDemoPlayer: () => void;
  signInWithGoogleAccount: () => Promise<void>;
  signupPlayer: (data: {
    displayName: string;
    email: string;
    freeFireUid: string;
    freeFireIgn: string;
    phone: string;
  }) => boolean;
  updateProfile: (data: Partial<PlayerProfile>) => void;
  logoutUser: () => void;
  verifyAdminPin: (pin: string) => boolean;
  logoutAdmin: () => void;
  
  // Tournament operations
  registerForTournament: (params: {
    tournamentId: string;
    playerName: string;
    playerPhone: string;
    freeFireUid: string;
    freeFireIgn: string;
    teamName?: string;
    teamMembers?: SquadMember[];
  }) => { success: boolean; message: string };
  getUserRegistration: (tournamentId: string) => Registration | undefined;
  
  // Admin Operations
  createTournament: (tournament: Omit<Tournament, 'id' | 'createdAt' | 'registeredCount'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  cancelTournament: (id: string) => void;
  updateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => void;
  publishMatchResults: (tournamentId: string, topRankings: LeaderboardEntry[]) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'ff_arena_lang',
  USER: 'ff_arena_user',
  ADMIN_AUTH: 'ff_arena_admin_auth',
  TOURNAMENTS: 'ff_arena_tournaments',
  REGISTRATIONS: 'ff_arena_registrations',
  ANNOUNCEMENTS: 'ff_arena_announcements',
  LEADERBOARD: 'ff_arena_leaderboard',
};

// Admin email configured in rules
const ADMIN_EMAILS = ['hindimahatma0@gmail.com'];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isFirebaseGuideOpen, setIsFirebaseGuideOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // User State
  const [currentUser, setCurrentUser] = useState<PlayerProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CURRENT_DEMO_PLAYER; // Default demo player pre-logged in
  });

  // Admin state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // Tournaments
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_TOURNAMENTS;
  });

  // Registrations
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_REGISTRATIONS;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_LEADERBOARD;
  });

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // If user is verified admin email, elevate admin state
        if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
          setIsAdminAuthenticated(true);
        }

        // Try fetching user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as PlayerProfile);
          } else {
            // Create user profile for new Firebase user
            const newProfile: PlayerProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'FF_WARRIOR',
              freeFireUid: '2948201955', // Demo default UID
              freeFireIgn: user.displayName?.toUpperCase().replace(/\s+/g, '_') || 'PRO_FIGHTER',
              phone: '+91 98765 43210',
              avatarUrl: user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
              matchesPlayed: 12,
              totalKills: 48,
              totalWins: 4,
              totalEarnings: 2100,
              rank: 'Diamond III',
              level: 54,
              role: ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'player',
              joinedAt: new Date().toISOString(),
            };
            setCurrentUser(newProfile);
            try {
              await setDoc(doc(db, 'users', user.uid), newProfile);
            } catch (err) {
              // Non-blocking in demo mode
            }
          }
        } catch (error) {
          console.warn('Firestore profile sync note:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminAuthenticated));
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  }, [leaderboard]);

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  // Auth actions
  const loginAsDemoPlayer = () => {
    setCurrentUser(CURRENT_DEMO_PLAYER);
    setIsAuthModalOpen(false);
  };

  const signInWithGoogleAccount = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setIsAuthModalOpen(false);
      }
    } catch (error) {
      console.error('Google Sign-In Failed:', error);
      throw error;
    }
  };

  const signupPlayer = (data: {
    displayName: string;
    email: string;
    freeFireUid: string;
    freeFireIgn: string;
    phone: string;
  }): boolean => {
    const newPlayer: PlayerProfile = {
      id: `usr-${Date.now()}`,
      email: data.email,
      displayName: data.displayName,
      freeFireUid: data.freeFireUid.trim(),
      freeFireIgn: data.freeFireIgn.trim(),
      phone: data.phone.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.freeFireIgn)}`,
      matchesPlayed: 0,
      totalKills: 0,
      totalWins: 0,
      totalEarnings: 0,
      rank: 'Bronze I',
      level: 1,
      role: 'player',
      joinedAt: new Date().toISOString(),
    };
    setCurrentUser(newPlayer);
    setIsAuthModalOpen(false);
    return true;
  };

  const updateProfile = (data: Partial<PlayerProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);

    if (firebaseUser) {
      try {
        setDoc(doc(db, 'users', firebaseUser.uid), updated, { merge: true }).catch(() => {});
      } catch (err) {
        // Non-blocking
      }
    }
  };

  const logoutUser = () => {
    if (firebaseUser) {
      logoutFirebaseAuth().catch(() => {});
    }
    setCurrentUser(null);
  };

  const verifyAdminPin = (pin: string): boolean => {
    if (pin.trim() === '7788') {
      setIsAdminAuthenticated(true);
      setAdminPinError('');
      setIsAdminLoginModalOpen(false);
      setActiveTab('admin');
      return true;
    } else {
      setAdminPinError(language === 'hi' ? 'गलत एडमिन पिन! पुनः प्रयास करें।' : 'Invalid Admin PIN. Try again.');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
  };

  // Registration for Tournament
  const getUserRegistration = (tournamentId: string): Registration | undefined => {
    if (!currentUser) return undefined;
    return registrations.find(
      (r) => r.tournamentId === tournamentId && (r.userId === currentUser.id || r.freeFireUid === currentUser.freeFireUid)
    );
  };

  const registerForTournament = (params: {
    tournamentId: string;
    playerName: string;
    playerPhone: string;
    freeFireUid: string;
    freeFireIgn: string;
    teamName?: string;
    teamMembers?: SquadMember[];
  }): { success: boolean; message: string } => {
    const targetTournament = tournaments.find((t) => t.id === params.tournamentId);
    if (!targetTournament) {
      return { success: false, message: 'Tournament not found' };
    }

    if (targetTournament.registeredCount >= targetTournament.totalSlots) {
      return { success: false, message: 'Tournament slots are already full.' };
    }

    const existing = registrations.find(
      (r) => r.tournamentId === params.tournamentId && r.freeFireUid === params.freeFireUid.trim()
    );
    if (existing) {
      return { success: false, message: 'This Free Fire UID is already registered for this tournament.' };
    }

    const newSlotNumber = targetTournament.registeredCount + 1;
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      tournamentId: params.tournamentId,
      userId: currentUser?.id || `usr-${Date.now()}`,
      playerName: params.playerName,
      playerPhone: params.playerPhone,
      freeFireUid: params.freeFireUid.trim(),
      freeFireIgn: params.freeFireIgn.trim(),
      gameMode: targetTournament.gameMode,
      teamName: params.teamName,
      teamMembers: params.teamMembers,
      status: 'approved',
      registeredAt: new Date().toISOString(),
      slotNumber: newSlotNumber,
    };

    setRegistrations((prev) => [newReg, ...prev]);

    setTournaments((prev) =>
      prev.map((tour) =>
        tour.id === params.tournamentId
          ? { ...tour, registeredCount: tour.registeredCount + 1 }
          : tour
      )
    );

    return {
      success: true,
      message: language === 'hi'
        ? 'पंजीकरण सफल! आपका स्लॉट नंबर #' + newSlotNumber + ' है।'
        : `Registration confirmed! Your slot number is #${newSlotNumber}.`
    };
  };

  // Admin Tournament Actions
  const createTournament = (tournamentData: Omit<Tournament, 'id' | 'createdAt' | 'registeredCount'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tour-${Date.now()}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTournaments((prev) => [newTournament, ...prev]);

    // Sync to Firestore if authenticated admin
    if (firebaseUser) {
      try {
        setDoc(doc(db, 'tournaments', newTournament.id), newTournament).catch(() => {});
      } catch (err) {}
    }
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((tour) => (tour.id === id ? { ...tour, ...updates } : tour))
    );
    if (selectedTournament?.id === id) {
      setSelectedTournament((prev) => (prev ? { ...prev, ...updates } : null));
    }

    if (firebaseUser) {
      try {
        setDoc(doc(db, 'tournaments', id), updates, { merge: true }).catch(() => {});
      } catch (err) {}
    }
  };

  const cancelTournament = (id: string) => {
    updateTournament(id, { status: 'cancelled' });
  };

  const updateRegistrationStatus = (registrationId: string, status: RegistrationStatus) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === registrationId ? { ...reg, status } : reg))
    );
  };

  const publishMatchResults = (tournamentId: string, topRankings: LeaderboardEntry[]) => {
    updateTournament(tournamentId, { status: 'completed' });
    setLeaderboard((prev) => {
      const merged = [...topRankings, ...prev.filter((p) => !topRankings.some((t) => t.freeFireUid === p.freeFireUid))];
      return merged.sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
    });
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    if (firebaseUser) {
      try {
        setDoc(doc(db, 'announcements', newAnn.id), newAnn).catch(() => {});
      } catch (err) {}
    }
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const resetToDemoData = () => {
    setTournaments(INITIAL_TOURNAMENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setLeaderboard(INITIAL_LEADERBOARD);
    setCurrentUser(CURRENT_DEMO_PLAYER);
    setIsAdminAuthenticated(false);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        currentUser,
        firebaseUser,
        isAdmin: isAdminAuthenticated,
        isAdminAuthenticated,
        adminPinError,
        tournaments,
        registrations,
        announcements,
        leaderboard,
        selectedTournament,
        setSelectedTournament,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isFirebaseGuideOpen,
        setIsFirebaseGuideOpen,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        loginAsDemoPlayer,
        signInWithGoogleAccount,
        signupPlayer,
        updateProfile,
        logoutUser,
        verifyAdminPin,
        logoutAdmin,
        registerForTournament,
        getUserRegistration,
        createTournament,
        updateTournament,
        cancelTournament,
        updateRegistrationStatus,
        publishMatchResults,
        addAnnouncement,
        deleteAnnouncement,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
