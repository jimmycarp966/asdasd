"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import {
  fadeDurationMs,
  stageHoldLeadSeconds,
  storyStages,
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
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
};

type StoryAudioProps = {
  activeStage: number;
  started: boolean;
  onAudioProgress: (progress: number) => void;
  onCanAdvanceChange: (ready: boolean) => void;
  onFinalTrackEnded: (ended: boolean) => void;
};

const targetVolume = 64;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function buildEmbedSrc(videoId: string, startSeconds: number) {
  if (typeof window === "undefined") {
    return "about:blank";
  }

  const params = new URLSearchParams({
    enablejsapi: "1",
    controls: "0",
    rel: "0",
    autoplay: "0",
    playsinline: "1",
    origin: window.location.origin,
    start: `${startSeconds}`,
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function StoryAudio({
  activeStage,
  started,
  onAudioProgress,
  onCanAdvanceChange,
  onFinalTrackEnded,
}: StoryAudioProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const monitorRef = useRef<number | null>(null);
  const fadeRef = useRef<number | null>(null);
  const readyRef = useRef(false);
  const startedRef = useRef(started);
  const stageRef = useRef(activeStage);
  const apiReadyRef = useRef(false);
  const stageLoadAtRef = useRef(0);
  const stageClockStartRef = useRef(0);
  const playerReadyRef = useRef(false);
  const currentAudioStageRef = useRef(-1);

  const clearMonitor = useEffectEvent(() => {
    if (monitorRef.current) {
      window.clearInterval(monitorRef.current);
      monitorRef.current = null;
    }
  });

  const clearFade = useEffectEvent(() => {
    if (fadeRef.current) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  });

  const resetStageState = useEffectEvent((stageIndex: number) => {
    stageRef.current = stageIndex;
    stageClockStartRef.current = performance.now();
    readyRef.current = false;
    onAudioProgress(0);
    onCanAdvanceChange(false);
    onFinalTrackEnded(false);
  });

  const resetToIdle = useEffectEvent(() => {
    onAudioProgress(0);
    onCanAdvanceChange(false);
  });

  const fadeTo = useEffectEvent((from: number, to: number, onComplete?: () => void) => {
    clearFade();
    const player = playerRef.current;
    if (!player) return;

    let step = 0;
    const steps = 18;
    player.setVolume(from);

    fadeRef.current = window.setInterval(() => {
      step += 1;
      const next = from + ((to - from) * step) / steps;
      player.setVolume(next);

      if (step >= steps) {
        clearFade();
        player.setVolume(to);
        onComplete?.();
      }
    }, fadeDurationMs / steps);
  });

  const startMonitor = useEffectEvent((stageIndex: number) => {
    clearMonitor();
    const stage = storyStages[stageIndex];

    monitorRef.current = window.setInterval(() => {
      const player = playerRef.current;
      const elapsedSeconds = Math.max(0, (performance.now() - stageClockStartRef.current) / 1000);
      const fallbackProgress = clamp(elapsedSeconds / Math.max(1, stage.clipDurationSeconds));
      let progress = fallbackProgress;
      let audioCurrent = stage.startSeconds + elapsedSeconds;
      let audioDuration = stage.endSeconds ?? stage.startSeconds + stage.clipDurationSeconds;

      if (player && playerReadyRef.current) {
        const current = player.getCurrentTime();
        const elapsedSinceLoad = performance.now() - stageLoadAtRef.current;

        if (
          elapsedSinceLoad < 1800 &&
          Math.abs(current - stage.startSeconds) > 4.5
        ) {
          player.seekTo(stage.startSeconds, true);
          return;
        }

        const duration = stage.endSeconds ?? player.getDuration();
        const length = Math.max(1, duration - stage.startSeconds);
        const audioProgress = clamp((current - stage.startSeconds) / length);
        progress = Math.max(fallbackProgress, audioProgress);
        audioCurrent = current;
        audioDuration = duration;
      }

      onAudioProgress(progress);

      const unlockByProgress = progress >= stage.exitUnlockAtProgress;
      const unlockByLead =
        stage.endSeconds !== null &&
        (
          audioCurrent >= audioDuration - stageHoldLeadSeconds ||
          progress >= 1 - stageHoldLeadSeconds / Math.max(1, stage.clipDurationSeconds)
        );

      if ((unlockByProgress || unlockByLead) && !readyRef.current) {
        readyRef.current = true;
        onCanAdvanceChange(true);
      }

      if (stage.endSeconds !== null && progress >= 1) {
        player?.pauseVideo();
        onAudioProgress(1);
        readyRef.current = true;
        onCanAdvanceChange(true);
        clearMonitor();
      }

      if (
        stage.endSeconds === null &&
        (
          progress >= 1 ||
          (player &&
            playerReadyRef.current &&
            player.getPlayerState() === window.YT?.PlayerState.ENDED)
        )
      ) {
        onAudioProgress(1);
        onFinalTrackEnded(true);
        clearMonitor();
      }
    }, 200);
  });

  const playStage = useEffectEvent((stageIndex: number, immediate = false) => {
    const player = playerRef.current;
    const stage = storyStages[stageIndex];
    if (!player || !playerReadyRef.current) return;

    const loadAndPlay = () => {
      stageLoadAtRef.current = performance.now();
      player.loadVideoById({
        videoId: stage.videoId,
        startSeconds: stage.startSeconds,
      });
      player.setVolume(0);
      currentAudioStageRef.current = stageIndex;

      window.setTimeout(() => {
        player.seekTo(stage.startSeconds, true);
        player.playVideo();
      }, 120);

      window.setTimeout(() => {
        player.seekTo(stage.startSeconds, true);
        fadeTo(0, targetVolume);
      }, 320);
    };

    if (immediate) {
      loadAndPlay();
      return;
    }

    fadeTo(targetVolume, 0, loadAndPlay);
  });

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    if (!started) {
      clearMonitor();
      resetToIdle();
      return;
    }

    resetStageState(activeStage);
    startMonitor(activeStage);
  }, [activeStage, started]);

  useEffect(() => {
    const createPlayer = () => {
      if (!iframeRef.current || playerRef.current || !window.YT?.Player) return;

      iframeRef.current.src = buildEmbedSrc(
        storyStages[0].videoId,
        storyStages[0].startSeconds,
      );

      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            playerReadyRef.current = true;
            if (startedRef.current) {
              playStage(stageRef.current, true);
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
  }, []);

  useEffect(() => {
    if (
      !started ||
      !apiReadyRef.current ||
      !playerRef.current ||
      !playerReadyRef.current
    ) {
      return;
    }

    playStage(activeStage, currentAudioStageRef.current < 0 || currentAudioStageRef.current === activeStage);
  }, [activeStage, started]);

  return (
    <iframe
      ref={iframeRef}
      className="story-audio-host"
      title="Story audio"
      aria-hidden="true"
      tabIndex={-1}
      allow="autoplay"
    />
  );
}
