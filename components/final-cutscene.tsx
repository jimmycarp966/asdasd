"use client";

import { GirlPortraitSprite } from "@/components/pixel-sprites";
import { endingMessage } from "@/lib/story-config";

type FinalCutsceneProps = {
  reveal: number;
  finalTrackEnded: boolean;
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function FinalCutscene({ reveal, finalTrackEnded }: FinalCutsceneProps) {
  const lineOpacity = clamp((reveal - 0.1) / 0.32);
  const sublineOpacity = clamp((reveal - 0.42) / 0.3);
  const badgeOpacity = clamp((reveal - 0.7) / 0.24);

  return (
    <div className="final-overlay" aria-live="polite">
      <div className="final-overlay__card">
        <div className="final-overlay__badge" style={{ opacity: badgeOpacity }}>
          <GirlPortraitSprite state="moonwatch" className="final-overlay__badge-art" scale={1.35} />
        </div>
        <span className="final-overlay__title">{endingMessage.title}</span>
        <p className="final-overlay__line" style={{ opacity: lineOpacity }}>
          {endingMessage.line}
        </p>
        <p className="final-overlay__subline" style={{ opacity: sublineOpacity }}>
          {endingMessage.subline}
        </p>
        {finalTrackEnded ? <span className="final-overlay__ending">La escena se queda con ustedes dos.</span> : null}
      </div>
    </div>
  );
}

