"use client";

import type { CSSProperties } from "react";
import type { GirlPortraitState, GirlWorldState } from "@/lib/story-config";

export type PixelArt = {
  rows: string[];
  palette: Record<string, string>;
};

export type WorldFacing = "down" | "up" | "left" | "right";

type PixelArtSvgProps = {
  art: PixelArt;
  className?: string;
  scale?: number;
  flipX?: boolean;
};

const heroPalette = {
  o: "#1b1028",
  h: "#f5d15c",
  l: "#ffd97f",
  s: "#f3c8a8",
  j: "#4fb7ff",
  p: "#2d57c8",
  k: "#f6f4ff",
};

const heroDown: PixelArt = {
  rows: [
    "....oo....",
    "...ohho...",
    "..ohhhho..",
    "..ohssho..",
    "..ohssho..",
    "...ojjo...",
    "..ojjjjo..",
    ".ojjppjjo.",
    "..ojppjo..",
    "..ok..ko..",
    ".ok....ko.",
    "..........",
  ],
  palette: heroPalette,
};

const heroUp: PixelArt = {
  rows: [
    "....oo....",
    "...ohho...",
    "..ohhhho..",
    "..ohhhho..",
    "..ohhhho..",
    "...ojjo...",
    "..ojjjjo..",
    ".ojjppjjo.",
    "..ojppjo..",
    "..ok..ko..",
    ".ok....ko.",
    "..........",
  ],
  palette: heroPalette,
};

const heroSide: PixelArt = {
  rows: [
    "....oo....",
    "...ohho...",
    "..ohhhho..",
    "..ohssho..",
    "..ohssso..",
    "...ojjoo..",
    "..ojjjjo..",
    "..ojppjjo.",
    "...ojppjo.",
    "...ok..ko.",
    "..ok....o.",
    "..........",
  ],
  palette: heroPalette,
};

const girlWorldRows = [
  "....oo....",
  "...ohho...",
  "..ohhhho..",
  "..ohsssho.",
  "..ohssgso.",
  "...ommoo..",
  "..ommmmo..",
  ".ommuummo.",
  "..omuuumo.",
  "..ok..ko..",
  ".ok....ko.",
  "..........",
];

const girlMoonwatchRows = [
  ".....oo...",
  "....ohho..",
  "...ohhhho.",
  "...ohssso.",
  "...ohsggo.",
  "....ommoo.",
  "...ommmmo.",
  "..omuuuumo",
  "...omuuuo.",
  "...ok..ko.",
  "..ok....o.",
  "..........",
];

const girlWorldPalettes: Record<GirlWorldState, Record<string, string>> = {
  distant: {
    o: "#1b1130",
    h: "#291843",
    s: "#f0c5a7",
    g: "#fff0d7",
    m: "#ff8ea2",
    u: "#5e54b7",
    k: "#f7f5ff",
  },
  soft: {
    o: "#1a1030",
    h: "#2b1845",
    s: "#f1c7a9",
    g: "#fff3db",
    m: "#ff93ab",
    u: "#4b66d9",
    k: "#f7f5ff",
  },
  smile: {
    o: "#190f2a",
    h: "#2c1948",
    s: "#f3c8ab",
    g: "#fff4dc",
    m: "#ff7fa8",
    u: "#4b6dff",
    k: "#fbf8ff",
  },
  radiant: {
    o: "#160c27",
    h: "#2d184c",
    s: "#f4ccaf",
    g: "#fff7df",
    m: "#ff759f",
    u: "#446ef4",
    k: "#fff9ff",
  },
  moonwatch: {
    o: "#160c26",
    h: "#28184a",
    s: "#f3cbaf",
    g: "#fff8e4",
    m: "#ff80a3",
    u: "#536bdb",
    k: "#fff9ff",
  },
};

const portraitRows = [
  "..................",
  "......oooo........",
  "....oohhhhoo......",
  "...ohhhhhhhhho....",
  "..ohhhhhhhhhhhho..",
  "..ohhssssssshhho..",
  ".ohhhsssssssshhho.",
  ".ohhhssbbbbbshhho.",
  ".ehhhssssssssgggo.",
  ".ohhhssmmmmssshho.",
  ".ohhhssgggggsssho.",
  "..ohhuuuuuuuuuho..",
  "..oouuuuuuuuuuoo..",
  ".oouuuuuuuuuuuoo..",
  ".ouuuuuuuuuuuuuuo.",
  "..oo..oooooo..oo..",
  "..oo..o....o..oo..",
  "..................",
];

const portraitMoonwatchRows = [
  "..................",
  "........oooo......",
  "......oohhhhoo....",
  ".....ohhhhhhhhho..",
  ".....ohhhhhhhhhho.",
  ".....ohhsssssssho.",
  ".....ohhssssssggo.",
  "......ehhssbbbgho.",
  ".....oohssmmmmsho.",
  "....oohssggggggso.",
  "...oouuuuuuuuuuuo.",
  "..oouuuuuuuuuuuuo.",
  "..ouuuuuuuuuuuuuo.",
  "...oo..oooooo..oo.",
  "...oo..o....o..oo.",
  "..................",
];

