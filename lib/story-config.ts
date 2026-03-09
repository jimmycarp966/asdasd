export type GirlSpriteState =
  | "silhouette"
  | "distant"
  | "partial"
  | "smile"
  | "radiant"
  | "moonwatch";

export type HudState = "boot" | "hunt" | "close" | "rare" | "final";

export type StageCheckpoint = {
  id: string;
  progress: number;
  eventType: "dialog" | "collectible" | "reveal" | "goal";
  dialog: string;
  spriteState: GirlSpriteState;
  hudState: HudState;
};

export type StagePalette = {
  skyTop: string;
  skyBottom: string;
  accent: string;
  moon: string;
  platform: string;
  neon: string;
  haze: string;
  ui: string;
};

export type StageTheme = "rooftops" | "circuit" | "rare" | "final-run";

export type StoryStage = {
  id: string;
  stageLabel: string;
  stageTitle: string;
  introBanner: string;
  objective: string;
  trackTitle: string;
  artist: string;
  videoId: string;
  startSeconds: number;
  endSeconds: number | null;
  clipDurationSeconds: number;
  exitUnlockAtProgress: number;
  palette: StagePalette;
  backgroundTheme: StageTheme;
  collectibleTarget: number;
  hearts: number;
  checkpoints: StageCheckpoint[];
};

export const storyTitle = "La historia de la luna";
export const storyStartLabel = "PRESS START";
export const storyStartHint = "La luna estaba esperando esta noche.";
export const fadeDurationMs = 900;
export const stageHoldLeadSeconds = 2.8;

export const finalMessage = {
  title: "FINAL",
  line: "Como vos no hay ninguna, no brilla tanto la luna.",
  subline: "Feliz Dia de la Mujer.",
};

