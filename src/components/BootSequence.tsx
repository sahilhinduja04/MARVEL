'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundFx } from '@/utils/audio';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING AVENGERS HQ PROTOCOL 7...',
  'AUTHENTICATING HIGH-LEVEL SECURITY PERMISSIONS...',
  'CONNECTING TO GEMINI AI NEURAL NETWORK...',
  'SCANNING HERO DATABASE: HULK, CAP, STARK, BARTON, ROMANOFF, PARKER, T\'CHALLA...',
  'SYSTEM ONLINE: COMMAND CENTER ACTIVE'
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  useEffect(() => {
    soundFx.playClick();
    if (currentStep < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        setDisplayedLogs((prev) => [...prev, BOOT_LOGS[currentStep]]);
        setCurrentStep((prev) => prev + 1);
        soundFx.playTick();
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const endTimer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(endTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-marvel-darker p-6 text-marvel-red font-mono"
    >
      {/* Background Arc Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,36,41,0.15)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-xl w-full bg-marvel-dark/90 border border-marvel-red/40 rounded-xl p-8 shadow-[0_0_50px_rgba(230,36,41,0.25)] backdrop-blur-md relative overflow-hidden">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-marvel-red" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-marvel-red" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-marvel-red" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-marvel-red" />

        {/* Header Emblem */}
        <div className="flex items-center justify-between border-b border-marvel-red/30 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-marvel-red animate-ping" />
            <span className="text-xs font-bold tracking-widest text-marvel-red uppercase">
              S.H.I.E.L.D. TERMINAL v4.8
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onComplete();
            }}
            className="text-xs px-3 py-1 bg-marvel-red/20 border border-marvel-red/50 hover:bg-marvel-red hover:text-black transition-all rounded uppercase tracking-wider text-gray-300"
          >
            Skip Boot [Esc]
          </button>
        </div>

        {/* Dynamic Log Output */}
        <div className="space-y-3 min-h-[160px] text-sm text-gray-200">
          {displayedLogs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <span className="text-marvel-gold">{'>'}</span>
              <span className={index === BOOT_LOGS.length - 1 ? "text-emerald-400 font-bold tracking-wide" : "text-gray-300"}>
                {log}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-semibold">
            <span>AVENGERS DATABASE LOAD</span>
            <span>{Math.min(100, Math.round((currentStep / BOOT_LOGS.length) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-marvel-red/30">
            <motion.div
              className="h-full bg-gradient-to-r from-marvel-red via-amber-500 to-emerald-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / BOOT_LOGS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
