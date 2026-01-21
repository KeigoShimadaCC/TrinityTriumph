import { useGameStore } from "../../store/useGameStore";
import { MoveType } from "../../types";
import { Button } from "../ui/Button";
import { colors } from "../../config/colors";
import { useSound } from "../../hooks/useSound";
import rockIcon from "../../assets/sprites/moves/rock.svg";
import scissorsIcon from "../../assets/sprites/moves/scissors.svg";
import paperIcon from "../../assets/sprites/moves/paper.svg";

const moves: Array<{
  type: MoveType;
  label: string;
  color: string;
  icon: string;
  position: "top" | "left" | "right";
}> = [
  { type: "rock", label: "GU", color: colors.rock, icon: rockIcon, position: "top" },
  {
    type: "scissors",
    label: "CHOKI",
    color: colors.scissors,
    icon: scissorsIcon,
    position: "left"
  },
  { type: "paper", label: "PA", color: colors.paper, icon: paperIcon, position: "right" }
];

export const CommandDeck = () => {
  const { chooseMove, phase } = useGameStore();
  const isLocked = phase !== "command";
  const playSound = useSound();

  return (
    <div className="triangle-deck">
      <div className="triangle-inner">
        <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#3a4a2a]">
          Command Deck
        </div>
        <div className="triangle-buttons">
          {moves.map((move) => (
            <Button
              key={move.type}
              onClick={() => {
                playSound("select");
                chooseMove(move.type);
              }}
              disabled={isLocked}
              className={`triangle-button triangle-${move.position} text-[9px] tracking-[0.2em] disabled:opacity-50`}
              style={{ backgroundColor: move.color, color: "#0b0b0b" }}
            >
              <span className="flex flex-col items-center gap-1">
                <img src={move.icon} alt={move.label} className="pixelated h-5 w-5" />
                <span className="pixel-text text-[9px]">{move.label}</span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
