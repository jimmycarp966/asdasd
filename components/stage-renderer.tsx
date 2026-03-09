"use client";

import type { CSSProperties } from "react";
import {
  GirlSprite,
  HeroSprite,
  MoonFragmentSprite,
} from "@/components/pixel-sprites";
import type { StageCheckpoint, StoryStage, StageTheme } from "@/lib/story-config";

type StageRendererProps = {
  stage: StoryStage;
  stageIndex: number;
  stageMotion: number;
  collectedCount: number;
  currentCheckpoint: StageCheckpoint;
  canAdvance: boolean;
};

type Platform = {
  x: number;
  y: number;
  w: number;
  h?: number;
  glow?: boolean;
};

type Building = {
  x: number;
  w: number;
  h: number;
  tone: "dark" | "mid" | "light";
};

type Sign = {
  x: number;
  y: number;
  text: string;
  style: "gold" | "pink" | "cyan";
};

type CollectibleSpot = {
  x: number;
  y: number;
};

type PresenceEcho = {
  x: number;
  y: number;
  scale: number;
  appearAt: number;
  state: "silhouette" | "distant" | "partial" | "smile" | "radiant" | "moonwatch";
};

const starField = [
  { top: "12%", left: "6%" },
  { top: "18%", left: "18%" },
  { top: "24%", left: "39%" },
  { top: "16%", left: "58%" },
  { top: "20%", left: "76%" },
  { top: "28%", left: "92%" },
  { top: "36%", left: "24%" },
  { top: "42%", left: "12%" },
  { top: "48%", left: "73%" },
  { top: "58%", left: "52%" },
  { top: "64%", left: "84%" },
  { top: "70%", left: "17%" },
];

const platformsByTheme: Record<StageTheme, Platform[]> = {
  rooftops: [
    { x: 6, y: 16, w: 16 },
    { x: 26, y: 28, w: 12 },
    { x: 41, y: 20, w: 16, glow: true },
    { x: 62, y: 33, w: 12 },
    { x: 78, y: 24, w: 18 },
    { x: 103, y: 36, w: 12 },
    { x: 120, y: 22, w: 18 },
    { x: 146, y: 31, w: 13, glow: true },
  ],
  circuit: [
    { x: 8, y: 16, w: 18, glow: true },
    { x: 31, y: 28, w: 12 },
    { x: 48, y: 18, w: 18 },
    { x: 73, y: 32, w: 14, glow: true },
    { x: 92, y: 21, w: 18 },
    { x: 118, y: 34, w: 12 },
    { x: 136, y: 24, w: 16, glow: true },
    { x: 158, y: 39, w: 10 },
  ],
  rare: [
    { x: 6, y: 18, w: 16 },
    { x: 27, y: 28, w: 14, glow: true },
    { x: 47, y: 22, w: 14 },
    { x: 66, y: 38, w: 16, glow: true },
    { x: 88, y: 26, w: 14 },
    { x: 108, y: 42, w: 14, glow: true },
    { x: 128, y: 30, w: 17 },
    { x: 151, y: 46, w: 12, glow: true },
  ],
  "final-run": [
    { x: 6, y: 16, w: 20 },
    { x: 32, y: 24, w: 14 },
    { x: 51, y: 18, w: 18 },
    { x: 75, y: 30, w: 14 },
    { x: 94, y: 20, w: 16 },
    { x: 116, y: 34, w: 13 },
    { x: 135, y: 24, w: 19 },
    { x: 160, y: 16, w: 14, glow: true },
  ],
};

