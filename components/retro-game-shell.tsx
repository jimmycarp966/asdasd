"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FinalCutscene } from "@/components/final-cutscene";
import { GirlSprite, HeartSprite, HeroSprite, MoonFragmentSprite } from "@/components/pixel-sprites";
import { StageRenderer } from "@/components/stage-renderer";
import { StoryAudio } from "@/components/story-audio";
import { storyStages, storyStartHint, storyStartLabel, storyTitle, type StageCheckpoint } from "@/lib/story-config";

type GameMode = "title" | "play" | "ending";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function getCheckpoint(stageIndex: number, motion: number) {
  const stage = storyStages[stageIndex];
  let current = stage.checkpoints[0];

  for (const checkpoint of stage.checkpoints) {
    if (motion >= checkpoint.progress) {
      current = checkpoint;
    }
  }

  return current;
}

function countCollected(checkpointList: StageCheckpoint[], motion: number) {
  return checkpointList.filter(
    (checkpoint) => checkpoint.eventType === "collectible" && checkpoint.progress <= motion,
  ).length;
}

function passiveMotionForStage(stageIndex: number, audioProgress: number) {
  const isLastStage = stageIndex === storyStages.length - 1;
  const cap = isLastStage ? 0.84 : 0.72;
  return Math.min(cap, audioProgress * 0.92);
}

