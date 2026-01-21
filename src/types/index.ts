export type MoveType = "rock" | "scissors" | "paper";

export type Phase = "command" | "battle" | "result";

export type Mode = "field" | "battle";

export type Outcome = "win" | "lose" | "draw";

export type Difficulty = "rookie" | "veteran" | "elite";

export type StoryTag = "tutorial" | "rival" | "arena" | "boss";

export type ElementStats = Record<MoveType, number>;

export interface Character {
  id: string;
  name: string;
  color: string;
  anima: string;
  vibe: string;
  baseHP: number;
  description: string;
  attack: ElementStats;
  defense: ElementStats;
}

export interface Enemy {
  id: string;
  name: string;
  color: string;
  anima: string;
  baseHP: number;
  difficulty: Difficulty;
  storyTag: StoryTag;
  blurb: string;
  attack: ElementStats;
  defense: ElementStats;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  attack?: Partial<ElementStats>;
  defense?: Partial<ElementStats>;
}

export interface GameState {
  mode: Mode;
  phase: Phase;
  playerHP: number;
  enemyHP: number;
  enemyIndex: number;
  playerPos: { x: number; y: number };
  defeatedEnemyIds: string[];
  equippedItemIds: string[];
  burst: number;
  burstArmed: boolean;
  burstUsed: boolean;
  lastOutcome: Outcome | null;
  playerMove: MoveType | null;
  enemyMove: MoveType | null;
  telegraph: MoveType | null;
  message: string;
  chooseMove: (move: MoveType) => void;
  toggleBurst: () => void;
  movePlayer: (dx: number, dy: number) => void;
  returnToField: () => void;
  toggleEquipItem: (itemId: string) => void;
  reset: () => void;
}
