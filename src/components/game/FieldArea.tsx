import { useEffect, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import leoSprite from "../../assets/sprites/leo.svg";
import { items } from "../../data/items";
import {
  fieldMap,
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
  const { playerPos, movePlayer, message, equippedItemIds, toggleEquipItem, world } =
    useGameStore();
  const activeMap = world === "town" ? townMap : fieldMap;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const next = { x: playerPos.x, y: playerPos.y };
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          next.y -= 1;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          next.y += 1;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          next.x -= 1;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          next.x += 1;
          break;
        default:
          break;
      }
      if (next.x === playerPos.x && next.y === playerPos.y) return;
      if (next.x < 0 || next.y < 0 || next.x >= worldWidth || next.y >= worldHeight) {
        movePlayer(0, 0, false, undefined, "The path ends here.");
        return;
      }
      const tile = getTileAt(activeMap, next.x, next.y);
      const npcAtTarget = npcs.find(
        (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
      );
      if (npcAtTarget) {
        const line =
          npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
        movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
        return;
      }
      movePlayer(
        next.x - playerPos.x,
        next.y - playerPos.y,
        isPassable(tile),
        tile
      );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movePlayer, playerPos.x, playerPos.y, activeMap, world]);

  const cells = useMemo(() => Array.from({ length: viewSize * viewSize }), []);
  const originX = playerPos.x - viewRadius;
  const originY = playerPos.y - viewRadius;

  return (
    <div className="glass field-wrap">
      <div className="field-header pixel-text text-[9px] text-[#3a4a2a]">
        {world === "town" ? "Town Square" : "Grass Field"}
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
      <div className="field-bottom">
        <div className="field-controls">
          <div className="dpad">
            <button
              className="dpad-btn dpad-up"
              type="button"
              onClick={() => {
                const next = { x: playerPos.x, y: playerPos.y - 1 };
              if (next.y < 0) {
                movePlayer(0, 0, false, undefined, "The path ends here.");
                return;
              }
              const tile = getTileAt(activeMap, next.x, next.y);
              const npcAtTarget = npcs.find(
                (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
              );
              if (npcAtTarget) {
                const line =
                  npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
                movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
                return;
              }
              movePlayer(0, -1, isPassable(tile), tile);
            }}
          >
              UP
            </button>
            <button
              className="dpad-btn dpad-left"
              type="button"
              onClick={() => {
                const next = { x: playerPos.x - 1, y: playerPos.y };
              if (next.x < 0) {
                movePlayer(0, 0, false, undefined, "The path ends here.");
                return;
              }
              const tile = getTileAt(activeMap, next.x, next.y);
              const npcAtTarget = npcs.find(
                (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
              );
              if (npcAtTarget) {
                const line =
                  npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
                movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
                return;
              }
              movePlayer(-1, 0, isPassable(tile), tile);
            }}
          >
              LT
            </button>
            <button
              className="dpad-btn dpad-right"
              type="button"
              onClick={() => {
                const next = { x: playerPos.x + 1, y: playerPos.y };
              if (next.x >= worldWidth) {
                movePlayer(0, 0, false, undefined, "The path ends here.");
                return;
              }
              const tile = getTileAt(activeMap, next.x, next.y);
              const npcAtTarget = npcs.find(
                (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
              );
              if (npcAtTarget) {
                const line =
                  npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
                movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
                return;
              }
              movePlayer(1, 0, isPassable(tile), tile);
            }}
          >
              RT
            </button>
            <button
              className="dpad-btn dpad-down"
              type="button"
              onClick={() => {
                const next = { x: playerPos.x, y: playerPos.y + 1 };
              if (next.y >= worldHeight) {
                movePlayer(0, 0, false, undefined, "The path ends here.");
                return;
              }
              const tile = getTileAt(activeMap, next.x, next.y);
              const npcAtTarget = npcs.find(
                (npc) => npc.map === world && npc.x === next.x && npc.y === next.y
              );
              if (npcAtTarget) {
                const line =
                  npcAtTarget.lines[Math.floor(Math.random() * npcAtTarget.lines.length)];
                movePlayer(0, 0, false, tile, `${npcAtTarget.name}: ${line}`);
                return;
              }
              movePlayer(0, 1, isPassable(tile), tile);
            }}
          >
              DN
            </button>
          </div>
        </div>
        <div className="field-equip">
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
      </div>
    </div>
  );
};
