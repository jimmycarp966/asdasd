'use client';

import { useEffect, useRef } from 'react';

// Pre-generated star positions to avoid hydration mismatch
const STAR_POSITIONS = [
  { x: 5, y: 12, delay: 0.2 }, { x: 15, y: 8, delay: 1.5 }, { x: 25, y: 22, delay: 0.8 },
  { x: 35, y: 5, delay: 2.1 }, { x: 45, y: 18, delay: 0.4 }, { x: 55, y: 10, delay: 1.9 },
  { x: 65, y: 25, delay: 0.6 }, { x: 75, y: 15, delay: 2.5 }, { x: 85, y: 8, delay: 1.1 },
  { x: 95, y: 20, delay: 0.3 }, { x: 10, y: 35, delay: 1.7 }, { x: 20, y: 42, delay: 2.3 },
  { x: 30, y: 38, delay: 0.9 }, { x: 40, y: 45, delay: 1.4 }, { x: 50, y: 32, delay: 2.7 },
  { x: 60, y: 48, delay: 0.5 }, { x: 70, y: 40, delay: 1.8 }, { x: 80, y: 35, delay: 2.0 },
  { x: 90, y: 42, delay: 0.7 }, { x: 8, y: 55, delay: 1.2 }, { x: 18, y: 62, delay: 2.4 },
  { x: 28, y: 58, delay: 0.1 }, { x: 38, y: 65, delay: 1.6 }, { x: 48, y: 52, delay: 2.8 },
  { x: 58, y: 68, delay: 0.4 }, { x: 68, y: 60, delay: 1.3 }, { x: 78, y: 55, delay: 2.2 },
  { x: 88, y: 62, delay: 0.8 }, { x: 12, y: 75, delay: 1.9 }, { x: 22, y: 82, delay: 2.6 },
  { x: 32, y: 78, delay: 0.3 }, { x: 42, y: 85, delay: 1.1 }, { x: 52, y: 72, delay: 2.9 },
  { x: 62, y: 88, delay: 0.6 }, { x: 72, y: 80, delay: 1.5 }, { x: 82, y: 75, delay: 2.1 },
  { x: 92, y: 82, delay: 0.9 }, { x: 3, y: 92, delay: 1.7 }, { x: 97, y: 95, delay: 2.3 },
];

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    // Enable audio playback on first user interaction
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('[v0] Audio play failed:', err.message);
      });
    }
    onStart();
  };

  useEffect(() => {
    // Create hidden audio element for future chapter music
    const audio = document.createElement('audio');
    audio.id = 'story-audio';
    audio.style.display = 'none';
    document.body.appendChild(audio);
    audioRef.current = audio;

    return () => {
      if (audioRef.current && audioRef.current.parentNode) {
        audioRef.current.parentNode.removeChild(audioRef.current);
      }
    };
  }, []);

  return (
    <div className="scroll-section flex flex-col items-center justify-center px-6">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STAR_POSITIONS.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-star-twinkle"
            style={{
              background: 'var(--accent-gold)',
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Large animated moon */}
        <div className="mb-12 flex justify-center">
          <div className="w-32 h-32 rounded-full moon-glow animate-float" style={{
            background: 'radial-gradient(circle at 30% 30%, var(--accent-moon), var(--accent-warm))',
          }} />
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl mb-4 animate-fade-up gold-text font-serif" style={{ animationDelay: '0.1s' }}>
          La historia de la luna
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-16 animate-fade-up text-balance" style={{ animationDelay: '0.3s', color: 'var(--text-secondary)' }}>
          Una noche mágica dedicada a ti
        </p>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          className="px-12 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 active:scale-95 animate-fade-up"
          style={{
            background: 'var(--accent-gold)',
            color: 'var(--bg-darker)',
            animationDelay: '0.5s',
          }}
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