const portraitPalettes: Record<GirlPortraitState, Record<string, string>> = {
  icon: {
    o: "#201131",
    h: "#2f1850",
    s: "#f6caab",
    b: "#7f97ff",
    g: "#fff7e2",
    m: "#ff7c9d",
    u: "#5c6fe4",
    e: "#fff9ef",
  },
  soft: {
    o: "#1c102e",
    h: "#2c1849",
    s: "#f4c9aa",
    b: "#7b94ff",
    g: "#fff6e0",
    m: "#ff88a3",
    u: "#4d69e0",
    e: "#fffaf0",
  },
  smile: {
    o: "#1a0f2a",
    h: "#2c184a",
    s: "#f4caab",
    b: "#8ea2ff",
    g: "#fff7e3",
    m: "#ff739b",
    u: "#4567eb",
    e: "#fffaf2",
  },
  radiant: {
    o: "#170c24",
    h: "#2c1850",
    s: "#f6cfb0",
    b: "#a0b0ff",
    g: "#fffbe9",
    m: "#ff6a97",
    u: "#3d67f2",
    e: "#fffdf5",
  },
  moonwatch: {
    o: "#160c22",
    h: "#2a1851",
    s: "#f5cfb2",
    b: "#a3b6ff",
    g: "#fffcef",
    m: "#ff80a8",
    u: "#506ce1",
    e: "#fffef7",
  },
};

const moonFragmentArt: PixelArt = {
  rows: [
    "..mmmm..",
    ".mmmmmm.",
    "mmmmmcmm",
    "mmmmmmmm",
    "mmmmmmmm",
    ".mmmcmm.",
    "..mmmm..",
    "........",
  ],
  palette: {
    m: "#ffe8a0",
    c: "#f9c35f",
  },
};

function getGirlWorldArt(state: GirlWorldState) {
  return {
    rows: state === "moonwatch" ? girlMoonwatchRows : girlWorldRows,
    palette: girlWorldPalettes[state],
  };
}

function getPortraitArt(state: GirlPortraitState) {
  return {
    rows: state === "moonwatch" ? portraitMoonwatchRows : portraitRows,
    palette: portraitPalettes[state],
  };
}

export function PixelArtSvg({
  art,
  className,
  scale = 1,
  flipX = false,
}: PixelArtSvgProps) {
  const width = art.rows[0]?.length ?? 0;
  const height = art.rows.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={
        {
          transform: `scale(${flipX ? -scale : scale}, ${scale})`,
          transformOrigin: "center center",
        } as CSSProperties
      }
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {art.rows.flatMap((row, y) =>
        row.split("").map((cell, x) => {
          if (cell === ".") return null;
          const fill = art.palette[cell];
          if (!fill) return null;

          return <rect key={`${x}-${y}-${cell}`} x={x} y={y} width="1" height="1" fill={fill} />;
        }),
      )}
    </svg>
  );
}

export function GirlPortraitSprite({
  state,
  className,
  scale = 1,
}: {
  state: GirlPortraitState;
  className?: string;
  scale?: number;
}) {
  return <PixelArtSvg art={getPortraitArt(state)} className={className} scale={scale} />;
}

export function GirlWorldSprite({
  state,
  className,
  scale = 1,
}: {
  state: GirlWorldState;
  className?: string;
  scale?: number;
}) {
  return <PixelArtSvg art={getGirlWorldArt(state)} className={className} scale={scale} />;
}

export function MoonFragmentSprite({
  className,
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  return <PixelArtSvg art={moonFragmentArt} className={className} scale={scale} />;
}

export function getHeroArt(facing: WorldFacing) {
  if (facing === "left" || facing === "right") {
    return heroSide;
  }

  if (facing === "up") {
    return heroUp;
  }

  return heroDown;
}

export function drawPixelArt(
  ctx: CanvasRenderingContext2D,
  art: PixelArt,
  x: number,
  y: number,
  scale: number,
  options?: {
    flipX?: boolean;
    opacity?: number;
  },
) {
  const { flipX = false, opacity = 1 } = options ?? {};
  const width = art.rows[0]?.length ?? 0;
  const height = art.rows.length;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = opacity;
  ctx.translate(Math.round(x), Math.round(y));

  if (flipX) {
    ctx.translate(width * scale, 0);
    ctx.scale(-1, 1);
  }

  for (let rowIndex = 0; rowIndex < height; rowIndex += 1) {
    const row = art.rows[rowIndex]!;

    for (let colIndex = 0; colIndex < width; colIndex += 1) {
      const cell = row[colIndex];
      if (!cell || cell === ".") continue;
      const fill = art.palette[cell];
      if (!fill) continue;
      ctx.fillStyle = fill;
      ctx.fillRect(colIndex * scale, rowIndex * scale, scale, scale);
    }
  }

  ctx.restore();
}

export function drawHeroSprite(
  ctx: CanvasRenderingContext2D,
  facing: WorldFacing,
  x: number,
  y: number,
  scale: number,
) {
  const art = getHeroArt(facing);
  drawPixelArt(ctx, art, x, y, scale, { flipX: facing === "left" });
}

export function drawGirlSprite(
  ctx: CanvasRenderingContext2D,
  state: GirlWorldState,
  x: number,
  y: number,
  scale: number,
) {
  const art = getGirlWorldArt(state);
  drawPixelArt(ctx, art, x, y, scale);
}

export function drawMoonFragment(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  opacity = 1,
) {
  drawPixelArt(ctx, moonFragmentArt, x, y, scale, { opacity });
}

