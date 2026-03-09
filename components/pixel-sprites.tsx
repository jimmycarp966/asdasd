"use client";

import type { CSSProperties } from "react";
import type { GirlPortraitState, GirlWorldState } from "@/lib/story-config";

type SpriteProps = {
  className?: string;
  scale?: number;
};

const portraitThemes: Record<
  GirlPortraitState,
  {
    halo: string;
    haloSoft: string;
    hoodie: string;
    hoodieShadow: string;
    blush: string;
    highlight: string;
  }
> = {
  icon: {
    halo: "#6f87ff",
    haloSoft: "#8cf3ff",
    hoodie: "#576cf4",
    hoodieShadow: "#3046b3",
    blush: "#ff7da8",
    highlight: "#fff6c7",
  },
  soft: {
    halo: "#7ea2ff",
    haloSoft: "#8ef7ff",
    hoodie: "#6074ff",
    hoodieShadow: "#394eba",
    blush: "#ff87ae",
    highlight: "#fff7d4",
  },
  smile: {
    halo: "#9c8fff",
    haloSoft: "#ffd774",
    hoodie: "#6480ff",
    hoodieShadow: "#3d55bf",
    blush: "#ff75a3",
    highlight: "#fff3c4",
  },
  radiant: {
    halo: "#ffb768",
    haloSoft: "#ffe27d",
    hoodie: "#6887ff",
    hoodieShadow: "#415cc7",
    blush: "#ff6698",
    highlight: "#fff0bc",
  },
  moonwatch: {
    halo: "#ffd47b",
    haloSoft: "#fff0ad",
    hoodie: "#6f8cff",
    hoodieShadow: "#4761cd",
    blush: "#ff78a7",
    highlight: "#fff4ca",
  },
};

const worldThemes: Record<
  GirlWorldState,
  {
    halo: string;
    hoodie: string;
    hoodieShadow: string;
    blush: string;
  }
> = {
  distant: {
    halo: "#8af2ff",
    hoodie: "#536ef0",
    hoodieShadow: "#3149b1",
    blush: "#ff88ae",
  },
  soft: {
    halo: "#8ef6ff",
    hoodie: "#6177ff",
    hoodieShadow: "#4056c1",
    blush: "#ff91b3",
  },
  smile: {
    halo: "#ffd46d",
    hoodie: "#6781ff",
    hoodieShadow: "#435ec9",
    blush: "#ff7aa6",
  },
  radiant: {
    halo: "#ffd067",
    hoodie: "#6d89ff",
    hoodieShadow: "#4b65ce",
    blush: "#ff6c9b",
  },
  moonwatch: {
    halo: "#ffe396",
    hoodie: "#7691ff",
    hoodieShadow: "#4d67d3",
    blush: "#ff79a4",
  },
};

function spriteTransform(scale = 1): CSSProperties {
  return {
    transform: `scale(${scale})`,
    transformOrigin: "center center",
  };
}

function GirlFace({
  hoodie,
  hoodieShadow,
  blush,
  looking = "front",
}: {
  hoodie: string;
  hoodieShadow: string;
  blush: string;
  looking?: "front" | "moon";
}) {
  const eyeX = looking === "moon" ? 62 : 47;
  const eye2X = looking === "moon" ? 72 : 71;
  const mouthX = looking === "moon" ? 62 : 58;

  return (
    <>
      <path d="M26 92 C30 73 42 64 60 64 C79 64 91 74 94 92 L89 108 L31 108 Z" fill={hoodieShadow} />
      <path d="M28 90 C33 75 43 69 60 69 C77 69 88 76 92 90 L87 112 L33 112 Z" fill={hoodie} />
      <ellipse cx="60" cy="53" rx="25" ry="27" fill="#f5cfb1" />
      <ellipse cx="60" cy="18" rx="32" ry="21" fill="#1a1028" />
      <path d="M31 34 C33 17 44 7 61 7 C78 7 90 19 89 40 L83 36 C82 24 74 17 62 16 C49 16 41 22 39 36 Z" fill="#1a1028" />
      <path d="M35 28 C37 14 46 9 55 10 C48 17 46 29 47 41 L36 42 Z" fill="#32165c" opacity="0.9" />
      <rect x="32" y="42" width="10" height="38" rx="5" fill="#1a1028" />
      <rect x="78" y="42" width="11" height="42" rx="5" fill="#1a1028" />
      <ellipse cx={eyeX} cy="52" rx="3" ry="3.4" fill="#140b21" />
      <ellipse cx={eye2X} cy="51" rx="2.8" ry="3.1" fill="#140b21" />
      <ellipse cx="46" cy="61" rx="5.5" ry="3.2" fill={blush} opacity="0.22" />
      <ellipse cx="77" cy="61" rx="5.5" ry="3.2" fill={blush} opacity="0.24" />
      <path
        d={looking === "moon" ? "M58 68 C62 71 66 71 70 68" : "M51 69 C56 74 63 74 69 69"}
        stroke="#ff73a0"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x={mouthX - 7} y="69" width="14" height="3.6" rx="1.8" fill="#fffaf6" />
      <line x1={mouthX - 1} y1="69" x2={mouthX - 1} y2="72.6" stroke="#cad7ff" strokeWidth="1.2" />
      <line x1={mouthX + 3} y1="69" x2={mouthX + 3} y2="72.6" stroke="#cad7ff" strokeWidth="1.2" />
      <circle cx="86" cy="58" r="2.6" fill="#fff8dd" />
      <circle cx="87" cy="59" r="1.2" fill="#d8e5ff" />
    </>
  );
}

