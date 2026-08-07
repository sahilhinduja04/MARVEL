'use client';

import React, { useState } from 'react';
import { Shield, History, Info, RotateCw, Menu, X, Sparkles } from 'lucide-react';
import { soundFx } from '@/utils/audio';

interface NavbarProps {
  currentTab: 'home' | 'spin' | 'chat';
  onNavigate: (tab: 'home' | 'spin' | 'chat') => void;
  onOpenHistory: () => void;
  onOpenAbout: () => void;
  selectedCharacterName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenHistory,
  onOpenAbout,
  selectedCharacterName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: 'home' | 'spin' | 'chat') => {
    soundFx.playClick();
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-marvel-red/20 bg-marvel-darker/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNav('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-marvel-red to-red-950 p-[1px] shadow-[0_0_15px_rgba(230,36,41,0.5)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-marvel-darker rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-marvel-red group-hover:text-red-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-widest text-lg text-white font-display">
                MARVEL <span className="text-marvel-red">AI</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-marvel-red/20 border border-marvel-red/40 text-marvel-red font-mono font-semibold uppercase">
                V2.5 HQ
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AVENGERS HQ ONLINE</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 font-mono text-sm">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              currentTab === 'home'
                ? 'text-marvel-red bg-marvel-red/10 border border-marvel-red/40 font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            HOME
          </button>
          
          <button
            onClick={() => handleNav('spin')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-2 ${
              currentTab === 'spin'
                ? 'text-marvel-gold bg-marvel-gold/10 border border-marvel-gold/40 font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <RotateCw className="w-4 h-4 text-marvel-gold" />
            <span>ROULETTE WHEEL</span>
          </button>

          {selectedCharacterName && (
            <button
              onClick={() => handleNav('chat')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                currentTab === 'chat'
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/40 font-bold'
                  : 'text-gray-300 hover:text-cyan-400 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{selectedCharacterName.toUpperCase()} CHAT</span>
            </button>
          )}

          <div className="h-4 w-[1px] bg-gray-800" />

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenHistory();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-gray-300 hover:text-marvel-red hover:bg-marvel-red/10 transition-all border border-transparent hover:border-marvel-red/30"
          >
            <History className="w-4 h-4 text-marvel-red" />
            <span>MISSION HISTORY</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAbout();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>ABOUT</span>
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-lg bg-marvel-card border border-marvel-border text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-marvel-red/30 bg-marvel-darker/95 backdrop-blur-2xl px-4 py-4 space-y-3 font-mono">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-2.5 rounded-lg border ${
              currentTab === 'home' ? 'bg-marvel-red/20 border-marvel-red text-marvel-red font-bold' : 'border-marvel-border text-gray-300'
            }`}
          >
            HOME
          </button>

          <button
            onClick={() => handleNav('spin')}
            className={`w-full text-left px-4 py-2.5 rounded-lg border flex items-center space-x-2 ${
              currentTab === 'spin' ? 'bg-marvel-gold/20 border-marvel-gold text-marvel-gold font-bold' : 'border-marvel-border text-gray-300'
            }`}
          >
            <RotateCw className="w-4 h-4 text-marvel-gold" />
            <span>ROULETTE WHEEL</span>
          </button>

          {selectedCharacterName && (
            <button
              onClick={() => handleNav('chat')}
              className={`w-full text-left px-4 py-2.5 rounded-lg border flex items-center space-x-2 ${
                currentTab === 'chat' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 font-bold' : 'border-marvel-border text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{selectedCharacterName.toUpperCase()} CHAT</span>
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenHistory();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg border border-marvel-border text-gray-300 flex items-center space-x-2"
          >
            <History className="w-4 h-4 text-marvel-red" />
            <span>MISSION HISTORY</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg border border-marvel-border text-gray-300 flex items-center space-x-2"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>ABOUT AVENGERS HQ</span>
          </button>
        </div>
      )}
    </header>
  );
};
