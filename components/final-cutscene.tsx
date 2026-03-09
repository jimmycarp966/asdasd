"use client";

import type { CSSProperties } from "react";
import { GirlSprite, HeroSprite } from "@/components/pixel-sprites";
import { finalMessage, type StoryStage } from "@/lib/story-config";

type FinalCutsceneProps = {
  stage: StoryStage;
  audioProgress: number;
  finalTrackEnded: boolean;
};

const cutsceneStars = [
  { top: "15%", left: "10%" },
  { top: "18%", left: "30%" },
  { top: "12%", left: "54%" },
  { top: "22%", left: "73%" },
  { top: "28%", left: "18%" },
  { top: "33%", left: "61%" },
  { top: "39%", left: "82%" },
];

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function FinalCutscene({
  stage,
  audioProgress,
  finalTrackEnded,
}: FinalCutsceneProps) {
  const reveal = clamp(Math.max(audioProgress, finalTrackEnded ? 1 : 0.66));
  const lineOpacity = clamp((reveal - 0.15) / 0.5);
  const sublineOpacity = clamp((reveal - 0.42) / 0.45);
  const endOpacity = clamp((reveal - 0.8) / 0.2);
  const glowOpacity = clamp((reveal - 0.22) / 0.45);

  return (
    <section
      className="final-cutscene"
      style={
        {
          ["--stage-sky-top" as string]: stage.palette.skyTop,
          ["--stage-sky-bottom" as string]: stage.palette.skyBottom,
          ["--stage-accent" as string]: stage.palette.accent,
          ["--stage-moon" as string]: stage.palette.moon,
          ["--stage-ui" as string]: stage.palette.ui,
        } as CSSProperties
      }
    >
      <div className="final-cutscene__scanlines" />
      <div className="final-cutscene__stars" aria-hidden="true">
        {cutsceneStars.map((star, index) => (
          <span
            key={`${star.top}-${star.left}-${index}`}
            className="final-cutscene__star"
            style={{ top: star.top, left: star.left, opacity: 0.34 + (index % 3) * 0.16 }}
          />
        ))}
      </div>
      <div className="final-cutscene__moon" />
      <div className="final-cutscene__moon-ring" />
      <div className="final-cutscene__beam" />
      <div className="final-cutscene__haze" />

      <div className="final-cutscene__ground" />

      <div className="final-cutscene__hero-shadow" />

      <div className="final-cutscene__hero">
        <HeroSprite frame="stand" className="final-cutscene__sprite" scale={1.85} />
      </div>

      <div className="final-cutscene__girl">
        <div className="final-cutscene__girl-aura" style={{ opacity: glowOpacity }} />
        <GirlSprite
          state="radiant"
          className="final-cutscene__sprite final-cutscene__sprite--echo"
          scale={2.28}
        />
        <GirlSprite state="moonwatch" className="final-cutscene__sprite" scale={2.2} />
      </div>

      <div className="final-cutscene__text-box">
        <span className="final-cutscene__title">{finalMessage.title}</span>
        <p className="final-cutscene__line" style={{ opacity: lineOpacity }}>
          {finalMessage.line}
        </p>
        <p className="final-cutscene__subline" style={{ opacity: sublineOpacity }}>
          {finalMessage.subline}
        </p>
        <span className="final-cutscene__ending" style={{ opacity: endOpacity }}>
          THE END
        </span>
      </div>
    </section>
  );
}
