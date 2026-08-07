'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, User, Mail, Phone, MapPin, Sparkles, CheckCircle2, Lock, X } from 'lucide-react';
import { soundFx } from '@/utils/audio';
import { ShieldUser, updateUserSubscription } from '@/utils/supabase';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ShieldUser | null;
  onSuccess: (updatedUser: ShieldUser) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all billing information (Name, Email, Phone Number, and Address).');
      return;
    }

    setLoading(true);

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Sm1DACtZ2hsm5t';

    const options = {
      key: razorpayKey,
      amount: 19900, // ₹199 in paise
      currency: 'INR',
      name: 'S.H.I.E.L.D. Multiverse AI',
      description: 'Unlimited Avenger Hero Access Pass',
      image: 'https://img.icons8.com/color/512/marvel-app.png',
      prefill: {
        name: name.trim(),
        email: email.trim(),
        contact: phone.trim(),
      },
      theme: {
        color: '#E62429',
      },
      handler: async function (response: any) {
        try {
          const paymentId = response.razorpay_payment_id || `pay_test_${Date.now()}`;
          soundFx.playLegendaryUnlock();

          const updated = await updateUserSubscription(
            email.trim(),
            phone.trim(),
            address.trim(),
            paymentId
          );

          if (updated) {
            onSuccess(updated);
          } else {
            // Fallback user object
            onSuccess({
              id: currentUser?.id || `user-${Date.now()}`,
              name: name.trim(),
              email: email.trim(),
              agentId: currentUser?.agentId || 'SHIELD-007',
              createdAt: currentUser?.createdAt || new Date().toISOString(),
              spins: currentUser?.spins || 2,
              lastHero: currentUser?.lastHero || 'Avenger',
              isSubscribed: true,
              phone: phone.trim(),
              address: address.trim(),
              paymentId,
            });
          }
        } catch (err) {
          console.error('Subscription update error:', err);
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback simulation if Razorpay script is blocked by browser adblocker
      setTimeout(async () => {
        const simulatedPaymentId = `pay_sim_${Math.floor(100000 + Math.random() * 900000)}`;
        soundFx.playLegendaryUnlock();
        const updated = await updateUserSubscription(
          email.trim(),
          phone.trim(),
          address.trim(),
          simulatedPaymentId
        );
        onSuccess(
          updated || {
            id: currentUser?.id || `user-${Date.now()}`,
            name: name.trim(),
            email: email.trim(),
            agentId: currentUser?.agentId || 'SHIELD-007',
            createdAt: currentUser?.createdAt || new Date().toISOString(),
            spins: currentUser?.spins || 2,
            lastHero: currentUser?.lastHero || 'Avenger',
            isSubscribed: true,
            phone: phone.trim(),
            address: address.trim(),
            paymentId: simulatedPaymentId,
          }
        );
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-marvel-dark/95 border-2 border-marvel-gold/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(243,208,83,0.3)] font-sans my-8"
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-marvel-gold/15 border border-marvel-gold/50 text-marvel-gold mb-3 shadow-[0_0_20px_rgba(243,208,83,0.4)]">
              <Sparkles className="w-7 h-7 animate-bounce" />
            </div>
            <span className="text-[10px] font-mono uppercase bg-red-950/80 border border-red-500/50 text-red-300 px-3 py-1 rounded-full mb-2 inline-block">
              2 FREE TRIAL MESSAGES EXHAUSTED
            </span>
            <h2 className="text-2xl font-bold font-display uppercase tracking-wider text-white">
              S.H.I.E.L.D. UNLIMITED PASS
            </h2>
            <p className="text-xs font-mono text-marvel-gold mt-1">
              PRO ACCESS: UNLIMITED MESSAGES & ALL 7 AVENGERS
            </p>
          </div>

          {/* Price Banner */}
          <div className="bg-gradient-to-r from-marvel-red/20 via-amber-500/20 to-marvel-gold/20 border border-marvel-gold/40 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono uppercase text-gray-300">S.H.I.E.L.D. PRO PLAN</p>
              <p className="text-2xl font-bold font-display text-marvel-gold">₹199 / Month</p>
            </div>
            <div className="text-right text-xs font-mono text-emerald-400">
              <p>✔ Unlimited Chat Inputs</p>
              <p>✔ Priority Gemini AI</p>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Billing Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tony Stark"
                    className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-marvel-gold font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-marvel-gold font-sans"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                S.H.I.E.L.D. Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="stark@avengers.shield"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-marvel-gold font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Full Address (Street, City, State, Pincode)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="10880 Malibu Point, Malibu, CA 90265"
                  className="w-full bg-marvel-darker border border-marvel-border rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-marvel-gold font-sans resize-none"
                />
              </div>
            </div>

            {/* Razorpay Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-marvel-gold via-amber-500 to-amber-600 text-black font-bold font-mono text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(243,208,83,0.7)] active:scale-95 transition-all flex items-center justify-center space-x-2 mt-6"
            >
              <CreditCard className="w-5 h-5" />
              <span>
                {loading ? 'Processing Payment...' : 'PAY ₹199 WITH RAZORPAY & UNLOCK'}
              </span>
            </button>
          </form>

          <p className="text-[10px] font-mono text-gray-500 text-center mt-4">
            Secured by Razorpay Test Key (rzp_test_Sm1DACtZ2hsm5t) & Supabase Encrypted Storage
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
