import { Enemy } from "../types";

export const enemies: Enemy[] = [
  {
    id: "kai",
    name: "Kai",
    color: "#00f0ff",
    anima: "Volt Slasher",
    baseHP: 100,
    difficulty: "rookie",
    storyTag: "rival",
    blurb: "A fast-thinking rival who cuts through hesitation."
  },
  {
    id: "shiro",
    name: "Shiro",
    color: "#ff7b00",
    anima: "Neon Ronin",
    baseHP: 112,
    difficulty: "veteran",
    storyTag: "arena",
    blurb: "An arena guardian who fights with steady, punishing rhythm."
  },
  {
    id: "noct",
    name: "Noct",
    color: "#f6ff00",
    anima: "Void Hydra",
    baseHP: 125,
    difficulty: "elite",
    storyTag: "boss",
    blurb: "A silent apex Linker whose Anima predicts your intent."
  }
];
