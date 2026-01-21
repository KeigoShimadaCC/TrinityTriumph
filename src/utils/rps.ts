import { MoveType, Outcome } from "../types";

const winsAgainst: Record<MoveType, MoveType> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock"
};

export const compareMoves = (player: MoveType, enemy: MoveType): Outcome => {
  if (player === enemy) return "draw";
  return winsAgainst[player] === enemy ? "win" : "lose";
};
