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
    blurb: "A fast-thinking rival who cuts through hesitation.",
    attack: {
      rock: 5,
      scissors: 7,
      paper: 5
    },
    defense: {
      rock: 5,
      scissors: 6,
      paper: 4
    }
  },
  {
    id: "shiro",
    name: "Shiro",
    color: "#ff7b00",
    anima: "Neon Ronin",
    baseHP: 112,
    difficulty: "veteran",
    storyTag: "arena",
    blurb: "An arena guardian who fights with steady, punishing rhythm.",
    attack: {
      rock: 7,
      scissors: 5,
      paper: 6
    },
    defense: {
      rock: 7,
      scissors: 4,
      paper: 6
    }
  },
  {
    id: "noct",
    name: "Noct",
    color: "#f6ff00",
    anima: "Void Hydra",
    baseHP: 125,
    difficulty: "elite",
    storyTag: "boss",
    blurb: "A silent apex Linker whose Anima predicts your intent.",
    attack: {
      rock: 6,
      scissors: 6,
      paper: 8
    },
    defense: {
      rock: 6,
      scissors: 7,
      paper: 8
    }
  }
];
