"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  canvasSize,
  interactionAutoRadius,
  type GameStage,
  type Point,
} from "@/lib/story-config";

type StageRendererProps = {
  stage: GameStage;
  interactedIds: string[];
  dialogueOpen: boolean;
  mode: "playing" | "cutscene";
  cutsceneReveal: number;
  onInteract: (id: string) => void;
  onExit: () => void;
};

export type GameCanvasSnapshot = {
  mode: "playing" | "cutscene";
  stageId: string;
  coordinateSystem: "origin: top-left, x+: right, y+: down";
  player: {
    x: number;
    y: number;
    facing: "down" | "up" | "left" | "right";
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

type PhaserModule = typeof import("phaser");
type PhaserScene = import("phaser").Scene;
type PhaserGraphics = import("phaser").GameObjects.Graphics;
type PhaserContainer = import("phaser").GameObjects.Container;
type PhaserText = import("phaser").GameObjects.Text;
type PhaserGame = import("phaser").Game;
type PhaserEllipse = import("phaser").GameObjects.Ellipse;

type StageObjectViews = {
  root: PhaserContainer;
  marker: PhaserEllipse;
  glint: PhaserEllipse;
};

type SceneController = {
  stage: GameStage;
  interactedIds: string[];
  dialogueOpen: boolean;
  mode: "playing" | "cutscene";
  cutsceneReveal: number;
  onInteract: (id: string) => void;
  onExit: () => void;
  snapshot: GameCanvasSnapshot;
  advanceMs: (ms: number) => void;
  applyProps: (props: StageRendererProps) => void;
};

type SceneWithController = PhaserScene & {
  controller?: SceneController;
  rebuildStage?: () => void;
  refreshState?: () => void;
  advanceManual?: (ms: number) => void;
};

type InteractionView = {
  id: string;
  label: string;
  position: Point;
  container: PhaserContainer;
  pulse: PhaserEllipse;
  icon: PhaserContainer;
  labelText: PhaserText;
};

type PresenceView = {
  appearAfterFragments: number;
  sprite: PhaserContainer;
};

type WorldFacing = "down" | "up" | "left" | "right";

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

function createHeroSprite(scene: PhaserScene) {
  const root = scene.add.container(0, 0);
  const shadow = scene.add.ellipse(0, 22, 24, 8, 0x12081f, 0.24);
  const aura = scene.add.ellipse(0, 2, 30, 36, 0x74f7ff, 0.14);
  const hairBack = scene.add.ellipse(0, -7, 24, 22, 0x170c24, 1);
  const face = scene.add.ellipse(0, -5, 18, 20, 0xf1c8aa, 1);
  const hairFront = scene.add.triangle(0, -16, -11, 5, 0, -9, 11, 5, 0xf4cd66, 1);
  const hoodieShadow = scene.add.rectangle(0, 12, 22, 17, 0x223688, 1);
  const hoodie = scene.add.rectangle(0, 10, 19, 16, 0x3762d9, 1);
  const eye = scene.add.ellipse(3, -5, 3, 3.4, 0x160c22, 1);
  const scarf = scene.add.rectangle(0, 16, 8, 5, 0x58c7ff, 1);
  const legL = scene.add.rectangle(-5, 24, 4, 10, 0xf6f4ff, 1);
  const legR = scene.add.rectangle(5, 24, 4, 10, 0xf6f4ff, 1);

  root.add([shadow, aura, hairBack, face, hairFront, hoodieShadow, hoodie, eye, scarf, legL, legR]);
  root.setDepth(20);

  return {
    root,
    legL,
    legR,
    hairFront,
    aura,
  };
}

function createGirlSprite(scene: PhaserScene, state: "distant" | "soft" | "smile" | "radiant" | "moonwatch") {
  const paletteByState = {
    distant: { aura: 0x6ff0ff, hoodie: 0x4b61cc, hoodieShadow: 0x2e419e, blush: 0xff8cb2, glow: 0.18 },
    soft: { aura: 0x8df5ff, hoodie: 0x536df0, hoodieShadow: 0x364bb0, blush: 0xff8cb2, glow: 0.22 },
    smile: { aura: 0xffd874, hoodie: 0x5d75ff, hoodieShadow: 0x3b55be, blush: 0xff72a6, glow: 0.28 },
    radiant: { aura: 0xffcf74, hoodie: 0x6780ff, hoodieShadow: 0x4460c5, blush: 0xff5f95, glow: 0.34 },
    moonwatch: { aura: 0xffe29d, hoodie: 0x6480f0, hoodieShadow: 0x4661c7, blush: 0xff79a4, glow: 0.38 },
  }[state];

  const root = scene.add.container(0, 0);
  const aura = scene.add.ellipse(0, 0, 42, 54, paletteByState.aura, paletteByState.glow);
  const hoodieShadow = scene.add.rectangle(0, 14, 28, 20, paletteByState.hoodieShadow, 1);
  const hoodie = scene.add.rectangle(0, 12, 24, 18, paletteByState.hoodie, 1);
  const face = scene.add.ellipse(0, -6, 20, 23, 0xf4ccaf, 1);
  const hairBack = scene.add.ellipse(0, -11, 30, 28, 0x180d24, 1);
  const hairL = scene.add.rectangle(-12, 4, 7, 30, 0x180d24, 1);
  const hairR = scene.add.rectangle(12, 6, 7, 33, 0x180d24, 1);
  const hairShine = scene.add.rectangle(7, -18, 5, 10, 0x35185b, 0.92);
  const eyeL = scene.add.ellipse(state === "moonwatch" ? 0 : -4, -7, 3.2, 3.6, 0x160c22, 1);
  const eyeR = scene.add.ellipse(state === "moonwatch" ? 7 : 6, -8, 3, 3.4, 0x160c22, 1);
  const blushL = scene.add.ellipse(-8, 2, 7, 4, paletteByState.blush, 0.2);
  const blushR = scene.add.ellipse(8, 2, 7, 4, paletteByState.blush, 0.22);
  const smile = scene.add.ellipse(state === "moonwatch" ? 4 : 1, 7, 10, 5, paletteByState.blush, 0.9);
  const braces = scene.add.rectangle(state === "moonwatch" ? 4 : 1, 7, 12, 3, 0xfff8fd, 1);
  const earring = scene.add.ellipse(12, 1, 3.6, 4.5, 0xfffcef, 1);
  const shoulderL = scene.add.rectangle(-10, 14, 5, 11, 0xf4ccaf, 1);
  const shoulderR = scene.add.rectangle(10, 14, 5, 11, 0xf4ccaf, 1);

  root.add([
    aura,
    hoodieShadow,
    hoodie,
    hairBack,
    face,
    hairL,
    hairR,
    hairShine,
    eyeL,
    eyeR,
    blushL,
    blushR,
    smile,
    braces,
    earring,
    shoulderL,
    shoulderR,
  ]);
  root.setDepth(18);

  return { root, aura, hoodie, hairL, hairR, braces };
}

function createInteractionIcon(
  scene: PhaserScene,
  stage: GameStage,
  kind: GameStage["interactables"][number]["kind"],
) {
  const root = scene.add.container(0, 0);
  const shadow = scene.add.ellipse(0, 16, 18, 6, 0x12081f, 0.22);
  root.add(shadow);

  const addRect = (x: number, y: number, width: number, height: number, color: number, alpha = 1) => {
    root.add(scene.add.rectangle(x, y, width, height, color, alpha));
  };
  const addCircle = (x: number, y: number, radius: number, color: number, alpha = 1) => {
    root.add(scene.add.circle(x, y, radius, color, alpha));
  };

  const accent = Number(stage.palette.accent.replace("#", "0x"));
  const accentSoft = Number(stage.palette.accentSoft.replace("#", "0x"));
  const coral = Number(stage.palette.coral.replace("#", "0x"));
  const turquoise = Number(stage.palette.turquoise.replace("#", "0x"));
  const shadowColor = Number(stage.palette.shadow.replace("#", "0x"));

  switch (kind) {
    case "fragment":
      addCircle(0, -2, 8, accentSoft, 1);
      addCircle(3, 2, 4, accent, 0.85);
      break;
    case "telescope":
      addRect(0, -3, 12, 5, accentSoft);
      addRect(6, -8, 9, 5, coral);
      addRect(-4, 8, 3, 11, accent);
      addRect(0, 9, 3, 11, accent);
      addRect(4, 8, 3, 11, accent);
      break;
    case "chimes":
      addRect(0, -10, 20, 4, accentSoft);
      addRect(-6, -2, 2, 12, turquoise);
      addRect(0, 0, 2, 10, coral);
      addRect(6, -1, 2, 11, accent);
      break;
    case "sign":
      addRect(0, -4, 20, 14, accentSoft);
      addRect(0, 1, 14, 7, shadowColor);
      addRect(0, 11, 4, 12, coral);
      break;
    case "mirror":
      addRect(0, -4, 14, 20, accentSoft);
      addRect(0, -4, 9, 13, turquoise, 0.8);
      addRect(0, 10, 4, 10, coral);
      break;
    case "garland":
      addRect(0, -12, 24, 3, accentSoft);
      addCircle(-8, -7, 3, coral);
      addCircle(0, -5, 3, accent);
      addCircle(8, -8, 3, turquoise);
      break;
    case "arcade":
      addRect(0, -2, 18, 26, coral);
      addRect(0, -6, 12, 10, shadowColor);
      addRect(0, 6, 8, 4, accentSoft);
      break;
    case "pedestal":
      addRect(0, 5, 18, 12, accentSoft);
      addCircle(0, -8, 5, accent);
      break;
    case "bench":
      addRect(0, 0, 22, 6, accentSoft);
      addRect(-8, 8, 3, 8, shadowColor);
      addRect(8, 8, 3, 8, shadowColor);
      break;
    case "fountain":
      addCircle(0, 4, 12, turquoise, 0.82);
      addRect(0, -8, 12, 6, accentSoft);
      break;
    case "lantern":
      addRect(0, -2, 3, 22, accentSoft);
      addCircle(0, -14, 7, accent, 0.9);
      break;
    case "arch":
      addRect(-10, 0, 5, 24, accentSoft);
      addRect(10, 0, 5, 24, accentSoft);
      addRect(0, -10, 22, 6, accent);
      break;
    case "plaque":
      addRect(0, -3, 18, 12, accentSoft);
      addRect(0, -3, 10, 4, shadowColor);
      break;
  }

  return root;
}

function drawThemeBackground(graphics: PhaserGraphics, stage: GameStage) {
  const skyTop = Number(stage.palette.skyTop.replace("#", "0x"));
  const skyBottom = Number(stage.palette.skyBottom.replace("#", "0x"));
  const groundA = Number(stage.palette.groundA.replace("#", "0x"));
  const groundB = Number(stage.palette.groundB.replace("#", "0x"));
  const path = Number(stage.palette.path.replace("#", "0x"));
  const accent = Number(stage.palette.accent.replace("#", "0x"));
  const accentSoft = Number(stage.palette.accentSoft.replace("#", "0x"));
  const coral = Number(stage.palette.coral.replace("#", "0x"));
  const turquoise = Number(stage.palette.turquoise.replace("#", "0x"));
  const moon = Number(stage.palette.moon.replace("#", "0x"));

  graphics.clear();
  graphics.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
  graphics.fillRect(0, 0, stage.worldSize.width, stage.worldSize.height);

  graphics.fillStyle(moon, 0.22);
  graphics.fillCircle(stage.worldSize.width - 92, 56, 42);
  graphics.fillStyle(moon, 0.95);
  graphics.fillCircle(stage.worldSize.width - 92, 56, 26);

  const stars = [
    [40, 32],
    [84, 62],
    [142, 26],
    [218, 44],
    [286, 38],
    [342, 24],
    [420, 54],
  ];

  graphics.fillStyle(0xfef7de, 1);
  for (const [x, y] of stars) {
    graphics.fillCircle(x, y, 1.5);
  }

  if (stage.theme === "rooftops") {
    graphics.fillStyle(groundB, 1);
    graphics.fillRect(0, 112, stage.worldSize.width, stage.worldSize.height - 112);
    const roofs = [
      { x: 18, y: 142, w: 118, h: 54, color: groundA },
      { x: 156, y: 118, w: 134, h: 64, color: path },
      { x: 318, y: 136, w: 108, h: 56, color: groundA },
      { x: 442, y: 106, w: 94, h: 72, color: path },
    ];
    for (const roof of roofs) {
      graphics.fillStyle(roof.color, 1);
      graphics.fillRoundedRect(roof.x, roof.y, roof.w, roof.h, 6);
      graphics.fillStyle(accentSoft, 0.9);
      graphics.fillRect(roof.x, roof.y, roof.w, 5);
    }
    graphics.fillStyle(turquoise, 1);
    graphics.fillRoundedRect(56, 166, 28, 22, 4);
    graphics.fillStyle(coral, 1);
    graphics.fillRoundedRect(182, 126, 26, 10, 4);
  } else if (stage.theme === "circuit") {
    graphics.fillStyle(groundA, 1);
    graphics.fillRect(0, 102, stage.worldSize.width, stage.worldSize.height - 102);
    const shops = [
      { x: 18, y: 120, w: 94, h: 74, glow: coral },
      { x: 142, y: 104, w: 106, h: 82, glow: turquoise },
      { x: 286, y: 118, w: 98, h: 70, glow: accent },
      { x: 414, y: 96, w: 98, h: 86, glow: coral },
    ];
    for (const shop of shops) {
      graphics.fillStyle(groundB, 1);
      graphics.fillRoundedRect(shop.x, shop.y, shop.w, shop.h, 8);
      graphics.fillStyle(shop.glow, 0.95);
      graphics.fillRoundedRect(shop.x + 8, shop.y + 8, shop.w - 16, 10, 4);
    }
    graphics.fillStyle(path, 1);
    graphics.fillRect(0, 196, stage.worldSize.width, 18);
  } else if (stage.theme === "garden") {
    graphics.fillStyle(groundA, 1);
    graphics.fillRect(0, 98, stage.worldSize.width, stage.worldSize.height - 98);
    const paths = [
      { x: 18, y: 160, w: 124, h: 30 },
      { x: 152, y: 126, w: 124, h: 30 },
      { x: 286, y: 158, w: 118, h: 28 },
      { x: 418, y: 126, w: 92, h: 32 },
    ];
    graphics.fillStyle(path, 1);
    for (const pathItem of paths) {
      graphics.fillRoundedRect(pathItem.x, pathItem.y, pathItem.w, pathItem.h, 8);
    }
    graphics.fillStyle(turquoise, 0.8);
    graphics.fillEllipse(344, 196, 72, 34);
    graphics.fillStyle(accent, 1);
    graphics.fillCircle(172, 148, 8);
    graphics.fillCircle(452, 138, 8);
  } else {
    graphics.fillStyle(groundB, 1);
    graphics.fillRect(0, 104, stage.worldSize.width, stage.worldSize.height - 104);
    const terraces = [
      { x: 14, y: 174, w: 112, h: 32 },
      { x: 146, y: 148, w: 116, h: 28 },
      { x: 278, y: 120, w: 116, h: 28 },
      { x: 412, y: 92, w: 108, h: 34 },
    ];
    graphics.fillStyle(path, 1);
    for (const terrace of terraces) {
      graphics.fillRoundedRect(terrace.x, terrace.y, terrace.w, terrace.h, 8);
    }
    graphics.fillStyle(accentSoft, 1);
    graphics.fillRoundedRect(434, 58, 54, 36, 8);
    graphics.fillStyle(turquoise, 0.85);
    graphics.fillRoundedRect(447, 66, 28, 18, 6);
  }
}

function createSceneClass(Phaser: PhaserModule, controller: SceneController) {
  return class MoonScene extends Phaser.Scene {
    private cameraRoot!: PhaserContainer;
    private background!: PhaserGraphics;
    private effectLayer!: PhaserGraphics;
    private hero!: ReturnType<typeof createHeroSprite>;
    private girlPresences: PresenceView[] = [];
    private interactions = new Map<string, InteractionView>();
    private exitView!: StageObjectViews;
    private playerTarget: Point | null = null;
    private playerFacing: WorldFacing = "right";
    private playerPosition: Point = { ...controller.stage.spawn };
    private interactionCooldownMs = 0;
    private elapsedMs = 0;
    rebuildStage?: () => void;
    refreshState?: () => void;
    advanceManual?: (ms: number) => void;

    create() {
      this.cameras.main.setBounds(0, 0, controller.stage.worldSize.width, controller.stage.worldSize.height);
      this.cameras.main.setZoom(1);
      this.cameras.main.roundPixels = true;

      this.cameraRoot = this.add.container(0, 0);
      this.background = this.add.graphics();
      this.effectLayer = this.add.graphics();
      this.cameraRoot.add([this.background, this.effectLayer]);

      this.hero = createHeroSprite(this);
      this.hero.root.setScale(1.26);
      this.cameraRoot.add(this.hero.root);

      const exitRoot = this.add.container(controller.stage.exit.x, controller.stage.exit.y);
      const exitPulse = this.add.ellipse(0, 0, 52, 52, 0xffe39d, 0.14);
      const exitBody = this.add.rectangle(0, 4, 36, 34, 0x12081f, 0.9);
      const exitDoor = this.add.rectangle(0, 8, 18, 20, 0x2a1755, 1);
      const exitGlint = this.add.ellipse(0, -18, 10, 10, 0xffefb9, 0.9);
      exitRoot.add([exitPulse, exitBody, exitDoor, exitGlint]);
      this.exitView = { root: exitRoot, marker: exitPulse, glint: exitGlint };
      this.cameraRoot.add(exitRoot);

      this.input.on("pointerdown", (pointer: import("phaser").Input.Pointer) => {
        if (controller.dialogueOpen || controller.mode !== "playing") return;
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.pickTarget({ x: worldPoint.x, y: worldPoint.y });
      });

      this.rebuildStage = () => {
        this.background.clear();
        this.effectLayer.clear();
        drawThemeBackground(this.background, controller.stage);

        for (const view of this.interactions.values()) {
          view.container.destroy(true);
        }
        this.interactions.clear();

        for (const presence of this.girlPresences) {
          presence.sprite.destroy(true);
        }
        this.girlPresences = [];

        this.playerTarget = null;
        this.playerFacing = "right";
        this.playerPosition = { ...controller.stage.spawn };
        this.hero.root.setPosition(this.playerPosition.x, this.playerPosition.y);

        for (const interactable of controller.stage.interactables) {
          const pulse = this.add.ellipse(0, 0, 34, 18, 0xfff0be, 0.2);
          const icon = createInteractionIcon(this, controller.stage, interactable.kind);
          const labelText = this.add.text(0, -30, interactable.label, {
            fontFamily: "var(--font-ui)",
            fontSize: "12px",
            color: "#fff4d2",
            stroke: "#13082e",
            strokeThickness: 4,
          });
          labelText.setOrigin(0.5);
          const container = this.add.container(interactable.position.x, interactable.position.y);
          container.add([pulse, icon, labelText]);
          this.cameraRoot.add(container);
          this.interactions.set(interactable.id, {
            id: interactable.id,
            label: interactable.label,
            position: interactable.position,
            container,
            pulse,
            icon,
            labelText,
          });
        }

        for (const presence of controller.stage.girlPresences) {
          const sprite = createGirlSprite(this, presence.state);
          sprite.root.setPosition(presence.position.x, presence.position.y);
          sprite.root.setScale(presence.scale * 1.38);
          this.cameraRoot.add(sprite.root);
          this.girlPresences.push({
            appearAfterFragments: presence.appearAfterFragments,
            sprite: sprite.root,
          });
        }

        this.refreshState?.();
      };

      this.refreshState = () => {
        const fragmentsCollected = collectCount(controller.stage, controller.interactedIds);
        const exitOpen = fragmentsCollected >= controller.stage.fragmentCount;

        for (const interactable of controller.stage.interactables) {
          const view = this.interactions.get(interactable.id);
          if (!view) continue;
          const collected = controller.interactedIds.includes(interactable.id);
          view.container.setVisible(!collected && controller.mode === "playing");
        }

        for (const presence of this.girlPresences) {
          const visible = controller.mode === "cutscene" || fragmentsCollected >= presence.appearAfterFragments;
          presence.sprite.setVisible(visible);
          presence.sprite.setAlpha(visible ? 0.78 + fragmentsCollected * 0.05 : 0);
        }

        this.exitView.root.setPosition(controller.stage.exit.x, controller.stage.exit.y);
        this.exitView.root.setVisible(controller.mode === "playing");
        this.exitView.marker.setVisible(exitOpen);
        this.exitView.glint.setVisible(exitOpen);
      };

      this.advanceManual = (ms: number) => {
        this.stepScene(ms);
      };

      this.rebuildStage();
      this.cameras.main.centerOn(this.playerPosition.x, this.playerPosition.y);
      this.updateSnapshot();
    }

    update(_: number, delta: number) {
      this.stepScene(delta);
    }

    private pickTarget(worldPoint: Point) {
      const currentStage = controller.stage;

      for (const item of currentStage.interactables) {
        if (controller.interactedIds.includes(item.id)) continue;
        if (distance(item.position, worldPoint) <= item.radius + 16) {
          this.playerTarget = { ...item.position };
          return;
        }
      }

      const fragmentsCollected = collectCount(currentStage, controller.interactedIds);
      if (
        fragmentsCollected >= currentStage.fragmentCount &&
        distance(currentStage.exit, worldPoint) <= 44
      ) {
        this.playerTarget = { ...currentStage.exit };
        return;
      }

      this.playerTarget = {
        x: clamp(worldPoint.x, 24, currentStage.worldSize.width - 24),
        y: clamp(worldPoint.y, 86, currentStage.worldSize.height - 18),
      };
    }

    private triggerNearbyInteraction() {
      if (controller.dialogueOpen || controller.mode !== "playing" || this.interactionCooldownMs > 0) {
        return;
      }

      for (const item of controller.stage.interactables) {
        if (controller.interactedIds.includes(item.id)) continue;
        if (distance(this.playerPosition, item.position) <= interactionAutoRadius + 4) {
          this.playerTarget = null;
          this.interactionCooldownMs = 260;
          controller.onInteract(item.id);
          return;
        }
      }

      if (
        collectCount(controller.stage, controller.interactedIds) >= controller.stage.fragmentCount &&
        distance(this.playerPosition, controller.stage.exit) <= 52
      ) {
        this.playerTarget = null;
        this.interactionCooldownMs = 320;
        controller.onExit();
      }
    }

    private animateHero() {
      this.hero.legL.scaleY = 0.94 + Math.sin(this.elapsedMs / 170) * 0.08;
      this.hero.legR.scaleY = 0.94 - Math.sin(this.elapsedMs / 170) * 0.08;
      this.hero.hairFront.rotation = Math.max(-0.12, Math.min(0.12, (this.hero.root.x - this.playerPosition.x) * 0.01));
      this.hero.aura.setScale(1 + Math.sin(this.elapsedMs / 220) * 0.06);
      this.hero.root.scaleX = this.playerFacing === "left" ? -1 : 1;
      this.hero.root.scaleY = 1.26;
      this.hero.root.scaleX = this.playerFacing === "left" ? -1.26 : 1.26;
      this.hero.root.y = this.playerPosition.y + Math.sin(this.elapsedMs / 180) * 0.8;
    }

    private animateWorld(deltaMs: number) {
      const fragmentsCollected = collectCount(controller.stage, controller.interactedIds);
      const exitOpen = fragmentsCollected >= controller.stage.fragmentCount;

      for (const [index, view] of Array.from(this.interactions.values()).entries()) {
        const pulse = 0.74 + (Math.sin(this.elapsedMs / 240 + index) + 1) * 0.16;
        view.pulse.setScale(1 + pulse * 0.22, 1 + pulse * 0.16);
        view.pulse.setAlpha(0.15 + pulse * 0.18);
        view.icon.y = Math.sin(this.elapsedMs / 360 + index) * 2;
        view.labelText.setAlpha(0.72 + pulse * 0.3);
      }

      for (const [index, presence] of this.girlPresences.entries()) {
        presence.sprite.y += Math.sin(this.elapsedMs / 440 + index) * 0.02 * deltaMs;
      }

      this.exitView.marker.setScale(1 + Math.sin(this.elapsedMs / 250) * 0.08);
      this.exitView.marker.setAlpha(exitOpen ? 0.18 + (Math.sin(this.elapsedMs / 250) + 1) * 0.08 : 0);
      this.exitView.glint.setScale(1 + Math.sin(this.elapsedMs / 220) * 0.16);
    }

    private stepScene(deltaMs: number) {
      this.elapsedMs += deltaMs;
      this.interactionCooldownMs = Math.max(0, this.interactionCooldownMs - deltaMs);

      if (controller.mode === "playing" && !controller.dialogueOpen) {
        if (this.playerTarget) {
          const from = this.playerPosition;
          const target = this.playerTarget;
          const distanceToTarget = distance(from, target);
          this.playerFacing = getFacing(from, target, this.playerFacing);

          if (distanceToTarget <= 1.5) {
            this.playerPosition = { ...target };
            this.playerTarget = null;
          } else {
            const stepDistance = (deltaMs / 1000) * 58;
            const ratio = Math.min(1, stepDistance / distanceToTarget);
            this.playerPosition = {
              x: lerp(from.x, target.x, ratio),
              y: lerp(from.y, target.y, ratio),
            };
          }
        }

        this.triggerNearbyInteraction();
      }

      if (controller.mode === "cutscene") {
        const reveal = controller.cutsceneReveal;
        this.playerPosition = { x: 78, y: 188 };
        this.playerFacing = "right";
        if (this.girlPresences[0]) {
          this.girlPresences[0].sprite.setVisible(true);
          this.girlPresences[0].sprite.setPosition(234, 164 - reveal * 4);
          this.girlPresences[0].sprite.setScale(2.8 + reveal * 0.18);
          this.girlPresences[0].sprite.setAlpha(0.88 + reveal * 0.12);
        }
        this.exitView.root.setVisible(false);
      }

      this.hero.root.setPosition(this.playerPosition.x, this.playerPosition.y);
      this.animateHero();
      this.animateWorld(deltaMs);
      this.cameras.main.centerOn(this.playerPosition.x, this.playerPosition.y);
      this.updateSnapshot();
    }

    private updateSnapshot() {
      const fragmentsCollected = collectCount(controller.stage, controller.interactedIds);
      controller.snapshot = {
        mode: controller.mode,
        stageId: controller.stage.id,
        coordinateSystem: "origin: top-left, x+: right, y+: down",
        player: {
          x: Math.round(this.playerPosition.x),
          y: Math.round(this.playerPosition.y),
          facing: this.playerFacing,
          targetX: this.playerTarget ? Math.round(this.playerTarget.x) : null,
          targetY: this.playerTarget ? Math.round(this.playerTarget.y) : null,
        },
        fragmentsCollected,
        fragmentsTotal: controller.stage.fragmentCount,
        exitOpen: fragmentsCollected >= controller.stage.fragmentCount,
        exit: controller.stage.exit,
        visibleInteractions: controller.stage.interactables
          .filter((item) => !controller.interactedIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            label: item.label,
            x: item.position.x,
            y: item.position.y,
          })),
      };
    }
  };
}

