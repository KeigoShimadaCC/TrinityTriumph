import { create } from "zustand";
import { Difficulty, GameState, MoveType } from "../types";
import { compareMoves } from "../utils/rps";
import { clamp, pickWeighted } from "../utils/rng";
import { enemies } from "../data/enemies";
import { items } from "../data/items";
import { playerCharacter } from "../data/characters";
import { worldHeight, worldWidth } from "../data/worldMap";

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

const basePlayerAttack = playerCharacter.attack;
const basePlayerDefense = playerCharacter.defense;

const sumStats = (
  base: Record<MoveType, number>,
  bonus: Partial<Record<MoveType, number>> | undefined
) => ({
  rock: base.rock + (bonus?.rock ?? 0),
  scissors: base.scissors + (bonus?.scissors ?? 0),
  paper: base.paper + (bonus?.paper ?? 0)
});

const getEquippedItems = (equippedIds: string[]) =>
  items.filter((item) => equippedIds.includes(item.id));

const getPlayerStats = (equippedIds: string[]) => {
  const equipped = getEquippedItems(equippedIds);
  const attackBonus = equipped.reduce<Partial<Record<MoveType, number>>>(
    (acc, item) => ({
      rock: (acc.rock ?? 0) + (item.attack?.rock ?? 0),
      scissors: (acc.scissors ?? 0) + (item.attack?.scissors ?? 0),
      paper: (acc.paper ?? 0) + (item.attack?.paper ?? 0)
    }),
    {}
  );
  const defenseBonus = equipped.reduce<Partial<Record<MoveType, number>>>(
    (acc, item) => ({
      rock: (acc.rock ?? 0) + (item.defense?.rock ?? 0),
      scissors: (acc.scissors ?? 0) + (item.defense?.scissors ?? 0),
      paper: (acc.paper ?? 0) + (item.defense?.paper ?? 0)
    }),
    {}
  );
  return {
    attack: sumStats(basePlayerAttack, attackBonus),
    defense: sumStats(basePlayerDefense, defenseBonus)
  };
};

const applyElementModifier = (baseDamage: number, attack: number, defense: number) =>
  Math.max(1, Math.round(baseDamage + (attack - defense) * 0.6));

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

export const useGameStore = create<GameState>((set, get) => ({
  mode: "field",
  phase: "command",
  playerHP: 100,
  enemyHP: getEnemy(0).baseHP,
  enemyIndex: 0,
  playerPos: { x: 4, y: 4 },
  defeatedEnemyIds: [],
  equippedItemIds: [],
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
      const playerStats = getPlayerStats(nextState.equippedItemIds);
      let playerHP = nextState.playerHP;
      let enemyHP = nextState.enemyHP;
      let burst = nextState.burst;
      let burstArmed = nextState.burstArmed;
      let burstUsed = false;
      let message = "";

      if (outcome === "win") {
        const bonus = burstArmed ? 12 : 0;
        const playerAttack = playerStats.attack[move];
        const enemyDefense = currentEnemy.defense[move];
        const modifiedDamage = applyElementModifier(
          currentTuning.damageToEnemy + bonus,
          playerAttack,
          enemyDefense
        );
        enemyHP = clamp(
          enemyHP - modifiedDamage,
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
        const enemyAttack = currentEnemy.attack[enemyMove];
        const playerDefense = playerStats.defense[enemyMove];
        const modifiedDamage = applyElementModifier(
          currentTuning.damageToPlayer,
          enemyAttack,
          playerDefense
        );
        playerHP = clamp(
          playerHP - modifiedDamage,
          0,
          100
        );
        burst = clamp(burst + currentTuning.burstLose, 0, 100);
        message = "Impact taken.";
      } else {
        const playerAttack = playerStats.attack[move];
        const enemyDefense = currentEnemy.defense[move];
        const enemyAttack = currentEnemy.attack[enemyMove];
        const playerDefense = playerStats.defense[enemyMove];
        const playerDamage = applyElementModifier(
          currentTuning.drawDamage,
          enemyAttack,
          playerDefense
        );
        const enemyDamage = applyElementModifier(
          currentTuning.drawDamage,
          playerAttack,
          enemyDefense
        );
        playerHP = clamp(playerHP - playerDamage, 0, 100);
        enemyHP = clamp(enemyHP - enemyDamage, 0, currentEnemy.baseHP);
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
  movePlayer: (dx, dy, canMove) => {
    const state = get();
    if (state.mode !== "field") return;
    if (!canMove) {
      set({ message: "Blocked terrain." });
      return;
    }
    const nextX = clamp(state.playerPos.x + dx, 0, worldWidth - 1);
    const nextY = clamp(state.playerPos.y + dy, 0, worldHeight - 1);
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
  toggleEquipItem: (itemId) => {
    const state = get();
    if (state.mode !== "field") return;
    const alreadyEquipped = state.equippedItemIds.includes(itemId);
    if (alreadyEquipped) {
      set({
        equippedItemIds: state.equippedItemIds.filter((id) => id !== itemId),
        message: "Item unequipped."
      });
      return;
    }
    if (state.equippedItemIds.length >= 3) {
      set({ message: "Equip limit reached." });
      return;
    }
    set({
      equippedItemIds: [...state.equippedItemIds, itemId],
      message: "Item equipped."
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
      equippedItemIds: [],
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
