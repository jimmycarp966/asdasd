"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  canvasSize,
  interactionAutoRadius,
  type GameStage,
  type Point,
} from "@/lib/story-config";
import {
  drawGirlSprite,
  drawHeroSprite,
  drawMoonFragment,
  type WorldFacing,
} from "@/components/pixel-sprites";

type StageRendererProps = {
  stage: GameStage;
  interactedIds: string[];
  dialogueOpen: boolean;
  mode: "playing" | "cutscene";
  cutsceneReveal: number;
  onInteract: (id: string) => void;
  onExit: () => void;
};

type PendingAction =
  | { type: "move" }
  | { type: "exit" }
  | null;

export type GameCanvasSnapshot = {
  mode: "playing" | "cutscene";
  stageId: string;
  coordinateSystem: "origin: top-left, x+: right, y+: down";
  player: {
    x: number;
    y: number;
    facing: WorldFacing;
    targetX: number | null;
    targetY: number | null;
  };
  fragmentsCollected: number;
  fragmentsTotal: number;
  exitOpen: boolean;
  exit: Point;
  visibleInteractions: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
  }>;
};

export type StageRendererHandle = {
  advanceTime: (ms: number) => void;
  getSnapshot: () => GameCanvasSnapshot;
};

const stars = [
  { x: 42, y: 28, size: 2 },
  { x: 82, y: 52, size: 2 },
  { x: 128, y: 26, size: 3 },
  { x: 182, y: 48, size: 2 },
  { x: 238, y: 34, size: 2 },
  { x: 276, y: 18, size: 3 },
  { x: 302, y: 54, size: 2 },
];

