export const CELL_SIZE = 10;
export const COLS = 70;
export const ROWS = 40;

export const DEAD_COLOR = "#101827";

export const PATTERNS = [
  {
    id: "yellow",
    name: "YELLOW",
    description:
      "A word-shaped seed. Watch it evolve into something unexpected.",
  },
  {
    id: "glider",
    name: "Glider",
    description: "A tiny spaceship that travels diagonally across the grid.",
  },
  {
    id: "pulsar",
    name: "Pulsar",
    description:
      "A striking period-3 oscillator that pulses every three generations.",
  },
  {
    id: "gosper",
    name: "Glider gun",
    description:
      "The first known pattern to generate an endless stream of gliders.",
  },
];

export function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function advanceGeneration(grid, ages) {
  const next = createGrid();
  const nextAges = createGrid();
  let births = 0;
  let deaths = 0;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let neighbors = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) continue;
          const neighborRow = (row + rowOffset + ROWS) % ROWS;
          const neighborCol = (col + colOffset + COLS) % COLS;
          neighbors += grid[neighborRow][neighborCol];
        }
      }

      const alive = grid[row][col] === 1;
      if (alive && (neighbors === 2 || neighbors === 3)) {
        next[row][col] = 1; // survives
        nextAges[row][col] = Math.min((ages?.[row]?.[col] ?? 0) + 1, 24);
      } else if (!alive && neighbors === 3) {
        next[row][col] = 1; // is born
        nextAges[row][col] = 1;
        births++;
      } else if (alive) {
        deaths++;
      }
      // everything else stays 0
    }
  }

  return { grid: next, ages: nextAges, births, deaths };
}

export function nextGeneration(grid) {
  return advanceGeneration(grid).grid;
}

export function createAges(grid) {
  return grid.map((row) => row.map((cell) => (cell ? 1 : 0)));
}

export function randomGrid(density = 0.28) {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => (Math.random() < density ? 1 : 0)),
  );
}

const GLIDER = [
  [0, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

const PULSAR = [
  ...[2, 3, 4, 8, 9, 10].flatMap((row) =>
    [0, 5, 7, 12].map((col) => [row, col]),
  ),
  ...[0, 5, 7, 12].flatMap((row) =>
    [2, 3, 4, 8, 9, 10].map((col) => [row, col]),
  ),
];

const GOSPER_GLIDER_GUN = [
  [0, 24],
  [1, 22],
  [1, 24],
  [2, 12],
  [2, 13],
  [2, 20],
  [2, 21],
  [2, 34],
  [2, 35],
  [3, 11],
  [3, 15],
  [3, 20],
  [3, 21],
  [3, 34],
  [3, 35],
  [4, 0],
  [4, 1],
  [4, 10],
  [4, 16],
  [4, 20],
  [4, 21],
  [5, 0],
  [5, 1],
  [5, 10],
  [5, 14],
  [5, 16],
  [5, 17],
  [5, 22],
  [5, 24],
  [6, 10],
  [6, 16],
  [6, 24],
  [7, 11],
  [7, 15],
  [8, 12],
  [8, 13],
];

export function createPattern(id) {
  if (id === "yellow") return spellWord("YELLOW");

  const grid = createGrid();
  const cells =
    id === "glider" ? GLIDER : id === "pulsar" ? PULSAR : GOSPER_GLIDER_GUN;
  const height = Math.max(...cells.map(([row]) => row)) + 1;
  const width = Math.max(...cells.map(([, col]) => col)) + 1;
  const startRow = Math.floor((ROWS - height) / 2);
  const startCol = Math.floor((COLS - width) / 2);

  for (const [row, col] of cells) {
    grid[startRow + row][startCol + col] = 1;
  }

  return grid;
}

const LETTERS = {
  Y: [
    [0, 0],
    [0, 6],
    [1, 1],
    [1, 5],
    [2, 2],
    [2, 4],
    [3, 3],
    [4, 3],
    [5, 3],
  ],
  E: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 0],
    [4, 0],
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
  ],
  L: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [5, 1],
    [5, 2],
    [5, 3],
    [5, 4],
  ],
  O: [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
    [1, 4],
    [2, 0],
    [2, 4],
    [3, 0],
    [3, 4],
    [4, 0],
    [4, 4],
    [5, 1],
    [5, 2],
    [5, 3],
  ],
  W: [
    [0, 0],
    [0, 6],
    [1, 0],
    [1, 6],
    [2, 0],
    [2, 3],
    [2, 6],
    [3, 0],
    [3, 2],
    [3, 4],
    [3, 6],
    [4, 0],
    [4, 2],
    [4, 4],
    [4, 6],
    [5, 1],
    [5, 5],
  ],
};

const START_ROW = 16;
const START_COL = 8;
const LETTER_SPACING = 9;

export function spellWord(word) {
  const grid = createGrid();
  let startCol = START_COL;

  for (const letter of word) {
    for (const [rowOffset, colOffset] of LETTERS[letter]) {
      grid[START_ROW + rowOffset][startCol + colOffset] = 1;
    }
    startCol += LETTER_SPACING;
  }

  return grid;
}

export function countLiveCells(grid) {
  return grid.reduce((total, row) => total + row.reduce((a, b) => a + b, 0), 0);
}
