import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { MoveType } from "../../types";
import { colors } from "../../config/colors";

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

export const BattleArea = () => {
  const { phase, playerMove, enemyMove, lastOutcome, message } = useGameStore();
  const isBattle = phase === "battle";
  const isResult = phase === "result";

  const renderMove = (move: MoveType | null, side: "player" | "enemy") => {
    const label = move ? moveLabels[move] : side === "player" ? "LINK" : "ANIMA";
    const color = move ? moveColors[move] : "#ffffff55";
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-sm font-bold tracking-[0.2em]"
          style={{ borderColor: color, color }}
        >
          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="glass relative flex h-64 flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
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
            className="absolute inset-0 m-auto h-20 w-20 rounded-full border border-white/40"
          />
        ) : null}
      </AnimatePresence>
      <div className="relative mt-4 text-xs uppercase tracking-[0.4em] text-white/60">
        {message}
      </div>
    </div>
  );
};
