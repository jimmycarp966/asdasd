export type Point = {
  x: number;
  y: number;
};

export type GirlPortraitState = "icon" | "soft" | "smile" | "radiant" | "moonwatch";

export type GirlWorldState = "distant" | "soft" | "smile" | "radiant" | "moonwatch";

export type StageTheme = "rooftops" | "circuit" | "garden" | "observatory";

export type TrackConfig = {
  title: string;
  artist: string;
  videoId: string;
  startSeconds: number;
  endSeconds: number | null;
  fallbackDurationSeconds: number;
};

export type StagePalette = {
  skyTop: string;
  skyBottom: string;
  moon: string;
  moonGlow: string;
  groundA: string;
  groundB: string;
  path: string;
  accent: string;
  accentSoft: string;
  coral: string;
  turquoise: string;
  ui: string;
  shadow: string;
};

export type DialogBeat = {
  speaker: string;
  title?: string;
  lines: string[];
  portrait?: GirlPortraitState;
};

export type InteractableKind =
  | "fragment"
  | "telescope"
  | "chimes"
  | "sign"
  | "mirror"
  | "garland"
  | "arcade"
  | "pedestal"
  | "bench"
  | "fountain"
  | "lantern"
  | "arch"
  | "plaque";

export type StageInteractable = {
  id: string;
  kind: InteractableKind;
  position: Point;
  radius: number;
  label: string;
  grantsFragment: boolean;
  dialog: DialogBeat;
};

export type StageGirlPresence = {
  position: Point;
  scale: number;
  state: GirlWorldState;
  appearAfterFragments: number;
};

export type StageExitDialog = DialogBeat & {
  buttonLabel: string;
};

export type EndingMessage = {
  title: string;
  line: string;
  subline: string;
};

export type GameStage = {
  id: string;
  label: string;
  stageTitle: string;
  theme: StageTheme;
  worldSize: {
    width: number;
    height: number;
  };
  spawn: Point;
  exit: Point;
  fragmentCount: number;
  palette: StagePalette;
  track: TrackConfig;
  introLine: string;
  girlPresences: StageGirlPresence[];
  interactables: StageInteractable[];
  exitDialog: StageExitDialog;
};

export const storyTitle = "La historia de la luna";
export const storyStartLabel = "Start";
export const storyStartHint = "Una aventura chiquita para una luna enorme.";
export const canvasSize = {
  width: 320,
  height: 240,
};
export const playerSpeed = 54;
export const tapReachRadius = 20;
export const interactionAutoRadius = 16;
export const fadeDurationMs = 700;
export const audioTargetVolume = 66;

export const endingMessage: EndingMessage = {
  title: "La luna tambien mira",
  line: "Como vos no hay ninguna, no brilla tanto la luna.",
  subline: "Feliz Dia de la Mujer.",
};

const sharedPalette = {
  moon: "#f5e8a1",
  moonGlow: "rgba(245, 232, 161, 0.34)",
  ui: "#fff4d2",
  shadow: "#12081f",
};

