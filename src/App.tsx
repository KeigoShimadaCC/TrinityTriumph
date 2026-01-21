import { useEffect, useState } from "react";
import { BattleArea } from "./components/game/BattleArea";
import { CommandDeck } from "./components/game/CommandDeck";
import { StatusHud } from "./components/game/StatusHud";
import { FieldArea } from "./components/game/FieldArea";
import { Screen } from "./components/layout/Screen";
import { useGameStore } from "./store/useGameStore";
import { useSound } from "./hooks/useSound";

const App = () => {
  const { lastOutcome, burstUsed, mode } = useGameStore();
  const [shake, setShake] = useState(false);
  const playSound = useSound();

  useEffect(() => {
    if (lastOutcome !== "lose") return;
    setShake(true);
    const timeout = setTimeout(() => setShake(false), 350);
    return () => clearTimeout(timeout);
  }, [lastOutcome]);

  useEffect(() => {
    if (burstUsed) {
      playSound("burst");
      return;
    }
    if (lastOutcome === "win") playSound("hit");
    if (lastOutcome === "lose") playSound("lose");
    if (lastOutcome === "draw") playSound("parry");
  }, [burstUsed, lastOutcome, playSound]);

  return (
    <div className="pixel-viewport">
      <div className="pixel-scale">
        <Screen className={shake ? "animate-shake" : ""}>
          <header className="space-y-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#d5e7b6]">
              Cyber Linker Arena
            </p>
          <h1 className="text-2xl font-semibold tracking-[0.2em] text-[#dfeec2]">
            TrinityTriumph
          </h1>
        </header>

          {mode === "field" ? (
            <FieldArea />
          ) : (
            <>
              <StatusHud />
              <BattleArea />
              <CommandDeck />
            </>
          )}
        </Screen>
      </div>
    </div>
  );
};

export default App;