export function GirlPortraitSprite({ state, className, scale = 1 }: { state: GirlPortraitState } & SpriteProps) {
  const theme = portraitThemes[state];
  const looking = state === "moonwatch" ? "moon" : "front";

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={spriteTransform(scale)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`portrait-halo-${state}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={theme.haloSoft} stopOpacity="0.95" />
          <stop offset="54%" stopColor={theme.halo} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1c1030" stopOpacity="0.92" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill={`url(#portrait-halo-${state})`} />
      <circle cx="60" cy="60" r="51" fill="rgba(24,12,42,0.38)" />
      <circle cx="78" cy="35" r="15" fill={theme.highlight} opacity="0.28" />
      <circle cx="31" cy="31" r="10" fill="#ffffff" opacity="0.08" />
      <g transform={looking === "moon" ? "translate(1 -1)" : undefined}>
        <GirlFace hoodie={theme.hoodie} hoodieShadow={theme.hoodieShadow} blush={theme.blush} looking={looking} />
      </g>
    </svg>
  );
}

export function GirlWorldSprite({ state, className, scale = 1 }: { state: GirlWorldState } & SpriteProps) {
  const theme = worldThemes[state];
  const looking = state === "moonwatch" ? "moon" : "front";

  return (
    <svg
      viewBox="0 0 88 104"
      className={className}
      style={spriteTransform(scale)}
      aria-hidden="true"
    >
      <ellipse cx="44" cy="89" rx="18" ry="7" fill="rgba(12,7,22,0.22)" />
      <ellipse cx="44" cy="49" rx="26" ry="32" fill={theme.halo} opacity="0.18" />
      <path d="M22 81 C25 62 34 56 44 56 C56 56 64 62 67 81 L61 99 L28 99 Z" fill={theme.hoodieShadow} />
      <path d="M24 79 C27 63 35 59 44 59 C55 59 62 64 65 79 L59 100 L29 100 Z" fill={theme.hoodie} />
      <ellipse cx="44" cy="39" rx="20" ry="22" fill="#f4ccaf" />
      <ellipse cx="44" cy="15" rx="25" ry="16" fill="#190f28" />
      <path d="M24 28 C27 13 35 7 46 7 C57 7 66 15 65 31 L59 28 C57 19 52 14 45 14 C36 14 30 20 28 30 Z" fill="#190f28" />
      <rect x="23" y="31" width="8" height="29" rx="4" fill="#190f28" />
      <rect x="57" y="32" width="8" height="32" rx="4" fill="#190f28" />
      <ellipse cx={looking === "moon" ? 46 : 38} cy="39" rx="2.4" ry="2.7" fill="#140a21" />
      <ellipse cx={looking === "moon" ? 54 : 50} cy="38" rx="2.2" ry="2.5" fill="#140a21" />
      <path
        d={looking === "moon" ? "M42 52 C45 55 49 55 52 52" : "M35 52 C39 56 45 56 50 52"}
        stroke={theme.blush}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <rect x={looking === "moon" ? 42 : 36} y="52" width="12" height="2.8" rx="1.4" fill="#fffaf6" />
      <circle cx="64" cy="45" r="2" fill="#fff8dd" />
    </svg>
  );
}

export function MoonFragmentSprite({ className, scale = 1 }: SpriteProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      style={spriteTransform(scale)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fragment-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff0b0" />
          <stop offset="100%" stopColor="#ffc95f" />
        </linearGradient>
      </defs>
      <path
        d="M24 6 C31 8 38 15 39 23 C39 33 32 40 23 41 C14 40 8 33 8 24 C8 15 14 9 24 6 Z"
        fill="url(#fragment-fill)"
      />
      <circle cx="30" cy="18" r="3.2" fill="#fff7de" opacity="0.7" />
      <circle cx="20" cy="28" r="2.3" fill="#f7bd57" opacity="0.75" />
    </svg>
  );
}