export function RetroGameShell() {
  const [mode, setMode] = useState<GameMode>("title");
  const [activeStage, setActiveStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const [finalTrackEnded, setFinalTrackEnded] = useState(false);

  const playfieldRef = useRef<HTMLElement | null>(null);
  const activeStageRef = useRef(0);
  const stageProgressRef = useRef(0);
  const canAdvanceRef = useRef(false);
  const modeRef = useRef<GameMode>("title");
  const touchYRef = useRef<number | null>(null);
  const moveStageRef = useRef<(direction: number, intensity?: number) => void>(() => {});

  const stage = storyStages[activeStage];
  const started = mode !== "title";
  const stageMotion = clamp(
    Math.max(stageProgress, passiveMotionForStage(activeStage, audioProgress)),
  );
  const currentCheckpoint = useMemo(
    () => getCheckpoint(activeStage, stageMotion),
    [activeStage, stageMotion],
  );
  const collectedCount = useMemo(
    () => countCollected(stage.checkpoints, stageMotion),
    [stage.checkpoints, stageMotion],
  );
  const stageNumberLabel = `${stage.stageLabel} / ${storyStages.length}`;

  const moveStage = (direction: number, intensity = 1) => {
    if (modeRef.current !== "play") return;

    const isForward = direction > 0;
    const step = clamp(intensity) * (isForward ? 0.12 : 0.1);
    const currentStageIndex = activeStageRef.current;
    const lockCeiling = canAdvanceRef.current ? 1 : 0.94;

    if (isForward) {
      if (canAdvanceRef.current && stageProgressRef.current >= 0.94) {
        if (currentStageIndex < storyStages.length - 1) {
          activeStageRef.current = currentStageIndex + 1;
          stageProgressRef.current = 0;
          setActiveStage(currentStageIndex + 1);
          setStageProgress(0);
          setAudioProgress(0);
          return;
        }

        stageProgressRef.current = 1;
        setStageProgress(1);
        setMode("ending");
        modeRef.current = "ending";
        return;
      }

      const nextProgress = Math.min(lockCeiling, stageProgressRef.current + step);
      if (nextProgress !== stageProgressRef.current) {
        stageProgressRef.current = nextProgress;
        setStageProgress(nextProgress);
        return;
      }

      return;
    }

    const previousProgress = Math.max(0, stageProgressRef.current - step);
    if (previousProgress !== stageProgressRef.current) {
      stageProgressRef.current = previousProgress;
      setStageProgress(previousProgress);
      return;
    }

    if (currentStageIndex > 0) {
      activeStageRef.current = currentStageIndex - 1;
      stageProgressRef.current = 0.88;
      setActiveStage(currentStageIndex - 1);
      setStageProgress(0.88);
    }
  };

  const startAdventure = () => {
    setMode("play");
    modeRef.current = "play";
    setActiveStage(0);
    setStageProgress(0);
    setAudioProgress(0);
    setCanAdvance(false);
    setFinalTrackEnded(false);
    activeStageRef.current = 0;
    stageProgressRef.current = 0;
    canAdvanceRef.current = false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (mode !== "play") return;

    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      moveStageRef.current(1, 0.9);
    }

    if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      moveStageRef.current(-1, 0.9);
    }
  };

  useEffect(() => {
    activeStageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    moveStageRef.current = moveStage;
  });

  useEffect(() => {
    stageProgressRef.current = stageProgress;
  }, [stageProgress]);

  useEffect(() => {
    canAdvanceRef.current = canAdvance;
  }, [canAdvance]);

  useEffect(() => {
    modeRef.current = mode;
    if (mode !== "title") {
      playfieldRef.current?.focus();
    }
  }, [mode]);

  useEffect(() => {
    const node = playfieldRef.current;
    if (!node || mode !== "play") return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const intensity = Math.min(1.2, Math.abs(event.deltaY) / 260);
      moveStageRef.current(event.deltaY > 0 ? 1 : -1, intensity);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchYRef.current === null) return;
      const currentY = event.touches[0]?.clientY ?? touchYRef.current;
      const delta = touchYRef.current - currentY;

      if (Math.abs(delta) < 12) return;

      if (event.cancelable) {
        event.preventDefault();
      }

      touchYRef.current = currentY;
      moveStageRef.current(delta > 0 ? 1 : -1, Math.min(1.15, Math.abs(delta) / 110));
    };

    const handleTouchEnd = () => {
      touchYRef.current = null;
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("touchstart", handleTouchStart, { passive: false });
    node.addEventListener("touchmove", handleTouchMove, { passive: false });
    node.addEventListener("touchend", handleTouchEnd);

    return () => {
      node.removeEventListener("wheel", handleWheel);
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
      node.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mode]);

  return (
    <main className="retro-shell">
      {started && (
        <StoryAudio
          activeStage={activeStage}
          started={started}
          onAudioProgress={setAudioProgress}
          onCanAdvanceChange={setCanAdvance}
          onFinalTrackEnded={setFinalTrackEnded}
        />
      )}

      {mode === "title" && (
        <section className="retro-title">
          <div className="retro-title__cabinet">
            <div className="retro-title__topline">
              <span>1UP</span>
              <span>CREDIT 01</span>
            </div>

            <div className="retro-title__screen">
              <div className="retro-title__moon" />
              <div className="retro-title__scanlines" />
              <div className="retro-title__sprite retro-title__sprite--girl">
                <GirlSprite state="moonwatch" scale={2.4} />
              </div>
              <div className="retro-title__sprite retro-title__sprite--hero">
                <HeroSprite frame="stand" scale={1.8} />
              </div>
              <div className="retro-title__logo">
                <span className="retro-title__tag">16-BIT LOVE QUEST</span>
                <h1>{storyTitle}</h1>
                <p>{storyStartHint}</p>
              </div>
              <div className="retro-title__meter">
                <span>MOON</span>
                <div className="retro-title__meter-pieces">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <MoonFragmentSprite key={`start-piece-${index}`} className="retro-title__meter-piece" />
                  ))}
                </div>
              </div>
              <button type="button" className="retro-title__start" onClick={startAdventure}>
                {storyStartLabel}
              </button>
            </div>
          </div>
        </section>
      )}

      {mode !== "title" && (
        <section
          ref={playfieldRef}
          className={`retro-playfield ${mode === "ending" ? "is-ending" : ""}`}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {mode === "play" && (
            <>
              <header className={`retro-hud hud-${currentCheckpoint.hudState}`}>
                <div className="retro-hud__left">
                  <span className="retro-hud__label">{stageNumberLabel}</span>
                  <strong className="retro-hud__title">{stage.stageTitle}</strong>
                </div>

                <div className="retro-hud__meter">
                  <span className="retro-hud__label">MOON</span>
                  <div className="retro-hud__pieces">
                    {Array.from({ length: stage.collectibleTarget }).map((_, index) => (
                      <span
                        key={`${stage.id}-hud-piece-${index}`}
                        className={`retro-hud__piece ${index < collectedCount ? "is-on" : ""}`}
                      >
                        <MoonFragmentSprite className="retro-hud__piece-sprite" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="retro-hud__hearts">
                  {Array.from({ length: stage.hearts }).map((_, index) => (
                    <HeartSprite key={`${stage.id}-heart-${index}`} className="retro-hud__heart" />
                  ))}
                </div>
              </header>

              <StageRenderer
                stage={stage}
                stageIndex={activeStage}
                stageMotion={stageMotion}
                collectedCount={collectedCount}
                currentCheckpoint={currentCheckpoint}
                canAdvance={canAdvance}
              />
            </>
          )}

          {mode === "ending" && (
            <FinalCutscene stage={stage} audioProgress={audioProgress} finalTrackEnded={finalTrackEnded} />
          )}
        </section>
      )}
    </main>
  );
}
