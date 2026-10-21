export type Language = 'en' | 'hi';

export type GameMode = 'solo' | 'duo' | 'squad';
export type TournamentCategory = 'free' | 'paid';
export type TournamentStatus = 'upcoming' | 'open' | 'live' | 'completed' | 'cancelled';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface SquadMember {
  ign: string;
  uid: string;
}

export interface Tournament {
  id: string;
  title: string;
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';
  gameMode: GameMode;
  category: TournamentCategory;
  entryFee: number;
  prizePool: number;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
  perKill: number;
  matchDateTime: string; // ISO String
  totalSlots: number;
  registeredCount: number;
  status: TournamentStatus;
  roomId?: string;
  roomPassword?: string;
  credentialsReleased: boolean;
  version: 'Battle Royale' | 'Clash Squad';
  rules: string[];
  bannerUrl: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  userId: string;
  playerName: string;
  playerPhone: string;
  freeFireUid: string;
  freeFireIgn: string;
  gameMode: GameMode;
  teamName?: string;
  teamMembers?: SquadMember[];
  status: RegistrationStatus;
  registeredAt: string;
  slotNumber: number;
}

export interface PlayerProfile {
  id: string;
  email: string;
  displayName: string;
  freeFireUid: string;
  freeFireIgn: string;
  phone: string;
  avatarUrl: string;
  matchesPlayed: number;
  totalKills: number;
  totalWins: number;
  totalEarnings: number;
  rank: string;
  level: number;
  role: 'player' | 'admin';
  joinedAt: string;
}

export interface Announcement {
  id: string;
  titleEn: string;
  titleHi: string;
  messageEn: string;
  messageHi: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
  pinned: boolean;
  tournamentId?: string;
}

export interface LeaderboardEntry {
  id: string;
  tournamentId?: string;
  rank: number;
  playerName: string;
  freeFireUid: string;
  kills: number;
  matches: number;
  wins: number;
  points: number;
  prizeWon: number;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface MatchResult {
  tournamentId: string;
  published: boolean;
  publishedAt: string;
  mvp: {
    ign: string;
    uid: string;
    kills: number;
  };
  rankings: {
    rank: number;
    teamOrPlayerName: string;
    uid: string;
    kills: number;
    points: number;
    prize: number;
  }[];
}
