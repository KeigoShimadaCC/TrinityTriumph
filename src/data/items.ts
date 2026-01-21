import { Item } from "../types";

export const items: Item[] = [
  {
    id: "gu-bracer",
    name: "Gu Bracer",
    description: "Boosts GU offense.",
    attack: { rock: 4 }
  },
  {
    id: "choki-edge",
    name: "Choki Edge",
    description: "Boosts CHOKI offense.",
    attack: { scissors: 4 }
  },
  {
    id: "pa-barrier",
    name: "Pa Barrier",
    description: "Boosts PA defense.",
    defense: { paper: 4 }
  },
  {
    id: "trinity-band",
    name: "Trinity Band",
    description: "Balanced boosts.",
    attack: { rock: 2, scissors: 2, paper: 2 },
    defense: { rock: 1, scissors: 1, paper: 1 }
  },
  {
    id: "guard-core",
    name: "Guard Core",
    description: "Raises overall defense.",
    defense: { rock: 2, scissors: 2, paper: 2 }
  }
];
