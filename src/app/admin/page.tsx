'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Users, RefreshCw, Search, LogOut, Award, Database, Sparkles } from 'lucide-react';
import { soundFx } from '@/utils/audio';
import { fetchAllRegisteredUsers, ShieldUser } from '@/utils/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<ShieldUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin login check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();

    if (username.trim() === 'agent_fury' && password.trim() === 'AvengersAssemble2026!') {
      soundFx.playLegendaryUnlock();
      setIsAuthenticated(true);
      setError(null);
      loadUsers();
    } else {
      setError('Invalid S.H.I.E.L.D. Director credentials. Access Denied.');
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllRegisteredUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.agentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-marvel-darker text-white font-sans flex flex-col p-4 sm:p-8">
      {/* Top Navbar */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-4 border-b border-marvel-border mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-marvel-red/20 border border-marvel-red flex items-center justify-center text-marvel-red">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display uppercase tracking-wider">
              S.H.I.E.L.D. COMMAND CENTER
            </h1>
            <p className="text-xs font-mono text-marvel-gold">
              ADMIN DIRECTORY PROTOCOL v3.5
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-xs font-mono px-4 py-2 rounded-lg bg-marvel-card border border-marvel-border text-gray-300 hover:text-white hover:border-marvel-red transition-all"
          >
            ← Back to HQ Website
          </Link>
          {isAuthenticated && (
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAuthenticated(false);
              }}
              className="flex items-center space-x-1.5 text-xs font-mono px-4 py-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/60 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto flex-1">
        {!isAuthenticated ? (
          /* Admin Login Section */
          <div className="max-w-md mx-auto my-12 bg-marvel-dark border-2 border-marvel-red/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(230,36,41,0.2)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-marvel-gold/10 border border-marvel-gold/40 text-marvel-gold flex items-center justify-center mx-auto mb-3">
                <Lock className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold font-display uppercase text-white">
                DIRECTOR AUTHORIZATION
              </h2>
              <p className="text-xs font-mono text-gray-400 mt-1">
                RESTRICTED TO S.H.I.E.L.D. DIRECTORS ONLY
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="agent_fury"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-marvel-red font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-marvel-red font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-marvel-gold/80 to-amber-600 text-black font-bold font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(243,208,83,0.5)] active:scale-95 transition-all mt-6"
              >
                UNLOCK ADMIN DIRECTORY
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard Table Section */
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-marvel-dark/90 border border-marvel-red/30 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase">Registered Agents</p>
                  <p className="text-3xl font-bold font-display text-white mt-1">{users.length}</p>
                </div>
                <Users className="w-10 h-10 text-marvel-red opacity-80" />
              </div>

              <div className="bg-marvel-dark/90 border border-marvel-gold/30 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase">Total HQ Spins</p>
                  <p className="text-3xl font-bold font-display text-marvel-gold mt-1">
                    {users.reduce((acc, u) => acc + (u.spins || 0), 0)}
                  </p>
                </div>
                <Award className="w-10 h-10 text-marvel-gold opacity-80" />
              </div>

              <div className="bg-marvel-dark/90 border border-cyan-500/30 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase">Database Link</p>
                  <p className="text-sm font-bold font-mono text-cyan-400 mt-1">SUPABASE ACTIVE</p>
                </div>
                <Database className="w-10 h-10 text-cyan-400 opacity-80" />
              </div>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-marvel-dark/80 p-4 rounded-2xl border border-marvel-border">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agent alias or email..."
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-marvel-red font-sans"
                />
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  loadUsers();
                }}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-marvel-card border border-marvel-border text-xs font-mono text-gray-300 hover:text-white hover:border-marvel-red transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Table</span>
              </button>
            </div>

            {/* Registered Users Table */}
            <div className="bg-marvel-dark/95 border border-marvel-red/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-marvel-darker border-b border-marvel-border text-[11px] font-mono uppercase text-gray-400">
                      <th className="py-4 px-6">Agent ID</th>
                      <th className="py-4 px-6">Alias / Name</th>
                      <th className="py-4 px-6">S.H.I.E.L.D. Email</th>
                      <th className="py-4 px-6">Registered Timestamp</th>
                      <th className="py-4 px-6">Total Spins</th>
                      <th className="py-4 px-6">Last Unlocked Hero</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-marvel-border text-sm font-sans">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 font-mono text-xs">
                          No registered agents found in S.H.I.E.L.D. database.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-marvel-card/50 transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-marvel-gold font-bold">
                            {u.agentId}
                          </td>
                          <td className="py-4 px-6 font-bold text-white">{u.name}</td>
                          <td className="py-4 px-6 text-gray-300 font-mono text-xs">{u.email}</td>
                          <td className="py-4 px-6 text-gray-400 font-mono text-xs">
                            {new Date(u.createdAt).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-cyan-400">{u.spins}</td>
                          <td className="py-4 px-6 font-mono text-xs text-emerald-400">
                            {u.lastHero}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
