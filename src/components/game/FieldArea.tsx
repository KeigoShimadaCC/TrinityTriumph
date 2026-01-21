import { useEffect, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import leoSprite from "../../assets/sprites/leo.svg";
import { items } from "../../data/items";

const gridSize = 9;

export const FieldArea = () => {
  const { playerPos, movePlayer, message, equippedItemIds, toggleEquipItem } =
    useGameStore();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [movePlayer]);

  const cells = useMemo(() => Array.from({ length: gridSize * gridSize }), []);

  return (
    <div className="glass field-wrap">
      <div className="field-header pixel-text text-[9px] text-[#3a4a2a]">
        Grass Field
      </div>
      <div className="field-map" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {cells.map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);
          const isPlayer = x === playerPos.x && y === playerPos.y;
          return (
            <div key={`${x}-${y}`} className="field-cell">
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
