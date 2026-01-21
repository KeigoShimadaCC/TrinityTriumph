import { useEffect, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import leoSprite from "../../assets/sprites/leo.svg";
import { items } from "../../data/items";
import { getTileAt, isPassable, worldHeight, worldWidth } from "../../data/worldMap";

const viewSize = 11;
const viewRadius = Math.floor(viewSize / 2);

export const FieldArea = () => {
  const { playerPos, movePlayer, message, equippedItemIds, toggleEquipItem } =
    useGameStore();

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
        movePlayer(0, 0, false);
        return;
      }
      const tile = getTileAt(next.x, next.y);
      movePlayer(next.x - playerPos.x, next.y - playerPos.y, isPassable(tile));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movePlayer, playerPos.x, playerPos.y]);

  const cells = useMemo(() => Array.from({ length: viewSize * viewSize }), []);
  const originX = playerPos.x - viewRadius;
  const originY = playerPos.y - viewRadius;

  return (
    <div className="glass field-wrap">
      <div className="field-header pixel-text text-[9px] text-[#3a4a2a]">
        Grass Field
      </div>
      <div className="field-map" style={{ gridTemplateColumns: `repeat(${viewSize}, 1fr)` }}>
        {cells.map((_, index) => {
          const x = index % viewSize;
          const y = Math.floor(index / viewSize);
          const worldX = originX + x;
          const worldY = originY + y;
          const tile = getTileAt(worldX, worldY);
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
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="field-footer">
        <span className="pixel-text text-[9px] text-[#3a4a2a]">{message}</span>
        <span className="pixel-text text-[8px] text-[#3a4a2a]">ARROWS/WASD</span>
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
  );
};
