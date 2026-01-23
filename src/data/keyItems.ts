export interface KeyItem {
  id: string;
  name: string;
  description: string;
}

export const keyItems: KeyItem[] = [
  {
    id: "forestSigil",
    name: "Forest Sigil",
    description: "Opens the hidden glade gate."
  },
  {
    id: "harborPass",
    name: "Harbor Pass",
    description: "Allows passage over the old bridge."
  },
  {
    id: "ruinsSeal",
    name: "Ruins Seal",
    description: "Breaks the lock on the ruins gate."
  }
];