const stageGlints = [
  { x: 38, y: 120 },
  { x: 94, y: 142 },
  { x: 138, y: 174 },
  { x: 198, y: 134 },
  { x: 244, y: 162 },
  { x: 294, y: 186 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function collectCount(stage: GameStage, interactedIds: string[]) {
  return stage.interactables.filter(
    (item) => item.grantsFragment && interactedIds.includes(item.id),
  ).length;
}

function createInitialSnapshot(stage: GameStage, interactedIds: string[]): GameCanvasSnapshot {
  return {
    mode: "playing",
    stageId: stage.id,
    coordinateSystem: "origin: top-left, x+: right, y+: down",
    player: {
      x: stage.spawn.x,
      y: stage.spawn.y,
      facing: "right",
      targetX: null,
      targetY: null,
    },
    fragmentsCollected: collectCount(stage, interactedIds),
    fragmentsTotal: stage.fragmentCount,
    exitOpen: false,
    exit: stage.exit,
    visibleInteractions: stage.interactables.map((item) => ({
      id: item.id,
      label: item.label,
      x: item.position.x,
      y: item.position.y,
    })),
  };
}

function drawBackground(ctx: CanvasRenderingContext2D, stage: GameStage, animationMs: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
  gradient.addColorStop(0, stage.palette.skyTop);
  gradient.addColorStop(1, stage.palette.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

  ctx.fillStyle = stage.palette.moonGlow;
  ctx.fillRect(220, 18, 72, 72);
  ctx.fillStyle = stage.palette.moon;
  ctx.fillRect(234, 26, 44, 44);
  ctx.clearRect(246, 32, 8, 6);
  ctx.clearRect(262, 46, 5, 4);
  ctx.clearRect(248, 56, 6, 5);

  for (const star of stars) {
    ctx.fillStyle = "#fef7de";
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }

  for (const glint of stageGlints) {
    const wobble = Math.sin(animationMs / 420 + glint.x) * 0.35 + 0.65;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + wobble * 0.12})`;
    ctx.fillRect(glint.x, glint.y, 2, 2);
  }
}

function drawRooftops(ctx: CanvasRenderingContext2D, stage: GameStage, camera: Point) {
  ctx.fillStyle = stage.palette.groundB;
  ctx.fillRect(0, 102, canvasSize.width, canvasSize.height - 102);

  const roofs = [
    { x: 8, y: 132, w: 108, h: 54, color: stage.palette.groundA },
    { x: 128, y: 110, w: 126, h: 68, color: stage.palette.path },
    { x: 274, y: 128, w: 90, h: 56, color: stage.palette.groundA },
    { x: 376, y: 96, w: 112, h: 72, color: stage.palette.path },
  ];

  for (const roof of roofs) {
    const screenX = roof.x - camera.x;
    const screenY = roof.y - camera.y;
    ctx.fillStyle = roof.color;
    ctx.fillRect(screenX, screenY, roof.w, roof.h);
    ctx.fillStyle = stage.palette.accentSoft;
    ctx.fillRect(screenX, screenY, roof.w, 5);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    for (let offset = 0; offset < roof.w; offset += 14) {
      ctx.fillRect(screenX + offset, screenY + 14, 4, roof.h - 22);
    }
  }

  ctx.fillStyle = stage.palette.turquoise;
  ctx.fillRect(70 - camera.x, 148 - camera.y, 18, 18);
  ctx.fillRect(336 - camera.x, 134 - camera.y, 16, 16);
  ctx.fillStyle = stage.palette.coral;
  ctx.fillRect(168 - camera.x, 120 - camera.y, 22, 8);
}

function drawCircuit(ctx: CanvasRenderingContext2D, stage: GameStage, camera: Point, animationMs: number) {
  ctx.fillStyle = stage.palette.groundA;
  ctx.fillRect(0, 96, canvasSize.width, canvasSize.height - 96);

  for (let x = -16; x < canvasSize.width + 32; x += 20) {
    ctx.fillStyle = x % 40 === 0 ? stage.palette.path : stage.palette.groundB;
    ctx.fillRect(x, 116, 18, canvasSize.height - 116);
  }

  const storefronts = [
    { x: 18, y: 120, w: 88, h: 70, glow: stage.palette.coral },
    { x: 134, y: 100, w: 98, h: 78, glow: stage.palette.turquoise },
    { x: 268, y: 118, w: 90, h: 66, glow: stage.palette.accent },
    { x: 386, y: 92, w: 108, h: 84, glow: stage.palette.coral },
  ];

  for (const shop of storefronts) {
    const screenX = shop.x - camera.x;
    const screenY = shop.y - camera.y;
    ctx.fillStyle = stage.palette.groundB;
    ctx.fillRect(screenX, screenY, shop.w, shop.h);
    ctx.fillStyle = shop.glow;
    ctx.fillRect(screenX + 6, screenY + 6, shop.w - 12, 8);
    const pulse = 0.35 + ((Math.sin(animationMs / 320 + shop.x) + 1) / 2) * 0.4;
    ctx.fillStyle = `rgba(255,255,255,${pulse})`;
    for (let index = 0; index < 4; index += 1) {
      ctx.fillRect(screenX + 12 + index * 18, screenY + 18, 8, 22);
    }
  }

  ctx.fillStyle = stage.palette.turquoise;
  ctx.fillRect(102 - camera.x, 196 - camera.y, 86, 3);
  ctx.fillStyle = stage.palette.coral;
  ctx.fillRect(238 - camera.x, 196 - camera.y, 82, 3);
}

function drawGarden(ctx: CanvasRenderingContext2D, stage: GameStage, camera: Point, animationMs: number) {
  ctx.fillStyle = stage.palette.groundA;
  ctx.fillRect(0, 92, canvasSize.width, canvasSize.height - 92);

  for (let y = 102; y < canvasSize.height + 18; y += 18) {
    for (let x = 0; x < canvasSize.width + 18; x += 18) {
      ctx.fillStyle = (x + y) % 36 === 0 ? stage.palette.groundB : stage.palette.groundA;
      ctx.fillRect(x, y, 18, 18);
    }
  }

  const paths = [
    { x: 14, y: 152, w: 118, h: 26 },
    { x: 136, y: 120, w: 112, h: 30 },
    { x: 252, y: 152, w: 112, h: 24 },
    { x: 374, y: 120, w: 112, h: 32 },
  ];

  ctx.fillStyle = stage.palette.path;
  for (const path of paths) {
    ctx.fillRect(path.x - camera.x, path.y - camera.y, path.w, path.h);
  }

  ctx.fillStyle = stage.palette.turquoise;
  const pondX = 320 - camera.x;
  const pondY = 182 - camera.y;
  ctx.fillRect(pondX, pondY, 58, 24);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(pondX + 8, pondY + 5, 22, 3);
  ctx.fillStyle = stage.palette.accent;
  ctx.fillRect(154 - camera.x, 144 - camera.y, 10, 10);
  ctx.fillRect(432 - camera.x, 130 - camera.y, 10, 10);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + (Math.sin(animationMs / 380) + 1) * 0.1})`;
  ctx.fillRect(72 - camera.x, 118 - camera.y, 24, 4);
}

function drawObservatory(ctx: CanvasRenderingContext2D, stage: GameStage, camera: Point, animationMs: number) {
  ctx.fillStyle = stage.palette.groundB;
  ctx.fillRect(0, 98, canvasSize.width, canvasSize.height - 98);

  const terraces = [
    { x: 8, y: 170, w: 110, h: 34 },
    { x: 132, y: 144, w: 110, h: 30 },
    { x: 258, y: 118, w: 110, h: 28 },
    { x: 380, y: 92, w: 112, h: 34 },
  ];

  for (const terrace of terraces) {
    const screenX = terrace.x - camera.x;
    const screenY = terrace.y - camera.y;
    ctx.fillStyle = stage.palette.path;
    ctx.fillRect(screenX, screenY, terrace.w, terrace.h);
    ctx.fillStyle = stage.palette.accentSoft;
    ctx.fillRect(screenX, screenY, terrace.w, 4);
  }

  ctx.fillStyle = stage.palette.groundA;
  ctx.fillRect(402 - camera.x, 60 - camera.y, 72, 48);
  ctx.fillStyle = stage.palette.turquoise;
  ctx.fillRect(422 - camera.x, 68 - camera.y, 32, 18);
  ctx.fillStyle = `rgba(255,255,255,${0.14 + (Math.sin(animationMs / 420) + 1) * 0.08})`;
  ctx.fillRect(414 - camera.x, 144 - camera.y, 46, 3);
  ctx.fillStyle = stage.palette.accent;
  ctx.fillRect(88 - camera.x, 178 - camera.y, 16, 16);
}

function drawInteractable(
  ctx: CanvasRenderingContext2D,
  stage: GameStage,
  kind: StageRendererProps["stage"]["interactables"][number]["kind"],
  position: Point,
  highlighted: boolean,
  animationMs: number,
) {
  const pulse = highlighted ? 1 : 0.7 + (Math.sin(animationMs / 260 + position.x) + 1) * 0.15;
  const glowColor = highlighted ? stage.palette.accentSoft : stage.palette.turquoise;

  ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + pulse * 0.14})`;
  ctx.fillRect(position.x - 10, position.y + 8, 20, 4);
  ctx.fillStyle = glowColor;

  switch (kind) {
    case "fragment":
      drawMoonFragment(ctx, position.x - 8, position.y - 12, 2, pulse);
      break;
    case "telescope":
      ctx.fillRect(position.x - 3, position.y - 12, 6, 8);
      ctx.fillStyle = stage.palette.coral;
      ctx.fillRect(position.x + 2, position.y - 16, 8, 5);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 8, position.y + 1, 3, 8);
      ctx.fillRect(position.x, position.y + 3, 3, 6);
      ctx.fillRect(position.x + 8, position.y + 1, 3, 8);
      break;
    case "chimes":
      ctx.fillRect(position.x - 10, position.y - 16, 20, 4);
      ctx.fillStyle = stage.palette.accent;
      ctx.fillRect(position.x - 8, position.y - 12, 2, 12);
      ctx.fillRect(position.x - 2, position.y - 10, 2, 10);
      ctx.fillRect(position.x + 4, position.y - 12, 2, 12);
      break;
    case "sign":
      ctx.fillRect(position.x - 12, position.y - 14, 24, 12);
      ctx.fillStyle = stage.palette.shadow;
      ctx.fillRect(position.x - 9, position.y - 11, 18, 6);
      ctx.fillStyle = stage.palette.coral;
      ctx.fillRect(position.x - 2, position.y - 1, 4, 10);
      break;
    case "mirror":
      ctx.fillRect(position.x - 7, position.y - 16, 14, 18);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 4, position.y - 12, 8, 10);
      ctx.fillStyle = stage.palette.coral;
      ctx.fillRect(position.x - 2, position.y + 2, 4, 8);
      break;
    case "garland":
      ctx.fillRect(position.x - 12, position.y - 16, 24, 3);
      ctx.fillStyle = stage.palette.coral;
      ctx.fillRect(position.x - 9, position.y - 11, 4, 4);
      ctx.fillStyle = stage.palette.accent;
      ctx.fillRect(position.x - 2, position.y - 8, 4, 4);
      ctx.fillStyle = stage.palette.turquoise;
      ctx.fillRect(position.x + 5, position.y - 12, 4, 4);
      break;
    case "arcade":
      ctx.fillRect(position.x - 10, position.y - 16, 20, 24);
      ctx.fillStyle = stage.palette.shadow;
      ctx.fillRect(position.x - 6, position.y - 12, 12, 8);
      ctx.fillStyle = stage.palette.coral;
      ctx.fillRect(position.x - 4, position.y, 8, 3);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 2, position.y + 6, 4, 2);
      break;
    case "pedestal":
      ctx.fillRect(position.x - 10, position.y - 8, 20, 12);
      ctx.fillStyle = stage.palette.accent;
      ctx.fillRect(position.x - 4, position.y - 16, 8, 8);
      break;
    case "bench":
      ctx.fillRect(position.x - 12, position.y - 8, 24, 6);
      ctx.fillRect(position.x - 8, position.y - 14, 16, 3);
      ctx.fillStyle = stage.palette.shadow;
      ctx.fillRect(position.x - 8, position.y - 2, 3, 8);
      ctx.fillRect(position.x + 5, position.y - 2, 3, 8);
      break;
    case "fountain":
      ctx.fillRect(position.x - 12, position.y - 10, 24, 16);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 6, position.y - 18, 12, 8);
      ctx.fillStyle = stage.palette.turquoise;
      ctx.fillRect(position.x - 4, position.y - 14, 8, 4);
      break;
    case "lantern":
      ctx.fillRect(position.x - 2, position.y - 18, 4, 24);
      ctx.fillStyle = stage.palette.accent;
      ctx.fillRect(position.x - 7, position.y - 24, 14, 8);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 4, position.y - 21, 8, 3);
      break;
    case "arch":
      ctx.fillRect(position.x - 14, position.y - 16, 6, 24);
      ctx.fillRect(position.x + 8, position.y - 16, 6, 24);
      ctx.fillRect(position.x - 8, position.y - 20, 16, 6);
      break;
    case "plaque":
      ctx.fillRect(position.x - 11, position.y - 12, 22, 14);
      ctx.fillStyle = stage.palette.shadow;
      ctx.fillRect(position.x - 7, position.y - 8, 14, 6);
      ctx.fillStyle = stage.palette.accentSoft;
      ctx.fillRect(position.x - 2, position.y + 2, 4, 6);
      break;
  }
}

function drawExit(
  ctx: CanvasRenderingContext2D,
  stage: GameStage,
  camera: Point,
  exitOpen: boolean,
  animationMs: number,
) {
  const x = stage.exit.x - camera.x - 18;
  const y = stage.exit.y - camera.y - 28;
  const pulse = 0.4 + (Math.sin(animationMs / 260) + 1) * 0.2;

  ctx.fillStyle = exitOpen ? stage.palette.accent : stage.palette.shadow;
  ctx.fillRect(x, y + 10, 36, 28);
  ctx.fillRect(x + 6, y, 24, 10);

  if (exitOpen) {
    ctx.fillStyle = `rgba(255, 242, 186, ${0.14 + pulse * 0.2})`;
    ctx.fillRect(x - 8, y - 8, 52, 52);
    ctx.fillStyle = stage.palette.accentSoft;
    ctx.fillRect(x + 10, y + 14, 16, 14);
  } else {
    ctx.fillStyle = stage.palette.groundB;
    ctx.fillRect(x + 10, y + 14, 16, 14);
  }
}

function drawPlayerShadow(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "rgba(17, 8, 25, 0.46)";
  ctx.fillRect(x - 7, y + 21, 18, 4);
}

function getFacing(from: Point, to: Point, currentFacing: WorldFacing) {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;

  if (Math.abs(deltaX) < 1.5 && Math.abs(deltaY) < 1.5) {
    return currentFacing;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  }

  return deltaY > 0 ? "down" : "up";
}

function renderPlayingScene(
  ctx: CanvasRenderingContext2D,
  stage: GameStage,
  camera: Point,
  interactedIds: string[],
  player: Point,
  facing: WorldFacing,
  animationMs: number,
  target: Point | null,
) {
  drawBackground(ctx, stage, animationMs);

  if (stage.theme === "rooftops") {
    drawRooftops(ctx, stage, camera);
  } else if (stage.theme === "circuit") {
    drawCircuit(ctx, stage, camera, animationMs);
  } else if (stage.theme === "garden") {
    drawGarden(ctx, stage, camera, animationMs);
  } else {
    drawObservatory(ctx, stage, camera, animationMs);
  }

  const fragmentsCollected = collectCount(stage, interactedIds);
  const exitOpen = fragmentsCollected >= stage.fragmentCount;

  for (const presence of stage.girlPresences) {
    if (fragmentsCollected < presence.appearAfterFragments) continue;
    const opacity = 0.42 + (fragmentsCollected / stage.fragmentCount) * 0.48;
    drawGirlSprite(
      ctx,
      presence.state,
      presence.position.x - camera.x,
      presence.position.y - camera.y,
      presence.scale * 2.2,
    );
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.08})`;
    ctx.fillRect(
      presence.position.x - camera.x - 10,
      presence.position.y - camera.y + 24,
      26,
      4,
    );
  }

  drawExit(ctx, stage, camera, exitOpen, animationMs);

  for (const item of stage.interactables) {
    if (interactedIds.includes(item.id)) continue;
    drawInteractable(
      ctx,
      stage,
      item.kind,
      {
        x: item.position.x - camera.x,
        y: item.position.y - camera.y,
      },
      target ? distance(item.position, target) < 10 : false,
      animationMs,
    );
  }

  drawPlayerShadow(ctx, player.x - camera.x, player.y - camera.y);
  drawHeroSprite(
    ctx,
    facing,
    player.x - camera.x - 10,
    player.y - camera.y - 16,
    2.2,
  );
}

