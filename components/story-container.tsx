'use client';

import { useState, useEffect } from 'react';
import SplashScreen from '@/components/splash-screen';
import StoryChapter from '@/components/story-chapter';
import { chapters } from '@/lib/story-config';

export default function StoryContainer() {
  const [started, setStarted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!started) return;

    const container = document.querySelector('.scroll-container');
    if (!container) return;

    const handleScroll = () => {
      const totalHeight = container.scrollHeight - container.clientHeight;
      const progress = totalHeight > 0 ? container.scrollTop / totalHeight : 0;
      setScrollProgress(progress);

      // Detect chapter change based on scroll
      const chapterIndex = Math.floor((container.scrollTop / container.clientHeight) * chapters.length);
      setCurrentChapter(Math.min(chapterIndex, chapters.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [started]);

  if (!started) {
    return <SplashScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="scroll-container">
      {chapters.map((chapter, index) => (
        <StoryChapter
          key={index}
          chapter={chapter}
          index={index}
          isActive={currentChapter === index}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  );
}