const buildingsByTheme: Record<StageTheme, Building[]> = {
  rooftops: [
    { x: 0, w: 13, h: 38, tone: "dark" },
    { x: 14, w: 10, h: 52, tone: "mid" },
    { x: 27, w: 13, h: 44, tone: "dark" },
    { x: 44, w: 12, h: 57, tone: "mid" },
    { x: 58, w: 11, h: 41, tone: "light" },
    { x: 73, w: 12, h: 64, tone: "dark" },
    { x: 88, w: 13, h: 48, tone: "mid" },
    { x: 104, w: 12, h: 58, tone: "dark" },
    { x: 121, w: 14, h: 44, tone: "mid" },
    { x: 140, w: 12, h: 62, tone: "light" },
    { x: 155, w: 13, h: 47, tone: "dark" },
  ],
  circuit: [
    { x: 0, w: 14, h: 40, tone: "dark" },
    { x: 17, w: 13, h: 57, tone: "light" },
    { x: 33, w: 12, h: 48, tone: "mid" },
    { x: 50, w: 13, h: 65, tone: "light" },
    { x: 68, w: 11, h: 53, tone: "dark" },
    { x: 84, w: 15, h: 70, tone: "light" },
    { x: 103, w: 12, h: 46, tone: "mid" },
    { x: 120, w: 14, h: 62, tone: "dark" },
    { x: 139, w: 13, h: 55, tone: "light" },
    { x: 156, w: 12, h: 68, tone: "mid" },
  ],
  rare: [
    { x: 0, w: 14, h: 32, tone: "dark" },
    { x: 18, w: 15, h: 45, tone: "mid" },
    { x: 39, w: 12, h: 37, tone: "dark" },
    { x: 56, w: 17, h: 54, tone: "light" },
    { x: 79, w: 13, h: 41, tone: "mid" },
    { x: 98, w: 15, h: 60, tone: "dark" },
    { x: 120, w: 14, h: 48, tone: "light" },
    { x: 141, w: 15, h: 66, tone: "mid" },
  ],
  "final-run": [
    { x: 0, w: 18, h: 28, tone: "dark" },
    { x: 24, w: 14, h: 42, tone: "mid" },
    { x: 43, w: 15, h: 36, tone: "dark" },
    { x: 64, w: 17, h: 55, tone: "light" },
    { x: 86, w: 14, h: 40, tone: "dark" },
    { x: 108, w: 16, h: 52, tone: "mid" },
    { x: 130, w: 17, h: 44, tone: "dark" },
    { x: 154, w: 16, h: 60, tone: "light" },
  ],
};

const signsByTheme: Record<StageTheme, Sign[]> = {
  rooftops: [
    { x: 41, y: 41, text: "LUNA", style: "gold" },
    { x: 102, y: 48, text: "JUMP", style: "cyan" },
  ],
  circuit: [
    { x: 37, y: 44, text: "SMILE", style: "pink" },
    { x: 92, y: 50, text: "PIXEL", style: "cyan" },
    { x: 146, y: 46, text: "LOVE", style: "gold" },
  ],
  rare: [
    { x: 30, y: 45, text: "RARE", style: "gold" },
    { x: 87, y: 53, text: "UNICA", style: "pink" },
    { x: 138, y: 57, text: "MOON", style: "cyan" },
  ],
  "final-run": [
    { x: 52, y: 42, text: "FINAL", style: "gold" },
    { x: 132, y: 54, text: "LOOK", style: "cyan" },
  ],
};

const collectiblesByTheme: Record<StageTheme, CollectibleSpot[]> = {
  rooftops: [
    { x: 18, y: 42 },
    { x: 52, y: 50 },
    { x: 90, y: 44 },
    { x: 150, y: 54 },
  ],
  circuit: [
    { x: 22, y: 44 },
    { x: 64, y: 52 },
    { x: 109, y: 47 },
    { x: 152, y: 58 },
  ],
  rare: [
    { x: 19, y: 46 },
    { x: 58, y: 54 },
    { x: 103, y: 50 },
    { x: 150, y: 61 },
  ],
  "final-run": [
    { x: 34, y: 43 },
    { x: 89, y: 50 },
    { x: 145, y: 58 },
  ],
};

const moonPieceAnchors = [
  { x: "-16%", y: "14%" },
  { x: "74%", y: "8%" },
  { x: "68%", y: "70%" },
  { x: "-10%", y: "62%" },
];

