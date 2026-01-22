export type TileType = "G" | "R" | "W" | "M" | "H" | "B" | "F" | "T" | "E";

export const worldWidth = 24;
export const worldHeight = 18;

const createFieldMap = () => {
  const map: TileType[][] = Array.from({ length: worldHeight }, () =>
    Array.from({ length: worldWidth }, () => "G")
  );

  for (let y = 0; y < worldHeight; y += 1) {
    for (let x = 0; x < worldWidth; x += 1) {
      if (x === 0 || y === 0 || x === worldWidth - 1 || y === worldHeight - 1) {
        map[y][x] = "M";
      }
    }
  }

  for (let y = 12; y <= 16; y += 1) {
    for (let x = 1; x <= 6; x += 1) {
      map[y][x] = "W";
    }
  }

  map[4][5] = "T";

  map[5][4] = "H";
  map[14][18] = "H";
  map[10][9] = "H";

  for (let y = 2; y <= 6; y += 1) {
    for (let x = 17; x <= 22; x += 1) {
      map[y][x] = "M";
    }
  }

  for (let y = 1; y <= 16; y += 1) {
    map[y][11] = "R";
  }

  for (let x = 3; x <= 20; x += 1) {
    map[8][x] = "R";
  }

  return map;
};

const createTownMap = () => {
  const map: TileType[][] = Array.from({ length: worldHeight }, () =>
    Array.from({ length: worldWidth }, () => "G")
  );
  for (let y = 0; y < worldHeight; y += 1) {
    for (let x = 0; x < worldWidth; x += 1) {
      if (x === 0 || y === 0 || x === worldWidth - 1 || y === worldHeight - 1) {
        map[y][x] = "M";
      }
    }
  }
  for (let y = 2; y <= 8; y += 1) {
    for (let x = 6; x <= 14; x += 1) {
      map[y][x] = "R";
    }
  }
  map[3][8] = "B";
  map[3][12] = "B";
  map[6][8] = "B";
  map[6][12] = "B";
  for (let y = 2; y <= 4; y += 1) {
    for (let x = 15; x <= 17; x += 1) {
      map[y][x] = "F";
    }
  }
  map[7][10] = "E";
  return map;
};

export const fieldMap = createFieldMap();
export const townMap = createTownMap();

export const getTileAt = (
  map: TileType[][],
  x: number,
  y: number
): TileType => {
  if (x < 0 || y < 0 || x >= worldWidth || y >= worldHeight) return "M";
  return map[y][x];
};

export const isPassable = (tile: TileType) =>
  tile !== "W" && tile !== "M" && tile !== "B";
