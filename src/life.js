export const CELL_SIZE = 10;
export const COLS = 70;
export const ROWS = 40;
export const TICK_MS = 150;

export const ALIVE_COLOR = "#fde047";
export const DEAD_COLOR = "#1e293b";

export function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function nextGeneration(grid) {
  const next = createGrid();

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
      } else if (!alive && neighbors === 3) {
        next[row][col] = 1; // is born
      }
      // everything else stays 0
    }
  }

  return next;
}

const LETTERS = {
  Y: [
    [0, 0], [0, 6], [1, 1], [1, 5], [2, 2], [2, 4], [3, 3], [4, 3], [5, 3],
  ],
  E: [
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 0],
    [2, 0], [2, 1], [2, 2], [2, 3],
    [3, 0],
    [4, 0],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4],
  ],
  L: [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [5, 0], [5, 1], [5, 2], [5, 3], [5, 4],
  ],
  O: [
    [0, 1], [0, 2], [0, 3],
    [1, 0], [1, 4],
    [2, 0], [2, 4],
    [3, 0], [3, 4],
    [4, 0], [4, 4],
    [5, 1], [5, 2], [5, 3],
  ],
  W: [
    [0, 0], [0, 6],
    [1, 0], [1, 6],
    [2, 0], [2, 3], [2, 6],
    [3, 0], [3, 2], [3, 4], [3, 6],
    [4, 0], [4, 2], [4, 4], [4, 6],
    [5, 1], [5, 5],
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
