"use client";

import type { GirlSpriteState } from "@/lib/story-config";

type PixelArt = {
  rows: string[];
  palette: Record<string, string>;
};

type SpriteProps = {
  className?: string;
  scale?: number;
};

type HeroFrame = "run-a" | "run-b" | "jump" | "stand";

const heroPalette = {
  o: "#09101d",
  b: "#182946",
  s: "#f0c979",
  g: "#7db3ff",
};

const heroFrames: Record<HeroFrame, string[]> = {
  "run-a": [
    "..............",
    "....oo........",
    "...obbo.......",
    "...obbo.......",
    "....oo........",
    "...obso.......",
    "..oobboo......",
    "..obbbbo......",
    "...obbo.......",
    "..oobboo......",
    "..ob..bo......",
    ".obo..ob......",
    ".ob....bo.....",
    "..o....o......",
    "..o....o......",
    "..............",
  ],
  "run-b": [
    "..............",
    "....oo........",
    "...obbo.......",
    "...obbo.......",
    "....oo........",
    "...osbo.......",
    "..oobboo......",
    "..obbbbo......",
    "...obbo.......",
    "....obboo.....",
    "...ob..bo.....",
    "..ob...ob.....",
    ".ob.....bo....",
    ".o......o.....",
    "........o.....",
    "..............",
  ],
  jump: [
    "..............",
    "....oo........",
    "...obbo.......",
    "...obbo.......",
    "....oo........",
    "...obso.......",
    "..oobboo......",
    "..obbbbo......",
    "..oobbboo.....",
    "..ob..bbo.....",
    ".ob....bo.....",
    ".o.....ob.....",
    ".......ob.....",
    "......ob......",
    "..............",
    "..............",
  ],
  stand: [
    "..............",
    "....oo........",
    "...obbo.......",
    "...obbo.......",
    "....oo........",
    "...obso.......",
    "..oobboo......",
    "..obbbbo......",
    "...obbo.......",
    "...obbo.......",
    "...obbo.......",
    "..ob..bo......",
    "..ob..bo......",
    "..o....o......",
    "..o....o......",
    "..............",
  ],
};

const girlCommonRows = [
  "................",
  ".....oooo.......",
  "....ohhhhho.....",
  "...ohhhhhhhho...",
  "...ohssssssho...",
  "..ohhssssssho...",
  "..ohhssbbssho...",
  "..eohhssssgso...",
  "..ohhhmmmmso....",
  "..ohhssggggso...",
  "...ouuuuuuuo....",
  "..oouuuuuuuoo...",
  ".oouuuuuuuuoo...",
  ".ouuuuuuuuuuuo..",
  "..oo......oo....",
  "..oo......oo....",
  "................",
];

const girlMoonwatchRows = [
  "................",
  ".......ooo......",
  "......ohhho.....",
  ".....ohhhhho....",
  ".....ohsssssho..",
  ".....ohssssbho..",
  ".....ohhssbgso..",
  "......eouuuuo...",
  ".....oouuuuuo...",
  "....oouuuuuuoo..",
  "...oouuuuuuuuo..",
  "...ouuuuuuuuuo..",
  "....oo....oo....",
  "....oo....oo....",
  "................",
  "................",
];

const girlStateMap: Record<GirlSpriteState, PixelArt> = {
  silhouette: {
    rows: girlCommonRows,
    palette: {
      o: "#081019",
      h: "#0d1520",
      s: "#0d1520",
      m: "#0d1520",
      g: "#0d1520",
      b: "#0d1520",
      e: "#0d1520",
      u: "#111829",
    },
  },
  distant: {
    rows: girlCommonRows,
    palette: {
      o: "#111a29",
      h: "#1a2540",
      s: "#1e2946",
      m: "#1e2946",
      g: "#f0d47c",
      b: "#8899b7",
      e: "#f0d47c",
      u: "#1f3153",
    },
  },
  partial: {
    rows: girlCommonRows,
    palette: {
      o: "#16121f",
      h: "#2a1e33",
      s: "#e7b79c",
      m: "#c96d78",
      g: "#f5df9d",
      b: "#bcc8d8",
      e: "#fff4d4",
      u: "#1a2242",
    },
  },
  smile: {
    rows: girlCommonRows,
    palette: {
      o: "#17101b",
      h: "#24172d",
      s: "#efc3a7",
      m: "#d97186",
      g: "#fff0c7",
      b: "#dae1ef",
      e: "#fff4d6",
      u: "#1a2550",
    },
  },
  radiant: {
    rows: girlCommonRows,
    palette: {
      o: "#180f1a",
      h: "#2b1b36",
      s: "#f0c7ab",
      m: "#ea7b8e",
      g: "#fff6d5",
      b: "#eff4ff",
      e: "#fff6d8",
      u: "#28357a",
    },
  },
  moonwatch: {
    rows: girlMoonwatchRows,
    palette: {
      o: "#190f1b",
      h: "#291b38",
      s: "#f2c7a9",
      m: "#ef8e99",
      g: "#fff6d8",
      b: "#eff4ff",
      e: "#fff6d8",
      u: "#263566",
    },
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
    m: "#ffeebc",
    c: "#d9bb73",
  },
};

const heartArt: PixelArt = {
  rows: [
    ".hh..hh.",
    "hhhhhhhh",
    "hhhhhhhh",
    ".hhhhhh.",
    "..hhhh..",
    "...hh...",
    "........",
  ],
  palette: {
    h: "#ff8d97",
  },
};

function PixelArtSvg({
  art,
  className,
  scale = 1,
}: {
  art: PixelArt;
  className?: string;
  scale?: number;
}) {
  const width = art.rows[0]?.length ?? 0;
  const height = art.rows.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ transform: `scale(${scale})` }}
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

export function HeroSprite({
  frame,
  className,
  scale = 1,
}: SpriteProps & { frame: HeroFrame }) {
  return (
    <PixelArtSvg
      art={{
        rows: heroFrames[frame],
        palette: heroPalette,
      }}
      className={className}
      scale={scale}
    />
  );
}

export function GirlSprite({
  state,
  className,
  scale = 1,
}: SpriteProps & { state: GirlSpriteState }) {
  return <PixelArtSvg art={girlStateMap[state]} className={className} scale={scale} />;
}

export function MoonFragmentSprite({ className, scale = 1 }: SpriteProps) {
  return <PixelArtSvg art={moonFragmentArt} className={className} scale={scale} />;
}

export function HeartSprite({ className, scale = 1 }: SpriteProps) {
  return <PixelArtSvg art={heartArt} className={className} scale={scale} />;
}
