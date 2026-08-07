'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, X, Cpu, Percent, Zap } from 'lucide-react';
import { CHARACTER_LIST } from '@/types/marvel';
import { soundFx } from '@/utils/audio';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-xl w-full bg-marvel-dark border border-marvel-red/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="bg-marvel-darker p-4 border-b border-marvel-red/30 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-marvel-gold font-mono font-bold tracking-wider">
            <Cpu className="w-5 h-5" />
            <span>AVENGERS HQ COMMAND SPECS</span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 font-sans text-sm space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-white font-bold font-display uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-marvel-red" />
              <span>THE MARVEL AI ROULETTE PROTOCOL</span>
            </h4>
            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              Step into the Avengers Command Center. Spin the glowing superhero roulette wheel to randomly lock onto a multiverse character persona powered directly by Google's Gemini API.
            </p>
          </div>

          {/* Rarity & Drop Rate Breakdown Table */}
          <div className="bg-marvel-darker p-4 rounded-xl border border-marvel-border font-mono">
            <div className="text-xs font-bold text-marvel-gold mb-2 flex items-center space-x-1 uppercase">
              <Percent className="w-4 h-4 text-marvel-gold" />
              <span>MULTIVERSE HERO DROP RATES</span>
            </div>
            <div className="space-y-1.5">
              {CHARACTER_LIST.map((hero) => (
                <div key={hero.id} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                  <span className="flex items-center space-x-2">
                    <span>{hero.iconSymbol}</span>
                    <span className="text-gray-200 font-bold">{hero.name}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${hero.isLegendary ? 'bg-amber-500/20 text-amber-300 border border-amber-400' : 'bg-white/5 text-gray-400'}`}>
                    {hero.weight}% {hero.isLegendary ? '★ LEGENDARY RARE' : 'Standard'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-marvel-red/10 border border-marvel-red/30 p-3 rounded-xl text-xs font-mono text-gray-300">
            <div className="text-marvel-red font-bold flex items-center space-x-1 mb-1">
              <Zap className="w-4 h-4" />
              <span>SECURITY & NODE ARCHITECTURE</span>
            </div>
            Node.js backend API routes handle character prompt injection and Gemini API calls securely. No API keys are ever exposed on client JavaScript.
          </div>
        </div>

        <div className="bg-marvel-darker p-3 border-t border-marvel-border text-center">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-marvel-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-red-600 transition-all"
          >
            Acknowledge Directive
          </button>
        </div>
      </motion.div>
    </div>
  );
};