export const StageRenderer = forwardRef<StageRendererHandle, StageRendererProps>(
  function StageRenderer(props, ref) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<PhaserGame | null>(null);
    const sceneRef = useRef<SceneWithController | null>(null);
    const controllerRef = useRef<SceneController>({
      stage: props.stage,
      interactedIds: props.interactedIds,
      dialogueOpen: props.dialogueOpen,
      mode: props.mode,
      cutsceneReveal: props.cutsceneReveal,
      onInteract: props.onInteract,
      onExit: props.onExit,
      snapshot: createInitialSnapshot(props.stage, props.interactedIds),
      advanceMs(ms: number) {
        sceneRef.current?.advanceManual?.(ms);
      },
      applyProps(nextProps: StageRendererProps) {
        const previousStageId = this.stage.id;
        this.stage = nextProps.stage;
        this.interactedIds = nextProps.interactedIds;
        this.dialogueOpen = nextProps.dialogueOpen;
        this.mode = nextProps.mode;
        this.cutsceneReveal = nextProps.cutsceneReveal;
        this.onInteract = nextProps.onInteract;
        this.onExit = nextProps.onExit;

        if (sceneRef.current) {
          if (previousStageId !== nextProps.stage.id) {
            sceneRef.current.rebuildStage?.();
          } else {
            sceneRef.current.refreshState?.();
          }
        }
      },
    });

    useImperativeHandle(ref, () => ({
      advanceTime(ms: number) {
        controllerRef.current.advanceMs(ms);
      },
      getSnapshot() {
        return controllerRef.current.snapshot;
      },
    }), []);

    useEffect(() => {
      controllerRef.current.applyProps(props);
    }, [props]);

    useEffect(() => {
      let destroyed = false;

      const boot = async () => {
        if (!hostRef.current) return;
        const Phaser = await import("phaser");
        if (destroyed || !hostRef.current) return;

        const SceneClass = createSceneClass(Phaser, controllerRef.current);
        const game = new Phaser.Game({
          type: Phaser.CANVAS,
          parent: hostRef.current,
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: "#000000",
          transparent: true,
          scene: SceneClass,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: canvasSize.width,
            height: canvasSize.height,
          },
          audio: {
            noAudio: true,
          },
          render: {
            pixelArt: false,
            antialias: true,
            roundPixels: true,
          },
        });

        gameRef.current = game;
        const [scene] = game.scene.getScenes(true) as SceneWithController[];
        sceneRef.current = scene ?? null;
      };

      void boot();

      return () => {
        destroyed = true;
        sceneRef.current = null;
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    }, []);

    return (
      <div
        ref={hostRef}
        className="game-canvas"
        aria-label={`${props.stage.label}: ${props.stage.stageTitle}`}
      />
    );
  },
);