function renderCutsceneScene(
  ctx: CanvasRenderingContext2D,
  stage: GameStage,
  reveal: number,
  animationMs: number,
) {
  drawBackground(ctx, stage, animationMs);

  ctx.fillStyle = stage.palette.groundB;
  ctx.fillRect(0, 150, canvasSize.width, 90);
  ctx.fillStyle = stage.palette.path;
  ctx.fillRect(176, 128, 86, 38);
  ctx.fillRect(154, 164, 122, 24);
  ctx.fillStyle = stage.palette.accentSoft;
  ctx.fillRect(170, 122, 96, 4);

  const glow = 0.2 + (Math.sin(animationMs / 500) + 1) * 0.1;
  ctx.fillStyle = `rgba(255, 238, 194, ${glow + reveal * 0.18})`;
  ctx.fillRect(194, 52, 90, 90);
  ctx.fillStyle = stage.palette.moon;
  ctx.fillRect(216, 64, 46, 46);

  drawPlayerShadow(ctx, 68, 187);
  drawHeroSprite(ctx, "right", 58, 150, 2.7);

  ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + reveal * 0.16})`;
  ctx.fillRect(206, 188, 42, 5);
  drawGirlSprite(ctx, "moonwatch", 198, 126, 4.1);
}

export const StageRenderer = forwardRef<StageRendererHandle, StageRendererProps>(
  function StageRenderer(
    { stage, interactedIds, dialogueOpen, mode, cutsceneReveal, onInteract, onExit },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const lastFrameRef = useRef<number | null>(null);
    const animationTimeRef = useRef(0);
    const stageRef = useRef(stage);
    const interactedRef = useRef(interactedIds);
    const dialogueOpenRef = useRef(dialogueOpen);
    const modeRef = useRef(mode);
    const cutsceneRevealRef = useRef(cutsceneReveal);
    const playerRef = useRef<Point>({ ...stage.spawn });
    const targetRef = useRef<Point | null>(null);
    const cameraRef = useRef<Point>({ x: 0, y: 0 });
    const facingRef = useRef<WorldFacing>("right");
    const pendingActionRef = useRef<PendingAction>(null);
    const cooldownRef = useRef(0);
    const snapshotRef = useRef(createInitialSnapshot(stage, interactedIds));

    const resetStage = () => {
      stageRef.current = stage;
      interactedRef.current = interactedIds;
      dialogueOpenRef.current = dialogueOpen;
      modeRef.current = mode;
      cutsceneRevealRef.current = cutsceneReveal;
      playerRef.current = { ...stage.spawn };
      targetRef.current = null;
      cameraRef.current = {
        x: clamp(stage.spawn.x - canvasSize.width / 2, 0, Math.max(0, stage.worldSize.width - canvasSize.width)),
        y: clamp(stage.spawn.y - canvasSize.height / 2, 0, Math.max(0, stage.worldSize.height - canvasSize.height)),
      };
      facingRef.current = "right";
      pendingActionRef.current = null;
      cooldownRef.current = 0;
      snapshotRef.current = createInitialSnapshot(stage, interactedIds);
    };

    const updateSnapshot = () => {
      const currentStage = stageRef.current;
      const fragmentsCollected = collectCount(currentStage, interactedRef.current);
      snapshotRef.current = {
        mode: modeRef.current,
        stageId: currentStage.id,
        coordinateSystem: "origin: top-left, x+: right, y+: down",
        player: {
          x: Math.round(playerRef.current.x),
          y: Math.round(playerRef.current.y),
          facing: facingRef.current,
          targetX: targetRef.current ? Math.round(targetRef.current.x) : null,
          targetY: targetRef.current ? Math.round(targetRef.current.y) : null,
        },
        fragmentsCollected,
        fragmentsTotal: currentStage.fragmentCount,
        exitOpen: fragmentsCollected >= currentStage.fragmentCount,
        exit: currentStage.exit,
        visibleInteractions: currentStage.interactables
          .filter((item) => !interactedRef.current.includes(item.id))
          .map((item) => ({
            id: item.id,
            label: item.label,
            x: item.position.x,
            y: item.position.y,
          })),
      };
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      if (modeRef.current === "cutscene") {
        renderCutsceneScene(
          ctx,
          stageRef.current,
          cutsceneRevealRef.current,
          animationTimeRef.current,
        );
        updateSnapshot();
        return;
      }

      renderPlayingScene(
        ctx,
        stageRef.current,
        cameraRef.current,
        interactedRef.current,
        playerRef.current,
        facingRef.current,
        animationTimeRef.current,
        targetRef.current,
      );
      updateSnapshot();
    };

    const triggerNearbyInteraction = () => {
      if (dialogueOpenRef.current || modeRef.current !== "playing" || cooldownRef.current > 0) {
        return;
      }

      const currentStage = stageRef.current;
      for (const item of currentStage.interactables) {
        if (interactedRef.current.includes(item.id)) continue;
        if (distance(playerRef.current, item.position) <= interactionAutoRadius) {
          targetRef.current = null;
          pendingActionRef.current = null;
          cooldownRef.current = 260;
          onInteract(item.id);
          return;
        }
      }

      if (
        collectCount(currentStage, interactedRef.current) >= currentStage.fragmentCount &&
        distance(playerRef.current, currentStage.exit) <= 48
      ) {
        targetRef.current = null;
        pendingActionRef.current = null;
        cooldownRef.current = 320;
        onExit();
      }
    };

    const step = (deltaMs: number) => {
      animationTimeRef.current += deltaMs;
      cooldownRef.current = Math.max(0, cooldownRef.current - deltaMs);

      if (modeRef.current === "playing" && !dialogueOpenRef.current) {
        if (targetRef.current) {
          const target = targetRef.current;
          const from = playerRef.current;
          const distanceToTarget = distance(from, target);
          facingRef.current = getFacing(from, target, facingRef.current);

          if (distanceToTarget <= 1.5) {
            playerRef.current = { x: target.x, y: target.y };
            targetRef.current = null;
          } else {
            const stepDistance = (deltaMs / 1000) * 54;
            const ratio = Math.min(1, stepDistance / distanceToTarget);
            playerRef.current = {
              x: lerp(from.x, target.x, ratio),
              y: lerp(from.y, target.y, ratio),
            };
          }
        }

        triggerNearbyInteraction();
      }

      const currentStage = stageRef.current;
      const cameraTargetX = clamp(
        playerRef.current.x - canvasSize.width / 2,
        0,
        Math.max(0, currentStage.worldSize.width - canvasSize.width),
      );
      const cameraTargetY = clamp(
        playerRef.current.y - canvasSize.height / 2,
        0,
        Math.max(0, currentStage.worldSize.height - canvasSize.height),
      );

      cameraRef.current = {
        x: lerp(cameraRef.current.x, cameraTargetX, 0.14),
        y: lerp(cameraRef.current.y, cameraTargetY, 0.14),
      };

      render();
    };

    useImperativeHandle(ref, () => ({
      advanceTime(ms: number) {
        step(ms);
      },
      getSnapshot() {
        return snapshotRef.current;
      },
    }));

    useEffect(() => {
      stageRef.current = stage;
      interactedRef.current = interactedIds;
      dialogueOpenRef.current = dialogueOpen;
      modeRef.current = mode;
      cutsceneRevealRef.current = cutsceneReveal;
      render();
    }, [cutsceneReveal, dialogueOpen, interactedIds, mode, stage]);

    useEffect(() => {
      resetStage();
      render();
    }, [stage.id]);

    useEffect(() => {
      const animate = (timestamp: number) => {
        if (lastFrameRef.current === null) {
          lastFrameRef.current = timestamp;
        }

        const delta = Math.min(34, timestamp - lastFrameRef.current);
        lastFrameRef.current = timestamp;
        step(delta);
        animationRef.current = window.requestAnimationFrame(animate);
      };

      animationRef.current = window.requestAnimationFrame(animate);

      return () => {
        if (animationRef.current !== null) {
          window.cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const pickTarget = (worldPoint: Point) => {
        for (const item of stageRef.current.interactables) {
          if (interactedRef.current.includes(item.id)) continue;
          if (distance(item.position, worldPoint) <= item.radius + 10) {
            pendingActionRef.current = { type: "move" };
            targetRef.current = { ...item.position };
            return;
          }
        }

        const fragmentsCollected = collectCount(stageRef.current, interactedRef.current);
        if (
          fragmentsCollected >= stageRef.current.fragmentCount &&
          distance(stageRef.current.exit, worldPoint) <= 28
        ) {
          pendingActionRef.current = { type: "exit" };
          targetRef.current = { ...stageRef.current.exit };
          return;
        }

        pendingActionRef.current = { type: "move" };
        targetRef.current = {
          x: clamp(worldPoint.x, 18, stageRef.current.worldSize.width - 18),
          y: clamp(worldPoint.y, 86, stageRef.current.worldSize.height - 16),
        };
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (dialogueOpenRef.current || modeRef.current !== "playing") return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvasSize.width / rect.width;
        const scaleY = canvasSize.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        const worldPoint = {
          x: canvasX + cameraRef.current.x,
          y: canvasY + cameraRef.current.y,
        };

        pickTarget(worldPoint);
      };

      canvas.addEventListener("pointerdown", handlePointerDown);
      return () => {
        canvas.removeEventListener("pointerdown", handlePointerDown);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="game-canvas"
        width={canvasSize.width}
        height={canvasSize.height}
        aria-label={`${stage.label}: ${stage.stageTitle}`}
      />
    );
  },
);
