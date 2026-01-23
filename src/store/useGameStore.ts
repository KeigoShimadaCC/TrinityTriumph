import { create } from "zustand";
import { Difficulty, GameState, MoveType } from "../types";
import { compareMoves } from "../utils/rps";
import { clamp, pickWeighted } from "../utils/rng";
import { enemies } from "../data/enemies";
import { items } from "../data/items";
import { playerCharacter } from "../data/characters";
import {
  fieldMap,
  forestMap,
  harborMap,
  ruinsMap,
  townMap,
  worldHeight,
  worldWidth
} from "../data/worldMap";

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

const getPlayerStats = (
  equippedIds: string[],
  bonusAttack: Record<MoveType, number>,
  bonusDefense: Record<MoveType, number>
) => {
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
    attack: sumStats(sumStats(basePlayerAttack, bonusAttack), attackBonus),
    defense: sumStats(sumStats(basePlayerDefense, bonusDefense), defenseBonus)
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

const spawnPoint = { x: 4, y: 4 };

const getDistanceScale = (pos: { x: number; y: number }) => {
  const distance = Math.hypot(pos.x - spawnPoint.x, pos.y - spawnPoint.y);
  const factor = Math.min(distance / 14, 2);
  return 1 + factor * 0.2;
};

const scaleEnemyStats = (enemy: (typeof enemies)[number], scale: number) => ({
  baseHP: Math.round(enemy.baseHP * scale),
  attack: {
    rock: Math.round(enemy.attack.rock * scale),
    scissors: Math.round(enemy.attack.scissors * scale),
    paper: Math.round(enemy.attack.paper * scale)
  },
  defense: {
    rock: Math.round(enemy.defense.rock * scale),
    scissors: Math.round(enemy.defense.scissors * scale),
    paper: Math.round(enemy.defense.paper * scale)
  }
});

export const useGameStore = create<GameState>((set, get) => ({
  mode: "field",
  world: "field",
  phase: "command",
  playerHP: 100,
  playerMaxHP: 100,
  playerLevel: 1,
  playerExp: 0,
  playerExpToNext: 100,
  playerBonusAttack: { rock: 0, scissors: 0, paper: 0 },
  playerBonusDefense: { rock: 0, scissors: 0, paper: 0 },
  storyStage: 0,
  storyQuest: "Reach the nearby town.",
  visitedWorlds: {
    town: false,
    forest: false,
    harbor: false,
    ruins: false
  },
  enemyHP: getEnemy(0).baseHP,
  enemyMaxHP: getEnemy(0).baseHP,
  enemyScale: 1,
  enemyIndex: 0,
  playerPos: { x: spawnPoint.x, y: spawnPoint.y },
  fieldReturnPos: { x: spawnPoint.x, y: spawnPoint.y },
  defeatedEnemyIds: [],
  equippedItemIds: [],
  encountersEnabled: true,
  keyItems: [],
  eventFlags: {},
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
      const scaledEnemy = scaleEnemyStats(currentEnemy, nextState.enemyScale);
      const currentTuning = difficultyTuning[currentEnemy.difficulty];
      const playerStats = getPlayerStats(
        nextState.equippedItemIds,
        nextState.playerBonusAttack,
        nextState.playerBonusDefense
      );
      let playerHP = nextState.playerHP;
      let enemyHP = nextState.enemyHP;
      let burst = nextState.burst;
      let burstArmed = nextState.burstArmed;
      let burstUsed = false;
      let message = "";

      if (outcome === "win") {
        const bonus = burstArmed ? 12 : 0;
        const playerAttack = playerStats.attack[move];
        const enemyDefense = scaledEnemy.defense[move];
        const modifiedDamage = applyElementModifier(
          currentTuning.damageToEnemy + bonus,
          playerAttack,
          enemyDefense
        );
        enemyHP = clamp(
          enemyHP - modifiedDamage,
          0,
          nextState.enemyMaxHP
        );
        burst = clamp(burst + currentTuning.burstWin, 0, 100);
        message = bonus ? "TRINITY BURST!" : "Direct hit!";
        if (bonus) {
          burst = 0;
          burstArmed = false;
          burstUsed = true;
        }
      } else if (outcome === "lose") {
        const enemyAttack = scaledEnemy.attack[enemyMove];
        const playerDefense = playerStats.defense[enemyMove];
        const modifiedDamage = applyElementModifier(
          currentTuning.damageToPlayer,
          enemyAttack,
          playerDefense
        );
        playerHP = clamp(
          playerHP - modifiedDamage,
          0,
          nextState.playerMaxHP
        );
        burst = clamp(burst + currentTuning.burstLose, 0, 100);
        message = "Impact taken.";
      } else {
        const playerAttack = playerStats.attack[move];
        const enemyDefense = scaledEnemy.defense[move];
        const enemyAttack = scaledEnemy.attack[enemyMove];
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
        playerHP = clamp(playerHP - playerDamage, 0, nextState.playerMaxHP);
        enemyHP = clamp(enemyHP - enemyDamage, 0, nextState.enemyMaxHP);
        burst = clamp(burst + currentTuning.burstDraw, 0, 100);
        message = "PARRY!";
      }

      let playerLevel = nextState.playerLevel;
      let playerExp = nextState.playerExp;
      let playerExpToNext = nextState.playerExpToNext;
      let playerMaxHP = nextState.playerMaxHP;
      let playerBonusAttack = nextState.playerBonusAttack;
      let playerBonusDefense = nextState.playerBonusDefense;

      if (enemyHP === 0) {
        playerExp += currentEnemy.exp;
        while (playerExp >= playerExpToNext) {
          playerExp -= playerExpToNext;
          playerLevel += 1;
          playerExpToNext = Math.round(playerExpToNext * 1.35);
          playerMaxHP += 6;
          playerBonusAttack = {
            rock: playerBonusAttack.rock + 1,
            scissors: playerBonusAttack.scissors + 1,
            paper: playerBonusAttack.paper + 1
          };
          playerBonusDefense = {
            rock: playerBonusDefense.rock + 1,
            scissors: playerBonusDefense.scissors + 1,
            paper: playerBonusDefense.paper + 1
          };
          playerHP = clamp(playerHP + 6, 0, playerMaxHP);
        }
      }

      set({
        phase: "result",
        playerHP,
        playerMaxHP,
        playerLevel,
        playerExp,
        playerExpToNext,
        playerBonusAttack,
        playerBonusDefense,
        enemyHP,
        burst,
        burstArmed,
        burstUsed,
        lastOutcome: outcome,
        message: enemyHP === 0 ? `${message} +${currentEnemy.exp} EXP` : message,
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
  movePlayer: (dx, dy, canMove, tile, messageOverride) => {
    const state = get();
    if (state.mode !== "field") return;
    if (!canMove) {
      set({ message: messageOverride ?? "Blocked terrain." });
      return;
    }
    const nextX = clamp(state.playerPos.x + dx, 0, worldWidth - 1);
    const nextY = clamp(state.playerPos.y + dy, 0, worldHeight - 1);
    const moved = nextX !== state.playerPos.x || nextY !== state.playerPos.y;
    if (!moved) return;

    if (tile === "T" && state.world === "field") {
      const visitedWorlds = { ...state.visitedWorlds, town: true };
      const storyStage = state.storyStage < 1 ? 1 : state.storyStage;
      const storyQuest =
        state.storyStage < 1
          ? "Find the hidden forest glade."
          : state.storyQuest;
      set({
        world: "town",
        playerPos: { x: 11, y: 9 },
        fieldReturnPos: { x: nextX, y: nextY },
        visitedWorlds,
        storyStage,
        storyQuest,
        message: "Entered town."
      });
      return;
    }

    if (tile === "N" && state.world === "field") {
      if (!state.keyItems.includes("forestSigil")) {
        set({ message: "The forest gate rejects you." });
        return;
      }
      const visitedWorlds = { ...state.visitedWorlds, forest: true };
      const storyStage = state.storyStage < 2 ? 2 : state.storyStage;
      const storyQuest =
        state.storyStage < 2
          ? "Reach the harbor on the southern road."
          : state.storyQuest;
      set({
        world: "forest",
        playerPos: { x: 14, y: 10 },
        fieldReturnPos: { x: nextX, y: nextY },
        visitedWorlds,
        storyStage,
        storyQuest,
        message: "Entered forest glade."
      });
      return;
    }

    if (tile === "U" && state.world === "field") {
      const visitedWorlds = { ...state.visitedWorlds, harbor: true };
      const storyStage = state.storyStage < 3 ? 3 : state.storyStage;
      const storyQuest =
        state.storyStage < 3
          ? "Enter the dark ruins to the east."
          : state.storyQuest;
      set({
        world: "harbor",
        playerPos: { x: 12, y: 8 },
        fieldReturnPos: { x: nextX, y: nextY },
        visitedWorlds,
        storyStage,
        storyQuest,
        message: "Arrived at the harbor."
      });
      return;
    }

    if (tile === "D" && state.world === "field") {
      const visitedWorlds = { ...state.visitedWorlds, ruins: true };
      const storyStage = state.storyStage < 4 ? 4 : state.storyStage;
      const storyQuest =
        state.storyStage < 4
          ? "Defeat the blight spreading from the ruins."
          : state.storyQuest;
      set({
        world: "ruins",
        playerPos: { x: 12, y: 9 },
        fieldReturnPos: { x: nextX, y: nextY },
        visitedWorlds,
        storyStage,
        storyQuest,
        message: "Entered the dark ruins."
      });
      return;
    }

    if (tile === "E" && state.world !== "field") {
      set({
        world: "field",
        playerPos: { x: state.fieldReturnPos.x, y: state.fieldReturnPos.y },
        message: "Returned to field."
      });
      return;
    }

    const encounterChance = 0.22;
    const hasEnemies = getAvailableEnemyIndices(state.defeatedEnemyIds).length > 0;
    const shouldEncounter =
      state.world === "field" &&
      state.encountersEnabled &&
      hasEnemies &&
      Math.random() < encounterChance;
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
      const enemyScale = getDistanceScale({ x: nextX, y: nextY });
      const scaledEnemy = scaleEnemyStats(enemy, enemyScale);
      set({
        mode: "battle",
        phase: "command",
        enemyIndex,
        enemyHP: scaledEnemy.baseHP,
        enemyMaxHP: scaledEnemy.baseHP,
        enemyScale,
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

    if (tile === "H") {
      const healed = state.playerMaxHP;
      set({
        playerPos: { x: nextX, y: nextY },
        playerHP: healed,
        message: "Healed at spring."
      });
      return;
    }

    if (tile === "I") {
      set({
        playerPos: { x: nextX, y: nextY },
        playerHP: state.playerMaxHP,
        message: "Rested at the inn."
      });
      return;
    }

    if (tile === "L") {
      set({
        playerPos: { x: nextX, y: nextY },
        burst: clamp(state.burst + 15, 0, 100),
        message: "The lighthouse steadies your resolve."
      });
      return;
    }

    if (tile === "Q") {
      if (!state.keyItems.includes("ruinsSeal")) {
        set({ message: "The ruins gate is sealed." });
        return;
      }
      set({
        playerPos: { x: nextX, y: nextY },
        burst: clamp(state.burst + 10, 0, 100),
        message: "The ruin gate whispers in the dark."
      });
      return;
    }

    if (tile === "P") {
      if (!state.keyItems.includes("harborPass")) {
        set({ message: "A guard blocks the bridge." });
        return;
      }
      set({
        playerPos: { x: nextX, y: nextY },
        message: "Crossed the bridge."
      });
      return;
    }

    set({
      playerPos: { x: nextX, y: nextY },
      message: messageOverride ?? (hasEnemies ? "Exploring..." : "All foes cleared.")
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
  setEncountersEnabled: (enabled) => {
    set({ encountersEnabled: enabled });
  },
  setKeyItem: (itemId) => {
    const state = get();
    if (state.keyItems.includes(itemId)) return;
    set({ keyItems: [...state.keyItems, itemId] });
  },
  setEventFlag: (flag) => {
    const state = get();
    if (state.eventFlags[flag]) return;
    set({ eventFlags: { ...state.eventFlags, [flag]: true } });
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
      playerMaxHP: 100,
      playerLevel: 1,
      playerExp: 0,
      playerExpToNext: 100,
      playerBonusAttack: { rock: 0, scissors: 0, paper: 0 },
      playerBonusDefense: { rock: 0, scissors: 0, paper: 0 },
      storyStage: 0,
      storyQuest: "Reach the nearby town.",
      visitedWorlds: {
        town: false,
        forest: false,
        harbor: false,
        ruins: false
      },
      enemyHP: getEnemy(0).baseHP,
      enemyMaxHP: getEnemy(0).baseHP,
      enemyScale: 1,
      enemyIndex: 0,
      playerPos: { x: spawnPoint.x, y: spawnPoint.y },
      fieldReturnPos: { x: spawnPoint.x, y: spawnPoint.y },
      world: "field",
      defeatedEnemyIds: [],
      encountersEnabled: true,
      keyItems: [],
      eventFlags: {},
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
