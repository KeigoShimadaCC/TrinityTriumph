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

export const useGameStore = create<GameState>((set, get) => ({
  phase: "command",
  playerHP: 100,
  enemyHP: getEnemy(0).baseHP,
  enemyIndex: 0,
  burst: 0,
  burstArmed: false,
  burstUsed: false,
  lastOutcome: null,
  playerMove: null,
  enemyMove: null,
  telegraph: pickTelegraph(),
  message: "Choose your command.",
  chooseMove: (move) => {
    const state = get();
    if (state.phase !== "command") return;

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
          const hasNextEnemy =
            resetState.enemyIndex < enemies.length - 1 &&
            resetState.enemyHP === 0;
          set({
            phase: "result",
            message:
              resetState.playerHP === 0
                ? "Defeated. Reset?"
                : hasNextEnemy
                ? "Opponent down. Advance?"
                : "Victory. Reset?"
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
    if (state.burst < 100) return;
    set({ burstArmed: !state.burstArmed });
  },
  advanceEnemy: () => {
    const state = get();
    const nextIndex = Math.min(state.enemyIndex + 1, enemies.length - 1);
    const nextEnemy = getEnemy(nextIndex);
    set({
      phase: "result",
      enemyIndex: nextIndex,
      enemyHP: nextEnemy.baseHP,
      burst: 0,
      burstArmed: false,
      burstUsed: false,
      lastOutcome: null,
      playerMove: null,
      enemyMove: null,
      telegraph: pickTelegraph(),
      message: "Next opponent locked."
    });
    setTimeout(() => {
      set({ phase: "command", message: "Choose your command." });
    }, 400);
  },
  reset: () =>
    set({
      phase: "command",
      playerHP: 100,
      enemyHP: getEnemy(0).baseHP,
      enemyIndex: 0,
      burst: 0,
      burstArmed: false,
      burstUsed: false,
      lastOutcome: null,
      playerMove: null,
      enemyMove: null,
      telegraph: pickTelegraph(),
      message: "Choose your command."
    })
}));