export const gameStages: GameStage[] = [
  {
    id: "moonrise",
    label: "Fase 1",
    stageTitle: "Moonrise Rooftops",
    theme: "rooftops",
    worldSize: { width: 520, height: 300 },
    spawn: { x: 48, y: 196 },
    exit: { x: 472, y: 154 },
    fragmentCount: 4,
    palette: {
      ...sharedPalette,
      skyTop: "#2533a7",
      skyBottom: "#13082e",
      groundA: "#2b1f59",
      groundB: "#432e76",
      path: "#66539d",
      accent: "#ffd86f",
      accentSoft: "#ffe7ab",
      coral: "#ff7e9e",
      turquoise: "#65f0ef",
    },
    track: {
      title: "Mujer Amante (version acustica)",
      artist: "Rata Blanca",
      videoId: "FiFsqQ92lR0",
      startSeconds: 0,
      endSeconds: 75,
      fallbackDurationSeconds: 75,
    },
    introLine: "La noche se prende en azoteas de colores mientras ella empieza a dibujarse en el cielo.",
    girlPresences: [
      { position: { x: 268, y: 116 }, scale: 1.1, state: "distant", appearAfterFragments: 0 },
      { position: { x: 406, y: 108 }, scale: 1.28, state: "soft", appearAfterFragments: 2 },
    ],
    interactables: [
      {
        id: "moonrise-telescope",
        kind: "telescope",
        position: { x: 102, y: 112 },
        radius: 18,
        label: "Telescopio",
        grantsFragment: true,
        dialog: {
          speaker: "Noche",
          title: "La silueta aparece",
          lines: [
            "En la azotea mas lejana ya se adivina su figura.",
            "Hasta la ciudad se queda quieta para verla mejor.",
          ],
          portrait: "soft",
        },
      },
      {
        id: "moonrise-fragment-a",
        kind: "fragment",
        position: { x: 204, y: 176 },
        radius: 16,
        label: "Fragmento lunar",
        grantsFragment: true,
        dialog: {
          speaker: "Luna",
          title: "Primer brillo",
          lines: [
            "La noche se empieza a ordenar alrededor de su silueta.",
          ],
          portrait: "soft",
        },
      },
      {
        id: "moonrise-chimes",
        kind: "chimes",
        position: { x: 318, y: 144 },
        radius: 18,
        label: "Campanillas",
        grantsFragment: true,
        dialog: {
          speaker: "Noche",
          title: "Todo acompana",
          lines: [
            "El viento aprende su ritmo sin hacer ruido.",
            "Cada brillo nuevo parece inventado para ella.",
          ],
          portrait: "soft",
        },
      },
      {
        id: "moonrise-sign",
        kind: "sign",
        position: { x: 408, y: 188 },
        radius: 18,
        label: "Cartel luminoso",
        grantsFragment: true,
        dialog: {
          speaker: "Noche",
          title: "La luna toma forma",
          lines: [
            "La luna se va armando con la misma luz que deja al pasar.",
          ],
          portrait: "soft",
        },
      },
    ],
    exitDialog: {
      speaker: "Noche",
      title: "Moonrise completo",
      lines: [
        "Ya no es solo una figura lejana.",
        "Ahora la noche sabe exactamente a quien estaba esperando.",
      ],
      portrait: "soft",
      buttonLabel: "Seguir",
    },
  },
  {
    id: "smile-circuit",
    label: "Fase 2",
    stageTitle: "Smile Circuit",
    theme: "circuit",
    worldSize: { width: 520, height: 300 },
    spawn: { x: 44, y: 188 },
    exit: { x: 472, y: 122 },
    fragmentCount: 4,
    palette: {
      ...sharedPalette,
      skyTop: "#5122b5",
      skyBottom: "#1a083d",
      groundA: "#2a1755",
      groundB: "#4f237b",
      path: "#734eab",
      accent: "#ffc96d",
      accentSoft: "#ffe6b4",
      coral: "#ff6f9d",
      turquoise: "#59f3ff",
    },
    track: {
      title: "Princesa",
      artist: "Las Pastillas del Abuelo",
      videoId: "iPrxzdVdIZw",
      startSeconds: 81,
      endSeconds: 137,
      fallbackDurationSeconds: 56,
    },
    introLine: "Las luces del pasaje se acomodan como si supieran que su sonrisa esta por entrar en escena.",
    girlPresences: [
      { position: { x: 252, y: 116 }, scale: 1.18, state: "soft", appearAfterFragments: 0 },
      { position: { x: 396, y: 96 }, scale: 1.34, state: "smile", appearAfterFragments: 2 },
    ],
    interactables: [
      {
        id: "circuit-mirror",
        kind: "mirror",
        position: { x: 112, y: 104 },
        radius: 18,
        label: "Espejo de vitrina",
        grantsFragment: true,
        dialog: {
          speaker: "Pasaje",
          title: "Reflejo nuevo",
          lines: [
            "Tenes esa forma de estar que vuelve todo mas lindo.",
          ],
          portrait: "smile",
        },
      },
      {
        id: "circuit-fragment-a",
        kind: "fragment",
        position: { x: 202, y: 188 },
        radius: 16,
        label: "Fragmento lunar",
        grantsFragment: true,
        dialog: {
          speaker: "Luces",
          title: "La sonrisa entra",
          lines: [
            "Su sonrisa empieza a prender el mapa entero.",
          ],
          portrait: "smile",
        },
      },
      {
        id: "circuit-garland",
        kind: "garland",
        position: { x: 314, y: 146 },
        radius: 18,
        label: "Guirnalda",
        grantsFragment: true,
        dialog: {
          speaker: "Pasaje",
          title: "Todo responde",
          lines: [
            "Hasta los colores cambian de humor cuando ella se acerca.",
            "Ni hablar de sus brackets: hacen juego con todas las luces.",
          ],
          portrait: "smile",
        },
      },
      {
        id: "circuit-arcade",
        kind: "arcade",
        position: { x: 408, y: 184 },
        radius: 18,
        label: "Cabina arcade",
        grantsFragment: true,
        dialog: {
          speaker: "Circuito",
          title: "El nivel la sigue",
          lines: [
            "La ciudad deja de ser fondo y se vuelve homenaje.",
          ],
          portrait: "smile",
        },
      },
    ],
    exitDialog: {
      speaker: "Circuito",
      title: "Smile Circuit completo",
      lines: [
        "Ahora ya se la ve mas cerca: pelo, sonrisa, brillo, todo.",
        "El nivel entero cambio de color y fue culpa suya.",
      ],
      portrait: "smile",
      buttonLabel: "Seguir",
    },
  },
  {
    id: "rare-garden",
    label: "Fase 3",
    stageTitle: "Rare Sky Garden",
    theme: "garden",
    worldSize: { width: 520, height: 300 },
    spawn: { x: 48, y: 196 },
    exit: { x: 470, y: 134 },
    fragmentCount: 4,
    palette: {
      ...sharedPalette,
      skyTop: "#1d45c8",
      skyBottom: "#10153c",
      groundA: "#255e53",
      groundB: "#367f6f",
      path: "#6fb0a1",
      accent: "#ffd15e",
      accentSoft: "#ffebb1",
      coral: "#ff7f8f",
      turquoise: "#75f6ff",
    },
    track: {
      title: "Lo Mas Fino",
      artist: "Las Pastillas del Abuelo",
      videoId: "3xXkGhLPxKM",
      startSeconds: 55,
      endSeconds: 95,
      fallbackDurationSeconds: 40,
    },
    introLine: "El cielo se vuelve jardin y todo se siente mas raro, mas lindo y mas de ella.",
    girlPresences: [
      { position: { x: 250, y: 122 }, scale: 1.2, state: "smile", appearAfterFragments: 0 },
      { position: { x: 392, y: 104 }, scale: 1.38, state: "radiant", appearAfterFragments: 2 },
    ],
    interactables: [
      {
        id: "garden-pedestal",
        kind: "pedestal",
        position: { x: 102, y: 112 },
        radius: 18,
        label: "Pedestal",
        grantsFragment: true,
        dialog: {
          speaker: "Constelacion",
          title: "No se parece a nadie",
          lines: [
            "No sos solo hermosa, sos de esas personas que no se parecen a nadie.",
          ],
          portrait: "radiant",
        },
      },
      {
        id: "garden-fragment-a",
        kind: "fragment",
        position: { x: 204, y: 192 },
        radius: 16,
        label: "Fragmento lunar",
        grantsFragment: true,
        dialog: {
          speaker: "Cielo",
          title: "Orbita propia",
          lines: [
            "Las constelaciones empiezan a copiarle la forma.",
          ],
          portrait: "radiant",
        },
      },
      {
        id: "garden-bench",
        kind: "bench",
        position: { x: 316, y: 150 },
        radius: 18,
        label: "Banco",
        grantsFragment: true,
        dialog: {
          speaker: "Jardin",
          title: "Todo gira",
          lines: [
            "Ya no estas cruzando un nivel.",
            "Estas entrando en su orbita.",
          ],
          portrait: "radiant",
        },
      },
      {
        id: "garden-fountain",
        kind: "fountain",
        position: { x: 418, y: 194 },
        radius: 18,
        label: "Fuente",
        grantsFragment: true,
        dialog: {
          speaker: "Jardin",
          title: "Version rara",
          lines: [
            "A esta altura hasta el cielo parece dedicado solo para ella.",
          ],
          portrait: "radiant",
        },
      },
    ],
    exitDialog: {
      speaker: "Cielo",
      title: "Rare Sky Garden completo",
      lines: [
        "La luna ya casi esta entera.",
        "A esta altura el paisaje existe nada mas para devolverle un poco de lo que ella ilumina.",
      ],
      portrait: "radiant",
      buttonLabel: "Seguir",
    },
  },
  {
    id: "final-run",
    label: "Fase 4",
    stageTitle: "Final Run",
    theme: "observatory",
    worldSize: { width: 520, height: 300 },
    spawn: { x: 40, y: 192 },
    exit: { x: 458, y: 102 },
    fragmentCount: 4,
    palette: {
      ...sharedPalette,
      skyTop: "#3d4ff0",
      skyBottom: "#14143f",
      groundA: "#3a2d78",
      groundB: "#5b49a9",
      path: "#9a88dd",
      accent: "#ffd568",
      accentSoft: "#fff0bf",
      coral: "#ff7fae",
      turquoise: "#7cf7ff",
    },
    track: {
      title: "La Vuelta al Mundo",
      artist: "Calle 13",
      videoId: "v_zZmsFZDaM",
      startSeconds: 113,
      endSeconds: null,
      fallbackDurationSeconds: 78,
    },
    introLine: "El camino final sube hacia la luna completa, y vos solo queres llegar para mirarla.",
    girlPresences: [
      { position: { x: 310, y: 112 }, scale: 1.22, state: "radiant", appearAfterFragments: 0 },
      { position: { x: 446, y: 86 }, scale: 1.48, state: "moonwatch", appearAfterFragments: 2 },
    ],
    interactables: [
      {
        id: "final-lantern",
        kind: "lantern",
        position: { x: 112, y: 114 },
        radius: 18,
        label: "Farol",
        grantsFragment: true,
        dialog: {
          speaker: "Camino",
          title: "La subida",
          lines: [
            "La luna completa ya la esta esperando.",
          ],
          portrait: "moonwatch",
        },
      },
      {
        id: "final-fragment-a",
        kind: "fragment",
        position: { x: 212, y: 188 },
        radius: 16,
        label: "Fragmento lunar",
        grantsFragment: true,
        dialog: {
          speaker: "Silencio",
          title: "Todo se acomoda",
          lines: [
            "Todo alrededor se acomoda para ese momento.",
          ],
          portrait: "moonwatch",
        },
      },
      {
        id: "final-arch",
        kind: "arch",
        position: { x: 316, y: 140 },
        radius: 18,
        label: "Arco",
        grantsFragment: true,
        dialog: {
          speaker: "Camino",
          title: "Mirador",
          lines: [
            "Ella se queda quieta.",
            "La luna tambien.",
          ],
          portrait: "moonwatch",
        },
      },
      {
        id: "final-plaque",
        kind: "plaque",
        position: { x: 404, y: 188 },
        radius: 18,
        label: "Placa",
        grantsFragment: true,
        dialog: {
          speaker: "Camino",
          title: "Ya casi",
          lines: [
            "Ya no queda nada por decir. Solo mirarla.",
          ],
          portrait: "moonwatch",
        },
      },
    ],
    exitDialog: {
      speaker: "Luna",
      title: "Final Run completo",
      lines: [
        "La escena final ya esta lista.",
      ],
      portrait: "moonwatch",
      buttonLabel: "Mirarla",
    },
  },
];

export const stageCount = gameStages.length;

export function getStageProgress(stage: GameStage, interactedIds: string[]) {
  const collected = stage.interactables.filter(
    (item) => item.grantsFragment && interactedIds.includes(item.id),
  ).length;

  return {
    collected,
    remaining: Math.max(0, stage.fragmentCount - collected),
    isComplete: collected >= stage.fragmentCount,
  };
}

