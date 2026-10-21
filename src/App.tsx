/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { TournamentsListView } from './views/TournamentsListView';
import { MyMatchesView } from './views/MyMatchesView';
import { LeaderboardView } from './views/LeaderboardView';
import { PlayerProfileView } from './views/PlayerProfileView';
import { AdminDashboard } from './views/AdminDashboard';
import { TournamentDetailsModal } from './components/TournamentDetailsModal';
import { RegistrationModal } from './components/RegistrationModal';
import { AuthModal } from './components/AuthModal';
import { AdminPinModal } from './components/AdminPinModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { Tournament } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    selectedTournament,
    setSelectedTournament,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
  } = useApp();

  const [registeringTournament, setRegisteringTournament] = useState<Tournament | null>(null);

  const handleOpenRegister = (tournament: Tournament) => {
    setRegisteringTournament(tournament);
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegister = () => {
    setRegisteringTournament(null);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f3f4f6] flex flex-col font-sans selection:bg-[#ff6b00] selection:text-black">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {activeTab === 'home' && (
          <HomeView
            onSelectTournament={setSelectedTournament}
            onOpenRegister={handleOpenRegister}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentsListView
            onSelectTournament={setSelectedTournament}
            onOpenRegister={handleOpenRegister}
          />
        )}

        {activeTab === 'my-matches' && <MyMatchesView />}

        {activeTab === 'leaderboard' && <LeaderboardView />}

        {activeTab === 'profile' && <PlayerProfileView />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <TournamentDetailsModal
        tournament={selectedTournament}
        onClose={() => setSelectedTournament(null)}
        onRegister={handleOpenRegister}
      />

      {isRegisterModalOpen && (
        <RegistrationModal
          tournament={registeringTournament}
          onClose={handleCloseRegister}
        />
      )}

      <AuthModal />
      <AdminPinModal />
      <FirebaseGuideModal />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
