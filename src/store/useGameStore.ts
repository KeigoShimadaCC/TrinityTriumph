import { create } from "zustand";
import { Difficulty, GameState, MoveType } from "../types";
import { compareMoves } from "../utils/rps";
import { clamp, pickWeighted } from "../utils/rng";
import { enemies } from "../data/enemies";

const allMoves: MoveType[] = ["rock", "scissors", "paper"];

const pickRandomMove = () =>
  pickWeighted([
    { item: "rock", weight: 1 },
    { item: "scissors", weight: 1 },
    { item: "paper", weight: 1 }
  ]);

const pickTelegraph = () => pickRandomMove();

const difficultyTuning: Record<
  Difficulty,
  {
    telegraphWeight: number;
    damageToEnemy: number;
    damageToPlayer: number;
    drawDamage: number;
    burstWin: number;
    burstLose: number;
    burstDraw: number;
  }
> = {
  rookie: {
    telegraphWeight: 7,
    damageToEnemy: 16,
    damageToPlayer: 10,
    drawDamage: 4,
    burstWin: 35,
    burstLose: 12,
    burstDraw: 18
  },
  veteran: {
    telegraphWeight: 6,
    damageToEnemy: 15,
    damageToPlayer: 12,
    drawDamage: 5,
    burstWin: 30,
    burstLose: 12,
    burstDraw: 16
  },
  elite: {
    telegraphWeight: 5,
    damageToEnemy: 14,
    damageToPlayer: 14,
    drawDamage: 6,
    burstWin: 26,
    burstLose: 12,
    burstDraw: 14
  }
};

const pickEnemyMove = (
  telegraph: MoveType | null,
  telegraphWeight: number
) => {
  if (!telegraph) return pickRandomMove();
  const others = allMoves.filter((move) => move !== telegraph);
  const otherWeight = Math.max(1, (10 - telegraphWeight) / 2);
  return pickWeighted([
    { item: telegraph, weight: telegraphWeight },
    { item: others[0], weight: otherWeight },
    { item: others[1], weight: otherWeight }
  ]);
};

const getEnemy = (index: number) => {
  const safeIndex = Math.min(Math.max(index, 0), enemies.length - 1);
  return enemies[safeIndex];
};

const getAvailableEnemyIndices = (defeated: string[]) =>
  enemies
    .map((enemy, index) => ({ enemy, index }))
    .filter(({ enemy }) => !defeated.includes(enemy.id))
    .map(({ index }) => index);

const pickEncounterEnemy = (defeated: string[]) => {
  const remaining = getAvailableEnemyIndices(defeated);
  if (remaining.length === 0) return null;
  const choice = remaining[Math.floor(Math.random() * remaining.length)];
  return choice ?? null;
};

const gridSize = 9;

