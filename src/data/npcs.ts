export interface Npc {
  id: string;
  name: string;
  x: number;
  y: number;
  map: "town" | "forest" | "harbor" | "ruins";
  sprite: string;
  lines: string[];
  important?: boolean;
  giveItemId?: string;
  flag?: string;
}

import npcMage from "../assets/sprites/npc-mage.svg";
import npcSmith from "../assets/sprites/npc-smith.svg";
import npcSage from "../assets/sprites/npc-sage.svg";
import npcMerchant from "../assets/sprites/npc-merchant.svg";
import npcGuard from "../assets/sprites/npc-guard.svg";
import npcInnkeeper from "../assets/sprites/npc-innkeeper.svg";
import npcChild from "../assets/sprites/npc-child.svg";
import npcHunter from "../assets/sprites/npc-hunter.svg";
import npcElf from "../assets/sprites/npc-elf.svg";
import npcSailor from "../assets/sprites/npc-sailor.svg";
import npcCultist from "../assets/sprites/npc-cultist.svg";
import npcArchmage from "../assets/sprites/npc-archmage.svg";
import npcWarden from "../assets/sprites/npc-warden.svg";
import npcCaptain from "../assets/sprites/npc-captain.svg";

export const npcs: Npc[] = [
  {
    id: "town-mage",
    name: "Eldra",
    x: 7,
    y: 3,
    map: "town",
    sprite: npcMage,
    lines: [
      "The blight stirs in the old ruins to the east.",
      "Sword beats prayer, prayer beats magic, magic beats sword."
    ]
  },
  {
    id: "town-archmage",
    name: "Archmage Selene",
    x: 11,
    y: 2,
    map: "town",
    sprite: npcArchmage,
    important: true,
    giveItemId: "forestSigil",
    flag: "gotForestSigil",
    lines: [
      "You seek the glade? Take this sigil.",
      "The forest gate will answer to its mark."
    ]
  },
  {
    id: "town-smith",
    name: "Brannik",
    x: 10,
    y: 5,
    map: "town",
    sprite: npcSmith,
    lines: [
      "Equip gear in the field. It boosts your element stats.",
      "Roads lead to the harbor and the hidden glade."
    ]
  },
  {
    id: "town-sage",
    name: "Sora",
    x: 13,
    y: 3,
    map: "town",
    sprite: npcSage,
    lines: [
      "Healing springs restore you. Seek the blue + tiles.",
      "The forest gate is concealed in the northern grass."
    ]
  },
  {
    id: "town-merchant",
    name: "Vell",
    x: 9,
    y: 6,
    map: "town",
    sprite: npcMerchant,
    lines: [
      "Defeat each foe once to clear the land.",
      "The farther you roam, the stronger they grow."
    ]
  },
  {
    id: "town-guard",
    name: "Rook",
    x: 14,
    y: 4,
    map: "town",
    sprite: npcGuard,
    lines: [
      "Keep your weapon ready. The wilds are restless.",
      "The harbor to the south is still safe."
    ]
  },
  {
    id: "town-innkeeper",
    name: "Mara",
    x: 12,
    y: 7,
    map: "town",
    sprite: npcInnkeeper,
    lines: [
      "Rest here before you head into the dark.",
      "Rumor says the ruins breathe at night."
    ]
  },
  {
    id: "town-child",
    name: "Pip",
    x: 8,
    y: 7,
    map: "town",
    sprite: npcChild,
    lines: [
      "I saw lights in the forest!",
      "Mom says don't go past the river."
    ]
  },
  {
    id: "town-hunter",
    name: "Ilen",
    x: 16,
    y: 6,
    map: "town",
    sprite: npcHunter,
    lines: [
      "Tracks point toward the old road east.",
      "Elves guard their glade. Tread lightly."
    ]
  },
  {
    id: "forest-elf",
    name: "Liora",
    x: 13,
    y: 7,
    map: "forest",
    sprite: npcElf,
    lines: [
      "This grove remembers before the blight.",
      "We watch the gate for those with pure intent."
    ]
  },
  {
    id: "forest-warden",
    name: "Warden Ael",
    x: 16,
    y: 11,
    map: "forest",
    sprite: npcWarden,
    important: true,
    giveItemId: "harborPass",
    flag: "gotHarborPass",
    lines: [
      "Our paths cross. Take this pass for the bridge.",
      "The harbor's captain will be waiting."
    ]
  },
  {
    id: "harbor-sailor",
    name: "Jax",
    x: 10,
    y: 8,
    map: "harbor",
    sprite: npcSailor,
    lines: [
      "Storms off the coast grow worse each week.",
      "Supplies still make it through, barely."
    ]
  },
  {
    id: "harbor-captain",
    name: "Captain Brine",
    x: 12,
    y: 7,
    map: "harbor",
    sprite: npcCaptain,
    important: true,
    giveItemId: "ruinsSeal",
    flag: "gotRuinsSeal",
    lines: [
      "Take this seal. It breaks the ruin gate lock.",
      "End the blight for us all."
    ]
  },
  {
    id: "ruins-cultist",
    name: "Ashen One",
    x: 12,
    y: 8,
    map: "ruins",
    sprite: npcCultist,
    lines: [
      "The old king sleeps beneath broken stone.",
      "Turn back. The dark does not forget."
    ]
  }
];
