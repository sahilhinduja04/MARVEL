'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { CHARACTER_LIST, MarvelCharacter, CharacterId } from '@/types/marvel';
import { selectWeightedCharacter, calculateWheelTargetAngle } from '@/utils/roulette';
import { soundFx } from '@/utils/audio';
import { RotateCw, Zap } from 'lucide-react';

interface WheelProps {
  onSpinComplete: (character: MarvelCharacter) => void;
}

export const Wheel: React.FC<WheelProps> = ({ onSpinComplete }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isBlurry, setIsBlurry] = useState(false);
  const [shake, setShake] = useState(false);
  const wheelControls = useAnimation();
  const currentRotationRef = useRef(0);

  const totalSegments = CHARACTER_LIST.length;
  const segmentAngle = 360 / totalSegments;

  const handleSpin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    soundFx.playSpinStart();

    // 1. Determine target hero using weighted probability (Iron Man = 4%, others = 16%)
    const selectedHero = selectWeightedCharacter();
    const targetIndex = CHARACTER_LIST.findIndex((c) => c.id === selectedHero.id);

    // 2. Compute exact rotation angle (degrees) ending cleanly under the top pointer
    const newTargetAngle = calculateWheelTargetAngle(
      targetIndex,
      currentRotationRef.current,
      totalSegments
    );

    // 3. Audio & Motion Ticks setup
    const duration = 5.2; // seconds
    let startTime: number | null = null;
    let lastPinIndex = -1;

    const playPinTicks = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic progress curve matching Framer Motion's easeOut
      const currentDeg = currentRotationRef.current + (newTargetAngle - currentRotationRef.current) * (1 - Math.pow(1 - progress, 3));
      
      const pinIndex = Math.floor((currentDeg % 360) / segmentAngle);
      if (pinIndex !== lastPinIndex) {
        lastPinIndex = pinIndex;
        soundFx.playTick();
      }

      if (progress < 1) {
        requestAnimationFrame(playPinTicks);
      }
    };

    requestAnimationFrame(playPinTicks);

    // 4. Motion blur & screen shake effects
    setIsBlurry(true);
    setShake(true);

    const blurTimeout = setTimeout(() => {
      setIsBlurry(false);
    }, 3800);

    const shakeTimeout = setTimeout(() => {
      setShake(false);
    }, 4500);

    // 5. Execute Framer Motion smooth spin
    await wheelControls.start({
      rotate: newTargetAngle,
      transition: {
        duration: duration,
        ease: [0.15, 0.85, 0.35, 1.0], // Custom realistic deceleration physics
      },
    });

    currentRotationRef.current = newTargetAngle;
    setRotation(newTargetAngle);
    setIsSpinning(false);
    clearTimeout(blurTimeout);
    clearTimeout(shakeTimeout);

    // Sound effect on land
    if (selectedHero.isLegendary) {
      soundFx.playLegendaryUnlock();
    } else {
      soundFx.playReveal();
    }

    onSpinComplete(selectedHero);
  };

  return (
    <div className={`flex flex-col items-center justify-center py-6 relative ${shake ? 'animate-bounce' : ''}`}>
      
      {/* Top Glowing Pointer Indicator */}
      <div className="relative z-20 -mb-7 flex flex-col items-center">
        <div className="w-8 h-8 bg-gradient-to-b from-marvel-gold to-amber-600 rounded-full shadow-[0_0_25px_rgba(243,208,83,0.9)] flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
        </div>
        {/* Triangular pointer */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-marvel-gold drop-shadow-[0_4px_10px_rgba(243,208,83,0.8)]" />
      </div>

      {/* Outer Glowing Metallic Rim Wrapper */}
      <div className="relative p-4 rounded-full bg-gradient-to-b from-gray-800 via-marvel-card to-black border-4 border-marvel-red/40 shadow-[0_0_60px_rgba(230,36,41,0.4)]">
        
        {/* SVG Wheel */}
        <motion.div
          animate={wheelControls}
          className={`relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full overflow-hidden shadow-2xl transition-all ${
            isBlurry ? 'blur-[1.5px]' : ''
          }`}
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 500 500" className="w-full h-full transform -rotate-90">
            <defs>
              {CHARACTER_LIST.map((char) => (
                <radialGradient key={char.id} id={`grad-${char.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={char.accentHex} stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#0a0a0f" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                </radialGradient>
              ))}
            </defs>

            {CHARACTER_LIST.map((char, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = (index + 1) * segmentAngle;
              
              // Math to calculate SVG arc slice path
              const startRad = (Math.PI * startAngle) / 180;
              const endRad = (Math.PI * endAngle) / 180;
              
              const x1 = 250 + 240 * Math.cos(startRad);
              const y1 = 250 + 240 * Math.sin(startRad);
              const x2 = 250 + 240 * Math.cos(endRad);
              const y2 = 250 + 240 * Math.sin(endRad);

              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

              const pathData = `M 250 250 L ${x1} ${y1} A 240 240 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

              // Angle for text label placement inside segment
              const midAngle = startAngle + segmentAngle / 2;
              const midRad = (Math.PI * midAngle) / 180;
              const labelX = 250 + 155 * Math.cos(midRad);
              const labelY = 250 + 155 * Math.sin(midRad);

              return (
                <g key={char.id}>
                  {/* Segment Pie Slice */}
                  <path
                    d={pathData}
                    fill={`url(#grad-${char.id})`}
                    stroke="#1a1a2e"
                    strokeWidth="2.5"
                  />

                  {/* Segment Pin Marker on Rim */}
                  <circle
                    cx={250 + 235 * Math.cos(startRad)}
                    cy={250 + 235 * Math.sin(startRad)}
                    r="4"
                    fill="#f3d053"
                    className="drop-shadow-[0_0_5px_#f3d053]"
                  />

                  {/* Content (Emblem Icon + Hero Name) */}
                  <g
                    transform={`translate(${labelX}, ${labelY}) rotate(${midAngle + 90})`}
                    className="select-none pointer-events-none"
                  >
                    <text
                      x="0"
                      y="-12"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                    >
                      {char.name}
                    </text>

                    <text
                      x="0"
                      y="14"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="20"
                    >
                      {char.iconSymbol}
                    </text>

                    {char.isLegendary && (
                      <text
                        x="0"
                        y="34"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-amber-400 font-extrabold text-[9px] uppercase tracking-widest"
                      >
                        ★ RARE
                      </text>
                    )}
                  </g>
                </g>
              );
            })}

            {/* Central Arc Reactor Cap */}
            <circle cx="250" cy="250" r="45" fill="#0c0c14" stroke="#e62429" strokeWidth="4" />
            <circle cx="250" cy="250" r="32" fill="#181824" stroke="#f3d053" strokeWidth="2" />
            <circle cx="250" cy="250" r="16" fill="#00f0ff" className="animate-pulse" />
          </svg>
        </motion.div>
      </div>

      {/* Spin Trigger Button */}
      <div className="mt-8">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`group relative inline-flex items-center space-x-3 px-10 py-4 rounded-xl font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_30px_rgba(230,36,41,0.5)] ${
            isSpinning
              ? 'opacity-60 cursor-not-allowed bg-gray-800 border border-gray-600'
              : 'bg-gradient-to-r from-marvel-red via-red-600 to-marvel-red hover:shadow-[0_0_50px_rgba(230,36,41,0.9)] hover:scale-105 active:scale-95 border border-marvel-red/50'
          }`}
        >
          <RotateCw className={`w-6 h-6 text-marvel-gold ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span>{isSpinning ? 'SPINNING WHEEL...' : 'SPIN THE WHEEL'}</span>
        </button>
      </div>
    </div>
  );
};