export const useGameStore = create<GameState>((set, get) => ({
  mode: "field",
  phase: "command",
  playerHP: 100,
  enemyHP: getEnemy(0).baseHP,
  enemyIndex: 0,
  playerPos: { x: 4, y: 4 },
  defeatedEnemyIds: [],
  burst: 0,
  burstArmed: false,
  burstUsed: false,
  lastOutcome: null,
  playerMove: null,
  enemyMove: null,
  telegraph: pickTelegraph(),
  message: "Explore the field.",
  chooseMove: (move) => {
    const state = get();
    if (state.mode !== "battle" || state.phase !== "command") return;

    const enemy = getEnemy(state.enemyIndex);
    const tuning = difficultyTuning[enemy.difficulty];
    const enemyMove = pickEnemyMove(state.telegraph, tuning.telegraphWeight);
    set({
      phase: "battle",
      playerMove: move,
      enemyMove,
      lastOutcome: null,
      message: "Clash!",
      burstUsed: false
    });

    setTimeout(() => {
      const outcome = compareMoves(move, enemyMove);
      const nextState = get();
      const currentEnemy = getEnemy(nextState.enemyIndex);
      const currentTuning = difficultyTuning[currentEnemy.difficulty];
      let playerHP = nextState.playerHP;
      let enemyHP = nextState.enemyHP;
      let burst = nextState.burst;
      let burstArmed = nextState.burstArmed;
      let burstUsed = false;
      let message = "";

      if (outcome === "win") {
        const bonus = burstArmed ? 12 : 0;
        enemyHP = clamp(
          enemyHP - (currentTuning.damageToEnemy + bonus),
          0,
          currentEnemy.baseHP
        );
        burst = clamp(burst + currentTuning.burstWin, 0, 100);
        message = bonus ? "TRINITY BURST!" : "Direct hit!";
        if (bonus) {
          burst = 0;
          burstArmed = false;
          burstUsed = true;
        }
      } else if (outcome === "lose") {
        playerHP = clamp(
          playerHP - currentTuning.damageToPlayer,
          0,
          100
        );
        burst = clamp(burst + currentTuning.burstLose, 0, 100);
        message = "Impact taken.";
      } else {
        playerHP = clamp(playerHP - currentTuning.drawDamage, 0, 100);
        enemyHP = clamp(
          enemyHP - currentTuning.drawDamage,
          0,
          currentEnemy.baseHP
        );
        burst = clamp(burst + currentTuning.burstDraw, 0, 100);
        message = "PARRY!";
      }

      set({
        phase: "result",
        playerHP,
        enemyHP,
        burst,
        burstArmed,
        burstUsed,
        lastOutcome: outcome,
        message,
        telegraph: pickTelegraph()
      });

      setTimeout(() => {
        const resetState = get();
        if (resetState.playerHP === 0 || resetState.enemyHP === 0) {
          const defeatedEnemy = getEnemy(resetState.enemyIndex);
          const defeatedEnemyIds =
            resetState.enemyHP === 0
              ? Array.from(
                  new Set([...resetState.defeatedEnemyIds, defeatedEnemy.id])
                )
              : resetState.defeatedEnemyIds;
          set({
            phase: "result",
            defeatedEnemyIds,
            message:
              resetState.playerHP === 0
                ? "Defeated. Reset run?"
                : "Victory. Return?"
          });
          return;
        }
        set({
          phase: "command",
          playerMove: null,
          enemyMove: null,
          lastOutcome: null,
          burstUsed: false,
          message: "Choose your command."
        });
      }, 800);
    }, 300);
  },
  toggleBurst: () => {
    const state = get();
    if (state.mode !== "battle" || state.burst < 100) return;
    set({ burstArmed: !state.burstArmed });
  },
  movePlayer: (dx, dy) => {
    const state = get();
    if (state.mode !== "field") return;
    const nextX = clamp(state.playerPos.x + dx, 0, gridSize - 1);
    const nextY = clamp(state.playerPos.y + dy, 0, gridSize - 1);
    const moved = nextX !== state.playerPos.x || nextY !== state.playerPos.y;
    if (!moved) return;

    const encounterChance = 0.22;
    const hasEnemies = getAvailableEnemyIndices(state.defeatedEnemyIds).length > 0;
    const shouldEncounter = hasEnemies && Math.random() < encounterChance;
    if (shouldEncounter) {
      const enemyIndex = pickEncounterEnemy(state.defeatedEnemyIds);
      const enemy = enemyIndex !== null ? getEnemy(enemyIndex) : null;
      if (!enemy || enemyIndex === null) {
        set({
          playerPos: { x: nextX, y: nextY },
          message: "The field is quiet."
        });
        return;
      }
      set({
        mode: "battle",
        phase: "command",
        enemyIndex,
        enemyHP: enemy.baseHP,
        playerMove: null,
        enemyMove: null,
        lastOutcome: null,
        burst: 0,
        burstArmed: false,
        burstUsed: false,
        telegraph: pickTelegraph(),
        message: `Encountered ${enemy.name}!`,
        playerPos: { x: nextX, y: nextY }
      });
      return;
    }

    set({
      playerPos: { x: nextX, y: nextY },
      message: hasEnemies ? "Exploring..." : "All foes cleared."
    });
  },
  returnToField: () => {
    const state = get();
    if (state.mode !== "battle") return;
    if (state.enemyHP > 0 && state.playerHP > 0) return;
    if (state.playerHP === 0) return;
    set({
      mode: "field",
      phase: "command",
      playerMove: null,
      enemyMove: null,
      lastOutcome: null,
      burstUsed: false,
      message: "Back to the field."
    });
  },
  reset: () =>
    set({
      mode: "field",
      phase: "command",
      playerHP: 100,
      enemyHP: getEnemy(0).baseHP,
      enemyIndex: 0,
      playerPos: { x: 4, y: 4 },
      defeatedEnemyIds: [],
      burst: 0,
      burstArmed: false,
      burstUsed: false,
      lastOutcome: null,
      playerMove: null,
      enemyMove: null,
      telegraph: pickTelegraph(),
      message: "Explore the field."
    })
}));
