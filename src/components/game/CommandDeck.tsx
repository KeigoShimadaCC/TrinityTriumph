import { useGameStore } from "../../store/useGameStore";
import { MoveType } from "../../types";
import { Button } from "../ui/Button";
import { colors } from "../../config/colors";
import { useSound } from "../../hooks/useSound";

const moves: Array<{ type: MoveType; label: string; color: string }> = [
  { type: "rock", label: "GU", color: colors.rock },
  { type: "scissors", label: "CHOKI", color: colors.scissors },
  { type: "paper", label: "PA", color: colors.paper }
];

export const CommandDeck = () => {
  const { chooseMove, phase } = useGameStore();
  const isLocked = phase !== "command";
  const playSound = useSound();

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">
        Command Deck
      </div>
      <div className="grid grid-cols-3 gap-3">
        {moves.map((move) => (
          <Button
            key={move.type}
            onClick={() => {
              playSound("select");
              chooseMove(move.type);
            }}
            disabled={isLocked}
            className="h-16 text-xs tracking-[0.2em] disabled:opacity-50"
            style={{ backgroundColor: move.color, color: "#0b0b0b" }}
          >
            {move.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
