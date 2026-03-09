"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DialogPortrait } from "@/components/dialog-portrait";
import { FinalCutscene } from "@/components/final-cutscene";
import { GirlPortraitSprite, MoonFragmentSprite } from "@/components/pixel-sprites";
import {
  type DialogBeat,
  gameStages,
  getStageProgress,
  stageCount,
  storyStartHint,
  storyStartLabel,
  storyTitle,
} from "@/lib/story-config";
import {
  StageRenderer,
  type StageRendererHandle,
} from "@/components/stage-renderer";
import { StoryAudio } from "@/components/story-audio";

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => void;
  }
}

type GameMode = "title" | "playing" | "cutscene";

type ActiveDialog = {
  beat: DialogBeat;
  buttonLabel?: string;
  kind: "interaction" | "exit";
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function RetroGameShell() {
  const [mode, setMode] = useState<GameMode>("title");
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [interactedIds, setInteractedIds] = useState<string[]>([]);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const [muted, setMuted] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [finalTrackEnded, setFinalTrackEnded] = useState(false);
  const [cutsceneSeconds, setCutsceneSeconds] = useState(0);

  const canvasRef = useRef<StageRendererHandle | null>(null);
  const cutsceneRafRef = useRef<number | null>(null);
  const cutsceneLastFrameRef = useRef<number | null>(null);

  const stage = gameStages[activeStageIndex]!;
  const stageProgress = useMemo(() => getStageProgress(stage, interactedIds), [interactedIds, stage]);
  const started = mode !== "title";
  const dialogueOpen = activeDialog !== null;
  const cutsceneReveal = clamp(Math.max(audioProgress, finalTrackEnded ? 1 : cutsceneSeconds / 5.5));
  const stageLabel = `${stage.label} / ${stageCount}`;
  const fragmentLabel = `${stageProgress.collected}/${stage.fragmentCount} fragmentos`;

  const startAdventure = () => {
    setMode("playing");
    setActiveStageIndex(0);
    setInteractedIds([]);
    setActiveDialog(null);
    setAudioProgress(0);
    setFinalTrackEnded(false);
    setCutsceneSeconds(0);
  };

  const handleInteract = (interactionId: string) => {
    if (activeDialog) return;
    const interaction = stage.interactables.find((item) => item.id === interactionId);
    if (!interaction) return;

    setInteractedIds((current) => {
      if (current.includes(interactionId)) return current;
      return [...current, interactionId];
    });
    setActiveDialog({
      beat: interaction.dialog,
      kind: "interaction",
    });
  };

  const handleExit = () => {
    if (activeDialog) return;
    if (!stageProgress.isComplete) return;

    setActiveDialog({
      beat: stage.exitDialog,
      buttonLabel: stage.exitDialog.buttonLabel,
      kind: "exit",
    });
  };

  const advanceStage = () => {
    if (activeStageIndex >= gameStages.length - 1) {
      setMode("cutscene");
      setCutsceneSeconds(0);
      setAudioProgress(0);
      setFinalTrackEnded(false);
      return;
    }

    setActiveStageIndex((current) => current + 1);
    setInteractedIds([]);
    setActiveDialog(null);
    setAudioProgress(0);
    setFinalTrackEnded(false);
  };

  const continueDialog = () => {
    if (!activeDialog) return;

    if (activeDialog.kind === "exit") {
      setActiveDialog(null);
      advanceStage();
      return;
    }

    setActiveDialog(null);
  };

  useEffect(() => {
    if (mode !== "cutscene") {
      if (cutsceneRafRef.current !== null) {
        window.cancelAnimationFrame(cutsceneRafRef.current);
        cutsceneRafRef.current = null;
      }
      cutsceneLastFrameRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (cutsceneLastFrameRef.current === null) {
        cutsceneLastFrameRef.current = timestamp;
      }

      const delta = Math.min(32, timestamp - cutsceneLastFrameRef.current);
      cutsceneLastFrameRef.current = timestamp;
      setCutsceneSeconds((current) => current + delta / 1000);
      canvasRef.current?.advanceTime(delta);
      cutsceneRafRef.current = window.requestAnimationFrame(tick);
    };

    cutsceneRafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (cutsceneRafRef.current !== null) {
        window.cancelAnimationFrame(cutsceneRafRef.current);
        cutsceneRafRef.current = null;
      }
      cutsceneLastFrameRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    window.render_game_to_text = () => {
      const canvasState = canvasRef.current?.getSnapshot() ?? null;
      const payload = {
        mode,
        stage: {
          id: stage.id,
          label: stage.label,
          title: stage.stageTitle,
        },
        audioProgress: Number(audioProgress.toFixed(3)),
        muted,
        fragments: {
          collected: stageProgress.collected,
          total: stage.fragmentCount,
          exitOpen: stageProgress.isComplete,
        },
        dialog: activeDialog
          ? {
              speaker: activeDialog.beat.speaker,
              title: activeDialog.beat.title ?? null,
              lines: activeDialog.beat.lines,
            }
          : null,
        canvas: canvasState,
      };

      return JSON.stringify(payload);
    };

    window.advanceTime = (ms: number) => {
      canvasRef.current?.advanceTime(ms);
      if (mode === "cutscene") {
        setCutsceneSeconds((current) => current + ms / 1000);
      }
    };

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [activeDialog, audioProgress, mode, muted, stage, stageProgress]);

  return (
    <main className="moon-story-shell">
      {started ? (
        <StoryAudio
          activeStage={activeStageIndex}
          started={started}
          muted={muted}
          onAudioProgress={setAudioProgress}
          onFinalTrackEnded={setFinalTrackEnded}
        />
      ) : null}

      {mode === "title" ? (
        <section className="title-screen">
          <div className="title-screen__frame">
            <div className="title-screen__spark title-screen__spark--left" />
            <div className="title-screen__spark title-screen__spark--right" />

            <div className="title-screen__badge">
              <div className="title-screen__badge-ring" />
              <GirlPortraitSprite state="icon" className="title-screen__portrait" scale={1.8} />
            </div>

            <div className="title-screen__copy">
              <span className="title-screen__eyebrow">Pixel moon quest</span>
              <h1>{storyTitle}</h1>
              <p>{storyStartHint}</p>
            </div>

            <div className="title-screen__orbit">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={`moon-piece-${index}`} className={`title-screen__orbit-piece orbit-${index + 1}`}>
                  <MoonFragmentSprite className="title-screen__orbit-icon" scale={1.1} />
                </span>
              ))}
            </div>

            <button type="button" className="title-screen__start" onClick={startAdventure}>
              {storyStartLabel}
            </button>
          </div>
        </section>
      ) : (
        <section className="game-shell">
          <div className="game-shell__frame">
            <header className="game-shell__hud">
              <div className="game-shell__hud-block">
                <span className="game-shell__eyebrow">{stageLabel}</span>
                <strong>{stage.stageTitle}</strong>
              </div>

              <div className="game-shell__meter">
                <span className="game-shell__eyebrow">Moon</span>
                <div className="game-shell__fragments" aria-label={fragmentLabel}>
                  {Array.from({ length: stage.fragmentCount }).map((_, index) => (
                    <span
                      key={`${stage.id}-fragment-${index}`}
                      className={`game-shell__fragment ${index < stageProgress.collected ? "is-collected" : ""}`}
                    >
                      <MoonFragmentSprite className="game-shell__fragment-icon" scale={1.05} />
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="game-shell__mute"
                onClick={() => setMuted((current) => !current)}
              >
                {muted ? "Unmute" : "Mute"}
              </button>
            </header>

            <div className="game-shell__canvas-wrap">
              <StageRenderer
                ref={canvasRef}
                stage={stage}
                interactedIds={interactedIds}
                dialogueOpen={dialogueOpen}
                mode={mode === "cutscene" ? "cutscene" : "playing"}
                cutsceneReveal={cutsceneReveal}
                onInteract={handleInteract}
                onExit={handleExit}
              />

              {mode === "cutscene" ? (
                <FinalCutscene reveal={cutsceneReveal} finalTrackEnded={finalTrackEnded} />
              ) : null}
            </div>

            <footer className="game-shell__story-card">
              <span className="game-shell__eyebrow">{stage.track.title}</span>
              <p>{stage.introLine}</p>
              <div className="game-shell__story-footer">
                <span>{fragmentLabel}</span>
                <span>{stageProgress.isComplete ? "Salida abierta" : "La luna sigue juntandose"}</span>
              </div>
            </footer>
          </div>

          {activeDialog ? (
            <DialogPortrait
              beat={activeDialog.beat}
              stageLabel={stage.label}
              fragmentLabel={fragmentLabel}
              buttonLabel={activeDialog.buttonLabel}
              onContinue={continueDialog}
            />
          ) : null}
        </section>
      )}
    </main>
  );
}
