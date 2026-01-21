import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { MoveType } from "../../types";
import { colors } from "../../config/colors";
import { enemies } from "../../data/enemies";
import { playerCharacter } from "../../data/characters";
import kaiSprite from "../../assets/sprites/kai.svg";
import shiroSprite from "../../assets/sprites/shiro.svg";
import noctSprite from "../../assets/sprites/noct.svg";
import leoSprite from "../../assets/sprites/leo.svg";
import rockIcon from "../../assets/sprites/moves/rock.svg";
import scissorsIcon from "../../assets/sprites/moves/scissors.svg";
import paperIcon from "../../assets/sprites/moves/paper.svg";

const moveLabels: Record<MoveType, string> = {
  rock: "GU",
  scissors: "CHOKI",
  paper: "PA"
};

const moveColors: Record<MoveType, string> = {
  rock: colors.rock,
  scissors: colors.scissors,
  paper: colors.paper
};
const moveIcons: Record<MoveType, string> = {
  rock: rockIcon,
  scissors: scissorsIcon,
  paper: paperIcon
};

export const BattleArea = () => {
  const {
    phase,
    playerMove,
    enemyMove,
    lastOutcome,
    message,
    enemyIndex
  } = useGameStore();
  const isBattle = phase === "battle";
  const isResult = phase === "result";
  const enemy = enemies[Math.min(enemyIndex, enemies.length - 1)];
  const enemySpriteMap: Record<string, string> = {
    kai: kaiSprite,
    shiro: shiroSprite,
    noct: noctSprite
  };
  const enemySprite = enemy ? enemySpriteMap[enemy.id] : null;
  const playerSpriteMap: Record<string, string> = {
    leo: leoSprite
  };
  const playerSprite = playerSpriteMap[playerCharacter.id];

  const renderMove = (move: MoveType | null, side: "player" | "enemy") => {
    const color = move ? moveColors[move] : "#ffffff55";
    const icon = move ? moveIcons[move] : null;
    return (
      <div className="flex flex-col items-center gap-3">
        {side === "enemy" && enemySprite ? (
          <img
            src={enemySprite}
            alt={`${enemy?.name ?? "Enemy"} sprite`}
            className="pixelated h-24 w-24"
          />
        ) : (
          <div className="pixel-frame flex h-20 w-20 items-center justify-center text-[10px] uppercase tracking-[0.2em] text-white/60">
            {side === "player" ? (
              <img
                src={playerSprite}
                alt={`${playerCharacter.name} sprite`}
                className="pixelated h-16 w-16"
              />
            ) : (
              "Enemy"
            )}
          </div>
        )}
        <div
          className="pixel-frame flex h-12 w-12 items-center justify-center"
          style={{ borderColor: color, color }}
        >
          {icon ? (
            <img
              src={icon}
              alt={moveLabels[move]}
              className="pixelated h-8 w-8"
            />
          ) : (
            <span className="pixel-text text-[10px]">LINK</span>
          )}
        </div>
        <div className="pixel-text text-[10px] text-white/70">
          {move ? moveLabels[move] : side === "player" ? "LINK" : "ANIMA"}
        </div>
      </div>
    );
  };

  return (
    <div className="glass relative flex h-72 flex-col items-center justify-center overflow-hidden px-4">
      <div className="relative flex w-full items-center justify-between">
        <motion.div
          animate={{
            x: isBattle ? 40 : 0,
            scale: isResult && lastOutcome === "win" ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          {renderMove(playerMove, "player")}
        </motion.div>
        <motion.div
          animate={{
            x: isBattle ? -40 : 0,
            scale: isResult && lastOutcome === "lose" ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          {renderMove(enemyMove, "enemy")}
        </motion.div>
      </div>
      <AnimatePresence>
        {isBattle ? (
          <motion.div
            key="impact"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 m-auto h-20 w-20 border-2 border-[#4e6237]"
          />
        ) : null}
      </AnimatePresence>
      <div className="relative mt-4 text-xs uppercase tracking-[0.4em] text-[#3a4a2a]">
        {message}
      </div>
    </div>
  );
};
