'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HistoryEntry, MARVEL_CHARACTERS } from '@/types/marvel';
import { History, X, Trash2, Award, Clock } from 'lucide-react';
import { soundFx } from '@/utils/audio';

interface MissionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onClearHistory: () => void;
  onSelectHeroFromHistory: (characterId: HistoryEntry['characterId']) => void;
}

export const MissionHistory: React.FC<MissionHistoryProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHeroFromHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-lg w-full bg-marvel-dark border border-marvel-red/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="bg-marvel-darker p-4 border-b border-marvel-red/30 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-marvel-red font-mono font-bold tracking-wider">
            <History className="w-5 h-5" />
            <span>MISSION HISTORY</span>
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

        {/* History List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 font-mono text-sm">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No past hero deployments logged.</p>
              <p className="text-xs text-gray-600 mt-1">Spin the wheel to unlock your first Avenger!</p>
            </div>
          ) : (
            history.map((entry) => {
              const charData = MARVEL_CHARACTERS[entry.characterId];
              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectHeroFromHistory(entry.characterId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] ${
                    entry.isLegendary
                      ? 'border-amber-400/50 bg-amber-950/30 hover:bg-amber-900/40 text-amber-200'
                      : 'border-marvel-border bg-marvel-card hover:bg-marvel-red/10 text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{charData?.iconSymbol || '🛡️'}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-display uppercase tracking-wide">
                          {entry.characterName}
                        </span>
                        {entry.isLegendary && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-bold flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>LEGENDARY</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-marvel-red hover:underline">
                    Talk →
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="bg-marvel-darker p-3 border-t border-marvel-border flex justify-between items-center text-xs font-mono">
            <span className="text-gray-400">
              Total Spins Logged: <strong className="text-white">{history.length}</strong>
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onClearHistory();
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded bg-red-950/60 hover:bg-marvel-red text-red-300 hover:text-white border border-red-800/60 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
