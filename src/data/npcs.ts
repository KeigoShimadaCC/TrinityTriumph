export interface Npc {
  id: string;
  name: string;
  x: number;
  y: number;
  sprite: string;
  lines: string[];
}

import npcMage from "../assets/sprites/npc-mage.svg";
import npcSmith from "../assets/sprites/npc-smith.svg";
import npcSage from "../assets/sprites/npc-sage.svg";
import npcMerchant from "../assets/sprites/npc-merchant.svg";

export const npcs: Npc[] = [
  {
    id: "town-mage",
    name: "Eldra",
    x: 8,
    y: 3,
    sprite: npcMage,
    lines: [
      "Magic bends to timing. Read the telegraph.",
      "Sword beats prayer, prayer beats magic, magic beats sword."
    ]
  },
  {
    id: "town-smith",
    name: "Brannik",
    x: 10,
    y: 5,
    sprite: npcSmith,
    lines: [
      "Equip gear in the field. It boosts your element stats.",
      "A sharp blade is only half the battle."
    ]
  },
  {
    id: "town-sage",
    name: "Sora",
    x: 12,
    y: 3,
    sprite: npcSage,
    lines: [
      "Healing springs restore you. Seek the blue + tiles.",
      "Leveling raises HP and all element power."
    ]
  },
  {
    id: "town-merchant",
    name: "Vell",
    x: 9,
    y: 6,
    sprite: npcMerchant,
    lines: [
      "Defeat each foe once to clear the land.",
      "Burst shines when you win at the perfect moment."
    ]
  }
];
