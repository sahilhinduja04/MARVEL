'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, ChevronRight, Zap, Flame } from 'lucide-react';
import { soundFx } from '@/utils/audio';

interface HeroSectionProps {
  onEnterHQ: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterHQ }) => {
  const handleClick = () => {
    soundFx.playSpinStart();
    onEnterHQ();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center relative px-4 py-12 text-center"
    >
      {/* Background Subtle Arc Reactor Beam */}
      <div className="absolute w-96 h-96 rounded-full bg-marvel-red/10 blur-[100px] pointer-events-none -z-10 animate-pulse" />
      
      {/* Top Tactical Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-marvel-red/15 border border-marvel-red/40 text-marvel-red text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(230,36,41,0.3)]"
      >
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>S.H.I.E.L.D. MULTIVERSE AI PROTOCOL</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white max-w-4xl leading-none uppercase"
      >
        MARVEL AI: <br />
        <span className="bg-gradient-to-r from-marvel-red via-amber-400 to-marvel-gold bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(230,36,41,0.6)]">
          CHOOSE YOUR AVENGER
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg sm:text-2xl text-gray-300 font-sans max-w-2xl font-light tracking-wide"
      >
        Spin the wheel. Discover your hero. Talk to them.
      </motion.p>

      {/* Hero Showcase Grid Cards Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 grid grid-cols-4 sm:grid-cols-7 gap-3 max-w-3xl w-full"
      >
        {[
          { name: 'Hulk', color: 'border-green-500/50 bg-green-950/40 text-green-400', icon: '✊' },
          { name: 'Iron Man', color: 'border-amber-500/50 bg-amber-950/40 text-amber-400', icon: '⚡', legendary: true },
          { name: 'Captain America', color: 'border-blue-500/50 bg-blue-950/40 text-blue-400', icon: '🛡️' },
          { name: 'Hawkeye', color: 'border-purple-500/50 bg-purple-950/40 text-purple-400', icon: '🎯' },
          { name: 'Black Widow', color: 'border-red-500/50 bg-red-950/40 text-red-400', icon: '🕷️' },
          { name: 'Spider-Man', color: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400', icon: '🕸️' },
          { name: 'Black Panther', color: 'border-violet-500/50 bg-violet-950/40 text-violet-400', icon: '🐾' },
        ].map((hero, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border backdrop-blur-md flex flex-col items-center justify-center hover:scale-105 transition-transform ${hero.color}`}
          >
            <span className="text-xl mb-1">{hero.icon}</span>
            <span className="text-[10px] font-mono uppercase tracking-tighter truncate w-full text-center">
              {hero.name}
            </span>
            {hero.legendary && (
              <span className="text-[8px] font-bold text-amber-300 bg-amber-500/30 px-1 rounded mt-0.5">
                4% RARE
              </span>
            )}
          </div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <button
          onClick={handleClick}
          className="group relative inline-flex items-center justify-center px-10 py-5 rounded-2xl font-display text-xl font-bold uppercase tracking-wider text-white overflow-hidden shadow-[0_0_40px_rgba(230,36,41,0.5)] transition-all hover:shadow-[0_0_70px_rgba(230,36,41,0.9)] hover:scale-105 active:scale-95"
        >
          {/* Animated Glow Border */}
          <span className="absolute inset-0 bg-gradient-to-r from-marvel-red via-amber-500 to-marvel-red rounded-2xl animate-pulse" />
          <span className="absolute inset-[2px] bg-marvel-darker rounded-[14px]" />
          
          <span className="relative flex items-center space-x-3 bg-gradient-to-r from-red-600 to-marvel-red px-6 py-2 rounded-xl">
            <Zap className="w-6 h-6 text-marvel-gold animate-bounce" />
            <span>ENTER THE AVENGERS HQ</span>
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};
