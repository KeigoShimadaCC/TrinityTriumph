import { Character } from "../types";

export const characters: Character[] = [
  {
    id: "leo",
    name: "Leo",
    color: "#ff003c",
    anima: "Ignis Knuckle",
    vibe: "Hot-blooded, high impact.",
    baseHP: 100,
    attack: {
      rock: 8,
      scissors: 5,
      paper: 6
    },
    defense: {
      rock: 6,
      scissors: 5,
      paper: 6
    },
    description:
      "A frontline Linker who trusts the burn of his Anima more than any logic."
  },
  {
    id: "kai",
    name: "Kai",
    color: "#00f0ff",
    anima: "Volt Slasher",
    vibe: "Cool, analytical, speed.",
    baseHP: 100,
    attack: {
      rock: 5,
      scissors: 8,
      paper: 6
    },
    defense: {
      rock: 5,
      scissors: 6,
      paper: 5
    },
    description:
      "A precision duelist whose Falcon Anima cuts the air before the strike lands."
  },
  {
    id: "emma",
    name: "Emma",
    color: "#00ff41",
    anima: "Aegis Flower",
    vibe: "Support, defense.",
    baseHP: 100,
    attack: {
      rock: 5,
      scissors: 5,
      paper: 7
    },
    defense: {
      rock: 7,
      scissors: 6,
      paper: 8
    },
    description:
      "A calm tactician who shields allies behind a fortress of neon petals."
  }
];

export const playerCharacter = characters[0];
export const enemyCharacter = characters[1];
