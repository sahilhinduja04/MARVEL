'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, Mail, Key, CheckCircle, Sparkles, X } from 'lucide-react';
import { soundFx } from '@/utils/audio';
import { registerShieldUser, getLocalUsers, ShieldUser } from '@/utils/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: ShieldUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and Security Passcode are required.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Agent Name / Alias is required.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Register user
        const user = await registerShieldUser(name, email);
        soundFx.playLegendaryUnlock();
        onSuccess(user);
      } else {
        // Login user
        const existingUsers = getLocalUsers();
        const found = existingUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        
        if (found) {
          soundFx.playClick();
          onSuccess(found);
        } else {
          // Register automatically if logging in for first time
          const user = await registerShieldUser(email.split('@')[0] || 'Agent', email);
          soundFx.playClick();
          onSuccess(user);
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError('S.H.I.E.L.D. Neural Auth failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-marvel-dark/95 border-2 border-marvel-red/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(230,36,41,0.3)] font-sans"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-marvel-red/10 border border-marvel-red/40 text-marvel-red mb-3">
              <Shield className="w-7 h-7 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">
              S.H.I.E.L.D. CLEARANCE AUTH
            </h2>
            <p className="text-xs font-mono text-marvel-gold mt-1">
              LEVEL 7 ACCESS REQUIRED FOR HQ ENTRY
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-marvel-border mb-6">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all ${
                isSignUp
                  ? 'border-marvel-red text-marvel-red'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase border-b-2 transition-all ${
                !isSignUp
                  ? 'border-marvel-red text-marvel-red'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Login
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Agent Name / Alias
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tony Stark / Agent Romanoff"
                    className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-marvel-red font-sans"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                S.H.I.E.L.D. Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@avengers.shield"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-marvel-red font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-marvel-red font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-marvel-red to-red-700 text-white font-bold font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(230,36,41,0.6)] active:scale-95 transition-all flex items-center justify-center space-x-2 mt-6"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : isSignUp ? 'CREATE S.H.I.E.L.D. ACCOUNT' : 'AUTHENTICATE ACCESS'}</span>
            </button>
          </form>

          <p className="text-[11px] font-mono text-gray-500 text-center mt-4">
            Protected by S.H.I.E.L.D. Neural Database & Supabase Encryption
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