const presenceEchoesByTheme: Record<StageTheme, PresenceEcho[]> = {
  rooftops: [
    { x: 53, y: 46, scale: 0.88, appearAt: 0.05, state: "silhouette" },
    { x: 83, y: 39, scale: 1.04, appearAt: 0.22, state: "distant" },
  ],
  circuit: [
    { x: 42, y: 44, scale: 0.96, appearAt: 0.06, state: "partial" },
    { x: 91, y: 37, scale: 1.12, appearAt: 0.24, state: "smile" },
  ],
  rare: [
    { x: 48, y: 46, scale: 1, appearAt: 0.08, state: "smile" },
    { x: 102, y: 40, scale: 1.18, appearAt: 0.28, state: "radiant" },
  ],
  "final-run": [
    { x: 112, y: 34, scale: 1.16, appearAt: 0.16, state: "moonwatch" },
  ],
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function stageStyle(stage: StoryStage): CSSProperties {
  return {
    ["--stage-sky-top" as string]: stage.palette.skyTop,
    ["--stage-sky-bottom" as string]: stage.palette.skyBottom,
    ["--stage-accent" as string]: stage.palette.accent,
    ["--stage-moon" as string]: stage.palette.moon,
    ["--stage-platform" as string]: stage.palette.platform,
    ["--stage-neon" as string]: stage.palette.neon,
    ["--stage-haze" as string]: stage.palette.haze,
    ["--stage-ui" as string]: stage.palette.ui,
  };
}

function heroFrameForMotion(stageMotion: number, canAdvance: boolean, theme: StageTheme) {
  if (theme === "final-run" && canAdvance && stageMotion > 0.88) {
    return "stand";
  }

  if (Math.floor(stageMotion * 10) % 4 === 2) return "jump";
  if (Math.floor(stageMotion * 16) % 2 === 0) return "run-a";
  return "run-b";
}

function girlPlacement(theme: StageTheme, stageMotion: number) {
  switch (theme) {
    case "rooftops":
      return {
        left: `${74 + stageMotion * 16}%`,
        bottom: `${34 + stageMotion * 10}%`,
        scale: 1.35,
        opacity: clamp((stageMotion - 0.2) / 0.28),
      };
    case "circuit":
      return {
        left: `${68 + stageMotion * 10}%`,
        bottom: `${28 + stageMotion * 6}%`,
        scale: 1.55,
        opacity: clamp(0.55 + stageMotion * 0.55),
      };
    case "rare":
      return {
        left: `${78 + stageMotion * 6}%`,
        bottom: `${31 + stageMotion * 7}%`,
        scale: 1.72,
        opacity: clamp(0.5 + stageMotion * 0.6),
      };
    case "final-run":
      return {
        left: "146%",
        bottom: "33%",
        scale: 1.7,
        opacity: clamp(0.88 + stageMotion * 0.12),
      };
  }
}

function farEchoOpacity(theme: StageTheme, stageMotion: number) {
  if (theme === "rooftops") return clamp((stageMotion - 0.18) / 0.32);
  if (theme === "circuit") return clamp(0.18 + stageMotion * 0.36);
  if (theme === "rare") return clamp(0.1 + stageMotion * 0.3);
  return 0;
}

export function StageRenderer({
  stage,
  stageMotion,
  collectedCount,
  currentCheckpoint,
  canAdvance,
}: StageRendererProps) {
  const trackShift = 6 + stageMotion * 47;
  const heroFrame = heroFrameForMotion(stageMotion, canAdvance, stage.backgroundTheme);
  const heroLift = heroFrame === "jump" ? 16 : (Math.floor(stageMotion * 18) % 2) * 6;
  const moonCompletion = collectedCount / Math.max(1, stage.collectibleTarget);
  const girl = girlPlacement(stage.backgroundTheme, stageMotion);
  const gateOpen = canAdvance && stageMotion > 0.86;

  return (
    <section
      className={`retro-stage retro-stage--${stage.backgroundTheme}`}
      style={stageStyle(stage)}
      aria-label={`${stage.stageLabel} ${stage.stageTitle}`}
    >
      <div className="retro-stage__scanlines" />
      <div className="retro-stage__noise" />
      <div className="retro-stage__sky">
        {starField.map((star, index) => (
          <span
            key={`${star.top}-${star.left}-${index}`}
            className="retro-stage__star"
            style={{
              top: star.top,
              left: star.left,
              opacity: 0.34 + (index % 3) * 0.16 + moonCompletion * 0.1,
            }}
          />
        ))}
      </div>

      <div
        className="retro-stage__moon-shell"
        style={{
          transform: `translate3d(${stageMotion * 3}%, ${-stageMotion * 2}%, 0) scale(${0.92 + moonCompletion * 0.2})`,
        }}
      >
        <div
          className="retro-stage__moon-core"
          style={{
            opacity: 0.28 + moonCompletion * 0.72,
          }}
        />
        {moonPieceAnchors.slice(0, stage.collectibleTarget).map((piece, index) => {
          const gathered = index < collectedCount;
          return (
            <span
              key={`${piece.x}-${piece.y}-${index}`}
              className={`retro-stage__moon-piece ${gathered ? "is-gathered" : ""}`}
              style={
                {
                  ["--piece-x" as string]: piece.x,
                  ["--piece-y" as string]: piece.y,
                } as CSSProperties
              }
            >
              <MoonFragmentSprite className="retro-stage__moon-piece-sprite" />
            </span>
          );
        })}
      </div>

      <div
        className="retro-stage__track"
        style={{ transform: `translate3d(-${trackShift}%, 0, 0)` }}
      >
        <div className="retro-stage__backdrop">
          {buildingsByTheme[stage.backgroundTheme].map((building, index) => (
            <span
              key={`${building.x}-${building.w}-${index}`}
              className={`retro-stage__building tone-${building.tone}`}
              style={{
                left: `${building.x}%`,
                width: `${building.w}%`,
                height: `${building.h}%`,
              }}
            />
          ))}
        </div>

        <div className={`retro-stage__parallax retro-stage__parallax--${stage.backgroundTheme}`} />

        {platformsByTheme[stage.backgroundTheme].map((platform, index) => (
          <span
            key={`${platform.x}-${platform.y}-${index}`}
            className={`retro-stage__platform ${platform.glow ? "is-glow" : ""}`}
            style={{
              left: `${platform.x}%`,
              bottom: `${platform.y}%`,
              width: `${platform.w}%`,
              height: `${platform.h ?? 5}%`,
            }}
          />
        ))}

        {signsByTheme[stage.backgroundTheme].map((sign, index) => (
          <span
            key={`${sign.text}-${index}`}
            className={`retro-stage__sign sign-${sign.style}`}
            style={{
              left: `${sign.x}%`,
              bottom: `${sign.y}%`,
            }}
          >
            {sign.text}
          </span>
        ))}

        {collectiblesByTheme[stage.backgroundTheme]
          .slice(0, stage.collectibleTarget)
          .map((spot, index) => (
            <span
              key={`${spot.x}-${spot.y}-${index}`}
              className={`retro-stage__collectible ${index < collectedCount ? "is-collected" : ""}`}
              style={{
                left: `${spot.x}%`,
                bottom: `${spot.y}%`,
              }}
            >
              <MoonFragmentSprite className="retro-stage__collectible-sprite" />
            </span>
          ))}

        {presenceEchoesByTheme[stage.backgroundTheme].map((echo, index) => (
          <span
            key={`presence-${stage.backgroundTheme}-${index}`}
            className="retro-stage__presence"
            style={{
              left: `${echo.x}%`,
              bottom: `${echo.y}%`,
              opacity: clamp((stageMotion - echo.appearAt) / 0.22) * (0.46 + index * 0.14),
            }}
          >
            <GirlSprite
              state={echo.state}
              className="retro-stage__sprite retro-stage__sprite--presence"
              scale={echo.scale}
            />
          </span>
        ))}

        <span
          className="retro-stage__girl-echo"
          style={{
            left: `${girl.left}`,
            bottom: `${parseFloat(girl.bottom) + 11}%`,
            opacity: farEchoOpacity(stage.backgroundTheme, stageMotion),
          }}
        >
          <GirlSprite state="silhouette" className="retro-stage__sprite retro-stage__sprite--echo" />
        </span>

        <span
          className="retro-stage__girl"
          style={{
            left: girl.left,
            bottom: girl.bottom,
            opacity: girl.opacity,
          }}
        >
          <GirlSprite
            state={currentCheckpoint.spriteState}
            className="retro-stage__sprite retro-stage__sprite--girl"
            scale={girl.scale}
          />
        </span>

        <span className={`retro-stage__gate ${gateOpen ? "is-open" : ""}`}>
          <span className="retro-stage__gate-label">
            {gateOpen ? "GOAL OPEN" : "LOCKED"}
          </span>
        </span>
      </div>

      <div
        className={`retro-stage__hero ${gateOpen ? "is-ready" : ""}`}
        style={{
          transform: `translate3d(0, -${heroLift}px, 0)`,
        }}
      >
        <HeroSprite className="retro-stage__sprite retro-stage__sprite--hero" frame={heroFrame} scale={1.8} />
      </div>

    </section>
  );
}