export const storyStages: StoryStage[] = [
  {
    id: "moonrise",
    stageLabel: "STAGE 1",
    stageTitle: "Moonrise",
    introBanner: "La ciudad se prende cuando ella aparece en pixeles.",
    objective: "La noche se empieza a ordenar alrededor de su silueta.",
    trackTitle: "Mujer Amante (version acustica)",
    artist: "Rata Blanca",
    videoId: "FiFsqQ92lR0",
    startSeconds: 0,
    endSeconds: 75,
    clipDurationSeconds: 75,
    exitUnlockAtProgress: 0.78,
    palette: {
      skyTop: "#08122f",
      skyBottom: "#02050f",
      accent: "#f0d37b",
      moon: "#f8ecc4",
      platform: "#182348",
      neon: "#74b8ff",
      haze: "#1a1640",
      ui: "#f6e8b7",
    },
    backgroundTheme: "rooftops",
    collectibleTarget: 4,
    hearts: 3,
    checkpoints: [
      {
        id: "boot",
        progress: 0.06,
        eventType: "dialog",
        dialog: "La noche arranca bajito, como si te estuviera nombrando.",
        spriteState: "silhouette",
        hudState: "boot",
      },
      {
        id: "moon-piece-1",
        progress: 0.16,
        eventType: "collectible",
        dialog: "El primer brillo cae justo donde empieza a aparecer.",
        spriteState: "silhouette",
        hudState: "hunt",
      },
      {
        id: "far-girl",
        progress: 0.22,
        eventType: "reveal",
        dialog: "En la azotea mas lejana ya se adivina su figura.",
        spriteState: "distant",
        hudState: "hunt",
      },
      {
        id: "moon-piece-2",
        progress: 0.43,
        eventType: "collectible",
        dialog: "Hasta el barrio parece quedarse quieto para verla.",
        spriteState: "distant",
        hudState: "hunt",
      },
      {
        id: "partial-reveal",
        progress: 0.46,
        eventType: "reveal",
        dialog: "La sonrisa ya asoma entre la noche.",
        spriteState: "partial",
        hudState: "close",
      },
      {
        id: "moon-piece-3",
        progress: 0.68,
        eventType: "collectible",
        dialog: "La luna se va armando con su propia luz.",
        spriteState: "partial",
        hudState: "close",
      },
      {
        id: "moon-piece-4",
        progress: 0.82,
        eventType: "collectible",
        dialog: "Todo el cielo sabe que ella ya esta aca.",
        spriteState: "partial",
        hudState: "close",
      },
      {
        id: "goal",
        progress: 0.95,
        eventType: "goal",
        dialog: "El borde ya la esta mirando.",
        spriteState: "partial",
        hudState: "close",
      },
    ],
  },
  {
    id: "smile-circuit",
    stageLabel: "STAGE 2",
    stageTitle: "Smile Circuit",
    introBanner: "Las luces del mapa aprenden su sonrisa.",
    objective: "El nivel entero cambia de color cuando ella aparece.",
    trackTitle: "Princesa",
    artist: "Las Pastillas del Abuelo",
    videoId: "iPrxzdVdIZw",
    startSeconds: 81,
    endSeconds: 137,
    clipDurationSeconds: 56,
    exitUnlockAtProgress: 0.74,
    palette: {
      skyTop: "#120b2c",
      skyBottom: "#050113",
      accent: "#ffb76b",
      moon: "#fde8b6",
      platform: "#25154c",
      neon: "#ff7b8b",
      haze: "#3e1f6a",
      ui: "#ffe9b8",
    },
    backgroundTheme: "circuit",
    collectibleTarget: 4,
    hearts: 3,
    checkpoints: [
      {
        id: "warmup",
        progress: 0.08,
        eventType: "dialog",
        dialog: "Todo se vuelve mas tibio apenas entra en escena.",
        spriteState: "partial",
        hudState: "close",
      },
      {
        id: "piece-1",
        progress: 0.18,
        eventType: "collectible",
        dialog: "Las ventanas ya no brillan igual.",
        spriteState: "partial",
        hudState: "close",
      },
      {
        id: "smile",
        progress: 0.27,
        eventType: "reveal",
        dialog: "Su sonrisa toma el control del nivel.",
        spriteState: "smile",
        hudState: "close",
      },
      {
        id: "piece-2",
        progress: 0.46,
        eventType: "collectible",
        dialog: "Los carteles la siguen como si la conocieran.",
        spriteState: "smile",
        hudState: "close",
      },
      {
        id: "brace-shine",
        progress: 0.58,
        eventType: "reveal",
        dialog: "Hasta sus brackets hacen juego con las luces.",
        spriteState: "smile",
        hudState: "close",
      },
      {
        id: "piece-3",
        progress: 0.68,
        eventType: "collectible",
        dialog: "Cada paso suyo deja el aire un poco mejor.",
        spriteState: "smile",
        hudState: "close",
      },
      {
        id: "piece-4",
        progress: 0.82,
        eventType: "collectible",
        dialog: "La ciudad deja de ser fondo y se vuelve homenaje.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "goal",
        progress: 0.94,
        eventType: "goal",
        dialog: "El circuito entero late con ella.",
        spriteState: "radiant",
        hudState: "rare",
      },
    ],
  },
  {
    id: "rare-stage",
    stageLabel: "STAGE 3",
    stageTitle: "Rare Stage",
    introBanner: "La noche entra en su version mas rara y mas linda.",
    objective: "Ya no hace falta correr tanto: todo gira alrededor suyo.",
    trackTitle: "Lo Mas Fino",
    artist: "Las Pastillas del Abuelo",
    videoId: "3xXkGhLPxKM",
    startSeconds: 55,
    endSeconds: 95,
    clipDurationSeconds: 40,
    exitUnlockAtProgress: 0.7,
    palette: {
      skyTop: "#100722",
      skyBottom: "#02010a",
      accent: "#ffd26f",
      moon: "#fff0c0",
      platform: "#30184c",
      neon: "#84f1ff",
      haze: "#562286",
      ui: "#f8f0bd",
    },
    backgroundTheme: "rare",
    collectibleTarget: 4,
    hearts: 3,
    checkpoints: [
      {
        id: "rare-boot",
        progress: 0.08,
        eventType: "dialog",
        dialog: "Nada de esto se parece a nadie, como ella.",
        spriteState: "smile",
        hudState: "rare",
      },
      {
        id: "piece-1",
        progress: 0.2,
        eventType: "collectible",
        dialog: "Otro fragmento cae donde ya habia luz.",
        spriteState: "smile",
        hudState: "rare",
      },
      {
        id: "rare-reveal",
        progress: 0.28,
        eventType: "reveal",
        dialog: "Su presencia le gana al paisaje sin esfuerzo.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "piece-2",
        progress: 0.48,
        eventType: "collectible",
        dialog: "Las constelaciones empiezan a copiarle la forma.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "dialog-2",
        progress: 0.61,
        eventType: "dialog",
        dialog: "Ya no estas cruzando un nivel: estas entrando en su orbita.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "piece-3",
        progress: 0.72,
        eventType: "collectible",
        dialog: "La luna casi completa le devuelve el brillo.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "piece-4",
        progress: 0.84,
        eventType: "collectible",
        dialog: "A esta altura hasta el cielo parece dedicado.",
        spriteState: "radiant",
        hudState: "rare",
      },
      {
        id: "goal",
        progress: 0.95,
        eventType: "goal",
        dialog: "El medidor lunar ya late entero.",
        spriteState: "radiant",
        hudState: "rare",
      },
    ],
  },
  {
    id: "final-run",
    stageLabel: "STAGE 4",
    stageTitle: "Final Run",
    introBanner: "La ultima corrida termina lejos, mirandola.",
    objective: "Vos llegas hasta el borde solo para verla con la luna.",
    trackTitle: "La Vuelta al Mundo",
    artist: "Calle 13",
    videoId: "v_zZmsFZDaM",
    startSeconds: 113,
    endSeconds: null,
    clipDurationSeconds: 78,
    exitUnlockAtProgress: 0.58,
    palette: {
      skyTop: "#090a1e",
      skyBottom: "#010105",
      accent: "#f6d889",
      moon: "#fff3c8",
      platform: "#1a2042",
      neon: "#93c9ff",
      haze: "#203060",
      ui: "#fff0b4",
    },
    backgroundTheme: "final-run",
    collectibleTarget: 3,
    hearts: 3,
    checkpoints: [
      {
        id: "final-boot",
        progress: 0.1,
        eventType: "dialog",
        dialog: "La luna completa ya la esta esperando.",
        spriteState: "radiant",
        hudState: "final",
      },
      {
        id: "piece-1",
        progress: 0.24,
        eventType: "collectible",
        dialog: "El silencio tambien sabe que ella es el centro.",
        spriteState: "radiant",
        hudState: "final",
      },
      {
        id: "moonwatch-setup",
        progress: 0.31,
        eventType: "reveal",
        dialog: "Ella se queda quieta. La luna tambien.",
        spriteState: "moonwatch",
        hudState: "final",
      },
      {
        id: "piece-2",
        progress: 0.52,
        eventType: "collectible",
        dialog: "Todo alrededor se acomoda para ese momento.",
        spriteState: "moonwatch",
        hudState: "final",
      },
      {
        id: "piece-3",
        progress: 0.66,
        eventType: "collectible",
        dialog: "Ya no queda nada por decir. Solo mirarla.",
        spriteState: "moonwatch",
        hudState: "final",
      },
      {
        id: "goal",
        progress: 0.92,
        eventType: "goal",
        dialog: "La noche ya encontro su imagen final.",
        spriteState: "moonwatch",
        hudState: "final",
      },
    ],
  },
];
