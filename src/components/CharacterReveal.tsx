'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MarvelCharacter } from '@/types/marvel';
import { soundFx } from '@/utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, MessageSquare, Zap, Shield, Award } from 'lucide-react';

interface CharacterRevealProps {
  character: MarvelCharacter;
  onTalkToHero: () => void;
  onSpinAgain: () => void;
}

export const CharacterReveal: React.FC<CharacterRevealProps> = ({
  character,
  onTalkToHero,
  onSpinAgain,
}) => {
  useEffect(() => {
    if (character.isLegendary) {
      // Trigger legendary confetti burst
      import('canvas-confetti').then((confettiModule) => {
        confettiModule.default({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f3d053', '#e62429', '#ffffff', '#ffd700'],
        });
      });
    }
  }, [character]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, type: 'spring', damping: 20 }}
      className="max-w-2xl w-full mx-auto p-4 sm:p-6"
    >
      <div
        className={`relative overflow-hidden rounded-3xl border-2 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl text-center ${
          character.isLegendary
            ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/80 via-red-950/90 to-black shadow-[0_0_80px_rgba(243,208,83,0.5)]'
            : 'border-marvel-red/40 bg-gradient-to-b from-marvel-card via-marvel-dark to-black shadow-[0_0_50px_rgba(230,36,41,0.3)]'
        }`}
      >
        {/* Background Energy Pulse */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[90px] pointer-events-none opacity-40"
          style={{ backgroundColor: character.accentHex }}
        />

        {/* Special Legendary Header for Iron Man */}
        {character.isLegendary ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-mono text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(243,208,83,0.8)] animate-pulse"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold">★ LEGENDARY UNLOCK: YOU FOUND IRON MAN ★</span>
          </motion.div>
        ) : (
          <div className="mb-4 inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-marvel-red/20 border border-marvel-red/40 text-marvel-red font-mono text-xs tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HERO ACQUIRED FROM MULTIVERSE</span>
          </div>
        )}

        <h3 className="text-gray-400 font-mono text-sm sm:text-base tracking-widest uppercase">
          YOUR AVENGER IS...
        </h3>

        {/* Large Character Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-6xl font-extrabold uppercase tracking-tight font-display mt-2"
          style={{
            color: character.isLegendary ? '#f3d053' : character.accentHex,
            textShadow: `0 0 30px ${character.glowColor}`,
          }}
        >
          {character.name}
        </motion.h1>

        <p className="text-xs sm:text-sm font-mono text-gray-300 mt-1 uppercase tracking-wider">
          {character.title}
        </p>

        {/* Hero Visual Icon Emblem */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="my-6 inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-marvel-darker/80 border-4 shadow-2xl relative"
          style={{ borderColor: character.accentHex }}
        >
          <span className="text-5xl sm:text-6xl">{character.iconSymbol}</span>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="italic text-lg sm:text-xl font-sans text-gray-200 max-w-lg mx-auto font-medium"
        >
          {character.quote}
        </motion.blockquote>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-4 gap-2 max-w-md mx-auto text-xs font-mono">
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <div className="text-gray-400 text-[10px]">STR</div>
            <div className="text-white font-bold">{character.stats.strength}</div>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <div className="text-gray-400 text-[10px]">INT</div>
            <div className="text-white font-bold">{character.stats.intelligence}</div>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <div className="text-gray-400 text-[10px]">TAC</div>
            <div className="text-white font-bold">{character.stats.tactics}</div>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <div className="text-gray-400 text-[10px]">AGI</div>
            <div className="text-white font-bold">{character.stats.agility}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              soundFx.playClick();
              onTalkToHero();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-display text-lg font-bold uppercase tracking-wider text-white bg-gradient-to-r from-marvel-red via-red-600 to-marvel-red hover:shadow-[0_0_40px_rgba(230,36,41,0.8)] hover:scale-105 transition-all border border-marvel-red/50 shadow-lg"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            <span>TALK TO MY AVENGER</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onSpinAgain();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-mono text-sm font-semibold uppercase tracking-wider text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-gray-700"
          >
            <span>Spin Again</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
