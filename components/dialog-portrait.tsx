"use client";

import { GirlPortraitSprite } from "@/components/pixel-sprites";
import type { DialogBeat } from "@/lib/story-config";

type DialogPortraitProps = {
  beat: DialogBeat;
  stageLabel: string;
  fragmentLabel: string;
  buttonLabel?: string;
  onContinue: () => void;
};

export function DialogPortrait({
  beat,
  stageLabel,
  fragmentLabel,
  buttonLabel = "Continuar",
  onContinue,
}: DialogPortraitProps) {
  return (
    <div className="moon-dialog" role="dialog" aria-modal="true" aria-label={beat.title ?? beat.speaker}>
      <div className="moon-dialog__portrait-shell">
        <div className="moon-dialog__portrait-ring" />
        {beat.portrait ? (
          <GirlPortraitSprite state={beat.portrait} className="moon-dialog__portrait" scale={1.9} />
        ) : (
          <div className="moon-dialog__portrait moon-dialog__portrait--empty" />
        )}
      </div>

      <div className="moon-dialog__body">
        <div className="moon-dialog__meta">
          <span>{stageLabel}</span>
          <span>{fragmentLabel}</span>
        </div>

        <div className="moon-dialog__copy">
          <span className="moon-dialog__speaker">{beat.speaker}</span>
          {beat.title ? <h2>{beat.title}</h2> : null}
          {beat.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <button type="button" className="moon-dialog__button" onClick={onContinue}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

