import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import leoSprite from "../../assets/sprites/leo.svg";
import { items } from "../../data/items";
import { playerCharacter } from "../../data/characters";
import {
  fieldMap,
  forestMap,
  harborMap,
  ruinsMap,
  townMap,
  getTileAt,
  isPassable,
  worldHeight,
  worldWidth
} from "../../data/worldMap";
import { npcs } from "../../data/npcs";

const viewSize = 11;
const viewRadius = Math.floor(viewSize / 2);

export const FieldArea = () => {
  const {
    playerPos,
    movePlayer,
    message,
    equippedItemIds,
    toggleEquipItem,
    world,
    storyQuest,
    playerHP,
    playerMaxHP,
    playerBonusAttack,
    playerBonusDefense
  } = useGameStore();
  const [activeMenu, setActiveMenu] = useState<"status" | "equip" | "items" | null>(
    null
  );
  const activeMap =
    world === "town"
      ? townMap
      : world === "forest"
      ? forestMap
      : world === "harbor"
      ? harborMap
      : world === "ruins"
      ? ruinsMap
      : fieldMap;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (activeMenu) {
        if (event.key === "q" || event.key === "Q") {
          setActiveMenu(null);
        }
        return;
      }
      switch (event.key) {
        case "ArrowUp":
          stepMove(0, -1);
          break;
        case "ArrowDown":
          stepMove(0, 1);
          break;
        case "ArrowLeft":
          stepMove(-1, 0);
          break;
        case "ArrowRight":
          stepMove(1, 0);
          break;
        case "s":
        case "S":
          setActiveMenu("status");
          break;
        case "e":
        case "E":
          setActiveMenu("equip");
          break;
        case "i":
        case "I":
          setActiveMenu("items");
          break;
        case "q":
        case "Q":
          setActiveMenu(null);
          break;
        default:
          break;
      }
    };
    const handlePointerUp = () => stopMoveLoop();
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerup", handlePointerUp);
      stopMoveLoop();
    };
  }, [activeMap, activeMenu, movePlayer, playerPos.x, playerPos.y, world]);

  const cells = useMemo(() => Array.from({ length: viewSize * viewSize }), []);
  const originX = playerPos.x - viewRadius;
  const originY = playerPos.y - viewRadius;
  const moveTimerRef = useRef<number | null>(null);
  const equippedItems = items.filter((item) => equippedItemIds.includes(item.id));
  const baseAttack = playerCharacter.attack;
  const baseDefense = playerCharacter.defense;
  const itemAttack = equippedItems.reduce(
    (acc, item) => ({
      rock: acc.rock + (item.attack?.rock ?? 0),
      scissors: acc.scissors + (item.attack?.scissors ?? 0),
      paper: acc.paper + (item.attack?.paper ?? 0)
    }),
    { rock: 0, scissors: 0, paper: 0 }
  );
  const itemDefense = equippedItems.reduce(
    (acc, item) => ({
      rock: acc.rock + (item.defense?.rock ?? 0),
      scissors: acc.scissors + (item.defense?.scissors ?? 0),
      paper: acc.paper + (item.defense?.paper ?? 0)
    }),
    { rock: 0, scissors: 0, paper: 0 }
  );
  const totalAttack = {
    rock: baseAttack.rock + playerBonusAttack.rock + itemAttack.rock,
    scissors: baseAttack.scissors + playerBonusAttack.scissors + itemAttack.scissors,
    paper: baseAttack.paper + playerBonusAttack.paper + itemAttack.paper
  };
  const totalDefense = {
    rock: baseDefense.rock + playerBonusDefense.rock + itemDefense.rock,
    scissors: baseDefense.scissors + playerBonusDefense.scissors + itemDefense.scissors,
    paper: baseDefense.paper + playerBonusDefense.paper + itemDefense.paper
  };

  const stepMove = (dx: number, dy: number) => {
    const next = { x: playerPos.x + dx, y: playerPos.y + dy };
    if (next.x < 0 || next.y < 0 || next.x >= worldWidth || next.y >= worldHeight) {
      movePlayer(0, 0, false, undefined, "The path ends here.");
      return;
    }
    const tile = getTileAt(activeMap, next.x, next.y);
    const npcAtTarget = npcs.find(
      (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
    );
    if (npcAtTarget) {
      const line = npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
      movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
      return;
    }
    movePlayer(dx, dy, isPassable(tile), tile);
  };

  const startMoveLoop = (dx: number, dy: number) => {
    if (activeMenu) return;
    stepMove(dx, dy);
    if (moveTimerRef.current) {
      window.clearInterval(moveTimerRef.current);
    }
    moveTimerRef.current = window.setInterval(() => {
      stepMove(dx, dy);
    }, 180);
  };

  const stopMoveLoop = () => {
    if (moveTimerRef.current) {
      window.clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
  };

  return (
    <div className="glass field-wrap">
      <div className="field-header pixel-text text-[9px] text-[#3a4a2a]">
        {world === "town"
          ? "Town Square"
          : world === "forest"
          ? "Hidden Glade"
          : world === "harbor"
          ? "Harbor"
          : world === "ruins"
          ? "Dark Ruins"
          : "Grass Field"}
      </div>
      <div className="field-map" style={{ gridTemplateColumns: `repeat(${viewSize}, 1fr)` }}>
        {cells.map((_, index) => {
          const x = index % viewSize;
          const y = Math.floor(index / viewSize);
          const worldX = originX + x;
          const worldY = originY + y;
          const tile = getTileAt(activeMap, worldX, worldY);
          const npcHere = npcs.find(
            (npc) => npc.map === world && npc.x === worldX && npc.y === worldY
          );
          const isPlayer = x === viewRadius && y === viewRadius;
          return (
            <div
              key={`${x}-${y}`}
              className={`field-cell tile-${tile.toLowerCase()}`}
            >
              {isPlayer ? (
                <img
                  src={leoSprite}
                  alt="Player"
                  className="pixelated h-6 w-6"
                />
              ) : npcHere ? (
                <img
                  src={npcHere.sprite}
                  alt={npcHere.name}
                  className="pixelated h-6 w-6"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="field-footer">
        <span className="pixel-text text-[9px] text-[#3a4a2a]">{message}</span>
        <span className="pixel-text text-[8px] text-[#3a4a2a]">TAP D-PAD</span>
      </div>
      <div className="field-quest pixel-text text-[8px] text-[#3a4a2a]">
        QUEST: {storyQuest}
      </div>
      <div className="field-bottom">
        <div className="field-controls">
          <div className="dpad">
            <button
              className="dpad-btn dpad-up"
              type="button"
              onPointerDown={() => startMoveLoop(0, -1)}
              onPointerUp={stopMoveLoop}
              onPointerCancel={stopMoveLoop}
              onPointerLeave={stopMoveLoop}
            >
              UP
            </button>
            <button
              className="dpad-btn dpad-left"
              type="button"
              onPointerDown={() => startMoveLoop(-1, 0)}
              onPointerUp={stopMoveLoop}
              onPointerCancel={stopMoveLoop}
              onPointerLeave={stopMoveLoop}
            >
              LT
            </button>
            <button
              className="dpad-btn dpad-right"
              type="button"
              onPointerDown={() => startMoveLoop(1, 0)}
              onPointerUp={stopMoveLoop}
              onPointerCancel={stopMoveLoop}
              onPointerLeave={stopMoveLoop}
            >
              RT
            </button>
            <button
              className="dpad-btn dpad-down"
              type="button"
              onPointerDown={() => startMoveLoop(0, 1)}
              onPointerUp={stopMoveLoop}
              onPointerCancel={stopMoveLoop}
              onPointerLeave={stopMoveLoop}
            >
              DN
            </button>
          </div>
        </div>
        <div className="field-menu">
          <button
            type="button"
            className="menu-button"
            onClick={() => setActiveMenu("status")}
          >
            Status
          </button>
          <button
            type="button"
            className="menu-button"
            onClick={() => setActiveMenu("equip")}
          >
            Equipment
          </button>
          <button
            type="button"
            className="menu-button"
            onClick={() => setActiveMenu("items")}
          >
            Items
          </button>
        </div>
      </div>
      {activeMenu ? (
        <div className="field-overlay">
          <div className="field-overlay-panel">
            <div className="overlay-header">
              <span className="pixel-text text-[9px] text-[#3a4a2a]">
                {activeMenu === "status"
                  ? "Status"
                  : activeMenu === "equip"
                  ? "Equipment"
                  : "Items"}
              </span>
              <button
                type="button"
                className="menu-exit"
                onClick={() => setActiveMenu(null)}
              >
                Exit
              </button>
            </div>
            {activeMenu === "status" ? (
              <div className="overlay-body">
                <div className="pixel-text text-[9px] text-[#3a4a2a]">
                  HP {playerHP}/{playerMaxHP}
                </div>
                <div className="overlay-row">
                  ATK {totalAttack.rock}/{totalAttack.scissors}/{totalAttack.paper}
                </div>
                <div className="overlay-row">
                  DEF {totalDefense.rock}/{totalDefense.scissors}/{totalDefense.paper}
                </div>
              </div>
            ) : null}
            {activeMenu === "equip" ? (
              <div className="overlay-body">
                <div className="pixel-text text-[8px] text-[#3a4a2a]">
                  EQUIP ({equippedItemIds.length}/3)
                </div>
                <div className="equip-grid">
                  {items.map((item) => {
                    const isEquipped = equippedItemIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        className={`equip-item ${isEquipped ? "equip-on" : ""}`}
                        onClick={() => toggleEquipItem(item.id)}
                        type="button"
                      >
                        <span className="pixel-text text-[8px]">{item.name}</span>
                        <span className="text-[8px]">{item.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {activeMenu === "items" ? (
              <div className="overlay-body">
                <div className="pixel-text text-[8px] text-[#3a4a2a]">
                  Bag is empty.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
