'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarvelCharacter, ChatMessage } from '@/types/marvel';
import { soundFx } from '@/utils/audio';
import {
  Send,
  Trash2,
  RotateCw,
  Sparkles,
  AlertTriangle,
  Bot,
  User,
  RefreshCw,
  Shield,
} from 'lucide-react';

interface ChatInterfaceProps {
  character: MarvelCharacter;
  onSpinAgain: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  character,
  onSpinAgain,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting message when character unlocks
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        sender: 'ai',
        text: `Greetings! I am your AI assistant roleplaying as ${character.name}. ${character.quote}`,
        timestamp: Date.now(),
      },
    ]);
  }, [character]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isTyping) return;

    soundFx.playClick();
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send request to secure Node.js Next.js server API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'The Avengers communication network is temporarily offline. Try again.');
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      soundFx.playTick();
    } catch (err: unknown) {
      console.error('Chat API Error:', err);
      const errMsg = err instanceof Error ? err.message : 'The Avengers communication network is temporarily offline. Try again.';
      setErrorMessage(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    soundFx.playClick();
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: `Chat cleared. ${character.name} is ready for your next directive.`,
        timestamp: Date.now(),
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl w-full mx-auto h-[calc(100vh-6rem)] flex flex-col p-2 sm:p-4 font-sans">
      {/* Header Bar */}
      <div className="bg-marvel-dark/90 border border-marvel-red/30 rounded-t-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 shadow-lg"
            style={{
              borderColor: character.accentHex,
              backgroundColor: 'rgba(10, 10, 15, 0.8)',
            }}
          >
            {character.iconSymbol}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                {character.name} AI
              </h2>
              <span className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ONLINE</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono tracking-tight">
              {character.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            title="Clear Chat"
            className="p-2 rounded-lg bg-marvel-card border border-marvel-border text-gray-400 hover:text-marvel-red hover:bg-marvel-red/10 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onSpinAgain();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-marvel-gold/20 to-amber-500/20 border border-marvel-gold/40 text-marvel-gold text-xs font-mono font-bold uppercase hover:scale-105 transition-all shadow-[0_0_15px_rgba(243,208,83,0.3)]"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Spin Again</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 bg-marvel-darker/90 border-x border-marvel-red/20 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-marvel-red text-white'
                    : 'bg-marvel-card border border-marvel-border text-white'
                }`}
                style={{
                  borderColor: msg.sender === 'ai' ? character.accentHex : undefined,
                }}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : character.iconSymbol}
              </div>

              {/* Chat Bubble */}
              <div
                className={`p-3.5 rounded-2xl text-sm sm:text-base leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-marvel-red to-red-700 text-white rounded-tr-none shadow-md'
                    : 'bg-marvel-card/90 border border-marvel-border text-gray-200 rounded-tl-none backdrop-blur-md shadow-lg'
                }`}
              >
                <div className="font-semibold text-[11px] mb-1 font-mono uppercase tracking-wider text-gray-400">
                  {msg.sender === 'user' ? 'YOU' : `${character.name} AI`}
                </div>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Animated Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 p-3 rounded-xl border border-cyan-500/30 max-w-xs"
          >
            <Bot className="w-4 h-4 animate-bounce text-cyan-400" />
            <span>{character.name} is typing...</span>
            <div className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-100" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-200" />
            </div>
          </motion.div>
        )}

        {/* Error Fallback Notice */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-marvel-red shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="px-3 py-1 bg-marvel-red/30 hover:bg-marvel-red border border-marvel-red text-white text-xs font-mono rounded flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts */}
      <div className="bg-marvel-dark border-x border-marvel-red/20 p-2 sm:p-3 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        <span className="text-xs font-mono text-marvel-gold flex items-center space-x-1 shrink-0 px-2 py-1">
          <Sparkles className="w-3.5 h-3.5 text-marvel-gold" />
          <span>SUGGESTED PROMPTS:</span>
        </span>
        {character.starterPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(promptText)}
            disabled={isTyping}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-marvel-card hover:bg-marvel-red/20 border border-marvel-border hover:border-marvel-red/50 text-gray-300 hover:text-white transition-all shrink-0"
          >
            "{promptText}"
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-marvel-dark/95 border border-marvel-red/30 rounded-b-2xl p-3 sm:p-4 backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${character.name} anything...`}
            disabled={isTyping}
            className="flex-1 bg-marvel-darker border border-marvel-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-marvel-red focus:ring-1 focus:ring-marvel-red text-sm font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-xl font-bold uppercase transition-all flex items-center justify-center ${
              !input.trim() || isTyping
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-marvel-red text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(230,36,41,0.6)] active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
