export type TileType = "G" | "R" | "W" | "M" | "H" | "B" | "F";

export const worldWidth = 24;
export const worldHeight = 18;

const createWorldMap = () => {
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

  for (let y = 2; y <= 6; y += 1) {
    for (let x = 7; x <= 13; x += 1) {
      map[y][x] = "R";
    }
  }
  map[3][8] = "B";
  map[3][12] = "B";
  map[5][8] = "B";
  map[5][12] = "B";
  for (let y = 2; y <= 4; y += 1) {
    for (let x = 14; x <= 16; x += 1) {
      map[y][x] = "F";
    }
  }

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

export const worldMap = createWorldMap();

export const getTileAt = (x: number, y: number): TileType => {
  if (x < 0 || y < 0 || x >= worldWidth || y >= worldHeight) return "M";
  return worldMap[y][x];
};

export const isPassable = (tile: TileType) => tile !== "W" && tile !== "M" && tile !== "B";
