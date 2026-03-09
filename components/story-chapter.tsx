'use client';

import { useEffect, useRef } from 'react';
import PortraitSVG from '@/components/portrait-svg';
import MoonSVG from '@/components/moon-svg';

interface Chapter {
  title: string;
  text: string;
  youtubeUrl: string;
  startSeconds: number;
  backgroundColor: string;
}

interface StoryChapterProps {
  chapter: Chapter;
  index: number;
  isActive: boolean;
  scrollProgress: number;
}

export default function StoryChapter({
  chapter,
  index,
  isActive,
  scrollProgress,
}: StoryChapterProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.getElementById('story-audio') as HTMLAudioElement | null;
    if (!audio) return;

    if (isActive) {
      // Load and play the chapter's music
      const iframe = document.createElement('iframe');
      iframe.src = `${chapter.youtubeUrl}?start=${Math.floor(chapter.startSeconds)}`;
      iframe.style.display = 'none';
      
      // Note: YouTube iframe embed has restrictions for autoplay
      // In production, use a proper audio service or API
      console.log('[v0] Chapter', index + 1, 'playing music:', chapter.youtubeUrl);
    }
  }, [isActive, chapter, index]);

  // Calculate text reveal based on scroll progress
  const textOpacity = Math.min(1, (scrollProgress - index * 0.25) * 4);
  const portraitOpacity = Math.min(1, (scrollProgress - index * 0.25 - 0.1) * 3);

  return (
    <div
      className="scroll-section flex items-center justify-center relative overflow-hidden px-6"
      style={{
        background: chapter.backgroundColor,
      }}
    >
      {/* Animated background stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${index}-${i}`}
            className="absolute w-1 h-1 rounded-full animate-star-twinkle"
            style={{
              background: 'var(--accent-gold)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl w-full h-full flex flex-col items-center justify-center gap-8">
        {/* Moon - Top right, larger */}
        <div className="absolute top-12 right-12 w-48 h-48">
          <MoonSVG scrollProgress={scrollProgress - index * 0.25} />
        </div>

        {/* Portrait - Center, appears as you scroll */}
        <div
          className="w-64 h-80 transition-opacity duration-500"
          style={{ opacity: portraitOpacity }}
        >
          <PortraitSVG chapter={index} revealProgress={portraitOpacity} />
        </div>

        {/* Text - Appears later */}
        <div
          className="text-center transition-opacity duration-500"
          style={{ opacity: textOpacity }}
        >
          {chapter.title && (
            <h2 className="text-2xl md:text-3xl mb-6 gold-text font-serif">
              {chapter.title}
            </h2>
          )}
          <p className="text-xl md:text-2xl text-balance leading-relaxed warm-text font-serif">
            {chapter.text}
          </p>
        </div>

        {/* Silhouette - Only on last chapter */}
        {index === 3 && (
          <div
            className="absolute bottom-0 left-0 transition-opacity duration-500"
            style={{ opacity: textOpacity * 0.7 }}
          >
            <svg width="120" height="180" viewBox="0 0 120 180" className="opacity-40">
              <ellipse cx="60" cy="50" rx="25" ry="30" fill="var(--text-muted)" />
              <path d="M 35 80 Q 30 100 35 130 L 40 180 M 85 80 Q 90 100 85 130 L 80 180 M 60 80 L 60 140" stroke="var(--text-muted)" strokeWidth="4" fill="none" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
