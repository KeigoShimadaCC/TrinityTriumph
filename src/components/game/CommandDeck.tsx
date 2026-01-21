import { useGameStore } from "../../store/useGameStore";
import { MoveType } from "../../types";
import { Button } from "../ui/Button";
import { colors } from "../../config/colors";
import { useSound } from "../../hooks/useSound";
import rockIcon from "../../assets/sprites/moves/rock.svg";
import scissorsIcon from "../../assets/sprites/moves/scissors.svg";
import paperIcon from "../../assets/sprites/moves/paper.svg";

const moves: Array<{ type: MoveType; label: string; color: string; icon: string }> =
  [
    { type: "rock", label: "GU", color: colors.rock, icon: rockIcon },
    { type: "scissors", label: "CHOKI", color: colors.scissors, icon: scissorsIcon },
    { type: "paper", label: "PA", color: colors.paper, icon: paperIcon }
  ];
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
            <span className="flex flex-col items-center gap-1">
              <img src={move.icon} alt={move.label} className="pixelated h-6 w-6" />
              <span className="pixel-text text-[10px]">{move.label}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
