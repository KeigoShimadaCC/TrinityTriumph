export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const pickWeighted = <T>(
  items: Array<{ item: T; weight: number }>
): T => {
  const total = items.reduce((sum, entry) => sum + entry.weight, 0);
  const roll = Math.random() * total;
  let cursor = 0;
  for (const entry of items) {
    cursor += entry.weight;
    if (roll <= cursor) return entry.item;
  }
  return items[items.length - 1].item;
};
