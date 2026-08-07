'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { BootSequence } from '@/components/BootSequence';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Wheel } from '@/components/Wheel';
import { CharacterReveal } from '@/components/CharacterReveal';
import { ChatInterface } from '@/components/ChatInterface';
import { MissionHistory } from '@/components/MissionHistory';
import { AboutModal } from '@/components/AboutModal';
import { AuthModal } from '@/components/AuthModal';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { MarvelCharacter, HistoryEntry, MARVEL_CHARACTERS, CharacterId } from '@/types/marvel';
import { ShieldUser, updateShieldUserActivity } from '@/utils/supabase';

type AppState = 'boot' | 'home' | 'spin' | 'reveal' | 'chat';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [appState, setAppState] = useState<AppState>('boot');
  const [selectedCharacter, setSelectedCharacter] = useState<MarvelCharacter | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Authentication & Subscription State
  const [currentUser, setCurrentUser] = useState<ShieldUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedUser = localStorage.getItem('shield_current_session');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Load Mission History from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('marvel_mission_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Save to localStorage whenever history updates
  const addHistoryEntry = (character: MarvelCharacter) => {
    const newEntry: HistoryEntry = {
      id: `spin-${Date.now()}`,
      characterId: character.id,
      characterName: character.name,
      timestamp: Date.now(),
      isLegendary: character.isLegendary,
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('marvel_mission_history', JSON.stringify(updated));
      } catch {
        // Fallback
      }
      return updated;
    });

    if (currentUser) {
      updateShieldUserActivity(currentUser.email, character.name);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('marvel_mission_history');
    } catch {
      // Fallback
    }
  };

  const handleSpinComplete = (character: MarvelCharacter) => {
    setSelectedCharacter(character);
    addHistoryEntry(character);
    setAppState('reveal');
  };

  const handleSelectFromHistory = (characterId: CharacterId) => {
    const char = MARVEL_CHARACTERS[characterId];
    if (char) {
      setSelectedCharacter(char);
      setAppState('chat');
    }
  };

  // Auth check on entering HQ - Compulsory Sign Up / Login Modal
  const handleEnterHQ = () => {
    if (currentUser) {
      setAppState('spin');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = (user: ShieldUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('shield_current_session', JSON.stringify(user));
    } catch {
      // Fallback
    }
    setIsAuthOpen(false);
    setAppState('spin');
  };

  const handleSubSuccess = (updatedUser: ShieldUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('shield_current_session', JSON.stringify(updatedUser));
    } catch {
      // Fallback
    }
    setIsSubModalOpen(false);
  };

  return (
    <main className="relative min-h-screen bg-marvel-darker text-gray-100 flex flex-col justify-between overflow-x-hidden selection:bg-marvel-red selection:text-white">
      {/* Background Particles & Grid */}
      <BackgroundEffects />

      {/* Boot Terminal Sequence */}
      <AnimatePresence>
        {appState === 'boot' && (
          <BootSequence onComplete={() => setAppState('home')} />
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      {appState !== 'boot' && (
        <Navbar
          currentTab={appState === 'home' ? 'home' : appState === 'chat' ? 'chat' : 'spin'}
          onNavigate={(tab) => {
            if (tab === 'home') setAppState('home');
            if (tab === 'spin') handleEnterHQ();
            if (tab === 'chat' && selectedCharacter) setAppState('chat');
          }}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          selectedCharacterName={selectedCharacter?.name}
        />
      )}

      {/* Main View Container */}
      {appState !== 'boot' && (
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {appState === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HeroSection onEnterHQ={handleEnterHQ} />
              </motion.div>
            )}

            {appState === 'spin' && (
              <motion.div
                key="spin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-4xl mx-auto px-4 py-8 text-center"
              >
                <div className="mb-4">
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-wider text-white">
                    AVENGERS ROULETTE WHEEL
                  </h2>
                  <p className="text-sm font-mono text-gray-400 mt-1">
                    Logged in as <span className="text-marvel-gold font-bold">{currentUser?.name || 'S.H.I.E.L.D. Agent'}</span> ({currentUser?.agentId || 'Level 7'}). {currentUser?.isSubscribed ? <span className="text-emerald-400 font-bold">[PRO UNLIMITED ACCESS]</span> : <span className="text-amber-400">[2 FREE MESSAGES TRIAL]</span>}
                  </p>
                </div>

                <Wheel onSpinComplete={handleSpinComplete} />
              </motion.div>
            )}

            {appState === 'reveal' && selectedCharacter && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[calc(100vh-5rem)]"
              >
                <CharacterReveal
                  character={selectedCharacter}
                  onTalkToHero={() => setAppState('chat')}
                  onSpinAgain={() => setAppState('spin')}
                />
              </motion.div>
            )}

            {appState === 'chat' && selectedCharacter && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex-1 flex flex-col items-center"
              >
                <ChatInterface
                  character={selectedCharacter}
                  currentUser={currentUser}
                  onSpinAgain={() => setAppState('spin')}
                  onOpenSubscription={() => setIsSubModalOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Compulsory S.H.I.E.L.D. Clearance Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* S.H.I.E.L.D. Unlimited Pass Razorpay Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        currentUser={currentUser}
        onSuccess={handleSubSuccess}
      />

      {/* Mission History Modal */}
      <MissionHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHeroFromHistory={handleSelectFromHistory}
      />

      {/* About Specs Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      {appState !== 'boot' && (
        <footer className="relative z-10 border-t border-marvel-border/40 bg-marvel-darker/90 py-4 text-center text-xs font-mono text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              MARVEL AI COMMAND CENTER &copy; {new Date().getFullYear()} — Powered by Google Gemini AI & Razorpay
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <span className="hover:text-marvel-red cursor-pointer" onClick={() => setIsAboutOpen(true)}>Specs</span>
              <span>•</span>
              <span className="hover:text-marvel-gold cursor-pointer" onClick={() => setIsHistoryOpen(true)}>History</span>
              <span>•</span>
              <span className="text-emerald-400">● 7/7 Heroes Active</span>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
