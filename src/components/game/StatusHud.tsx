import { useEffect, useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { ProgressBar } from "../ui/ProgressBar";
import { Button } from "../ui/Button";
import { colors } from "../../config/colors";
import { enemies } from "../../data/enemies";

export const StatusHud = () => {
  const {
    playerHP,
    enemyHP,
    burst,
    burstArmed,
    telegraph,
    toggleBurst,
    reset,
    enemyIndex,
    returnToField,
    mode
  } = useGameStore();
  const enemy = enemies[Math.min(enemyIndex, enemies.length - 1)];
  const [playerDelayed, setPlayerDelayed] = useState(playerHP);
  const [enemyDelayed, setEnemyDelayed] = useState(enemyHP);
  const enemyMax = enemy?.baseHP ?? 100;
  const enemyValue = (enemyHP / enemyMax) * 100;
  const enemyDelayedValue = (enemyDelayed / enemyMax) * 100;

  useEffect(() => {
    const timeout = setTimeout(() => setPlayerDelayed(playerHP), 200);
    return () => clearTimeout(timeout);
  }, [playerHP]);

  useEffect(() => {
    const timeout = setTimeout(() => setEnemyDelayed(enemyHP), 200);
    return () => clearTimeout(timeout);
  }, [enemyHP]);

  const renderHpBar = (value: number, delayed: number, color: string) => (
    <div className="pixel-frame gb-shadow relative h-2 w-full overflow-hidden bg-[#c4d392]">
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${delayed}%`, backgroundColor: "#9fb673" }}
      />
      <div
        className="absolute inset-y-0 left-0 transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="glass p-2">
        <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#3a4a2a]">
          <span>{enemy?.name ?? "Enemy"} Core</span>
          <span className="flex items-center gap-2">
            <span className="text-[10px] text-[#3a4a2a]">
              {enemy?.difficulty ?? "rookie"}
            </span>
            <span
              className="pixel-frame h-3 w-3"
              style={{
                backgroundColor: telegraph ? colors[telegraph] : "transparent"
              }}
            />
          </span>
        </div>
        {enemy?.blurb ? (
          <p className="mb-1 text-[9px] text-[#3a4a2a]">{enemy.blurb}</p>
        ) : null}
        {renderHpBar(enemyValue, enemyDelayedValue, colors.scissors)}
      </div>

      <div className="glass p-2">
        <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-[#3a4a2a]">
          <span>Leo Link</span>
          <Button
            onClick={toggleBurst}
            variant={burstArmed ? "secondary" : "ghost"}
            className="px-2 py-1 text-[9px]"
          >
            {burst >= 100 ? "ARM BURST" : "BURST LOCK"}
          </Button>
        </div>
        {renderHpBar(playerHP, playerDelayed, colors.rock)}
        <ProgressBar
          value={burst}
          color={colors.paper}
          label="Burst Gauge"
          className="mt-4"
        />
      </div>

      {mode === "battle" && (playerHP === 0 || enemyHP === 0) && (
        <div className="flex gap-3">
          {enemyHP === 0 ? (
            <Button variant="secondary" onClick={returnToField} className="w-full">
              Return Field
            </Button>
          ) : null}
          <Button variant="ghost" onClick={reset} className="w-full">
            Reset Run
          </Button>
        </div>
      )}
    </div>
  );
};
