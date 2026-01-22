export type TileType = "G" | "R" | "W" | "M" | "H" | "B" | "F" | "T" | "E" | "N" | "U" | "D" | "C";

export const worldWidth = 36;
export const worldHeight = 24;

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
  map[6][18] = "N";
  map[18][28] = "U";
  map[3][30] = "D";

  map[5][4] = "H";
  map[14][18] = "H";
  map[10][9] = "H";

  for (let x = 2; x <= 33; x += 1) {
    map[14][x] = "W";
  }
  for (let y = 6; y <= 20; y += 1) {
    map[y][24] = "W";
  }
  map[14][24] = "R";

  for (let y = 2; y <= 7; y += 1) {
    for (let x = 26; x <= 34; x += 1) {
      map[y][x] = "M";
    }
  }
  for (let y = 16; y <= 22; y += 1) {
    for (let x = 2; x <= 8; x += 1) {
      map[y][x] = "M";
    }
  }

  for (let y = 1; y <= 22; y += 1) {
    map[y][12] = "R";
  }
  for (let x = 3; x <= 32; x += 1) {
    map[8][x] = "R";
  }
  for (let x = 10; x <= 22; x += 1) {
    map[18][x] = "R";
  }

  for (let y = 5; y <= 9; y += 1) {
    for (let x = 16; x <= 20; x += 1) {
      map[y][x] = "G";
    }
  }

  for (let y = 2; y <= 6; y += 1) {
    for (let x = 17; x <= 22; x += 1) {
      map[y][x] = "M";
    }
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
  for (let y = 2; y <= 9; y += 1) {
    for (let x = 6; x <= 16; x += 1) {
      map[y][x] = "R";
    }
  }
  map[3][8] = "B";
  map[3][12] = "B";
  map[3][15] = "B";
  map[6][8] = "B";
  map[6][12] = "B";
  map[6][15] = "B";
  for (let y = 2; y <= 4; y += 1) {
    for (let x = 18; x <= 20; x += 1) {
      map[y][x] = "F";
    }
  }
  map[7][11] = "E";
  return map;
};

const createForestMap = () => {
  const map: TileType[][] = Array.from({ length: worldHeight }, () =>
    Array.from({ length: worldWidth }, () => "G")
  );
  for (let y = 0; y < worldHeight; y += 1) {
    for (let x = 0; x < worldWidth; x += 1) {
      if (x === 0 || y === 0 || x === worldWidth - 1 || y === worldHeight - 1) {
        map[y][x] = "C";
      }
    }
  }
  for (let y = 3; y <= 12; y += 1) {
    for (let x = 3; x <= 10; x += 1) {
      map[y][x] = "C";
    }
  }
  for (let y = 5; y <= 9; y += 1) {
    for (let x = 20; x <= 30; x += 1) {
      map[y][x] = "C";
    }
  }
  for (let y = 10; y <= 16; y += 1) {
    for (let x = 12; x <= 16; x += 1) {
      map[y][x] = "C";
    }
  }
  map[6][14] = "R";
  map[7][14] = "R";
  map[8][14] = "R";
  map[9][14] = "R";
  map[12][18] = "H";
  map[15][14] = "E";
  return map;
};

const createHarborMap = () => {
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
  for (let y = 10; y <= 20; y += 1) {
    for (let x = 2; x <= 18; x += 1) {
      map[y][x] = "W";
    }
  }
  for (let y = 6; y <= 9; y += 1) {
    for (let x = 6; x <= 16; x += 1) {
      map[y][x] = "R";
    }
  }
  map[7][8] = "B";
  map[7][12] = "B";
  map[8][10] = "B";
  map[9][12] = "B";
  map[9][8] = "B";
  map[8][18] = "E";
  return map;
};

const createRuinsMap = () => {
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
  for (let y = 3; y <= 9; y += 1) {
    for (let x = 6; x <= 18; x += 1) {
      map[y][x] = "R";
    }
  }
  map[4][8] = "B";
  map[4][12] = "B";
  map[4][16] = "B";
  map[8][10] = "B";
  map[8][14] = "B";
  map[12][16] = "H";
  map[10][12] = "E";
  return map;
};

export const fieldMap = createFieldMap();
export const townMap = createTownMap();
export const forestMap = createForestMap();
export const harborMap = createHarborMap();
export const ruinsMap = createRuinsMap();

export const getTileAt = (
  map: TileType[][],
  x: number,
  y: number
): TileType => {
  if (x < 0 || y < 0 || x >= worldWidth || y >= worldHeight) return "M";
  return map[y][x];
};

export const isPassable = (tile: TileType) =>
  tile !== "W" && tile !== "M" && tile !== "B" && tile !== "C";
