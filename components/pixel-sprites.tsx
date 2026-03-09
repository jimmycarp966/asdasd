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
  "....oooo....",
  "...ohhhho...",
  "..ohhhhhho..",
  "..ohssssho..",
  ".ohsggggsho.",
  ".ohssmmssho.",
  ".ohuuuuuuho.",
  "..ouuuuuuoo.",
  "..ouuuuuuoo.",
  "..ok....ko..",
  ".ok......ko.",
  "..........",
];

const girlMoonwatchRows = [
  ".....oooo...",
  "....ohhhho..",
  "...ohhhhhho.",
  "...ohssssho.",
  "..ohsggggsho",
  "..ohssmmssho",
  "...ohuuuuuho",
  "....ouuuuoo.",
  "....ouuuuoo.",
  "....ok...koo",
  "...ok.....ko",
  "..........",
];

const girlWorldPalettes: Record<GirlWorldState, Record<string, string>> = {
  distant: {
    o: "#1c0f2b",
    h: "#2f1650",
    s: "#f0c5a7",
    g: "#fff4dd",
    m: "#ff78a2",
    u: "#586fee",
    k: "#f7f5ff",
  },
  soft: {
    o: "#1b102b",
    h: "#311851",
    s: "#f1c7a9",
    g: "#fff6df",
    m: "#ff87aa",
    u: "#5170ef",
    k: "#f7f5ff",
  },
  smile: {
    o: "#190f28",
    h: "#341855",
    s: "#f3c8ab",
    g: "#fff7e4",
    m: "#ff6ea6",
    u: "#4d7aff",
    k: "#fbf8ff",
  },
  radiant: {
    o: "#160c27",
    h: "#38185a",
    s: "#f4ccaf",
    g: "#fff9e6",
    m: "#ff689f",
    u: "#4f77ff",
    k: "#fff9ff",
  },
  moonwatch: {
    o: "#160c26",
    h: "#32175b",
    s: "#f3cbaf",
    g: "#fff9ea",
    m: "#ff7ea9",
    u: "#5874eb",
    k: "#fff9ff",
  },
};

const portraitRows = [
  "..................",
  ".......oooo.......",
  ".....oohhhhoo.....",
  "....ohhhhhhhhho...",
  "...ohhhhhhhhhhhho.",
  "...ohhssssssshhho.",
  "..ohhhssgggssshho.",
  "..ehhhssbbbssgggo.",
  "..ohhhssmmmmsssho.",
  "..ohhhssgggggssho.",
  "...ohhuuuuuuuuho..",
  "..oouuuuuuuuuuoo..",
  "..ouuuuuuuuuuuuoo.",
  "..ouuuuuuuuuuuuoo.",
  "...oo..oooooo..oo.",
  "...oo..o....o..oo.",
  "..................",
];

const portraitMoonwatchRows = [
  "..................",
  "........oooo......",
  "......oohhhhoo....",
  ".....ohhhhhhhhho..",
  "....ohhhhhhhhhhho.",
  "....ohhssssssshho.",
  "....ohhssgggssggo.",
  ".....ehhssbbbssho.",
  "....oohssmmmmssho.",
  "...oohssggggggsso.",
  "...oohuuuuuuuuuho.",
  "..oouuuuuuuuuuuuo.",
  "..ouuuuuuuuuuuuuo.",
  "...ouuuuuuuuuuuoo.",
  "...oo..oooooo..oo.",
  "....oo.o....o..oo.",
  "..................",
];

const portraitPalettes: Record<GirlPortraitState, Record<string, string>> = {
  icon: {
    o: "#1d102d",
    h: "#34175a",
    s: "#f6caab",
    b: "#8ea4ff",
    g: "#fff9e7",
    m: "#ff73a0",
    u: "#5c78f3",
    e: "#fff9ef",
  },
  soft: {
    o: "#1b102b",
    h: "#34175a",
    s: "#f4c9aa",
    b: "#92a5ff",
    g: "#fff8e4",
    m: "#ff7fa3",
    u: "#5573f0",
    e: "#fffaf0",
  },
  smile: {
    o: "#190f28",
    h: "#36175b",
    s: "#f4caab",
    b: "#9bafff",
    g: "#fff9e8",
    m: "#ff699d",
    u: "#5573f4",
    e: "#fffaf2",
  },
  radiant: {
    o: "#170c24",
    h: "#39165f",
    s: "#f6cfb0",
    b: "#aab9ff",
    g: "#fffbe9",
    m: "#ff5f95",
    u: "#5b7cff",
    e: "#fffdf5",
  },
  moonwatch: {
    o: "#160c22",
    h: "#341560",
    s: "#f5cfb2",
    b: "#b2bfff",
    g: "#fffcef",
    m: "#ff79a4",
    u: "#6480f0",
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
