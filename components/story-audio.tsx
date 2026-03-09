"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import {
  audioTargetVolume,
  fadeDurationMs,
  gameStages,
} from "@/lib/story-config";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        config: Record<string, unknown>,
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  loadVideoById: (options: { videoId: string; startSeconds: number }) => void;
  mute: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
};

type StoryAudioProps = {
  activeStage: number;
  playNonce: number;
  started: boolean;
  muted: boolean;
  onAudioProgress: (progress: number) => void;
  onFinalTrackEnded: (ended: boolean) => void;
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getStageDuration(stageIndex: number) {
  const stage = gameStages[stageIndex]!;
  return stage.track.endSeconds === null
    ? stage.track.fallbackDurationSeconds
    : Math.max(1, stage.track.endSeconds - stage.track.startSeconds);
}

export function StoryAudio({
  activeStage,
  playNonce,
  started,
  muted,
  onAudioProgress,
  onFinalTrackEnded,
}: StoryAudioProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const monitorRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);
  const apiReadyRef = useRef(false);
  const playerReadyRef = useRef(false);
  const currentStageRef = useRef(activeStage);
  const startedRef = useRef(started);
  const mutedRef = useRef(muted);
  const stageClockStartRef = useRef(0);
  const playerLoadAtRef = useRef(0);
  const currentPlayerStageRef = useRef(-1);

  const clearMonitor = useEffectEvent(() => {
    if (monitorRef.current !== null) {
      window.clearInterval(monitorRef.current);
      monitorRef.current = null;
    }
  });

  const clearFade = useEffectEvent(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  });

  const applyVolume = useEffectEvent((value: number) => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;

    if (mutedRef.current) {
      player.mute();
      player.setVolume(0);
      return;
    }

    player.unMute();
    player.setVolume(value);
  });

  const fadeTo = useEffectEvent((from: number, to: number, onComplete?: () => void) => {
    clearFade();
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) {
      onComplete?.();
      return;
    }

    let step = 0;
    const totalSteps = 16;
    applyVolume(from);

    fadeRef.current = window.setInterval(() => {
      step += 1;
      const nextVolume = from + ((to - from) * step) / totalSteps;
      applyVolume(nextVolume);

      if (step >= totalSteps) {
        clearFade();
        applyVolume(to);
        onComplete?.();
      }
    }, fadeDurationMs / totalSteps);
  });

  const playStage = useEffectEvent((stageIndex: number, immediate = false) => {
    const player = playerRef.current;
    if (!player || !playerReadyRef.current) return;

    const stage = gameStages[stageIndex]!;

    const loadAndPlay = () => {
      playerLoadAtRef.current = performance.now();
      currentPlayerStageRef.current = stageIndex;
      player.loadVideoById({
        videoId: stage.track.videoId,
        startSeconds: stage.track.startSeconds,
      });
      player.pauseVideo();
      applyVolume(0);

      window.setTimeout(() => {
        player.seekTo(stage.track.startSeconds, true);
        player.playVideo();
      }, 120);

      window.setTimeout(() => {
        player.seekTo(stage.track.startSeconds, true);
        fadeTo(0, mutedRef.current ? 0 : audioTargetVolume);
      }, 300);

      window.setTimeout(() => {
        if (currentPlayerStageRef.current !== stageIndex) return;
        player.seekTo(stage.track.startSeconds, true);
        player.playVideo();
      }, 900);
    };

    if (immediate) {
      loadAndPlay();
      return;
    }

    fadeTo(mutedRef.current ? 0 : audioTargetVolume, 0, loadAndPlay);
  });

  const startMonitor = useEffectEvent((stageIndex: number) => {
    clearMonitor();
    const stage = gameStages[stageIndex]!;
    const duration = getStageDuration(stageIndex);

    monitorRef.current = window.setInterval(() => {
      const elapsedSeconds = Math.max(0, (performance.now() - stageClockStartRef.current) / 1000);
      const fallbackProgress = clamp(elapsedSeconds / duration);
      let progress = fallbackProgress;
      const player = playerRef.current;

      if (player && playerReadyRef.current && currentPlayerStageRef.current === stageIndex) {
        const current = player.getCurrentTime();
        const loadAge = performance.now() - playerLoadAtRef.current;
        const endSeconds = stage.track.endSeconds;

        if (loadAge > 1200 && Math.abs(current - stage.track.startSeconds) > 6 && current < stage.track.startSeconds) {
          player.seekTo(stage.track.startSeconds, true);
        } else {
          const clipLength = Math.max(
            1,
            (endSeconds ?? stage.track.startSeconds + duration) - stage.track.startSeconds,
          );
          const playerProgress = clamp((current - stage.track.startSeconds) / clipLength);
          progress = Math.max(fallbackProgress, playerProgress);

          if (endSeconds !== null && current >= endSeconds - 0.15) {
            player.pauseVideo();
            progress = 1;
          }

          if (
            endSeconds === null &&
            player.getPlayerState() === window.YT?.PlayerState.ENDED
          ) {
            onFinalTrackEnded(true);
            progress = 1;
            clearMonitor();
          }
        }
      } else if (stage.track.endSeconds === null && fallbackProgress >= 1) {
        onFinalTrackEnded(true);
      }

      if (stage.track.endSeconds !== null && progress >= 1) {
        clearMonitor();
      }

      onAudioProgress(progress);
    }, 200);
  });

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    mutedRef.current = muted;
    applyVolume(muted ? 0 : audioTargetVolume);
  }, [applyVolume, muted]);

  useEffect(() => {
    currentStageRef.current = activeStage;
    stageClockStartRef.current = performance.now();
    onAudioProgress(0);
    onFinalTrackEnded(false);

    if (started) {
      startMonitor(activeStage);
    } else {
      clearMonitor();
    }
  }, [activeStage, clearMonitor, onAudioProgress, onFinalTrackEnded, startMonitor, started]);

  useEffect(() => {
    const createPlayer = () => {
      if (!hostRef.current || playerRef.current || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(hostRef.current, {
        host: "https://www.youtube-nocookie.com",
        width: 1,
        height: 1,
        videoId: gameStages[0]!.track.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: gameStages[0]!.track.startSeconds,
        },
        events: {
          onReady: () => {
            playerReadyRef.current = true;
            if (startedRef.current) {
              playStage(currentStageRef.current, true);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      apiReadyRef.current = true;
      createPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        apiReadyRef.current = true;
        createPlayer();
      };
    }

    return () => {
      clearMonitor();
      clearFade();
      playerRef.current?.destroy();
      playerRef.current = null;
      playerReadyRef.current = false;
    };
  }, [clearFade, clearMonitor, playStage]);

  useEffect(() => {
    if (!started) return;
    if (!apiReadyRef.current || !playerRef.current || !playerReadyRef.current) return;

    const immediate = currentPlayerStageRef.current < 0 || currentPlayerStageRef.current === activeStage;
    playStage(activeStage, immediate);
  }, [activeStage, playStage, started]);

  useEffect(() => {
    if (!started) return;
    if (!apiReadyRef.current || !playerRef.current || !playerReadyRef.current) return;
    playStage(activeStage, true);
  }, [playNonce, playStage, started, activeStage]);

  return <div ref={hostRef} className="story-audio-host" aria-hidden="true" />;
}
