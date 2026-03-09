'use client';

import { useEffect, useRef } from 'react';

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
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-star-twinkle"
            style={{
              background: 'var(--accent-gold)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
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
